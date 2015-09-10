"use strict";

module.exports = function(sequelize, DataTypes) {
  var Point = sequelize.define("Point", {
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
    counter_quality_up: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_quality_down: { type: DataTypes.INTEGER, defaultValue: 0 }

  }, {
    underscored: true,
    tableName: 'points',
    classMethods: {
      associate: function(models) {
        Point.belongsTo(models.Idea);
        Point.belongsTo(models.User);
        Point.hasMany(models.PointRevision);
        Point.hasMany(models.PointQuality);
      }
    }
  });

  return Point;
};
