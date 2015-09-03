"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    name: DataTypes.STRING,
    short_name: DataTypes.STRING,
    top_banner_file_name: DataTypes.STRING,
    logo_file_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    counter_ideas: DataTypes.INTEGER,
    counter_points: DataTypes.INTEGER,
    counter_comments: DataTypes.INTEGER,
    counter_users: DataTypes.INTEGER,
    public: DateType.BOOLEAN
  }, {
    underscored: true,

    tableName: 'groups',

    classMethods: {
      associate: function(models) {
        Group.hasMany(models.Idea, {foreignKey: "group_id"});
        Group.hasMany(models.Point, {foreignKey: "group_id"});
        Group.hasMany(models.Endorsement, {foreignKey: "group_id"});
        Group.hasMany(models.Category, {foreignKey: "group_id"});
        Group.belongsToMany(User, { through: 'UserProject' });
        Group.hasMany(models.User, {foreignKey: "group_id"});
        Group.belongsTo(models.IsoCountry, {foreignKey: "iso_country_id"});
      }
    }
  });

  return Group;
};
