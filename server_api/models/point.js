"use strict";

module.exports = function(sequelize, DataTypes) {
  var Point = sequelize.define("Point", {
    name: { type: DataTypes.STRING, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.INTEGER, allowNull: false },
    website: DataTypes.STRING,
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    counter_revisions: { type: DataTypes.INTEGER, defaultValue: 1 },
    counter_flags: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_quality_up: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_quality_down: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {

    underscored: true,

    tableName: 'points',
    classMethods: {
      associate: function(models) {
        Point.belongsTo(models.Post);
        Point.belongsTo(models.User);
        Point.belongsTo(models.Group);
        Point.hasMany(models.PointRevision);
        Point.hasMany(models.PointQuality);
      }
    }
  });

  return Point;
};
