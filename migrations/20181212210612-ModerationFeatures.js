'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addIndex('points', ['user_id','group_id','deleted','status']),
      await queryInterface.addIndex('points', ['post_id','deleted','status']),
      await queryInterface.addIndex('points', ['id','deleted','status']),
      await queryInterface.addIndex('points', ['user_id','deleted','status']),

      await queryInterface.sequelize.query(
        "UPDATE points SET status = 'published' WHERE status='active'"
      ),

      await queryInterface.addIndex('posts', ['user_id','group_id','deleted','status']),
      await queryInterface.addIndex('posts', ['group_id','deleted','status']),
      await queryInterface.addIndex('posts', ['id','deleted','status']),
      await queryInterface.addIndex('posts', ['user_id','deleted','status']),

      await queryInterface.sequelize.query(
        "UPDATE posts SET status = 'published' WHERE status='inactive'"
      ),

      await queryInterface.addIndex('users', ['id','deleted','status']),

      await queryInterface.sequelize.query(
        "UPDATE users SET status = 'active' WHERE status='pending'"
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
