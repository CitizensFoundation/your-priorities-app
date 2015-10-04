var async = require("async");

"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    name: DataTypes.STRING,
    short_name: DataTypes.STRING,
    top_banner_file_name: DataTypes.STRING,
    logo_file_name: DataTypes.STRING,
    objectives: DataTypes.TEXT,
    counter_ideas: DataTypes.INTEGER,
    counter_points: DataTypes.INTEGER,
    counter_comments: DataTypes.INTEGER,
    counter_users: DataTypes.INTEGER,
    public: DataTypes.BOOLEAN,
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    underscored: true,

    tableName: 'groups',

    instanceMethods: {

      setupLogoImage: function(body, done) {
        if (body.uploadedLogoImageId) {
          sequelize.models.Image.find({
            where: {id: body.uploadedLogoImageId}
          }).then(function (image) {
            if (image)
              this.addGroupLogoImage(image);
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
              this.addGroupHeaderImage(image);
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
      associate: function(models) {
        Group.hasMany(models.Idea, {foreignKey: "group_id"});
        Group.hasMany(models.Point, {foreignKey: "group_id"});
        Group.hasMany(models.Endorsement, {foreignKey: "group_id"});
        Group.hasMany(models.Category, {foreignKey: "group_id"});
        Group.belongsToMany(models.User, { through: 'GroupUser' });
        Group.belongsTo(models.IsoCountry, {foreignKey: "iso_country_id"});
        Group.belongsTo(models.User);
        Group.belongsToMany(models.Image, { through: 'GroupImage' });
        Group.belongsToMany(models.Image, { as: 'GroupLogoImages', through: 'GroupLogoImage' });
        Group.belongsToMany(models.Image, { as: 'GroupHeaderImages', through: 'GroupHeaderImage' });
      }
    }
  });

  return Group;
};
