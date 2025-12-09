"use strict";
const log = require('../utils/logger.cjs');
const aws = require('aws-sdk');
const _ = require('lodash');
const queue = require('../services/workers/queue.cjs');

let bullAudioQueue;

if (process.env.USE_YOUR_PRIORITIES_ENCODER) {
  const { Queue } = require('bullmq');

  let redisUrl = process.env.REDIS_WORKER_URL ?? process.env.REDIS_URL ?? "redis://localhost:6379";
  if (redisUrl.startsWith("redis://h:")) {
    redisUrl = redisUrl.replace("redis://h:","redis://:");
  }

  const parsedRedisUrl = new URL(redisUrl);
  const redisConnection = {
    host: parsedRedisUrl.hostname,
    port: parseInt(parsedRedisUrl.port) || 6379,
    password: parsedRedisUrl.password || undefined,
    username: parsedRedisUrl.username || undefined,
  };

  if (redisUrl.startsWith("rediss://")) {
    redisConnection.tls = {
      rejectUnauthorized: false,
    };
  }

  bullAudioQueue = new Queue('AudioEncoding', { connection: redisConnection });
}

module.exports = (sequelize, DataTypes) => {
  const Audio = sequelize.define("Audio", {
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

    createdAt: 'created_at',
    updatedAt: 'updated_at',

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
      },
      {
        fields: ['id', 'deleted']
      },
      {
        fields: ['updated_at', 'deleted']
      },
      {
        fields: ['created_at', 'deleted']
      },
      { name: 'audios_idx_deleted',
        fields: ['deleted']
      }
    ]
  });

  Audio.associate = (models) => {
    Audio.belongsTo(models.User, { foreignKey: 'user_id' });
    Audio.belongsToMany(models.Post, { as: 'PostAudios', through: 'PostAudio' });
    Audio.belongsToMany(models.Point, { as: 'PointAudios', through: 'PointAudio' });
  };

  Audio.defaultAttributesPublic = ["id","updated_at","formats"];

  Audio.getRandomFileKey = (id) => {
    const random =  Math.random().toString(36).substring(2, 9);
    return random+'_audio' + id +'.mp4';
  };

  Audio.getFullUrl = (meta) => {
    if (process.env.MINIO_ROOT_USER && process.env.NODE_ENV === 'development') {
      return meta.endPoint
        + "/" + meta.publicBucket+'/'+meta.fileKey;
    } else if (process.env.MINIO_ROOT_USER) {
      return "https://"
        + meta.endPoint
        + "/" + meta.publicBucket+'/'+meta.fileKey;
    } else {
      return 'https://'+meta.publicBucket+'.'+meta.endPoint+'/'+meta.fileKey;
    }
  };

  Audio.createAndGetSignedUploadUrl = (req, res) => {
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
  };

  Audio.addToPost = (audio, options, callback) => {
    sequelize.models.Post.findOne({
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
          post.set('public_data.transcript.inProgressDate', new Date());
          const workPackage = {
            browserLanguage: options.browserLanguage,
            appLanguage:options.appLanguage,
            audioId: audio.id,
            type: 'create-audio-transcript' };
          queue.add('process-voice-to-text', workPackage, 'high');
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
  };

  Audio.addToCollection = (audio, options, callback) => {
    if (options.postId) {
      sequelize.models.Audio.addToPost(audio, options, callback);
    } else {
      callback("No collection to add to")
    }
  };

  Audio.getTranscodingJobStatus = (audio, req, res ) => {
    if (process.env.USE_YOUR_PRIORITIES_ENCODER) {
      Audio.getYrpriEncoderTranscodingJobStatus(audio, req, res);
    } else {
      const params = {
        Id: req.body.jobId
      };
      const eltr = new aws.ElasticTranscoder({
        apiVersion: '2012–09–25',
        region: process.env.S3_REGION ? process.env.S3_REGION : 'eu-west-1'
      });
      eltr.readJob(params, (error, data) => {
        if (error) {
          log.error("Could not get status of transcoding job", { error });
          res.sendStatus(500);
        } else {
          const jobStatus = { status: data.Job.Status, statusDetail: data.Job.StatusDetail };
          if (jobStatus.status==="Complete") {
            res.send(jobStatus);
          } else if (jobStatus.status==="Error") {
            log.error("Could not transcode audio image and audio", { jobStatus: jobStatus, data: data });
            res.sendStatus(500);
          } else {
            res.send(jobStatus);
          }
        }
      });
    }
  };

  Audio.startTranscoding = (audio, options, req, res) => {
    if (options.audioPostUploadLimitSec && options.audioPostUploadLimitSec!=="") {
      const postLimitSeconds = parseInt(options.audioPostUploadLimitSec);
      audio.set('meta.maxDuration', Math.min(postLimitSeconds, 600));
    } else if (options.audioPointUploadLimitSec && options.audioPointUploadLimitSec!=="") {
      const pointLimitSeconds = parseInt(options.audioPointUploadLimitSec);
      audio.set('meta.maxDuration', Math.min(pointLimitSeconds, 600));
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
  };

  Audio.completeUploadAndAddToPoint = (req, res, options, callback) => {
    sequelize.models.Audio.findOne({
      where: {
        id: options.audioId
      },
      attributes: sequelize.models.Audio.defaultAttributesPublic.concat(['user_id','meta'])
    }).then((audio) => {
      if (audio.user_id===req.user.id) {
        audio.listenable = true;
        audio.createFormats(audio);
        audio.save().then(() => {
          sequelize.models.Point.findOne({
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
  };

  Audio.completeUploadAndAddToCollection = (req, res, options) => {
    sequelize.models.Audio.findOne({
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
  };

  Audio.startTranscodingJob = (audio, callback) => {
    if (process.env.USE_YOUR_PRIORITIES_ENCODER) {
      Audio.startYrpriEncoderTranscodingJob(audio, callback);
    } else {
      const eltr = new aws.ElasticTranscoder({
        apiVersion: '2012–09–25',
        region: process.env.S3_REGION ? process.env.S3_REGION : 'eu-west-1'
      });
      const fileKey = audio.meta.fileKey;
      const pipelineId = process.env.AWS_TRANSCODER_AUDIO_PIPELINE_ID;
      const params = {
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
      eltr.createJob(params, (error, data) => {
        if (error) {
          log.error("Error creating AWS Audio transcoding job", { error });
          callback(error);
        } else {
          callback(null, data)
        }
      });
    }
  };

  Audio.prototype.createFormats = function (audio) {
    this.formats = [];
    this.formats.push(sequelize.models.Audio.getFullUrl(audio.meta));
  };

  Audio.prototype.getPreSignedUploadUrl = function (options, callback) {
    const endPoint = process.env.S3_ENDPOINT || "s3.amazonaws.com";
    const accelEndPoint = process.env.S3_ACCELERATED_ENDPOINT || process.env.S3_ENDPOINT || "s3.amazonaws.com";
    const s3 = new aws.S3({
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      endpoint: accelEndPoint,
      useAccelerateEndpoint: process.env.S3_ACCELERATED_ENDPOINT!=null,
      region: process.env.S3_REGION || ((process.env.S3_ENDPOINT || process.env.S3_ACCELERATED_ENDPOINT) ? null : 'us-east-1'),
      s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE ? true : false
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
      ACL: process.env.S3_FORCE_PATH_STYLE ? undefined : 'bucket-owner-full-control',
      ContentType: contentType
    };
    s3.getSignedUrl('putObject', s3Params, (error, url) => {
      if (error) {
        log.error('Error getting presigned url from AWS S3', { error });
        callback(error);
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
  };


  // Using Your Priorities Encoder

  Audio.startYrpriEncoderTranscodingJob = (audio, callback) => {
    const fileKey = audio.meta.fileKey;

    let jobPackage = {
      fileKey,
      duration: audio.meta.maxDuration+'.000',
      flacFilename: fileKey.slice(0, fileKey.length-4)+'.flac'
    }

    sequelize.models.AcBackgroundJob.createJob(jobPackage, {}, async (error, jobId) => {
      log.info('Starting YRPRI transcoding Job');
      if (error) {
        log.error("Error creating YRPRI transcoding job", { error });
        callback(error);
      } else {
        jobPackage = _.merge(jobPackage, {
          acBackgroundJobId: jobId,
        });


        await bullAudioQueue.add('audio-encoding', jobPackage);
        callback(null, { Job: { Id: jobId } });
      }
    });
  };

  Audio.getYrpriEncoderTranscodingJobStatus = (audio, req, res ) => {
    sequelize.models.AcBackgroundJob.findOne({
      where: {
        id: req.body.jobId
      }
    }).then(job=>{
      if (job) {
        const jobStatus = { status: job.data.status, statusDetail: "" };
        if (job.data.status==="Complete") {
          res.send(jobStatus);
        } else if (job.data.status==="Error") {
          log.error("Could not transcode audio image and audio", { jobStatus: jobStatus, data: job.data });
          res.sendStatus(500);
        } else {
          res.send(jobStatus);
        }
      } else {
        log.error("Could not find transcoding job");
        res.sendStatus(404);
      }
    }).catch(error=>{
      log.error("Could not transcode image and audio", { error });
      res.sendStatus(500);
    })
  };

  return Audio;
};
