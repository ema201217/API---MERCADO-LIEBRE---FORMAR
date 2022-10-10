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

  // API --> SEARCH PRODUCTS
  search: (req, res) => {},

  // API -> ALL PRODUCTS + QUERIES
  all: async (req, res) => {
    try {
      // Do the magic
      let {
        limit = 10,
        sales = 0,
        order = "ASC",
        offset = 0,
        sortBy = "name",
        page = 1,
        salesDiscount = 10,
      } = req.query;

      const queriesAvailable = {
        limit,
        order,
        sortBy,
        sales,
        salesDiscount,
      };
      /* ********************************************* */
      /* SORT BY Y ORDER */
      /* ********************************************* */
      const typesSort = [
        "name",
        "price",
        "discount",
        "description",
        "category",
        "newest",
      ];

      sortBy = typesSort.includes(sortBy) ? sortBy : "name";
      const orderQuery =
        sortBy === "category"
          ? [["category", "name", order]]
          : sortBy === "newest"
          ? [["createdAt", "desc"]]
          : [[sortBy, order]];

      /* ********************************************* */
      /* ********************************************* */

      /* Si el LIMIT es muy alto */
      limit = +limit > 20 ? 10 : +limit;

      /* OPTIONS --> PROPERTIES DEFAULT */
      let options = {
        limit: !isNaN(limit) ? limit : 16,
        offset: !isNaN(offset) ? +offset : 0,
        attributes: {
          exclude: ["updatedAt", "deletedAt"],
        },
        include: [
          {
            association: "images",
            attributes: {
              include: [literalQueryUrlImage(req, "images.file", "file")],
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
        order: orderQuery,
      };

      /* OPTIONS -> IS SALES */
      const optionsSales = {
        ...options,
        where: {
          discount: {
            [Op.gte]: salesDiscount,
          },
        },
      };

      /* ********************************************* */
      /* OFERTAS */
      /* ********************************************* */
      if (+sales || +salesDiscount !== 10) {
        options = optionsSales;
      }

      /* ********************************************* */
      /* ********************************************* */

      /* CONSULTA */
      const { count, rows: products } = await db.Product.findAndCountAll(
        options
      );

      /* ********************************************* */
      /* ********************************************* */
      /* PAGINATION */
      /* ********************************************* */
      /* ********************************************* */
      page = +page === 0 || isNaN(+page) ? 1 : +page;
      offset = page * limit;
      page -= 1;

      /* COMPROBAR SI EXISTE UNA PAGINA ANTERIOR O POSTERIOR */
      /* Si la pagina ingresada es mayor a cero y el offset menor o igual a la cantidad total de productos */
      const existPrev = page > 0 && offset <= count;
      const existNext = Math.floor(count / limit) > page;

      /* PAGINA ANTERIOR */
      let prev = null;
      let next = null;

      /* OFFSET PREV Y NEXT */
      const offsetPrev = offset - limit;
      const offsetNext = offset;

      let urlQueries = "";
      let queries = queriesAvailable;
      for (const key in queries) {
        urlQueries += `&${key}=${queries[key]}`;
      }

      /* SI HAY PAGINADO POSTERIOR */
      if (existNext) {
        next = `${req.protocol}://${req.get("host")}${req.baseUrl}?page=${page + 2}&offset=${offsetNext}${urlQueries}`;
      }

      /* SI EXISTE PAGINADO ANTERIOR O SI NO EXISTE EL PAGINADO POSTERIOR */
      if (existPrev || !existNext) {
        prev = `${req.protocol}://${req.get("host")}${
          req.baseUrl
        }?page=${page}&offset=${offsetPrev}${urlQueries}`;
      }

      /* ********************************************* */
      /* ********************************************* */
      /* ********************************************* */

      /* ESTADO 200 -> «Todo está bien» Este es el código que se entrega cuando una página web o recurso actúa exactamente como se espera. */
      return res.status(200).json({
        meta: {
          ok: true,
          status: 200,
        },
        data: {
          total: count,
          prev,
          next,
          products,
        },
      });
    } catch (err) {
      sendJsonError(err, res);
    }
  },

  // API -> DETAIL PRODUCT
  detail: async (req, res) => {
    /* OPTIONS --> PROPERTIES DEFAULT */
    let options = {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
      include: [
        {
          association: "images",
          attributes: {
            include: [literalQueryUrlImage(req, "file", "file")],
            exclude: ["createdAt", "updatedAt", "deletedAt", "productId", "id"],
          },
        },
      ],
    };

    try {
      const data = await db.Product.findByPk(req.params.id, options);
      return res.status(200).json({
        meta: {
          ok: true,
          status: 200,
        },
        data,
      });
    } catch (err) {
      sendJsonError(err, res);
    }
  },

  // API -> STORAGE PRODUCT
  store: async (req, res) => {
    try {
      const { name, description, price, discount, categoryId } = req.body;

      const { id } = await db.Product.create({
        name: name?.trim(),
        description: description?.trim(),
        price: +price,
        discount: +discount,
        categoryId: +categoryId,
      });

      let images = [{ productId: id }];
      if (req.files?.length) {
        images = req.files.map(({ filename }) => {
          return {
            file: filename,
            productId: id,
          };
        });
      }
      await db.Image.bulkCreate(images, { validator: true });

      /* Si existe un error en el tipo de archivo */
      if (req.fileValidationError) {
        throw {
          name: "sequelize",
          errors: [
            {
              path: "images",
              message: req.fileValidationError,
            },
          ],
        };
      }

      /* 201: «Creado». El servidor ha cumplido con la petición del navegador y, como resultado, ha creado un nuevo recurso. */
      return res.status(201).json({
        meta: {
          ok: true,
          status: 201,
        },
        url: `${req.protocol}://${req.get("host")}${req.baseUrl}/${id}`,
      });
    } catch (err) {
      /* Esta validación de archivos "images" se origina desde Multer en la carpeta de middlewares */

      /* REMOVE FILES IMAGES */
      if (req.files && err.errors?.length) {
        req.files.forEach((file) =>
          fs.unlinkSync(
            path.join(
              __dirname,
              `../../public/images/products/${file.filename}`
            )
          )
        );
      }

      sendJsonError(err, res);
    }
  },

  // API -> UPDATE PRODUCT
  update: async (req, res) => {
    const { name, description, price, discount, categoryId } = req.body;
    try {
      // Do the magic
      const product = await db.Product.findByPk(req.params.id, {
        include: [
          {
            association: "images",
            attributes: {
              include: [literalQueryUrlImage(req, "images.file", "file")],
            },
          },
        ],
      });
      product.name = name?.trim() || product.name;
      product.description = description?.trim() || product.description;
      product.price = price?.trim() || product.price;
      product.discount = discount?.trim() || product.discount;
      product.categoryId = +categoryId || product.categoryId;

      await product.save();

      if (req.files?.length) {
        const images = req.files.map((img) => ({
          file: img.filename,
          productId: +req.params.id,
        }));
        await db.Image.bulkCreate(images);
      }

      return res.status(200).json({
        meta: {
          ok: true,
          status: 200,
        },
        url: `${req.protocol}://${req.get("host")}${req.baseUrl}/${
          req.params.id
        }`,
      });
    } catch (err) {
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

      sendJsonError(err, res);
    }
  },

  // API -> DELETE PRODUCT
  destroy: async (req, res) => {
    // Do the magic
    const { id } = req.params;
    try {
      await db.Product.destroy({
        where: {
          id,
        },
      });

      await db.Image.destroy({
        where: {
          productId: id,
        },
      });

      return res.status(200).json({
        ok: true,
        status: 200,
      });
    } catch (err) {
      sendJsonError(err, res);
    }
  },
};

module.exports = controller;
