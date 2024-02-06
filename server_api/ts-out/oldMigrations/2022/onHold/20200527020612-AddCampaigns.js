'use strict';
//TODO: Add indexes
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.createTable('ac_lists', {
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
                data: Sequelize.JSONB,
                user_id: { type: Sequelize.INTEGER, allowNull: false },
                group_id: { type: Sequelize.INTEGER, allowNull: true },
                community_id: { type: Sequelize.INTEGER, allowNull: true },
                post_id: { type: Sequelize.INTEGER, allowNull: true }
            }),
            await queryInterface.createTable('ac_campaigns', {
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
                data: Sequelize.JSONB,
                user_id: { type: Sequelize.INTEGER, allowNull: false },
                ac_list_id: { type: Sequelize.INTEGER, allowNull: false }
            }),
            await queryInterface.createTable('ac_list_users', {
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
                data: Sequelize.JSONB,
                user_id: { type: Sequelize.INTEGER, allowNull: true },
                ac_list_id: { type: Sequelize.INTEGER, allowNull: false }
            })
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
