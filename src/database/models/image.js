"use strict";
const { Model } = require("sequelize");
const path = require("path");
const { objectValidate } = require("../resources/validationsDefault");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      // define association here
      Image.belongsTo(models.Product, {
        as: "product",
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
    }
  }
  Image.init(
    {
      file: {
        type:DataTypes.STRING,
        validate: {
          /* file(value){
            if(!/[.png|.jpg|.jpeg|.webp]/ig.test(value)){
              throw new Error("Archivo invalido")
            }
          }, */
          not:objectValidate(/[.png|.jpg|.jpeg|.webp]/ig,"Error de archivo")
        }
      },
      productId: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Image",
      paranoid: true,
    }
  );

  return Image;
};
