'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addIndex('ac_notifications', ['user_id','viewed','deleted']),
      await queryInterface.addIndex('audios', ['id','deleted']),
      await queryInterface.addIndex('categories', ['id','deleted']),
      await queryInterface.addIndex('domains', ['id','deleted']),
      await queryInterface.addIndex('images', ['id','deleted']),
      await queryInterface.addIndex('posts', ['id','deleted']),
      await queryInterface.addIndex('videos', ['id','deleted']),
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
