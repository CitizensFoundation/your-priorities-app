var express = require('express');
var router = express.Router();
var models = require("../models/index.cjs");
var multer  = require('multer');
var multerMultipartResolver = multer({ dest: 'uploads/' }).single('file');
var auth = require('../authorization.cjs');
var log = require('../utils/logger.cjs');
var toJson = require('../utils/to_json.cjs');
const s3Storage = require('multer-sharp-s3');
const crypto = require('crypto');
var queue = require('../active-citizen/workers/queue.cjs');

const aws = require('aws-sdk');
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  endpoint: process.env.S3_ENDPOINT || null,
  s3ForcePathStyle: process.env.MINIO_ROOT_USER ? true : undefined,
  signatureVersion: process.env.MINIO_ROOT_USER ? 'v4' : undefined,
  region: process.env.S3_REGION ? process.env.S3_REGION : 'eu-west-1' // region of your bucket
})

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
//    communityId: req.ypCommunity ?  req.ypCommunity.id : null,
    postId : post.id,
    imageId: image.id,
    access: models.AcActivity.ACCESS_PUBLIC
  }, function (error) {
    callback(error);
  });
};

var addUserImageToPost = function(postId, imageId, callback) {
  models.Post.findOne({
    where: { id: postId },
    attributes: ['id']
  }).then(function (post) {
    if (post) {
      models.Image.findOne({
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
  models.Image.findOne({
    where: { id: imageId },
    attributes: ['id','deleted']
  }).then(function (image) {
    if (image) {
    image.deleted = true;
      image.save().then(function () {
        log.info('Post User Image Deleted', { imageId: imageId, context: 'delete' });
      });
      callback();
    } else {
      log.error('Post User Image Delete Error', { imageId: imageId, context: 'delete' });
      callback('Not found');
    }
  }).catch(function(error) {
    callback(error);
  });
};

router.delete(
  "/:domainId/:imageId/deleteVideoFromDomain",
  auth.can("edit domain"),
  (req, res) => {
    models.Image.removeImageFromCollection(req, res, {
      domainId: req.params.domainId,
      imageId: req.params.imageId,
    });
  }
);

router.delete(
  "/:communityId/:imageId/deleteImageFromCommunity",
  auth.can("edit community"),
  (req, res) => {
    models.Image.removeImageFromCollection(req, res, {
      communityId: req.params.communityId,
      imageId: req.params.imageId,
    });
  }
);

router.delete(
  "/:groupId/:imageId/deleteVideoFromGroup",
  auth.can("edit group"),
  (req, res) => {
    models.Image.removeImageFromCollection(req, res, {
      groupId: req.params.groupId,
      imageId: req.params.imageId,
    });
  }
);

// TODO: Pagination
router.get('/:imageId/comments', auth.can('view image'), function(req, res) {
  models.Point.findAll({
    where: {
      image_id: req.params.imageId
    },
    order: [
      ["created_at", "asc"],
      [ models.PointRevision, models.User, { model: models.Image, as: 'UserProfileImages' }, 'created_at', 'asc' ]
    ],
    include: [
      {
        model: models.PointRevision,
        attributes: models.PointRevision.defaultAttributesPublic,
        include: [
          {
            model: models.User,
            attributes: models.User.defaultAttributesWithSocialMediaPublic,
            include: [
              {
                model: models.Image, as: 'UserProfileImages',
                required: false
              }
            ]
          }
        ]
      }
    ]
  }).then(function (comments) {
    log.info('Point Comment for Image', {context: 'comment', user: req.user ? toJson(req.user.simple()) : null });
    res.send(comments);
  }).catch(function (error) {
    log.error('Could not get comments for image', { err: error, context: 'comment', user: req.user ? toJson(req.user.simple()) : null });
    res.sendStatus(500);
  });
});

router.get('/:imageId/commentsCount', auth.can('view image'), function(req, res) {
  models.Point.count({
    where: {
      image_id: req.params.imageId
    }
  }).then(function (commentsCount) {
    res.send({count: commentsCount});
    log.info('Point Comment Count for Image', {context: 'comment', user: req.user ? toJson(req.user.simple()) : null });
  }).catch(function (error) {
    log.error('Could not get comments count for image', { err: error, context: 'comment', user: req.user ? toJson(req.user.simple()) : null  });
    res.sendStatus(500);
  });
});

router.post('/:imageId/comment', auth.isLoggedInNoAnonymousCheck, auth.can('view image'), function(req, res) {
  models.Point.createComment(req, { image_id: req.params.imageId, comment: req.body.comment }, function (error) {
    if (error) {
      log.error('Could not save comment point on image', { err: error, context: 'comment', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point Comment Created on Image', {context: 'comment', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/', isAuthenticated, async function (req, res) {
  try {
    const s3 = new aws.S3();
    //TODO: Look into making animated gifs work through sharp
    const isGif = (req.file && req.file.originalname.toLowerCase().indexOf(".gif"));
    const storage = s3Storage({
      Key: (req, file, cb) => {
        crypto.pseudoRandomBytes(16, (err, raw) => {
          cb(err, err ? undefined : `${raw.toString('hex')}.${isGif ? 'gif' : 'png'}`)
        })
      },
      s3,
      Bucket: process.env.S3_BUCKET,
      multiple: true,
      resize: models.Image.getSharpVersions(req.query.itemType),
      toFormat: isGif ? "gif" : "png"
    });

    const upload = multer({ storage });

    upload.single("file")(req, res, async function (error) {
      if (error) {
        sendError(res, req.file ? req.file.originalname : 'unknown filename', 'create', res.user, error);
      } else {
        const formats = JSON.stringify(models.Image.createFormatsFromSharpFile(req.file));
        const image = models.Image.build({
          user_id: req.user.id,
          s3_bucket_name: process.env.S3_BUCKET,
          original_filename: req.file.originalname,
          formats,
          user_agent: req.useragent.source,
          ip_address: req.clientIp
        });

        await image.save();
        log.info('Image Created', { imageId: image.id, context: 'create', userId: req.user ? req.user.id : -1 });
        res.send(image);
      }
    });

  } catch (error) {
    sendError(res, req.file.originalname, 'create', res.user, error);
  }
});

// Post User Images
router.get('/:postId/user_images', auth.can('view post'), function(req, res) {
  models.Post.findOne({
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
        attributes: models.Image.defaultAttributesPublic,
        required: true,
        where: {
          deleted: false
        }
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
    log.error("Get images did not work", { error });
    res.sendStatus(500);
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
          queue.add('process-moderation', { type: 'post-review-and-annotate-images', postId: req.params.postId }, 'medium');
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
    models.Image.findOne({
      where: {
        id: req.body.oldUploadedPostUserImageId
      },
      attributes: models.Image.defaultAttributesPublic,
      include: [
        {
          model: models.Post,
          as: 'PostUserImages',
          attributes: models.Image.defaultAttributesPublic
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

router.delete('/:postId/:imageId/user_images', auth.can('edit post'), function(req, res) {
  deleteImage(req.params.imageId, function (error) {
    if (error) {
      log.error("Delete did not work", { error });
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
