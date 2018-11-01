'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addIndex('ac_activities', ['user_id','group_id','deleted']),
      await queryInterface.addIndex('points', ['user_id','group_id','deleted']),
      await queryInterface.addIndex('posts', ['user_id','group_id','deleted']),
      await queryInterface.addIndex('endorsements', ['user_id','deleted']),
      await queryInterface.addIndex('point_qualities', ['user_id','deleted']),
      await queryInterface.addIndex('users',['id','deleted'])
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
