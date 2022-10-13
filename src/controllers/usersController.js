const path = require("path");
const db = require("../database/models");
const { sendJsonError, literalQueryUrlImage } = require("../helpers");

module.exports = {
  // API -> GET IMAGE IN VIEW
  image: (req, res) => {
    return res.sendFile(
      path.join(__dirname, `../../public/images/avatars/`, req.params.img)
    );
  },

  update: async (req, res) => {
    const idUserToken = req.userToken.id; // lo obtenemos desde el middleware checkToken
    const options = {
      include: [
        {
          association: "addresses",
          /* Buscamos en la asociación la dirección que vamos a modificar en este caso la que esta activa por el usuario */
          /* where: { active: true }, */
          attributes: {
            exclude: ["createdAt", "deletedAt", "updatedAt", "userId"],
          },
        },
      ],
      attributes: {
        exclude: ["password", "deletedAt", "updatedAt"],
        include: [literalQueryUrlImage(req, "avatar", "avatar")],
      },
    };

    try {
      const { name, surname, street, city, province } = req.body;

      const user = await db.User.findByPk(idUserToken, options);

      /* Buscamos el indice de la dirección activa */
      const indexAddressActive = user.addresses.findIndex(
        (address) => address.active === true
      );

      const address = user.addresses[indexAddressActive];

      /* user */
      user.name = name || user.name;
      user.surname = surname || user.surname;
      user.avatar = req.file?.filename || user.avatar;

      /* address */
      address.street = street || address.street;
      address.city = city || address.city;
      address.province = province || address.province;

      await user.save();
      await address.save();

      return res.status(200).json({
        ok: true,
        status: 200,
        data: user
      });
    } catch (err) {
      return sendJsonError(err, res);
    }
  },

  remove: async (req, res) => {
    try {
      const idUser = req.params.id || req.userToken.id;

      const removeUser = await db.User.destroy({ where: { id: idUser } });
      const removeAddresses = await db.Address.destroy({
        where: { userId: idUser },
      });

      if (!removeUser || !removeAddresses) {
        return sendJsonError("Es probable que el usuario no exista", res, 404);
      }

      return res.status(200).json({
        ok: true,
        status: 200,
      });
      
    } catch (err) {
      sendJsonError(err, res);
    }
  },
};
