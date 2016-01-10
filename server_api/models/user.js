var async = require("async");

"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    facebook_uid: DataTypes.INTEGER,
    buddy_icon_file_name: DataTypes.STRING,
    twitter_profile_image_url:  DataTypes.STRING,
    encrypted_password: DataTypes.STRING
  }, {
    underscored: true,

    timestamps: true,

    tableName: 'users',

    classMethods: {
      associate: function(models) {
        User.hasMany(models.Idea);
        User.hasMany(models.Point);
        User.hasMany(models.Endorsement);
        User.hasMany(models.PointQuality);
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
        var verified = bcrypt.compareSync(password, this.encrypted_password);
        if (verified) {
          done(null, this);
        } else {
          models.UserLegacyPassword.findAll({
            where: { user_id: this.id }
          }).then(function(passwords) {
            passwords.map( function(legacyPassword) {
              if (bcrypt.compareSync(legacyPassword, this.encrypted_password)) {
                return verified;
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
  });

  return User;
};
