var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var async = require('async');
var embedly = require('embedly');
var _ = require('lodash');
var queue = require('../active-citizen/workers/queue');

var changePointCounter = function (pointId, column, upDown, next) {
  models.Point.findOne({
    where: { id: pointId }
  }).then(function(point) {
    if (point && upDown===1) {
      point.increment(column).then(function(){
        next();
      });
    } else if (point && upDown===-1) {
      point.decrement(column).then(function(){
        next();
      });
    } else {
      next();
    }
  });
};

var decrementOldPointQualityCountersIfNeeded = function (oldPointQualityValue, pointId, pointQuality, next) {
  if (oldPointQualityValue) {
    if (oldPointQualityValue>0) {
      changePointCounter(pointId, 'counter_quality_up', -1, function () {
        next();
      })
    } else if (oldPointQualityValue<0) {
      changePointCounter(pointId, 'counter_quality_down', -1, function () {
        next();
      })
    } else {
      log.error("Strange state of pointQualities");
      next();
    }
  } else {
    next();
  }
};

var sendPointOrError = function (res, point, context, user, error, errorStatus) {
  if (error || !point) {
    if (errorStatus == 404) {
      log.warn("Point Not Found", { context: context, point: toJson(point), user: toJson(user), err: error,
                                       errorStatus: 404 });
    } else {
      log.error("Point Error", { context: context, point: toJson(point), user: toJson(user), err: error,
                                 errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(point);
  }
};

var validateEmbedUrl = function(urlIn) {
  var urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
  var urls = urlRegex.exec(urlIn);
  return (urls!=null && urls.length>0)
};

var loadPointWithAll = function (pointId, callback) {
  models.Point.findOne({
    where: {
      id: pointId
    },
    attributes: ['id','name','content','status','value','counter_quality_up','counter_quality_down',
      'counter_flags','embed_data','data','public_data','language','group_id','post_id','user_id'],
    order: [
      [ models.PointRevision, 'created_at', 'asc' ],
      [ models.User, { model: models.Image, as: 'UserProfileImages' }, 'created_at', 'asc' ],
      [ models.User, { model: models.Organization, as: 'OrganizationUsers' }, { model: models.Image, as: 'OrganizationLogoImages' }, 'created_at', 'asc' ],
      [ { model: models.Video, as: "PointVideos" }, 'updated_at', 'desc' ],
      [ { model: models.Audio, as: "PointAudios" }, 'updated_at', 'desc' ],
      [ { model: models.Video, as: "PointVideos" }, { model: models.Image, as: 'VideoImages' } ,'updated_at', 'asc' ]
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

router.put('/:id/report', auth.can('vote on point'), function (req, res) {
  models.Point.findOne({
    where: {
      id: req.params.id
    }
  }).then(function (point) {
    if (point) {
      models.Post.findOne({
        where: {
          id: point.post_id
        },
        include: [
          {
            model: models.Group,
            required: true,
            attributes: ['id'],
            include: [
              {
                model: models.Community,
                required: true,
                attributes: ['id'],
                include: [
                  {
                    model: models.Domain,
                    required: true,
                    attributes: ['id']
                  }
                ]
              }
            ]
          }
        ]
      }).then(function (post) {
        if (post) {
          point.report(req, 'user', post, function (error) {
            if (error) {
              log.error("Point Report Error", { context: 'report', post: toJson(post), user: toJson(req.user), err: error });
              res.sendStatus(500);
            } else {
              log.info('Point Report Created', { post: toJson(post), context: 'report', user: toJson(req.user) });
              res.sendStatus(200);
            }
          });
        } else {
          log.error("Point Report", { context: 'report', post: toJson(post), user: toJson(req.user), err: "Could not created post" });
          res.sendStatus(500);
        }
      }).catch(function (error) {
        log.error("Point Report", { context: 'report', user: toJson(req.user), err: error });
        res.sendStatus(500);
      });
    } else {
      res.sendStatus(404);
    }
  })
});

router.get('/:parentPointId/comments', auth.can('view point'), function(req, res) {
  models.Point.findAll({
    where: {
      parent_point_id: req.params.parentPointId
    },
    order: [
      ["created_at", "asc"],
      [ models.PointRevision, models.User, { model: models.Image, as: 'UserProfileImages' }, 'created_at', 'asc' ],
      [ models.PointRevision, 'created_at', 'asc' ],
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
                model: models.Image, as: 'UserProfileImages',
                required: false
              }
            ]
          }
        ]
      }
    ]
  }).then(function (comments) {
    log.info('Point Comment for Parent Point', {context: 'comment', user: req.user ? toJson(req.user.simple()) : null  });
    res.send(comments);
  }).catch(function (error) {
    log.error('Could not get comments for parent point', { err: error, context: 'comment', user: req.user ? toJson(req.user.simple()) : null  });
    res.sendStatus(500);
  });
});

router.get('/:parentPointId/commentsCount', auth.can('view point'), function(req, res) {
  models.Point.count({
    where: {
      parent_point_id: req.params.parentPointId
    },
    include: [
      {
        model: models.PointRevision,
        include: [
          {
            model: models.User,
            attributes: ['id','name','created_at']
          }
        ]
      }
    ],
    order: [
      ["created_at", "asc"]
    ]
  }).then(function (commentsCount) {
    log.info('Point Comment Count for Parent Point', {context: 'comment', user: req.user ? toJson(req.user.simple()) : null  });
    res.send({count: commentsCount});
  }).catch(function (error) {
    log.error('Could not get comments count for parent point', { err: error, context: 'comment', user: req.user ? toJson(req.user.simple()) : null });
    res.sendStatus(500);
  });
});

router.post('/:parentPointId/comment', auth.isLoggedIn, auth.can('add to point'), function(req, res) {
  models.Point.createComment(req, { parent_point_id: req.params.parentPointId, comment: req.body.comment }, function (error) {
    if (error) {
      log.error('Could not save comment point on parent point', { err: error, context: 'comment', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point Comment Created on Parent Point', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.put('/:pointId', auth.can('edit point'), function(req, res) {
  if (!req.body.content) {
    req.body.content="";
  }
  var point = models.Point.findOne({
    where: {
      id: req.params.pointId
    }
  }).then(function(point) {
    var maxNumberOfPointsBeforeEditFrozen = 5;
    if ((point.counter_quality_up + point.counter_quality_down) <= maxNumberOfPointsBeforeEditFrozen) {
      var pointRevision = models.PointRevision.build({
        group_id: point.group_id,
        post_id: point.post_id,
        content: req.body.content,
        user_id: req.user.id,
        status: point.status,
        value: point.value,
        point_id: point.id,
        user_agent: req.useragent.source,
        ip_address: req.clientIp
      });
      pointRevision.save().then(function() {
        log.info('PointRevision Created', { pointRevisionId: pointRevision ? pointRevision.id : -1, context: 'create', userId: req.user ? req.user.id : -1 });
        queue.create('process-similarities', { type: 'update-collection', pointId: point.id }).priority('low').removeOnComplete(true).save();

        models.AcActivity.createActivity({
          type:'activity.point.edited',
          userId: point.user_id,
          domainId: req.ypDomain.id,
//          communityId: req.ypCommunity ?  req.ypCommunity.id : null,
          groupId : point.group_id,
          postId : point.post_id,
          pointId: point.id,
          access: models.AcActivity.ACCESS_PUBLIC
        }, function (error) {
          loadPointWithAll(point.id, function (error, loadedPoint) {
            if (error) {
              log.error('Could not reload point point', { err: error, context: 'createPoint', user: toJson(req.user.simple()) });
              res.sendStatus(500);
            } else {
              if (loadedPoint.content && loadedPoint.content!=='') {
                log.info("process-moderation point toxicity after create point");
                queue.create('process-moderation', { type: 'estimate-point-toxicity', pointId: loadedPoint.id }).priority('high').removeOnComplete(true).save();
              } else {
                log.info("No process-moderation toxicity for empty text on point");
              }
              res.send(loadedPoint);
            }
          });
        });
      });
    } else {
      log.error('Trying to edit point with too many point qualities', { point: toJson(point), context: 'edit', user: toJson(req.user) });
      res.sendStatus(401);
    }
  }).catch(function(error) {
    sendPointOrError(res, null, 'edit', req.user, error);
  });
});

router.get('/:id/translatedText', auth.can('view point'), function(req, res) {
  if (req.query.textType.indexOf("point") > -1) {
    models.Point.findOne({
      where: {
        id: req.params.id
      },
      order: [
        [ models.PointRevision, 'created_at', 'asc' ],
      ],
      attributes: ['id','public_data'],
      include: [
        {
          model: models.PointRevision,
          attributes: ['id','content']
        }
      ]
    }).then(function(point) {
      if (point) {
        models.AcTranslationCache.getTranslation(req, point, function (error, translation) {
          if (error) {
            sendPointOrError(res, req.params.id, 'translated', req.user, error, 500);
          } else {
            res.send(translation);
          }
        });
        log.info('Point translatedTitle', { pointId: point.id, context: 'translatedText' });
      } else {
        sendPointOrError(res, req.params.id, 'translated', req.user, 'Not found', 404);
      }
    }).catch(function(error) {
      sendPointOrError(res, null, 'translated', req.user, error);
    });
  } else {
    sendPointOrError(res, req.params.id, 'translated', req.user, 'Wrong textType', 401);
  }
});

router.get('/:id/videoTranscriptStatus', auth.can('view point'), function(req, res) {
  loadPointWithAll(req.params.id, (error, point) => {
    if (error) {
      sendPointOrError(res, req.params.id, 'videoTranscriptStatus', req.user, error, 500);
    } else if (point.PointVideos && point.PointVideos.length>0) {
      models.Video.findOne({
        where: {
          id: point.PointVideos[0].id
        }
      }).then( video => {
        if (video.meta.transcript && video.meta.transcript.text) {
          point.save().then( savedPoint => {
            var pointRevision = models.PointRevision.build({
              group_id: savedPoint.group_id,
              post_id: savedPoint.post_id,
              content: video.meta.transcript.text,
              user_id: req.user.id,
              status: savedPoint.status,
              value: savedPoint.value,
              point_id: savedPoint.id,
              user_agent: req.useragent.source,
              ip_address: req.clientIp
            });
            pointRevision.save().then( () => {
              loadPointWithAll(point.id, function (error, loadedPoint) {
                if (error) {
                  log.error('Could not reload point point', { err: error, context: 'createPoint', user: toJson(req.user.simple()) });
                  res.sendStatus(500);
                } else {
                  log.info("process-moderation point toxicity after video transcript");
                  queue.create('process-moderation', { type: 'estimate-point-toxicity', pointId: loadedPoint.id }).priority('high').removeOnComplete(true).save();
                  res.send({point: loadedPoint});
                }
              });
            }).catch( error => {
              sendPointOrError(res, req.params.id, 'videoTranscriptStatus', req.user, error, 500);
            });
          }).catch( error => {
            sendPointOrError(res, req.params.id, 'videoTranscriptStatus', req.user, error, 500);
          });
        } else if (video.meta.transcript && video.meta.transcript.error) {
          res.send({ error: video.meta.transcript.error });
        } else {
          res.send({ inProgress: true });
        }
      }).catch( error => {
        sendPointOrError(res, req.params.id, 'videoTranscriptStatus', req.user, error, 500);
      });
    } else {
      sendPointOrError(res, req.params.id, 'videoTranscriptStatus', req.user, "No video for videoTranscriptStatus", 500);
    }
  });
});

router.get('/:id/audioTranscriptStatus', auth.can('view point'), function(req, res) {
  loadPointWithAll(req.params.id, (error, point) => {
    if (error) {
      sendPointOrError(res, req.params.id, 'audioTranscriptStatus', req.user, error, 500);
    } else if (point.PointAudios && point.PointAudios.length>0) {
      models.Audio.findOne({
        where: {
          id: point.PointAudios[0].id
        }
      }).then( audio => {
        if (audio.meta.transcript && audio.meta.transcript.text) {
          point.save().then( savedPoint => {
            var pointRevision = models.PointRevision.build({
              group_id: savedPoint.group_id,
              post_id: savedPoint.post_id,
              content: audio.meta.transcript.text,
              user_id: req.user.id,
              status: savedPoint.status,
              value: savedPoint.value,
              point_id: savedPoint.id,
              user_agent: req.useragent.source,
              ip_address: req.clientIp
            });
            pointRevision.save().then( () => {
              loadPointWithAll(point.id, function (error, loadedPoint) {
                if (error) {
                  log.error('Could not reload point', { err: error, context: 'createPoint', user: toJson(req.user.simple()) });
                  res.sendStatus(500);
                } else {
                  log.info("process-moderation point toxicity after audio transcript");
                  queue.create('process-moderation', { type: 'estimate-point-toxicity', pointId: loadedPoint.id }).priority('high').removeOnComplete(true).save();
                  res.send({point: loadedPoint});
                }
              });
            }).catch( error => {
              sendPointOrError(res, req.params.id, 'audioTranscriptStatus', req.user, error, 500);
            });
          }).catch( error => {
            sendPointOrError(res, req.params.id, 'audioTranscriptStatus', req.user, error, 500);
          });
        } else if (audio.meta.transcript && audio.meta.transcript.error) {
          res.send({ error: audio.meta.transcript.error });
        } else {
          res.send({ inProgress: true });
        }
      }).catch( error => {
        sendPointOrError(res, req.params.id, 'audioTranscriptStatus', req.user, error, 500);
      });
    } else {
      sendPointOrError(res, req.params.id, 'audioTranscriptStatus', req.user, "No audio for audioTranscriptStatus", 500);
    }
  });
});

router.post('/:groupId', auth.can('create point'), function(req, res) {
  log.info("In  POST createPoint");
  if (!req.body.content) {
    req.body.content="";
  }
  var point = models.Point.build({
    group_id: req.params.groupId,
    post_id: req.body.postId,
    content: req.body.content,
    value: req.body.value,
    user_id: req.user.id,
    status: 'published',
    user_agent: req.useragent.source,
    ip_address: req.clientIp
  });
  point.save().then(function() {
    log.info('Point Created', { pointId: point ? point.id : -1, context: 'create', userId: req.user ? req.user.id : -1 });
    var pointRevision = models.PointRevision.build({
      group_id: point.group_id,
      post_id: point.post_id,
      content: point.content,
      user_id: req.user.id,
      status: point.status,
      value: point.value,
      point_id: point.id,
      user_agent: req.useragent.source,
      ip_address: req.clientIp
    });
    pointRevision.save().then(function() {
      log.info('PointRevision Created', { pointRevisionId: pointRevision ? pointRevision.id : -1, context: 'create', userId: req.user ? req.user.id : -1 });
      queue.create('process-similarities', { type: 'update-collection', pointId: point.id }).priority('low').removeOnComplete(true).save();
      models.AcActivity.createActivity({
        type:'activity.point.new',
        userId: point.user_id,
        domainId: req.ypDomain.id,
//        communityId: req.ypCommunity ?  req.ypCommunity.id : null,
        groupId : point.group_id,
        postId : point.post_id,
        pointId: point.id,
        access: models.AcActivity.ACCESS_PUBLIC
      }, function (error) {
        models.Point.findOne({
          where: { id: point.id },
          attributes: ['id','content','group_id','post_id']
        }).then(function(point) {
          models.Post.findOne({
            where: { id: point.post_id },
            attributes: ['id','counter_points','group_id']
          }).then(function(post) {
            if (post) {
              post.updateAllExternalCounters(req, 'up', 'counter_points', function () {
                post.increment('counter_points');
                if (point.content && point.content!=='') {
                  log.info("process-moderation point toxicity after create point");
                  queue.create('process-moderation', { type: 'estimate-point-toxicity', pointId: point.id }).priority('high').removeOnComplete(true).save();
                } else {
                  log.info("No process-moderation toxicity for empty text on point");
                }
                loadPointWithAll(point.id, function (error, loadedPoint) {
                  if (error) {
                    log.error('Could not reload point point', { err: error, context: 'createPoint', user: toJson(req.user.simple()) });
                    res.sendStatus(500);
                  } else {
                    models.Group.addUserToGroupIfNeeded(point.group_id, req, function () {
                      res.send(loadedPoint);
                    });
                  }
                });
              });
            } else {
              log.error("Can't find post for posting point", { pointId: point ? point.id : null});
              res.sendStatus(404);
            }
          });
        });
      });
    });
  }).catch(function(error) {
    sendPointOrError(res, null, 'create', req.user, error);
  });
});

router.delete('/:id', auth.can('delete point'), function(req, res) {
  models.Point.findOne({
    where: { id: req.params.id },
    include: [{
      model: models.Post,
      required: false
    }]
  }).then(function (point) {
    point.deleted = true;
    point.save().then(function () {
      log.info('Point Deleted', { point: toJson(point), context: 'delete', user: toJson(req.user) });
      queue.create('process-similarities', { type: 'update-collection', pointId: point.id }).priority('low').removeOnComplete(true).save();
      queue.create('process-deletion', { type: 'delete-point-content', pointId: point.id, userId: req.user.id }).priority('high').removeOnComplete(true).save();
      if (point.Post) {
        point.Post.updateAllExternalCounters(req, 'down', 'counter_points', function () {
          point.Post.decrement('counter_points');
          res.sendStatus(200);
        });
      } else {
        res.sendStatus(200);
      }
    });
  }).catch(function(error) {
    sendPointOrError(res, null, 'delete', req.user, error);
  });
});

router.post('/:id/pointQuality', auth.can('vote on point'), function(req, res) {
  var point, post;
  models.PointQuality.findOne({
    where: { point_id: req.params.id, user_id: req.user.id },
    include: [
      {
        model: models.Point,
        attributes: ['id','group_id','post_id'],
        include: [
          {
            model: models.Post,
            attributes: ['id','group_id'],
            required: false
          }
        ]
      }
    ]
  }).then(function(pointQuality) {
    var oldPointQualityValue;
    if (pointQuality) {
      point = pointQuality.Point;
      if (pointQuality.value>0)
        oldPointQualityValue = 1;
      else if (pointQuality.value<0)
        oldPointQualityValue = -1;
      pointQuality.value = req.body.value;
      pointQuality.status = 'active';
    } else {
      pointQuality = models.PointQuality.build({
        point_id: req.params.id,
        value: req.body.value,
        user_id: req.user.id,
        status: 'active',
        user_agent: req.useragent.source,
        ip_address: req.clientIp
      })
    }
    pointQuality.save().then(function() {
      log.info('PointQuality Created or Updated', { pointQualityId: pointQuality ? pointQuality.id : -1, context: 'createOrUpdate', userId: req.user ? req.user.id : -1 });
      async.series([
        function (seriesCallback) {
          if (point) {
            seriesCallback();
          } else {
            models.Point.findOne({
              where: { id: pointQuality.point_id },
              attributes: ['id','post_id','group_id']
            }).then(function (results) {
              if (results) {
                point = results;
                seriesCallback();
              } else {
                seriesCallback("Can't find point")
              }
            });
          }
        },
        function (seriesCallback) {
          models.AcActivity.createActivity({
            type: pointQuality.value > 0 ? 'activity.point.helpful.new' :  'activity.point.unhelpful.new',
            userId: pointQuality.user_id,
            domainId: req.ypDomain.id,
//            communityId: req.ypCommunity ?  req.ypCommunity.id : null,
            pointQualityId : pointQuality.id,
            groupId : point.group_id,
            postId : point.post_id,
            pointId: point.id,
            access: models.AcActivity.ACCESS_PUBLIC
          }, function (error) {
            seriesCallback(error);
          });
        },
        function (seriesCallback) {
          if (point && point.group_id) {
            models.Group.addUserToGroupIfNeeded(point.group_id, req, function () {
              seriesCallback();
            });
          } else {
            seriesCallback();
          }
        }
      ], function (error) {
        if (error) {
          log.error("Point Quality Error", { context: 'create', pointQuality: toJson(pointQuality), user: toJson(req.user),
            err: error, errorStatus: 500 });
          res.sendStatus(500);
        } else {
          decrementOldPointQualityCountersIfNeeded(oldPointQualityValue, req.params.id, pointQuality, function () {
            if (pointQuality.value>0) {
              changePointCounter(req.params.id, 'counter_quality_up', 1, function () {
                res.send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
              })
            } else if (pointQuality.value<0) {
              changePointCounter(req.params.id, 'counter_quality_down', 1, function () {
                res.send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
              })
            } else {
              log.error('PointQuality Error', { pointQuality: toJson(pointQuality), context: 'createOrUpdate', user: toJson(req.user) });
              res.status(500);
            }
          })
        }
      });
    });
  });
});

router.delete('/:id/pointQuality', auth.can('vote on point'), function(req, res) {
  models.PointQuality.findOne({
    where: { point_id: req.params.id, user_id: req.user.id }
  }).then(function(pointQuality) {
    if (pointQuality) {
      var oldPointQualityValue;
      if (pointQuality.value>0)
        oldPointQualityValue = 1;
      else if (pointQuality.value<0)
        oldPointQualityValue = -1;
      pointQuality.value = 0;
      //pointQuality.deleted = true;
      pointQuality.save().then(function() {
        log.info('PointQuality Deleted', { pointQuality: toJson(pointQuality), context: 'delete', user: toJson(req.user) });
        if (oldPointQualityValue>0) {
          changePointCounter(req.params.id, 'counter_quality_up', -1, function () {
            res.status(200).send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
          })
        } else if (oldPointQualityValue<0) {
          changePointCounter(req.params.id, 'counter_quality_down', -1, function () {
            res.status(200).send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
          })
        } else {
          console.error("Strange state of pointQualities");
          res.status(200).send({ pointQuality: pointQuality, oldPointQualityValue: oldPointQualityValue });
        }
      });
    } else {
      log.error('PointQuality Not Found', { pointQuality: toJson(pointQuality), context: 'delete', user: toJson(req.user) });
      res.sendStatus(404);
    }
  });
});

router.get('/url_preview', auth.isLoggedIn, function(req, res) {
  if (req.query.url && validateEmbedUrl(req.query.url)) {
    const api =  new embedly({key: process.env.EMBEDLY_KEY});
    api.oembed({url: req.query.url, maxwidth: 470, width: 470, secure: true}, function (err, objs) {
      if (!!err) {
        log.error('Embedly not working', { err: err, url: req.query.url, context: 'url_preview', user: toJson(req.user) });
        res.sendStatus(500);
      } else {
        res.send(objs);
      }
    });
  } else {
    log.error('Url not found or not valid', { url: req.params.url, context: 'url_preview', user: toJson(req.user) });
    res.sendStatus(404);
  }
});

module.exports = router;
