'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.createTable('translation_cache', {
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
                index_key: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                content: {
                    type: Sequelize.TEXT,
                    allowNull: false
                }
            }),
            await queryInterface.addIndex('translation_cache', ['index_key']),
            await queryInterface.addColumn('posts', 'language', { type: Sequelize.STRING, allowNull: true }),
            await queryInterface.addColumn('points', 'language', { type: Sequelize.STRING, allowNull: true }),
            await queryInterface.addColumn('domains', 'language', { type: Sequelize.STRING, allowNull: true }),
            await queryInterface.addColumn('communities', 'language', { type: Sequelize.STRING, allowNull: true }),
            await queryInterface.addColumn('groups', 'language', { type: Sequelize.STRING, allowNull: true }),
            await queryInterface.addColumn('categories', 'language', { type: Sequelize.STRING, allowNull: true }),
            await queryInterface.addColumn('post_status_changes', 'language', { type: Sequelize.STRING, allowNull: true })
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
