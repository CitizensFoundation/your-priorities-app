const queue = require('../../workers/queue.cjs');
const models = require("../../../models/index.cjs");
const i18n = require('../../utils/i18n.cjs');
const async = require('async');
const moment = require('moment');
const log = require('../../../utils/logger.cjs');
const _ = require('lodash');

const domainIncludes = (domainId) => {
  return [
    {
      model: models.Group,
      required: true,
      attributes: ['id','configuration','name'],
      include: [
        {
          model: models.Community,
          required: true,
          attributes: ['id','configuration','name'],
          include: [
            {
              model: models.Domain,
              attributes: ['id','configuration','name'],
              where: {
                id: domainId
              },
              required: true
            }
          ]
        }
      ]
    }
  ];
};

const communityIncludes = (communityId) => {
  return [
    {
      model: models.Group,
      required: true,
      attributes: ['id','configuration','name'],
      include: [
        {
          model: models.Community,
          required: true,
          attributes: ['id','configuration','name'],
          where: {
            id: communityId
          }
        }
      ]
    }
  ];
};

const groupIncludes = (groupId) => {
  return [
    {
      model: models.Group,
      required: true,
      attributes: ['id','configuration','name'],
      where: {
        id: groupId
      }
    }
  ];
};

const userIncludes = (userId) => {
  return [
    {
      model: models.User,
      attributes: models.User.defaultAttributesWithSocialMediaPublicAndEmail,
      required: true,
      where: {
        id: userId
      }
    }
  ];
};

const _toPercent = number => {
  if (number) {
    return Math.round(number*100)+'%';
  }
};

const getPushItem = (type, model) => {
  let source, toxicityScore, toxicityScoreRaw, latestContent = null,
      severeToxicityScore, content,
      lastReportedAtDate = null, firstReportedDate = null,
      lastReportedByEmail;

  if (model.data && model.data.moderation) {
    const moderation = model.data.moderation;

    if (moderation.toxicityScore) {
      toxicityScore = _toPercent(moderation.toxicityScore);
      toxicityScoreRaw = moderation.toxicityScore;
    }

    if (moderation.severeToxicityScore) {
      severeToxicityScore = _toPercent(moderation.severeToxicityScore);
    }
    if (moderation.lastReportedBy &&
      moderation.lastReportedBy.length > 0) {
      source = moderation.lastReportedBy[0].source;
      firstReportedDate = moderation.lastReportedBy[moderation.lastReportedBy.length-1].date;
      lastReportedAtDate = moderation.lastReportedBy[0].date;
      lastReportedByEmail = moderation.lastReportedBy[0].userEmail;
    }
  }

  if (!firstReportedDate)
    firstReportedDate = model.created_at;

  if (!lastReportedAtDate)
    lastReportedAtDate = model.created_at;

  if (!lastReportedByEmail)
    lastReportedByEmail = "Unknown";

  let pointTextContent, postTextContent, postTranscriptContent, postNameContent;

  if (type==='point') {
    pointTextContent = model.PointRevisions[model.PointRevisions.length-1].content;
    latestContent = model.PointRevisions[model.PointRevisions.length-1].content;
  } else if (type==='post') {
    postTextContent = model.description;
    postNameContent = model.name;
    if (model.PostVideos && model.PostVideos.length>0 && model.PostVideos[model.PostVideos.length-1].meta && model.PostVideos[0].meta.text) {
      postTranscriptContent = model.PostVideos[model.PostVideos.length-1].meta.text;
    } else if (model.PostAudios && model.PostAudios.length>0 &&
      model.PostAudios[model.PostAudios.length-1].meta && model.PostAudios[model.PostAudios.length-1].meta.text) {
      postTranscriptContent = model.PostAudios[model.PostAudios.length-1].meta.text;
    }
  }

  let groupName;
  groupName = model.Group ? model.Group.name : null;
  if (groupName==='hidden_public_group_for_domain_level_points') {
    groupName = "";
  }

  return {
    id: model.id,
    created_at: model.created_at,
    formatted_date: moment(model.created_at).format("DD/MM/YY HH:mm"),
    type: type,
    lastReportedByEmail: lastReportedByEmail,
    counter_flags: model.counter_flags,
    status: model.status,
    public_data: model.public_data,
    user_id: model.user_id,
    toxicityScore: toxicityScore,
    toxicityScoreRaw: toxicityScoreRaw,
    severeToxicityScore: severeToxicityScore,
    source: source,
    lastReportedAtDate: lastReportedAtDate,
    firstReportedDate: firstReportedDate,
    lastReportedAtDateFormatted: lastReportedAtDate ? moment(lastReportedAtDate).format("DD/MM/YY HH:mm") : null,
    firstReportedDateFormatted:  firstReportedDate ? moment(firstReportedDate).format("DD/MM/YY HH:mm") : null,
    user_email: model.User.email,
    cover_media_type: model.cover_media_type,
    is_post: type==='post',
    is_point: type==='point',
    title: model.name,
    post_id: model.post_id,
    groupName: groupName,
    language: model.language,
    name: model.name,
    description: model.description,
    moderation_data: { moderation: model.data ? model.data.moderation : null },
    postTextContent,
    content: type==='post' ? (model.name + ' ' + model.description) : pointTextContent,
    pointTextContent,
    postTranscriptContent,
    postNameContent: postNameContent,
    name_content: type==='post' ? model.name : "",
    transcriptContent: postTranscriptContent,
    Group: model.Group,
    PostVideos: model.PostVideos,
    PostAudios: model.PostAudios,
    PostHeaderImages: model.PostHeaderImages,
    PointVideos: model.PointVideos,
    PointAudios: model.PointAudios,
    PointRevisions: model.PointRevisions,
    latestContent: latestContent
  };
};

