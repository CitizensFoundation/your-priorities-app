"use strict";

module.exports = (sequelize, DataTypes) => {
  const AcDelayedNotification = sequelize.define("AcDelayedNotification", {
    method: { type: DataTypes.INTEGER, allowNull: false },
    frequency: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
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

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'ac_delayed_notifications'
  });

  AcDelayedNotification.associate = (models) => {
    AcDelayedNotification.belongsToMany(models.AcNotification, { as: 'AcNotifications', through: 'delayed_notifications' });
    AcDelayedNotification.belongsTo(models.User,{ foreignKey: 'user_id' });
  };

  return AcDelayedNotification;
};
