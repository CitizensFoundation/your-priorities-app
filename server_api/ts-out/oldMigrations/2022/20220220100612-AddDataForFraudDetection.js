'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.addColumn('ac_background_jobs', 'internal_data', { type: Sequelize.JSONB, allowNull: true }),
            await queryInterface.addColumn('ratings', 'data', { type: Sequelize.JSONB, allowNull: true })
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
