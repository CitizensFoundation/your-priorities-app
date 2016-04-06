var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var async = require('async');
var embedly = require('embedly');

var changePointCounter = function (pointId, column, upDown, next) {
  models.Point.find({
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
      console.error("Strange state of pointQualities");
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

var createNewsStory = function (req, options, callback) {
  options.content = options.point.content;
  options.embed_data = options.point.embed_data;
  delete options.point;

  async.series([
    function (seriesCallback) {
      if (options.post_id) {
        models.Post.find({
          where: {
            id: options.post_id
          },
          include: [
            {
              model: models.Group,
              attributes: ['id'],
              required: true,
              include: [
                {
                  model: models.Community,
                  attributes: ['id'],
                  required: true,
                  include: [
                    {
                      model: models.Domain,
                      attributes: ['id'],
                      required: true
                    }
                  ]
                }
              ]
            }
          ]
        }).then(function (post) {
          options.group_id = post.Group.id;
          options.community_id = post.Group.Community.id;
          options.domain_id = post.Group.Community.Domain.id;
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        })
      } else {
        seriesCallback();
      }
    },

    function (seriesCallback) {
      if (options.group_id) {
        models.Group.find({
          where: {
            id: options.group_id
          },
          include: [
            {
              model: models.Community,
              attributes: ['id'],
              required: true,
              include: [
                {
                  model: models.Domain,
                  attributes: ['id'],
                  required: true
                }
              ]
            }
          ]
        }).then(function (group) {
          options.community_id = group.Community.id;
          options.domain_id = group.Community.Domain.id;
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        })
      } else {
        seriesCallback();
      }
    },

    function (seriesCallback) {
      if (options.community_id) {
        models.Community.find({
          where: {
            id: options.community_id
          },
          attributes: ['id','access'],
          include: [
            {
              model: models.Domain,
              attributes: ['id'],
              required: true
            }
          ]
        }).then(function (community) {
          options.domain_id = community.Domain.id;
          options.communityAccess = community.access;
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        })
      } else {
        seriesCallback();
      }
    },

    // Attach an empty public group to domain and community levels to enable join on activities with group access control
    function (seriesCallback) {
      if (!options.group_id &&
         (options.domain_id || (options.community_id && options.communityAccess == models.Community.ACCESS_PUBLIC))) {
        models.Group.findOrCreate({where: { name: 'hidden_public_group_for_domain_level_points' },
            defaults: { access: models.Group.ACCESS_PUBLIC }})
          .spread(function(group, created) {
            if (group) {
              options.group_id = group.id;
              seriesCallback();
            } else {
              seriesCallback("Can't create hidden public group for domain level points");
            }
          });
      } else {
        seriesCallback();
      }
    }
  ], function (error) {
    options.user_id = req.user.id;
    options.content_type = models.Point.CONTENT_NEWS_STORY;
    options.value = 0;
    options.status = 'active';
    options.user_agent = req.useragent.source;
    options.ip_address = req.clientIp;

    models.Point.build(options).save().then(function (point) {
      options.point_id = point.id;
      var pointRevision = models.PointRevision.build(options);
      pointRevision.save().then(function () {
        models.AcActivity.createActivity({
          type: 'activity.point.newsStory.new',
          userId: options.user_id,
          domainId: options.domain_id,
          groupId: options.group_id ? options.group_id : 1,
          pointId: options.point_id,
          communityId: options.community_id,
          postId: options.post_id,
          access: models.AcActivity.ACCESS_PUBLIC
        }, function (error) {
          callback(error);
        });
      })
    }).catch(function (error) {
      callback(error);
    });
  });
};

router.get('/:parentPointId/comments', auth.can('view point'), function(req, res) {
  models.Point.findAll({
    where: {
      parent_point_id: req.params.parentPointId
    },
    order: [
      ["created_at", "asc"]
    ]
  }).then(function (comments) {
    log.info('Point Comment for Parent Point', {context: 'comment', user: toJson(req.user.simple()) });
    res.sendStatus(comments);
  }).catch(function (error) {
    log.error('Could not get comments for parent point', { err: error, context: 'comment', user: toJson(req.user.simple()) });
    res.sendStatus(500);
  });
});

router.post('/:parentPointId/comment', auth.isLoggedIn, auth.can('view point'), function(req, res) {
  createComment(req, { parent_point_id: req.params.parentPointId }, function (error) {
    if (error) {
      log.error('Could not save comment point on parent point', { err: error, context: 'comment', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point Comment Created on Parent Point', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/:groupId/post/news_story', auth.isLoggedIn, auth.can('view group'), function(req, res) {
  createNewsStory(req, req.body, function (error) {
    if (error) {
      log.error('Could not save news story point on post', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/:groupId/group/news_story', auth.isLoggedIn, auth.can('view group'), function(req, res) {
  createNewsStory(req, req.body, function (error) {
    if (error) {
      log.error('Could not save news story point on group', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/:communityId/community/news_story', auth.isLoggedIn, auth.can('view community'), function(req, res) {
  createNewsStory(req, req.body, function (error) {
    if (error) {
      log.error('Could not save news story point on community', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/:domainId/domain/news_story', auth.isLoggedIn, function(req, res) {
  createNewsStory(req, req.body, function (error) {
    if (error) {
      log.error('Could not save news story point on domain', { err: error, context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else {
      log.info('Point News Story Created', {context: 'news_story', user: toJson(req.user.simple()) });
      res.sendStatus(200);
    }
  });
});

router.post('/:groupId', auth.can('create point'), function(req, res) {
  var point = models.Point.build({
    group_id: req.params.groupId,
    post_id: req.body.postId,
    content: req.body.content,
    value: req.body.value,
    user_id: req.user.id,
    status: 'active',
    user_agent: req.useragent.source,
    ip_address: req.clientIp
  });
  point.save().then(function() {
    log.info('Point Created', { point: toJson(point), context: 'create', user: toJson(req.user) });
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
      log.info('PointRevision Created', { pointRevision: toJson(pointRevision), context: 'create', user: toJson(req.user) });
      models.AcActivity.createActivity({
        type:'activity.point.new',
        userId: point.user_id,
        domainId: req.ypDomain.id,
        communityId: req.ypCommunity ?  req.ypCommunity.id : null,
        groupId : point.group_id,
        postId : point.post_id,
        pointId: point.id,
        access: models.AcActivity.ACCESS_PUBLIC
      }, function (error) {
        models.Point.find({
          where: { id: point.id },
          include: [
            { model: models.PointRevision ,
              include: [
                { model: models.User, attributes: ["id", "name", "facebook_id", "buddy_icon_file_name"] }
              ]
            }
          ]
        }).then(function(point) {
          models.Post.find({
            where: { id: point.post_id }
          }).then(function(post) {
            post.updateAllExternalCounters(req, 'up', 'counter_points', function () {
              post.increment('counter_points');
              res.send(point);
            });
          });
        });
      });
    });
  }).catch(function(error) {
    sendPointOrError(res, null, 'create', req.user, error);
  });
});

router.delete('/:id', auth.can('edit point'), function(req, res) {
  models.Point.find({
    where: {id: req.params.id }
  }).then(function (point) {
    point.deleted = true;
    point.save().then(function () {
      log.info('Point Deleted', { point: toJson(point), context: 'delete', user: toJson(req.user) });
      models.Post.find({
        where: { id: point.post_id }
      }).then(function(post) {
        post.updateAllExternalCounters(req, 'down', 'counter_points', function () {
          post.decrement('counter_points');
          res.sendStatus(200);
        });
      });
    });
  }).catch(function(error) {
    sendPointOrError(res, null, 'delete', req.user, error);
  });
});

router.post('/:id/pointQuality', auth.isLoggedIn, auth.can('vote on point'), function(req, res) {
  var point, post;
  models.PointQuality.find({
    where: { point_id: req.params.id, user_id: req.user.id },
    include: [
      {
        model: models.Point,
        attributes: ['id','group_id'],
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
      log.info('PointQuality Created or Updated', { pointQuality: toJson(pointQuality), context: 'createOrUpdate', user: toJson(req.user) });
      async.series([
        function (seriesCallback) {
          if (point) {
            seriesCallback();
          } else {
            models.Point.find({
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
            communityId: req.ypCommunity ?  req.ypCommunity.id : null,
            groupId : point.group_id,
            postId : point.post_id,
            pointId: point.id,
            access: models.AcActivity.ACCESS_PUBLIC
          }, function (error) {
            seriesCallback(error);
          });
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

router.delete('/:id/pointQuality', auth.isLoggedIn, auth.can('vote on point'), function(req, res) {
  models.PointQuality.find({
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
    new embedly({key: process.env.EMBEDLY_KEY},function(err, api) {
      if (!!err) {
        log.error('Embedly not working', { err: err, url: req.query.url, context: 'url_preview', user: toJson(req.user) });
        res.sendStatus(500);
      } else {
        api.oembed({url: req.query.url, maxwidth: 470, width: 470, secure: true}, function (err, objs) {
          if (!!err) {
            log.error('Embedly not working', { err: err, url: req.query.url, context: 'url_preview', user: toJson(req.user) });
            res.sendStatus(500);
          } else {
            res.send(objs);
          }
        });
      }
    });
  } else {
    log.error('Url not found or not valid', { url: req.params.url, context: 'url_preview', user: toJson(req.user) });
    res.sendStatus(404);
  }
});



module.exports = router;
