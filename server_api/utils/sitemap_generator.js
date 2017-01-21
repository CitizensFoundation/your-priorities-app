var models = require("../models");
var _ = require("lodash");
var sitemapLib = require('sitemap');
var async = require('async');

var generateSitemap = function(req, res) {
  var sitemap = sitemapLib.createSitemap ({
    hostname: 'https://'+req.ypDomain.domain_name,
    cacheTime: 0 // 1 hour - cache purge period
  });

  var domainId = req.ypDomain.id;

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
          sitemap.add({ url: '/community/'+community.id} );
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
          access: models.Group.ACCESS_PUBLIC
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
          sitemap.add({ url: '/group/'+group.id} );
        });
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      models.Post.findAll({
        attributes: ['id'],
        include: [
          {
            model: models.Group,
            attributes: ['id'],
            access: models.Group.ACCESS_PUBLIC,
            required: true,
            include: [
              {
                model: models.Community,
                attributes: ['id'],
                required: true,
                where: {
                  domain_id: domainId,
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
          res.header('Content-Type', 'application/xml');
          res.send( xml );
        }
      });
    }
  });
};

module.exports = generateSitemap;
