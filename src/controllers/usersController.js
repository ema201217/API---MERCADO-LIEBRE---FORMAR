const path = require("path");
const db = require("../database/models");
const {} = require("sequelize");

module.exports = {
  // API -> GET IMAGE IN VIEW
  image: (req, res) => {
    return res.sendFile(
      path.join(__dirname, `../../public/images/avatars/`, req.params.img)
    );
  },

  update: async (req, res) => {
    const { name, surname, street, city, province } = req.body;
   /*  await db.User.beforeUpdate(
      (user, options) => {
        this.update(
          {
            name: name.trim() || user.name,
            surname: surname.trim() || user.surname,
            avatar: req.file ? req.file.filename : user.avatar,
            rolId: ROL_USER,
          },
          options
        );
      },
      {
        where: {
          id: req.userToken.id, // middleware checkToken
        },
      }
    );

    await db.Address.update(
      {
        street: street || "",
        city: city || "",
        province: province || "",
      },
      {
        where: {
          userId: req.userToken.id, // middleware checkToken
        },
      }
    ); */
  },

  logout: (req, res) => {},

  remove: (req, res) => {},
};
