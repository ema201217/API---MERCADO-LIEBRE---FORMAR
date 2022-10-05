const db = require("../database/models");
const path = require("path");
const { Op } = require("sequelize");
const fs = require("fs");

const { literalQueryUrlImage, sendJsonError } = require("../helpers");

const controller = {
  // API -> GET IMAGE IN VIEW
  image: (req, res) => {
    return res.sendFile(
      path.join(__dirname, `../../public/images/products`, req.params.img)
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

    if (!!+sales && !!+newest) {
      /* 400: «Mala petición». El servidor no puede devolver una respuesta debido a un error del cliente. Vea nuestra guía para resolver este error. */
      throw new Error('"newest" and "sales" cannot be used at the same time');
    } else if (!!+sales) {
      options = optionsSales;
    } else if (!!+newest) {
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

      .catch((err) => {
        console.log("all start");
        console.log(err);
        console.log("all end");
        sendJsonError(err, res)
      });
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

      .catch((err) => {
        console.log("detail start");
        console.log(err);
        console.log("detail end");
        sendJsonError(err, res)
      });
  },

  // API -> STORAGE PRODUCT
  store: (req, res) => {
    const { name, description, price, discount, categoryId } = req.body;

    db.Product.create({
      name: name?.trim(),
      description: description?.trim(),
      price,
      discount,
      categoryId,
    })

      .then((product) => {
        if (req.files?.length) {
          const images = req.files.map(({ filename }) => {
            return {
              file: filename,
              productId: product.id,
            };
          });

          db.Image.bulkCreate(images).catch(() => {
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

      .catch((err) => {
        /* Esta validación de archivos "images" se origina desde Multer en la carpeta de middlewares */
        if (req.fileValidationError && err.errors.length) {
          err.errors = [
            ...err.errors,
            { path: "images", message: req.fileValidationError },
          ];
        }

        /* REMOVE FILES IMAGES */
        if (req.files && err.errors?.length) {
          req.files.map((file) =>
            fs.unlinkSync(
              path.join(
                __dirname,
                `../../public/images/products/${file.filename}`
              )
            )
          );
        }
        console.log("store start");
        console.log(err);
        console.log("store end");
        sendJsonError(err, res);
      });
  },

  // API -> UPDATE PRODUCT
  update: (req, res) => {
    const { name, description, price, discount, categoryId } = req.body;

    // Do the magic
    db.Product.update(
      {
        name: name?.trim(),
        description: description?.trim(),
        price,
        discount,
        categoryId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then(() => {
        if (req.files?.length) {
          const images = req.files.map((img) => ({
            file: img.filename,
            productId: +req.params.id,
          }));

          db.Image.bulkCreate(images);
        }
        db.Product.findByPk(req.params.id, {
          include: ["images"],
        }).then((data) => {
          return res.status(200).json({
            ok: true,
            status: 200,
            data,
          });
        });
      })

      .catch((err) => {
        /* Esta validación de archivos "images" se origina desde Multer en la carpeta de middlewares */
        if (req.fileValidationError && err.errors?.length) {
          err.errors = [
            ...err.errors,
            { path: "images", message: req.fileValidationError },
          ];
        }

        /* REMOVE FILES IMAGES */
        if (req.files && err.errors?.length) {
          req.files?.map((file) =>
            fs.unlinkSync(
              path.join(
                __dirname,
                `../../public/images/products/${file.filename}`
              )
            )
          );
        }

        console.log("update start");
        console.log(err);
        console.log("update end");
        sendJsonError(err, res);
      });
  },

  // API -> DELETE PRODUCT
  destroy: (req, res) => {
    // Do the magic
    const { id } = req.params;

    db.Product.destroy({
      where: {
        id,
      },
    })
      .then(() => {
        db.Image.destroy({
          where: {
            [Op.and]: [{ productId: id }, { deletedAt: { [Op.is]: null } }],
          },
        }).then(() => {
          return res.status(200).json({
            ok: true,
            status: 200,
          });
        });
      })
      .catch((err) => {
        console.log("destroy start");
        console.log(err);
        console.log("destroy end");
        sendJsonError(err, res)
      
      });
  },
};

module.exports = controller;
