"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
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
        User.belongsToMany(models.Group, { through: 'GroupUser' });
        User.belongsToMany(models.Community, { through: 'CommunityUser' });
      }
    },

    instanceMethods: {
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
          });
        }
      }
    }
  });

  return User;
};
