// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Controller Require ************
const { register, login, getUserAuthenticated } = require("../controllers/authController");
const { checkToken } = require("../middlewares/checkToken");
const { uploadImageAvatar } = require("../middlewares/uploadFiles");

router
  /* POST REGISTER */
  .post("/register", uploadImageAvatar.single("avatar"), register)

  /* POST LOGIN */
  .post("/login", login)

  /* POST LOGIN */
  .get("/me",checkToken, getUserAuthenticated);

module.exports = router;
