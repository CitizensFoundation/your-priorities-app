var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
const async = require('async');
var toJson = require('../utils/to_json');
var url = require('url');
var _ = require('lodash');
const {getSharingParameters, getFullUrl, getSplitUrl} = require("../utils/sharing_parameters");

// TODO: Make sure to load the latest image
// TODO: Make sure to still support the escaped_fragment routes after moving to the direct urls for backwards sharing capacity

const ITEM_LIMIT = 1000;

var sendDomain = function sendDomainForBot(id, communitiesOffset, req, res) {
  models.Domain.findOne({
    where: { id: id },
    attributes: ['id', 'name', 'description'],
    order: [
      [ { model: models.Image, as: 'DomainLogoImages' } , 'created_at', 'desc' ]
    ],
    include: [
      {
        attributes: ['id','formats'],
        model: models.Image, as: 'DomainLogoImages',
        required: false
      }
    ]
  }).then( (domain) => {
    if (domain) {
      if (!communitiesOffset)
        communitiesOffset = 0;
      models.Community.findAndCountAll({
        attributes: ['id','name'],
        order: [ ['created_at', 'desc'] ],
        where: {
          access: models.Community.ACCESS_PUBLIC,
          domain_id: domain.id
        },
        limit: ITEM_LIMIT,
        offset: communitiesOffset
      }).then( async communitiesInfo => {
        const communities = communitiesInfo.rows;
        //log.info('Bot: Domain', { id: domain ? domain.id : -1 });
        var imageUrl = '';
        if (domain.DomainLogoImages && domain.DomainLogoImages.length>0) {
          var formats = JSON.parse(domain.DomainLogoImages[0].formats);
          imageUrl = formats[0];
        }

        const communitiesLeft = communitiesInfo.count-(communitiesOffset+communities.length);
        if (communitiesLeft>0) {
          communitiesOffset+=ITEM_LIMIT;
        } else {
          communitiesOffset = null;
        }

        const sharingParameters = await getSharingParameters(
          req,
          domain,
          getFullUrl(req),
          imageUrl
        );

        var botOptions = {
          url: sharingParameters.url,
          title: sharingParameters.title,
          descriptionText: sharingParameters.description,
          imageUrl: sharingParameters.imageUrl,
          locale: domain.language,
          subItemsUrlbase: "/community/",
          subItemContainerName: "Communities",
          backUrl: "/domain/"+domain.id,
          backText: "Back to domain",
          moreUrl: communitiesOffset ? "/domain/"+domain.id+"?communitiesOffset="+communitiesOffset : null,
          moreText: "More communities ("+communitiesLeft+")",
          subItemPoints: [],
          subItemIds: communities
        };
        res.render('bot', botOptions);
      }).catch( error => {
        log.error('Domain Error for Bot', { err: error, context: 'view', bot: true });
        res.sendStatus(500);
      })
    } else {
      log.warn('Domain Not Found for Bot', { err: 'Not found', context: 'view', bot: true });
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error('Domain Not Found for Bot', { err: error, context: 'view', bot: true });
    res.sendStatus(500);
  });
};

const completeSendingCommunity = async (community, req, res) => {
  var imageUrl = '';
  if (community.CommunityLogoImages && community.CommunityLogoImages.length>0) {
    var formats = JSON.parse(community.CommunityLogoImages[0].formats);
    imageUrl = formats[0];
  }

  const sharingParameters = await getSharingParameters(
    req,
    community,
    getFullUrl(req),
    imageUrl
  );

  var botOptions = {
    url: sharingParameters.url,
    title: sharingParameters.title,
    descriptionText: sharingParameters.description,
    imageUrl: sharingParameters.imageUrl,
    locale: community.language,
    contentType: 'article',
    subItemsUrlbase: "/group/",
    subItemContainerName: "Groups",
    backUrl: "/domain/"+community.domain_id,
    backText: "Back to domain",
    subItemPoints: [],
    subItemIds: _.dropRight(community.Groups, community.Groups.length>10000 ? community.Groups.length - 10000 : 0)
  };
  res.render('bot', botOptions);
}

const getTranslation = (modelInstance, textType, targetLanguage, done) => {
  const translationReq = {query: {textType, targetLanguage}}
  models.AcTranslationCache.getTranslation(translationReq, modelInstance, function (error, translation) {
    if (error) {
      done(error);
    } else {
      done(null,  translation.content);
    }
  });
}

const translateCommunity = (community, req, res) => {
  const locale = req.query.locale || req.query.l;
  let translatedName, translatedDescription;
  async.series([
      (seriesCallback) => {
        getTranslation(community, "communityName", locale, (error, text) => {
          translatedName = text;
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        getTranslation(community, "communityContent", locale, (error, text) => {
          translatedDescription = text;
          seriesCallback(error);
        })
      },
    ],
    (error) => {
      if (error) {
        log.error(error);
      } else {
        community.name = translatedName;
        community.description = translatedDescription;
      }
      completeSendingCommunity(community, req, res);
    })
}

const translateGroup = (group, postsInfo, postsOffset, req, res) => {
  const locale = req.query.locale || req.query.l;
  let translatedName, translatedDescription;
  async.series([
      (seriesCallback) => {
        getTranslation(group, "groupName", locale, (error, text) => {
          translatedName = text;
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        getTranslation(group, "groupContent", locale, (error, text) => {
          translatedDescription = text;
          seriesCallback(error);
        })
      },
    ],
    (error) => {
      if (error) {
        log.error(error);
      } else {
        group.name = translatedName;
        group.objectives = translatedDescription;
      }
      completeSendingGroup(group, postsInfo, postsOffset, req, res);
    })
}

var sendCommunity = function sendCommunityForBot(id, req, res) {
  models.Community.findOne({
    where: { id: id, access: models.Community.ACCESS_PUBLIC },
    attributes: ['id', 'name', 'description','domain_id'],
    order: [
      [ { model: models.Image, as: 'CommunityLogoImages' } , 'created_at', 'desc' ]
    ],
    include: [
      {
        attributes: ['id','formats'],
        model: models.Image, as: 'CommunityLogoImages',
        required: false
      },
      {
        attributes: ['id','name'],
        model: models.Group,
        where: {
          $or: [
            { access: models.Group.ACCESS_PUBLIC },
            { access: models.Group.ACCESS_OPEN_TO_COMMUNITY },
          ],
          configuration: {
            actAsLinkToCommunityId: {
              [models.Sequelize.Op.is]: null
            }
          },
        },
        required: false
      }
    ]
  }).then(function(community) {
    if (community) {
      if ((req.query.locale || req.query.l) && (req.query.startAutoTranslate || req.query.t)) {
        translateCommunity(community, req, res);
      } else {
        completeSendingCommunity(community, req, res);
      }
      //log.info('Bot: Community', { communityId: community.id, context: 'view', bot: true });
    } else {
      log.warn('Community Not Found for Bot', { err: 'Not found', context: 'view', bot: true });
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error('Community Not Found for Bot', { err: error, context: 'view', bot: true });
    res.sendStatus(500);
  });
};

const completeSendingGroup = async (group, postsInfo, postsOffset, req, res) => {
  var imageUrl = '';
  if (group.GroupLogoImages && group.GroupLogoImages.length>0) {
    formats = JSON.parse(group.GroupLogoImages[0].formats);
    imageUrl = formats[0];
  } else if (group.Community.CommunityLogoImages && group.Community.CommunityLogoImages.length>0) {
    formats = JSON.parse(group.Community.CommunityLogoImages[0].formats);
    imageUrl = formats[0];
  }

  const postsLeft = postsInfo.count-(postsOffset+postsInfo.rows.length);
  if (postsLeft>0) {
    postsOffset+=ITEM_LIMIT;
  } else {
    postsOffset = null;
  }

  const sharingParameters = await getSharingParameters(
    req,
    group,
    getFullUrl(req),
    imageUrl,
  );

  const botOptions = {
    url       : sharingParameters.url,
    title     :  sharingParameters.title,
    descriptionText : sharingParameters.description,
    imageUrl  : sharingParameters.imageUrl,
    contentType: 'article',
    subItemsUrlbase: "/post/",
    subItemContainerName: "Posts",
    backUrl: "/community/"+group.community_id,
    locale: group.language,
    backText: "Back to community",
    moreUrl: postsOffset ? "/group/"+group.id+"?postsOffset="+postsOffset : null,
    moreText: "More posts ("+postsLeft+")",
    subItemPoints: [],
    subItemIds: group.Posts
  };
  res.render('bot', botOptions);
}

var sendGroup = function sendGroupForBot(id, postsOffset, req, res) {
  models.Group.findOne({
    where: {
      id: id,
      $or: [
        { access: models.Group.ACCESS_PUBLIC },
        { access: models.Group.ACCESS_OPEN_TO_COMMUNITY },
      ],
    },
    attributes: ['id', 'name', 'objectives','community_id'],
    order: [
      [ { model: models.Image, as: 'GroupLogoImages' } , 'created_at', 'desc' ],
      [ { model: models.Community }, { model: models.Image, as: 'CommunityLogoImages' } , 'created_at', 'desc' ]
    ],
    include: [
      {
        attributes: ['id','formats'],
        model: models.Image, as: 'GroupLogoImages',
        required: false
      },
      {
        model: models.Community,
        where: {
          access: models.Community.ACCESS_PUBLIC
        },
        attributes: ['id'],
        required: true,
        include: [
          {
            attributes: ['id','formats'],
            model: models.Image, as: 'CommunityLogoImages',
            required: false
          }
        ]
      }
    ]
  }).then(function(group) {
    var formats;
    if (group) {
      if (!postsOffset)
        postsOffset = 0;
      models.Post.findAndCountAll({
        where: {
          group_id: group.id
        },
        attributes: ['id','name'],
        limit: ITEM_LIMIT,
        offset: postsOffset
      }).then((postsInfo)=>{
        group.Posts = postsInfo.rows;
        //log.info('Bot: Group', { groupId: group.id, context: 'view', bot: true });
        if ((req.query.locale || req.query.l) && (req.query.startAutoTranslate || req.query.t)) {
          translateGroup(group, postsInfo, postsOffset, req, res);
        } else {
          completeSendingGroup(group, postsInfo, postsOffset, req, res);
        }
      }).catch((error)=>{
        log.error('Group Not Found for Bot', { err: error, context: 'view', bot: true });
        res.sendStatus(500);
      });
    } else {
      log.warn('Group Not Found for Bot', { err: 'Not found', context: 'view', bot: true });
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error('Group Not Found for Bot', { err: error, context: 'view', bot: true });
    res.sendStatus(500);
  });
};

var sendPost = function sendPostforBot(id, pointsOffset, req, res) {
  models.Post.findOne({
    where: { id: id },
    attributes: ['id', 'name', 'description','group_id'],
    order: [
      [ { model: models.Image, as: 'PostHeaderImages' } , 'created_at', 'desc' ],
      [ { model: models.Group }, { model: models.Image, as: 'GroupLogoImages' } , 'created_at', 'desc' ],
      [ { model: models.Group }, { model: models.Community }, { model: models.Image, as: 'CommunityLogoImages' } , 'created_at', 'desc' ]
    ],
    include: [
      {
        attributes: ['id','formats'],
        model: models.Image, as: 'PostHeaderImages',
        required: false
      },
      {
        model: models.Group,
        where: {
          $or: [
            { access: models.Group.ACCESS_PUBLIC },
            { access: models.Group.ACCESS_OPEN_TO_COMMUNITY },
          ]
        },
        attributes: ['id'],
        required: true,
        include: [
          {
            attributes: ['id','formats'],
            model: models.Image, as: 'GroupLogoImages',
            required: false
          },
          {
            model: models.Community,
            attributes: ['id'],
            where: {
              access: models.Community.ACCESS_PUBLIC
            },
            required: true,
            include: [
              {
                attributes: ['id','formats'],
                model: models.Image, as: 'CommunityLogoImages',
                required: false
              }
            ]
          }
        ]
      }
    ]
  }).then(function(post) {
    var formats;
    if (post) {
      models.Point.findAndCountAll({
        where: {
          post_id: post.id
        },
        attributes: ['id','content'],
        limit: ITEM_LIMIT,
        offset: pointsOffset
      }).then((pointsInfo)=>{
        post.Points = pointsInfo.rows;
        //log.info('Bot: Post', { postId: post ? post.id : -1, context: 'view', bot: true });
        var imageUrl = '';
        if (post.PostHeaderImages && post.PostHeaderImages.length>0) {
          formats = JSON.parse(post.PostHeaderImages[0].formats);
          imageUrl = formats[0];
        } else if (post.Group.GroupLogoImages && post.Group.GroupLogoImages.length>0) {
          formats = JSON.parse(post.Group.GroupLogoImages[0].formats);
          imageUrl = formats[0];
        } else if (post.Group.Community.CommunityLogoImages && post.Group.Community.CommunityLogoImages.length>0) {
          formats = JSON.parse(post.Group.Community.CommunityLogoImages[0].formats);
          imageUrl = formats[0];
        }

        const pointsLeft = pointsInfo.count-(pointsOffset+pointsInfo.rows.length);
        if (pointsLeft>0) {
          pointsOffset+=ITEM_LIMIT;
        } else {
          pointsOffset = null;
        }

        var botOptions = {
          url       : getFullUrl(req),
          title     :  post.name,
          descriptionText : post.description ? post.description : post.name,
          imageUrl  : imageUrl,
          contentType: 'article',
          subItemsUrlbase: "",
          subItemIds: [],
          backUrl: "/group/"+post.group_id,
          locale: post.language,
          backText: "Back to group",
          moreUrl: pointsOffset ? "/post/"+post.id+"?pointsOffset="+pointsOffset : null,
          moreText: "More points ("+pointsLeft+")",
          subItemContainerName: "Points",
          subItemPoints: post.Points
        };
        res.render('bot', botOptions);
      }).catch(function(error) {
        log.error('Points Not Found for Bot', { err: error, context: 'view', bot: true });
        res.sendStatus(500);
      });
    } else {
      log.warn('Post Not Found for Bot', { err: 'Not found', context: 'view', bot: true });
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error('Post Not Found for Bot', { err: error, context: 'view', bot: true });
    res.sendStatus(500);
  });
};

var sendUser = function sendUserForBot(id, req, res) {
  models.User.findOne({
    where: { id: id },
    attributes: ['id', 'name', 'description'],
    order: [
      [ { model: models.Image, as: 'UserProfileImages' } , 'created_at', 'desc' ]
    ],
    include: [
      {
        attributes: ['id','formats'],
        model: models.Image, as: 'UserProfileImages',
        required: false
      }
    ]
  }).then(function(user) {
    user = null;
    if (user) {
      log.info('User Viewed From Bot', { userId: id, context: 'view', bot: true });
      var imageUrl = '';
      if (user.UserProfileImages && user.UserProfileImages.length>0) {
        var formats = JSON.parse(user.UserProfileImages[0].formats);
        imageUrl = formats[0];
      }
      var botOptions = {
        url       : getFullUrl(req),
        title     :  user.name,
        descriptionText : user.description,
        imageUrl  : imageUrl,
        locale: user.language,
        contentType: 'article'
      };
      res.render('bot', botOptions);
    } else {
      log.warn('User Not Found for Bot', { err: 'Not found', context: 'view', bot: true });
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error('User Not Found for Bot', { err: error, context: 'view', bot: true });
    res.sendStatus(500);
  });
};

router.get('/*', function botController(req, res, next) {

  const { splitUrl, splitPath, id, url } = getSplitUrl(req);

  let communitiesOffset = 0;

  if (url.indexOf("communitiesOffset=")>-1) {
    communitiesOffset = parseInt(url.split("communitiesOffset=")[1].trim());
  }

  let postsOffset = 0;

  if (url.indexOf("postsOffset=")>-1) {
    postsOffset = parseInt(url.split("postsOffset=")[1].trim());
  }

  let pointsOffset = 0;
  if (url.indexOf("pointsOffset=")>-1) {
    pointsOffset = parseInt(url.split("pointsOffset=")[1].trim());
  }

  if(!isNaN(id)) {
    if (splitUrl[splitPath]=='domain') {
      sendDomain(id, communitiesOffset, req, res)
    } else if (splitUrl[splitPath]=='community') {
      sendCommunity(id, req, res)
    } else if (splitUrl[splitPath]=='group') {
      sendGroup(id, postsOffset, req, res)
    } else if (splitUrl[splitPath]=='post') {
      sendPost(id, pointsOffset, req, res)
    } else {
      log.error("Cant find controller for nonSpa", { id, splitUrl });
      res.sendStatus(404);
    }
  } else {
    async.series([
      seriesCallback => {
        models.Domain.setYpDomain(req, res, function (error) {
          seriesCallback(error);
        })
      },
      seriesCallback => {
        models.Community.setYpCommunity(req, res, function (error) {
          seriesCallback(error);
        })
      }
    ], error => {
      if (error) {
        log.error("Id for nonSpa is not a number", { error });
        res.sendStatus(404);
      } else {
        if (req.ypCommunity && req.ypCommunity.id != null) {
          sendCommunity(req.ypCommunity.id, req, res)
        } else if (req.ypDomain && req.ypDomain.id != null) {
          sendDomain(req.ypDomain.id, communitiesOffset, req, res)
        } else {
          log.error("Can't find nonspa route", { });
          res.sendStatus(404);
        }
      }
    })
  }
});

module.exports = router;
