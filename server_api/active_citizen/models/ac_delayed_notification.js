"use strict";

// Notify user about this object

module.exports = function(sequelize, DataTypes) {
  var AcDelayedNotification = sequelize.define("AcDelayedNotification", {
    method: { type: DataTypes.INTEGER, allowNull: false },
    frequency: { type: DataTypes.INTEGER, allowNull: false },
    delivered: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    delivered_at: { type: DataTypes.DATE, allowNull: true },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },
    indexes: [
      {
        name: 'delayed_not_delivered_by_method_user_id_frequency',
        fields: ['method','user_id','frequency'],
        where: {
          delivered: true
        }
      },
      {
        name: 'delayed_n_not_delivered_by_method_user_id_frequency_timestamps',
        fields: ['method','user_id','frequency','updated_at','delivered_at'],
        where: {
          delivered: true
        }
      }
    ],
    underscored: true,

    tableName: 'ac_delayed_notifications',

    classMethods: {

      associate: function(models) {
        AcDelayedNotification.belongsToMany(models.AcNotification, { as: 'AcDelayedNotifications', through: 'delayed_notifications' });
        AcDelayedNotification.belongsTo(models.User);
      }
    }
  });

  return AcDelayedNotification;
};
