'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('communities','is_community_folder', { type: Sequelize.BOOLEAN, defaultValue: false }),
      await queryInterface.addColumn('communities','in_community_folder_id', { type: Sequelize.INTEGER, defaultValue: null }),

      await queryInterface.addIndex('communities', ['id', 'deleted']),
      await queryInterface.addIndex('communities', ['id', 'deleted', 'is_community_folder']),
      await queryInterface.addIndex('communities', ['id', 'deleted', 'in_community_folder_id']),
      await queryInterface.addIndex('communities', ['deleted', 'is_community_folder']),
      await queryInterface.addIndex('communities', ['deleted', 'in_community_folder_id']),
      await queryInterface.addIndex('communities', ['domain_id', 'deleted', 'in_community_folder_id']),
      await queryInterface.addIndex('communities', ['domain_id', 'deleted', 'in_community_folder_id','status']),
      await queryInterface.addIndex('communities', ['domain_id', 'deleted', 'is_community_folder']),
      await queryInterface.addIndex('communities', ['domain_id', 'deleted', 'is_community_folder','access']),
      await queryInterface.addIndex('communities', ['deleted', 'in_community_folder_id','status', 'access']),
      await queryInterface.addIndex('communities', ['deleted','domain_id','access','counter_users','status','in_community_folder_id'],
        { name: 'ComDelDomAccCountStatInCommunity' })
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
