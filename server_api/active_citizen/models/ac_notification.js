"use strict";

var jobs = require('./jobs');

module.exports = function(sequelize, DataTypes) {
  var AcNotification = sequelize.define("AcNotification", {
    priority: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    access: { type: DataTypes.INTEGER, allowNull: false },
    sent_email: { type: DataTypes.INTEGER, allowNull: false, default: false },
    sent_push: { type: DataTypes.INTEGER, allowNull: false, default: false }
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
        var domain = activity.actor.domain;
        var community = activity.actor.community;

        var notification = models.AcActivity.build({
          type: AcNotification.NOTIFICATION_PASSWORD_RECOVERY,
          priority: 100,
          access: AcNotification.ACCESS_PRIVATE
        });

        notification.save().then(function(notification) {
          if (notification) {
            async.paralell([
              function(done) {
                notifcation.addUser(user, function (err) {
                  done();
                });
              },
              function(done) {
                notifcation.addDomain(domain, function (err) {
                  done();
                });
              },
              function(done) {
                notifcation.addCommunity(community, function (err) {
                  done();
                });
              }
            ], function(err) {
              if (err) {
                //TODO: Send error
                done();
              } else {
                var emailLocals = {};
                emailLocals['user'] = user;
                emailLocals['community'] = community;
                emailLocals['domain'] = domain;
                emailLocals['token'] = activity.object.token;
                emailLocals['subject'] = i18n.t('email.password_recovery');
                emailLocals['template'] = 'password_recovery';
                jobs.create('send-one-email', emailLocals).priority('critical').removeOnComplete(true).save();
                done();
              }
            });
          } else {
            //TODO: Send error
            done();
          }
        });
      }
    }
  });

  return AcNotification;
};
