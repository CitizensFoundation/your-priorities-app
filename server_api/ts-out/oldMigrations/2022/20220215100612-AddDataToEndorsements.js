'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.addColumn('endorsements', 'data', { type: Sequelize.JSONB, allowNull: true }),
            await queryInterface.addColumn('point_qualities', 'data', { type: Sequelize.JSONB, allowNull: true })
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
