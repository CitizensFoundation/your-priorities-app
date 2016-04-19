var async = require("async");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

"use strict";

// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  var Organization = sequelize.define("Organization", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    address: DataTypes.TEXT,
    phone_number: DataTypes.STRING,
    access: { type: DataTypes.INTEGER, allowNull: false }, // 0: public, 1: closed, 2: secret
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    website: DataTypes.TEXT,
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    weight: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
    theme_id: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    underscored: true,

    tableName: 'organizations',

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
              this.addOrganizationLogoImage(image);
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
              this.addOrganizationHeaderImage(image);
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
        Organization.belongsTo(models.Domain);
        Organization.belongsTo(models.Community);
        Organization.belongsTo(models.User);
        Organization.belongsToMany(models.Image, { as: 'OrganizationLogoImages', through: 'OrganizationLogoImage' });
        Organization.belongsToMany(models.Image, { as: 'OrganizationHeaderImages', through: 'OrganizationHeaderImage' });
        Organization.belongsToMany(models.User, { as: 'OrganizationUsers', through: 'OrganizationUser' });
        Organization.belongsToMany(models.User, { as: 'OrganizationAdmins', through: 'OrganizationAdmin' });
      }
    }
  });

  return Organization;
};
