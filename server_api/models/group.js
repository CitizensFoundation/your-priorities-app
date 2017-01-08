var async = require("async");

"use strict";

// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    name: { type: DataTypes.STRING, allowNull: false },
    access: { type: DataTypes.INTEGER, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    google_analytics_code: { type: DataTypes.STRING, allowNull: true },
    objectives: DataTypes.TEXT,
    message_for_new_idea: DataTypes.TEXT,
    message_to_users: DataTypes.TEXT,
    weight: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
    counter_posts: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
    theme_id: { type: DataTypes.INTEGER, defaultValue: null },
    configuration: DataTypes.JSONB
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    underscored: true,

    tableName: 'groups',

    indexes: [
      {
        fields: ['name'],
        where: {
          deleted: false
        }
      }
    ],

    instanceMethods: {

      simple: function() {
        return { id: this.id, name: this.name };
      },

      updateAllExternalCounters: function(req, direction, column, done) {
        async.parallel([
          function(callback) {
            sequelize.models.Community.find({
              where: {id: this.community_id}
            }).then(function (community) {
              if (direction=='up')
                community.increment(column);
              else if (direction=='down')
                community.decrement(column);
              callback();
            }.bind(this));
          }.bind(this),
          function(callback) {
            if (req.ypDomain) {
              if (direction=='up')
                req.ypDomain.increment(column);
              else if (direction=='down')
                req.ypDomain.decrement(column);
              callback();
            } else {
              callback();
            }
          }.bind(this)
        ], function(err) {
          done(err);
        });
      },

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

      getImageFormatUrl: function(formatId) {
        if (this.GroupLogoImages && this.GroupLogoImages.length>0) {
          var formats = JSON.parse(this.GroupLogoImages[this.GroupLogoImages.length-1].formats);
          if (formats && formats.length>0)
            return formats[formatId];
        } else {
          return "";
        }
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
      ACCESS_OPEN_TO_COMMUNITY: 3,

      addUserToGroupIfNeeded: function (groupId, req, done) {
        sequelize.models.Group.find({
          where: { id: groupId }
        }).then(function (group) {
          group.hasGroupUser(req.user).then(function(result) {
            if (!result) {
              async.parallel([
                function(callback) {
                  group.addGroupUser(req.user).then(function (result) {
                    group.increment('counter_users');
                    callback();
                  })
                },
                function(callback) {
                  sequelize.models.Community.find({
                    where: {id: group.community_id}
                  }).then(function (community) {
                    community.hasCommunityUser(req.user).then(function(result) {
                      if (result) {
                        callback();
                      } else {
                        community.addCommunityUser(req.user).then(function (result) {
                          community.increment('counter_users');
                          callback();
                        });
                      }
                    });
                  }.bind(this));
                }.bind(this),
                function(callback) {
                  req.ypDomain.hasDomainUser(req.user).then(function(result) {
                    if (result) {
                      callback();
                    } else {
                      req.ypDomain.addDomainUser(req.user).then(function(result) {
                        req.ypDomain.increment('counter_users');
                        callback();
                      });
                    }
                  });
                }.bind(this)
              ], function(err) {
                console.log(err);
                done(err);
              });
            } else {
              done();
            }
          });
        })
      },

      convertAccessFromRadioButtons: function(body) {
        var access = 0;
        if (body.public) {
          access = 0;
        } else if (body.closed) {
          access = 1;
        } else if (body.secret) {
          access = 2;
        } else if (body.open_to_community) {
          access = 3;
        }
        return access;
      },
      
      associate: function(models) {
        Group.hasMany(models.Post, { foreignKey: "group_id" });
        Group.hasMany(models.Point, { foreignKey: "group_id" });
        Group.hasMany(models.Endorsement, { foreignKey: "group_id" });
        Group.hasMany(models.Category, { foreignKey: "group_id" });
        Group.belongsTo(models.Community);
        Group.belongsTo(models.IsoCountry, { foreignKey: "iso_country_id" });
        Group.belongsTo(models.User);
        Group.belongsToMany(models.Image, { through: 'GroupImage' });
        Group.belongsToMany(models.Image, { as: 'GroupLogoImages', through: 'GroupLogoImage' });
        Group.belongsToMany(models.Image, { as: 'GroupHeaderImages', through: 'GroupHeaderImage' });
        Group.belongsToMany(models.User, { as: 'GroupUsers', through: 'GroupUser' });
        Group.belongsToMany(models.User, { as: 'GroupAdmins', through: 'GroupAdmin' });
      }
    }
  });

  return Group;
};
