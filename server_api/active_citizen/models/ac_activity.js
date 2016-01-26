"use strict";

// Currently using Sequelize and Postgresql for fastest possible implementataion.
// Those model classes could be relatively easily replaces by another database layers
// Ideally there should be a modular interface for the model layer. All activities are saved to
// elastic search through the logs. Based on https://www.w3.org/TR/activitystreams-core/

var async = require("async");
var log = require('../utils/logger');
var queue = require('../workers/queue');
var toJson = require('../utils/to_json');

var setupDefaultAssociations = function (activity, user, domain, community, done) {
  async.parallel([
    function(callback) {
      activity.setDomain(domain).then(function (results) {
        callback(results ? null : true);
      });
    },
    function(callback) {
      if (user) {
        activity.setUser(user).then(function (results) {
          callback(results ? null : true);
        });
      } else {
        callback();
      }
    },
    function(callback) {
      if (community) {
        activity.setCommunity(community).then(function (results) {
          callback(results ? null : true);
        });
      } else {
        callback();
      }
    }
  ], function(error) {
    done(error)
  });
};

module.exports = function(sequelize, DataTypes) {
  var AcActivity = sequelize.define("AcActivity", {
    access: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    type_name: { type: DataTypes.STRING, allowNull: true },
    object: DataTypes.JSONB,
    actor: DataTypes.JSONB,
    target: DataTypes.JSONB,
    context: DataTypes.JSON,
    user_interaction_profile: DataTypes.JSONB
  }, {

    underscored: true,

    tableName: 'ac_activities',

    classMethods: {

      ACCESS_PUBLIC: 0,
      ACCESS_COMMUNITY: 1,
      ACCESS_GROUP: 2,
      ACCESS_PRIVATE: 3,

      associate: function(models) {
        AcActivity.belongsTo(models.Domain);
        AcActivity.belongsTo(models.Community);
        AcActivity.belongsTo(models.Group);
        AcActivity.belongsTo(models.Post);
        AcActivity.belongsTo(models.Point);
        AcActivity.belongsTo(models.Invite);
        AcActivity.belongsTo(models.User);
        AcActivity.belongsToMany(models.User, { through: 'OtherUsers' });
      },

      ACTIVITY_PASSWORD_RECOVERY: 0,
      ACTIVITY_PASSWORD_CHANGED: 1,
      ACTIVITY_FROM_APP: 2,

      createActivity: function(type, subType, actor, object, context, user, domain, community, done) {

        if (!object)
          object = {};

        if (!context)
          context = {};

        if (!actor)
          actor = {};

        if (user)
          actor['user'] = user.simple();

        if (domain)
          object['domain'] = domain.simple();

        if (community)
          object['community'] = community.simple();

        sequelize.models.AcActivity.build({
          type: type,
          sub_type: subType,
          actor: actor,
          object: object,
          context: context,
          access: sequelize.models.AcActivity.ACCESS_PRIVATE
        }).save().then(function(activity) {
          if (activity) {
            setupDefaultAssociations(activity, user, domain, community, function (error) {
              if (error) {
                log.error('Activity Creation Error', error);
                done('Activity Creation Error');
              } else {
                queue.create('process-activity', activity).priority('critical').removeOnComplete(true).save();
                log.info('Activity Created', { activity: toJson(activity), user: toJson(user) });
                done(null);
              }
            });
          } else {
            done('Activity Not Found');
          }
        }).catch(function(error) {
          log.error('Activity Created Error', { err: error });
          done(error);
        });
      },

      createPasswordRecovery: function(user, domain, community, token, done) {

        var activity = models.AcActivity.build({
          type: models.AcActivity.ACTIVITY_PASSWORD_RECOVERY,
          actor: { user: user },
          object: {
            domain: domain,
            community: community,
            token: token
          },
          access: models.AcActivity.ACCESS_PRIVATE
        });

        activity.save().then(function(activity) {
          if (activity) {
            setupDefaultAssociations(user, domain, community, function (error) {
              if (error) {
                log.error('Activity Creation Error', err);
                done('Activity Creation Error');
              } else {
                queue.create('process-activity', activity).priority('critical').removeOnComplete(true).save();
                log.info('Activity Created', { activity: toJson(activity), user: toJson(user)});
                done(null);
              }
            });
          } else {
            done('Activity Not Found');
          }
       }).catch(function(error) {
          log.error('Activity Created Error', { err: error });
          done(error);
        });
      }
    }
  });

  return AcActivity;
};