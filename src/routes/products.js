// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Middlewares Require ************
const { uploadImageProduct } = require("../middlewares/uploadFiles");

// ************ Controller Require ************
const {
  store,
  detail,
  update,
  destroy,
  all,
  image
} = require("../controllers/productsController");

/* /products */

/*** GET ALL PRODUCTS ***/
/* queries limit(number),offset(number),isSales(boolean),newest(boolean) */
router.get("/", all);

/*** GET ONE PRODUCT ***/
router.get("/:id", detail);

/* RENDER IMAGES DE PRODUCTS */
router.get("/image/:img", image)

/*** STORAGE PRODUCT ***/
router.post("/", uploadImageProduct.array("images"), store);

/*** UPDATE PRODUCT ***/
router.put("/:id",uploadImageProduct.array("images"), update);




/*** DELETE PRODUCT ***/
router.delete("/:id", destroy);

module.exports = router;
