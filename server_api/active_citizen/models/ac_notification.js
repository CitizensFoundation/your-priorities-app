"use strict";

var async = require("async");
var queue = require('../workers/queue');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

module.exports = function(sequelize, DataTypes) {
  var AcNotification = sequelize.define("AcNotification", {
    access: { type: DataTypes.INTEGER, allowNull: false },
    priority: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    sent_email: { type: DataTypes.INTEGER, default: false },
    sent_push: { type: DataTypes.INTEGER, default: false },
    processed_at: DataTypes.DATE,
    user_interaction_profile: DataTypes.JSONB
  }, {
    underscored: true,

    tableName: 'ac_notifications',

    classMethods: {

      ACCESS_PUBLIC: 0,
      ACCESS_COMMUNITY: 1,
      ACCESS_GROUP: 2,
      ACCESS_PRIVATE: 3,

      associate: function(models) {
        AcNotification.belongsTo(models.AcActivity);
        AcNotification.belongsTo(models.User);
      },

      createNotificationFromActivity: function(activity, type, access, priority, done) {
        log.info('AcNotification Notification', {type: type, access: access, priority: priority });
        var user = activity.actor.user;
        var domain = activity.object.domain;
        var community = activity.object.community;

       sequelize.models.AcNotification.build({
         type: type,
         priority: priority,
         access: access,
         ac_activity_id: activity.id,
         user_id: user.id
       }).save().then(function(notification) {
          if (notification) {
            var notificationJson = notification.toJSON();
            notificationJson['activity'] = activity;
            queue.create('process-notification', notificationJson).priority('critical').removeOnComplete(true).save();
            log.info('Notification Created', { notification: toJson(notification), user: user });
            done();
          } else {
            log.error('Notification Creation Error', { err: "No notification", user: user });
            done();
          }
        }).catch(function (error) {
         log.error('Notification Creation Error', { err: error, user: user });
       });
      }
    }
  });

  return AcNotification;
};
