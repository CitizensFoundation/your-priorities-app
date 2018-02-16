'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
        'translation_cache',
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
          index: {
            type: Sequelize.STRING,
            allowNull: false
          },
          translation: {
            type: Sequelize.TEXT,
            allowNull: false
          },
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
    ).then(() => {
      return queryInterface.addIndex('translation_cache', ['index','group_id']).then(() => {
        return queryInterface.addIndex('translation_cache', ['index','community_id']).then(() => {
          return queryInterface.addIndex('translation_cache', ['index','domain_id']).then(() => {
            return queryInterface.addColumn('posts','language', { type: Sequelize.TEXT, allowNull: true }).then(() => {
              return queryInterface.addColumn('points','language', { type: Sequelize.TEXT, allowNull: true }).then(() => {
                return queryInterface.addColumn('domains','language', { type: Sequelize.TEXT, allowNull: true }).then(() => {
                  return queryInterface.addColumn('communities','language', { type: Sequelize.TEXT, allowNull: true }).then(() => {
                    return queryInterface.addColumn('groups','language', { type: Sequelize.TEXT, allowNull: true }).then(() => {
                      return queryInterface.addColumn('categories','language', { type: Sequelize.TEXT, allowNull: true }).then(() => {
                        return queryInterface.addColumn('post_status_changes','language', { type: Sequelize.TEXT, allowNull: true })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
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
