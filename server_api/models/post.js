var async = require("async");

"use strict";

// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    content_type: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    official_status: { type: DataTypes.STRING, allowNull: true },
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
    counter_flags: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_impressions: { type: DataTypes.INTEGER, defaultValue: 0 },
    data: DataTypes.JSONB,
    position: DataTypes.INTEGER,
    location: DataTypes.JSONB,
    cover_media_type: DataTypes.STRING,
    legacy_post_id: DataTypes.INTEGER,
    user_interaction_profile: DataTypes.JSONB
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
          include: [
            {
              model: modelCategory,
              required: false
            }
          ]
        });
      }
    },

    instanceMethods: {

      updateAllExternalCounters: function(req, direction, column, done) {
        async.parallel([
          function(callback) {
            sequelize.models.Group.find({
              where: {id: this.group_id}
            }).then(function (group) {
              if (direction=='up')
                group.increment(column);
              else if (direction=='down')
                group.decrement(column);
              group.updateAllExternalCounters(req, direction, column, callback);
            }.bind(this))
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
          group_id: post.group_id,
          user_id: req.user.id,
          this_id: post.id,
          status: post.status,
          user_agent: req.useragent.source,
          ip_address: req.clientIp
        });
        thisRevision.save().then(function() {
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
