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
router.get('/hasVideoUploadSupport', (req, res) => {
  res.send({ hasVideoUploadSupport: process.env.S3_VIDEO_UPLOAD_BUCKET!=null })
});

router.post('/createAndGetPreSignedUploadUrl', auth.isLoggedIn, (req, res) => {
  models.Video.createAndGetSignedUploadUrl(req, res);
});

router.put('/:postId/completeAndAddToPost', auth.can('edit post'), (req, res) => {
  models.Video.completeUploadAndAddToCollection(req, res, { postId: req.params.postId, videoId: req.body.videoId });
});

router.put('/:groupId/completeAndAddToGroup', auth.can('edit group'), (req, res) => {
  models.Video.completeUploadAndAddToCollection(req, res, { groupId: req.params.groupId, videoId: req.body.videoId });
});

router.put('/:communityId/completeAndAddToCommunity', auth.can('edit community'), (req, res) => {
  models.Video.completeUploadAndAddToCollection(req, res, { communityId: req.params.communityId, videoId: req.body.videoId });
});

router.put('/:domainId/completeAndAddToDomain', auth.can('edit domain'), (req, res) => {
  models.Video.completeUploadAndAddToCollection(req, res, { domainId: req.params.domainId, videoId: req.body.videoId });
});

router.post('/:videoId/startTranscoding', auth.isLoggedIn, (req, res) => {
  const options = {
    videoPostUploadLimitSec: req.body.videoPostUploadLimitSec,
    videoPointUploadLimitSec: req.body.videoPointUploadLimitSec,
  };

  models.Video.find({
    where: {
      id: req.params.videoId
    }
  }).then((video) => {
    if (video && video.user_id===req.user.id) {
      models.Video.startTranscoding(video, options, req, res);
    } else {
      log.error("Can't find video or not same user", { videoUserId: video ? video.user_id : -1, userId: req.user.id });
      res.sendStatus(404);
    }
  }).catch((error) => {
    log.error("Error getting video", { error });
    res.sendStatus(500);
  });
});

router.put('/:videoId/getTranscodingJobStatus', auth.isLoggedIn, (req, res) => {
  models.Video.find({
    where: {
      id: req.params.videoId
    }
  }).then((video) => {
    if (video && video.user_id===req.user.id) {
      models.Video.getTranscodingJobStatus(video, req, res);
    } else {
      log.error("Can't find video or not same user", { videoUserId: video ? video.user_id : -1, userId: req.user.id });
      res.sendStatus(404);
    }
  }).catch((error) => {
    log.error("Error getting video", { error });
    res.sendStatus(500);
  });
});


module.exports = router;
