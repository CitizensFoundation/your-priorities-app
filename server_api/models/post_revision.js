"use strict";

module.exports = function(sequelize, DataTypes) {
  var PostRevision = sequelize.define("PostRevision", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    underscored: true,
    tableName: 'post_revisions',
    classMethods: {
      associate: function(models) {
        PostRevision.belongsTo(models.Post);
        PostRevision.belongsTo(models.Group);
        PostRevision.belongsTo(models.User);
      }
    }
  });
  return PostRevision;
};
