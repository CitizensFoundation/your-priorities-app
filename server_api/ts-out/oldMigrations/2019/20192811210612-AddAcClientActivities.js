'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.createTable('ac_client_activities', {
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
                type: { type: Sequelize.STRING, allowNull: false },
                sub_type: { type: Sequelize.STRING, allowNull: true },
                domain_id: { type: Sequelize.INTEGER, allowNull: true },
                community_id: { type: Sequelize.INTEGER, allowNull: true },
                group_id: { type: Sequelize.INTEGER, allowNull: true },
                user_id: { type: Sequelize.INTEGER, allowNull: true },
                post_id: { type: Sequelize.INTEGER, allowNull: true },
                object: Sequelize.JSONB,
                actor: Sequelize.JSONB,
                target: Sequelize.JSONB,
                context: Sequelize.JSONB
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
