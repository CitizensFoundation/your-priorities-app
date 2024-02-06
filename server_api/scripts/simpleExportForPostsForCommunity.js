var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var fs = require('fs');

var communityId = process.argv[2];
var outFile = process.argv[3];

var clean = function (text) {
  //console.log("Before: "+ text);
  var newText = text.replace('"',"'").replace('\n','').replace('\r','').replace(/(\r\n|\n|\r)/gm,"").replace(/"/gm,"'").replace(',',';').trim();
  //console.log("After:" + newText);
  return newText.replace(/´/g,'');
};

models.Post.findAll({
  order: [
    ['created_at', 'asc' ]
  ],
  include: [
    models.User,
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
}).then(function (posts) {
  var outFileContent = "";
  console.log(posts.length);
  outFileContent += "group id,post id,author id,title,text,up votes,down votes,external user id,state\n";
  postCounter = 0;
  async.eachSeries(posts, function (post, seriesCallback) {
    postCounter += 1;
    if (!post.deleted) {
      var externalUserId='', state='';
      if (post.User.profile_data) {
        if (post.User.profile_data.trackingParameters && post.User.profile_data.trackingParameters.externalUserId) {
          externalUserId = post.User.profile_data.trackingParameters.externalUserId;
        }
        if (post.User.profile_data.trackingParameters && post.User.profile_data.trackingParameters.state) {
          state = post.User.profile_data.trackingParameters.state;
        }
      }
      outFileContent += post.group_id+','+post.id+',"'+post.user_id+'","'+clean(post.name)+'","'+clean(post.description)+'",'+post.counter_endorsements_up+','+post.counter_endorsements_down+','+externalUserId+','+state+'\n';
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
