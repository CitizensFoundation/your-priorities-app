"use strict";

var async = require('async');

module.exports = function(sequelize, DataTypes) {
  var BulkStatusUpdate = sequelize.define("BulkStatusUpdate", {
    config: { type: DataTypes.JSONB, allowNull: true },
    templates: { type: DataTypes.JSONB, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
    sent_at: { type: DataTypes.DATE },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {
    defaultScope: {
      where: {
        deleted: false
      }
    },
    underscored: true,

    tableName: 'bulk_status_updates',

    instanceMethods: {

      initializeConfig: function(emailHeader, emailFooter, done) {
        var config = { groups: [], emailHeader: emailHeader, emailFooter: emailFooter };

        var self = this;

        sequelize.models.Group.findAll({
          where: {
            community_id: this.community_id
          }
        }).then(function (groups) {
          async.eachSeries(groups, function (group, seriesCallback) {
            var configPosts = [];

            sequelize.models.Post.findAll({
              where: {
                group_id: group.id
              }
            }).then(function (posts) {
              async.eachSeries(posts, function (post, innerSeriesCallback) {
                configPosts.push({id: post.id, name: post.name, location: post.location,
                            currentOfficialStatus: post.official_status, newOfficialStatus: null,
                            selectedTemplateTitle: null, uniqueStatusMessage: null, moveToGroupId: null });
                innerSeriesCallback();
              }, function (error) {
                config.groups.push({ id: group.id, name: group.name, posts: configPosts });
                seriesCallback();
              });
            });
          }, function (error) {
            done(error, config);
          });
        });
      }
    },

    classMethods: {
      associate: function(models) {
        BulkStatusUpdate.belongsTo(models.Group);
        BulkStatusUpdate.belongsTo(models.Community);
        BulkStatusUpdate.belongsTo(models.User);
      }
    }
  });

  return BulkStatusUpdate;
};
