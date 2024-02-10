'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.createTable('ratings', {
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
                value: { type: Sequelize.INTEGER, allowNull: false },
                post_id: { type: Sequelize.INTEGER, allowNull: true },
                point_id: { type: Sequelize.INTEGER, allowNull: true },
                user_id: { type: Sequelize.INTEGER, allowNull: true },
                type_index: { type: Sequelize.INTEGER, allowNull: false },
                ip_address: { type: Sequelize.STRING, allowNull: false },
                user_agent: { type: Sequelize.TEXT, allowNull: false },
                deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
            }),
            await queryInterface.addIndex('ratings', ['post_id', 'deleted']),
            await queryInterface.addIndex('ratings', ['post_id', 'user_id', 'deleted']),
            await queryInterface.addIndex('ratings', ['point_id', 'deleted']),
            await queryInterface.addIndex('ratings', ['point_id', 'user_id', 'deleted']),
            await queryInterface.addIndex('ratings', ['user_id', 'deleted'])
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
