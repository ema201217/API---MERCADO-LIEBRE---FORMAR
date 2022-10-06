"use strict";
const { Model } = require("sequelize");
const { objectValidate, defaultValidationsRequiredFields } = require("../resources/validationsDefault");


module.exports = (sequelize, DataTypes) => {  
  class Product extends Model {

    lengthValidator(     
      value,
      min = 8,
      max = 255,
      msgMin = `Longitud minima ${min} caracteres`,
      msgMax = `Longitud maxima ${max} caracteres`
    ) {
      if (value.length < min) {
        return new Error(msgMin);
      }
      if (value.length > max) {
        return new Error(msgMax);
      }
    }

    static associate(models) {
      this.hasMany(models.Image, {
        as: "images",
        foreignKey: "productId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Category, {
        as: "category",
        foreignKey: "categoryId",
      });
    }
  }
  Product.init(
    {

      /* datatypes y validations */
      /* NAME */
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          /* objectValidate  --> FUNCTION LOCAL */
          ...defaultValidationsRequiredFields,

          /* CUSTOMS */
          lengthValid(value) {
            if (value.length < 8) {
              throw new Error("Longitud minima 8 caracteres");
            }
            if (value.length > 255) {
              throw new Error("Longitud maxima 255 caracteres");
            }
          },
        },
      },

      /* PRICE */
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          ...defaultValidationsRequiredFields,

          /* objectValidate  --> FUNCTION LOCAL */
          isInt: objectValidate(true, "Valor invalido"),
          min: objectValidate(1, "No puede ser negativo"),
        },
      },

      /* DISCOUNT */
      discount: {
        type: DataTypes.INTEGER,
        validate: {
          /* objectValidate  --> FUNCTION LOCAL */
          isInt: objectValidate(true, "Valor invalido"),
          min: objectValidate(1, "No puede ser negativo"),
        },
      },

      /* DESCRIPTION */
      description: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          ...defaultValidationsRequiredFields,

          /* objectValidate  --> FUNCTION LOCAL */
          len: objectValidate([25], "Longitud minima 25 caracteres"),
        },
      },

      /* CATEGORY ID */
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          ...defaultValidationsRequiredFields,

          /* objectValidate  --> FUNCTION LOCAL */
          min: objectValidate(1, "categoryId invalido"),
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
      paranoid: true,
    }
  );
  return Product;
};
