"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Idea = sequelize.define("Idea", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'ideas',
    classMethods: {
      associate: function(models) {
        Idea.hasMany(models.Point);
        Idea.hasMany(models.IdeaRevision);
        Idea.belongsTo(models.Category);
        Idea.belongsTo(models.User);
      }
    }
  });

  return Idea;
};
