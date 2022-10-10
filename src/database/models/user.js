"use strict";
const { hashSync } = require("bcryptjs");
const { Model } = require("sequelize");
const { ROL_USER } = require("../../constants");
const {
  defaultValidationsRequiredFields,
  objectValidate,
} = require("../resources/validationsDefault");

const regExAlphaEs = /^[ÁÉÍÓÚA-Z][a-záéíóú]+(\s+[ÁÉÍÓÚA-Z]?[a-záéíóú]+)*$/

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
        throw new Error(msgMin);
      }
      if (value.length > max) {
        throw new Error(msgMax);
      }
    }

    existEmail(value) {
      return new Promise((res, rej) => {
        const user = User.findOne({ where: { email: value } });
        if (user) {
          res(user);
        }
        rej(null);
      });
    }

    static associate(models) {
      // define association here
      /* Tiene muchas direcciones */
      this.hasMany(models.Address, {
        foreignKey: "userId",
        as: "addresses",
      });
      /* Tiene un rol */
      this.belongsTo(models.Rol, {
        foreignKey: "rolId",
        as: "rol",
      });
    }
  }

  User.init(
    {
      /* datatypes y validations */
      /* NAME */
      name: {
        type: DataTypes.STRING,
        validate: {
          /* ./helpers/general/objectValidate  --> FUNCTION LOCAL */
          not: objectValidate(regExAlphaEs, "Este campo debe contener solo letras"),

          /* CUSTOMS */
          /* Len validator */
          name(value) {
            this.lengthValidator(value, 5, 30);
          },
        },
      },

      // SURNAME
      surname: {
        type: DataTypes.STRING,
        validate: {
          /* objectValidate  --> FUNCTION LOCAL */
          isAlpha: objectValidate(true, "Este campo debe contener solo letras"),
        },
      },

      // EMAIL
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          ...defaultValidationsRequiredFields,

          // isEmail: objectValidate(true,"Ingrese un email valido"),
          // CUSTOMS
          async email(value) {
            const exist = await this.existEmail(value);
            if (exist) {
              throw new Error("El email ya existe");
            }
          },
        },
      },

      // PASSWORD
      password: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          ...defaultValidationsRequiredFields,

          // objectValidate  --> FUNCTION LOCAL
          isAlphanumeric: objectValidate(
            true,
            "Contraseña invalida, solo números y letras"
          ),

          hashPass(value) {
            User.beforeCreate((user) => {
              user.password = hashSync(value);
            });
          },
        },
      },

      // AVATAR
      avatar: {
        type: DataTypes.STRING,
        defaultValue: "default.png",
        validate: {
          // isInt: objectValidate(true, ""),
          //   /* objectValidate  --> FUNCTION LOCAL */
          //   len: objectValidate([25], "Longitud minima 25 caracteres"),
        },
      },

      // ROL ID
      rolId: {
        type: DataTypes.INTEGER,
        valueDefault: ROL_USER,
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
