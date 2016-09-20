var models = require('../models');
var async = require('async');
var ip = require('ip');

var ssn = process.argv[2];

models.Point.findAll({
  include: [
    models.PointRevision
  ]
}).then(function (points) {
  console.log("Points count "+points.length);
  var counter = 0;
  async.eachSeries(points, function (point, callback) {
    if (point.user_id != point.PointRevisions[0].user_id) {
      console.log("Not matching for post_id "+point.post_id+" Revision count "+point.PointRevisions.length+" date"+point.created_at);
      counter+=1;
      point.user_id = point.PointRevisions[0].user_id;
      point.save().then(function () {
        callback();
      });
    } else {
      callback();
    }
  }, function () {
    console.log("Done, counted "+counter);
    process.exit();
  });
});
