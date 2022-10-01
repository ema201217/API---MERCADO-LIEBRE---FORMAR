// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Middlewares Require ************
const { uploadImageProduct } = require("../middlewares/uploadFiles");

// ************ Controller Require ************
const {
  create,
  store,
  detail,
  edit,
  update,
  destroy,
  all,
  image
} = require("../controllers/productsController");

/* /products */

/*** GET ALL PRODUCTS ***/
/* queries limit(number),offset(number),isSales(boolean),newest(boolean) */
router.get("/", all);

/* RENDER IMAGES DE PRODUCTS */
router.get("/image/:img", image)

/*** CREATE ONE PRODUCT ***/
router.get("/create", create);
router.post("/store", uploadImageProduct.array("images"), store);


/*** GET ONE PRODUCT ***/
router.get("/detail/:id/", detail);

/*** EDIT ONE PRODUCT ***/
router.get("/edit/:id", edit);
router.put("/update/:id", update);

/*** DELETE ONE PRODUCT***/
router.delete("/delete/:id", destroy);

module.exports = router;
