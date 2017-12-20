var models = require('../models');
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
  outFileContent += "group id, post id, author id, title, text, up votes, down votes\n";
  postCounter = 0;
  async.eachSeries(posts, function (post, seriesCallback) {
    postCounter += 1;
    if (!post.deleted) {
      outFileContent += post.group_id+','+post.id+',"'+post.user_id+'","'+clean(post.name)+'","'+clean(post.description)+'",'+post.counter_endorsements_up+','+post.counter_endorsements_down+'\n';
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
