var async = require("async");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var parseDomain = require('parse-domain');

"use strict";

var Community = require('./community');
// https://www.npmjs.org/package/enum for state of posts

var checkValidKeys = function (keys) {
  return ((keys.client_id && keys.client_id!='') &&
           keys.client_id.length>6 &&
          (keys.client_secret && keys.client_secret != ''))
};

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
    counter_organizations: { type: DataTypes.INTEGER, defaultValue: 0 },
    only_admins_can_create_communities: { type: DataTypes.BOOLEAN, defaultValue: false },
    theme_id: { type: DataTypes.INTEGER, defaultValue: null },
    other_social_media_info: DataTypes.JSONB,
    secret_api_keys: DataTypes.JSONB,
    public_api_keys: DataTypes.JSONB,
    info_texts: DataTypes.JSONB,
    configuration:  DataTypes.JSONB
  }, {
    underscored: true,

    tableName: 'domains',

    instanceMethods: {

      simple: function() {
        return { id: this.id, name: this.name, domain_name: this.domain_name };
      },

      ensureApiKeySetup: function () {
        if (!this.secret_api_keys) {
          this.secret_api_keys = {
            facebook: {},
            google: {},
            github: {},
            twitter: {}
          }
        }
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

      getImageFormatUrl: function(formatId) {
        if (this.DomainLogoImages && this.DomainLogoImages.length>0) {
          var formats = JSON.parse(this.DomainLogoImages[this.DomainLogoImages.length-1].formats);
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

      defaultAttributesPublic: ['id', 'name', 'domain_name', 'access', 'deleted', 'description',
        'default_locale', 'message_to_users', 'message_for_new_idea','google_analytics_code',
        'counter_communities','counter_users','counter_groups','counter_points','counter_posts',
        'counter_organizations','only_admins_can_create_communities','theme_id','other_social_media_info',
        'public_api_keys','info_texts'],

      getLoginProviders: function (req, callback) {
        var providers = [];

        providers.push(
          {
            name            : 'local-strategy',
            provider        : 'local',
            protocol        : 'local',
            strategyObject  : 'Strategy',
            strategyPackage : 'passport-local',
            clientID        : 'false',
            clientSecret    : 'false',
            scope           : [],
            fields          : null,
            urlCallback     : 'http://localhost/callback/users/auth/local-strategy-1/callback'
          }
        );

        sequelize.models.Domain.findAll().then(function(domains) {
          async.eachSeries(domains, function (domain, seriesCallback) {

            var callbackDomainName;
            if (process.env.STAGING_SETUP) {
              if (domain.domain_name=='betrireykjavik.is') {
                callbackDomainName = 'betri.'+domain.domain_name;
              } else if (domain.domain_name=='betraisland.is') {
                callbackDomainName = 'betra.'+domain.domain_name;
              } else if (domain.domain_name=='yrpri.org') {
                callbackDomainName = 'beta.'+domain.domain_name;
              } else {
                callbackDomainName = domain.domain_name;
              }
            } else {
              callbackDomainName = req.headers.host; //domain.domain_name;
            }
            
            if (false && domain.secret_api_keys && checkValidKeys(domain.secret_api_keys.google)) {
              providers.push({
                name            : 'google-strategy-'+domain.id,
                provider        : 'google',
                protocol        : 'oauth2',
                strategyObject  : 'Strategy',
                strategyPackage : 'passport-google-oauth',
                clientID        : domain.secret_api_keys.google.client_id,
                clientSecret    : domain.secret_api_keys.google.client_secret,
                scope           : ['email', 'profile'],
                fields          : null,
                urlCallback     : 'https://'+callbackDomainName+'/api/users/auth/google/callback'
              });
            }

            if (domain.secret_api_keys && checkValidKeys(domain.secret_api_keys.facebook)) {
              providers.push({
                name            : 'facebook-strategy-'+domain.id,
                provider        : 'facebook',
                protocol        : 'oauth2',
                strategyObject  : 'Strategy',
                strategyPackage : 'passport-facebook',
                clientID        : domain.secret_api_keys.facebook.client_id,
                clientSecret    : domain.secret_api_keys.facebook.client_secret,
                scope           : ['email'],
                fields          : ['id', 'displayName', 'email'],
                // urlCallback     : 'http://fbtest.betrireykjavik.is:4242/api/users/auth/facebook/callback'
                urlCallback     : 'https://'+callbackDomainName+'/api/users/auth/facebook/callback'
              });
            }

            if (domain.secret_api_keys && domain.secret_api_keys.saml &&
                domain.secret_api_keys.saml.entryPoint && domain.secret_api_keys.saml.entryPoint!='' &&
                domain.secret_api_keys.saml.entryPoint.length>6) {
              providers.push({
                name            : 'saml-strategy-'+domain.id,
                provider        : 'saml',
                protocol        : 'saml',
                strategyObject  : 'Strategy',
                strategyPackage : 'passport-saml',
                certInPemFormat : true,
                entryPoint      : domain.secret_api_keys.saml.entryPoint,
                cert            : null, //domain.secret_api_keys.saml.cert,
                callbackUrl     : null //'https://'+callbackDomainName+'/authenticate_from_island_is' //(domain.secret_api_keys.saml.callbackUrl && domain.secret_api_keys.saml.callbackUrl!="") ? domain.secret_api_keys.saml.callbackUrl : null
              });
            }
            seriesCallback();
          }, function (error) {
            callback(error, providers);
          });
          return null;
        }).catch(function (error) {
          callback(error);
        });
      },

      getLoginHosts: function (callback) {
        var hosts = [];
        hosts.push('127.0.0.1');
        hosts.push('localhost');

        sequelize.models.Domain.findAll().then(function(domains) {
          async.eachSeries(domains, function (domain, seriesCallback) {
            hosts.push(domain.domain_name);
            seriesCallback();
          }, function (error) {
            callback(error, hosts);
          });
          return null;
        }).catch(function (error) {
          callback(error);
        });
      },

      setYpDomain: function (req,res,next) {
        var domainName;
        var parsedDomain = parseDomain(req.headers.host);
        if (parsedDomain && parsedDomain.domain) {
          domainName = parsedDomain.domain+'.'+parsedDomain.tld;
        } else if (parsedDomain) {
          domainName = parsedDomain.tld;
        } else {
          domainName = 'localhost';
        }
        log.info("DOMAIN NAME", { domainName: domainName });

        Domain.findOrCreate({where: { domain_name: domainName },
                                      defaults: { access: Domain.ACCESS_PUBLIC,
                                                  default_locale: 'en',
                                                  name: 'New Domain',
                                                  user_agent: req.useragent.source,
                                                  ip_address: req.clientIp}})
        .spread(function(domain, created) {
          if (created) {
            log.info('Domain Created', { domain: toJson(domain.simple()), context: 'create' });
          } else {
            //log.info('Domain Loaded', { domain: toJson(domain.simple()), context: 'create' });
          }
          req.ypDomain = domain;
          if (req.url.indexOf('/auth') > -1 || req.url.indexOf('/users/') > -1) {
            sequelize.models.Domain.getLoginProviders(req, function (error, providers) {
              req.ypDomain.loginProviders = providers;
              sequelize.models.Domain.getLoginHosts(function (error, hosts) {
                req.ypDomain.loginHosts = hosts;
                return next();
              });
            });
          } else {
            return next();
          }
          return null;
        }).catch(function (error) {
          next(error);
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
        Domain.belongsToMany(models.User, { as: 'DomainAdmins', through: 'DomainAdmin' });
      }
    }
  });

  return Domain;
};
