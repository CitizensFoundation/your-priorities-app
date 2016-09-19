var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var moment = require('moment');

var allUsers = {};

var size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

models.Domain.find({where: {id: 1}}).then(function(domain) {
  domain.getDomainUsers().then(function (users) {
    console.log(users.length);
    users.map(function(user) {
      allUsers[user.email] = 1;
    });
    console.log(size(allUsers));
  });
});

var grouped = {};

models.Group.findAll({
  where: {
    community_id: 471 //process.argv[2]
  }
}).then(function (groups) {
  async.eachSeries(groups, function (group, seriesCallback) {
    models.Post.unscoped().findAll({
      where: {
        group_id: group.id //process.argv[2]
      }
    }).then(function (posts) {
      var postsJson = _.map(posts, function (post) {
        return post.toJSON();
      });
      var newGroupedBy = _.groupBy(postsJson, function(post) {
        return moment(post.created_at).format("DD/MM/YY");
      });
      _.each(newGroupedBy, function (posts, key) {
        if (grouped[key]) {
          grouped[key] += posts.length;
        } else {
          grouped[key] = posts.length;
        }
      });
      seriesCallback();
    })
  }, function (error) {
    var keys = [], k, i, len;

    for (k in grouped) {
      if (grouped.hasOwnProperty(k)) {
        keys.push(k);
      }
    }

    keys.sort();

    len = keys.length;

    for (i = 0; i < len; i++) {
      k = keys[i];
      console.log(k + ',' + grouped[k]);
    }
    process.exit();
  });
});


