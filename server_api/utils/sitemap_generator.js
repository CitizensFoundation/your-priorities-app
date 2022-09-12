var models = require("../models");
var _ = require("lodash");
var sitemapLib = require('sitemap');
var async = require('async');
const log = require('./logger');

const getCommunityURL = (hostname, domainName, path) => {
  return 'https://'+hostname+'.'+domainName+path;
};

const wildCardDomainNames = [
  'betrireykjavik.is',
  'betraisland.is',
  'yrpri.org',
  'tarsalgo.net',
  'ypus.org',
  'idea-synergy.com',
  'localhost:4242'
];

var generateSitemap = function(req, res) {

  const domainId = req.ypDomain.id;
  const domainName = req.ypDomain.domain_name;
  const community = (req.ypCommunity && req.ypCommunity.id) ? req.ypCommunity : null;

  let siteHostname = community ? getCommunityURL(community.hostname, domainName, '') : 'https://'+req.ypDomain.domain_name;

  if (domainName==="parliament.scot") {
    siteHostname = "https://engage.parliament.scot"
  }

  var sitemap = sitemapLib.createSitemap ({
    hostname: siteHostname,
    cacheTime: 1 // 1 hour - cache purge period
  });

  console.log(`generateSitemap ${domainName} ${community ? community.hostname : 'noHostname'} `);

  async.series([
    function (seriesCallback) {
      if (community && wildCardDomainNames.indexOf(domainName)>-1) {
        sitemap.add({ url: 'https://'+domainName+'/domain/'+domainId} );
      } else {
        sitemap.add({ url: '/domain/'+domainId} );
      }
      seriesCallback();
    },
    function (seriesCallback) {
      if (!community || !(wildCardDomainNames.indexOf(domainName)>-1) ) {
        models.Community.findAll({
          attributes: ['id','hostname'],
          where: {
            domain_id: domainId,
            access: models.Community.ACCESS_PUBLIC,
            status: {
              $ne: 'hidden'
            }
          }
        }).then(function (communities) {
          _.forEach(communities, function (community) {
            const path = '/community/'+community.id;
            if (community.hostname && wildCardDomainNames.indexOf(domainName)>-1) {
              sitemap.add({ url: getCommunityURL(community.hostname, domainName, '')} );
            } else {
              sitemap.add({ url: path} );
            }
          });
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },
    function (seriesCallback) {
      let communityWhere;

      if (community) {
        communityWhere =  {
          id: community.id,
          access: models.Community.ACCESS_PUBLIC,
          status: {
            $ne: 'hidden'
          }
        };
      } else {
        communityWhere =  {
          domain_id: domainId,
          access: models.Community.ACCESS_PUBLIC,
          status: {
            $ne: 'hidden'
          }
        };
      }

      models.Group.findAll({
        attributes: ['id'],
        where: {
          $or: [
            { access: models.Group.ACCESS_PUBLIC },
            { access: models.Group.ACCESS_OPEN_TO_COMMUNITY },
          ],
          status: {
            $ne: 'hidden'
          },
          configuration: {
            actAsLinkToCommunityId: null
          }
        },
        include: [
          {
            model: models.Community,
            attributes: ['id','hostname'],
            where: communityWhere,
            required: true
          }
        ]
      }).then(function (groups) {
        _.forEach(groups, function (group) {
          const path = '/group/'+group.id;
          if (group.Community.hostname && wildCardDomainNames.indexOf(domainName)>-1) {
            sitemap.add({ url: getCommunityURL(group.Community.hostname, domainName, path)} );
          } else {
            sitemap.add({ url: path} );
          }
        });
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      if (community || !(wildCardDomainNames.indexOf(domainName)>-1)) {
        let mainInclude;

        if (community) {
          mainInclude =  [
            {
              model: models.Community,
              attributes: ['id'],
              required: true,
              where: {
                id: community.id,
                access: models.Community.ACCESS_PUBLIC,
                status: {
                  $ne: 'hidden'
                }
              }
            }
          ]
        } else {
          mainInclude =  [
            {
              model: models.Community,
              attributes: ['id'],
              required: true,
              where: {
                access: models.Community.ACCESS_PUBLIC,
                status: {
                  $ne: 'hidden'
                }
              },
              include: [
                {
                  model: models.Domain,
                  where: {
                    id: domainId
                  },
                  attributes: [],
                  required: true
                }
              ]
            }
          ]
        }

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
                ],
                configuration: {
                  actAsLinkToCommunityId: null
                }
              },
              required: true,
              include: mainInclude
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
          res.set({ 'content-type': 'application/xml' });
          res.send( xml );
        }
      });
    }
  });
};

module.exports = generateSitemap;