const getItems = (posts, points, options) => {
  let items = [];
  _.forEach(posts, post => {
    items.push(getPushItem('post', post));
  });

  // Free memory
  posts = null;

  _.forEach(points, point => {
    items.push(getPushItem('point', point));
  });

  // Free memory
  points = null;

  if (options.allContent) {
    items = _.orderBy(items,['created_at'], ['desc']);
  } else {
    items = _.orderBy(items,['status', 'counter_flags', 'created_at'], ['asc','desc','desc']);
  }

  return items;
};

const getModelModeration = (options, callback) => {
  options.model.unscoped().findAll({
    where: {
      deleted: false,
      $or: [
        {
          counter_flags: {
            $gt: options.allContent ? -1 : 0
          },
        },
        {
          status: "in_moderation_queue"
        }
      ],
    },
    //TODO: Have paging here at some point
    limit: 7500,
    order: options.order,
    include: options.includes,
    attributes: options.attributes
  }).then(items => {
    callback(null, items);
  }).catch(error => {
    callback(error);
  })
};

const countModelModeration = (options, callback) => {
  options.model.unscoped().count({
    where: {
      deleted: false,
      $or: [
        {
          counter_flags: {
            $gt: options.allContent ? -1 : 0
          },
        },
        {
          status: "in_moderation_queue"
        }
      ],
    },
    include: options.includes
  }).then(count => {
    callback(null, count);
  }).catch(error => {
    callback(error);
  })
};

