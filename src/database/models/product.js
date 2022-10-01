"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {



  class Product extends Model {

    static objectValidate(field, args, msg) {
      return {
        args,
        msg: JSON.stringify({[field]:msg}),
      };
    }

    static associate(models) {
      // define association here
      Product.hasMany(models.Image, {
        as: "images",
        foreignKey: "productId",
        onDelete: "cascade",
      });

      Product.belongsTo(models.Category, {
        as: "category",
        foreignKey: "categoryId",
      });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: Product.objectValidate('name',true, "Nombre requerido").,
          notEmpty: Product.objectValidate('name',true, "Nombre requerido"),
          lenValid(value) {
            if (value.length < 8) {
             throw JSON.stringify({name:"Longitud minima no alcanzada"})
            }
            if (value.length > 200) {
              throw JSON.stringify({name:"Longitud minima sobrepasada"})
            }
          },
        },
        
      },
      price: DataTypes.INTEGER,
      discount: DataTypes.INTEGER,
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: Product.objectValidate(true, "Nombre requerido"),
          notEmpty: Product.objectValidate(true, "Nombre requerido"),
          lenValid(value) {
            if (value.length < 8) {
              throw JSON.stringify({description:"Longitud minima no alcanzada"});
             }
             if (value.length > 200) {
              throw JSON.stringify({description:"Longitud minima sobrepasada"});
             }
          },
        },
      },
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
      paranoid: true,
    }
  );
  return Product;
};
