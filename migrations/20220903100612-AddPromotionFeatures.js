'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.createTable(
        'campaigns',
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
          configuration: Sequelize.JSONB,
          deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          user_id: { type: Sequelize.INTEGER, allowNull: false },
          group_id: { type: Sequelize.INTEGER, allowNull: true },
          community_id: { type: Sequelize.INTEGER, allowNull: true },
          domain_id: { type: Sequelize.INTEGER, allowNull: true },
          post_id: { type: Sequelize.INTEGER, allowNull: true }
        }
      ),

      await queryInterface.addIndex('campaigns', {
        fields: ['configuration'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      }),

      await queryInterface.addIndex('campaigns', {
        fields: ['id','user_id','deleted'],
      }),

      await queryInterface.addIndex('campaigns', {
        fields: ['id','post_id','deleted'],
      }),

      await queryInterface.addIndex('campaigns', {
        fields: ['id','group_id','deleted'],
      }),

      await queryInterface.addIndex('campaigns', {
        fields: ['id','community_id','deleted'],
      }),

      await queryInterface.addIndex('campaigns', {
        fields: ['id','domain_id','deleted'],
      }),

      await queryInterface.createTable(
        'CommunityPromoter',
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
          user_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id'
            },
          },
          community_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'communities',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'GroupPromoter',
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
          user_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id'
            },
          },
          group_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'groups',
              key: 'id'
            },
          },
        }
      ),
    ]
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
