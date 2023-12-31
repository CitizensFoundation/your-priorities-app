'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.removeIndex('ac_activities', 'activity_active_by_domain_id'),
            await queryInterface.removeIndex('ac_activities', 'activity_active_by_user_id'),
            await queryInterface.removeIndex('ac_activities', 'ac_activities_type_user_id_created_at'),
            await queryInterface.removeIndex('ac_activities', 'ac_activities_post_id_user_id_created_at_id'),
            await queryInterface.removeIndex('ac_activities', 'ac_activities_group_id_user_id_created_at'),
            await queryInterface.removeIndex('ac_activities', 'ac_activities_community_id_user_id_created_at')
        ];
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
