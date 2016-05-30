var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');

var groupId = process.argv[2];

var clean = function (text) {
  return text.replace('"',"'").replace('\n','').replace('\r','').trim();
};

var getLocation = function (post) {
  if (post.location && post.location.latitude && post.location.longitude &&
    post.location.latitude!="" && post.location.longitude!="") {
    return post.location.latitude+','+post.location.longitude;
  } else {
    return '"",""'
  }
};

var getPoints = function (points) {
  return _.map(points, function (point) {
    return clean(point.content)+"\n\n"
  })
};

var getPointsUpOrDown = function (post, value) {
  var pointsText = '"';
  var pointsUp = _.filter(post.Points, function (point) {
    if (value>0) {
      return point.value > 0;
    } else {
      return point.value < 0;
    }
  });
  pointsText += getPoints(pointsUp) + '"';
  return pointsText;
};

var getPointsUp = function (post) {
  return getPointsUpOrDown(post, 1);
};

var getPointsDown = function (post) {
  return getPointsUpOrDown(post, -1);
};

var getNewFromUsers = function (post) {
  return "";
};

var getImages = function (post) {
  return "";
};

models.Post.findAll({
  where: {
    group_id: groupId
  },
  include: [
    {
      model: models.Category,
      required: false
    },
    {
      model: models.PostRevision,
      required: false
    },
    {
      model: models.Point,
      attributes: ['id','content','value'],
      required: false
    },
    { model: models.Image,
      as: 'PostHeaderImages',
      required: false
    },
    {
      model: models.User,
      required: true
    },
    {
      model: models.Image,
      as: 'PostUserImages',
      required: false,
      where: {
        deleted: false
      }
    }
  ]
}).then(function (posts) {
  console.log(posts.length);
  console.log("email,Name,Description,Latitude,Longitude,Up Votes,Down Votes,Points Count,Points For,Points Against,Images,News from Users");
  async.eachSeries(posts, function (post, seriesCallback) {
    console.log('"'+post.User.email+'","'+clean(post.name)+'","'+clean(post.description)+'",'+
                getLocation(post)+','+post.counter_endorsements_up+','+post.counter_endorsements_down+
                ','+post.counter_points+','+getPointsUp(post)+','+getPointsDown(post)+','+
                getImages(post)+','+getNewFromUsers(post));
    seriesCallback();
  }, function (error) {
    process.exit();
  });
});
