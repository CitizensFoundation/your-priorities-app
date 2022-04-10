var express = require('express');
var router = express.Router();
var models = require("../models");
var multer  = require('multer');
var multerMultipartResolver = multer({ dest: 'uploads/' }).single('file');
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var queue = require('../active-citizen/workers/queue');
const _ = require('lodash');

var loadPointWithAll = function (pointId, callback) {
  models.Point.findOne({
    where: {
      id: pointId
    },
    order: [
      [ models.PointRevision, 'created_at', 'asc' ],
      [ models.User, { model: models.Image, as: 'UserProfileImages' }, 'created_at', 'asc' ],
      [ { model: models.Video, as: "PointVideos" }, 'updated_at', 'desc' ],
      [ { model: models.Audio, as: "PointAudios" }, 'updated_at', 'desc' ],
      [ { model: models.Video, as: "PointVideos" }, { model: models.Image, as: 'VideoImages' } ,'updated_at', 'asc' ],
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
        attributes: ['id','formats','updated_at','viewable','public_meta'],
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
        model: models.Audio,
        required: false,
        attributes: ['id','formats','updated_at','listenable'],
        as: 'PointAudios'
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
    hasTranscriptSupport: (process.env.GOOGLE_TRANSCODING_FLAC_BUCKET!=null &&
                           process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!=null),
    hasVideoUploadSupport: (process.env.S3_VIDEO_UPLOAD_BUCKET!=null &&
                            process.env.S3_VIDEO_PUBLIC_BUCKET!=null &&
                            process.env.S3_VIDEO_THUMBNAIL_BUCKET!=null)
  })
});

router.put('/videoView', (req, res) => {
  models.Video.findOne({
    where: {
      id: req.body.videoId
    }
  }).then((video) => {
    if (video) {
      if (req.body.longPlaytime) {
        video.increment('long_views');
      } else {
        video.increment('views');
      }
    } else {
      log.error("Did not find video for view increment");
    }
    res.sendStatus(200);
  }).catch((error) => {
    log.error("Error setting video increment", { error });res.sendStatus(200);
  });
});

router.put('/:postId/completeAndAddToPost', auth.can('edit post'), (req, res) => {
  models.Video.completeUploadAndAddToCollection(req, res, {
    postId: req.params.postId,
    videoId: req.body.videoId,
    browserLanguage: req.headers["accept-language"] ? req.headers["accept-language"].split(',')[0] : 'en-US',
    appLanguage: req.body.appLanguage,
  });
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
          if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
            const workPackage = { browserLanguage: req.headers["accept-language"] ? req.headers["accept-language"].split(',')[0] : 'en-US',
                                  appLanguage: req.body.appLanguage,
                                  videoId: req.body.videoId,
                                  type: 'create-video-transcript' };
            queue.add('process-voice-to-text', workPackage, 'high');
          }
          res.send(point);
        }
      });
    }
  });
});

router.post('/:groupId/createAndGetPreSignedUploadUrl', auth.can('create media'), (req, res) => {
  models.Video.createAndGetSignedUploadUrl(req, res);
});

router.post('/createAndGetPreSignedUploadUrlLoggedIn', auth.isLoggedIn, (req, res) => {
  models.Video.createAndGetSignedUploadUrl(req, res);
});

const startTranscoding = (req, res) => {
  const options = {
    videoPostUploadLimitSec: req.body.videoPostUploadLimitSec,
    videoPointUploadLimitSec: req.body.videoPointUploadLimitSec,
    aspect: req.body.aspect
  };
  models.Video.findOne({
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
};

router.post('/:groupId/:videoId/startTranscoding', auth.can('create media'), (req, res) => {
  startTranscoding(req, res);
});

router.post('/:videoId/startTranscodingLoggedIn', auth.isLoggedIn, (req, res) => {
  startTranscoding(req, res);
});

router.get('/:videoId/formatsAndImages', (req, res) => {
  models.Video.findOne({
    where: {
      id: req.params.videoId
    },
    order: [
      [ { model: models.Image, as: 'VideoImages' } ,'updated_at', 'asc' ],
    ],

    include: [
      {
        model: models.Image,
        as: 'VideoImages'
      }
    ]
  }).then((video) => {
    if (video && video.user_id===req.user.id) {
      video.createFormats(video);
      const previewVideoUrl = video.formats[0];
      let videoImages = [];
      _.forEach(video.VideoImages, image => {
       const formats = JSON.parse(image.formats);
       videoImages.push(formats[0]);
      });
      res.send( {previewVideoUrl, videoImages } )
    } else {
      log.error("Can't find video or not same user", { videoUserId: video ? video.user_id : -1, userId: req.user.id });
      res.sendStatus(404);
    }
  }).catch((error) => {
    log.error("Error getting video formatsAndImages", { error });
    res.sendStatus(500);
  });
});

router.put('/:videoId/setVideoCover', (req, res) => {
  models.Video.findOne({
    where: {
      id: req.params.videoId
    }
  }).then((video) => {
    if (video && video.user_id===req.user.id) {
      if (!video.public_meta)
        video.set('public_meta', {});
      video.set('public_meta.selectedVideoFrameIndex', req.body.frameIndex );
      video.save().then( () => {
        res.sendStatus(200);
      }).catch( error => {
        log.error("Error getting video formatsAndImages", { error });
        res.sendStatus(500);
      });
    } else {
      log.error("Can't find video or not same user", { videoUserId: video ? video.user_id : -1, userId: req.user.id });
      res.sendStatus(404);
    }
  }).catch((error) => {
    log.error("Error getting video formatsAndImages", { error });
    res.sendStatus(500);
  });
});

router.put('/:videoId/getTranscodingJobStatus', (req, res) => {
  models.Video.findOne({
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
