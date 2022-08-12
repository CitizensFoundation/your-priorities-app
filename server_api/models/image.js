"use strict";

const request = require('request').defaults({ encoding: null });
const fs = require('fs');
const randomstring = require("randomstring");
const log = require('../utils/logger');
const toJson = require('../utils/to_json');

const Upload = require('s3-uploader');

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    license: DataTypes.STRING,
    cc_url: DataTypes.STRING,
    original_url: DataTypes.STRING,
    photographer_name: DataTypes.STRING,
    formats: DataTypes.TEXT,
    original_filename: DataTypes.STRING,
    s3_bucket_name: DataTypes.STRING,
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    location: DataTypes.JSONB,
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    timestamps: true,

    tableName: 'images',

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
        fields: ['id', 'deleted']
      },
      {
        name: 'images_idx_deleted',
        fields: ['deleted']
      }
    ]
  });

  Image.associate = (models) => {
    Image.belongsTo(models.User, { foreignKey: 'user_id'});
    Image.belongsToMany(models.Video, { as: 'VideoImages', through: 'VideoImage' });
    Image.belongsToMany(models.Post, { as: 'PostImages', through: 'PostImage' });
    Image.belongsToMany(models.Post, { as: 'PostHeaderImages', through: 'PostHeaderImage' });
    Image.belongsToMany(models.Post, { as: 'PostUserImages', through: 'PostUserImage' });
    Image.belongsToMany(models.Group, { through: 'GroupImage' });
    Image.belongsToMany(models.Community, { as: 'CommunityLogoImages', through: 'CommunityLogoImage' });
    Image.belongsToMany(models.Community, { as: 'CommunityHeaderImages', through: 'CommunityHeaderImage' });
    Image.belongsToMany(models.User, { as: 'UserProfileImages', through: 'UserProfileImage' });
    Image.belongsToMany(models.User, { as: 'UserHeaderImages', through: 'UserHeaderImage' });
    Image.belongsToMany(models.Category, { as: 'CategoryIconImages', through: 'CategoryIconImage' });
    Image.belongsToMany(models.Category, { as: 'CategoryHeaderImages', through: 'CategoryHeaderImage' });
    Image.belongsToMany(models.Group, { as: 'GroupLogoImages', through: 'GroupLogoImage' });
    Image.belongsToMany(models.Group, { as: 'GroupHeaderImages', through: 'GroupHeaderImage' });
    Image.belongsToMany(models.Domain, { as: 'DomainLogoImages', through: 'DomainLogoImage' });
    Image.belongsToMany(models.Domain, { as: 'DomainHeaderImages', through: 'DomainHeaderImage' });
  };

  Image.defaultAttributesPublic = ["id","updated_at","formats"];

  Image.createFormatsFromVersions = (versions) => {
    const formats = [];
    versions.forEach((version) => {
      const n = version.url.lastIndexOf(process.env.S3_BUCKET);
      const path = version.url.substring(n+process.env.S3_BUCKET.length, version.url.length);
      let newUrl;

      if (process.env.MINIO_ROOT_USER && process.env.NODE_ENV === 'development') {
        newUrl = process.env.S3_ENDPOINT
          + "/" + process.env.S3_BUCKET
          + path;
      } else if (process.env.MINIO_ROOT_USER) {
        newUrl = "https://"
          + process.env.S3_ENDPOINT
          + "/" + process.env.S3_BUCKET
          + path;
      } else {
        newUrl = "https://"
          + process.env.S3_BUCKET + "." + (process.env.S3_ENDPOINT || "s3.amazonaws.com")
          + path;
      }
      formats.push(newUrl);
    });
    return formats;
  };

  Image.getUploadClient = (itemType) => {
    let versions;

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
    } else if (itemType && itemType.indexOf('post-user-image') > -1) {
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
        acl: 'public-read',
        s3ForcePathStyle: process.env.MINIO_ROOT_USER ? true : undefined,
        signatureVersion: process.env.MINIO_ROOT_USER ? 'v4' : undefined
      },

      cleanup: {
        versions: false,
        original: false
      },

      versions: versions
    });
  };

  Image.downloadFacebookImagesForUser = (user, done) => {
    const facebookId = user.facebook_id;
    if (facebookId && !user.UserProfileImages || user.UserProfileImages.length===0) {
      request.get('https://graph.facebook.com/' + facebookId + '/picture',  (err, downloadResponse, body) => {
        if (err) {
          return done(err);
        }
        const filepath = "uploads/fb_image_download"+randomstring.generate(10) + '.png';
        const originalFilename = "facebook_profile_"+facebookId+".png";
        fs.writeFile(filepath, body, (err) => {
          if (err) {
            log.error("Error when trying to write image", {err: error});
            return done(err);
          }
          const s3UploadClient = sequelize.models.Image.getUploadClient("user-profile");
          s3UploadClient.upload(filepath, {}, (error, versions, meta) => {
            if (error) {
              done(error);
            } else {
              const image = sequelize.models.Image.build({
                user_id: user.id,
                s3_bucket_name: process.env.S3_BUCKET,
                original_filename: originalFilename,
                formats: JSON.stringify(sequelize.models.Image.createFormatsFromVersions(versions)),
                user_agent: "Downloaded from Facebook",
                ip_address: "127.0.0.1"
              });
              image.save().then(() => {
                log.info('Image Created', { imageId: image ? image.id : -1, context: 'create', userId: user ? user.id : -1 });
                user.setupImages({uploadedProfileImageId: image.id}, (error) => {
                  fs.unlink(filepath, (error) => {
                    if (error) {
                      log.error("Error in unlinking image file: "+filepath);
                      return done(error);
                    } else {
                      setTimeout(() => {
                        sequelize.models.User.getUserWithAll(user.id, (error, newUser) => {
                          done(null, newUser);
                        });
                      },10);
                    }
                  });
                });
              }).catch((error) => {
                done(error);
              });
            }
          });
        });
      });
    } else {
      log.info("User already has an image", {user: user });
      done()
    }
  };

  return Image;
};
