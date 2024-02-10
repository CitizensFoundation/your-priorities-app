'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.removeIndex('ac_activities', 'ac_activities_context'),
            await queryInterface.removeIndex('ac_activities', 'ac_activities_object'),
            await queryInterface.removeIndex('ac_activities', 'ac_activities_target'),
            await queryInterface.removeIndex('ac_activities', 'ac_activities_actor'),
            await queryInterface.removeIndex('ac_activities', 'ac_activities_user_interaction_profile'),
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
export {};
