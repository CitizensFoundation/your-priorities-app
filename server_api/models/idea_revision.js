"use strict";

module.exports = function(sequelize, DataTypes) {
  var IdeaRevision = sequelize.define("IdeaRevision", {
    description: DataTypes.TEXT
  }, {
    underscored: true,
    tableName: 'idea_revisions',
    classMethods: {
      associate: function(models) {
        IdeaRevision.belongsTo(models.Idea);
      }
    }
  });

  return IdeaRevision;
};
