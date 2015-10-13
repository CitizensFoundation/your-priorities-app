var async = require("async");

"use strict";

var Upload = require('s3-uploader');

module.exports = function(sequelize, DataTypes) {
  var Image = sequelize.define("Image", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    license: DataTypes.STRING,
    cc_url: DataTypes.STRING,
    original_url: DataTypes.STRING,
    photographer_name: DataTypes.STRING,
    formats: DataTypes.TEXT,
    original_filename: DataTypes.STRING,
    s3_bucket_name: DataTypes.STRING
  }, {

    underscored: true,

    tableName: 'images',

    defaultScope: {
      order: 'updated_at ASC'
    },

    classMethods: {
      getUploadClient: function (s3BucketName, itemType) {
        var versions;

        if (itemType && itemType === 'user-profile') {
          versions = [
            {
              maxHeight: 200,
              maxWidth: 200,
              format: 'png',
              suffix: '-large',
              quality: 80
            },
            {
              maxHeight: 50,
              maxWidth: 50,
              format: 'png',
              suffix: '-small',
              quality: 80
            }
          ]
        } else if (itemType && itemType === 'domain-logo') {
            versions = [
              {
                maxHeight: 233,
                maxWidth: 665,
                format: 'png',
                suffix: '-large',
                quality: 99
              }
            ]
        } else if (itemType && itemType === 'community-logo') {
          versions = [
            {
              maxHeight: 335,
              maxWidth: 432,
              format: 'png',
              suffix: '-large',
              quality: 99
            }
          ]
        } else if (itemType && itemType === 'group-logo') {
          versions = [
            {
              maxHeight: 100,
              maxWidth: 420,
              format: 'png',
              suffix: '-large',
              quality: 99
            }
          ]
        } else if (itemType && itemType === 'idea-header') {
          versions = [
            {
              maxHeight: 232,
              maxWidth: 420,
              format: 'png',
              suffix: '-large',
              quality: 99
            }
          ]
        } else if (itemType && itemType === 'category-icon') {
          versions = [
            {
              maxHeight: 200,
              maxWidth: 200,
              format: 'png',
              suffix: '-large',
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

        return new Upload(s3BucketName, {
          aws: {
            region: 'us-east-1',
            acl: 'public-read'
          },

          cleanup: {
            versions: false,
            original: false
          },

          original: {
            awsImageAcl: 'private'
          },

          versions: versions
        });
      },

      associate: function(models) {
        Image.belongsTo(models.User);
        Image.belongsToMany(models.Idea, { as: 'IdeaImages', through: 'IdeaImage' });
        Image.belongsToMany(models.Idea, { as: 'IdeaHeaderImages', through: 'IdeaHeaderImage' });
        Image.belongsToMany(models.Idea, { as: 'IdeaUserImages', through: 'IdeaUserImage' });
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
      }
    }
  });

  return Image;
};
