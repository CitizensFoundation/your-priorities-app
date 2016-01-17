"use strict";

// Currently using Sequelize and Postgresql for fastest possible implementataion.
// Those model classes could be relatively easily replaces by another database layers
// Ideally there should be a modular interface for the model layer. All activities are saved to
// elastic search through the logs. Based on https://www.w3.org/TR/activitystreams-core/

var log = require('../utils/logger');
var jobs = require('./jobs');

var setupDefaultAssociations = function (user, domain, community, done) {
  async.paralell([
    function(done) {
      activity.addUser(user, function (err) {
        done();
      });
    },
    function(done) {
      activity.addDomain(domain, function (err) {
        done();
      });
    },
    function(done) {
      activity.addCommunity(community, function (err) {
        done();
      });
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

      createActivity: function(type, user, domain, community, done) {

        var activity = models.AcActivity.build({
          type: type,
          actor: { user: user },
          object: {
            domain: domain,
            community: community
          },
          access: models.AcActivity.ACCESS_PRIVATE
        });

        activity.save().then(function(activity) {
          if (activity) {
            setupDefaultAssociations(user, domain, community, function (error) {
              if (err) {
                log.error('Activity Creation Error', err);
                done('Activity Creation Error');
              } else {
                jobs.create('process-activity', activity).priority('critical').removeOnComplete(true).save();
                log.info('Activity Created', { activity: activity, user: user });
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
              if (err) {
                log.error('Activity Creation Error', err);
                done('Activity Creation Error');
              } else {
                jobs.create('process-activity', activity).priority('critical').removeOnComplete(true).save();
                log.info('Activity Created', { activity: activity, user: user });
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