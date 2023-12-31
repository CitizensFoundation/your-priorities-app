"use strict";

const async = require('async');
const queue = require('../active-citizen/workers/queue');
const log = require('../utils/logger');
const _ = require("lodash");
const models = require("./index");

const findCommunityAndDomainForPointFromGroup = (sequelize, options, callback) => {
  sequelize.models.Group.findOne({
    where: {
      id: options.group_id
    },
    include: [
      {
        model: sequelize.models.Community,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: sequelize.models.Domain,
            attributes: ['id'],
            required: true
          }
        ]
      }
    ]
  }).then((group) => {
    if (group) {
      options.community_id = group.Community.id;
      options.domain_id = group.Community.Domain.id;
    }
    callback(null, options);
  }).catch((error) => {
    callback(error);
  })
};

const attachEmptyGroupIfNeeded = (sequelize, options, callback) => {
  if (!options.group_id &&
    (options.domain_id || (options.community_id && options.communityAccess == sequelize.models.Community.ACCESS_PUBLIC))) {
    sequelize.models.Group.findOrCreate({where: { name: 'hidden_public_group_for_domain_level_points' },
      defaults: { access: sequelize.models.Group.ACCESS_PUBLIC }})
      .then( results => {
        const [ group, created ] = results;
        if (group) {
          options.group_id = group.id;
          callback(null, options);
        } else {
          callback("Can't create hidden public group for domain level points");
        }
      }).catch( error=> {
        callback(error);
    });
  } else {
    callback(null, options);
  }
};

const findGroupAndCommunityAndDomainForPointFromPost = (sequelize, options, callback) => {
  sequelize.models.Post.findOne({
    where: {
      id: options.post_id
    },
    include: [
      {
        model: sequelize.models.Group,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: sequelize.models.Community,
            attributes: ['id'],
            required: true,
            include: [
              {
                model: sequelize.models.Domain,
                attributes: ['id'],
                required: true
              }
            ]
          }
        ]
      }
    ]
  }).then((post) => {
    options.group_id = post.Group.id;
    options.community_id = post.Group.Community.id;
    options.domain_id = post.Group.Community.Domain.id;
    callback(null, options);
  }).catch((error) => {
    callback(error);
  })
};

const findDomainFromCommunity = (sequelize, options, callback) => {
  sequelize.models.Community.findOne({
    where: {
      id: options.community_id
    },
    attributes: ['id','access'],
    include: [
      {
        model: sequelize.models.Domain,
        attributes: ['id'],
        required: true
      }
    ]
  }).then((community) => {
    options.domain_id = community.Domain.id;
    options.communityAccess = community.access;
    callback(null, options);
  }).catch((error) => {
    callback(error);
  })
};

