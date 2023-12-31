"use strict";
const async = require("async");
const log = require("../utils/logger");
const aws = require("aws-sdk");
const _ = require("lodash");
const queue = require("../active-citizen/workers/queue");

let bullVideoQueue;

if (process.env.USE_YOUR_PRIORITIES_ENCODER) {
  const Queue = require("bull");
  const redisUrl = process.env.REDIS_URL ? process.env.REDIS_URL : undefined;
  bullVideoQueue = new Queue("VideoEncoding", redisUrl);
}

module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define(
    "Video",
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      meta: DataTypes.JSONB,
      public_meta: DataTypes.JSONB,
      formats: DataTypes.JSONB,
      views: { type: DataTypes.BIGINT, defaultValue: 0 },
      long_views: { type: DataTypes.BIGINT, defaultValue: 0 },
      user_id: DataTypes.INTEGER,
      viewable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ip_address: { type: DataTypes.STRING, allowNull: false },
      user_agent: { type: DataTypes.TEXT, allowNull: false },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      underscored: true,

      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",

      tableName: "videos",

      defaultScope: {
        where: {
          deleted: false,
        },
        order: [["created_at", "asc"]],
      },

      indexes: [
        {
          fields: ["meta"],
          using: "gin",
          operator: "jsonb_path_ops",
        },
        {
          name: "videos_idx_deleted",
          fields: ["deleted"],
        },
        {
          fields: ["public_meta"],
          using: "gin",
          operator: "jsonb_path_ops",
        },
        {
          fields: ["formats"],
          using: "gin",
          operator: "jsonb_path_ops",
        },
        {
          fields: ["user_id", "viewable", "deleted"],
        },
        {
          fields: ["id", "deleted"],
        },
        {
          fields: ["updated_at", "deleted"],
        },
        {
          fields: ["created_at", "deleted"],
        }
      ],
    }
  );

  Video.associate = (models) => {
    Video.belongsTo(models.User, { foreignKey: "user_id" });
    Video.belongsToMany(models.Post, {
      as: "PostVideos",
      through: "PostVideo",
    });
    Video.belongsToMany(models.Image, {
      as: "VideoImages",
      through: "VideoImage",
    });
    Video.belongsToMany(models.Point, {
      as: "PointVideos",
      through: "PointVideo",
    });
    Video.belongsToMany(models.User, {
      as: "UserProfileVideos",
      through: "UserProfileVideo",
    });
    Video.belongsToMany(models.Community, {
      as: "CommunityLogoVideos",
      through: "CommunityLogoVideo",
    });
    Video.belongsToMany(models.Group, {
      as: "GroupLogoVideos",
      through: "GroupLogoVideo",
    });
    Video.belongsToMany(models.Domain, {
      as: "DomainLogoVideos",
      through: "DomainLogoVideo",
    });
  };

  Video.defaultAttributesPublic = ["id", "updated_at", "formats"];

  Video.getRandomFileKey = (id) => {
    const random = Math.random().toString(36).substring(2, 9);
    return random + "_video" + id + ".mp4";
  };

  Video.getFullUrl = (meta) => {
    if (meta) {
      if (
        process.env.MINIO_ROOT_USER &&
        process.env.NODE_ENV === "development"
      ) {
        return meta.endPoint + "/" + meta.publicBucket + "/" + meta.fileKey;
      } else if (process.env.MINIO_ROOT_USER) {
        return (
          "https://" +
          meta.endPoint +
          "/" +
          meta.publicBucket +
          "/" +
          meta.fileKey
        );
      } else {
        return (
          "https://" +
          meta.publicBucket +
          "." +
          meta.endPoint +
          "/" +
          meta.fileKey
        );
      }
    }
  };

  Video.getThumbnailUrl = (video, number) => {
    const zerofilled = ("00000" + number).slice(-5);
    const fileKey =
      video.meta.fileKey + "_thumbs-" + video.id + "-" + zerofilled + ".png";
    if (process.env.MINIO_ROOT_USER && process.env.NODE_ENV === "development") {
      return (
        process.env.S3_ENDPOINT +
        "/" +
        process.env.S3_VIDEO_THUMBNAIL_BUCKET +
        "/" +
        fileKey
      );
    } else if (process.env.MINIO_ROOT_USER) {
      return (
        "https://" +
        process.env.S3_ENDPOINT +
        "/" +
        process.env.S3_VIDEO_THUMBNAIL_BUCKET +
        "/" +
        fileKey
      );
    } else {
      return (
        "https://" +
        video.meta.thumbnailBucket +
        "." +
        video.meta.endPoint +
        "/" +
        fileKey
      );
    }
  };

  Video.createAndGetSignedUploadUrl = (req, res) => {
    const userId = req.user.id;
    sequelize.models.Video.build({
      user_id: userId,
      user_agent: req.useragent.source,
      ip_address: req.clientIp,
    })
      .save()
      .then((video) => {
        video.getPreSignedUploadUrl({}, (error, presignedUrl) => {
          if (error) {
            log.error("Could not get preSigned URL for video", { error });
            res.sendStatus(500);
          } else {
            log.info("Got presigned url", { presignedUrl });
            res.send({ presignedUrl, videoId: video.id });
          }
        });
      })
      .catch((error) => {
        log.error("Could not create video", { error });
        res.sendStatus(500);
      });
  };

  Video.addToPost = (video, options, callback) => {
    sequelize.models.Post.findOne({
      where: {
        id: options.postId,
      },
    })
      .then((post) => {
        post.addPostVideo(video).then(() => {
          log.info("Have added video to post", { id: options.postId });
          if (
            process.env.GOOGLE_TRANSCODING_FLAC_BUCKET &&
            process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
          ) {
            if (!post.public_data) {
              post.set("public_data", {});
            }
            post.set("public_data.transcript", {});
            post.set("public_data.transcript", { videoId: video.id });
            post.set("public_data.transcript.inProgress", true);
            post.set("public_data.transcript.inProgressDate", new Date());
            const workPackage = {
              browserLanguage: options.browserLanguage,
              appLanguage: options.appLanguage,
              videoId: video.id,
              type: "create-video-transcript",
            };
            queue.add("process-voice-to-text", workPackage, "high");
            post
              .save()
              .then(() => {
                callback();
              })
              .catch((error) => {
                callback(error);
              });
          } else {
            callback();
          }
        });
      })
      .catch((error) => callback(error));
  };

  Video.addToDomain = (video, id, callback) => {
    sequelize.models.Domain.findOne({
      where: {
        id: id,
      },
    })
      .then((domain) => {
        domain.addDomainLogoVideo(video).then(() => {
          log.info("Have added video to domain", { id });
          callback();
        });
      })
      .catch((error) => callback(error));
  };

  Video.addToCommunity = (video, id, callback) => {
    sequelize.models.Community.findOne({
      where: {
        id: id,
      },
    })
      .then((community) => {
        community.addCommunityLogoVideo(video).then(() => {
          log.info("Have added video to community", { id });
          callback();
        });
      })
      .catch((error) => callback(error));
  };

  Video.addToGroup = (video, id, callback) => {
    sequelize.models.Group.findOne({
      where: {
        id: id,
      },
    })
      .then((group) => {
        group.addGroupLogoVideo(video).then(() => {
          log.info("Have added video to group", { id });
          callback();
        });
      })
      .catch((error) => callback(error));
  };

  Video.addToCollection = (video, options, callback) => {
    if (options.postId) {
      sequelize.models.Video.addToPost(video, options, callback);
    } else if (options.groupId) {
      sequelize.models.Video.addToGroup(video, options.groupId, callback);
    } else if (options.communityId) {
      sequelize.models.Video.addToCommunity(
        video,
        options.communityId,
        callback
      );
    } else if (options.domainId) {
      sequelize.models.Video.addToDomain(video, options.domainId, callback);
    } else {
      callback("No collection to add to");
    }
  };

  Video.setupThumbnailsAfterTranscoding = (video, duration, req, callback) => {
    const interval = 10;
    let frames = [];
    const numberOfFrames = Math.max(1, Math.floor(duration / interval));

    for (let frame = 0; frame < numberOfFrames; frame++) {
      frames.push(sequelize.models.Video.getThumbnailUrl(video, frame + 1));
    }

    async.forEachSeries(
      frames,
      (frame, foreachCallback) => {
        sequelize.models.Image.build({
          s3_bucket_name: video.meta.thumbnailBucket,
          user_id: req.user.id,
          user_agent: "AWS Transcoder",
          ip_address: "127.0.0.1",
          formats: JSON.stringify([frame]),
        })
          .save()
          .then((image) => {
            // We add a small delay to make sure the images can be ordered by updated_at
            setTimeout(() => {
              video
                .addVideoImage(image)
                .then(() => {
                  foreachCallback();
                })
                .catch((error) => {
                  foreachCallback(error);
                });
            }, 1);
          })
          .catch((error) => {
            foreachCallback(error);
          });
      },
      (error) => {
        callback(error);
      }
    );
  };

  Video.getTranscodingJobStatus = (video, req, res) => {
    if (process.env.USE_YOUR_PRIORITIES_ENCODER) {
      Video.getYrpriEncoderTranscodingJobStatus(video, req, res);
    } else {
      const params = {
        Id: req.body.jobId,
      };
      const eltr = new aws.ElasticTranscoder({
        apiVersion: "2012–09–25",
        region: process.env.S3_REGION ? process.env.S3_REGION : "eu-west-1",
      });
      eltr.readJob(params, (error, data) => {
        if (error) {
          log.error("Could not get status of transcoding job", { error });
          res.sendStatus(500);
        } else {
          const jobStatus = {
            status: data.Job.Status,
            statusDetail: data.Job.StatusDetail,
          };
          if (jobStatus.status === "Complete") {
            const duration = data.Job.Output.Duration;
            sequelize.models.Video.setupThumbnailsAfterTranscoding(
              video,
              duration,
              req,
              (error) => {
                if (error) {
                  log.error("Could not connect image and video", { error });
                  res.sendStatus(500);
                } else {
                  res.send(jobStatus);
                }
              }
            );
          } else if (jobStatus.status === "Error") {
            if (
              data.Job.Outputs &&
              data.Job.Outputs.length > 1 &&
              data.Job.Outputs[0].Status === "Complete" &&
              data.Job.Outputs[1].Status === "Error"
            ) {
              log.info("Transcoding no audio channel found", { data });
              const duration = data.Job.Output.Duration;
              sequelize.models.Video.setupThumbnailsAfterTranscoding(
                video,
                duration,
                req,
                (error) => {
                  if (error) {
                    log.error("Could not connect image and video", { error });
                    res.sendStatus(500);
                  } else {
                    res.send({ status: "Complete" });
                  }
                }
              );
            } else {
              log.error("Could not transcode video image and video", {
                jobStatus: jobStatus,
                data: data,
                dataJob: data.Job,
              });
              res.sendStatus(500);
            }
          } else {
            res.send(jobStatus);
          }
        }
      });
    }
  };

  Video.startTranscoding = (video, options, req, res) => {
    if (
      options.videoPostUploadLimitSec &&
      options.videoPostUploadLimitSec !== ""
    ) {
      const postLimitSeconds = parseInt(options.videoPostUploadLimitSec);
      video.set("meta.maxDuration", Math.min(postLimitSeconds, 600));
    } else if (
      options.videoPointUploadLimitSec &&
      options.videoPointUploadLimitSec !== ""
    ) {
      const pointLimitSeconds = parseInt(options.videoPointUploadLimitSec);
      video.set("meta.maxDuration", Math.min(pointLimitSeconds, 600));
    } else {
      video.set("meta.maxDuration", "600");
    }

    if (!video.public_meta) {
      video.set("public_meta", {});
    }

    if (options.aspect === "portrait") {
      video.set("meta.aspect", "portrait");
      video.set("public_meta.aspect", "portrait");
    } else if (options.aspect === "landscape") {
      video.set("meta.aspect", "landscape");
      video.set("public_meta.aspect", "landscape");
    }

    video
      .save()
      .then((video) => {
        sequelize.models.Video.startTranscodingJob(video, (error, data) => {
          if (error) {
            log.error("Could not start transcoding job", { error });
            res.sendStatus(500);
          } else {
            res.send({ transcodingJobId: data.Job.Id });
          }
        });
      })
      .catch((error) => {
        log.error("Could not start transcoding job", { error });
        res.sendStatus(500);
      });
  };

  Video.completeUploadAndAddToPoint = async (req, res, options, callback) => {
    if (req.body.isZiggeo) {
      await Video.addZiggeoVideo(req, res);
      callback();
    } else {
      sequelize.models.Video.findOne({
        where: {
          id: options.videoId,
        },
        attributes: sequelize.models.Video.defaultAttributesPublic.concat([
          "user_id",
          "meta",
        ]),
      })
        .then((video) => {
          if (video.user_id === req.user.id) {
            video.viewable = true;
            video.createFormats(video);
            video
              .save()
              .then(() => {
                sequelize.models.Point.findOne({
                  where: {
                    id: options.pointId,
                  },
                })
                  .then((point) => {
                    point.addPointVideo(video).then(() => {
                      log.info("Have added video to point", {
                        id: options.pointId,
                      });
                      callback();
                    });
                  })
                  .catch((error) => callback(error));
              })
              .catch((error) => {
                callback(error);
              });
          } else {
            callback("Could not get video for wrong user");
          }
        })
        .catch((error) => {
          callback(error);
        });
      }
  };

  Video.addZiggeoVideoToContainer = async (req, video) => {
    return await new Promise(async (resolve, reject) => {
      if (req.params.groupId) {
        const group = await sequelize.models.Group.findOne({
          where: {
            id: req.params.groupId,
          },
          attributes: ["id"],
        });
        if (group) {
          await group.addGroupLogoVideo(video);
          let b = 100;
        } else {
          reject("Could not find group for Ziggeo video", {
            groupId: req.params.groupId,
          });
        }
      } else if (req.params.communityId) {
        const community = await sequelize.models.Community.findOne({
          where: {
            id: req.params.communityId,
          },
          attributes: ["id"],
        });
        if (community) {
          await community.addCommunityLogoVideo(video);
        } else {
          reject("Could not find community for Ziggeo video", {
            communityId: req.params.communityId,
          });
        }
      } else if (req.params.domainId) {
        const domain = await sequelize.models.Domain.findOne({
          where: {
            id: req.params.domainId,
          },
          attributes: ["id"],
        });
        if (domain) {
          await domain.addDomainLogoVideo(video);
        } else {
          reject("Could not find domain for Ziggeo video", {
            domainId: req.params.domainId,
          });
        }
      } else if (req.params.postId) {
        const post = await sequelize.models.Post.findOne({
          where: {
            id: req.params.postId,
          },
          attributes: ["id"],
        });
        if (post) {
          await post.addPostVideo(video);
        } else {
          reject("Could not find post for Ziggeo video", {
            postId: req.params.postId,
          });
        }
      } else if (req.params.pointId) {
        const point = await sequelize.models.Point.findOne({
          where: { id: req.params.pointId },
          attributes: ["id"],
        });
        if (point) {
          await point.addPointVideo(video);
        } else {
          reject("Could not find point for Ziggeo video", {
            postId: req.params.pointId,
          });
        }
      } else {
        console.error("Can't find collection for Ziggeo video");
      }
      resolve();
    });
  };

  Video.addZiggeoVideo = async (req, res) => {
    return await new Promise(async (resolve, reject) => {
      try {
        const video = await sequelize.models.Video.create({
          user_id: req.user.id,
          user_agent: req.useragent.source,
          ip_address: req.clientIp,
          formats: [req.body.videoId],
          viewable: true,
          public_meta: {
            aspect: req.body.aspect,
            isZiggeo: true,
          },
        });

        await Video.addZiggeoVideoToContainer(req, video);
        if (!req.params.pointId) {
          res.sendStatus(200);
        }
        resolve();
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
        reject();
      }
    });
  };

  Video.completeUploadAndAddToCollection = async (req, res, options) => {
    if (req.body.isZiggeo) {
      await Video.addZiggeoVideo(req, res);
    } else {
      sequelize.models.Video.findOne({
        where: {
          id: options.videoId,
        },
        attributes: sequelize.models.Video.defaultAttributesPublic.concat([
          "user_id",
          "meta",
        ]),
      })
        .then((video) => {
          if (video.user_id === req.user.id) {
            video.viewable = true;
            video.createFormats(video);
            video
              .save()
              .then(() => {
                sequelize.models.Video.addToCollection(
                  video,
                  options,
                  (error) => {
                    if (error) {
                      log.error("Could not add video to collection", {
                        error,
                        options,
                      });
                      res.sendStatus(500);
                    } else {
                      if (options.postId) {
                        queue.add('process-moderation', {
                          type: 'post-review-and-annotate-images',
                          postId: options.postId }, 'medium', { delay: 20000 });
                      } else if (options.groupId) {
                        queue.add('process-moderation', {
                          type: 'collection-review-and-annotate-images',
                          collectionId: options.groupId,
                          collectionType: 'group' }, 'medium', { delay: 2000 });
                      } else if (options.communityId) {
                        queue.add('process-moderation', {
                          type: 'collection-review-and-annotate-images',
                          collectionId: options.communityId,
                          collectionType: 'community' }, 'medium', { delay: 2000 });
                      }
                      res.sendStatus(200);
                    }
                  }
                );
              })
              .catch((error) => {
                log.error("Could not save video", { error });
                res.sendStatus(500);
              });
          } else {
            log.error("Could not get video for wrong user");
            res.sendStatus(401);
          }
        })
        .catch((error) => {
          log.error("Could not get video", { error });
          res.sendStatus(500);
        });
    }
  };

  Video.startTranscodingJob = (video, callback) => {
    if (process.env.USE_YOUR_PRIORITIES_ENCODER) {
      Video.startYrpriEncoderTranscodingJob(video, callback);
    } else {
      const eltr = new aws.ElasticTranscoder({
        apiVersion: "2012–09–25",
        region: process.env.S3_REGION ? process.env.S3_REGION : "eu-west-1",
      });
      const fileKey = video.meta.fileKey;
      const pipelineId = process.env.AWS_TRANSCODER_PIPELINE_ID;
      let videoPresetId;

      if (video.meta.aspect && video.meta.aspect === "portrait") {
        videoPresetId = process.env.AWS_TRANSCODER_PORTRAIT_PRESET_ID;
      } else {
        videoPresetId = process.env.AWS_TRANSCODER_PRESET_ID;
      }

      const params = {
        PipelineId: pipelineId,
        Input: {
          Key: fileKey,
          FrameRate: "auto",
          Resolution: "auto",
          AspectRatio: "auto",
          Interlaced: "auto",
          Container: "auto",
          TimeSpan: {
            Duration: video.meta.maxDuration + ".000",
          },
        },
        Outputs: [
          {
            Key: fileKey,
            ThumbnailPattern: fileKey + "_thumbs-" + video.id + "-{count}",
            Rotate: "auto",
            PresetId: videoPresetId,
          },
          {
            Key: fileKey.slice(0, fileKey.length - 4) + ".flac",
            PresetId: process.env.AWS_TRANSCODER_FLAC_PRESET_ID,
          },
        ],
      };
      log.info("Starting AWS transcoding Job");
      eltr.createJob(params, (error, data) => {
        if (error) {
          log.error("Error creating AWS transcoding job", { error });
          callback(error);
        } else {
          callback(null, data);
        }
      });
    }
  };

  Video.prototype.createFormats = function (video) {
    this.formats = [];
    this.formats.push(sequelize.models.Video.getFullUrl(video.meta));
  };

  Video.prototype.getPreSignedUploadUrl = function (options, callback) {
    const endPoint = process.env.S3_ENDPOINT || "s3.amazonaws.com";
    const accelEndPoint =
      process.env.S3_ACCELERATED_ENDPOINT ||
      process.env.S3_ENDPOINT ||
      "s3.amazonaws.com";
    const s3 = new aws.S3({
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      endpoint: accelEndPoint,
      useAccelerateEndpoint: process.env.S3_ACCELERATED_ENDPOINT != null,
      region:
        process.env.S3_REGION ||
        (process.env.S3_ENDPOINT || process.env.S3_ACCELERATED_ENDPOINT
          ? null
          : "us-east-1"),
      s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE ? true : false,
    });

    const signedUrlExpireSeconds = 60 * 60;
    const bucketName = process.env.S3_VIDEO_UPLOAD_BUCKET;
    const publicBucket = process.env.S3_VIDEO_PUBLIC_BUCKET;
    const thumbnailBucket = process.env.S3_VIDEO_THUMBNAIL_BUCKET;

    const contentType = "video/mp4";
    const a = this.id;
    const fileKey = sequelize.models.Video.getRandomFileKey(this.id);

    const s3Params = {
      Bucket: bucketName,
      Key: fileKey,
      Expires: signedUrlExpireSeconds,
      ACL: process.env.S3_FORCE_PATH_STYLE
        ? undefined
        : "bucket-owner-full-control",
      ContentType: contentType,
    };
    s3.getSignedUrl("putObject", s3Params, (error, url) => {
      if (error) {
        log.error("Error getting presigned url from AWS S3", { error });
        callback(error);
      } else {
        let meta = {
          bucketName,
          publicBucket,
          endPoint,
          accelEndPoint,
          thumbnailBucket,
          maxDuration: options.maxDuration,
          fileKey,
          contentType,
          uploadUrl: url,
        };
        if (this.meta) meta = _.merge(this.meta, meta);
        this.set("meta", meta);
        log.info("Presigned URL:", { url, meta });
        log.info("Saving video metadata");
        this.save()
          .then(() => {
            callback(null, url);
          })
          .catch((error) => {
            callback(error);
          });
      }
    });
  };

  // Using Your Priorities Encoder

  Video.startYrpriEncoderTranscodingJob = (video, callback) => {
    if (video && video.meta) {
      const fileKey = video.meta.fileKey;
      let jobPackage = {
        portrait:
          video.meta.aspect && video.meta.aspect === "portrait",
        fileKey,
        duration: video.meta.maxDuration + ".000",
        thumbnailPattern: fileKey + "_thumbs-" + video.id + "-{count}",
        flacFilename: fileKey.slice(0, fileKey.length - 4) + ".flac",
      };
      sequelize.models.AcBackgroundJob.createJob(
        jobPackage,
        {},
        async (error, jobId) => {
          log.info("Starting YRPRI transcoding Job");
          if (error) {
            log.error("Error creating YRPRI transcoding job", { error });
            callback(error);
          } else {
            jobPackage = _.merge(jobPackage, {
              acBackgroundJobId: jobId,
            });

            await bullVideoQueue.add(jobPackage);
            callback(null, { Job: { Id: jobId } });
          }
        }
      );
    } else {
      callback("No video or video meta");
    }
  };

  Video.getYrpriEncoderTranscodingJobStatus = (video, req, res) => {
    sequelize.models.AcBackgroundJob.findOne({
      where: {
        id: req.body.jobId,
      },
    })
      .then((job) => {
        if (job) {
          const jobStatus = { status: job.data.status, statusDetail: "" };
          if (job.data.status === "Complete") {
            const duration = job.data.finalDuration;
            sequelize.models.Video.setupThumbnailsAfterTranscoding(
              video,
              duration,
              req,
              (error) => {
                if (error) {
                  log.error("Could not connect image and video", { error });
                  res.sendStatus(500);
                } else {
                  res.send(jobStatus);
                }
              }
            );
          } else if (job.data.status === "Error") {
            log.error("Could not transcode video image and video", {
              jobStatus: jobStatus,
              data: job.data,
            });
            res.sendStatus(500);
          } else {
            res.send(jobStatus);
          }
        } else {
          log.error("Could not find transcoding job");
          res.sendStatus(404);
        }
      })
      .catch((error) => {
        log.error("Could not transcode image and video", { error });
        res.sendStatus(500);
      });
  };

  return Video;
};
