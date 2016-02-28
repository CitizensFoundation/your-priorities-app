"use strict";

var async = require("async");
var queue = require('../workers/queue');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

module.exports = function(sequelize, DataTypes) {
  var AcNotification = sequelize.define("AcNotification", {
    priority: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    sent_email: { type: DataTypes.INTEGER, default: false },
    sent_push: { type: DataTypes.INTEGER, default: false },
    processed_at: DataTypes.DATE,
    user_interaction_profile: DataTypes.JSONB,
    viewed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    indexes: [
      {
        name: 'notification_public_and_active_by_type',
        fields: ['type'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'notification_active_by_type',
        fields: ['type'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'notification_active_by_type_and_user_id',
        fields: ['type','user_id'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'notification_by_type_and_user_id',
        fields: ['type','user_id']
      },
      {
        name: 'notification_active_by_user_id',
        fields: ['user_id'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'notification_all_by_type',
        fields: ['type']
      },
      {
        fields: ['user_interaction_profile'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      }
    ],
    underscored: true,

    tableName: 'ac_notifications',

    classMethods: {

      METHOD_MUTED: 0,
      METHOD_BROWSER: 1,
      METHOD_EMAIL: 2,
      METHOD_PUSH: 3,
      METHOD_SMS: 4,

      FREQUENCY_AS_IT_HAPPENS: 0,
      FREQUENCY_HOURLY: 1,
      FREQUENCY_DAILY: 2,
      FREQUENCY_WEEKLY: 3,
      FREQUENCY_BI_WEEKLY: 4,
      FREQUENCY_MONTHLY: 5,

      ENDORSEMENT_GROUPING_TTL: 6 * 60 * 60 * 1000, // milliseconds

      associate: function(models) {
        AcNotification.belongsToMany(models.AcActivity, { as: 'AcActivities', through: 'notification_activities' });
        AcNotification.belongsToMany(models.AcActivity, { as: 'AcDelayedNotifications', through: 'delayed_notifications' });
        AcNotification.belongsTo(models.User);
      },

      createNotificationFromActivity: function(user, activity, type, priority, callback) {
        log.info('AcNotification Notification', {type: type, priority: priority });

        var domain = activity.object.domain;
        var community = activity.object.community;

       sequelize.models.AcNotification.build({
         type: type,
         priority: priority,
         status: 'active',
         ac_activity_id: activity.id,
         user_id: user.id
       }).save().then(function(notification) {
          if (notification) {
            notification.addAcActivities(activity).then(function (results) {
              if (results) {
                var notificationJson = notification.toJSON();
                notificationJson['activity'] = activity;
                queue.create('process-notification', notificationJson).priority('critical').removeOnComplete(true).save();
                log.info('Notification Created', { notification: toJson(notification), user: user });
                callback();
              } else {
                callback("Notification Error Can't add activity");
              }
            });
          } else {
            log.error('Notification Creation Error', { err: "No notification", user: user });
            callback();
          }
        }).catch(function (error) {
         log.error('Notification Creation Error', { err: error, user: user });
       });
      }
    }
  });

  return AcNotification;
};
