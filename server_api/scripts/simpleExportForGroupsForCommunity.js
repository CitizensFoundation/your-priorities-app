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

models.Group.findAll({
  order: [
    ['created_at', 'asc' ]
  ],
    include: [
        {
          model: models.Community,
          where: {
            id: communityId
          }
        }
  ]
}).then(function (groups) {
  var outFileContent = "";
  console.log(groups.length);
  outFileContent += "group id, author id, title, text\n";
  groupCounter = 0;
  async.eachSeries(groups, function (group, seriesCallback) {
    groupCounter += 1;
    if (!group.deleted) {
      outFileContent += group.id+',"'+group.user_id+'","'+clean(group.name)+'","'+clean(group.objectives)+'"\n';
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
