var express = require('express');
var router = express.Router();
var models = require("../models");
var multer  = require('multer');
var multerMultipartResolver = multer({ dest: 'uploads/' }).single('file');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401).send('Unauthorized');
}

function createFormatFromVersions(versions) {
  var formats = [];
  versions.forEach(function(version) {
    formats.push(version.url);
  });
  return formats;
}

router.post('/', isAuthenticated, function(req, res) {
  multerMultipartResolver(req, res, function (err) {
    if (err) { throw err; }
    var s3UploadClient = models.Image.getUploadClient(process.env.S3_BUCKET);
    s3UploadClient.upload(req.file.path, {}, function(err, versions, meta) {
      if (err) { throw err; }
      var image = models.Image.build({
        user_id: req.user.id,
        s3_bucket_name: process.env.S3_BUCKET,
        original_filename: req.file.originalname,
        formats: JSON.stringify(createFormatFromVersions(versions))
      });
      image.save().then(function() {
        res.send(image);
      }).catch(function(error) {
        res.sendStatus(403);
      });
    });
  });
});

module.exports = router;
