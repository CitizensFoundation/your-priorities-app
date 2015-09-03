"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    login: DataTypes.STRING,
    facebook_uid: DataTypes.INTEGER,
    buddy_icon_file_name: DataTypes.STRING,
    twitter_profile_image_url:  DataTypes.STRING
  }, {
    underscored: true,

    timestamps: true,

    tableName: 'users',

    classMethods: {
      associate: function(models) {
        User.hasMany(models.Idea);
        User.hasMany(models.Point);
        User.hasMany(models.Endorsement);
      }
    },

    instanceMethods: {
      verifyPassword: function(password, done) {
        var verified = bcrypt.compareSync(password, this.encrypted_password);
        if (verified) {
          done(true);
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
              done(null, user);
            } else {
              done(null, false, { message: 'Incorrect password.' });
            }
          });
        }
      }
    }
  });

  return User;
};
