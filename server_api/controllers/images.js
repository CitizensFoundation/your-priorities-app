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

var sendPostUserImageActivity = function(req, type, post, image, callback) {
  models.AcActivity.createActivity({
    type: type,
    userId: post.user_id,
    domainId: req.ypDomain.id,
    groupId: post.group_id,
    communityId: req.ypCommunity ?  req.ypCommunity.id : null,
    postId : post.id,
    imageId: image.id,
    access: models.AcActivity.ACCESS_PUBLIC
  }, function (error) {
    callback(error);
  });
};

var addUserImageToPost = function(postId, imageId, callback) {
  models.Post.find({
    where: { id: postId },
    attributes: ['id']
  }).then(function (post) {
    if (post) {
      models.Image.find({
        where: {
          id: imageId
        }
      }).then(function (image) {
        if (image) {
          post.addPostUserImage(image).then(function (results) {
            callback(null, post, image);
          });
        }
      });
    }
  }).catch(function (error) {
    callback(error);
  });
};

var deleteImage = function (imageId, callback) {
  models.Image.find({
    where: { id: imageId },
//    attributes: ['id','deleted']
  }).then(function (image) {
    if (image) {
//    image.deleted = true;
      image.save().then(function () {
        log.info('Post User Image Deleted', { imageId: imageId, context: 'delete', user: toJson(req.user) });
      });
      callback();
    } else {
      log.error('Post User Image Delete Error', { imageId: imageId, context: 'delete', user: toJson(req.user) });
      callback('Not found');
    }
  }).catch(function(error) {
    callback(error);
  });
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

// Post User Images
router.get('/:postId/user_images', auth.can('view post'), function(req, res) {
  models.Post.find({
    where: {
      id: req.params.postId
    },
    order: [
      [ { model: models.Image, as: 'PostUserImages' } , 'created_at', 'desc' ]
    ],
    attributes: ['id'],
    include: [
      {
        model: models.Image,
        as: 'PostUserImages',
        required: true
      }
    ]
  }).then(function(post) {
    if (post) {
      log.info('Post User Images Viewed', { postId: post.id, context: 'view', user: toJson(req.user) });
      res.send(post.PostUserImages);
    } else {
      res.send([]);
    }
  }).catch(function(error) {
    sendPostOrError(res, null, 'view user images', req.user, error);
  });
});

router.post('/:postId/user_images', auth.can('add post user images'), function(req, res) {
  addUserImageToPost(req.params.postId, req.body.uploadedPostUserImageId, function (error, post, image) {
    if (post && image) {
      image.photographer_name = req.body.photographerName;
      image.description = req.body.description;
      image.save().then(function (results) {
        sendPostUserImageActivity(req, 'activity.post.userImage.new', post, image, function (error) {
          log.info("Post User Image Added", {
            context: 'user image', postId: req.params.postId, imageId: image.id, user: toJson(req.user)
          });
          res.sendStatus(200);
        });
      });
    } else {
      log.error("Post or Image Not found", {
        context: 'user image', postId: req.params.postId, user: toJson(req.user),
        err: error, errorStatus: 404
      });
      res.sendStatus(404);
    }
  });
});

router.put('/:postId/user_images', auth.can('add post user images'), function(req, res) {
  if (req.body.uploadedPostUserImageId && req.body.uploadedPostUserImageId!='' &&
      req.body.uploadedPostUserImageId != req.body.oldUploadedPostUserImageId) {
    addUserImageToPost(req.params.postId, req.body.uploadedPostUserImageId, function (error, post, image) {
      if (post && image) {
        image.photographer_name = req.body.photographerName;
        image.description = req.body.description;
        image.save().then(function (results) {
          sendPostUserImageActivity(req, 'activity.post.userImage.updated', post, image, function (error) {
            log.info("Post User Image Updated", {
              context: 'user image', postId: req.params.postId, imageId: image.id, user: toJson(req.user)
            });
            deleteImage(req.body.oldUploadedPostUserImageId, function (error) {
              if (error) {
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          });
        });
      } else {
        log.error("Post or Image Not found", {
          context: 'user image', postId: req.params.postId, user: toJson(req.user),
          err: error, errorStatus: 404
        });
        res.sendStatus(404);
      }
    });
  } else {
    models.Image.find({
      where: {
        id: req.body.oldUploadedPostUserImageId
      },
      include: [
        {
          model: models.Post,
          as: 'PostUserImages'
        }
      ]
    }).then(function (image) {
      if (image) {
        image.photographer_name = req.body.photographerName;
        image.description = req.body.description;
        image.save().then(function (results) {
          sendPostUserImageActivity(req, 'activity.post.userImage.updated', image.PostUserImages[0], image, function (error) {
            log.info("Post User Image Updated", {
              context: 'user image', postId: req.params.id, imageId: image.id, user: toJson(req.user)
            });
            res.sendStatus(200);
          });
        }).catch(function (error) {
          log.error("Post User Image Error", {
            context: 'user image', postId: req.params.id, user: toJson(req.user),
            err: error, errorStatus: 500
          });
          res.sendStatus(500);
        });
      } else {
        log.error("Post User Image Not found", {
          context: 'user image', postId: req.params.id, user: toJson(req.user),
          err: error, errorStatus: 404
        });
        res.sendStatus(404);
      }
    });
  }
});

router.delete('/:imageId/user_images', auth.can('edit post'), function(req, res) {
  deleteImage(req.params.imageId, function (error) {
    if (error) {
      sendPostOrError(res, null, 'delete post user image', req.user, error);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
