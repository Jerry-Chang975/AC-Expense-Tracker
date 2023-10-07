'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('records', 'memo')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('records', 'memo', {
      type: Sequelize.STRING
    })
  },
};
