"use strict";

module.exports = function(sequelize, DataTypes) {
  var PointQuality = sequelize.define("PointQuality", {
    value: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    underscored: true,

    tableName: 'point_qualities',

    defaultScope: {
      where: {
        deleted: false
      }
    },

    classMethods: {
      associate: function(models) {
        PointQuality.belongsTo(models.Point);
        PointQuality.belongsTo(models.User);
      }
    }
  });

  return PointQuality;
};
