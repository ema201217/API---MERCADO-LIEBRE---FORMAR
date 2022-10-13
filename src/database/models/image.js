"use strict";
const { Model, AggregateError, Error, ValidationErrorItem } = require("sequelize");
const fs = require("fs");
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
        type: DataTypes.STRING,
        validate: {
          isImage(file) {
            if (!/.png|.jpg|.jpeg|.webp/gi.test(file)) {
              fs.unlinkSync(
                path.join(
                  __dirname,
                  `../../../public/images/products/${file}`
                )
              );
              throw new Error("Uno o más archivos son inválidos");
            }
          },
        },
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
