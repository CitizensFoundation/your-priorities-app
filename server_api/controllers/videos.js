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

var sendError = function (res, video, context, user, error) {
  log.error("Video Error", { context: context, video: toJson(video),
                             user: toJson(user), err: error, errorStatus: 500 });
  res.sendStatus(500);
};

var sendPostUserVideoActivity = function(req, type, post, video, callback) {
  models.AcActivity.createActivity({
    type: type,
    userId: post.user_id,
    domainId: req.ypDomain.id,
    groupId: post.group_id,
//    communityId: req.ypCommunity ?  req.ypCommunity.id : null,
    postId : post.id,
    videoId: video.id,
    access: models.AcActivity.ACCESS_PUBLIC
  }, function (error) {
    callback(error);
  });
};

var addUserVideoToPost = function(postId, videoId, callback) {
  models.Post.find({
    where: { id: postId },
    attributes: ['id']
  }).then(function (post) {
    if (post) {
      models.Video.find({
        where: {
          id: videoId
        }
      }).then(function (video) {
        if (video) {
          post.addPostUserVideo(video).then(function (results) {
            callback(null, post, video);
          });
        }
      });
    }
  }).catch(function (error) {
    callback(error);
  });
};

var deleteVideo = function (videoId, callback) {
  models.Video.find({
    where: { id: videoId },
    attributes: ['id','deleted']
  }).then(function (video) {
    if (video) {
    video.deleted = true;
      video.save().then(function () {
        log.info('Post User Video Deleted', { videoId: videoId, context: 'delete' });
      });
      callback();
    } else {
      log.error('Post User Video Delete Error', { videoId: videoId, context: 'delete' });
      callback('Not found');
    }
  }).catch(function(error) {
    callback(error);
  });
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

router.put('/:videoId/:jobId/getTranscodingJobStatus', auth.can('edit post'), (req, res) => {
  models.Video.getTranscodingJobStatus(req, res);
});

// Post User Videos
router.get('/:postId/user_videos', auth.can('view post'), function(req, res) {
  models.Post.find({
    where: {
      id: req.params.postId
    },
    order: [
      [ { model: models.Video, as: 'PostUserVideos' } , 'created_at', 'desc' ]
    ],
    attributes: ['id'],
    include: [
      {
        model: models.Video,
        as: 'PostUserVideos',
        required: true,
        where: {
          deleted: false
        }
      }
    ]
  }).then(function(post) {
    if (post) {
      log.info('Post User Videos Viewed', { postId: post.id, context: 'view', user: toJson(req.user) });
      res.send(post.PostUserVideos);
    } else {
      res.send([]);
    }
  }).catch(function(error) {
    log.error("Get videos did not work", { error });
    res.sendStatus(500);
  });
});

module.exports = router;
