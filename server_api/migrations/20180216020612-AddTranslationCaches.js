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
          index_key: {
            type: Sequelize.STRING,
            allowNull: false
          },
          content: {
            type: Sequelize.TEXT,
            allowNull: false
          }
        }
    ).then(() => {
      return queryInterface.addIndex('translation_cache', ['index_key']).then(() => {
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
