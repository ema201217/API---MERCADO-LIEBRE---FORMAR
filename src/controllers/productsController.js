const db = require("../database/models");
const path = require("path");
const { Op, literal } = require("sequelize");

const literalQueryUrlImage = (req, field, alias) => {
  const urlImage = (req) => `${req.get("host")}/products/image/`;
  /* field = campo */
  return [
    literal(
      `CONCAT( SUBSTRING('${urlImage(req)}',1),SUBSTRING( ${field}, 1 ))`
    ),
    alias,
  ];
};

const bailErrorField = (errMsg) => {
  const arrErrors = errMsg
	.replace(/\n?validation error:/ig, "") // reemplazamos el texto que nos envía por defecto sequelize
    .trim() // quitamos si existe espacios al final o al principio
    .split(","); //convertimo el string en un array buscando ","

  const indexError = arrErrors.length - 1;
  return arrErrors
};

const sendJsonError = ({status,message}, res) => {
  return res.status(status || 500).json({
    ok: false,
    status: status || 500,
    msg: bailErrorField(message),
		m:message
  });
};

const controller = {
  // API -> GET IMAGE IN VIEW
  image: (req, res) => {
    return res.sendFile(
      path.join(__dirname, "../../public/images/products", req.params.img)
    );
  },

  // API -> ALL PRODUCTS + QUERIES
  all: (req, res) => {
    // return res.json({url:req.get('host')})
    // Do the magic
    const { limit, offset, sales, newest } = req.query;

    /* OPTIONS --> PROPERTIES DEFAULT */
    let options = {
      limit: !isNaN(+limit) ? +limit : 16,
      offset: !isNaN(+offset) ? +offset : 0,
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
      include: [
        {
          association: "images",
          attributes: {
            include: [literalQueryUrlImage(req, "images.file", "url")],
            exclude: ["createdAt", "updatedAt", "productId", "id"],
          },
        },
        {
          association: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
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

      .then(({ count, rows: products }) =>
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
        })
      )

      .catch((err) => sendJsonError(err, res));
  },

  // API -> DETAIL PRODUCT
  detail: (req, res) => {
    /* OPTIONS --> PROPERTIES DEFAULT */
    let options = {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
      include: [
        {
          association: "images",
          attributes: {
            include: [literalQueryUrlImage(req, "images.file", "url")],
            exclude: ["createdAt", "updatedAt", "productId", "id"],
          },
        },
      ],
    };

    db.Product.findByPk(req.params.id, options)

      .then((data) =>
        res.status(200).json({
          meta: {
            ok: true,
            status: 200,
          },
          data,
        })
      )

      .catch((err) => sendJsonError(err, res));
  },

  // API -> STORAGE PRODUCT
  store: (req, res) => {
    const { name, description } = req.body;

    db.Product.create({
      ...req.body,
      name: name,
      description: description,
    },{validate: true})

      .then((product) => {
        if (req.files?.length) {
          let images = req.files.map(({ filename }) => {
            return {
              file: filename,
              productId: product.id,
            };
          });

          db.Image.bulkCreate(images,{validate: true}).catch(() => {
            throw new Error("Image not saved");
          });
        }

        Promise.resolve(product).then((data) => {
          /* 201: «Creado». El servidor ha cumplido con la petición del navegador y, como resultado, ha creado un nuevo recurso. */
          res.status(201).json({
            meta: {
              ok: true,
              status: 201,
            },
            data,
          });
        });
      })

      .catch((err) => sendJsonError(err, res));
  },

  // API -> UPDATE PRODUCT
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

  // API -> DELETE PRODUCT
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
