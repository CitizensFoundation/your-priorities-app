"use strict";

var queue = require('../workers/queue');
var log = require('../utils/logger');

module.exports = function(sequelize, DataTypes) {
  var AcNotification = sequelize.define("AcNotification", {
    priority: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    access: { type: DataTypes.INTEGER, allowNull: false },
    sent_email: { type: DataTypes.INTEGER, allowNull: false, default: false },
    sent_push: { type: DataTypes.INTEGER, allowNull: false, default: false },
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

        var notification = models.AcActivity.build({
          type: AcNotification.NOTIFICATION_PASSWORD_RECOVERY,
          priority: 100,
          access: AcNotification.ACCESS_PRIVATE
        });

        notification.save().then(function(notification) {
          if (notification) {
            async.paralell([
              function(done) {
                notification.addActivity(activity, function (err) {
                  done();
                });
              },
              function(done) {
                notification.addUser(user, function (err) {
                  done();
                });
              }
            ], function(err) {
              if (err) {
                log.error('Notification Creation Error', { err: err, user: user });
                done();
              } else {
                queue.create('process-notification', notification).priority('critical').removeOnComplete(true).save();
                log.info('Notification Created', { notification: notification, user: user });
                done();
              }
            });
          } else {
            log.error('Notification Creation Error', { err: err, user: user });
            done();
          }
        });
      }
    }
  });

  return AcNotification;
};
