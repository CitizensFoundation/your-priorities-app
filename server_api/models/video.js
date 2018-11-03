var async = require("async");
var request = require('request').defaults({ encoding: null });
var fs = require('fs');
var randomstring = require("randomstring");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

"use strict";

var Upload = require('s3-uploader');

module.exports = function(sequelize, DataTypes) {
  var Video = sequelize.define("Video", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    meta: DataType.JSONB,
    formats: DataType.JSONB,
    viewable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    underscored: true,

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
      Video.belongsToMany(models.User, { as: 'UserProfileVideos', through: 'user_profile_videos' });
      Video.belongsToMany(models.Community, { as: 'CommunityLogoVideos', through: 'community_logo_videos' });
      Video.belongsToMany(models.Group, { as: 'GroupLogoVideos', through: 'group_logo_videos' });
      Video.belongsToMany(models.Domain, { as: 'DomainLogoVideos', through: 'domain_logo_videos' });
    },

    classMethods: {

      defaultAttributesPublic: ["id","updated_at","formats"],

      createAndGetSignedUploadUrl: (req, res, options) => {
        sequelize.models.Video.build({
          user_agent: req.useragent.source,
          ip_address: req.clientIp,
          user_id: req.user.id
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

      addToPost: (video, postId, callback) => {
        sequelize.models.Post.find({
          where: {
            id: postId
          }
        }).then((post) => {
          post.AddPostVideos(video).then(() => {
            log.info("Have added video to post", { postId });
            callback();
          });
        }).catch((error) => callback(error));
      },

      uploadVideoCompleted: (req, res, options) => {
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
              res.sendStatus(200);
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
      getFileKey: () => {
        return '/videoUploads/' + this.id +'.mp4';
      },

      getFullUrl: () => {
        if (this.meta) {
          return this.meta.endPoint+'/'+this.meta.bucketName+'/'+this.meta.fileKey;
        }
      },

      createFormats: () => {
        this.formats = [];
        this.formats.push(this.meta.getFullUrl());
      },

      getPreSignedUploadUrl: (callback) => {
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
        const s3Params = {
          Bucket: bucketName,
          Key: this.getFileKey(),
          Expires: signedUrlExpireSeconds,
          ACL: 'bucket-owner-full-control',
          ContentType: contentType
        };
        s3.getSignedUrl('putObject', s3Params, (error, url) => {
          if (error) {
            log.error('Error getting presigned url from AWS S3', { error });
            callback(err);
          }
          else {
            let meta = { bucketName, endPoint, fileKey: this.getFileKey(), contentType, uploadUrl: url };
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
