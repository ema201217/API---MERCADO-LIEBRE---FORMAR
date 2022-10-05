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
const { checkToken } = require("../middlewares/checkToken");

/* /products */

/*** GET ALL PRODUCTS ***/
/* queries limit(number),offset(number),isSales(boolean),newest(boolean) */
router

.get("/", all)

/*** GET ONE PRODUCT ***/
.get("/:id", detail)

/*** STORAGE PRODUCT ***/
.post("/",/* checkToken, */ uploadImageProduct.array("images"), store)
/* 
 *//*** UPDATE PRODUCT ***/
.put("/:id",/* checkToken, */uploadImageProduct.array("images"), update)

/*** DELETE PRODUCT ***/
.delete("/:id",/* checkToken, */ destroy)

/*** PREVIEW IMAGE ***/
.get("/image/:img", image)

module.exports = router;
