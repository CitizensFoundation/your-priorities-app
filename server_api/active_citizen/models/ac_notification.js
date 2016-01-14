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

      NOTIFICATION_PASSWORD_RECOVERY: 0,

      associate: function(models) {
        AcNotification.belongsTo(models.AcActivity);
        AcNotification.belongsTo(models.User);
      },

      createPasswordRecovery: function(activity, user, community, token) {
        var emailLocals = {};
        emailLocals['user'] = user;
        emailLocals['community'] = community;
        emailLocals['token'] = token;
        emailLocals['subject'] = i18n.t('email.password_recovery');
        emailLocals['template'] = 'password_recovery';


      }
    }
  });

  return AcNotification;
};
