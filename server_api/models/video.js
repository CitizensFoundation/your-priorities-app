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
    formats: DataTypes.TEXT,
    original_filename: DataTypes.STRING,
    s3_bucket_name: DataTypes.STRING,
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

    classMethods: {

      defaultAttributesPublic: ["id","updated_at","formats"],

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

      getUploadClient: function (itemType) {
        var versions;

        if (itemType && itemType === 'user-profile') {
          versions = [
            {
              maxHeight: 200,
              maxWidth: 200,
              format: 'png',
              aspect: '1:1!h',
              suffix: '-small',
              quality: 99
            },
            {
              maxHeight: 50,
              maxWidth: 50,
              aspect: '1:1!h',
              format: 'png',
              suffix: '-tiny',
              quality: 99
            }
          ]
        } else if (itemType && itemType === 'domain-logo') {
            versions = [
              {
                maxWidth: 864,
                maxHeight: 486,
                format: 'png',
                suffix: '-retina',
                quality: 99
              },
              {
                maxWidth: 432,
                maxHeight: 243,
                format: 'png',
                suffix: '-medium',
                quality: 99
              }
            ]
        } else if (itemType && itemType === 'community-logo') {
          versions = [
            {
              maxWidth: 864,
              maxHeight: 486,
              format: 'png',
              suffix: '-retina',
              quality: 99
            },
            {
              maxWidth: 432,
              maxHeight: 243,
              format: 'png',
              suffix: '-medium',
              quality: 99
            }
          ]
        } else if (itemType && itemType === 'app-home-screen-icon') {
          versions = [
            {
              maxWidth: 512,
              maxHeight: 512,
              format: 'png',
              suffix: '-512',
              quality: 99
            },
            {
              maxWidth: 384,
              maxHeight: 384,
              format: 'png',
              suffix: '-384',
              quality: 99
            },
            {
              maxWidth: 256,
              maxHeight: 256,
              format: 'png',
              suffix: '-256',
              quality: 99
            },
            {
              maxWidth: 192,
              maxHeight: 192,
              format: 'png',
              suffix: '-192',
              quality: 99
            },
            {
              maxWidth: 180,
              maxHeight: 180,
              format: 'png',
              suffix: '-180',
              quality: 99
            },
            {
              maxWidth: 152,
              maxHeight: 152,
              format: 'png',
              suffix: '-152',
              quality: 99
            },
            {
              maxWidth: 144,
              maxHeight: 144,
              format: 'png',
              suffix: '-144',
              quality: 99
            },
            {
              maxWidth: 96,
              maxHeight: 96,
              format: 'png',
              suffix: '-96',
              quality: 99
            },
            {
              maxWidth: 48,
              maxHeight: 48,
              format: 'png',
              suffix: '-48',
              quality: 99
            }
          ]
        } else if (itemType && itemType === 'organization-logo') {
          versions = [
            {
              maxWidth: 1000,
              maxHeight: 1000,
              format: 'png',
              suffix: '-large',
              quality: 99
            },
            {
              maxWidth: 200,
              maxHeight: 200,
              format: 'png',
              suffix: '-medium',
              quality: 99
            },
            {
              maxWidth: 50,
              maxHeight: 50,
              format: 'png',
              suffix: '-small',
              quality: 99
            }
          ]
        } else if (itemType && itemType === 'group-logo') {
          versions = [
            {
              maxWidth: 864,
              maxHeight: 486,
              format: 'png',
              suffix: '-retina',
              quality: 99
            },
            {
              maxWidth: 432,
              maxHeight: 243,
              format: 'png',
              suffix: '-medium',
              quality: 99
            }
          ]
        } else if (itemType && itemType === 'post-header') {
          versions = [
            {
              maxWidth: 864,
              maxHeight: 486,
              format: 'png',
              suffix: '-retina',
              quality: 99
            },
            {
              maxWidth: 432,
              maxHeight: 243,
              format: 'png',
              suffix: '-medium',
              quality: 99
            }
          ]
        } else if (itemType && itemType === 'category-icon') {
          versions = [
            {
              maxWidth: 864,
              maxHeight: 486,
              format: 'png',
              suffix: '-retina',
              quality: 99
            },
            {
              maxWidth: 432,
              maxHeight: 243,
              format: 'png',
              suffix: '-medium',
              quality: 99
            }
          ]
        } else if (itemType && itemType.indexOf('-header') > -1) {
          versions = [
            {
              maxHeight: 300,
              format: 'png',
              suffix: '-large',
              quality: 99
            }
          ]
        } else if (itemType && itemType.indexOf('post-user-video') > -1) {
          versions = [
            {
              maxHeight: 2048,
              maxWidth: 1536,
              format: 'png',
              suffix: '-desktop-retina',
              quality: 99
            },
            {
              maxHeight: 720,
              maxWidth: 540,
              format: 'png',
              suffix: '-mobile-retina',
              quality: 99
            },
            {
              maxHeight: 120,
              maxWidth: 90,
              format: 'png',
              suffix: '-thumb',
              quality: 99
            }
          ]
        } else {
          versions = [
            {
              maxWidth: 945,
              format: 'jpg',
              suffix: '-16_9',
              aspect: '16:9!h',
              quality: 80
            },
            {
              maxHeight: 512,
              maxWidth: 512,
              format: 'jpg',
              suffix: '-box',
              quality: 80
            },
            {
              maxWidth: 945,
              format: 'jpg',
              suffix: '-header',
              quality: 80
            }
          ]
        }

        return new Upload(process.env.S3_BUCKET, {
          aws: {
            endpoint: process.env.S3_ENDPOINT || null,
            region: process.env.S3_REGION || (process.env.S3_ENDPOINT ? null : 'us-east-1'),
            acl: 'public-read'
          },

          cleanup: {
            versions: false,
            original: false
          },

          versions: versions
        });
      },

      associate: function(models) {
        Video.belongsTo(models.User);
        Video.belongsToMany(models.Post, { as: 'PostVideos', through: 'PostVideo' });
        Video.belongsToMany(models.Community, { as: 'CommunityLogoVideos', through: 'CommunityLogoVideo' });
        Video.belongsToMany(models.Community, { as: 'CommunityLogoVideos', through: 'CommunityLogoVideo' });
        Video.belongsToMany(models.User, { as: 'UserProfileVideos', through: 'UserProfileVideo' });
        Video.belongsToMany(models.Group, { as: 'GroupLogoVideos', through: 'GroupLogoVideo' });
        Video.belongsToMany(models.Domain, { as: 'DomainLogoVideos', through: 'DomainLogoVideo' });
      },

      downloadFacebookVideosForUser: function (user, done) {
        var facebookId = user.facebook_id;
        //var facebookId = 746850516;
        if (facebookId && !user.UserProfileVideos || user.UserProfileVideos.length===0) {
          request.get('https://graph.facebook.com/' + facebookId + '/picture', function (err, downloadResponse, body) {
            if (err) {
              return done(err);
            }
            var filepath = "uploads/fb_video_download"+randomstring.generate(10) + '.png';
            var originalFilename = "facebook_profile_"+facebookId+".png";
            fs.writeFile(filepath, body, function(err) {
              if (err) {
                log.error("Error when trying to write video", {err: error});
                return done(err);
              }
              var s3UploadClient = sequelize.models.Video.getUploadClient("user-profile");
              s3UploadClient.upload(filepath, {}, function(error, versions, meta) {
                if (error) {
                  done(error);
                } else {
                  var video = sequelize.models.Video.build({
                    user_id: user.id,
                    s3_bucket_name: process.env.S3_BUCKET,
                    original_filename: originalFilename,
                    formats: JSON.stringify(sequelize.models.Video.createFormatsFromVersions(versions)),
                    user_agent: "Downloaded from Facebook",
                    ip_address: "127.0.0.1"
                  });
                  video.save().then(function() {
                    log.info('Video Created', { video: toJson(video), context: 'create', user: toJson(user) });
                    user.setupVideos({uploadedProfileVideoId: video.id}, function (error) {
                      fs.unlink(filepath, function(error) {
                        if (error) {
                          log.error("Error in unlinking video file: "+filepath);
                          return done(error);
                        } else {
                          setTimeout(function () {
                            sequelize.models.User.getUserWithAll(user.id, function (error, newUser) {
                              done(null, newUser);
                            });
                          },10);
                        }
                      });
                    });
                  }).catch(function(error) {
                    done(error);
                  });
                }
              });
            });
          });
        } else {
          log.info("User already has an video", {user: user, facebook_id: user ? user.facebook_id : null});
          done()
        }
      }
    }
  });

  return Video;
};
