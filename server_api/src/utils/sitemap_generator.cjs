var models = require("../models/index.cjs");
var _ = require("lodash");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

var async = require("async");
const log = require("./logger.cjs");

const getCommunityURL = (hostname, domainName, path) => {
  return "https://" + hostname + "." + domainName + path;
};

const wildCardDomainNames = [
  "betrireykjavik.is",
  "betraisland.is",
  "yrpri.org",
  "evoly.ai",
  "tarsalgo.net",
  "ypus.org",
  "idea-synergy.com",
  "localhost:4242",
];

var generateSitemap = async function (req, res) {

  if (!req.ypDomain) {
    log.error("No domain found in sitemap generation");
    res.status(500);
    return;
  }

  const domainId = req.ypDomain.id;
  const domainName = req.ypDomain.domain_name;
  let community =
    req.ypCommunity && req.ypCommunity.id ? req.ypCommunity : null;

  let siteHostname = community
    ? getCommunityURL(community.hostname, domainName, "")
    : "https://" + req.ypDomain.domain_name;

  if (domainName === "parliament.scot") {
    siteHostname = "https://engage.parliament.scot";
  } else if (domainName === "engage-southampton.ac.uk") {
    siteHostname = "https://scca-online.engage-southampton.ac.uk"
  }

  const redisKey = `cache:sitemap:v3:${siteHostname}-${domainId}`;

  req.redisClient.get(redisKey).then((content) => {
    if (content) {
      res.header("Content-Type", "application/xml");
      res.set({ "content-type": "application/xml" });
      res.send(content);
    } else {
      const sitemapStream = new SitemapStream({
        hostname: siteHostname,
        cacheTime: 1,
      });

      let links = [];

      log.info(
        `generateSitemap ${domainName} ${
          community ? community.hostname : "noHostname"
        } `
      );

      async.series(
        [
          function (seriesCallback) {
            if (community && wildCardDomainNames.indexOf(domainName) > -1) {
              links.push({ url: "https://" + domainName + "/domain/" + domainId });
            } else {
              links.push({ url: "/domain/" + domainId });
            }
            seriesCallback();
          },
          function (seriesCallback) {
            if (!community || !(wildCardDomainNames.indexOf(domainName) > -1)) {
              models.Community.findAll({
                attributes: ["id", "hostname"],
                where: {
                  domain_id: domainId,
                  access: models.Community.ACCESS_PUBLIC,
                  status: {
                    $ne: "hidden",
                  },
                },
              })
                .then(function (communities) {
                  _.forEach(communities, function (community) {
                    if (!community) {
                      log.error("No community found in sitemap generation");
                      return;
                    }
                    const path = "/community/" + community.id;
                    if (
                      community.hostname &&
                      wildCardDomainNames.indexOf(domainName) > -1
                    ) {
                      links.push({
                        url: getCommunityURL(community.hostname, domainName, ""),
                      });
                    } else {
                      links.push({ url: path });
                    }
                  });
                  seriesCallback();
                })
                .catch(function (error) {
                  seriesCallback(error);
                });
            } else {
              seriesCallback();
            }
          },
          function (seriesCallback) {
            let communityWhere;

            if (community) {
              communityWhere = {
                id: community.id,
                access: models.Community.ACCESS_PUBLIC,
                status: {
                  $ne: "hidden",
                },
              };
            } else {
              communityWhere = {
                domain_id: domainId,
                access: models.Community.ACCESS_PUBLIC,
                status: {
                  $ne: "hidden",
                },
              };
            }

            models.Group.findAll({
              attributes: ["id"],
              where: {
                $or: [
                  { access: models.Group.ACCESS_PUBLIC },
                  { access: models.Group.ACCESS_OPEN_TO_COMMUNITY },
                ],
                status: {
                  $ne: "hidden",
                },
                configuration: {
                  actAsLinkToCommunityId: null,
                },
              },
              include: [
                {
                  model: models.Community,
                  attributes: ["id", "hostname"],
                  where: communityWhere,
                  required: true,
                },
              ],
            })
              .then(function (groups) {
                _.forEach(groups, function (group) {
                  if (!group) {
                    log.error("No group found in sitemap generation");
                    return;
                  }
                  const path = "/group/" + group.id;
                  if (
                    group.Community.hostname &&
                    wildCardDomainNames.indexOf(domainName) > -1
                  ) {
                    links.push({
                      url: getCommunityURL(
                        group.Community.hostname,
                        domainName,
                        path
                      ),
                    });
                  } else {
                    links.push({ url: path });
                  }
                });
                seriesCallback();
              })
              .catch(function (error) {
                seriesCallback(error);
              });
          },
          function (seriesCallback) {
            if (community || !(wildCardDomainNames.indexOf(domainName) > -1)) {
              let mainInclude;

              if (community) {
                mainInclude = [
                  {
                    model: models.Community,
                    attributes: ["id"],
                    required: true,
                    where: {
                      id: community.id,
                      access: models.Community.ACCESS_PUBLIC,
                      status: {
                        $ne: "hidden",
                      },
                    },
                  },
                ];
              } else {
                mainInclude = [
                  {
                    model: models.Community,
                    attributes: ["id"],
                    required: true,
                    where: {
                      access: models.Community.ACCESS_PUBLIC,
                      status: {
                        $ne: "hidden",
                      },
                    },
                    include: [
                      {
                        model: models.Domain,
                        where: {
                          id: domainId,
                        },
                        attributes: [],
                        required: true,
                      },
                    ],
                  },
                ];
              }

              models.Post.findAll({
                attributes: ["id"],
                include: [
                  {
                    model: models.Group,
                    attributes: ["id"],
                    where: {
                      $or: [
                        { access: models.Group.ACCESS_PUBLIC },
                        { access: models.Group.ACCESS_OPEN_TO_COMMUNITY },
                      ],
                      configuration: {
                        actAsLinkToCommunityId: null,
                      },
                    },
                    required: true,
                    include: mainInclude,
                  },
                ],
              })
                .then(function (posts) {
                  _.forEach(posts, function (post) {
                    if (!post) {
                      log.error("No post found in sitemap generation");
                      return;
                    }
                    links.push({ url: "/post/" + post.id });
                  });
                  seriesCallback();
                })
                .catch(function (error) {
                  seriesCallback(error);
                });
            } else {
              seriesCallback();
            }
          },
        ],
        function (error) {
          if (error) {
            log.error("Error from looking up sitemap data", { err: error });
            res.status(500).end();
          } else {
            try {
              // Remove all spaces from the links url parameters
              links = _.map(links, (link) => {
                link.url = link.url.replace(/\s/g, "");
                return link;
              });

              streamToPromise(Readable.from(links).pipe(sitemapStream)).then(
                (xml) => {
                  xml = xml.toString();
                  req.redisClient.setEx(
                    redisKey,
                    process.env.SITEMAP_CACHE_TTL
                      ? parseInt(process.env.SITEMAP_CACHE_TTL)
                      : 60 * 60,
                    xml
                  ).then(()=>{
                    log.error("From streamToPromise have savd xml");
                    res.header("Content-Type", "application/xml");
                    res.set({ "content-type": "application/xml" });
                    res.send(xml);
                  });
                }
              );
            } catch (error) {
              log.error("Error from looking up sitemap data", { err: error });
              res.status(500).end();
            }
          }
        }
      );
    }
  }).catch((error) => {
    log.error("Error from looking up sitemap data", { err: error });
    res.status(500).end();
  });
};

module.exports = generateSitemap;
