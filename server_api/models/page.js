"use strict";

module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define("Page", {
    title: { type: DataTypes.JSONB, allowNull: false },
    content: { type: DataTypes.JSONB, allowNull: false },
    weight: { type: DataTypes.INTEGER, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    indexes: [
      {
        fields: ['community_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['group_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['domain_id'],
        where: {
          deleted: false
        }
      }
    ],

    underscored: true,

    tableName: 'pages',

    classMethods: {

      getPagesForAdmin: function (req, options, callback)  {
        sequelize.models.Page.findAll( {
          where: options
        }).then( function (pages) {
          callback(null, pages);
        }).catch( function (error) {
          callback(error);
        });
      },

      associate: function(models) {
        Page.belongsTo(models.Domain);
        Page.belongsTo(models.Community);
        Page.belongsTo(models.Group);
        Page.belongsTo(models.User);
      }
    }
  });
  return Page;
};
