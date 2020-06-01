'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.createTable(
        'ac_background_jobs',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE
          },
          progress: { type: Sequelize.INTEGER, allowNull: true },
          error: { type: Sequelize.TEXT, allowNull: true },
          data: Sequelize.JSONB
        }
      )
    ]
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
