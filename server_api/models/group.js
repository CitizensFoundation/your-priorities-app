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
    counter_ideas: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_comments: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
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

      updateAllExternalCounters: function(req, direction, done) {
        async.parallel([
          function(callback) {
            sequelize.models.Community.find({
              where: {id: this.community_id}
            }).then(function (community) {
              if (direction=='up')
                community.increment('counter_groups');
              else if (direction=='down')
                community.decrement('counter_groups');
              callback();
            }.bind(this));
          }.bind(this),
          function(callback) {
            if (req.ypDomain) {
              if (direction=='up')
                req.ypDomain.increment('counter_groups');
              else if (direction=='down')
                req.ypDomain.decrement('counter_groups');
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

      addUserToGroupIfNeeded: function (groupId, req, done) {
        sequelize.models.Group.find({
          where: {id: groupId}
        }).then(function (group) {
          group.hasUser(req.user).then(function(result) {
            if (!result) {
              async.parallel([
                function(callback) {
                  group.addUser(req.user).then(function (result) {
                    callback();
                  })
                },
                function(callback) {
                  sequelize.models.Community.find({
                    where: {id: group.community_id}
                  }).then(function (community) {
                    community.hasUser(req.user).then(function(result) {
                      if (result) {
                        callback();
                      } else {
                        community.addUser(req.user).then(function (result) {
                          callback();
                        });
                      }
                    });
                  }.bind(this));
                }.bind(this),
                function(callback) {
                  req.ypDomain.hasUser(req.user).then(function(result) {
                    if (result) {
                      callback();
                    } else {
                      req.ypDomain.addUser(req.user).then(function(result) {
                        callback();
                      });
                    }
                  });
                }.bind(this)
              ], function(err) {
                done(err);
              });
            } else {
              done();
            }
          });
        })
      },

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
