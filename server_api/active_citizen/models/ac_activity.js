"use strict";

// Currently using Sequelize and Postgresql for fastest possible implementataion.
// Those model classes could be relatively easily replaces by another database layers
// Ideally there should be a modular interface for the model layer. All activities are saved to
// elastic search through the logs. Based on https://www.w3.org/TR/activitystreams-core/

var log = require('../utils/logger');
var queue = require('../workers/queue');
var toJson = require('../utils/to_json');

var setupDefaultAssociations = function (user, domain, community, done) {
  async.paralell([
    function(done) {
      activity.addDomain(domain, function (error) {
        done(error);
      });
    },
    function(done) {
      if (user) {
        activity.addUser(user, function (error) {
          done(error);
        });
      } else {
        done();
      }
    },
    function(done) {
      if (community) {
        activity.addCommunity(community, function (error) {
          done(error);
        });
      } else {
        done();
      }
    }
  ], function(error) {
    done(error)
  });
};

module.exports = function(sequelize, DataTypes) {
  var AcActivity = sequelize.define("AcActivity", {
    context: { type: DataTypes.STRING, default: 'http://www.w3.org/ns/activitystreams' },
    access: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    type_name: { type: DataTypes.STRING, allowNull: true },
    object: DataTypes.JSONB,
    actor: DataTypes.JSONB,
    target: DataTypes.JSONB,
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

      createActivity: function(type, typeName, objectName, actorName, user, domain, community, done) {

        var actor = {};
        var object = {};

        if (actorName)
          actor['name'] = actorName;

        if (user)
          actor['loggedInUserId'] = user.id;

        if (objectName)
          object['name'] = objectName;

        if (domain)
          object['domain'] = domain;

        if (community)
          object['community'] = community;

        var activity = models.AcActivity.build({
          type: type,
          type_name: typeName,
          actor: actor,
          object: object,
          access: models.AcActivity.ACCESS_PRIVATE
        });

        activity.save().then(function(activity) {
          if (activity) {
            setupDefaultAssociations(user, domain, community, function (error) {
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