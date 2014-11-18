"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("Idea", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Point)
      }
    }
  });

  return User;
};
