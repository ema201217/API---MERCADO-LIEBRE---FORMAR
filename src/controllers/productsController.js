const db = require("../database/models");
const path = require("path");
const { Op, literal, col, fn } = require("sequelize");

const literalQueryUrlImage = (req, field, alias) => {
  const urlImage = (req) => `${req.get("host")}/products/image/`;
  /* field = campo */
  return [ literal(`CONCAT( SUBSTRING('${urlImage(req)}',1),SUBSTRING( ${field}, 1 ))`), alias ];
};

const controller = {
  image: (req, res) => {
    return res.sendFile(
      path.join(__dirname, "../../public/images/products", req.params.img)
    );
  },

  // Root - Show all products
  all: (req, res) => {
    // return res.json({url:req.get('host')})
    // Do the magic
    const { limit, offset, sales, newest } = req.query;

    /* OPTIONS --> PROPERTIES DEFAULT */
    let options = {
      limit: !isNaN(+limit) ? +limit : 16,
      offset: !isNaN(+offset) ? +offset : 0,
      // include: [ "images", "category"]
			attributes:{
				exclude:['createdAt','updatedAt','deletedAt']
			},
      include: [
        {
          association: "images",
          attributes: {
            include: [
              literalQueryUrlImage(req,'images.file','url'),
            ],
						exclude:['createdAt','updatedAt','productId','id']
          },
        },
        {
          association: "category",
					attributes: {
						exclude: ['createdAt','updatedAt','deletedAt']
					}
        },
      ],
    };

    /* OPTIONS -> IS SALES */
    const optionsSales = {
      ...options,
      where: {
        discount: {
          [Op.gt]: 10,
        },
      },
    };

    /* OPTIONS -> NEWEST */
    const optionsNewest = {
      ...options,
      order: [["createdAt", "DESC"]],
    };

    if (!!sales && !!newest) {
      /* 400: «Mala petición». El servidor no puede devolver una respuesta debido a un error del cliente. Vea nuestra guía para resolver este error. */
      throw new Error('"newest" and "sales" cannot be used at the same time');
    } else if (!!sales) {
      options = optionsSales;
    } else if (!!newest) {
      options = optionsNewest;
    }

    db.Product.findAndCountAll(options)
      .then(({ count, rows: products }) => {
        /* ESTADO 200 -> «Todo está bien» Este es el código que se entrega cuando una página web o recurso actúa exactamente como se espera. */
        res.status(200).json({
          meta: {
            ok: true,
            status: 200,
          },
          data: {
            total: count,
            products,
          },
        });
      })

      .catch((err) => {
        /* Error 500 -> «Hubo un error en el servidor y la solicitud no pudo ser completada» */
        res.status(400).json({
          ok: false,
          status: err.status,
          msg: err,
        });
      });

  },

  // Detail - Detail from one product
  detail: (req, res) => {
    // Do the magic
    db.Product.findByPk(req.params.id, {
      include: ["images"],
    })
      .then((product) =>
        res.render("detail", {
          product,
          toThousand,
        })
      )
      .catch((error) => console.log(error));
  },

  // Create - Form to create
  create: (req, res) => {
    // Do the magic
    db.Category.findAll({
      attributes: ["id", "name"],
      order: ["name"],
    })
      .then((categories) => {
        return res.render("product-create-form", {
          categories,
        });
      })
      .catch((error) => console.log(error));
  },

  // Create -  Method to store
  store: (req, res) => {
    // Do the magic
    db.Product.create({
      ...req.body,
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    })
      .then((product) => {
        if (req.files.length) {
          let images = req.files.map(({ filename }) => {
            return {
              file: filename,
              productId: product.id,
            };
          });
          db.Image.bulkCreate(images, {
            validate: true,
          }).then((result) => console.log(result));
        }
        return res.redirect("/products");
      })
      .catch((error) => console(error));
  },

  // Update - Form to edit
  edit: (req, res) => {
    // Do the magic
    let categories = db.Category.findAll({
      attributes: ["id", "name"],
      order: ["name"],
    });
    let product = db.Product.findByPk(req.params.id);

    Promise.all([categories, product])
      .then(([categories, product]) => {
        return res.render("product-edit-form", {
          product,
          categories,
        });
      })
      .catch((error) => console.log(error));
  },
  // Update - Method to update
  update: (req, res) => {
    // Do the magic
    db.Product.update(
      {
        ...req.body,
        name: req.body.name.trim(),
        description: req.body.description.trim(),
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then(() => res.redirect("/products/detail/" + req.params.id))
      .catch((error) => console.log(error));
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    // Do the magic

    db.Product.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(() => res.redirect("/products"))
      .catch((error) => console.log(error));
  },
};

module.exports = controller;
