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

// TODO: Pagination
router.get('/:videoId/comments', auth.can('view video'), function(req, res) {
  models.Point.findAll({
    where: {
      video_id: req.params.videoId
    },
    order: [
      ["created_at", "asc"],
      [ models.PointRevision, models.User, { model: models.Video, as: 'UserProfileVideos' }, 'created_at', 'asc' ]
    ],
    include: [
      {
        model: models.PointRevision,
        include: [
          {
            model: models.User,
            attributes: models.User.defaultAttributesWithSocialMediaPublic,
            include: [
              {
                model: models.Video, as: 'UserProfileVideos',
                required: false
              }
            ]
          }
        ]
      }
    ]
  }).then(function (comments) {
    log.info('Point Comment for Video', {context: 'comment', user: req.user ? toJson(req.user.simple()) : null });
    res.send(comments);
  }).catch(function (error) {
    log.error('Could not get comments for video', { err: error, context: 'comment', user: req.user ? toJson(req.user.simple()) : null });
    res.sendStatus(500);
  });
});

route.get('/hasVideoUploadSupport', (req, res) => {
  res.send({ hasVideoUploadSupport: process.env.S3_VIDEO_UPLOAD_BUCKET!=null })
});

router.get('/:videoId/commentsCount', auth.can('view video'), function(req, res) {
  models.Point.count({
    where: {
      video_id: req.params.videoId
    }
  }).then(function (commentsCount) {
    res.send({count: commentsCount});
    log.info('Point Comment Count for Video', {context: 'comment', user: req.user ? toJson(req.user.simple()) : null });
  }).catch(function (error) {
    log.error('Could not get comments count for video', { err: error, context: 'comment', user: req.user ? toJson(req.user.simple()) : null  });
    res.sendStatus(500);
  });
});

router.post('/:videoId/commentsCount', auth.can('view video'), function(req, res) {
  models.Point.count({
    where: {
      video_id: req.params.videoId
    }
  }).then(function (commentsCount) {
    res.send({count: commentsCount});
    log.info('Point Comment Count for Video', {context: 'comment', user: req.user ? toJson(req.user.simple()) : null });
  }).catch(function (error) {
    log.error('Could not get comments count for video', { err: error, context: 'comment', user: req.user ? toJson(req.user.simple()) : null  });
    res.sendStatus(500);
  });
});

router.post('/:videoId/comment', auth.isLoggedIn, auth.can('view video'), function(req, res) {
  models.Point.createComment(req, { video_id: req.params.videoId, comment: req.body.comment }, function (error) {
    if (error) {
      log.error('Could not save comment point on video', { err: error, context: 'comment', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point Comment Created on Video', {context: 'comment', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/createAndGetPreSignedUploadUrl', auth.isLoggedIn, auth.can('view group'), (req, res) => {
  models.Video.createAndGetSignedUploadUrl(req, res);
});

router.put(':postId/:videoId/completeAndAddToPost', auth.can('edit post'), (req, res) => {
  models.Video.completeUploadAndAddToCollection(req, res, { postId: req.params.postId, videoId: req.params.videoId });
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

router.post('/:postId/user_videos', auth.can('add post user videos'), function(req, res) {
  addUserVideoToPost(req.params.postId, req.body.uploadedPostUserVideoId, function (error, post, video) {
    if (post && video) {
      video.photographer_name = req.body.photographerName;
      video.description = req.body.description;
      video.save().then(function (results) {
        sendPostUserVideoActivity(req, 'activity.post.userVideo.new', post, video, function (error) {
          log.info("Post User Video Added", {
            context: 'user video', postId: req.params.postId, videoId: video.id, user: toJson(req.user)
          });
          res.sendStatus(200);
        });
      });
    } else {
      log.error("Post or Video Not found", {
        context: 'user video', postId: req.params.postId, user: toJson(req.user),
        err: error, errorStatus: 404
      });
      res.sendStatus(404);
    }
  });
});

router.put('/:postId/user_videos', auth.can('add post user videos'), function(req, res) {
  if (req.body.uploadedPostUserVideoId && req.body.uploadedPostUserVideoId!='' &&
      req.body.uploadedPostUserVideoId != req.body.oldUploadedPostUserVideoId) {
    addUserVideoToPost(req.params.postId, req.body.uploadedPostUserVideoId, function (error, post, video) {
      if (post && video) {
        video.photographer_name = req.body.photographerName;
        video.description = req.body.description;
        video.save().then(function (results) {
          sendPostUserVideoActivity(req, 'activity.post.userVideo.updated', post, video, function (error) {
            log.info("Post User Video Updated", {
              context: 'user video', postId: req.params.postId, videoId: video.id, user: toJson(req.user)
            });
            deleteVideo(req.body.oldUploadedPostUserVideoId, function (error) {
              if (error) {
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          });
        });
      } else {
        log.error("Post or Video Not found", {
          context: 'user video', postId: req.params.postId, user: toJson(req.user),
          err: error, errorStatus: 404
        });
        res.sendStatus(404);
      }
    });
  } else {
    models.Video.find({
      where: {
        id: req.body.oldUploadedPostUserVideoId
      },
      include: [
        {
          model: models.Post,
          as: 'PostUserVideos'
        }
      ]
    }).then(function (video) {
      if (video) {
        video.photographer_name = req.body.photographerName;
        video.description = req.body.description;
        video.save().then(function (results) {
          sendPostUserVideoActivity(req, 'activity.post.userVideo.updated', video.PostUserVideos[0], video, function (error) {
            log.info("Post User Video Updated", {
              context: 'user video', postId: req.params.id, videoId: video.id, user: toJson(req.user)
            });
            res.sendStatus(200);
          });
        }).catch(function (error) {
          log.error("Post User Video Error", {
            context: 'user video', postId: req.params.id, user: toJson(req.user),
            err: error, errorStatus: 500
          });
          res.sendStatus(500);
        });
      } else {
        log.error("Post User Video Not found", {
          context: 'user video', postId: req.params.id, user: toJson(req.user),
          err: error, errorStatus: 404
        });
        res.sendStatus(404);
      }
    });
  }
});

router.delete('/:postId/:videoId/user_videos', auth.can('edit post'), function(req, res) {
  deleteVideo(req.params.videoId, function (error) {
    if (error) {
      log.error("Delete did not work", { error });
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
