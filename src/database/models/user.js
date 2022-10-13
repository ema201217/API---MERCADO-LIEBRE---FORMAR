"use strict";
const { hashSync } = require("bcryptjs");
const { Model } = require("sequelize");
const fs = require('fs')
const path = require('path')
const { ROL_USER } = require("../../constants");
const {
  defaultValidationsRequiredFields,
  objectValidate,
} = require("../resources/validationsDefault");

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
        onDelete: "CASCADE",
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
          /* CUSTOMS */
          isString(value) {
            if (/[0-9]/.test(value)) {
              throw new Error("Este campo debe tener solo letras");
            }
          },
          /* Len validator */
          length(value) {
            this.lengthValidator(value, 5, 30);
          },
        },
      },

      // SURNAME
      surname: {
        type: DataTypes.STRING,
        validate: {
          /* CUSTOMS */
          isString(value) {
            if (/[0-9]/.test(value)) {
              throw new Error("Este campo debe tener solo letras");
            }
          },
          /* Len validator */
          length(value) {
            this.lengthValidator(value, 5, 30);
          },
        },
      },

      // EMAIL
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          ...defaultValidationsRequiredFields,

          isEmail: objectValidate(true, "Ingrese un email valido"),
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
          isImage(value){
            if(!/.png|.jpg|.jpeg|.webp/i.test(value)){
              fs.unlinkSync(path.join(__dirname,`../../../public/images/avatars/${value}`))
              throw new Error('Archivo invalido desde validación sequelize')
            }
          }
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
