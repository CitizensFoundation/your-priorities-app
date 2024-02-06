var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var fs = require('fs');

var communityId = process.argv[2];
var outFile = process.argv[3];

var clean = function (text) {
  //console.log("Before: "+ text);
    if (text) {
        var newText = text.replace('"',"'").replace('\n','').replace('\r','').replace(/(\r\n|\n|\r)/gm,"").replace(/"/gm,"'").replace(',',';').trim();
        //console.log("After:" + newText);
        return newText.replace(/´/g,'');
    } else {
      return "empty";
    }
};

var getPointType = function (value) {
  if (value>0) {
    return "for";
  } else if (value<0) {
    return "against"
  } else {
    return "comment/news"
  }
};

models.Point.findAll({
  order: [
    ['created_at', 'asc' ]
  ],
  include: [
      models.User,
      {
        model: models.Post,
          include: [
              {
                  model: models.Group,
                  include: [
                      {
                          model: models.Community,
                          where: {
                              id: communityId
                          }
                      }
                  ]
              }
          ]
      }
  ]
}).then(function (points) {
  var outFileContent = "";
  console.log(points.length);
  outFileContent += "group id,post id,point id,point type,author id,text,helpful votes,unhelpful votes,external user id,state\n";
  pointCounter = 0;
  async.eachSeries(points, function (point, seriesCallback) {
    pointCounter += 1;
    if (!point.deleted) {
      var externalUserId='', state='';
      if (point.User.profile_data) {
        if (point.User.profile_data.trackingParameters && point.User.profile_data.trackingParameters.externalUserId) {
          externalUserId = point.User.profile_data.trackingParameters.externalUserId;
        }
        if (point.User.profile_data.trackingParameters && point.User.profile_data.trackingParameters.state) {
          state = point.User.profile_data.trackingParameters.state;
        }
      }
      outFileContent += point.Post.group_id+','+point.Post.id+',"'+point.id+'","'+getPointType(point.value)+'","'+point.user_id+'","'+clean(point.content)+'",'+point.counter_quality_up+','+point.counter_quality_down+','+externalUserId+','+state+'\n';
    }
    seriesCallback();
  }, function (error) {
    fs.writeFile(outFile, outFileContent, function(err) {
      if(err) {
        console.log(err);
      }
      console.log("The file was saved!");
      process.exit();
    });
  });
});
