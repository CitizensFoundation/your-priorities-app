var async = require("async");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

"use strict";

var Community = require('./community');
// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  var Domain = sequelize.define("Domain", {
    name: { type: DataTypes.STRING, allowNull: false },
    domain_name:  { type: DataTypes.STRING, allowNull: false },
    access: { type: DataTypes.INTEGER, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    default_locale: { type: DataTypes.STRING, allowNull: false, default: 'en' },
    description: DataTypes.TEXT,
    message_to_users: DataTypes.STRING,
    message_for_new_idea: DataTypes.STRING,
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    google_analytics_code: { type: DataTypes.STRING, allowNull: true },
    counter_communities: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_groups: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_posts: { type: DataTypes.INTEGER, defaultValue: 0 },
    facebook_client_id: { type: DataTypes.STRING },
    facebook_client_secret: { type: DataTypes.STRING },
    twitter_consumer_key: { type: DataTypes.STRING },
    twitter_consumer_secret: { type: DataTypes.STRING },
    google_consumer_key: { type: DataTypes.STRING },
    google_consumer_secret: { type: DataTypes.STRING },
    github_client_id: { type: DataTypes.STRING },
    github_client_secret: { type: DataTypes.STRING },
    only_admins_can_create_communities: { type: DataTypes.BOOLEAN, defaultValue: false },
    theme_id: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    underscored: true,

    tableName: 'domains',

    instanceMethods: {

      simple: function() {
        return { id: this.id, name: this.name, domain_name: this.domain_name };
      },

      setupLogoImage: function(body, done) {
        if (body.uploadedLogoImageId) {
          sequelize.models.Image.find({
            where: {id: body.uploadedLogoImageId}
          }).then(function (image) {
            if (image)
              this.addDomainLogoImage(image);
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
              this.addDomainHeaderImage(image);
            done();
          }.bind(this));
        } else done();
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

      setYpDomain: function (req,res,next) {
        var domainName = Domain.extractDomain(req.headers.host);
        log.info("DOMAIN: "+req.useragent.source);
        Domain.findOrCreate({where: { domain_name: domainName },
                                      defaults: { access: Domain.ACCESS_PUBLIC,
                                                  default_locale: 'en',
                                                  name: 'New Your Priorities Domain',
                                                  user_agent: req.useragent.source,
                                                  ip_address: req.clientIp}})
            .spread(function(domain, created) {
              if (created) {
                log.info('Domain Created', { domain: toJson(domain.simple()), context: 'create' });
              } else {
                log.info('Domain Loaded', { domain: toJson(domain.simple()), context: 'create' });
              }
              req.ypDomain = domain;
              next();
            });
      },

      extractDomain: function(url) {
        var domain,host,dot;
        domain = url.split(':')[0];
        if (!Domain.isIpAddress(domain)) {
          if ((domain.match(/./g) || []).length>1) {
            dot = domain.indexOf('.');
            domain = domain.substring(dot+1,domain.length);
          }
        }
        return domain;
      },

      extractHost: function(url) {
        var domain,host,dot;
        domain = url.split(':')[0];
        if (!Domain.isIpAddress(domain)) {
          if ((domain.match(/./g) || []).length>1) {
            domain = url.split(':')[0];
            dot = domain.indexOf('.');
            host = domain.substring(0,dot);
            return host;
          }
        }
        return null;
      },

      isIpAddress: function (domain)
      {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(domain)) {
          return true;
        } else {
          return false;
        }
      },

      associate: function(models) {
        Domain.hasMany(models.Community, { foreignKey: "domain_id" });
        Domain.belongsToMany(models.Image, { as: 'DomainLogoImages', through: 'DomainLogoImage' });
        Domain.belongsToMany(models.Image, { as: 'DomainHeaderImages', through: 'DomainHeaderImage' });
        Domain.belongsToMany(models.User, { through: 'DomainUser' });
        Domain.belongsToMany(models.User, { as: 'DomainUsers', through: 'DomainUser' });
        Domain.belongsToMany(models.User, { as: 'DomainAdmin', through: 'DomainAdmin' });
      }
    }
  });

  return Domain;
};
