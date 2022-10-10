// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Middlewares Require ************
const { uploadImageProduct, checkPermission } = require("../middlewares");


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
/* queries: --> 
limit(number),
offset(number),
page(number)
sales(boolean),
sort(string)
sortBy(string) 
          <--
*/
router

.get("/", all)

/*** GET ONE PRODUCT ***/
.get("/:id", detail)

/*** STORAGE PRODUCT ***/
.post("/",checkToken,checkPermission, uploadImageProduct.array("images"), store)
/* 
 *//*** UPDATE PRODUCT ***/
.patch("/:id",checkToken, checkPermission, uploadImageProduct.array("images"), update)

/*** DELETE PRODUCT ***/
.delete("/:id", checkToken, checkPermission, destroy)

/*** PREVIEW IMAGE ***/
.get("/image/:img", image)

module.exports = router;
