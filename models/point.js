"use strict";

module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Point", {
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'points',
    classMethods: {
      associate: function(models) {
        Task.belongsTo(models.Idea);
      }
    }
  });

  return Task;
};
