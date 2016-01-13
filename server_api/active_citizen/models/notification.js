"use strict";

// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  var AcNotification = sequelize.define("AcNotification", {
    priority: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    sent_email: { type: DataTypes.INTEGER, allowNull: false, default: false },
    sent_push: { type: DataTypes.INTEGER, allowNull: false, default: false }
  }, {
    underscored: true,

    tableName: 'ac_notifications',

    classMethods: {
      associate: function(models) {
        AcNotification.belongsTo(models.AcActivity);
        AcNotification.belongsTo(models.User);
      }
    }
  });

  return AcNotification;
};
