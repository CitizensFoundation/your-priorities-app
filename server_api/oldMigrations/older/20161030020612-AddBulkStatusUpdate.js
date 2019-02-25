'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
        'bulk_status_updates',
        {
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
          config: {
            type: Sequelize.JSONB,
            allowNull: true
          },
          templates: {
            type: Sequelize.JSONB,
            allowNull: true
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
          },
          sent_at: {
            type: Sequelize.DATE,
            allowNull: true
          },
          //foreign key usage
          community_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'communities',
              key: 'id'
            }
          },
          group_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'groups',
              key: 'id'
            }
          },
          user_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id'
            }
          }
        }
    )
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
