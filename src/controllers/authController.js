const db = require("../database/models");
const { hashSync, compareSync } = require("bcryptjs");
const { createToken, sendJsonError, literalQueryUrlImage } = require("../helpers");

module.exports = {
  /* REGISTER CONTROLLER */
  register: async (req, res) => {
    try {
      const { name, surname, email, password } = req.body;
      const { rolId } = await db.User.create({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        password: hashSync(password.trim()),
        avatar: req.file ? req.file.filename : "default.png",
        rolId: 2,
      });
      const token = await createToken({ rolId, email });

      return res.status(201).json({
        ok: true,
        status: 201,
        token,
      });
    } catch (err) {
      sendJsonError(err, res);
    }
  },

  /* LOGIN CONTROLLER */
  login: async (req, res) => {
    try {
      /* CONSTANTS */
      const { email, password } = req.body;
      const user = await db.User.findOne({ where: { email } });
      const { rolId } = user;
      const token = await createToken({ rolId, email });

      if (!user) {
        return sendJsonError("El usuario no existe", res, "error");
      }

      if (!compareSync(password, user.password)) {
        return sendJsonError("Credenciales invalidas", res, "error");
      }

      return res.status(200).json({
        ok: true,
        status: 200,
        token,
      });
    } catch (err) {
      sendJsonError(err, res);
    }
  },

  /* GET USER AUTHENTICATED */
  getUserAuthenticated: async (req, res) => {
    try {
      const { email } = req.userToken;
      const data = await db.User.findOne({
        where: { email },
        attributes: { 
          exclude: ["password"], 
          include: [literalQueryUrlImage(req,"avatar","urlAvatar","/users/image/")]
        },
      });

      return res.status(200).json({ ok: true, status: 200, data });

    } catch (error) {

      sendJsonError("Error en el servidor", res, "error", 500);
    }
  },
  
};
