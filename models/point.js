"use strict";

module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Point", {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Task.belongsTo(models.Idea);
      }
    }
  });

  return Task;
};
