const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images/products");
  },
  filename: (req, file, callback) => {
    callback(null, "product-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, callback) => {
  if (!/image\//.test(file.mimetype)) {
    req.fileValidationError = "Archivo invalido";
    return callback(null, false);
  }
  callback(null, true);
};

const uploadImageProduct = multer({
  storage,
  fileFilter,
});

module.exports = {
  uploadImageProduct,
};
