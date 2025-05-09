const models = require('../../../models/index.cjs');
const log = require('../../../utils/logger.cjs');
const importDomain = require('./utils.cjs').importDomain;
const importCommunity = require('./utils.cjs').importCommunity;
const importGroup = require('./utils.cjs').importGroup;
const importPost = require('./utils.cjs').importPost;
const importPoint = require('./utils.cjs').importPoint;
const request = require('request');

const updateDomain = (domainId, done) => {
  log.info('updateDomain');

  models.Domain.unscoped().findOne({
    where: {
      id: domainId
    },
    attributes: ['id','name','description','default_locale','created_at', 'updated_at'],
    order: [
      ['id', 'asc' ]
    ]
  }).then((domain) => {
    if (domain) {
      importDomain(domain, done);
    } else {
      done("Can't find domain for similarities import");
    }
  }).catch((error) => {
    done(error);
  });
};

const updateCommunity = (communityId, done) => {
  log.info('updateCommunity');

  models.Community.unscoped().findOne({
    where: {
      id: communityId
    },
    include: [
      {
        model: models.Domain,
        attributes: ['id','default_locale'],
        required: true
      }
    ],
    attributes: ['id','name','description','default_locale','created_at', 'updated_at'],
    order: [
      ['id', 'asc' ]
    ]
  }).then((community) => {
    if (community) {
      importCommunity(community, async(error) => {
        if (error) {
          done(error);
        } else {
          done();
        }
      });
    } else {
      done("Can't find community for similarities import");
    }
  }).catch(function (error) {
    done(error);
  });
};

const updateGroup = (groupId, done) => {
  log.info('updateGroup');

  models.Group.unscoped().findOne({
    where: {
      id: groupId
    },
    include: [
      {
        model: models.Community,
        attributes: ['id','access','status','default_locale','created_at', 'updated_at'],
        required: true,
        include: [
          {
            model: models.Domain,
            attributes: ['id','default_locale'],
            required: true
          }
        ]
      }
    ],
    attributes: ['id','name','created_at', 'objectives', 'updated_at'],
    order: [
      ['id', 'asc' ]
    ]
  }).then((group) => {
    if (group) {
      importGroup(group, done);
    } else {
      done("Can't find group for similarities import");
    }
  }).catch(function (error) {
    done(error);
  });
};

