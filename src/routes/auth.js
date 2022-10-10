// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Middleware Require ************
const { uploadImageAvatar } = require("../middlewares");

// ************ Controller Require ************
const { register, login, getUserAuthenticated } = require("../controllers/authController");
const { checkToken } = require("../middlewares/checkToken");


router
  /* POST REGISTER */
  .post("/register", uploadImageAvatar.single("avatar"), register)

  /* POST LOGIN */
  .post("/login", login)

  /* POST LOGIN */
  .get("/me/:token?",checkToken, getUserAuthenticated);

module.exports = router;
