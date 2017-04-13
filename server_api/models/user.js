var async = require("async");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false },
    ssn: DataTypes.STRING,
    age_group: DataTypes.STRING,
    post_code: DataTypes.STRING,
    my_gender: DataTypes.STRING,
    description: DataTypes.TEXT,
    profile_data: DataTypes.JSONB,
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    facebook_id: DataTypes.BIGINT,
    facebook_profile: DataTypes.JSONB,
    twitter_id: DataTypes.BIGINT,
    twitter_profile: DataTypes.JSONB,
    google_id: DataTypes.BIGINT,
    google_profile: DataTypes.JSONB,
    github_id: DataTypes.BIGINT,
    github_profile: DataTypes.JSONB,
    buddy_icon_file_name: DataTypes.STRING,
    twitter_profile_image_url:  DataTypes.STRING,
    encrypted_password: DataTypes.STRING,
    default_locale: DataTypes.STRING,
    reset_password_token: DataTypes.STRING,
    reset_password_expires: DataTypes.DATE,
    notifications_settings: { type: DataTypes.JSONB },
    interaction_profile: DataTypes.JSONB,
    counter_login: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_login_at: DataTypes.DATE,
    social_points: DataTypes.INTEGER,
    legacy_user_id: DataTypes.INTEGER,
    legacy_new_domain_id: DataTypes.INTEGER,
    theme_id: { type: DataTypes.INTEGER, defaultValue: null },
    legacy_passwords_disabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    privacy_settings:  DataTypes.JSONB,
    ignore_list: DataTypes.JSONB
  }, {
    underscored: true,

    timestamps: true,

    tableName: 'users',

    defaultScope: {
      where: {
        deleted: false
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['interaction_profile'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['ssn']
      },
      {
        fields: ['facebook_id']
      },
      {
        fields: ['notifications_settings'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      }
    ],

    classMethods: {

      serializeSamlUser: function (profile, callback) {
        log.info("User Serialized In Serialize SAML User", { context: 'serializeSamlUser', profile: profile });
        var user;
        async.series([
          function (seriesCallback) {
            sequelize.models.User.find({
              where: {
                ssn: profile.UserSSN
              },
              attributes: ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id', 'ssn']
            }).then (function (userIn) {
              if (userIn) {
                user = userIn;
                log.info("User Serialized Found SAML User", { context: 'serializeSamlUser', userSsn: user.ssn});
                seriesCallback();
              } else {
                seriesCallback();
              }
            }).catch (function (error) {
              seriesCallback(error);
            })
          },
          function (seriesCallback) {
            if (!user) {
              sequelize.models.User.create(
                {
                  ssn: profile.UserSSN,
                  name: profile.Name,
                  notifications_settings: sequelize.models.AcNotification.defaultNotificationSettings,
                  status: 'active'
                }).then (function (userIn) {
                if (userIn) {
                  user = userIn;
                  log.info("User Serialized Created SAML User", { context: 'serializeSamlUser', userSsn: user.ssn});
                  seriesCallback();
                } else {
                  seriesCallback("Could not create user from SAML");
                }
              }).catch (function (error) {
                seriesCallback(error);
              })
            } else {
              seriesCallback();
            }
          }
        ], function (error) {
          if (error) {
            callback(error);
          } else {
            callback(null, user);
          }
        });
      },

      serializeFacebookUser: function (profile, callback) {
        var user;
        async.series([
          function (seriesCallback) {
            sequelize.models.User.find({
              where: {
                facebook_id: profile.identifier
              },
              attributes: ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id']
            }).then (function (userIn) {
              if (userIn) {
                user = userIn;
                seriesCallback();
              } else {
                seriesCallback();
              }
            }).catch (function (error) {
              seriesCallback(error);
            })
          },
          function (seriesCallback) {
            if (!user) {
              sequelize.models.User.find({
                where: {
                  email: profile.email
                },
                attributes: ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id']
              }).then (function (userIn) {
                if (userIn) {
                  userIn.facebook_id = profile.identifier;
                  userIn.save().then(function (results) {
                    user = userIn;
                    seriesCallback();
                  });
                } else {
                  seriesCallback();
                }
              }).catch (function (error) {
                seriesCallback(error);
              })
            } else {
              seriesCallback();
            }
          },
          function (seriesCallback) {
            if (!user) {
              sequelize.models.User.create(
                {
                  email: profile.email,
                  facebook_id: profile.identifier,
                  name: profile.nameDisplay,
                  notifications_settings: sequelize.models.AcNotification.defaultNotificationSettings,
                  status: 'active'
              }).then (function (userIn) {
                if (userIn) {
                  user = userIn;
                  seriesCallback();
                } else {
                  seriesCallback("Could not create user");
                }
              }).catch (function (error) {
                seriesCallback(error);
              })
            } else {
              seriesCallback();
            }
          }
        ], function (error) {
          if (error) {
            callback(error);
          } else {
            callback(null, user);
          }
        });
      },

      localCallback: function (req, email, password, done) {
        sequelize.models.User.find({
          where: { email: email },
          attributes: ['id', 'encrypted_password']
        }).then(function(user) {
          if (user) {
            user.validatePassword(password, done);
          } else {
            log.warn("User LocalStrategy Incorrect username", { context: 'localStrategy', user: toJson(user), err: 'Incorrect username', errorStatus: 401 });
            return done(null, false, { message: 'Incorrect username.' });
          }
          return null;
        }).catch(function(error) {
          log.error("User LocalStrategy Error", { context: 'localStrategy', err: error, errorStatus: 500 });
          done(error);
        });
      },

      defaultAttributesWithSocialMedia: ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id', 'default_locale'],

      defaultAttributesWithSocialMediaPublic: ['id', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id'],

      defaultAttributesWithSocialMediaPublicAndEmail: ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id'],

      associate: function(models) {
        User.hasMany(models.Post);
        User.hasMany(models.Point);
        User.hasMany(models.Endorsement);
        User.hasMany(models.PointQuality);
        User.hasMany(models.UserLegacyPassword);
        User.belongsToMany(models.Group, { as: 'GroupUsers', through: 'GroupUser' });
        User.belongsToMany(models.Community, { as: 'CommunityUsers', through: 'CommunityUser' });
        User.belongsToMany(models.Domain, { as: 'DomainUsers', through: 'DomainUser' });
        User.belongsToMany(models.Image, { as: 'UserProfileImages', through: 'UserProfileImage' });
        User.belongsToMany(models.Image, { as: 'UserHeaderImages', through: 'UserHeaderImage' });
        User.belongsToMany(models.Domain, { as: 'DomainAdmins', through: 'DomainAdmin' });
        User.belongsToMany(models.Community, { as: 'CommunityAdmins', through: 'CommunityAdmin' });
        User.belongsToMany(models.Group, { as: 'GroupAdmins', through: 'GroupAdmin' });
        User.belongsToMany(models.Organization, { as: 'OrganizationAdmins', through: 'OrganizationAdmin' });
        User.belongsToMany(models.Organization, { as: 'OrganizationUsers', through: 'OrganizationUser' });
      }
    },

    instanceMethods: {

      simple: function () {
        return { id: this.id, name: this.name, email: this.email };
      },

      setLocale: function (i18n, domain, community, done) {
        if (this.default_locale && this.default_locale != "") {
          i18n.changeLanguage(this.default_locale, function (err, t) {
            done();
          });
        } else if (community && community.default_locale && community.default_locale != "") {
          i18n.changeLanguage(community.default_locale, function (err, t) {
            done();
          });
        } else {
          i18n.changeLanguage(domain.default_locale, function (err, t) {
            done();
          });
        }
      },

      setupProfileImage: function(body, done) {
        if (body.uploadedProfileImageId) {
          sequelize.models.Image.find({
            where: {id: body.uploadedProfileImageId}
          }).then(function (image) {
            if (image)
              this.addUserProfileImage(image);
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
              this.addUserHeaderImage(image);
            done();
          }.bind(this));
        } else done();
      },

      setupImages: function(body, done) {
        async.parallel([
          function(callback) {
            this.setupProfileImage(body, function (err) {
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
      },

      createPasswordHash: function (password) {
        var salt = bcrypt.genSaltSync(10);
        this.encrypted_password = bcrypt.hashSync(password, salt);
      },

      validatePassword: function(password, done) {
        var verified = this.encrypted_password ? bcrypt.compareSync(password, this.encrypted_password) : null;
        if (verified) {
          done(null, this);
        } else {
          if (this.legacy_passwords_disabled) {
            done(null, false, { message: 'Incorrect password.' });
          } else {
            log.warn("Looking for legacy passwords");
            sequelize.models.User.find({
              where: { id: this.id },
              include: [ sequelize.models.UserLegacyPassword ]
            }).then(function(user) {
              user.UserLegacyPasswords.map( function(legacyPassword) {
                if (bcrypt.compareSync(password, legacyPassword.encrypted_password)) {
                  verified = true;
                }
              });
              if (verified) {
                done(null, this);
              } else {
                done(null, false, { message: 'Incorrect password.' });
              }
            }.bind(this));
          }
        }
      }
    }
  });

  return User;
};
