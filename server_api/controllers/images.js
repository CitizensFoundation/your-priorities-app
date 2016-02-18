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
      s3UploadClient.upload(req.file.path, {}, function(error, versions, meta) {
        if (error) {
          sendError(res, image, 's3UploadClient', res.user, error);
        } else {
          var image = models.Image.build({
            user_id: req.user.id,
            s3_bucket_name: process.env.S3_BUCKET,
            original_filename: req.file.originalname,
            formats: JSON.stringify(models.Image.createFormatsFromVersions(versions)),
            user_agent: req.useragent.source,
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
