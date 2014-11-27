"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    login: DataTypes.STRING,
    facebook_uid: DataTypes.INTEGER,
    buddy_icon_file_name: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'users',
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Idea);
        User.hasMany(models.Point);
        User.hasMany(models.Endorsement);
      }
    }
  });

  return User;
};