const getAllModeratedItemsByMaster = (options, callback) => {
  let posts, points;

  const postBaseIncludes = _.cloneDeep(options.includes);
  const pointBaseIncludes = _.cloneDeep(options.includes);

  async.series([
    parallelCallback => {
      let postIncludes = postBaseIncludes.concat([
        {
          model: models.Image,
          required: false,
          as: 'PostHeaderImages',
          attributes:["formats",'updated_at']
        },
        {
          model: models.Audio,
          required: false,
          attributes: ['id','formats','updated_at','listenable','public_meta','meta'],
          as: 'PostAudios',
        }
      ]);

      if (!options.userId) {
        postIncludes = postIncludes.concat([ { model: models.User, attributes: models.User.defaultAttributesWithSocialMediaPublicAndEmail }]);
      } else {
        postIncludes = postIncludes.concat([ { model: models.Group, attributes: ['id','name','configuration'] }]);
      }

      const order = [
        [ { model: models.Image, as: 'PostHeaderImages' } ,'updated_at', 'asc' ],
        [ { model: models.Audio, as: "PostAudios" }, 'updated_at', 'desc' ],
      ];

      const attributes = ['id','created_at','counter_flags','language','data','name','cover_media_type','description','status','public_data','user_id'];

      getModelModeration(_.merge(_.cloneDeep(options), {model: models.Post, includes: postIncludes, order, attributes }), (error, postsIn) => {
        if (error) {
          parallelCallback(error);
        } else {
          posts = postsIn;
          models.Post.setVideosForPosts(posts, parallelCallback);
        }
      })
    },
    parallelCallback => {
      let pointIncludes = pointBaseIncludes.concat([
        {
          model: models.Audio,
          required: false,
          attributes: ['id','formats','updated_at','listenable','public_meta','meta'],
          as: 'PointAudios'
        },
        {
          model: models.PointRevision,
          attributes: ['id','content'],
          required: false
        }
      ]);

      if (!options.userId) {
        pointIncludes = pointIncludes.concat([ { model: models.User, attributes: models.User.defaultAttributesWithSocialMediaPublicAndEmail }]);
      } else {
        pointIncludes = pointIncludes.concat([ { model: models.Group, required: false, attributes: ['id','name','configuration'] }]);
      }

      const order = [
        [ { model: models.Audio, as: "PointAudios" }, 'updated_at', 'desc' ],
        [ models.PointRevision, 'created_at', 'asc' ],
      ];

      const attributes = ['id','created_at','counter_flags','name','language','data','post_id','status','public_data','user_id'];

      getModelModeration(_.merge(_.cloneDeep(options), {model: models.Point, attributes, includes: pointIncludes, order }), (error, pointsIn) => {
        points = pointsIn;
        models.Point.setVideosForPoints(points, parallelCallback);
      })
    }
  ], error => {
    log.info("get_moderation_items got items from database");
    callback(error, getItems(posts, points, options));
  });
};

const countAllModeratedItemsByMaster = (options, callback) => {
  let totalCount = 0;

  async.series([
    parallelCallback => {

      countModelModeration(_.merge(_.cloneDeep(options), {model: models.Post }), (error, count) => {
        if (error) {
          parallelCallback(error);
        } else {
          totalCount += count;
          parallelCallback();
        }
      })
    },
    parallelCallback => {
      countModelModeration(_.merge(_.cloneDeep(options), {model: models.Point }), (error, count) => {
        if (error) {
          parallelCallback(error);
        } else {
          totalCount += count;
          parallelCallback();
        }
      })
    }
  ], error => {
    log.info("count_moderation_items got items from database");
    callback(error, totalCount);
  });
};

const getAllModeratedItemsByDomain = (options, callback) => {
  getAllModeratedItemsByMaster(_.merge(options, {includes: domainIncludes(options.domainId) }), callback);
};

const getAllModeratedItemsByCommunity = (options, callback) => {
  getAllModeratedItemsByMaster(_.merge(options, {includes: communityIncludes(options.communityId) }), callback);
};

const getAllModeratedItemsByGroup = (options, callback) => {
  getAllModeratedItemsByMaster(_.merge(options, {includes: groupIncludes(options.groupId) }), callback);
};

const getAllModeratedItemsByUser = (options, callback) => {
  getAllModeratedItemsByMaster(_.merge(options, {includes: userIncludes(options.userId) }), callback);
};

const countAllModeratedItemsByDomain = (options, callback) => {
  countAllModeratedItemsByMaster(_.merge(options, {includes: domainIncludes(options.domainId) }), callback);
};

const countAllModeratedItemsByCommunity = (options, callback) => {
  countAllModeratedItemsByMaster(_.merge(options, {includes: communityIncludes(options.communityId) }), callback);
};

const countAllModeratedItemsByGroup = (options, callback) => {
  countAllModeratedItemsByMaster(_.merge(options, {includes: groupIncludes(options.groupId) }), callback);
};

const countAllModeratedItemsByUser = (options, callback) => {
  countAllModeratedItemsByMaster(_.merge(options, {includes: userIncludes(options.userId) }), callback);
};

module.exports = {
  domainIncludes,
  communityIncludes,
  groupIncludes,
  userIncludes,
  getAllModeratedItemsByDomain,
  getAllModeratedItemsByUser,
  getAllModeratedItemsByCommunity,
  getAllModeratedItemsByGroup,
  countAllModeratedItemsByDomain,
  countAllModeratedItemsByCommunity,
  countAllModeratedItemsByGroup,
  countAllModeratedItemsByUser
};