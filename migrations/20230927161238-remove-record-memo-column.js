'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Records', 'memo');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Records', 'memo', {
      type: Sequelize.STRING,
    });
  },
};
