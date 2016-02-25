var async = require("async");

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
    notifications_settings: { type: DataTypes.JSON },
    interaction_profile: DataTypes.JSONB,
    counter_login: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_login_at: DataTypes.DATE,
    social_points: DataTypes.INTEGER,
    legacy_passwords_disabled: { type: DataTypes.BOOLEAN, defaultValue: false }
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
      }
    ],

    classMethods: {
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
        User.belongsToMany(models.Domain, { as: 'DomainAdmin', through: 'DomainAdmin' });
        User.belongsToMany(models.Community, { as: 'CommunityAdmin', through: 'CommunityAdmin' });
        User.belongsToMany(models.Group, { as: 'GroupAdmin', through: 'GroupAdmin' });
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
            sequelize.models.UserLegacyPassword.findAll({
              where: { user_id: this.id }
            }).then(function(passwords) {
              passwords.map( function(legacyPassword) {
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
