var async = require("async");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var parseDomain = require('parse-domain');

"use strict";

// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  var Community = sequelize.define("Community", {
    name: { type: DataTypes.STRING, allowNull: false },
    hostname: { type: DataTypes.STRING, allowNull: false },
    access: { type: DataTypes.INTEGER, allowNull: false }, // 0: public, 1: closed, 2: secret
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    default_locale: { type: DataTypes.STRING },
    google_analytics_code: { type: DataTypes.STRING, allowNull: true },
    description: DataTypes.TEXT,
    website: DataTypes.TEXT,
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    weight: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
    counter_posts: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_groups: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_organizations: { type: DataTypes.INTEGER, defaultValue: 0 },
    only_admins_can_create_groups: { type: DataTypes.BOOLEAN, defaultValue: false },
    theme_id: { type: DataTypes.INTEGER, defaultValue: null },
    other_social_media_info: DataTypes.JSONB,
    configuration:  DataTypes.JSONB
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    underscored: true,

    tableName: 'communities',

    instanceMethods: {

      simple: function() {
        return { id: this.id, name: this.name, hostname: this.hostname };
      },

      updateAllExternalCounters: function(req, direction, column, done) {
        if (direction=='up')
          req.ypDomain.increment(column);
        else if (direction=='down')
          req.ypDomain.decrement(column);
        done();
      },

      setupLogoImage: function(body, done) {
        if (body.uploadedLogoImageId) {
          sequelize.models.Image.find({
            where: {id: body.uploadedLogoImageId}
          }).then(function (image) {
            if (image)
              this.addCommunityLogoImage(image);
            done();
          }.bind(this));
        } else done();
      },

      setupHeaderImage: function(body, done) {
        if (body.uploadedHeaderImageId) {
          sequelize.models.Image.find({
            where: {id: body.uploadedHeaderImageId}
          }).then(function (image) {
            if (image)
              this.addCommunityHeaderImage(image);
            done();
          }.bind(this));
        } else done();
      },

      getImageFormatUrl: function(formatId) {
        if (this.CommunityLogoImages && this.CommunityLogoImages.length>0) {
          var formats = JSON.parse(this.CommunityLogoImages[this.CommunityLogoImages.length-1].formats);
          if (formats && formats.length>0)
            return formats[formatId];
        } else {
          return "";
        }
      },

      setupImages: function(body, done) {
        async.parallel([
          function(callback) {
            this.setupLogoImage(body, function (err) {
              if (err) return callback(err);
              callback();
            });
          }.bind(this),
          function(callback) {
            this.setupHeaderImage(body, function (err) {
              if (err) return callback(err);
              callback();
            });
          }.bind(this)
        ], function(err) {
          done(err);
        });
      }
    },

    classMethods: {

      ACCESS_PUBLIC: 0,
      ACCESS_CLOSED: 1,
      ACCESS_SECRET: 2,

      setYpCommunity: function (req,res,next) {
        var hostname = null;
        var parsedDomain = parseDomain(req.headers.host);

        if (parsedDomain && parsedDomain.subdomain) {
          hostname = parsedDomain.subdomain;
        }

        if (hostname!=null) {
          if (hostname.indexOf('betri-hverfi-2015') > -1) {
            hostname = "betri-hverfi-2015";
          } else if (hostname.indexOf('betri-hverfi-2014') > -1) {
            hostname = "betri-hverfi-2014";
          } else if (hostname.indexOf('betri-hverfi-2013') > -1) {
            hostname = "betri-hverfi-2013";
          } else if (hostname.indexOf('betri-hverfi-2012') > -1) {
            hostname = "betri-hverfi-2012";
          }
        }

        if (!hostname && req.params.communityHostname)
          hostname = req.params.communityHostname;

        if (hostname && hostname!="" && hostname!="www" && hostname!="new") {
          //log.info("PARSE 3", {hostname: hostname});
          Community.find({
            where: {hostname: hostname}
          }).then(function (community) {
            //log.info("PARSE 4", {hostname: hostname, community: community});
            if (community) {
              req.ypCommunity = community;
              next();
            } else {
              log.warn('Cant find community', { user: toJson(req.user), context: 'setYpCommunity', err: 'Community not found', errorStatus: 404 });
              req.ypCommunity = {
                id: null,
                hostname: 'not_found'
              };
              next();
            }
          }.bind(this));
        } else {
          req.ypCommunity = {
            id: null,
            hostname: 'not_found_or_domain_level'
          };
          next();
        }
      },

      convertAccessFromRadioButtons: function(body) {
        var access = 0;
        if (body.public) {
          access = 0;
        } else if (body.closed) {
          access = 1;
        } else if (body.secret) {
          access = 2;
        }
        return access;
      },

      associate: function(models) {
        Community.hasMany(models.Group, { foreignKey: "community_id" });
        Community.belongsTo(models.Domain, {foreignKey: "domain_id"});
        Community.belongsTo(models.User);
        Community.belongsToMany(models.Image, { as: 'CommunityLogoImages', through: 'CommunityLogoImage' });
        Community.belongsToMany(models.Image, { as: 'CommunityHeaderImages', through: 'CommunityHeaderImage' });
        Community.belongsToMany(models.User, { as: 'CommunityUsers', through: 'CommunityUser' });
        Community.belongsToMany(models.User, { as: 'CommunityAdmins', through: 'CommunityAdmin' });
      }
    }
  });

  return Community;
};
