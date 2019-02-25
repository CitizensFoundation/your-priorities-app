'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'invites',
      'metadata',
      {
        type: Sequelize.JSONB,
        allowNull: true
      }
    )},

  down: function (queryInterface, Sequelize) {
  }
};
