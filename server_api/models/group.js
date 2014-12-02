"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    name: DataTypes.STRING,
    short_name: DataTypes.STRING,
    top_banner_file_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    counter_ideas: DataTypes.INTEGER,
    counter_points: DataTypes.INTEGER,
    counter_comments: DataTypes.INTEGER,
    counter_users: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'sub_instances',
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.Idea, {foreignKey: "sub_instance_id"});
        Group.hasMany(models.Point, {foreignKey: "sub_instance_id"});
        Group.hasMany(models.Endorsement, {foreignKey: "sub_instance_id"});
        Group.hasMany(models.Category, {foreignKey: "sub_instance_id"});
        Group.hasMany(models.User, {foreignKey: "sub_instance_id"});
        Group.belongsTo(models.IsoCountry, {foreignKey: "iso_country_id"});
      }
    }
  });

  return Group;
};
