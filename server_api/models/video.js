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
    video_type: DataTypes.STRING,
    description: DataTypes.TEXT,
    meta: DataType.JSONB,
    formats: DataType.JSONB,
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
        fields: ['user_id', 'deleted']
      },
      {
        fields: ['video_type', 'group_id','deleted']
      },
      {
        fields: ['video_type', 'post_id','deleted']
      },
      {
        fields: ['video_type', 'community_id','deleted']
      },
      {
        fields: ['video_type', 'domain_id','deleted']
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

      defaultAttributesPublic: ["id","updated_at","formats",'video_type'],

      createFormatsFromVersions: function (versions) {
        const endPoint = process.env.S3_ACCELERATED_ENDPOINT || process.env.S3_ENDPOINT || "s3.amazonaws.com";
        var formats = [];
        versions.forEach(function(version) {
          var n = version.url.lastIndexOf(process.env.S3_BUCKET);
          var path = version.url.substring(n+process.env.S3_BUCKET.length, version.url.length);
          var newUrl = "https://"
            + process.env.S3_BUCKET + "." + (endPoint)
            + path;
          formats.push(newUrl);
        });
        return formats;
      },

      instanceMethods: {
        getPreSignedUploadUrl: (callback) => {
          const s3 = new aws.S3({
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            endpoint:  process.env.S3_ACCELERATED_ENDPOINT || process.env.S3_ENDPOINT || null,
            useAccelerateEndpoint: process.env.S3_ACCELERATED_ENDPOINT ? true : false,
            region: process.env.S3_REGION || ((process.env.S3_ENDPOINT || process.env.S3_ACCELERATED_ENDPOINT) ? null : 'us-east-1'),
          });

          const signedUrlExpireSeconds = 60 * 60;
          const bucketName = process.env.S3_VIDEO_UPLOAD_BUCKET;
          const fileKey = '/videoUploads/' + this.id +'.mp4';
          const contentType = 'video/mp4';
          const s3Params = {
            Bucket: bucketName,
            Key: fileKey,
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
              let meta = { bucketName, fileKey, contentType, uploadUrl: url };
              if (this.meta)
                meta = _.merge(this.meta, meta);
              this.set('meta', meta);
              log.info('Presigned URL:', { url, meta });
              callback(null, url);
            }
          });
        },
      }
    }
  });

  return Video;
};
