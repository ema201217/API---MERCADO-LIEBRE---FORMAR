"use strict";

const addresses = [
  {
    street: "",
    city: "",
    province: "",
    userId: 1,
    active:true,
    createdAt: new Date(),
  },
  {
    street: "",
    city: "",
    province: "",
    userId: 2,
    active:true,
    createdAt: new Date(),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Addresses", addresses, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Addresses", null, {});
  },
};
