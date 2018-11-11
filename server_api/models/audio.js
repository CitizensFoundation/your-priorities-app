var async = require("async");
var request = require('request').defaults({ encoding: null });
var fs = require('fs');
var randomstring = require("randomstring");
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
const aws = require('aws-sdk');
const _ = require('lodash');
var queue = require('../active-citizen/workers/queue');

"use strict";

module.exports = function(sequelize, DataTypes) {
  var Audio = sequelize.define("Audio", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    meta: DataTypes.JSONB,
    public_meta: DataTypes.JSONB,
    formats: DataTypes.JSONB,
    listens:{ type: DataTypes.BIGINT, defaultValue: 0 },
    long_listens:{ type: DataTypes.BIGINT, defaultValue: 0 },
    user_id: DataTypes.INTEGER,
    listenable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    underscored: true,

    timestamps: true,

    tableName: 'audios',

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
        fields: ['public_meta'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['formats'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['user_id', 'listenable', 'deleted']
      }
    ],

    classMethods: {

      associate: function(models) {
        Audio.belongsTo(models.User);
        Audio.belongsToMany(models.Post, { as: 'PostAudios', through: 'PostAudio' });
        Audio.belongsToMany(models.Point, { as: 'PointAudios', through: 'PointAudio' });
      },

      defaultAttributesPublic: ["id","updated_at","formats"],

      getRandomFileKey: (id) => {
        const random =  Math.random().toString(36).substring(2, 9);
        return random+'_audio' + id +'.mp4';
      },

      getFullUrl: (meta) => {
        if (meta) {
          return 'https://'+meta.publicBucket+'.'+meta.endPoint+'/'+meta.fileKey;
        }
      },

      createAndGetSignedUploadUrl: (req, res) => {
        const userId = req.user.id;
        sequelize.models.Audio.build({
          user_id: userId,
          user_agent: req.useragent.source,
          ip_address: req.clientIp,
        }).save().then((audio) => {
          audio.getPreSignedUploadUrl({}, (error, presignedUrl) => {
            if (error) {
              log.error("Could not get preSigned URL for audio", { error });
              res.sendStatus(500);
            } else {
              log.info("Got presigned url", { presignedUrl })
              res.send({ presignedUrl, audioId: audio.id });
            }
          });
        }).catch((error) => {
          log.error("Could not create audio", { error });
          res.sendStatus(500);
        })
      },

      addToPost: (audio, options, callback) => {
        sequelize.models.Post.find({
          where: {
            id: options.postId
          }
        }).then((post) => {
          post.addPostAudio(audio).then(() => {
            log.info("Have added audio to post", { id: options.postId });
            if (process.env.GOOGLE_TRANSCODING_FLAC_BUCKET && process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
              if (!post.public_data) {
                post.set('public_data', {});
              }
              post.set('public_data.transcript', {});
              post.set('public_data.transcript', { audioId: audio.id });
              post.set('public_data.transcript.inProgress', true);
              const workPackage = {
                browserLanguage: options.browserLanguage,
                appLanguage:options.appLanguage,
                audioId: audio.id,
                type: 'create-audio-transcript' };
              queue.create('process-voice-to-text', workPackage).priority('high').removeOnComplete(true).save();
              post.save().then( () => {
                callback();
              }).catch( error => {
                callback(error);
              })
            } else {
              callback();
            }
          });
        }).catch((error) => callback(error));
      },

      addToCollection: (audio, options, callback) => {
        if (options.postId) {
          sequelize.models.Audio.addToPost(audio, options, callback);
        } else {
          callback("No collection to add to")
        }
      },

      getTranscodingJobStatus: (audio, req, res ) => {
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
              res.send(jobStatus);
            } else if (jobStatus.status==="Error") {
              log.error("Could not transcode audio image and audio", { detail: jobStatus.statusDetail });
              res.sendStatus(500);
            } else {
              res.send(jobStatus);
            }
          }
        });
      },

      startTranscoding: (audio, options, req, res) => {
        if (options.audioPostUploadLimitSec && options.audioPostUploadLimitSec!=="") {
          const postLimitSeconds = parseInt(options.audioPostUploadLimitSec);
          audio.set('meta.maxDuration', Math.min(postLimitSeconds, 150));
        } else if (options.audioPointUploadLimitSec && options.audioPointUploadLimitSec!=="") {
          const pointLimitSeconds = parseInt(options.audioPointUploadLimitSec);
          audio.set('meta.maxDuration', Math.min(pointLimitSeconds, 150));
        } else {
          audio.set('meta.maxDuration', "600");
        }
        audio.save().then((audio) => {
          sequelize.models.Audio.startTranscodingJob(audio, (error, data) => {
            if (error) {
              log.error("Could not start transcoding job", { error });
              res.sendStatus(500);
            } else {
              res.send({ transcodingJobId: data.Job.Id });
            }
          });
        }).catch((error) => {
          log.error("Could not start transcoding job", { error });
          res.sendStatus(500);
        });
      },

      completeUploadAndAddToPoint: (req, res, options, callback) => {
        sequelize.models.Audio.find({
          where: {
            id: options.audioId
          },
          attributes: sequelize.models.Audio.defaultAttributesPublic.concat(['user_id','meta'])
        }).then((audio) => {
          if (audio.user_id===req.user.id) {
            audio.listenable = true;
            audio.createFormats(audio);
            audio.save().then(() => {
              sequelize.models.Point.find({
                where: {
                  id: options.pointId
                }
              }).then((point) => {
                point.addPointAudio(audio).then(() => {
                  log.info("Have added audio to point", { id: options.pointId });
                  callback();
                });
              }).catch((error) => callback(error));
            }).catch((error) => {
              callback(error);
            });
          } else {
            callback("Could not get audio for wrong user");
          }
        }).catch((error) => {
          callback(error);
        });
      },

      completeUploadAndAddToCollection: (req, res, options) => {
        sequelize.models.Audio.find({
          where: {
            id: options.audioId
          },
          attributes: sequelize.models.Audio.defaultAttributesPublic.concat(['user_id','meta'])
        }).then((audio) => {
          if (audio.user_id===req.user.id) {
            audio.listenable = true;
            audio.createFormats(audio);
            audio.save().then(() => {
              sequelize.models.Audio.addToCollection(audio, options, (error) => {
                if (error) {
                  log.error("Could not add audio to collection", { error, options});
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
                }
              });
            }).catch((error) => {
              log.error("Could not save audio", { error });
              res.sendStatus(500);
            });
          } else {
            log.error("Could not get audio for wrong user");
            res.sendStatus(401);
          }
        }).catch((error) => {
          log.error("Could not get audio", { error });
          res.sendStatus(500);
        });
      },
    
      startTranscodingJob: function (audio, callback) {
        const eltr = new aws.ElasticTranscoder({
          apiVersion: '2012–09–25',
          region: 'eu-west-1'
        });
        var fileKey = audio.meta.fileKey;
        var pipelineId = process.env.AWS_TRANSCODER_AUDIO_PIPELINE_ID;
        var params = {
          PipelineId: pipelineId,
          Input: {
            Key: fileKey,
            Container: 'auto',
            TimeSpan: {
              Duration: audio.meta.maxDuration+'.000'
            }
          },
          Outputs: [
            {
              Key:fileKey,
              PresetId: process.env.AWS_TRANSCODER_AUDIO_PRESET_ID,
            },
            {
              Key: fileKey.slice(0, fileKey.length-4)+'.flac',
              PresetId: process.env.AWS_TRANSCODER_FLAC_PRESET_ID
            }
          ]
        };
        log.info('Starting AWS transcoding Audio Job');
        eltr.createJob(params, function (error, data) {
          if (error) {
            log.error("Error creating AWS Audio transcoding job", { error });
            callback(error);
          } else {
            callback(null, data)
          }
        });
      },
    },

    instanceMethods: {
      createFormats: function (audio) {
        this.formats = [];
        this.formats.push(sequelize.models.Audio.getFullUrl(audio.meta));
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
        const bucketName = process.env.S3_AUDIO_UPLOAD_BUCKET;
        const publicBucket = process.env.S3_AUDIO_PUBLIC_BUCKET;

        const contentType = 'audio/mp4';
        const a = this.id;
        const fileKey = sequelize.models.Audio.getRandomFileKey(this.id);

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
            let meta = { bucketName, publicBucket, endPoint, accelEndPoint,
                         maxDuration: options.maxDuration, fileKey, contentType, uploadUrl: url };
            if (this.meta)
              meta = _.merge(this.meta, meta);
            this.set('meta', meta);
            log.info('Presigned URL:', { url, meta });
            log.info('Saving audio metadata');
            this.save().then(() => {
              callback(null, url);
            }).catch((error) => { callback(error) });
          }
        });
      },
    }

  });

  return Audio;
};
