"use strict";

module.exports = function(sequelize, DataTypes) {
  var IdeaRevision = sequelize.define("IdeaRevision", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    underscored: true,
    tableName: 'idea_revisions',
    classMethods: {
      associate: function(models) {
        IdeaRevision.belongsTo(models.Idea);
        IdeaRevision.belongsTo(models.Group);
        IdeaRevision.belongsTo(models.User);
      }
    }
  });
  return IdeaRevision;
};
