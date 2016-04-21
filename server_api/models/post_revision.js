"use strict";

module.exports = function(sequelize, DataTypes) {
  var PostRevision = sequelize.define("PostRevision", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    data: DataTypes.JSONB,
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {
    defaultScope: {
      where: {
        deleted: false
      }
    },

    underscored: true,
    tableName: 'post_revisions',
    classMethods: {
      associate: function(models) {
        PostRevision.belongsTo(models.Post);
        PostRevision.belongsTo(models.User);
      }
    }
  });
  return PostRevision;
};
