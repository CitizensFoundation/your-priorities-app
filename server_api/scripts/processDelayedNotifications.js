var models = require('../models');
var async = require('async');
var log = require('../utils/logger');
var _ = require('lodash');
var moment = require('moment');

var sendPostNew = function (delayedNotification, callback) {
  console.log("sendPostNew");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var sendPostEndorsement = function (delayedNotification, callback) {
  console.log("sendPostEndorsement");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var sendPointNew = function (delayedNotification, callback) {
  console.log("sendPointNew");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var sendPointQuality = function (delayedNotification, callback) {
  console.log("sendPointQuality");
  console.log("User email: "+delayedNotification.User.email);

  var base = { email: delayedNotification.User.email, name: delayedNotification.User.name };
  var items = [];

  async.forEach(delayedNotification.AcNotifications, function (notificationWithId, seriesCallback) {
    models.AcNotification.find({
      where: {
        id: notificationWithId.id
      },
      include: [
        {
          model: models.AcActivity, as: 'AcActivities',
          required: true,
          where: {
            deleted: false
          },
          include: [
            {
              model: models.User,
              required: true
            },
            {
              model: models.Post,
              required: false
            },
            {
              model: models.Domain,
              required: true
            },
            {
              model: models.Community,
              required: true
            },
            {
              model: models.Group,
              required: false
            },
            {
              model: models.Point,
              required: false,
              include: [
                {
                  model: models.Post,
                  required: false
                }
              ]
            }
          ]
        }
      ]
    }).then(function (notification) {
      if (notification) {
        var post;
        if (!notification.AcActivities[0].Post && notification.AcActivities[0].Point.Post) {
          post = notification.AcActivities[0].Point.Post;
        } else if (notification.AcActivities[0].Post) {
          post = notification.AcActivities[0].Post;
        }
        if (post && notification.AcActivities[0].Point) {
          items.push({
            domain_id: notification.AcActivities[0].domain_id,
            Domain: notification.AcActivities[0].Domain,
            community_id: notification.AcActivities[0].community_id,
            Community: notification.AcActivities[0].Community,
            group_id: notification.AcActivities[0].group_id,
            Group: notification.AcActivities[0].Group,
            post_id: post.id,
            Post: post,
            point_id: notification.AcActivities[0].point_id,
            Point: notification.AcActivities[0].Point,
            User: notification.AcActivities[0].User,
            created_at: notification.AcActivities[0].created_at
          });
          /*console.log("Type: "+notification.AcActivities[0].type);
           console.log("Post name: "+post.name);
           console.log("Point content: "+notification.AcActivities[0].Point.content);
           console.log("Domain name: "+notification.AcActivities[0].Domain.name);
           console.log("User name: "+notification.AcActivities[0].User.name);*/
          seriesCallback();
        } else {
          console.log("can't find post");
          seriesCallback()
        }
      } else {
        console.error("No notification");
        seriesCallback();
      }
    }).catch(function (error) {
      seriesCallback(error);
    });
  }, function (error) {

    var domains = _.groupBy(items, 'domain_id');
    _.forEach(domains, function (domainCommunities, domain) {
      domain = domainCommunities[0].Domain;
      console.log(domain.name);

      var communities = _.groupBy(domainCommunities, 'community_id');
      _.forEach(communities, function (communityGroups, community) {
        community = communityGroups[0].Community;
        console.log(community.name);

        var groups = _.groupBy(communityGroups, 'group_id');
        _.forEach(groups, function (groupPosts, group) {
          group = groupPosts[0].Group;
          console.log(group.name);

          var posts = _.groupBy(groupPosts, 'post_id');
          _.forEach(posts, function (postPoints, post) {
            post = postPoints[0].Post;
            console.log(post.name);

            var points = _.groupBy(postPoints, 'point_id');
            _.forEach(points, function (pointsIn, point) {
              point = pointsIn[0].Point;
              console.log(point.content);
            });
            console.log("1");
          });
          console.log("2");
        });
        console.log("3");
      });
      console.log("4");
    });
    console.log("5");

    callback();
  });
};

var sendPointNewsStory = function (delayedNotification, callback) {
  console.log("sendPointNewsStory");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var sendPointComment = function (delayedNotification, callback) {
  console.log("sendPointComment");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var sendNotification = function (notification, callback) {
  switch(notification.type) {
    case "xnotification.post.new":
      sendPostNew(notification, callback);
      break;
    case "xnotification.post.endorsement":
      sendPostEndorsement(notification, callback);
      break;
    case "xnotification.point.new":
      sendPointNew(notification, callback);
      break;
    case "notification.point.quality":
      sendPointQuality(notification, callback);
      break;
    case "xnotification.point.newsStory":
      sendPointNewsStory(notification, callback);
      break;
    case "xnotification.point.comment":
      sendPointComment(notification, callback);
      break;
    default:
//      callback("Unknown notification type");
      callback();
  }
};

var getDelayedNotificationToProcess = function (frequency, callback) {
  var beforeDate;
  if (frequency==1) {
    console.log("Processing hourly");
    beforeDate = {name: "date", after: moment().add(-1, 'hours').toDate()};
  } else if (frequency==2) {
    console.log("Processing daily");
    beforeDate = { name:"date", after: moment().add(-1, 'days').toDate() };
  } else if (frequency==3) {
    console.log("Processing weekly");
    beforeDate = { name:"date", after: moment().add(-7, 'days').toDate() };
  } else if (frequency==4) {
    console.log("Processing monthly");
    beforeDate = { name:"date", after: moment().add(-1, 'months').toDate() };
  }

  if (beforeDate) {
    models.AcDelayedNotification.findAll({
      where: {
        frequency: frequency,
        delivered: false,
        created_at: {
          $lt: beforeDate
        }
      },
      include: [
        {
          model: models.User,
          required: true
        },
        {
          model: models.AcNotification, as: 'AcNotifications',
          attributes: ['id'],
          required: true
        }
      ]
    }).then(function (delayedNotifications) {
      async.forEach(delayedNotifications, function (delayedNotification, seriesCallback) {
        sendNotification(delayedNotification, seriesCallback);
      }, function (error) {
        callback(error);
      });
    }).catch(function (error) {
      callback(error);
    });
  } else {
    callback("Unknown frequency state");
  }
};

async.eachSeries([1,2,3,4], function (frequency, seriesCallback) {
  getDelayedNotificationToProcess(frequency, seriesCallback);
});
