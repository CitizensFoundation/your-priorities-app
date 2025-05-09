const async = require("async");
const models = require("../../models/index.cjs");
const log = require('../utils/logger.cjs');
const queue = require('./queue.cjs');
const i18n = require('../utils/i18n.cjs');
const toJson = require('../utils/to_json.cjs');
const getAnonymousUser = require('../utils/get_anonymous_system_user.cjs');
const _ = require('lodash');

let airbrake = null;
if(process.env.AIRBRAKE_PROJECT_ID) {
  airbrake = require('../utils/airbrake.cjs');
}

/**
 * Defines the AnonymizationWorker class.
 * @class AnonymizationWorker
 */
function AnonymizationWorker() {}

const anonymizePointActivities = (workPackage, callback) => {
  const pointId = workPackage.pointId;
  const userId = workPackage.userId;

  log.info('Starting Point Activities Anonymized', {pointId: pointId, context: 'ac-anonymize', userId: workPackage.userId});
  if (pointId && workPackage.anonymousUserId) {
    async.series([
      (seriesCallback) => {
        models.AcActivity.update(
          { user_id: workPackage.anonymousUserId },
          { where: { point_id: pointId } }
        ).then(function (spread) {
          log.info('Point User Activities Anonymized', {pointId: pointId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        models.PointRevision.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { point_id:  pointId, user_id: userId  } }
        ).then(function (spread) {
          log.info('Point User Revision Anonymized', {pointId: pointId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      }
    ], (error) => {
      callback(error);
    });
  } else {
    callback("No pointId, userId or anonymousUserId for anonymizePointActivities", { workPackage: workPackage });
  }
};

const anonymizePostActivities = (workPackage, callback) => {
  const postId = workPackage.postId;
  const userId = workPackage.userId;

  log.info('Starting Post Activities Anonymized', {postId: postId, context: 'ac-anonymize', userId: workPackage.userId});
  if (postId && workPackage.anonymousUserId) {
    async.series([
      (seriesCallback) => {
        models.AcActivity.update(
          { user_id: workPackage.anonymousUserId },
          { where: { post_id: postId } }
        ).then(function (spread) {
          log.info('Post User Activities Anonymized', {postId: postId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      }
    ], (error) => {
      callback(error);
    });
  } else {
    callback("No postId or anonymousUserId for anonymizePointActivities", { postId: postId, workPackage: workPackage });
  }
};

const anonymizePointContent = (workPackage, callback) => {
  const pointId = workPackage.pointId;
  log.info('Starting Point Activities Anonymized', {pointId: pointId, context: 'ac-anonymize', userId: workPackage.userId});
  if (pointId && workPackage.anonymousUserId) {
    async.series([
      (seriesCallback) => {
        if (!workPackage.skipActivities) {
          models.AcActivity.update(
            { user_id: workPackage.anonymousUserId },
            { where: { point_id: pointId } }
          ).then(function (spread) {
            log.info('Point Activities Anonymized', {pointId: pointId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
            seriesCallback();
          }).catch(function (error) {
            seriesCallback(error);
          });
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        models.PointQuality.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { point_id: pointId } }
        ).then(function (spread) {
          log.info('Point Quality Anonymized', {pointId: pointId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        models.PointRevision.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { point_id: pointId } }
        ).then(function (spread) {
          log.info('Point Revision Anonymized', {pointId: pointId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      }
    ], (error) => {
      callback(error);
    });
  } else {
    callback("No pointId or anonymousUserId for anonymizePointContent", { workPackage: workPackage });
  }
};

const anonymizePostContent = (workPackage, callback) => {
  const postId = workPackage.postId;
  log.info('Starting Post Content Anonymized', {postId: postId, context: 'ac-anonymize', userId: workPackage.userId});
  if (postId && workPackage.anonymousUserId) {
    async.series([
      (seriesCallback) => {
        if (!workPackage.skipActivities) {
          models.AcActivity.update(
            { user_id: workPackage.anonymousUserId },
            { where: { post_id: postId } }
          ).then((spread) => {
            log.info('Post Activities Anonymized', {postId: postId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
            seriesCallback();
          }).catch((error) => {
            seriesCallback(error);
          });
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        models.Point.findAll({
          attributes: ['id'],
          where: {
            post_id: postId
          }
        }).then((points) => {
          async.forEach(points, (point, innerCallback) => {
            anonymizePointContent(_.merge({pointId: point.id, skipActivities: true}, workPackage), innerCallback);
          }, (error) => {
            seriesCallback(error);
          })

        }).catch((error) => {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        models.Point.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { post_id: postId } }
        ).then((spread) => {
          log.info('Post Activities Points Anonymized', {postId: postId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        models.Post.findOne({
            where: {
              id: postId,
              data: {
                $ne: null
              }
            },
            attribute: ['id', 'data']
          }
        ).then((post) => {
          if (post && post.data.contact) {
            post.set("data.contact", {});
            post.save().then(() => {
              seriesCallback();
            }).catch((error) => {
              seriesCallback(error);
            });
          } else {
            seriesCallback();
          }
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        models.Endorsement.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { post_id: postId } }
        ).then((spread) => {
          log.info('Post Endorsement Anonymized', { postId: postId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      }], (error) => {
        if (!workPackage.skipNotification) {
          models.Post.findOne({
            where: { id: postId },
            attributes: ['id'],
            include: [
              {
                model: models.Group,
                attributes: ['id','community_id'],
                include: [
                  {
                    model: models.Community,
                    attribues: ['id', 'domain_id']
                  }
                ]
              }
            ]
          }).then((post) => {
            if (post) {
              const notificationType = error ? 'anonymizePostContentError' : 'anonymizePostContentDone';
              models.AcActivity.createActivity({
                type: 'activity.system.generalUserNotification',
                object: { type: notificationType, name: workPackage.postName, forwardToUser: true },
                userId: workPackage.userId, postId: post.id, groupId: post.Group.id, communityId: post.Group.Community.id,
                domainId: post.Group.Community.domain_id
              }, (subError) => {
                callback(error || subError);
              });
            } else {
              callback("Cant find post for anonymization notification");
            }
          }).catch((error) => {
            callback(error);
          })
        } else {
          callback(error);
        }
      }
    );
  } else {
    callback("No postId for anonymizePostContent", { workPackage: workPackage });
  }
};

const anonymizeGroupContent = (workPackage, callback) => {
  const groupId = workPackage.groupId;
  let allPosts = null;
  log.info('Starting Group Activities Anonymized', {groupId: groupId, context: 'ac-anonymize', userId: workPackage.userId});
  if (groupId && workPackage.anonymousUserId) {
    async.series([
      (seriesCallback) => {
        models.AcActivity.update(
          { user_id: workPackage.anonymousUserId },
          { where: { group_id: groupId }}
        ).then((spread) => {
          log.info('Group Activities Anonymized', {groupId: groupId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        models.Post.findAll({
          attributes: ['id'],
          where: { group_id: groupId }
        }).then(function (posts) {
          async.forEach(posts, function (post, innerCallback) {
            anonymizePostContent(_.merge({postId: post.id, skipActivities: true, skipNotification: true, useNotification: false }, workPackage), innerCallback);
          }, (error) => {
            seriesCallback(error);
          });
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        models.Point.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { group_id: groupId }}
        ).then((spread) => {
          log.info('Group Points Anonymized', {groupId: groupId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        models.Point.findAll({
          where: { group_id: groupId },
          attributes: ['id', 'group_id'],
          include: [
            {
              model: models.PointRevision,
              required: true,
              attributes: ['id','user_id']
            }
          ]
        }).then((points) => {
          var pointRevisionsIds = [];
          points.forEach((point) => {
            let newIds = _.map(point.PointRevisions, (revision) => {
              return revision.id;
            });
            pointRevisionsIds = pointRevisionsIds.concat(newIds);
          });
          models.PointRevision.update(
            { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
            { where: {
                id: {
                  $in: pointRevisionsIds
                }
              }
            }
          ).then((spread) => {
            log.info('Group PointRevisions Anonymized', {groupId: groupId, numberAnonymized: spread[0], context: 'ac-anonymize', userId: workPackage.userId});
            seriesCallback();
          }).catch((error) => {
            seriesCallback(error);
          });
        }).catch((error) => {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        models.Point.findAll({
          where: { group_id: groupId },
          attributes: ['id', 'group_id'],
          include: [
            {
              model: models.PointQuality,
              required: true,
              attributes: ['id','user_id']
            }
          ]
        }).then((points) => {
          var pointQualitiesIds = [];
          points.forEach((point) => {
            let newIds = _.map(point.PointQualities, (quality) => {
              return quality.id;
            });
            pointQualitiesIds = pointQualitiesIds.concat(newIds);
          });
          models.PointQuality.update(
            { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
            { where: {
                id: {
                  $in: pointQualitiesIds
                }
              }
            }
          ).then((spread) => {
            log.info('Group PointQuality Anonymized', {groupId: groupId, numberAnonymized: spread[0], context: 'ac-anonymize', userId: workPackage.userId});
            seriesCallback();
          }).catch((error) => {
            seriesCallback(error);
          });
        }).catch((error) => {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        models.Post.update(
          { user_id: workPackage.anonymousUserId},
          { where: { group_id: groupId } }
        ).then((spread) => {
          log.info('Group Activities Post Anonymized', {groupId: groupId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      }], (error) => {
        if (!workPackage.skipNotification) {
          models.Group.findOne(
            { where: { id: groupId },
              attributes: ['id','community_id'],
              include: [
                {
                  model: models.Community,
                  attribues: ['id','domain_id']
                }
              ]}
          ).then((group) => {
            if (group) {
              const notificationType = error ? 'anonymizeGroupContentError' : 'anonymizeGroupContentDone';
              models.AcActivity.createActivity({
                type: 'activity.system.generalUserNotification',
                object: { type: notificationType, name: workPackage.groupName, forwardToUser: true },
                userId: workPackage.userId, groupId: group.id, communityId: group.community_id,
                domainId: group.Community.domain_id
              }, (subError) => {
                callback(error || subError);
              });
            } else {
              callback("Cant find group for anonymization notification");
            }
          }).catch((error) => {
            callback(error);
          });
        } else {
          callback(error);
        }
      }
    );
  } else {
    callback("No groupId for anonymizeGroupContent");
  }
};

const anonymizeCommunityContent = (workPackage, callback) => {
  const communityId = workPackage.communityId;
  log.info('Starting Community Activities Delete', {communityId: communityId, context: 'ac-anonymize', userId: workPackage.userId});
  if (communityId && workPackage.anonymousUserId) {
    async.series([
       (seriesCallback) => {
        models.AcActivity.update(
          { user_id: workPackage.anonymousUserId },
          { where: { community_id: communityId }}
        ).then(function (spread) {
          log.info('Community Activities Anonymized', {communityId: communityId, numberAnonymized: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        models.Group.findAll({
            attributes: ['id'],
            where: { community_id: communityId }
          }
        ).then(function (groups) {
          groups.forEach(function (group) {
            queue.add('process-anonymization', { type: 'anonymize-group-content', userId: workPackage.userId, skipNotification: true, groupId: group.id }, 'high');
          });
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        })
      }], (error) => {
        const notificationType = error ? 'anonymizeCommunityContentError' : 'anonymizeCommunityContentDone';
        models.Community.findOne({
          where: { id: communityId },
          attributes: ['id','domain_id']
        }).then(function (community) {
          if (community) {
            models.AcActivity.createActivity({
              type: 'activity.system.generalUserNotification',
              object: { type: notificationType, name: workPackage.communityName, forwardToUser: true },
              userId: workPackage.userId, communityId: community.id, domainId: community.domain_id
            }, (subError) => {
              callback(error || subError);
            });
          } else {
            callback("Cant find community for anonymization notification");
          }
        }).catch((error) => {
          callback(error);
        });
      }
    );
  } else {
    callback("No communityId for anonymizeCommunityActivities");
  }
};

const anonymizeUserContent = (workPackage, callback) => {
  if (workPackage.userId && workPackage.anonymousUserId) {
    async.series([
      (seriesCallback) => {
        models.Endorsement.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { user_id: workPackage.userId } }
        ).then((spread) => {
          log.info('User Endorsement Anonymized', { numberDeleted: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        models.PointQuality.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { user_id: workPackage.userId } }
        ).then((spread) => {
          log.info('User Points Anonymized', { numberDeleted: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        models.Point.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { user_id: workPackage.userId } }
        ).then((spread) => {
          log.info('User Points Anonymized', { numberDeleted: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        models.AcActivity.update(
          { user_id: workPackage.anonymousUserId },
          { where: { user_id: workPackage.userId } }
        ).then((spread) => {
          log.info('User AcActitivies Anonymized', { numberDeleted: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        models.Post.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { user_id: workPackage.userId } }
        ).then((spread) => {
          log.info('User Post Anonymized', { numberDeleted: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        models.Group.update(
          { user_id: workPackage.anonymousUserId },
          { where: { user_id: workPackage.userId } }
        ).then((spread) => {
          log.info('User Groups Anonymized', { numberDeleted: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      },
      (seriesCallback) => {
        models.Community.update(
          { user_id: workPackage.anonymousUserId, ip_address: '127.0.0.1' },
          { where: { user_id: workPackage.userId } }
        ).then((spread) => {
          log.info('User Communities Anonymized', { numberDeleted: spread[0],context: 'ac-anonymize', userId: workPackage.userId});
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        })
      }
    ], (error) => {
      callback(error);
    });
  } else {
    callback("No userId or workPackage.anonymousUserId");
  }
};

const getAllUsers = (groupIds, communityId, callback) => {
  let userIdsWithContent = {};
  let usersArray;

  async.series([
    (seriesCallback) => {
      models.Post.findAll({
        where: {
          group_id: {
            $in: groupIds
          }
        },
        attributes: ['id','user_id']
      }).then((posts) => {
        posts.forEach( (post) => {
          if (!userIdsWithContent[post.user_id]) {
            userIdsWithContent[post.user_id] = {};
            userIdsWithContent[post.user_id].postIds = [];
            userIdsWithContent[post.user_id].pointIds = [];
          }
          userIdsWithContent[post.user_id].postIds.push(post.id);
        });
        seriesCallback();
      }).catch((error) => {
        seriesCallback(error);
      });
    },
    (seriesCallback) => {
      models.Point.findAll({
        where: {
          group_id: {
            $in: groupIds
          }
        },
        attributes: ['id','user_id']
      }).then((points) => {
        points.forEach( (point) => {
          if (!userIdsWithContent[point.user_id]) {
            userIdsWithContent[point.user_id] = {};
            userIdsWithContent[point.user_id].pointIds = [];
            userIdsWithContent[point.user_id].postIds = [];
          }
          userIdsWithContent[point.user_id].pointIds.push(point.id);
        });
        seriesCallback();
      }).catch((error) => {
        seriesCallback(error);
      });
    },
    (seriesCallback) => {
      if (communityId) {
        models.Point.findAll({
          where: {
            $and: [
              { community_id: communityId },
              { group_id: null }
            ],
          },
          attributes: ['id','user_id']
        }).then((points) => {
          points.forEach( (point) => {
            if (!userIdsWithContent[point.user_id]) {
              userIdsWithContent[point.user_id] = {};
              userIdsWithContent[point.user_id].pointIds = [];
              userIdsWithContent[point.user_id].postIds = [];
            }
            userIdsWithContent[point.user_id].pointIds.push(point.id);
            userIdsWithContent[point.user_id].pointIds = _.uniq(userIdsWithContent[point.user_id].pointIds)
          });
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },
    (seriesCallback) => {
      usersArray = _.map(userIdsWithContent, (userData, key) => {
        return {id: key, pointIds: userData.pointIds, postIds: userData.postIds}
      });
      seriesCallback();
    }], (error) => { callback(error, usersArray) });
};

const notifyGroupUsers = (workPackage, callback) => {
  let usersArray, groupRecord;

  async.series([
    (seriesCallback) => {
      getAllUsers([workPackage.groupId], null, (error, users) => {
        if (error) {
          seriesCallback(error);
        } else {
          usersArray = users;
          seriesCallback();
        }
      });
    },
    (seriesCallback) => {
      models.Group.findOne(
        {
          where: {id: workPackage.groupId },
          attributes: ['id', 'community_id'],
          include: [
            {
              model: models.Community,
              attribues: ['id', 'domain_id']
            }
          ]
        }
      ).then((group) => {
        if (group) {
          groupRecord = group;
          seriesCallback();
        } else {
          seriesCallback("Can't find group record")
        }
      }).catch( (error) => { seriesCallback(error) });
    },
    (seriesCallback) => {
      async.forEach(usersArray, (user, forEachCallback) => {
        models.AcActivity.createActivity({
          type: 'activity.system.generalUserNotification',
          object: {
            type: "groupContentToBeAnonymized", name: workPackage.groupName, forwardToUser: true, sendEmail: true,
            pointIds: user.pointIds, postIds: user.postIds
          },
          userId: user.id, groupId: groupRecord.id, communityId: groupRecord.community_id,
          domainId: groupRecord.Community.domain_id
        }, (error) => {
          forEachCallback(error);
        });
      }, (error) => { seriesCallback(error) });
    }],
    (error) => { callback(error) });
};

const notifyCommunityUsers = (workPackage, callback) => {
  let usersArray, communityRecord, groupIds;

  async.series([
    (seriesCallback) => {
      models.Community.findOne({
        attributes: ['id','domain_id'],
        where: {
          id: workPackage.communityId
        },
        include: [
          {
            model: models.Group,
            attributes: ['id']
          }
        ]
      }).then( (community) => {
        communityRecord = community;
        if (community.Groups) {
          groupIds = _.map(community.Groups, (group) => {
            return group.id
          });
        } else {
          groupIds = [];
        }
        seriesCallback();
      }).catch((error) => {
        seriesCallback(error);
      });
    },
    (seriesCallback) => {
      getAllUsers(groupIds, workPackage.communityId, (error, users) => {
        if (error) {
          seriesCallback(error);
        } else {
          usersArray = users;
          seriesCallback();
        }
      });
    },
    (seriesCallback) => {
      async.forEach(usersArray, (user, forEachCallback) => {
        models.AcActivity.createActivity({
          type: 'activity.system.generalUserNotification',
          object: {
            type: "communityContentToBeAnonymized", name: workPackage.communityName,
            forwardToUser: true, sendEmail: true,
            pointIds: user.pointIds, postIds: user.postIds
          },
          userId: user.id, communityId: communityRecord.id,
          domainId: communityRecord.domain_id
        }, (error) => {
          forEachCallback(error);
        });
      }, (error) => { seriesCallback(error) });
    }],
  (error) => { callback(error) });
};

/**
 * Processes an anonymization work package.
 * @param {object} workPackage - The work package containing details for anonymization.
 * @param {(error?: any) => void} callback - The callback function.
 * @memberof AnonymizationWorker
 */
AnonymizationWorker.prototype.process = function(workPackage, callback) {
  getAnonymousUser((error, anonymousUser) => {
    if (error) {
      callback(error);
    } else {
      workPackage = _.merge({ anonymousUserId: anonymousUser.id }, workPackage);
      switch(workPackage.type) {
        case 'anonymize-post-content':
          anonymizePostContent(workPackage, callback);
          break;
        case 'anonymize-post-activities':
          anonymizePostActivities(workPackage, callback);
          break;
        case 'anonymize-point-content':
          anonymizePointContent(workPackage, callback);
          break;
        case 'anonymize-point-activities':
          anonymizePointActivities(workPackage, callback);
          break;
        case 'anonymize-group-content':
          anonymizeGroupContent(workPackage, callback);
          break;
        case 'anonymize-community-content':
          anonymizeCommunityContent(workPackage, callback);
          break;
        case 'anonymize-user-content':
          anonymizeUserContent(workPackage, callback);
          break;
        case 'notify-group-users':
          notifyGroupUsers(workPackage, callback);
          break;
        case 'notify-community-users':
          notifyCommunityUsers(workPackage, callback);
          break;
        default:
          callback("Unknown type for workPackage: "+workPackage.type);
      }
    }
  });
};

/** @type {AnonymizationWorker} */
module.exports = new AnonymizationWorker();
