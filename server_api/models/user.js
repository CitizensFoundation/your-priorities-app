"use strict";

const async = require("async");
const log = require('../utils/logger');
const toJson = require('../utils/to_json');
const _ = require('lodash');

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false },
    ssn: DataTypes.STRING,
    age_group: DataTypes.STRING,
    post_code: DataTypes.STRING,
    my_gender: DataTypes.STRING,
    description: DataTypes.TEXT,
    profile_data: DataTypes.JSONB,
    private_profile_data: DataTypes.JSONB,
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'users',

    defaultScope: {
      where: {
        deleted: false,
        status: 'active'
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        name: 'users_idx_deleted_status',
        fields: ['deleted', 'status']
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
      },
      {
        fields: ['id','deleted']
      },
      {
        fields: ['id','deleted','status']
      }
    ],

    // Add following indexes manually for high throughput sites
    // CREATE INDEX userprofileimage_idx_user_id ON "UserProfileImage" (user_id);
  });

  User.associate = (models) => {
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
    User.belongsToMany(models.Community, { as: 'CommunityPromoters', through: 'CommunityPromoter' });
    User.belongsToMany(models.Group, { as: 'GroupAdmins', through: 'GroupAdmin' });
    User.belongsToMany(models.Group, { as: 'GroupPromoters', through: 'GroupPromoter' });
    User.belongsToMany(models.Organization, { as: 'OrganizationAdmins', through: 'OrganizationAdmin' });
    User.belongsToMany(models.Organization, { as: 'OrganizationUsers', through: 'OrganizationUser' });
    User.belongsToMany(models.Video, { as: 'UserProfileVideos', through: 'UserProfileVideo'});
    User.hasMany(models.Campaign);
  };

  User.defaultAttributesWithSocialMedia = ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id', 'default_locale','legacy_passwords_disabled'];

  User.defaultAttributesWithSocialMediaPublic = ['id', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id','legacy_passwords_disabled'];

  User.defaultAttributesWithSocialMediaPublicAndEmail = ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id','legacy_passwords_disabled'];

  User.serializeSamlUser = (profile, req, callback) => {
    log.info("Serialize SAML user", { context: 'serializeSamlUser', profile: profile });
    if (profile.UserSSN) {
      sequelize.models.User.serializeIslandIsSamlUser(profile, callback);
    } else if (profile["urn:mynj:userCode"] || profile.issuer === 'https://my.state.nj.us/idp/shibboleth') {
      sequelize.models.User.serializeMyNJSamlUser(profile, req, callback);
    } else {
      callback("Can't find SAML serialize handler");
    }
  };

  User.serializeMyNJSamlUser = (profile, req, callback) => {
    log.info("User Serialized In Serialize MyNJ SAML User", {context: 'serializeSamlUser', profile: profile});
    let email = null;
    let user;
    async.series([
      (seriesCallback) => {
        if (!profile["urn:mynj:userCode"] ||
          (req.ypDomain.configuration &&
            req.ypDomain.configuration.forceSecureSamlEmployeeLogin &&
            !profile["urn:mynj:pubEmpAgency"])) {
          log.info("User not allowed access through MyNJ", {context: 'serializeSamlUser', profile: profile});
          seriesCallback("customError");
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        sequelize.models.User.findOne({
          where: {
            ssn: profile["urn:mynj:userCode"]
          },
          attributes: ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'profile_data', 'github_id', 'twitter_id', 'ssn', 'legacy_passwords_disabled']
        }).then((userIn) => {
          if (userIn) {
            user = userIn;
            log.info("User Serialized Found MyNJ SAML User", {context: 'serializeSamlUser', userSsn: user.ssn});
            seriesCallback();
          } else {
            seriesCallback();
          }
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        if (!user) {
          email = profile["urn:mynj:pubEmpEmail"];
          if (email) {
            email = email.toLowerCase();
            sequelize.models.User.findOne({
              where: {
                email: email
              },
              attributes: ['id','email']
            }).then((userByEmail) => {
              if (userByEmail) {
                email = 'my-nj-' + Math.floor(Math.random() * 999) + '.'+email;
              }
              seriesCallback();
            }).catch((error) => {
              seriesCallback(error);
            });
          } else {
            seriesCallback();
          }
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        if (!user) {
          sequelize.models.User.create(
            {
              ssn: profile["urn:mynj:userCode"],
              name: profile.FirstName + ' ' + profile.LastName,
              email: email,
              profile_data: {
                saml_show_confirm_email_completed: email ? false : true,
              },
              private_profile_data: {
                saml_agency: profile["urn:mynj:pubEmpAgency"],
                saml_provider: 'MyNJ'
              },
              notifications_settings: sequelize.models.AcNotification.defaultNotificationSettings,
              status: 'active'
            }).then((userIn) => {
            if (userIn) {
              user = userIn;
              log.info("User Serialized Created MyNJ SAML User", {context: 'serializeSamlUser', userSsn: user.ssn});
              seriesCallback();
            } else {
              seriesCallback("Could not create user from SAML");
            }
          }).catch((error) => {
            seriesCallback(error);
          })
        } else {
          seriesCallback();
        }
      }
    ],  (error) => {
      if (error) {
        callback(error);
      } else {
        callback(null, user);
      }
    });
  };

  User.serializeIslandIsSamlUser = (profile, callback) => {
    log.info("User Serialized In Serialize IslandIs SAML User", { context: 'serializeSamlUser', profile: profile });
    let user;
    async.series([
      (seriesCallback) => {
        sequelize.models.User.findOne({
          where: {
            ssn: profile.UserSSN
          },
          attributes: ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'profile_data', 'github_id', 'twitter_id', 'ssn','legacy_passwords_disabled']
        }).then ((userIn) => {
          if (userIn) {
            user = userIn;
            log.info("User Serialized Found IslandIs SAML User", { context: 'serializeSamlUser', userSsn: user.ssn});
            seriesCallback();
          } else {
            seriesCallback();
          }
        }).catch ((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        if (!user) {
          sequelize.models.User.create(
            {
              ssn: profile.UserSSN,
              name: profile.Name,
              private_profile_data: { saml_provider: 'island.is' },
              notifications_settings: sequelize.models.AcNotification.defaultNotificationSettings,
              status: 'active'
            }).then ((userIn) => {
            if (userIn) {
              user = userIn;
              log.info("User Serialized Created IslandIs SAML User", { context: 'serializeSamlUser', userSsn: user.ssn});
              seriesCallback();
            } else {
              seriesCallback("Could not create user from SAML");
            }
          }).catch ((error) => {
            seriesCallback(error);
          })
        } else {
          seriesCallback();
        }
      }
    ], (error) => {
      if (error) {
        callback(error);
      } else {
        callback(null, user);
      }
    });
  };

  User.serializeFacebookUser = (profile, domain, callback) => {
    let user;
    async.series([
      (seriesCallback) => {
        sequelize.models.User.findOne({
          where: {
            facebook_id: profile.identifier
          },
          attributes: ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id','legacy_passwords_disabled']
        }).then ((userIn) => {
          if (userIn) {
            user = userIn;
            seriesCallback();
          } else {
            seriesCallback();
          }
        }).catch ((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        if (!user && profile.email) {
          sequelize.models.User.findOne({
            where: {
              email: profile.email
            },
            attributes: ['id', 'email', 'description', 'name', 'facebook_id', 'google_id', 'github_id', 'twitter_id','legacy_passwords_disabled']
          }).then ((userIn) => {
            if (userIn) {
              userIn.facebook_id = profile.identifier;
              userIn.save().then((results) => {
                user = userIn;
                seriesCallback();
              });
            } else {
              seriesCallback();
            }
          }).catch ((error) => {
            seriesCallback(error);
          })
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        if (!user) {
          sequelize.models.User.create(
            {
              email: profile.email,
              facebook_id: profile.identifier,
              name: profile.nameDisplay,
              notifications_settings: sequelize.models.AcNotification.defaultNotificationSettings,
              status: 'active'
            }).then ((userIn) => {
            if (userIn) {
              user = userIn;
              seriesCallback();
            } else {
              seriesCallback("Could not create user");
            }
          }).catch ((error) => {
            seriesCallback(error);
          })
        } else {
          seriesCallback();
        }
      }
    ], (error) =>{
      if (error) {
        callback(error);
      } else {
        callback(null, user);
      }
    });
  };

  User.localCallback = (req, email, password, done) => {
    sequelize.models.User.findOne({
      where: { email: email },
      attributes: ['id', 'encrypted_password','legacy_passwords_disabled']
    }).then((user) => {
      if (user) {
        user.validatePassword(password, done);
      } else {
        log.warn("User LocalStrategy Incorrect username", { context: 'localStrategy', user: toJson(user), err: 'Incorrect username', errorStatus: 401 });
        return done(null, false, { message: 'Incorrect username.' });
      }
      return null;
    }).catch((error) => {
      log.error("User LocalStrategy Error", { context: 'localStrategy', err: error, errorStatus: 500 });
      done(error);
    });
  };

  User.getUserWithAll = (userId, callback) => {
    let user, endorsements, pointQualities;

    async.parallel([
      (seriesCallback) => {
        sequelize.models.User.findOne({
          where: {id: userId},
          attributes: _.concat(sequelize.models.User.defaultAttributesWithSocialMediaPublic, ['notifications_settings', 'profile_data', 'email', 'default_locale']),
          order: [
            [{model: sequelize.models.Image, as: 'UserProfileImages'}, 'created_at', 'asc'],
            [{model: sequelize.models.Image, as: 'UserHeaderImages'}, 'created_at', 'asc']
          ],
          include: [
            {
              model: sequelize.models.Image, as: 'UserProfileImages',
              attributes: ['id', 'created_at', 'formats'],
              required: false
            },
            {
              model: sequelize.models.Image, as: 'UserHeaderImages',
              attributes: ['id', 'created_at', 'formats'],
              required: false
            }
          ]
        }).then((userIn) => {
          user = userIn;
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        sequelize.models.Endorsement.findAll({
          where: {user_id: userId},
          attributes: ['id', 'value', 'post_id']
        }).then((endorsementsIn) => {
          endorsements = endorsementsIn;
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        sequelize.models.PointQuality.findAll({
          where: {user_id: userId},
          attributes: ['id', 'value', 'point_id']
        }).then((pointQualitiesIn) => {
          pointQualities = pointQualitiesIn;
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        });
      }
    ], (error) => {
      if (user) {
        user.dataValues.Endorsements = endorsements;
        user.dataValues.PointQualities = pointQualities;
      }
      callback(error, user);
    })
  };

  User.prototype.simple = function () {
    return { id: this.id, name: this.name, email: this.email };
  };

  User.prototype.setLocale = function (i18n, domain, community, done) {
    if (this.default_locale && this.default_locale !== "") {
      i18n.changeLanguage(this.default_locale, (err, t) => {
        done();
      });
    } else if (community && community.default_locale && community.default_locale !== "") {
      i18n.changeLanguage(community.default_locale, (err, t) => {
        done();
      });
    } else {
      i18n.changeLanguage(domain.default_locale, (err, t) => {
        done();
      });
    }
  };

  User.prototype.setupProfileImage = function (body, done) {
    if (body.uploadedProfileImageId) {
      sequelize.models.Image.findOne({
        where: {id: body.uploadedProfileImageId}
      }).then((image) => {
        if (image)
          this.addUserProfileImage(image);
        done();
      });
    } else done();
  };

  User.prototype.setupHeaderImage = function (body, done) {
    if (body.uploadedHeaderImageId) {
      sequelize.models.Image.findOne({
        where: {id: body.uploadedHeaderImageId}
      }).then((image) => {
        if (image)
          this.addUserHeaderImage(image);
        done();
      });
    } else done();
  };

  User.prototype.setupImages = function (body, done) {
    async.parallel([
      (callback) => {
        this.setupProfileImage(body, (err) => {
          if (err) return callback(err);
          callback();
        });
      },
      (callback) => {
        this.setupHeaderImage(body, (err) => {
          if (err) return callback(err);
          callback();
        });
      }
    ], (err) => {
      done(err);
    });
  };

  User.prototype.createPasswordHash = function (password) {
    const salt = bcrypt.genSaltSync(10);
    this.encrypted_password = bcrypt.hashSync(password, salt);
  };

  User.prototype.validatePassword = function (password, done) {
    let verified = this.encrypted_password ? bcrypt.compareSync(password, this.encrypted_password) : null;
    if (verified) {
      done(null, this);
    } else {
      if (this.legacy_passwords_disabled) {
        done(null, false, { message: 'Incorrect password.' });
      } else {
        log.warn("Looking for legacy passwords");
        sequelize.models.User.findOne({
          where: { id: this.id },
          include: [ sequelize.models.UserLegacyPassword ]
        }).then((user) => {
          user.UserLegacyPasswords.map((legacyPassword) => {
            if (bcrypt.compareSync(password, legacyPassword.encrypted_password)) {
              verified = true;
            }
          });
          if (verified) {
            done(null, this);
          } else {
            done(null, false, { message: 'Incorrect password.' });
          }
        });
      }
    }
  };

  return User;
};
