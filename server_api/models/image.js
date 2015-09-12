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
    s3_bucket_name: DataTypes.STRING,
    s3_name: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'images',
    classMethods: {
      getUploadClient: function () {
        var client = new Upload('my_s3_bucket', {
          aws: {
            path: 'images/',
            region: 'us-east-1',
            acl: 'public-read'
          },

          cleanup: {
            versions: true,
            original: false
          },

          original: {
            awsImageAcl: 'private'
          },

          versions: [{
            maxHeight: 1040,
            maxWidth: 1040,
            format: 'jpg',
            suffix: '-large',
            quality: 80
          },{
            maxWidth: 780,
            aspect: '3:2!h',
            suffix: '-medium'
          },{
            maxWidth: 320,
            aspect: '16:9!h',
            suffix: '-small'
          },{
            maxHeight: 100,
            aspect: '1:1',
            format: 'png',
            suffix: '-thumb1'
          },{
            maxHeight: 250,
            maxWidth: 250,
            aspect: '1:1',
            suffix: '-thumb2'
          }]
        });
      },
      associate: function(models) {
        Image.belongsTo(models.User);
        Image.belongsToMany(models.Idea, { through: 'IdeaImage' });
        Image.belongsToMany(models.Group, { through: 'GroupImage' });
        Image.belongsToMany(models.Community, { through: 'CommunityImage' });
      }
    }
  });

  return Image;
};
