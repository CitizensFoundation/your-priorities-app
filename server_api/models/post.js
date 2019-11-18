"use strict";

var async = require("async");
var queue = require('../active-citizen/workers/queue');
const log = require('../utils/logger');

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    content_type: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    official_status: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    status_changed_at: { type: DataTypes.DATE, allowNull: true },
    official_status_changed_at: { type: DataTypes.DATE, allowNull: true },
    counter_endorsements_up: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_endorsements_down: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_all_activities: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_main_activities: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_impressions: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_flags: { type: DataTypes.INTEGER, defaultValue: 0 },
    data: DataTypes.JSONB,
    public_data: DataTypes.JSONB,
    position: DataTypes.INTEGER,
    location: DataTypes.JSONB,
    cover_media_type: DataTypes.STRING,
    legacy_post_id: DataTypes.INTEGER,
    user_interaction_profile: DataTypes.JSONB,
    language: { type: DataTypes.STRING, allowNull: true }
  }, {
    defaultScope: {
      where: {
        deleted: false,
        status: 'published'
      }
    },

    indexes: [
      {
        name: 'published_by_official_status',
        fields: ['group_id', 'official_status', 'deleted'],
        where: {
          status: 'published'
        }
      },
      {
        name: 'published_by_official_status_w_category',
        fields: ['group_id', 'official_status', 'deleted', 'category_id'],
        where: {
          status: 'published'
        }
      },
      {
        name: 'all_statuses_by_official_status',
        fields: ['group_id', 'official_status','deleted','status']
      },
      {
        name: 'all_statuses_by_official_status_w_category',
        fields: ['group_id', 'official_status', 'deleted', 'status', 'category_id']
      },
      {
        fields: ['data'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['public_data'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['location'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['user_interaction_profile'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['user_id','group_id','deleted']
      },
      {
        fields: ['user_id','group_id','deleted','status']
      },
      {
        fields: ['id','deleted','status']
      },
      {
        fields: ['id','deleted']
      },
      {
        fields: ['user_id','deleted','status']
      }
    ],

    scopes: {
      open: {
        where: {
          official_status: 0,
          deleted: false,
          status: 'published'
        }
      },
      not_open: {
        where: {
          official_status: {
            $in: [-2,-1,1,2]
          },
          deleted: false,
          status: 'published'
        }
      },
      finished: {
        where: {
          official_status: {
            $in: [-2, -1, 2]
          },
          deleted: false,
          status: 'published'
        }
      },
      successful: {
        where: {
          official_status: 2,
          deleted: false,
          status: 'published'
        }
      },
      compromised: {
        where: {
          official_status: -991,
          deleted: false,
          status: 'published'
        }
      },
      failed: {
        where: {
          official_status: {
            $in: [-2]
          },
          deleted: false,
          status: 'published'
        }
      },
      in_progress: {
        where: {
          official_status: {
            $in: [-1, 1]
          },
          deleted: false,
          status: 'published'
        }
      }
    },

    underscored: true,

    timestamps: true,

    tableName: 'posts',

    classMethods: {

      CONTENT_IDEA: 0,
      CONTENT_STORY: 1,
      CONTENT_NEWSFEED: 2,
      CONTENT_PERSON: 3,
      CONTENT_BLOG: 4,
      CONTENT_QUESTION: 5,

      associate: function(models) {
        Post.hasMany(models.Point);
        Post.hasMany(models.Endorsement);
        Post.hasMany(models.PostRevision);
        Post.belongsTo(models.Category);
        Post.belongsTo(models.User);
        Post.belongsTo(models.Group, {foreignKey: "group_id"});
        Post.belongsToMany(models.Image, { as: 'PostImages', through: 'PostImage' });
        Post.belongsToMany(models.Image, { as: 'PostHeaderImages', through: 'PostHeaderImage' });
        Post.belongsToMany(models.Image, { as: 'PostUserImages', through: 'PostUserImage' });
        Post.belongsToMany(models.Video, { as: 'PostVideos', through: 'PostVideo' });
        Post.belongsToMany(models.Audio, { as: 'PostAudios', through: 'PostAudio' });
      },

      getSearchVector: function() {
        return 'PostText';
      },

      addFullTextIndex: function() {

        if(sequelize.options.dialect !== 'postgres') {
          console.log('Not creating search index, must be using POSTGRES to do this');
          return;
        }

        console.log("Adding full text index");

        var searchFields = ['name', 'description'];
        var Post = this;

        var vectorName = Post.getSearchVector();
        sequelize.queryInterface.describeTable("posts").then( (data) => {
          if (!data.PostText) {
            sequelize
              .query('ALTER TABLE "' + Post.tableName + '" ADD COLUMN "' + vectorName + '" TSVECTOR')
              .then(function() {
                return sequelize
                  .query('UPDATE "' + Post.tableName + '" SET "' + vectorName + '" = to_tsvector(\'english\', ' + searchFields.join(' || \' \' || ') + ')')
                  .error(console.log);
              }).then(function() {
              return sequelize
                .query('CREATE INDEX post_search_idx ON "' + Post.tableName + '" USING gin("' + vectorName + '");')
                .error(console.log);
            }).then(function() {
              return sequelize
                .query('CREATE TRIGGER post_vector_update BEFORE INSERT OR UPDATE ON "' + Post.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.english\', ' + searchFields.join(', ') + ')')
                .error(console.log);
            }).error(console.log);
          } else {
            log.info("PostText search index is already setup");
          }
        });
      },

      search: function(query, groupId, modelCategory) {
        console.log("In search for " + query);

        if(sequelize.options.dialect !== 'postgres') {
          console.log('Search is only implemented on POSTGRES database');
          return;
        }

        var Post = this;

        query = sequelize.getQueryInterface().escape(query);
        console.log(query);

        var where = '"'+Post.getSearchVector() + '" @@ plainto_tsquery(\'english\', ' + query + ')';

        return Post.findAll({
          order: "created_at DESC",
          where: [where, []],
          limit: 1024,
          include: [
            {
              model: sequelize.models.Category,
              required: false,
              include: [
                {
                  model: sequelize.models.Image,
                  required: false,
                  as: 'CategoryIconImages',
                  order: [
                    [ { model: sequelize.models.Image, as: 'CategoryIconImages' } ,'updated_at', 'asc' ]
                  ]
                }
              ]
            },
            {
              model: sequelize.models.PostRevision,
              required: false
            },
            {
              model: sequelize.models.Point,
              attributes: ['id','content'],
              required: false
            },
            { model: sequelize.models.Image,
              as: 'PostHeaderImages',
              required: false
            },
            {
              model: sequelize.models.Group,
              required: true,
              where: {
                id: groupId
              }
            }
          ]
        });
      }
    },

    instanceMethods: {
      setupModerationData: function () {
        if (!this.data) {
          this.set('data', {});
        }
        if (!this.data.moderation) {
          this.set('data.moderation', {});
        }
      },

      report: function (req, source, callback) {
        this.setupModerationData();
        async.series([
          function (seriesCallback) {
            if (!this.data.moderation.lastReportedBy) {
              this.set('data.moderation.lastReportedBy', []);
              if ((source==='user' || source==='fromUser') && !this.data.moderation.toxicityScore) {
                log.info("process-moderation post toxicity on manual report");
                queue.create('process-moderation', { type: 'estimate-post-toxicity', postId: this.id }).priority('high').removeOnComplete(true).save();
              }
            }
            this.set('data.moderation.lastReportedBy',
              [{ date: new Date(), source: source, userId: (req && req.user) ? req.user.id : null, userEmail: (req && req.user) ? req.user.email : 'anonymous' }].concat(this.data.moderation.lastReportedBy)
            );
            this.save().then(function () {
              seriesCallback();
            }).catch(function (error) {
              seriesCallback(error);
            });
          }.bind(this),
          function (seriesCallback) {
            if (req && req.disableNotification===true) {
              seriesCallback();
            } else {
              sequelize.models.AcActivity.createActivity({
                type: 'activity.report.content',
                userId: (req && req.user) ? req.user.id : null,
                postId: this.id,
                groupId: this.group_id,
                communityId: (this.Group && this.Group.Community) ? this.Group.Community.id : null,
                domainId:  (this.Group && this.Group.Community && this.Group.Community.Domain) ? this.Group.Community.Domain.id : null
              }, function (error) {
                seriesCallback(error);
              });
            }
          }.bind(this)
        ], function (error) {
          this.increment('counter_flags');
          callback(error);
        }.bind(this));
      },

      simple: function() {
        return { id: this.id, name: this.name };
      },

      updateAllExternalCounters: function(req, direction, column, done) {
        async.parallel([
          function(callback) {
            sequelize.models.Group.find({
              where: {id: this.group_id}
            }).then(function (group) {
              if (direction=='up')
                group.increment(column);
              else if (direction=='down') {
                var groupColumnValue = group[column];
                if (groupColumnValue && groupColumnValue>0) {
                  group.decrement(column);
                }
              }
              group.updateAllExternalCounters(req, direction, column, callback);
            }.bind(this))
          }.bind(this)
        ], function(err) {
          done(err);
        });
      },

      updateAllExternalCountersBy: function(req, direction, column, updateBy, done) {
        if (updateBy && updateBy>0) {
          async.parallel([
            function(callback) {
              sequelize.models.Group.find({
                where: {id: this.group_id}
              }).then(function (group) {
                if (direction=='up')
                  group.increment(column, {by: updateBy});
                else if (direction=='down') {
                  var groupColumnValue = group[column];
                  if (groupColumnValue && (groupColumnValue-updateBy)>=0) {
                    group.decrement(column, {by: updateBy});
                  } else if (groupColumnValue) {
                    group.decrement(column, {by: groupColumnValue});
                  }
                }
                group.updateAllExternalCounters(req, direction, column, callback);
              }.bind(this))
            }.bind(this)
          ], function(err) {
            done(err);
          });
        } else {
          done();
        }
      },

      setupHeaderImage: function(body, done) {
        if (body.uploadedHeaderImageId) {
          sequelize.models.Image.find({
            where: {id: body.uploadedHeaderImageId}
          }).then(function (image) {
            if (image)
              this.addPostHeaderImage(image);
            done();
          }.bind(this));
        } else done();
      },

      getImageFormatUrl: function(formatId) {
        if (this.PostHeaderImages && this.PostHeaderImages.length>0) {
          var formats = JSON.parse(this.PostHeaderImages[this.PostHeaderImages.length-1].formats);
          if (formats && formats.length>0)
            return formats[formatId];
        } else {
          return "";
        }
      },

      setupImages: function(body, done) {
        async.parallel([
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

      setupAfterSave: function(req, res, done) {
        var post = this;
        var thisRevision = sequelize.models.PostRevision.build({
          name: post.name,
          description: post.description,
          group_id: post.group_id,
          user_id: req.user.id,
          this_id: post.id,
          status: post.status,
          user_agent: req.useragent.source,
          ip_address: req.clientIp
        });
        thisRevision.save().then(function() {
          if (req.body.pointFor && req.body.pointFor!="") {
            var point = sequelize.models.Point.build({
              group_id: post.group_id,
              post_id: post.id,
              content: req.body.pointFor,
              value: 1,
              user_id: req.user.id,
              status: post.status,
              user_agent: req.useragent.source,
              ip_address: req.clientIp
            });
            point.save().then(function() {
              var pointRevision = sequelize.models.PointRevision.build({
                group_id: point.group_id,
                post_id: post.id,
                content: point.content,
                value: point.value,
                user_id: req.user.id,
                point_id: point.id,
                status: post.status,
                user_agent: req.useragent.source,
                ip_address: req.clientIp
              });
              pointRevision.save().then(function () {
                log.info("process-moderation point toxicity after post and point has been saved");
                queue.create('process-moderation', { type: 'estimate-point-toxicity', pointId: point.id }).priority('high').removeOnComplete(true).save();
                post.updateAllExternalCounters(req, 'up', 'counter_points', function () {
                  post.increment('counter_points');
                  done();
                });
              });
            });
          } else {
            done();
          }
        });
      }
    }
  });

  return Post;
};
