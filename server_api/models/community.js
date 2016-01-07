var async = require("async");

"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Community = sequelize.define("Community", {
    name: DataTypes.STRING,
    hostname: DataTypes.STRING,
    description: DataTypes.TEXT,
    access: DataTypes.INTEGER,
    website: DataTypes.TEXT,
    counter_ideas: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_groups: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    underscored: true,

    tableName: 'communities',

    instanceMethods: {

      updateAllExternalCounters: function(req, direction, done) {
        if (direction=='up')
          req.ypDomain.increment('counter_communities');
        else if (direction=='down')
          req.ypDomain.decrement('counter_communities');
        done();
      },

      setupLogoImage: function(body, done) {
        if (body.uploadedLogoImageId) {
          sequelize.models.Image.find({
            where: {id: body.uploadedLogoImageId}
          }).then(function (image) {
            if (image)
              this.addCommunityLogoImage(image);
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
              this.addCommunityHeaderImage(image);
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

      setYpCommunity: function (req,res,next) {
        var hostname = sequelize.models.Domain.extractHost(req.headers.host);
        if (!hostname && req.params.communityHostname)
          hostname = req.params.communityHostname;
        if (hostname && hostname!="www" && hostname!="new") {
          Community.find({
            where: {hostname: hostname}
          }).then(function (community) {
            if (community) {
              req.ypCommunity = community;
              next();
            } else {
              res.sendStatus(404);
            }
          }.bind(this));
        } else {
          next();
        }
      },

      convertAccessFromRadioButtons: function(body) {
        var access = 0;
        if (body.public) {
          access = 2;
        } else if (body.closed) {
          access = 1;
        } else if (body.secret) {
          access = 0;
        }
        return access;
      },

      associate: function(models) {
        Community.hasMany(models.Group, { foreignKey: "community_id" });
        Community.belongsTo(models.Domain, {foreignKey: "domain_id"});
        Community.belongsToMany(models.User, { as: 'CommunityUsers', through: 'CommunityUser' });
        Community.belongsTo(models.User);
        Community.belongsToMany(models.Image, { as: 'CommunityLogoImages', through: 'CommunityLogoImage' });
        Community.belongsToMany(models.Image, { as: 'CommunityHeaderImages', through: 'CommunityHeaderImage' });
        Community.belongsToMany(models.User, { as: 'CommunityAdmin', through: 'CommunityAdmin' });
      }
    }
  });

  return Community;
};
