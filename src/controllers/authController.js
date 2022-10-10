const db = require("../database/models");
const { compareSync } = require("bcryptjs");
const { ROL_USER } = require("../constants");
const {
  createToken,
  sendJsonError,
  literalQueryUrlImage,
} = require("../helpers");

module.exports = {
  /* REGISTER CONTROLLER */
  register: async (req, res) => {
    const { name, surname, email, password, street, city, province } = req.body;
    try {
      /* Si el email o el pass no existe */
      if (!email || !password) {
        return sendJsonError("El email y la contraseña son requeridos", res);
      }

      /* Creamos el usuario */
      const { rolId, id } = await db.User.create({
        name: name?.trim(),
        surname: surname?.trim(),
        email: email.trim(),
        password: password.toString().trim(),
        avatar: req.file?.filename || "default.png",
        rolId: ROL_USER,
      });

      /* Creamos la dirección */
      await db.Address.create({
        street: street?.trim(),
        city: city?.trim(),
        province: province?.trim(),
        active: true,
        userId: id,
      });

      /* Creamos el Token */
      const token = await createToken({ rolId, id });

      /* Enviamos respuesta */
      return res.status(201).json({
        ok: true,
        status: 201,
        token,
      });
    } catch (err) {
      return sendJsonError(err, res);
    }
  },

  /* LOGIN CONTROLLER */
  login: async (req, res) => {
    try {
      /* CONSTANTS */
      const { email, password } = req.body;

      /* Si el email o el pass no existe */
      if (!email || !password) {
        return sendJsonError("El email y la contraseña son requeridos", res);
      }

      /* Buscamos el usuario por el email */
      const user = await db.User.findOne({ where: { email } });

      /* Si el usuario no existe */
      if (!user) {
        return sendJsonError("El usuario no existe", res, 404);
      }

      const { rolId, id, password: passwordHash } = user;

      /* Creamos el token */
      const token = await createToken({ rolId, id });

      /* Comparamos el password recibido y el que esta en la base de dato */
      if (!compareSync(password, passwordHash)) {
        return sendJsonError("Credenciales invalidas", res, 401);
      }

      /* Enviamos respuesta */
      return res.status(200).json({
        ok: true,
        status: 200,
        token,
        data: `${req.protocol}://${req.get("host")}/auth/me/${token}`,
      });
    } catch (err) {
      return sendJsonError(err, res);
    }
  },

  /* GET USER AUTHENTICATED */
  getUserAuthenticated: async (req, res) => {
    /* OPTIONS --> PROPERTIES DEFAULT */
    let options = {
      include: [
        {
          association: "addresses",
          attributes: {
            exclude: ["deletedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["deletedAt", "password"],
        include: [literalQueryUrlImage(req, "avatar", "avatar", "users")], // users representa la ruta de la entidad donde vamos a visualizar la imagen  ejemplo /"users"/image/:img
      },
    };

    try {
      const { id } = req.userToken;
      /* Buscamos el usuario con el id que nos trae dentro el token */
      const data = await db.User.findByPk(id, options);
      /* Enviamos respuesta */
      return res.status(200).json({ ok: true, status: 200, data });
    } catch (error) {
      return sendJsonError("Error en el servidor", res);
    }
  },
};
