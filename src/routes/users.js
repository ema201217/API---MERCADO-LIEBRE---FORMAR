// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Controller Require ************
const { update, remove, image } = require("../controllers/usersController");
const {
  checkToken,
  checkPermission,
  preventAdminSelfRemoval,
} = require("../middlewares");

router

  /* UPDATE USER */
  .patch("/", checkToken, checkPermission, update)

  /* DELETE USER */
  .delete("/:id?", checkToken, checkPermission, preventAdminSelfRemoval, remove)

  /* PREVIEW IMAGE */
  .get("/image/:img", checkToken, image);

module.exports = router;
