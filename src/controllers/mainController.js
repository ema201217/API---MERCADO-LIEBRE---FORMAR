const db = require("../database/models");
const { Op } = require("sequelize");
const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const path = require('path')
const controller = {
  
  search: (req, res) => {
    // Do the magic
    const { keywords } = req.query;

    db.Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: keywords,
            },
          },
          {
            description: {
              [Op.substring]: keywords,
            },
          },
        ],
      },
      include: ["images"],
    })
      .then((products) => {
        return res.render("results", {
          products,
          keywords,
          toThousand,
        });
      })
      .catch((error) => console.log(error));
  },
};

module.exports = controller;