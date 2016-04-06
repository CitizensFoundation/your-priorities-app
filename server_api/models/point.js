"use strict";

module.exports = function(sequelize, DataTypes) {
  var Point = sequelize.define("Point", {
    name: { type: DataTypes.STRING, allowNull: true },
    content_type: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    content: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.INTEGER, allowNull: false },
    website: DataTypes.STRING,
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    counter_revisions: { type: DataTypes.INTEGER, defaultValue: 1 },
    counter_flags: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_quality_up: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_quality_down: { type: DataTypes.INTEGER, defaultValue: 0 },
    embed_data: DataTypes.JSONB
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    indexes: [
      {
        fields: ['post_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['image_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['parent_point_id'],
        where: {
          deleted: false
        }
      }
    ],

    underscored: true,

    tableName: 'points',

    classMethods: {

      CONTENT_DEBATE: 0,
      CONTENT_NEWS_STORY: 1,
      CONTENT_COMMENT: 2,

      associate: function(models) {
        Point.belongsTo(models.Post);
        Point.belongsTo(models.Group);
        Point.belongsTo(models.Community);
        Point.belongsTo(models.Domain);
        Point.belongsTo(models.User);
        Point.belongsTo(models.Image);
        Point.belongsTo(models.Point, { as: 'ParentPoint' });
        Point.belongsTo(models.Group);
        Point.hasMany(models.PointRevision);
        Point.hasMany(models.PointQuality);
      },

      createComment: function (req, options, callback) {
        var parentPointId, imageId;

        options.content = options.comment.content;
        delete options.comment;

        options.user_id = req.user.id;
        options.content_type = models.Point.CONTENT_COMMENT;
        options.value = 0;
        options.status = 'active';
        options.user_agent = req.useragent.source;
        options.ip_address = req.clientIp;

        models.Point.build(options).save().then(function (point) {
          options.point_id = point.id;
          var pointRevision = models.PointRevision.build(options);
          pointRevision.save().then(function () {
            models.AcActivity.createActivity({
              type: 'activity.point.comment.new',
              userId: options.user_id,
              pointId: options.point_id,
              imageId: options.image_id,
              access: models.AcActivity.ACCESS_PUBLIC
            }, function (error) {
              callback(error);
            });
          })
        }).catch(function (error) {
          callback(error);
        });
      }
    }
  });

  return Point;
};