const setAllActivityGroupingIds = (sequelize, options, callback) => {
  async.series([
    (seriesCallback) => {
      if (options.post_id) {
        findGroupAndCommunityAndDomainForPointFromPost(sequelize, options, (error, optionsIn) => {
          if (optionsIn) {
            options = optionsIn;
          }
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },

    (seriesCallback) => {
      if (options.group_id) {
        findCommunityAndDomainForPointFromGroup(sequelize, options, (error, optionsIn) => {
          if (optionsIn) {
            options = optionsIn;
          }
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },

    (seriesCallback) => {
      if (options.community_id) {
        findDomainFromCommunity(sequelize, options, (error, optionsIn) => {
          if (optionsIn) {
            options = optionsIn;
          }
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },

    // Attach an empty public group to domain and community levels to enable join on activities with group access control
    (seriesCallback) => {
      attachEmptyGroupIfNeeded(sequelize, options, (error, optionsIn) => {
        if (optionsIn) {
          options = optionsIn;
        }
        seriesCallback(error);
      });
    }
  ], (error) => {
    callback(error)
  });
};

module.exports = (sequelize, DataTypes) => {
  const Point = sequelize.define("Point", {
    name: { type: DataTypes.STRING, allowNull: true },
    content_type: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    content: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.INTEGER, allowNull: false },
    website: DataTypes.STRING,
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    counter_revisions: { type: DataTypes.INTEGER, defaultValue: 1 },
    counter_quality_up: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_quality_down: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_flags: { type: DataTypes.INTEGER, defaultValue: 0 },
    embed_data: DataTypes.JSONB,
    data: DataTypes.JSONB,
    public_data: DataTypes.JSONB,
    language: { type: DataTypes.STRING, allowNull: true }
  }, {

    defaultScope: {
      where: {
        deleted: false,
        status: 'published'
      }
    },

    indexes: [
      {
        fields: ['post_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['data'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['public_data'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['image_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['post_status_change_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['parent_point_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['user_id','group_id','deleted']
      },
      {
        fields: ['user_id','group_id','deleted','status']
      },
      {
        fields: ['id','deleted','status']
      },
      {
        fields: ['post_id','deleted','status']
      },
      {
        fields: ['post_id','deleted','status','created_at']
      },
      {
        name: 'points_idx_deleted_status_id',
        fields: ['deleted','status','id']
      },

      {
        name: 'points_idx_deleted_status',
        fields: ['deleted','status']
      }
    ],

    underscored: true,

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'points',
  });

  Point.defaultAttributesPublic = [
    'id','name','content_type','content','status','value',
    'website','deleted','counter_revisions','counter_quality_up',
    'embed_data', 'counter_quality_down','public_data','language'
  ];

  Point.associate = (models) => {
    Point.belongsTo(sequelize.models.PostStatusChange, { foreignKey: 'post_status_change_id'});
    Point.belongsTo(sequelize.models.Post, { foreignKey: 'post_id'});
    Point.belongsTo(sequelize.models.Community, { foreignKey: 'community_id'});
    Point.belongsTo(sequelize.models.Domain, { foreignKey: 'domain_id'});
    Point.belongsTo(sequelize.models.User, { foreignKey: 'user_id'});
    Point.belongsTo(sequelize.models.Image, { foreignKey: 'image_id'});
    Point.belongsTo(sequelize.models.Point, { as: 'ParentPoint', foreignKey: 'parent_point_id' });
    Point.belongsTo(sequelize.models.Group, { foreignKey: 'group_id'});
    Point.hasMany(sequelize.models.PointRevision);
    Point.hasMany(sequelize.models.PointQuality);
    Point.belongsToMany(models.Video, { as: 'PointVideos', through: 'PointVideo' });
    Point.belongsToMany(models.Audio, { as: 'PointAudios', through: 'PointAudio' });
  };

  Point.CONTENT_DEBATE = 0;
  Point.CONTENT_NEWS_STORY = 1;
  Point.CONTENT_COMMENT = 2;

  Point.createComment = (req, options, callback) => {
    options.content = options.comment.content;
    delete options.comment;

    options.user_id = req.user.id;
    options.content_type = sequelize.models.Point.CONTENT_COMMENT;
    options.value = 0;
    options.status = 'published';
    options.user_agent = req.useragent.source;
    options.ip_address = req.clientIp;

    async.series([
      (seriesCallback) => {
        if (options.parent_point_id) {
          sequelize.models.Point.findOne({
            where: {
              id: options.parent_point_id
            },
            attributes: ['id', 'group_id', 'post_id', 'community_id', 'domain_id']
          }).then((parentPoint) => {
            if (parentPoint) {
              options.group_id = parentPoint.group_id;
              options.community_id = parentPoint.community_id;
              options.domain_id = parentPoint.domain_id;
              options.post_id = options.post_id ? options.post_id : parentPoint.post_id;
            }
            seriesCallback();
          }).catch((error) => {
            seriesCallback(error);
          })
        } else {
          seriesCallback();
        }
      },

      (seriesCallback) => {
        if (options.image_id) {
          sequelize.models.Image.findOne({
            where: {
              id: options.image_id
            },
            attributes: ['id', 'user_id' ],
            include: [
              {
                model: sequelize.models.Post,
                as: 'PostUserImages',
                attributes: ['id','group_id']
              }
            ]
          }).then((image) => {
            if (image && image.PostUserImages && image.PostUserImages.length>0) {
              options.group_id = image.PostUserImages[0].group_id;
              options.post_id = image.PostUserImages[0].id;
            }
            seriesCallback();
          }).catch((error) => {
            seriesCallback(error);
          })
        } else {
          seriesCallback();
        }
      },

      (seriesCallback) => {
        setAllActivityGroupingIds(sequelize, options, (error, optionsIn) => {
          if (optionsIn) {
            options = optionsIn;
          }
          seriesCallback(error);
        });
      },

      (seriesCallback) => {
        options.data = {
          browserId: req.body.pointBaseId,
          browserFingerprint: req.body.pointValCode,
          browserFingerprintConfidence: req.body.pointConf,
          originalQueryString: req.body.originalQueryString,
          userLocale: req.body.userLocale,
          userAutoTranslate: req.body.userAutoTranslate,
          referrer: req.body.referrer,
          url: req.body.url,
          screen_width: req.body.screen_width
        };
        sequelize.models.Point.build(options).save().then((point) => {
          options.point_id = point.id;
          const pointRevision = sequelize.models.PointRevision.build(options);
          pointRevision.save().then(() => {
            log.info("process-moderation point toxicity on comment");
            queue.add('process-moderation', { type: 'estimate-point-toxicity', pointId: point.id }, 'high');
            sequelize.models.AcActivity.createActivity({
              type: 'activity.point.comment.new',
              userId: options.user_id,
              pointId: options.point_id,
              imageId: options.image_id,
              domainId: options.domain_id,
              groupId: options.group_id ? options.group_id : 1,
              communityId: options.community_id,
              postId: options.post_id,
              access: sequelize.models.AcActivity.ACCESS_PUBLIC
            }, (error) => {
              seriesCallback(error);
            });
          })
        }).catch((error) => {
          seriesCallback(error);
        });
      }
    ], (error) => {
      callback(error);
    });
  };

  //TODO Refactor duplicate code with Post
  Point.setOrganizationUsersForPoints = (points, done) => {
    const userIds = points.map(p=>{
      return p.user_id
    })
    sequelize.models.User.findAll({
      attributes:  ['id','created_at'],
      where: {
        id: {
          $in: userIds
        }
      },
      include: [
        {
          model: sequelize.models.Organization,
          as: 'OrganizationUsers',
          required: true,
          attributes: ['id','name'],
          include: [
            {
              model: sequelize.models.Image,
              as: 'OrganizationLogoImages',
              attributes: ['id', 'formats'],
              required: false
            }
          ]
        }
      ],
      order: [
          [ { model: sequelize.models.Organization, as: 'OrganizationUsers' }, { model: sequelize.models.Image, as: 'OrganizationLogoImages' }, 'created_at', 'asc' ]
      ]
    }).then(users => {
      if (users && users.length>0) {
        for (let u=0; u<users.length; u++) {
          for (let p=0; p<points.length; p++) {
            if (points[p].User.id===users[u].id) {
              points[p].User.OrganizationUsers = users[u].OrganizationUsers;
              points[p].User.setDataValue('OrganizationUsers', users[u].OrganizationUsers);
            }
          }
        }
        done();
      } else {
        done();
      }
    }).catch( error => {
      done(error);
    })
  }

  Point.setVideosForPoints = (points, done) =>  {
    Point.getVideosForPoints(points.map(p=>p.id), (error, videos) => {
      if (error) {
        done(error);
      } else if (!videos || videos.length===0) {
        done()
      } else {
        for (let v=0; v<videos.length; v++) {
          for (let p=0; p<points.length; p++) {
            if (videos[v].PointVideos &&
                videos[v].PointVideos.length > 0 &&
                points[p].id===videos[v].PointVideos[0].id) {
                if (!points[p].PointVideos) {
                  points[p].PointVideos = [];
                }
                points[p].PointVideos.push(videos[v]);
                points[p].setDataValue('PointVideos', points[p].PointVideos);
            }
          }
        }
        done();
      }
    })
  }

  //TODO Refactor duplicate code with Post
  Point.getVideosForPoints = (pointIds, done) => {
    sequelize.models.Video.findAll({
      attributes:  ['id','formats','viewable','created_at','public_meta'],
      include: [
        {
          model: sequelize.models.Image,
          as: 'VideoImages',
          attributes:["formats",'created_at'],
          required: false
        },
        {
          model: sequelize.models.Point,
          where: {
            id: {
              $in: pointIds
            }
          },
          as: 'PointVideos',
          required: true,
          attributes: ['id'],
        }
      ],
      order: [
        [ { model: sequelize.models.Image, as: 'VideoImages' }, 'created_at', 'asc' ]
      ]
    }).then(videos => {
      videos = _.orderBy(videos, ['created_at'],['desc']);
      done(null, videos);
    }).catch( error => {
      done(error);
    })
  }

  Point.addVideosToAllActivityPoints = (activities, videos) => {
    const pointsHash = {};

    for (let i=0;i<activities.length;i++) {
      if (activities[i].Point) {
        pointsHash[activities[i].Point.id] = activities[i].Point;
      }
    }

    for (let i=0;i<videos.length;i++) {
      if (videos[i].PointVideos &&  videos[i].PointVideos.length>0) {
        const pointId = videos[i].PointVideos[0].id;
        if (pointsHash[pointId]) {
          if (!pointsHash[pointId].dataValues.PointVideos) {
            pointsHash[pointId].dataValues.PointVideos = [];
          }
          pointsHash[pointId].dataValues.PointVideos.push(videos[i]);
        } else {
          log.error("Can't find point to add video to")
        }
      } else {
        log.error("Can't find PointVideos");
      }
    }
  }

  Point.createNewsStory = (req, options, callback) => {
    options.content = options.point.content;
    options.embed_data = options.point.embed_data;
    delete options.point;

    async.series([
      (seriesCallback) => {
        setAllActivityGroupingIds(sequelize, options, (error, optionsIn) => {
          if (optionsIn) {
            options = optionsIn;
          }
          seriesCallback(error);
        });
      }
    ], (error) => {
      options.user_id = req.user.id;
      options.content_type = sequelize.models.Point.CONTENT_NEWS_STORY;
      options.value = 0;
      options.status = 'published';
      options.user_agent = req.useragent.source;
      options.ip_address = req.clientIp;

      sequelize.models.Point.build(options).save().then((point) => {
        options.point_id = point.id;
        const pointRevision = sequelize.models.PointRevision.build(options);
        pointRevision.save().then(() => {
          log.info("process-moderation point toxicity on news story");
          if (!options.subType || options.subType!="bulkOperation") {
            queue.add('process-moderation', { type: 'estimate-point-toxicity', pointId: point.id }, 'high');
          }
          sequelize.models.AcActivity.createActivity({
            type: 'activity.point.newsStory.new',
            userId: options.user_id,
            subType: options.subType ? options.subType : null,
            domainId: options.domain_id,
            groupId: options.group_id ? options.group_id : 1,
            pointId: options.point_id,
            context: options.context ? options.context : null,
            communityId: options.community_id,
            postId: options.post_id,
            access: sequelize.models.AcActivity.ACCESS_PUBLIC
          }, (error) => {
            callback(error, point);
          });
        })
      }).catch((error) => {
        callback(error);
      });
    });
  };

  Point.prototype.setupModerationData = function () {
    if (!this.data) {
      this.set('data', {});
    }
    if (!this.data.moderation) {
      this.set('data.moderation', {});
    }
  };

  Point.prototype.report = function (req, source, post, callback) {
    this.setupModerationData();
    async.series([
      (seriesCallback) => {
        if (!this.data.moderation.lastReportedBy) {
          this.set('data.moderation.lastReportedBy', []);
          if ((source==='user' || source==='fromUser') && !this.data.moderation.toxicityScore) {
            log.info("process-moderation point toxicity on manual report");
            queue.add('process-moderation', { type: 'estimate-point-toxicity', pointId: this.id }, 'high');
          }
        }
        this.set('data.moderation.lastReportedBy',
          [{ date: new Date(), source: source, userId: (req && req.user) ? req.user.id : null, userEmail: (req && req.user) ? req.user.email : 'anonymous' }].concat(this.data.moderation.lastReportedBy)
        );

        this.save().then(() => {
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        if (req && req.disableNotification===true) {
          seriesCallback();
        } else {
          sequelize.models.AcActivity.createActivity({
            type: 'activity.report.content',
            userId: (req && req.user) ? req.user.id : null,
            postId: post ? post.id : this.post_id,
            groupId: (post && post.Group) ? post.Group.id : this.group_id,
            pointId: this.id,
            communityId: (post && post.Group && post.Group.Community) ? post.Group.Community.id : null,
            domainId:  (post && post.Group && post.Group.Community && post.Group.Community.Domain) ? post.Group.Community.Domain.id : null
          }, (error) => {
            seriesCallback();
          });
        }
      }
    ], (error) => {
      this.increment('counter_flags');
      callback(error);
    });
  };

  return Point;
};
