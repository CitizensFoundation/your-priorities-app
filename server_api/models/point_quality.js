"use strict";

module.exports = function(sequelize, DataTypes) {
  var PointQuality = sequelize.define("PointQuality", {
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
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
