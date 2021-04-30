var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var async = require('async');
var _ = require('lodash');
const moment = require('moment');

const loginUserFromHeader = (req, res, done) => {
  const apiKey = req.get('X-API-KEY');
  if (apiKey) {
    models.User.findOne({
      where: {
        private_profile_data: {
          apiKey: apiKey
        }
      },
      attributes: ['id']
    }).then(user=>{
      if (user) {
        req.logIn(user, function (error) {
          if (error) {
            log.error("Error in createApiKey", { error });
            done(401);
          } else {
            done();
          }
        });
      } else {
        log.error("Error in createApiKey", {});
        done(401);
      }
    }).catch(error=>{
      log.error("Error in loginUserFromHeader", { err: error });
      done(500);
    })
  } else {
    done(401);
  }
}

router.get('/:externalId/points', (req, res) => {
  let communities;
  let points;

  async.series([
    seriesCallback=>{
      loginUserFromHeader(req,res,seriesCallback);
    },
    seriesCallback=>{
      models.Community.findAll({
        where: {
          configuration: {
            externalId: req.params.externalId
          }
        },
        attributes: ['id']
      }).then(communitiesIn=>{
        communities = communitiesIn;
        seriesCallback();
      }).catch(error=>{
        seriesCallback(error);
      })
    },
    seriesCallback=>{
      async.eachLimit(communities, 10, (community, eachCallback) =>{
        community.hasCommunityAdmins(req.user).then(result => {
          if (result) {
            eachCallback();
          } else {
            eachCallback({status:401, text: `No admin access to community id: ${community.id}`});
          }
        });
      }, error=>{
        seriesCallback(error);
      })
    },
    seriesCallback=>{
      const communitIds = communities.map(community=>{
        return community.id;
      })

      let pointOrder = ["created_at","desc"];
      if (req.query.byHelpfulCount) {
        pointOrder = [
          models.sequelize.literal('(counter_quality_up-counter_quality_down) desc')
        ]
      }

      let where = {};

      let postWhere = {};

      if (req.query.fromDate) {
        _.merge(where, {
          created_at: {
            [models.Sequelize.Op.gte]: req.query.fromDate
          }
        })
      }

      if (req.query.toDate) {
        _.merge(where, {
          created_at: {
            [models.Sequelize.Op.lte]: req.query.toDate
          }
        })
      }

      if (req.query.postId) {
        _.merge(postWhere, {
          id: req.query.postId
        })
      }

      let order = [
        pointOrder,
        [models.User, {model: models.Image, as: 'UserProfileImages'}, 'created_at', 'asc'],
        [{model: models.Video, as: "PointVideos"}, 'updated_at', 'desc'],
        [{model: models.Audio, as: "PointAudios"}, 'updated_at', 'desc'],
        [{model: models.Video, as: "PointVideos"}, {
          model: models.Image,
          as: 'VideoImages'
        }, 'updated_at', 'asc'],
        [models.User, {model: models.Organization, as: 'OrganizationUsers'}, {
          model: models.Image,
          as: 'OrganizationLogoImages'
        }, 'created_at', 'asc']
      ];

      models.Point.findAndCountAll({
        order: order,
        limit: 100,
        subQuery: false,
        where: where,
        offset: req.query.offset ? req.query.offset : 0,
        attributes: ['id', 'name', 'content', 'user_id', 'value', 'counter_quality_up', 'counter_quality_down', 'embed_data', 'language', 'created_at', 'public_data'],
        include: [
          {
            model: models.User,
            attributes: ["id", "name", "facebook_id", "twitter_id", "google_id", "github_id", "private_profile_data"],
            required: true,
            include: [
              {
                model: models.Image, as: 'UserProfileImages',
                attributes: ['id', 'formats'],
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
            attributes: ['content', 'value', 'embed_data', 'created_at'],
            required: false,
            order: [['created_at', 'asc']],
            separate: true
          },
          {
            model: models.Video,
            required: false,
            attributes: ['id', 'formats', 'updated_at', 'viewable', 'public_meta'],
            as: 'PointVideos',

            include: [
              {
                model: models.Image,
                as: 'VideoImages',
                attributes: ["formats", 'updated_at'],
                required: false
              },
            ]
          },
          {
            model: models.Audio,
            required: false,
            attributes: ['id', 'formats', 'updated_at', 'listenable'],
            as: 'PointAudios'
          },
          {
            model: models.Post,
            attributes: ['id', 'group_id','name'],
            required: true,
            where: postWhere,
            include: [
              {
                model: models.Group,
                attributes: ['id','name'],
                include: [
                  {
                    model: models.Community,
                    attributes: ['id','name'],
                    where: {
                      id: {
                        [models.Sequelize.Op.in]: communitIds
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      }).then((pointsIn) => {

        for (let i=0; i<pointsIn.rows.length;i++) {
          if (pointsIn.rows[i].User.private_profile_data) {
            pointsIn.rows[i].User.private_profile_data = { registration_answers: pointsIn.rows[i].User.private_profile_data.registration_answers };
          }
        }

        points = pointsIn;
        seriesCallback();
      }).catch((error) => {
        seriesCallback(error);
      });
    }
  ], error=>{
    if (error) {
      log.error("Error in get externalId points", { error });
      if (error===401) {
        res.sendStatus(401)
      } else if (error.status && error.text) {
        res.status(error.status).send(error.text);
      } else {
        res.sendStatus(500);
      }
    } else {
      res.send(points);
    }
  });
});

module.exports = router;
