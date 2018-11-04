var async = require("async");
var request = require('request').defaults({ encoding: null });
var fs = require('fs');
var randomstring = require("randomstring");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
const aws = require('aws-sdk');

"use strict";

var Upload = require('s3-uploader');

module.exports = function(sequelize, DataTypes) {
  var Video = sequelize.define("Video", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    meta: DataTypes.JSONB,
    formats: DataTypes.JSONB,
    user_id: DataTypes.INTEGER,
    viewable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    underscored: true,

    timestamps: true,

    tableName: 'videos',

    defaultScope: {
      where: {
        deleted: false
      },
      order: [
        ['created_at', 'asc' ]
      ]
    },

    indexes: [
      {
        fields: ['meta'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['formats'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['user_id', 'viewable', 'deleted']
      }
    ],

    associate: function(models) {
      Video.belongsTo(models.User);
      Video.belongsToMany(models.Post, { as: 'PostVideos', through: 'post_videos' });
      Video.belongsToMany(models.Point, { as: 'PointVideos', through: 'point_videos' });
      Video.belongsToMany(models.User, { as: 'UserProfileVideos', through: 'user_profile_videos' });
      Video.belongsToMany(models.Community, { as: 'CommunityLogoVideos', through: 'community_logo_videos' });
      Video.belongsToMany(models.Group, { as: 'GroupLogoVideos', through: 'group_logo_videos' });
      Video.belongsToMany(models.Domain, { as: 'DomainLogoVideos', through: 'domain_logo_videos' });
    },

    classMethods: {

      defaultAttributesPublic: ["id","updated_at","formats"],

      getFileKey: (id) => {
        return 'video' + id +'.mp4';
      },

      getFullUrl: (meta) => {
        if (meta) {
          return meta.endPoint+'/'+meta.bucketName+'/'+meta.fileKey;
        }
      },

      createAndGetSignedUploadUrl: (req, res) => {
        const userId = req.user.id;
        sequelize.models.Video.build({
          user_id: userId,
          user_agent: req.useragent.source,
          ip_address: req.clientIp,
        }).save().then((video) => {
          video.getPreSignedUploadUrl((error, presignedUrl) => {
            if (error) {
              log.error("Could not get preSigned URL for video", { error });
              res.sendStatus(500);
            } else {
              log.info("Got presigned url", { presignedUrl })
              res.send({ presignedUrl, videoId: video.id });
            }
          });
        }).catch((error) => {
          log.error("Could not create video", { error });
          res.sendStatus(500);
        })
      },

      addToPost: (video, id, callback) => {
        sequelize.models.Post.find({
          where: {
            id: id
          }
        }).then((post) => {
          post.AddPostVideos(video).then(() => {
            log.info("Have added video to post", { id });
            callback();
          });
        }).catch((error) => callback(error));
      },

      addToPoint: (video, id, callback) => {
        sequelize.models.Point.find({
          where: {
            id: id
          }
        }).then((post) => {
          post.AddPointVideos(video).then(() => {
            log.info("Have added video to point", { id });
            callback();
          });
        }).catch((error) => callback(error));
      },

      addToDomain: (video, id, callback) => {
        sequelize.models.Domain.find({
          where: {
            id: id
          }
        }).then((domain) => {
          domain.AddDomainLogoVideos(video).then(() => {
            log.info("Have added video to domain", { id });
            callback();
          });
        }).catch((error) => callback(error));
      },

      addToCommunity: (video, id, callback) => {
        sequelize.models.Community.find({
          where: {
            id: id
          }
        }).then((community) => {
          community.AddCommunityLogoVideos(video).then(() => {
            log.info("Have added video to community", { id });
            callback();
          });
        }).catch((error) => callback(error));
      },

      addToGroup: (video, id, callback) => {
        sequelize.models.Group.find({
          where: {
            id: id
          }
        }).then((group) => {
          group.AddGroupLogoVideos(video).then(() => {
            log.info("Have added video to group", { id });
            callback();
          });
        }).catch((error) => callback(error));
      },

      addToCollection: (video, options, callback) => {
        if (options.postId) {
          addToPost(video, options.postId, callback);
        } else if (options.groupId) {
          addToGroup(video, options.groupId, callback);
        } else if (options.communityId) {
          addToCommunity(video, options.communityId, callback);
        } else if (options.domainId) {
          addToDomain(video, options.domainId, callback);
        } else if (options.pointId) {
          addToDomain(video, options.pointId, callback);
        }
      },

      completeUploadAndAddToCollection: (req, res, options) => {
        sequelize.models.Video.find({
          where: {
            id: options.videoId
          },
          attributes: _.merge(sequelize.models.Video.defaultAttributesPublic, ['user_id'])
        }).then((video) => {
          if (video.user_id===req.user.id) {
            video.viewable = true;
            video.createFormats();
            video.save().then(() => {
              this.addToCollection(video, options, (error) => {
                if (error) {
                  log.error("Could not add video to collection", { error, options});
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
                }
              });
            }).catch((error) => {
              log.error("Could not save video", { error });
              res.sendStatus(500);
            });
          } else {
            log.error("Could not get video for wrong user");
            res.sendStatus(401);
          }
        }).catch((error) => {
          log.error("Could not get video", { error });
          res.sendStatus(500);
        });
      },
    },

    instanceMethods: {
      createFormats: function () {
        this.formats = [];
        this.formats.push(sequelize.models.Video.getFullUrl(this.meta));
      },

      getPreSignedUploadUrl: function (callback) {
        const endPoint = process.env.S3_ACCELERATED_ENDPOINT || process.env.S3_ENDPOINT;
        const s3 = new aws.S3({
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          endpoint: endPoint,
          useAccelerateEndpoint: process.env.S3_ACCELERATED_ENDPOINT!=null,
          region: process.env.S3_REGION || ((process.env.S3_ENDPOINT || process.env.S3_ACCELERATED_ENDPOINT) ? null : 'us-east-1'),
        });

        const signedUrlExpireSeconds = 60 * 60;
        const bucketName = process.env.S3_VIDEO_UPLOAD_BUCKET;

        const contentType = 'video/mp4';
        const a = this.id;

        const s3Params = {
          Bucket: bucketName,
          Key: sequelize.models.Video.getFileKey(this.id),
          Expires: signedUrlExpireSeconds,
          ACL: 'public-read',
          ContentType: contentType
        };
        s3.getSignedUrl('putObject', s3Params, (error, url) => {
          if (error) {
            log.error('Error getting presigned url from AWS S3', { error });
            callback(err);
          }
          else {
            let meta = { bucketName, endPoint, fileKey: sequelize.models.Video.getFileKey(this.id), contentType, uploadUrl: url };
            if (this.meta)
              meta = _.merge(this.meta, meta);
            this.set('meta', meta);
            log.info('Presigned URL:', { url, meta });
            log.info('Saving video metadata');
            this.save().then(() => {
              callback(null, url);
            }).catch((error) => { callback(error) });
          }
        });
      },
    }

  });

  return Video;
};
