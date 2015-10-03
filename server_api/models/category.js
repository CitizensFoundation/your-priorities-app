var async = require("async");

"use strict";

module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    icon_file_name: DataTypes.STRING
  }, {
    underscored: true,
    
    tableName: 'categories',

    instanceMethods: {

      setupIconImage: function(body, done) {
        if (body.uploadedIconImageId) {
          sequelize.models.Image.find({
            where: {id: body.uploadedIconImageId}
          }).then(function (image) {
            if (image)
              this.addCategoryIconImage(image);
            done();
          }.bind(this));
        } else done();
      },

      setupHeaderImage: function(body, done) {
        if (body.uploadedHeaderImageId) {
          sequelize.models.Image.find({
            where: {id: body.uploadedHeaderImageId}
          }).then(function (image) {
            if (image)
              this.addCategoryHeaderImage(image);
            done();
          }.bind(this));
        } else done();
      },

      setupImages: function(body, done) {
        async.parallel([
          function(callback) {
            this.setupIconImage(body, function (err) {
              if (err) return callback(err);
              callback();
            });
          }.bind(this),
          function(callback) {
            this.setupHeaderImage(body, function (err) {
              if (err) return callback(err);
              callback();
            });
          }.bind(this)
        ], function(err) {
          done(err);
        });
      }
    },
    
    classMethods: {
      associate: function(models) {
        Category.hasMany(models.Idea);
        Category.belongsTo(models.Group);
        Category.belongsToMany(models.Image, { as: 'CategoryIconImages', through: 'CategoryIconImage' });
        Category.belongsToMany(models.Image, { as: 'CategoryHeaderImages', through: 'CategoryHeaderImage' });
      }
    }
  });

  return Category;
};
