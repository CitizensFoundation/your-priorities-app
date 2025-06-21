var express = require('express');
var router = express.Router();
var models = require("../../models/index.cjs");
var auth = require('../../authorization.cjs');
var log = require('../../utils/logger.cjs');
var _ = require('lodash');

var moment = require('moment');

var getRecommendationFor = require('../engine/recommendations/events_manager.cjs').getRecommendationFor;
var airbrake = null;
if(process.env.AIRBRAKE_PROJECT_ID) {
  airbrake = require('../utils/airbrake.cjs');
}

var OVERALL_LIMIT=7;

var DATE_OPTIONS = { name:"date", after: moment().add(-1000, 'months').toISOString() };
//var DATE_OPTIONS_YEAR = { name:"date", after: moment().add(-300, 'months').toISOString() };

var setupOptions = function (req) {
  var options = {
    user_id: req.user ? req.user.id : -1
  };

  return options;
};

var processRecommendations = function (levelType, req, res, recommendedItemIds, error) {
  if (error) {
    log.error("Recommendation Error "+levelType, { err: error, id: req.params.id, userId:  req.user ? req.user.id : -1, errorStatus:  500 });
    if(airbrake) {
      airbrake.notify(error).then((airbrakeErr) => {
        if (airbrakeErr.error) {
          log.error("AirBrake Error", { context: 'airbrake', err: airbrakeErr.error, errorStatus: 500 });
        }
      });
    }
    res.send([]);
  } else {
    if (recommendedItemIds.length>OVERALL_LIMIT) {
      recommendedItemIds = _.dropRight(recommendedItemIds, recommendedItemIds.length-OVERALL_LIMIT);
    }
    log.info("Recommendations domains status", { recommendedItemIds: recommendedItemIds });

    models.Post.findAll({
      where: {
        id: {
          $in: recommendedItemIds
        }
      },
      order: [
        [ { model: models.Image, as: 'PostHeaderImages' } ,'updated_at', 'asc' ],
        [ { model: models.Video, as: "PostVideos" }, { model: models.Image, as: 'VideoImages' } ,'updated_at', 'asc' ]
      ],
      attributes: ['id','name','description','public_data','status','content_type','official_status','counter_endorsements_up','cover_media_type',
        'counter_endorsements_down','group_id','language','counter_points','counter_flags','location','created_at'],
      include: [
        {
          // Category
          model: models.Category,
          required: false,
          include: [
            {
              model: models.Image,
              required: false,
              as: 'CategoryIconImages'
            }
          ]
        },
        // Group
        {
          model: models.Group,
          required: true,
          attributes: models.Group.defaultAttributesPublic,
          where: {
            status: {
              $in: ['active','featured']
            }
          },
          include: [
            {
              model: models.Category,
              required: false
            },
            {
              model: models.Community,
              attributes: ['id','name','theme_id'],
              required: false
            }
          ]
        },
        {
          model: models.Video,
          required: false,
          attributes: ['id','formats','updated_at','viewable','public_meta'],
          as: 'PostVideos',
          include: [
            {
              model: models.Image,
              as: 'VideoImages',
              attributes:["formats",'updated_at'],
              required: false
            },
          ]
        },
        // User
        {
          model: models.User,
          required: false,
          attributes: models.User.defaultAttributesWithSocialMediaPublic
        },
        // Image
        {
          model: models.Image,
          required: false,
          as: 'PostHeaderImages'
        },
        // PointRevision
        {
          model: models.PostRevision,
          required: false
        }
      ]
    }).then(function(posts) {
      res.send(posts);
    }).catch(function(error) {
      log.error("Recommendation Error "+levelType, { err: error, id: req.params.id, userId:  req.user ? req.user.id : -1, errorStatus: 500 });
      if(airbrake) {
        airbrake.notify(error).then((airbrakeErr)=> {
          if (airbrakeErr.error) {
            log.error("AirBrake Error", { context: 'airbrake', err: airbrakeErr.error, errorStatus: 500 });
          }
          res.send([]);
        });
      } else {
        res.send([]);
      }
    });
  }
};

