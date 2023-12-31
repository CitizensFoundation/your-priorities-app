'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.addColumn('domains', 'data', { type: Sequelize.JSONB, allowNull: true }),
            await queryInterface.addColumn('domains', 'counter_flags', { type: Sequelize.INTEGER, defaultValue: 0 }),
            await queryInterface.addIndex('domains', {
                fields: ['data'],
                using: 'gin',
                operator: 'jsonb_path_ops'
            }),
            await queryInterface.addColumn('communities', 'data', { type: Sequelize.JSONB, allowNull: true }),
            await queryInterface.addColumn('communities', 'counter_flags', { type: Sequelize.INTEGER, defaultValue: 0 }),
            await queryInterface.addIndex('communities', {
                fields: ['data'],
                using: 'gin',
                operator: 'jsonb_path_ops'
            }),
            await queryInterface.addColumn('groups', 'data', { type: Sequelize.JSONB, allowNull: true }),
            await queryInterface.addColumn('groups', 'counter_flags', { type: Sequelize.INTEGER, defaultValue: 0 }),
            await queryInterface.addIndex('groups', {
                fields: ['data'],
                using: 'gin',
                operator: 'jsonb_path_ops'
            }),
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
