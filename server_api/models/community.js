"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Community = sequelize.define("Community", {
    name: DataTypes.STRING,
    hostname: DataTypes.STRING,
    description: DataTypes.TEXT,
    access: DataTypes.INTEGER,
    website: DataTypes.TEXT,
    counter_groups: DataTypes.INTEGER,
    counter_users: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'communities',

    instanceMethods: {

      setupLogoImage: function(body, done) {
        if (body.uploadedLogoImageId) {
          models.Image.find({
            where: {id: body.uploadedLogoImageId}
          }).then(function (image) {
            if (image)
              this.addCommunityLogoImage(image);
            done();
          });
        } else done();
      },

      setupHeaderImage: function(body, done) {
        if (body.uploadedHeaderImageId) {
          models.Image.find({
            where: {id: body.uploadedHeaderImageId}
          }).then(function (image) {
            if (image)
              this.addCommunityHeaderImage(image);
            done();
          });
        } else done();
      },

      setupImages: function(body, done) {
        async.parallel([
          function(callback) {
            this.setupLogoImage(req.body, function (err) {
              if (err) return callback(err);
              callback();
            });
          },
          function(callback) {
            this.setupHeaderImage(req.body, function (err) {
              if (err) return callback(err);
              callback();
            });
          }
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
        Community.belongsToMany(models.User, { through: 'CommunityUser' });
        Community.belongsTo(models.User);
        Community.belongsToMany(models.Image, { as: 'CommunityLogoImages', through: 'CommunityLogoImage' });
        Community.belongsToMany(models.Image, { as: 'CommunityHeaderImages', through: 'CommunityHeaderImage' });
      }
    }
  });

  return Community;
};
