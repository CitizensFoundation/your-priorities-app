"use strict";

module.exports = function(sequelize, DataTypes) {
  var Point = sequelize.define("Point", {
    name: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    value: { type: DataTypes.INTEGER, allowNull: false },
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
