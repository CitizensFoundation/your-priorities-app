var async = require("async");
var request = require('request').defaults({ encoding: null });
var fs = require('fs');
var randomstring = require("randomstring");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
const aws = require('aws-sdk');
const _ = require('lodash');

"use strict";

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


    classMethods: {

      associate: function(models) {
        Video.belongsTo(models.User);
        Video.belongsToMany(models.Post, { as: 'PostVideos', through: 'PostVideo' });
        Video.belongsToMany(models.Image, { as: 'VideoImages', through: 'VideoImage' });
        Video.belongsToMany(models.Point, { as: 'PointVideos', through: 'PointVideo' });
        Video.belongsToMany(models.User, { as: 'UserProfileVideos', through: 'UserProfileVideo' });
        Video.belongsToMany(models.Community, { as: 'CommunityLogoVideos', through: 'CommunityLogoVideo' });
        Video.belongsToMany(models.Group, { as: 'GroupLogoVideos', through: 'GroupLogoVideo' });
        Video.belongsToMany(models.Domain, { as: 'DomainLogoVideos', through: 'DomainLogoVideo' });
      },

      defaultAttributesPublic: ["id","updated_at","formats"],

      getFileKey: (id) => {
        return 'video' + id +'.mp4';
      },

      getFullUrl: (meta) => {
        if (meta) {
          return 'https://'+meta.publicBucket+'.'+meta.endPoint+'/'+meta.fileKey;
        }
      },

      getThumbnailUrl: (video, number) => {
          const fileKey = 'thumbs-' + video.id + '-{'+number+'}';
          return 'https://'+video.meta.thumbnailBucket+'.'+video.meta.endPoint+'/'+fileKey;
      },

      createAndGetSignedUploadUrl: (req, res) => {
        const userId = req.user.id;
        sequelize.models.Video.build({
          user_id: userId,
          user_agent: req.useragent.source,
          ip_address: req.clientIp,
        }).save().then((video) => {
          const maxDuration = req.params.maxDuration ? req.params.maxDuration : 60;
          video.getPreSignedUploadUrl({maxDuration: maxDuration}, (error, presignedUrl) => {
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
          post.addPostVideo(video).then(() => {
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
          post.addPointVideo(video).then(() => {
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
          domain.addDomainLogoVideo(video).then(() => {
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
          community.addCommunityLogoVideo(video).then(() => {
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
          group.addGroupLogoVideo(video).then(() => {
            log.info("Have added video to group", { id });
            callback();
          });
        }).catch((error) => callback(error));
      },

      addToCollection: (video, options, callback) => {
        if (options.postId) {
          sequelize.models.Video.addToPost(video, options.postId, callback);
        } else if (options.groupId) {
          sequelize.models.Video.addToGroup(video, options.groupId, callback);
        } else if (options.communityId) {
          sequelize.models.Video.addToCommunity(video, options.communityId, callback);
        } else if (options.domainId) {
          sequelize.models.Video.addToDomain(video, options.domainId, callback);
        } else if (options.pointId) {
          sequelize.models.Video.addToPoint(video, options.pointId, callback);
        }
      },

      setupThumbnailsAfterTranscoding: (video, duration, req, callback) => {
        const interval = 10;
        let frames = [];
        const numberOfFrames = Math.max(1, Math.floor(duration/interval));

        for (let frame = 0; frame < numberOfFrames; frame++) {
          frames.push(sequelize.models.Video.getThumbnailUrl(video,frame+1));
        }

        async.forEach(frames, (frame, foreachCallback) => {
          sequelize.models.Image.build({
            s3_bucket_name: video.meta.thumbnailBucket,
            user_id: req.user.id,
            user_agent: "AWS Transcoder",
            ip_address: "127.0.0.1",
            formats: JSON.stringify([frame])
          }).save().then((image) => {
            video.addVideoImage(image).then(() => {
              foreachCallback();
            }).catch((error) => {
              foreachCallback(error);
            })
          }).catch((error) => {
            foreachCallback(error);
          })
        }, (error) => {
          callback(error)
        });
      },

      getTranscodingJobStatus: (video, req, res ) => {
        var params = {
          Id: req.body.jobId
        };
        const eltr = new aws.ElasticTranscoder({
          apiVersion: '2012–09–25',
          region: 'eu-west-1'
        });
        eltr.readJob(params, function(error, data) {
          if (error) {
            log.error("Could not get status of transcoding job", { error });
            res.sendStatus(500);
          } else {
            const jobStatus = { status: data.Job.Status, statusDetail: data.Job.StatusDetail };
            if (jobStatus.status==="Complete") {
              const duration = data.Job.Output.Duration;
              sequelize.models.Video.setupThumbnailsAfterTranscoding(video, duration, req, (error) => {
                if (error) {
                  log.error("Could not connect image and video", { error });
                  res.sendStatus(500);
                } else {
                  res.send(jobStatus);
                }
              })
            } else if (jobStatus.status==="Error") {
              log.error("Could not transcode video image and video", { detail: jobStatus.statusDetail });
              res.sendStatus(500);
            } else {
              res.send(jobStatus);
            }
          }
        });
      },

      startTranscoding: (video, req, res) => {
        sequelize.models.Video.startTranscodingJob(video, (error, data) => {
          if (error) {
            log.error("Could not start transcoding job", { error, options});
            res.sendStatus(500);
          } else {
            res.send({ transcodingJobId: data.Job.Id });
          }
        });
      },

      completeUploadAndAddToCollection: (req, res, options) => {
        sequelize.models.Video.find({
          where: {
            id: options.videoId
          },
          attributes: sequelize.models.Video.defaultAttributesPublic.concat(['user_id','meta'])
        }).then((video) => {
          if (video.user_id===req.user.id) {
            video.viewable = true;
            video.createFormats(video);
            video.save().then(() => {
              sequelize.models.Video.addToCollection(video, options, (error) => {
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
    
      startTranscodingJob: function (video, callback) {
        const eltr = new aws.ElasticTranscoder({
          apiVersion: '2012–09–25',
          region: 'eu-west-1'
        });
        var fileKey = video.meta.fileKey;
        var pipelineId = process.env.AWS_TRANSCODER_PIPELINE_ID;
        var params = {
          PipelineId: pipelineId,
          Input: {
            Key: fileKey,
            FrameRate: 'auto',
            Resolution: 'auto',
            AspectRatio: 'auto',
            Interlaced: 'auto',
            Container: 'auto',
            TimeSpan: {
              Duration: video.meta.maxDuration+'.000'
            }
          },
          Outputs: [{
            Key:fileKey,
            ThumbnailPattern: 'thumbs-' + video.id + '-{count}',
            PresetId: process.env.AWS_TRANSCODER_PRESET_ID,
            /*Watermarks: [{
              InputKey: 'watermarks/logo-horiz-large.png',
              PresetWatermarkId: 'BottomRight'
            }],*/
          }
          ]
        };
        log.info('Starting AWS transcoding Job');
        eltr.createJob(params, function (error, data) {
          if (error) {
            log.error("Error creating AWS transcoding job", { error });
            callback(error);
          } else {
            callback(null, data)
          }
        });
      },
    },

    instanceMethods: {
      createFormats: function (video) {
        this.formats = [];
        this.formats.push(sequelize.models.Video.getFullUrl(video.meta));
      },

      getPreSignedUploadUrl: function (options, callback) {
        const endPoint = process.env.S3_ENDPOINT || "s3.amazonaws.com";
        const accelEndPoint = process.env.S3_ACCELERATED_ENDPOINT || process.env.S3_ENDPOINT || "s3.amazonaws.com";
        const s3 = new aws.S3({
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          endpoint: accelEndPoint,
          useAccelerateEndpoint: process.env.S3_ACCELERATED_ENDPOINT!=null,
          region: process.env.S3_REGION || ((process.env.S3_ENDPOINT || process.env.S3_ACCELERATED_ENDPOINT) ? null : 'us-east-1'),
        });

        const signedUrlExpireSeconds = 60 * 60;
        const bucketName = process.env.S3_VIDEO_UPLOAD_BUCKET;
        const publicBucket = process.env.S3_VIDEO_PUBLIC_BUCKET;
        const thumbnailBucket = process.env.S3_VIDEO_THUMBNAIL_BUCKET;

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
            let meta = { bucketName, publicBucket, endPoint, accelEndPoint, thumbnailBucket,
                         maxDuration: options.maxDuration, fileKey: sequelize.models.Video.getFileKey(this.id), contentType, uploadUrl: url };
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
