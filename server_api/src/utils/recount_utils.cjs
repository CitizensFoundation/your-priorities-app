const async = require('async');
const models = require('../models/index.cjs');
const _ = require('lodash');
const fs = require('fs');
const request = require("./requestCompat.cjs");
const log = require('./logger.cjs');

const recountPosts = (postIds, done, transaction) => {
  async.forEachSeries(postIds, (postId, forEachPostCallback) => {
    recountPost(postId, forEachPostCallback, transaction);
  }, error => {
    done(error)
  });
}

const recountPoints = (pointIds, done, transaction) => {
  async.forEachSeries(pointIds, (pointId, forEachPostCallback) => {
    recountPoint(pointId, forEachPostCallback, transaction);
  }, error => {
    done(error)
  });
}

const recountPost = (postId, done, transaction) => {
  var endorsementsCount;
  var oppositionCount;
  var pointCount;
  async.parallel([
    (parallelCallback) => {
      models.Endorsement.count({
        where: {
          value: 1,
          post_id: postId
        },
        transaction
      }).then( (count) => {
        endorsementsCount = count;
        parallelCallback();
      }).catch( (error) => {
        parallelCallback(error);
      });
    },
    (parallelCallback) => {
      models.Endorsement.count({
        where: {
          value: -1,
          post_id: postId
        },
        transaction
      }).then( (count) => {
        oppositionCount = count;
        parallelCallback();
      }).catch(function (error) {
        parallelCallback(error);
      });
    },
    (parallelCallback) => {
      models.Point.count({
        where: {
          $or: [
            {value: -1},
            {value: 1}
          ],
          post_id: postId
        },
        transaction
      }).then( (count) => {
        pointCount = count;
        parallelCallback();
      }).catch( (error) => {
        parallelCallback(error);
      });
    }
  ],  (error) => {
    if (error) {
      done(error)
    } else {
      models.Post.findOne({
        where: {
          id: postId
        },
        attributes: ['id','counter_endorsements_up','counter_endorsements_down','counter_points'],
        transaction
      }).then( (post) => {
        post.counter_points = pointCount;
        post.counter_endorsements_up = endorsementsCount;
        post.counter_endorsements_down = oppositionCount;
        post.save({ transaction }).then( (results) => {
          log.info(`Recount for post ${post.id} done`);
          done();
        });
      }).catch( (error) => {
        done(error);
      })
    }
  });
};

const recountPoint = (pointId, done, transaction) => {
  var counter_quality_up;
  var counter_quality_down;
  var pointCount;
  async.parallel([
    (parallelCallback) => {
      models.PointQuality.count({
        where: {
          value: 1,
          point_id: pointId
        },
        transaction
      }).then( (count) => {
        counter_quality_up = count;
        parallelCallback();
      }).catch( (error) => {
        parallelCallback(error);
      });
    },
    (parallelCallback) => {
      models.PointQuality.count({
        where: {
          value: -1,
          point_id: pointId
        },
        transaction
      }).then( (count) => {
        counter_quality_down = count;
        parallelCallback();
      }).catch(function (error) {
        parallelCallback(error);
      });
    }
  ],  (error) => {
    if (error) {
      done(error)
    } else {
      models.Point.findOne({
        where: {
          id: pointId
        },
        attributes: ['id','counter_quality_up','counter_quality_down'],
        transaction
      }).then( (point) => {
        point.counter_quality_up = counter_quality_up;
        point.counter_quality_down = counter_quality_down;
        point.save({ transaction }).then( (results) => {
          log.info(`Recount for point ${point.id} done`);
          done();
        });
      }).catch( (error) => {
        done(error);
      })
    }
  });
};

const countPostInGroup = (groupId, done, transaction) => {
  models.Post.count({
    where: {
      group_id: groupId
    },
    transaction
  }).then( count => {
    done(null, count);
  }).catch( error => {
    done(error)
  })
}

const countPointsInGroup = (groupId, done, transaction) => {
  models.Point.count({
    where: {
      group_id: groupId
    },
    transaction
  }).then( count => {
    done(null, count);
  }).catch( error => {
    done(error)
  })
}

