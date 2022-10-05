"use strict";
const { Model } = require("sequelize");
const { defaultValidationsRequiredFields, objectValidate } = require("../resources/validationsDefault");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

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

    existEmail(value) {
      return new Promise((res, rej) => {
        const user = User.findOne({ where: { email: value } });
        if (!user) {
          rej(null);
        }
        res(user);
      });
    }

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
          // isInt:objectValidate(false,"El valor es invalido"),
          // isAlphanumeric: objectValidate(true, "El valor es invalido"),
          /* CUSTOMS */
          /* Len validator */
          name(value) {
            throw this.lengthValidator(value,5,30);
          },
        },
      },

      /* SURNAME */
      surname: {
        type: DataTypes.STRING,
        validate: {
          /* objectValidate  --> FUNCTION LOCAL */
        },
      },

      /* EMAIL */
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          ...defaultValidationsRequiredFields,

          /* CUSTOMS */
          async email(value) {
            const exist = await this.existEmail(value);
            if (exist) {
              throw new Error("El email ya existe");
            }
          },
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
        validate: {
          // isInt: objectValidate(true, ""),

          //   /* objectValidate  --> FUNCTION LOCAL */
          //   len: objectValidate([25], "Longitud minima 25 caracteres"),
        },
      },

      /* ROL ID */
      rolId: {
        type: DataTypes.INTEGER
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
