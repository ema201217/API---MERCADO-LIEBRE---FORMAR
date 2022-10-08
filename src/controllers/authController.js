const db = require("../database/models");
const { compareSync } = require("bcryptjs");
const { createToken, sendJsonError,literalQueryUrlImage } = require("../helpers");
const { ROL_USER } = require("../constants");

module.exports = {
  /* REGISTER CONTROLLER */
  register: async (req, res) => {
    try {
      const { name, surname, email, password, street, city, province } =
        req.body;
      const { rolId, id } = await db.User.create({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        password: password.toString().trim(),
        avatar: req.file ? req.file.filename : "default.png",
        rolId: ROL_USER,
      })

      await db.Address.create({
        street: street || "",
        city: city || "",
        province: province || "",
        userId: id,
      });

      const token = await createToken({ rolId, id });

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

      if (!user) {
        return sendJsonError("El usuario no existe", res,404);
      }

      const { rolId, id } = user;
      const token = await createToken({ rolId, id });

      if (!compareSync(password, user.password)) {
        return sendJsonError("Credenciales invalidas", res,401);
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
    /* OPTIONS --> PROPERTIES DEFAULT */
    let options = {
      include: ["addresses", "rol"],
      attributes: {
        exclude: ["deletedAt","password"],
        include:[literalQueryUrlImage(req, "avatar", "url","users")] // users representa la ruta de la entidad donde vamos a visualizar la imagen  ejemplo /"users"/image/:img
      },
    };

    try {
      const { id } = req.userToken;
      const data = await db.User.findByPk(id,options);
      res.status(200).json({ ok: true, status: 200, data });
    } catch (error) {
      sendJsonError("Error en el servidor", res);
    }
  },
};