var processRecommendationsLight = function (groupId, req, res, recommendedItemIds, error, redisCacheKey) {
  if (error) {
    log.error("processRecommendationsLight Error", { err: error, userId:  req.user ? req.user.id : -1, errorStatus:  500 });
    if(airbrake) {
      airbrake.notify(error).then((airbrakeErr)=> {
        if (airbrakeErr.error) {
          log.error("AirBrake Error", { context: 'airbrake', err: airbrakeErr.error, errorStatus: 500 });
        }
        res.send({recommendations: [], groupId: groupId });
      });
    } else {
      res.send({recommendations: [], groupId: groupId });
    }
  } else if (!recommendedItemIds) {
    log.error("processRecommendationsLight no recommendedItemIds", { userId:  req.user ? req.user.id : -1, errorStatus:  500 });
    res.send({recommendations: [], groupId: groupId });
  } else {
    log.info("processRecommendationsLight for group status");

    models.Post.findAll({
      where: {
        id: {
          $in: recommendedItemIds
        }
      },
      attributes: ['id','name','description'],
      include: [
        {
          model: models.Group,
          required: true,
          attributes: models.Group.defaultAttributesPublic,
          where: {
            id: groupId
          }
        }
      ]
    }).then(function(posts) {
      posts.sort(function(a, b){
        return recommendedItemIds.indexOf(a.id) - recommendedItemIds.indexOf(b.id);
      });

      const recommendationsInfo = {recommendations: posts, groupId: groupId };
      if (redisCacheKey) {
        req.redisClient.setEx(redisCacheKey, process.env.RECOMMENDATIONS_CACHE_TTL ? parseInt(process.env.RECOMMENDATIONS_CACHE_TTL) : 5, JSON.stringify(recommendationsInfo));
      }
      res.send(recommendationsInfo);
    }).catch(function(error) {
      log.error("processRecommendationsLight Error ", { err: error, userId:  req.user ? req.user.id : -1, errorStatus: 500 });
      if(airbrake) {
        airbrake.notify(error).then((airbrakeErr)=> {
          if (airbrakeErr.error) {
            log.error("AirBrake Error", { context: 'airbrake', err: airbrakeErr.error, errorStatus: 500 });
          }
          res.send({recommendations: [], groupId: groupId });
        });
      } else {
        res.send({recommendations: [], groupId: groupId });
      }
    });
  }
};

router.get('/domains/:id', auth.can('view domain'), function(req, res) {
  var options = setupOptions(req);

  options = _.merge(options, {
    domain_id: req.params.id,
    limit: OVERALL_LIMIT*2
  });

  getRecommendationFor(req, options.user_id, DATE_OPTIONS, options, function (error, recommendedItemIds) {
    processRecommendations("domain", req, res, recommendedItemIds, error);
  }, req.user ? req.user.default_locale : null);
});

router.get('/communities/:id', auth.can('view community'),  function(req, res) {
  var options = setupOptions(req);

  options = _.merge(options, {
    community_id: req.params.id,
    limit: OVERALL_LIMIT*2
  }, req.user ? req.user.default_locale : null);

  getRecommendationFor(req, options.user_id, DATE_OPTIONS, options, function (error, recommendedItemIds) {
    processRecommendations("community", req, res, recommendedItemIds, error);
  }, req.user ? req.user.default_locale : null);
});

router.get('/groups/:id', auth.can('view group'), function(req, res) {
  var options = setupOptions(req);

  options = _.merge(options, {
    group_id: req.params.id,
    limit: OVERALL_LIMIT*2
  });

  getRecommendationFor(req, options.user_id, DATE_OPTIONS, options, function (error, recommendedItemIds) {
    processRecommendations("group", req, res, recommendedItemIds, error);
  }, req.user ? req.user.default_locale : null);
});

router.put('/groups/:id/getPostRecommendations', auth.can('view group'), function(req, res) {
  const redisCacheKey = "cache:getPostRecommendations:"+req.params.id+":userId:"+(req.user ? req.user.id : "notLoggedIn");
  req.redisClient.get(redisCacheKey).then(recommendations => {
    if (recommendations) {
      res.send(JSON.parse(recommendations));
    } else {
      var options = setupOptions(req);

      options = _.merge(options, {
        group_id: req.params.id,
        limit: 100
      });

      models.Group.findOne({
        where: {
          id: req.params.id
        },
        attributes: [
          'id', 'configuration'
        ]
      }).then(group => {
        if (group) {
          var dateOptions = null; //DATE_OPTIONS_YEAR;
          if (group.configuration && group.configuration.maxDaysBackForRecommendations && group.configuration.maxDaysBackForRecommendations) {
            var maxDays = parseInt(group.configuration.maxDaysBackForRecommendations);
            dateOptions = {name: "date", after: moment().add(-Math.abs(maxDays), 'days').toISOString()};
          }

          getRecommendationFor(req, options.user_id, dateOptions, options, function (error, recommendedItemIds) {
            if (!error) {
              processRecommendationsLight(req.params.id, req, res, recommendedItemIds, error, redisCacheKey);
            } else {
              log.error("Error from getRecommendationFor", {error});
              res.send({recommendations: [], groupId: req.params.id});
            }
          }, req.user ? req.user.default_locale : null);
        } else {
          log.error("Group not found");
          res.send({recommendations: [], groupId: req.params.id});
        }
      }).catch(error => {
        log.error(error);
        res.send({recommendations: [], groupId: req.params.id});
      });
    }
  }).catch(error => {
    log.error(error);
    res.send({recommendations: [], groupId: req.params.id});
  });
});

module.exports = router;
