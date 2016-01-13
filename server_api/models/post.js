var async = require("async");

"use strict";

// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    content_type: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    counter_endorsements_up: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_endorsements_down: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_comments: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_all_activities: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_main_activities: { type: DataTypes.INTEGER, defaultValue: 0 },
    impressions_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    position: DataTypes.INTEGER,
    location: DataTypes.JSONB,
    cover_media_type: DataTypes.STRING,
    legacy_post_id: DataTypes.INTEGER
  }, {

    defaultScope: {
      where: {
        deleted: false
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
          limit: 100,
          include: [ modelCategory ]
        });
      }
    },

    instanceMethods: {

      updateAllExternalCounters: function(req, direction, done) {
        async.parallel([
          function(callback) {
            sequelize.models.Group.find({
              where: {id: this.group_id}
            }).then(function (group) {
              if (direction=='up')
                group.increment('counter_posts');
              else if (direction=='down')
                group.decrement('counter_posts');
              sequelize.models.Community.find({
                where: {id: group.community_id}
              }).then(function (community) {
                if (direction=='up')
                  community.increment('counter_posts');
                else if (direction=='down')
                  community.decrement('counter_posts');
                callback();
              }.bind(this));
            }.bind(this))
          }.bind(this),
          function(callback) {
            if (req.ypDomain) {
              if (direction=='up')
                req.ypDomain.increment('counter_posts');
              else if (direction=='down')
                req.ypDomain.decrement('counter_posts');
              callback();
            } else {
              callback();
            }
          }.bind(this)
        ], function(err) {
          done(err);
        });
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
          group_id: post.groupId,
          user_id: req.user.id,
          this_id: post.id
        });
        thisRevision.save().then(function() {
          var point = sequelize.models.Point.build({
            group_id: post.groupId,
            post_id: post.id,
            content: req.body.pointFor,
            value: 1,
            user_id: req.user.id
          });
          point.save().then(function() {
            var pointRevision = sequelize.models.PointRevision.build({
              group_id: point.groupId,
              post_id: post.id,
              content: point.content,
              user_id: req.user.id,
              point_id: point.id
            });
            pointRevision.save().then(function() {
              done();
            });
          });
        });
      }
    }
  });

  return Post;
};
