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

var getType = function (value) {
  if (value>0) {
    return "for";
  } else if (value<0) {
    return "against"
  } else {
    return "comment/news"
  }
};

models.Endorsement.findAll({
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
}).then(function (endorsements) {
  var outFileContent = "";
  console.log(endorsements.length);
  outFileContent += "Post endorsements for Community Id: "+communityId+"\n";
  outFileContent += "User Id, External User Id, State, Group Id, Post Id, Vote Value\n";
  async.eachSeries(endorsements, function (endorsement, seriesCallback) {
    var externalUserId='', state='';
    if (endorsement.User.profile_data) {
      if (endorsement.User.profile_data.trackingParameters && endorsement.User.profile_data.trackingParameters.externalUserId) {
        externalUserId = endorsement.User.profile_data.trackingParameters.externalUserId;
      }
      if (endorsement.User.profile_data.trackingParameters && endorsement.User.profile_data.trackingParameters.state) {
        state = endorsement.User.profile_data.trackingParameters.state;
      }
    }
    outFileContent += endorsement.User.id+','+externalUserId+','+state+','+endorsement.Post.group_id+','+endorsement.post_id+','+getType(endorsement.value)+'\n';
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
