"use strict";

// https://www.w3.org/TR/activitystreams-core/

module.exports = function(sequelize, DataTypes) {
  var AcActivity = sequelize.define("AcActivity", {
    context: { type: DataTypes.STRING, default: 'http://www.w3.org/ns/activitystreams' },
    access: { type: DataTypes.INTEGER, allowNull: false },
    type: DataTypes.STRING,
    object: DataTypes.JSONB,
    actor: DataTypes.JSONB,
    target: DataTypes.JSONB
  }, {

    underscored: true,

    tableName: 'ac_activities',

    classMethods: {

      ACCESS_PUBLIC: 0,
      ACCESS_COMMUNITY: 1,
      ACCESS_GROUP: 2,
      ACCESS_PRIVATE: 3,

      associate: function(models) {
        AcActivity.belongsTo(models.Group);
        AcActivity.belongsTo(models.Post);
        AcActivity.belongsTo(models.Point);
        AcActivity.belongsTo(models.User);
        AcActivity.belongsToMany(models.User, { through: 'OtherUsers' });
      },

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

    }
  });

  return AcActivity;
};
