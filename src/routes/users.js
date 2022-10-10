// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Controller Require ************
const { update, remove, image } = require("../controllers/usersController");
const { checkToken, checkPermission } = require("../middlewares");

router

  /* UPDATE USER */
  .patch("/", checkToken, checkPermission, update)

  /* DELETE USER */
  .delete("/:id?", checkToken, checkPermission, remove)

  /* PREVIEW IMAGE */
  .get("/image/:img", image);

module.exports = router;
