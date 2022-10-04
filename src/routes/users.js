// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const {update, logout, remove, image} = require('../controllers/usersController');

router

    /* UPDATE USER */
    .put('/',update)

    /* LOGOUT USER */
    .get('/logout',logout)

    /* DELETE USER */
    .delete('/',remove)

    /* PREVIEW IMAGE */
    .get("/image/:img", image)

module.exports = router;
