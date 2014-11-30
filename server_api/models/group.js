"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    name: DataTypes.STRING,
    short_name: DataTypes.STRING,
    top_banner_file_name: DataTypes.STRING,
    description: DataTypes.TEXT
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
      }
    }
  });

  return Group;
};
