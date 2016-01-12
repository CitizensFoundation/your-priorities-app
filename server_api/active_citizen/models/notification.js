"use strict";

// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  var AcNotification = sequelize.define("AcNotification", {
    level: DataTypes.INTEGER
  }, {
    underscored: true,

    tableName: 'ac_notifications',

    classMethods: {
      associate: function(models) {
        AcNotification.belongsTo(models.AcActivity);
        AcNotification.belongsTo(models.Community);
        AcNotification.belongsTo(models.Group);
        AcNotification.belongsTo(models.Post);
        AcNotification.belongsTo(models.Point);
        AcNotification.belongsTo(models.User);
      }
    }
  });

  return AcNotification;
};
