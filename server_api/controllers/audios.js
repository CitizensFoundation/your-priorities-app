var express = require('express');
var router = express.Router();
var models = require("../models");
var multer  = require('multer');
var multerMultipartResolver = multer({ dest: 'uploads/' }).single('file');
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var queue = require('../active-citizen/workers/queue');

router.get('/hasAudioUploadSupport', (req, res) => {
  res.send({
    hasAudioUploadSupport: (process.env.S3_AUDIO_UPLOAD_BUCKET!=null &&
                            process.env.S3_AUDIO_PUBLIC_BUCKET!=null)
  })
});

router.put('/audioListen', (req, res) => {
  models.Audio.findOne({
    where: {
      id: req.body.audioId
    }
  }).then((audio) => {
    if (audio) {
      if (req.body.longPlaytime) {
        audio.increment('long_listens');
      } else {
        audio.increment('listens');
      }
    } else {
      log.error("Did not find audio for view increment");
    }
    res.sendStatus(200);
  }).catch((error) => {
    log.error("Error setting audio increment", { error });res.sendStatus(200);
  });
});

router.put('/:postId/completeAndAddToPost', auth.can('edit post'), (req, res) => {
  models.Audio.completeUploadAndAddToCollection(req, res, {
    postId: req.params.postId,
    audioId: req.body.audioId,
    browserLanguage: req.headers["accept-language"] ? req.headers["accept-language"].split(',')[0] : 'en-US',
    appLanguage: req.body.appLanguage,
  });
});

router.post('/:groupId/createAndGetPreSignedUploadUrl', auth.can('create media'), (req, res) => {
  models.Audio.createAndGetSignedUploadUrl(req, res);
});

router.post('/createAndGetPreSignedUploadUrlLoggedIn', auth.isLoggedInNoAnonymousCheck, (req, res) => {
  models.Audio.createAndGetSignedUploadUrl(req, res);
});

const startTranscoding = (req, res) => {
  const options = {
    audioPostUploadLimitSec: req.body.audioPostUploadLimitSec,
    audioPointUploadLimitSec: req.body.audioPointUploadLimitSec,
  };

  models.Audio.findOne({
    where: {
      id: req.params.audioId
    }
  }).then((audio) => {
    if (audio && audio.user_id===req.user.id) {
      models.Audio.startTranscoding(audio, options, req, res);
    } else {
      log.error("Can't find audio or not same user", { audioUserId: audio ? audio.user_id : -1, userId: req.user.id });
      res.sendStatus(404);
    }
  }).catch((error) => {
    log.error("Error getting audio", { error });
    res.sendStatus(500);
  });
};

router.post('/:groupId/:audioId/startTranscoding', auth.can('create media'), (req, res) => {
  startTranscoding(req, res);
});

router.post('/:audioId/startTranscodingLoggedIn', auth.isLoggedInNoAnonymousCheck, (req, res) => {
  startTranscoding(req, res);
});

router.put('/:audioId/getTranscodingJobStatus', (req, res) => {
  models.Audio.findOne({
    where: {
      id: req.params.audioId
    }
  }).then((audio) => {
    if (audio && audio.user_id===req.user.id) {
      models.Audio.getTranscodingJobStatus(audio, req, res);
    } else {
      log.error("Can't find audio or not same user", { audioUserId: audio ? audio.user_id : -1, userId: req.user.id });
      res.sendStatus(404);
    }
  }).catch((error) => {
    log.error("Error getting audio", { error });
    res.sendStatus(500);
  });
});

module.exports = router;
