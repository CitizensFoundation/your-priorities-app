var express = require('express');
var router = express.Router();
var models = require("../models");
var multer  = require('multer');
var multerMultipartResolver = multer({ dest: 'uploads/' }).single('file');
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401).send('Unauthorized');
};

var createFormatsFromVersions = function (versions) {
  var formats = [];
  versions.forEach(function(version) {
    var n = version.url.lastIndexOf(process.env.S3_BUCKET);
    var path = version.url.substring(n+process.env.S3_BUCKET.length, version.url.length);
    var newUrl = "https://"+process.env.S3_BUCKET+".s3.amazonaws.com"+path;
    formats.push(newUrl);
  });
  return formats;
};

var sendError = function (res, image, context, user, error) {
  log.error("Image Error", { context: context, image: toJson(image),
                             user: toJson(user), err: error, errorStatus: 500 });
  res.sendStatus(500);
};

router.post('/', isAuthenticated, function(req, res) {
  multerMultipartResolver(req, res, function (error) {
    if (error) {
      sendError(res, image, 'multerMultipartResolver', res.user, error);
    } else {
      var s3UploadClient = models.Image.getUploadClient(process.env.S3_BUCKET, req.query.itemType);
      s3UploadClient.upload(req.file.path, {}, function(err, versions, meta) {
        if (error) {
          sendError(res, image, 's3UploadClient', res.user, error);
        } else {
          var image = models.Image.build({
            user_id: req.user.id,
            s3_bucket_name: process.env.S3_BUCKET,
            original_filename: req.file.originalname,
            formats: JSON.stringify(createFormatsFromVersions(versions)),
            user_agent: req.useragent,
            ip_address: req.clientIp
          });
          image.save().then(function() {
            log.info('Image Created', { image: toJson(image), context: 'create', user: toJson(req.user) });
            res.send(image);
          }).catch(function(error) {
            sendError(res, req.file.originalname, 'create', res.user, error);
          });
        }
      });
    }
  });
});

module.exports = router;
