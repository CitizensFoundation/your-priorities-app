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
    user_interaction_profile: DataTypes.JSONB
  }, {
    underscored: true,

    tableName: 'ac_notifications',

    classMethods: {

      ACCESS_PUBLIC: 0,
      ACCESS_COMMUNITY: 1,
      ACCESS_GROUP: 2,
      ACCESS_PRIVATE: 3,

      NOTIFICATION_PASSWORD_RECOVERY: 0,

      associate: function(models) {
        AcNotification.belongsTo(models.AcActivity);
        AcNotification.belongsTo(models.User);
      },

      createPasswordRecovery: function(activity, done) {
        var user = activity.actor.user;
        var domain = activity.object.domain;
        var community = activity.object.community;

       sequelize.models.AcNotification.build({
         type: sequelize.models.AcNotification.NOTIFICATION_PASSWORD_RECOVERY,
         priority: 100,
         access: sequelize.models.AcNotification.ACCESS_PRIVATE,
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
        });
      }
    }
  });

  return AcNotification;
};
