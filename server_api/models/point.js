"use strict";

module.exports = function(sequelize, DataTypes) {
  var Point = sequelize.define("Point", {
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    value: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'points',
    classMethods: {
      associate: function(models) {
        Point.belongsTo(models.Idea);
        Point.belongsTo(models.User);
        Point.hasMany(models.PointRevision);
      }
    }
  });

  return Point;
};
