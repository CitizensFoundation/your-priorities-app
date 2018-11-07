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

var loadPointWithAll = function (pointId, callback) {
  models.Point.find({
    where: {
      id: pointId
    },
    order: [
      [ models.PointRevision, 'created_at', 'asc' ],
      [ models.User, { model: models.Image, as: 'UserProfileImages' }, 'created_at', 'asc' ],
      [ models.User, { model: models.Organization, as: 'OrganizationUsers' }, { model: models.Image, as: 'OrganizationLogoImages' }, 'created_at', 'asc' ]
    ],
    include: [
      { model: models.User,
        attributes: ["id", "name", "email", "facebook_id", "twitter_id", "google_id", "github_id"],
        required: false,
        include: [
          {
            model: models.Image, as: 'UserProfileImages',
            required: false
          },
          {
            model: models.Organization,
            as: 'OrganizationUsers',
            required: false,
            attributes: ['id', 'name'],
            include: [
              {
                model: models.Image,
                as: 'OrganizationLogoImages',
                attributes: ['id', 'formats'],
                required: false
              }
            ]
          }
        ]
      },
      {
        model: models.PointRevision,
        required: false
      },
      { model: models.PointQuality,
        required: false,
        include: [
          { model: models.User,
            attributes: ["id", "name", "email"],
            required: false
          }
        ]
      },
      {
        model: models.Video,
        required: false,
        attributes: ['id','formats','updated_at','viewable'],
        as: 'PointVideos',
        include: [
          {
            model: models.Image,
            as: 'VideoImages',
            attributes:["formats",'updated_at'],
            required: false
          },
        ]
      },
      {
        model: models.Post,
        required: false,
        attributes: ['id','group_id'],
        include: [
          {
            model: models.Group,
            attributes: ['id','configuration'],
            required: false
          }
        ]
      }
    ]
  }).then(function(point) {
    if (point) {
      callback(null, point);
    } else {
      callback("Can't find point");
    }
  }).catch(function(error) {
    callback(error);
  });
};


router.get('/hasVideoUploadSupport', (req, res) => {
  res.send({
    hasVideoUploadSupport: (process.env.S3_VIDEO_UPLOAD_BUCKET!=null &&
                            process.env.S3_VIDEO_PUBLIC_BUCKET!=null &&
                            process.env.S3_VIDEO_THUMBNAIL_BUCKET!=null &&
                            process.env.AWS_TRANSCODER_PIPELINE_ID!=null &&
                            process.env.AWS_TRANSCODER_PRESET_ID!=null &&
                            process.env.AWS_TRANSCODER_FLAC_PRESET_ID!=null)
  })
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

router.put('/:pointId/completeAndAddToPoint', auth.can('edit point'), (req, res) => {
  models.Video.completeUploadAndAddToPoint(req, res, { pointId: req.params.pointId, videoId: req.body.videoId }, (error) => {
    if (error) {
      log.error("Error adding point to video", { error });
      res.sendStatus(500);
    } else {
      loadPointWithAll(req.params.pointId, (error, point) => {
        if (error) {
          log.error("Error loading point ", { error });
          res.sendStatus(500);
        } else {
          res.send(point);
        }
      });
    }
  });
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