const updatePost = (postId, done) => {
  log.info('updatePost');

  models.Post.unscoped().findOne(
    {
      where: {
        id: postId
      },
      include: [
        {
          model: models.Point.unscoped(),
          required: false,
          attributes: ['id','content'],
        },
        {
          model: models.Group.unscoped(),
          required: true,
          attributes: ['id','access','status','configuration'],
          include: [
            {
              attributes: ['id','formats'],
              model: models.Image, as: 'GroupLogoImages',
              required: false
            },
            {
              model: models.Community.unscoped(),
              attributes: ['id','access','status','default_locale'],
              required: true,
              include: [
                {
                  attributes: ['id','formats'],
                  model: models.Image, as: 'CommunityLogoImages',
                  required: false
                },
                {
                  model: models.Domain,
                  attributes: ['id','default_locale'],
                  required: true
                }
              ]
            }
          ]
        },
        {
          model: models.Image,
          required: false,
          as: 'PostHeaderImages',
          attributes: ['id','formats']
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
        {
          model: models.Audio,
          required: false,
          attributes: ['id','formats','updated_at','listenable'],
          as: 'PostAudios',
        }
      ],
      order: [
        ['id', 'desc' ],
        [ { model: models.Image, as: 'PostHeaderImages' } ,'updated_at', 'asc' ],
        [ { model: models.Group }, { model: models.Image, as: 'GroupLogoImages' } , 'created_at', 'desc' ],
        [ { model: models.Group }, { model: models.Community }, { model: models.Image, as: 'CommunityLogoImages' } , 'created_at', 'desc' ]
      ],
      attributes: ['id','name','description','group_id','category_id','status','deleted','language','created_at', 'updated_at',
        'user_id','official_status','public_data','cover_media_type',
        'counter_endorsements_up','counter_endorsements_down','counter_points','counter_flags']
    }).then((post) => {
      if (post) {
        importPost(post, done);
      } else {
        done("Can't find post for similarities import");
      }
  }).catch(function (error) {
    done(error);
  });
};

const updatePoint = (pointId, done) => {
  log.info('updatePoint', { pointId });

  models.Point.unscoped().findOne({
    where: {
      id: pointId
    },
    attributes: ['id', 'name', 'content', 'user_id', 'post_id', 'value', 'status', 'counter_quality_up', 'counter_quality_down', 'language','created_at', 'updated_at'],
    order: [
      [models.PointRevision, 'created_at', 'asc'],
      [{model: models.Video, as: "PointVideos"}, 'updated_at', 'desc'],
      [{model: models.Audio, as: "PointAudios"}, 'updated_at', 'desc'],
    ],
    include: [
      {
        model: models.PointRevision,
        attributes: ['content', 'value', 'created_at'],
        required: false
      },
      {
        model: models.Video,
        required: false,
        attributes: ['id', 'formats'],
        as: 'PointVideos'
      },
      {
        model: models.Audio,
        required: false,
        attributes: ['id', 'formats'],
        as: 'PointAudios'
      },
      {
        model: models.Post.unscoped(),
        attributes: ['id', 'group_id','created_at','category_id','official_status','status'],
        required: true,
        include: [
          {
            model: models.Group.unscoped(),
            attributes: ['id','access','status','configuration'],
            required: true,
            include: [
              {
                model: models.Community.unscoped(),
                attributes: ['id','access','status','default_locale'],
                required: true,
                include: [
                  {
                    model: models.Domain,
                    attributes: ['id','default_locale'],
                    required: true
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }).then(function (point) {
    if (point) {
      importPoint(point, done);
    } else {
      done("Can't find point for similarities import");
    }
  }).catch(function (error) {
    done(error);
  });
};

const updateCollection = (workPackage, done) => {
  if (process.env.AC_ANALYTICS_KEY &&
      process.env.AC_ANALYTICS_CLUSTER_ID &&
      process.env.AC_ANALYTICS_BASE_URL) {
    if (workPackage.domainId) {
      updateDomain(workPackage.domainId, done)
    } else if (workPackage.communityId) {
      updateCommunity(workPackage.communityId, done)
    } else if (workPackage.groupId) {
      updateGroup(workPackage.groupId, done)
    } else if (workPackage.postId) {
      updatePost(workPackage.postId, done)
    } else if (workPackage.pointId) {
      updatePoint(workPackage.pointId, done)
    } else {
      done("Couldn't find any collection to update similarities", { workPackage });
    }
  } else {
    log.warn("Can't find AC_ANALYTICS_KEY, AC_ANALYTICS_CLUSTER_ID & AC_ANALYTICS_BASE_URL for the similarities engine");
    done();
  }
};

const getFromAnalyticsApi = (req, featureType, collectionType, collectionId, done) => {
  const redisKey = "cachev5:getAnalytics:"+featureType+":"+collectionType+":"+collectionId;
  req.redisClient.get(redisKey).then(content => {
    if (content) {
      done(null, JSON.parse(content));
    } else {
      const options = {
        url: process.env["AC_ANALYTICS_BASE_URL"]+featureType+"/"+collectionType+"/"+process.env.AC_ANALYTICS_CLUSTER_ID+"/"+collectionId,
        headers: {
          'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
        }
      };

      request.get(options, (error, content) => {
        if (content && content.statusCode!=200) {
          error = content.statusCode;
        } else if (content) {
          req.redisClient.setEx(redisKey, process.env.SIMILARITIES_CACHE_TTL ? parseInt(process.env.SIMILARITIES_CACHE_TTL) : 15*60, JSON.stringify(content));
        }
        done(null, content);
      });
    }
  }).catch(error => {
    if (error) {
      log.error('Could not get pages for group from redis', {
        err: error,
        context: 'redis',
        userId: req.user ? req.user.id : null
      });
    }
    done(error);
  });
};

const triggerSimilaritiesTraining = (req, collectionType, collectionId, done) => {
  const options = {
    url: process.env["AC_ANALYTICS_BASE_URL"]+"trigger_similarities_training"+"/"+collectionType+"/"+process.env.AC_ANALYTICS_CLUSTER_ID+"/"+collectionId,
    headers: {
      'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
    },
    json: {}
  };

  request.put(options, (error, content) => {
    if (content && content.statusCode!=200) {
      error = content.statusCode;
    }
    done(error, content);
  });
};

const getParsedSimilaritiesContent = (content) => {
  let results;
  if (content && content.body) {
    try {
      results = JSON.parse(content.body);
    } catch (error) {
      log.error("Can't parse JSON from similarities");
    }
  }
  return results;
};

const sendBackAnalyticsResultsOrError = (req,res,error,results) => {
  if (error) {
    log.error("Analytics Error", { id: req.params.id, url: req.url, userId: req.user ? req.user.id : null, errorStatus:  500, error });
    res.send({ nodata: true });
  } else {
    res.send(results);
  }
};

const convertDocxSurveyToJson = (formData, done) => {
  const options = {
    url: process.env["AC_ANALYTICS_BASE_URL"]+"convert_doc_x_survey_to_json",
    headers: {
      'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
    },
    formData: formData,
  };

  request.put(options, (error, content) => {
    if (content && content.statusCode!=200) {
      error = content.statusCode;
    }
    done(error, content);
  });
}

module.exports = {
  updateCollection,
  getFromAnalyticsApi,
  triggerSimilaritiesTraining,
  sendBackAnalyticsResultsOrError,
  getParsedSimilaritiesContent,
  convertDocxSurveyToJson
};
