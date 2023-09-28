"use strict";
const initData = require("./seedData.json");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction;
    try {
      transaction = await queryInterface.sequelize.transaction();
      // users data
      await queryInterface.bulkInsert(
        "users",
        await Promise.all(
          initData.users.map(async (user) => {
            const hash = await bcrypt.hash(user.password, 10);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              password: hash,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          })
        ),
        {
          transaction,
        }
      );
      // categories data
      await queryInterface.bulkInsert(
        "categories",
        initData.categories.map((category) => {
          return {
            id: category.id,
            name: category.name,
            iconUrl: category.iconUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }),
        { transaction }
      );
      // records data
      await queryInterface.bulkInsert(
        "records",
        initData.records.map((record) => {
          return {
            id: record.id,
            name: record.name,
            date: record.date,
            amount: record.amount,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: record.userId,
            categoryId: record.categoryId,
          };
        }),
        {
          transaction,
        }
      );

      await transaction.commit();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
        console.log(err);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("categories", null, {});
    await queryInterface.bulkDelete("records", null, {});
  },
};
