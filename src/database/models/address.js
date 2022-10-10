"use strict";
const { Model } = require("sequelize");
const { objectValidate } = require("../resources/validationsDefault");

const regExAlphaEs = /^[ÁÉÍÓÚA-Z][a-záéíóú]+(\s+[ÁÉÍÓÚA-Z]?[a-záéíóú]+)*$/;

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  Address.init(
    {
      street: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      city: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      province: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Address",
      paranoid: true,
    }
  );
  return Address;
};
