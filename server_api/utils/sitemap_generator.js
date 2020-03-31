var models = require("../models");
var _ = require("lodash");
var sitemapLib = require('sitemap');
var async = require('async');

const getCommunityURL = (req, path) => {
  if (req.ypCommunity && req.ypCommunity.id && req.ypCommunity.hostname) {
    const url = 'https://'+req.ypCommunity.hostname+'.'+req.ypDomain.domain_name+path;;
    return url;
  } else {
    return path;
  }
};

var generateSitemap = function(req, res) {
  var sitemap = sitemapLib.createSitemap ({
    hostname: 'https://'+req.ypDomain.domain_name,
    cacheTime: 0 // 1 hour - cache purge period
  });

  const domainId = req.ypDomain.id;
  const community = (req.ypCommunity && req.ypCommunity.id) ? req.ypCommunity : null;

  async.series([
    function (seriesCallback) {
      sitemap.add({ url: '/domain/'+domainId} );
      seriesCallback();
    },
    function (seriesCallback) {
      models.Community.findAll({
        attributes: ['id'],
        where: {
          domain_id: domainId
        }
      }).then(function (communities) {
        _.forEach(communities, function (community) {
          sitemap.add({ url: getCommunityURL(req, '/community/'+community.id)} );
        });
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      models.Group.findAll({
        attributes: ['id'],
        where: {
          $or: [
            { access: models.Group.ACCESS_PUBLIC },
            { access: models.Group.ACCESS_OPEN_TO_COMMUNITY },
          ]
        },
        include: [
          {
            model: models.Community,
            attributes: ['id'],
            where: {
              domain_id: domainId,
              access: models.Community.ACCESS_PUBLIC
            },
            required: true
          }
        ]
      }).then(function (groups) {
        _.forEach(groups, function (group) {
          sitemap.add({ url: getCommunityURL(req, '/group/'+group.id )} );
        });
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      if (community) {
        models.Post.findAll({
          attributes: ['id'],
          include: [
            {
              model: models.Group,
              attributes: ['id'],
              where: {
                $or: [
                  { access: models.Group.ACCESS_PUBLIC },
                  { access: models.Group.ACCESS_OPEN_TO_COMMUNITY },
                ]
              },
              required: true,
              include: [
                {
                  model: models.Community,
                  attributes: ['id'],
                  required: true,
                  where: {
                    id: community.id,
                    access: models.Community.ACCESS_PUBLIC
                  }
                }
              ]
            }
          ]
        }).then(function (posts) {
          _.forEach(posts, function (post) {
            sitemap.add({ url: '/post/'+post.id} );
          });
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    }
  ], function (error) {
    if (error) {
      log.error("Error from looking up sitemap data", { err: error });
      res.status(500).end();
    } else {
      sitemap.toXML( function (error, xml) {
        if (error) {
          log.error("Eror creating sitemap data", { err: error });
          res.status(500).end();
        } else {
          const redisKey = "cache:sitemap:" + req.ypDomain.id;
          req.redisClient.setex(redisKey, process.env.SITEMAP_CACHE_TTL ? parseInt(process.env.SITEMAP_CACHE_TTL) : 60*60, xml);
          res.header('Content-Type', 'application/xml');
          res.send( xml );
        }
      });
    }
  });
};

module.exports = generateSitemap;