const countUsersInGroup = (groupId, done, transaction) => {
  const userIds = [];

  async.series([
    (seriesCallback) => {
      models.Endorsement.findAll({
        attributes: ['user_id'],
        include: [
          {
            model: models.Post,
            attributes: ['id'],
            where: {
              group_id: groupId
            }
          }
        ],
        transaction
      }).then( endorsements => {
        for (let i=0;i<endorsements.length;i++) {
          userIds.push(endorsements[i].user_id);
        }
        seriesCallback();
      }).catch(seriesCallback)
    },
    (seriesCallback) => {
      models.Rating.findAll({
        attributes: ['user_id'],
        include: [
          {
            model: models.Post,
            attributes: ['id'],
            where: {
              group_id: groupId
            }
          }
        ],
        transaction
      }).then( ratings => {
        for (let i=0;i<ratings.length;i++) {
          userIds.push(ratings[i].user_id);
        }
        seriesCallback();
      }).catch(seriesCallback)
    },
    (seriesCallback) => {
      models.PointQuality.findAll({
        attributes: ['user_id'],
        include: [
          {
            model: models.Point,
            attributes: ['id'],
            include: [
              {
                model: models.Post,
                attributes: ['id'],
                where: {
                  group_id: groupId
                }
              }
            ]
          }
        ],
        transaction
      }).then( qualities => {
        for (let i=0;i<qualities.length;i++) {
          userIds.push(qualities[i].user_id);
        }
        seriesCallback();
      }).catch(seriesCallback)
    },
    (seriesCallback) => {
      models.Point.findAll({
        attributes: ['user_id'],
        include: [
          {
            model: models.Post,
            attributes: ['id'],
            where: {
              group_id: groupId
            }
          }
        ],
        transaction
      }).then( points => {
        for (let i=0;i<points.length;i++) {
          userIds.push(points[i].user_id);
        }
        seriesCallback();
      }).catch(seriesCallback)
    },
    (seriesCallback) => {
      models.Post.findAll({
        attributes: ['id'],
        where: {
          group_id: groupId
        },
        transaction
      }).then( posts => {
        for (let i=0;i<posts.length;i++) {
          userIds.push(posts[i].user_id);
        }
        seriesCallback();
      }).catch(seriesCallback)
    }
  ], error => {
    done(error, _.uniq(userIds).length, userIds);
  })
}

const countAllInGroup = (groupId, done, transaction) => {
  let postCount = 0;
  let pointCount = 0;
  let userCount = 0;
  let allUsers;

  async.parallel([
    (seriesCallback) => {
      countPostInGroup(groupId, (error, count) => {
        if (error) {
          seriesCallback(error);
        } else {
          postCount = count;
          seriesCallback();
        }
      }, transaction)
    },
    (seriesCallback) => {
      countPointsInGroup(groupId, (error, count) => {
        if (error) {
          seriesCallback(error);
        } else {
          pointCount = count;
          seriesCallback();
        }
      }, transaction)
    },
    (seriesCallback) => {
      countUsersInGroup(groupId, (error, count, allUsersIn) => {
        if (error) {
          seriesCallback(error);
        } else {
          userCount = count;
          allUsers = allUsersIn;
          seriesCallback();
        }
      }, transaction)
    }
  ], error => {
    if (error) {
      done(error);
    } else {
      done(null, postCount, pointCount, userCount, allUsers);
    }
  });
}

const recountGroup = (groupId, callback, transaction) => {
  models.Group.findOne({
    where: {
      id: groupId
    },
    transaction
  }).then(group=>{
    if (group) {
      countAllInGroup(group.id, (error, postCount, pointCount, userCount, allUsers) => {
        if (error) {
          callback(error);
        } else {
          group.set('counter_points', pointCount);
          group.set('counter_users', Math.max(userCount, 1));
          group.set('counter_posts', postCount);
          group.save({ transaction }).then(()=>{
            log.info(`Recount Group ${group.id} users: ${Math.max(userCount, 1)} posts: ${postCount} points: ${pointCount}`)
            callback(null, { postCount, pointCount, userCount, allUsers });
          }).catch( error=> {
            callback(error);
          })
        }
      }, transaction)
    } else {
      callback("Group not found");
    }
  }).catch(error=>{
    callback(error);
  })
}

const recountCommunity = (communityId, callback, transaction) => {
  models.Community.findOne({
    where: {
      id: communityId
    },
    attributes: ['id','counter_points','counter_users','counter_posts'],
    include: [
      {
        model: models.Group,
        attributes: ['id','counter_points','counter_users','counter_posts'],
        where: {
          is_group_folder: false
        }
      }
    ],
    transaction
  }).then(community=>{
    if (community) {
      let postCount = 0;
      let pointCount = 0;

      let allUsers = [];

      async.forEachSeries(community.Groups, (group, forEachCallback) => {
        recountGroup(group.id, (error, counts) => {
          if (error) {
            forEachCallback(error)
          } else {
            postCount += counts.postCount;
            pointCount += counts.pointCount;
            allUsers = allUsers.concat(counts.allUsers);
            forEachCallback();
          }
        }, transaction)
      }, error=>{
        if (error) {
          callback(error)
        } else {
          community.set('counter_points', pointCount);
          community.set('counter_users', Math.max(_.uniq(allUsers).length, 1));
          community.set('counter_posts', postCount);
          community.save({ transaction }).then(()=>{
            log.info(`Recount Community ${community.id} users: ${Math.max(_.uniq(allUsers).length, 1)} posts: ${postCount} points: ${pointCount}`)
            callback();
          }).catch( error=> {
            callback(error);
          })
        }
      })
    } else {
      log.error(`Community ${communityId} found`)
      callback();
    }
  }).catch(error=>{
    callback(error);
  })
}

module.exports = {
  recountCommunity,
  recountGroup,
  recountPost,
  recountPosts,
  recountPoint,
  recountPoints,
  countUsersInGroup
};
