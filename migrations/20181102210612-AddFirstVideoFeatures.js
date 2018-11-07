'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('points','data', { type: Sequelize.JSONB, allowNull: true }),
      await queryInterface.addIndex('points', {
        fields: ['data'],
        using: 'gin',
        operator: 'jsonb_path_ops',
        name: 'points_data_index',
      }),
      await queryInterface.createTable(
        'videos',
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
          name: Sequelize.STRING,
          description: Sequelize.TEXT,
          meta: Sequelize.JSONB,
          formats: Sequelize.JSONB,
          user_id: { type: Sequelize.INTEGER, allowNull: false },
          viewable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          ip_address: { type: Sequelize.STRING, allowNull: false },
          user_agent: { type: Sequelize.TEXT, allowNull: false },
          deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
        }
      ),
      await queryInterface.addIndex('videos', {
        fields: ['meta'],
        using: 'gin',
        operator: 'jsonb_path_ops',
        name: 'videos_meta_index'
      }),
      await queryInterface.addIndex('videos', {
        fields: ['formats'],
        using: 'gin',
        operator: 'jsonb_path_ops',
        name: 'videos_formats_index',
      }),
      await queryInterface.addIndex('videos', ['user_id', 'viewable', 'deleted']),

      await queryInterface.createTable(
        'audios',
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
          name: Sequelize.STRING,
          description: Sequelize.TEXT,
          meta: Sequelize.JSONB,
          formats: Sequelize.JSONB,
          user_id: { type: Sequelize.INTEGER, allowNull: false },
          listenable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          ip_address: { type: Sequelize.STRING, allowNull: false },
          user_agent: { type: Sequelize.TEXT, allowNull: false },
          deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
        }
      ),
      await queryInterface.addIndex('audios', {
        fields: ['meta'],
        using: 'gin',
        operator: 'jsonb_path_ops',
        name: 'audios_meta_index'
      }),
      await queryInterface.addIndex('audios', {
        fields: ['formats'],
        using: 'gin',
        operator: 'jsonb_path_ops',
        name: 'audios_formats_index',
      }),
      await queryInterface.addIndex('audios', ['user_id', 'listenable', 'deleted']),
      await queryInterface.createTable(
        'PostVideo',
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
          video_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          post_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'posts',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'PostAudio',
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
          video_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'audios',
              key: 'id'
            },
          },
          post_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'posts',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'PointVideo',
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
          video_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          point_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'points',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'PointAudio',
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
          video_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'audios',
              key: 'id'
            },
          },
          point_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'points',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'UserProfileVideo',
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
          video_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          user_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'CommunityLogoVideo',
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
          video_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
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
        'GroupLogoVideo',
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
          video_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
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
      await queryInterface.createTable(
        'DomainLogoVideo',
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
          video_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            },
          },
          domain_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'domains',
              key: 'id'
            },
          },
        }
      ),
      await queryInterface.createTable(
        'VideoImage',
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
          image_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'images',
              key: 'id'
            },
          },
          video_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'videos',
              key: 'id'
            }
          }
        }
      )
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
