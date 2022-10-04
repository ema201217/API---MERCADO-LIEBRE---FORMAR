// ************ Require's ************
const express = require("express");
const router = express.Router();

// ************ Controller Require ************
const { search } = require("../controllers/mainController");

/* RENDER IMAGES DE PRODUCTS */
router.get("/search", search);

module.exports = router;
