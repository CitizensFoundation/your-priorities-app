"use strict";

module.exports = function(sequelize, DataTypes) {
  var PointQuality = sequelize.define("PointQuality", {
    value: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false }
  }, {
    underscored: true,
    tableName: 'point_qualities',
    classMethods: {
      associate: function(models) {
        PointQuality.belongsTo(models.Point);
        PointQuality.belongsTo(models.User);
      }
    }
  });

  return PointQuality;
};
