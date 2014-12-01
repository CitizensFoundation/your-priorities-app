"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Idea = sequelize.define("Idea", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    position: DataTypes.INTEGER,
    counter_endorsements_up: DataTypes.INTEGER,
    counter_endorsements_down: DataTypes.INTEGER,
    counter_points: DataTypes.INTEGER,
    counter_comments: DataTypes.INTEGER,
    counter_all_activities: DataTypes.INTEGER,
    counter_main_activities: DataTypes.INTEGER,
    impressions_count: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'ideas',
    classMethods: {
      associate: function(models) {
        Idea.hasMany(models.Point);
        Idea.hasMany(models.Endorsement);
        Idea.hasMany(models.IdeaRevision);
        Idea.belongsTo(models.Category);
        Idea.belongsTo(models.User);
        Idea.belongsTo(models.Group, {foreignKey: "sub_instance_id"});
      }
    }
  });

  return Idea;
};
