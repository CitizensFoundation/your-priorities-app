const async = require('async');
const models = require('../models');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');

const recountPosts = (postIds, done) => {
  async.forEachSeries(postIds, (postId, forEachPostCallback) => {
    recountPost(postId, forEachPostCallback);
  }, error => {
    done(error)
  });
}

const recountPoints = (pointIds, done) => {
  async.forEachSeries(pointIds, (pointId, forEachPostCallback) => {
    recountPoint(pointId, forEachPostCallback);
  }, error => {
    done(error)
  });
}

const recountPost = (postId, done) => {
  var endorsementsCount;
  var oppositionCount;
  var pointCount;
  async.parallel([
    (parallelCallback) => {
      models.Endorsement.count({
        where: {
          value: 1,
          post_id: postId
        }
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
        }
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
        }
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
        attributes: ['id','counter_endorsements_up','counter_endorsements_down','counter_points']
      }).then( (post) => {
        post.counter_points = pointCount;
        post.counter_endorsements_up = endorsementsCount;
        post.counter_endorsements_down = oppositionCount;
        post.save().then( (results) => {
          console.log(`Recount for post ${post.id} done`);
          done();
        });
      }).catch( (error) => {
        done(error);
      })
    }
  });
};

const recountPoint = (pointId, done) => {
  var counter_quality_up;
  var counter_quality_down;
  var pointCount;
  async.parallel([
    (parallelCallback) => {
      models.PointQuality.count({
        where: {
          value: 1,
          point_id: pointId
        }
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
        }
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
        attributes: ['id','counter_quality_up','counter_quality_down']
      }).then( (point) => {
        point.counter_quality_up = counter_quality_up;
        point.counter_quality_down = counter_quality_down;
        point.save().then( (results) => {
          console.log(`Recount for point ${point.id} done`);
          done();
        });
      }).catch( (error) => {
        done(error);
      })
    }
  });
};

const countPostInGroup = (groupId, done) => {
  models.Post.count({
    where: {
      group_id: groupId
    }
  }).then( count => {
    done(null, count);
  }).catch( error => {
    done(error)
  })
}

const countPointsInGroup = (groupId, done) => {
  models.Point.count({
    where: {
      group_id: groupId
    }
  }).then( count => {
    done(null, count);
  }).catch( error => {
    done(error)
  })
}

const countUsersInGroup = (groupId, done) => {
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
        ]
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
        ]
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
        ]
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
        ]
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
        }
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

const countAllInGroup = (groupId, done) => {
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
      })
    },
    (seriesCallback) => {
      countPointsInGroup(groupId, (error, count) => {
        if (error) {
          seriesCallback(error);
        } else {
          pointCount = count;
          seriesCallback();
        }
      })
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
      })
    }
  ], error => {
    if (error) {
      done(error);
    } else {
      done(null, postCount, pointCount, userCount, allUsers);
    }
  });
}

const recountGroup = (groupId, callback) => {
  models.Group.findOne({
    where: {
      id: groupId
    }
  }).then(group=>{
    if (group) {
      countAllInGroup(group.id, (error, postCount, pointCount, userCount, allUsers) => {
        if (error) {
          callback(error);
        } else {
          group.set('counter_points', pointCount);
          group.set('counter_users', Math.max(userCount, 1));
          group.set('counter_posts', postCount);
          group.save().then(()=>{
            console.log(`Recount Group ${group.id} users: ${Math.max(userCount, 1)} posts: ${postCount} points: ${pointCount}`)
            callback(null, { postCount, pointCount, userCount, allUsers });
          }).catch( error=> {
            callback(error);
          })
        }
      })
    } else {
      callback("Group not found");
    }
  }).catch(error=>{
    callback(error);
  })
}

const recountCommunity = (communityId, callback) => {
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
    ]
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
        })
      }, error=>{
        if (error) {
          callback(error)
        } else {
          community.set('counter_points', pointCount);
          community.set('counter_users', Math.max(_.uniq(allUsers).length, 1));
          community.set('counter_posts', postCount);
          community.save().then(()=>{
            console.log(`Recount Community ${community.id} users: ${Math.max(_.uniq(allUsers).length, 1)} posts: ${postCount} points: ${pointCount}`)
            callback();
          }).catch( error=> {
            callback(error);
          })
        }
      })
    } else {
      console.error(`Community ${communityId} found`)
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
