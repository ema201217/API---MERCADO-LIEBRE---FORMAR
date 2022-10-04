"use strict";
const { Model } = require("sequelize");
const { objectValidate, defaultValidationsRequiredFields } = require("./validationsDefault");

const lenValidator =
  (value) =>
  (
    min = 8,
    max = 255,
    msgMin = `Longitud minima ${min} caracteres`,
    msgMax = `Longitud maxima ${max} caracteres`
  ) => {
    return (min, max) => {
      if (value.length < min) {
        throw new Error(msgMin);
      }
      if (value.length > max) {
        throw new Error(msgMax);
      }
    };
  };

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {

      /* datatypes y validations */
      /* NAME */
      name: {
        type: DataTypes.STRING,
        validate: {
          /* objectValidate  --> FUNCTION LOCAL */

          /* CUSTOMS */
          /* validLen(value) {
           return lenValidator(value)(8,255)
          }, */
        },
      },

      /* SURNAME */
      surname: {
        type: DataTypes.STRING,
        // validate: {
        //   /* objectValidate  --> FUNCTION LOCAL */
        //   isInt: objectValidate(true, "Valor invalido"),
        //   min: objectValidate(1, "No puede ser negativo"),
        // },
      },

      /* EMAIL */
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          ...defaultValidationsRequiredFields,
          /* objectValidate  --> FUNCTION LOCAL */
        /*   isInt: objectValidate(true, "Valor invalido"),
          min: objectValidate(1, "No puede ser negativo"), */
        },
      },

      /* PASSWORD */
      password: {
        type: DataTypes.STRING,
        allowNull: false,
         validate: {
           ...defaultValidationsRequiredFields,

           /* objectValidate  --> FUNCTION LOCAL */
          /*  len: objectValidate([25], "Longitud minima 25 caracteres"), */
         },
      },

      /* AVATAR */
      avatar: {
        type: DataTypes.STRING,
        // validate: {

        //   /* objectValidate  --> FUNCTION LOCAL */
        //   len: objectValidate([25], "Longitud minima 25 caracteres"),
        // },
      },

      /* ROL ID */
      rolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //  validate: {
        //   ...defaultValidationsRequiredFields,

        //   /* objectValidate  --> FUNCTION LOCAL */
        //   min: objectValidate(1, "rolId invalido"),
        // }, 
      },
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
    }
  );
  return User;
};
