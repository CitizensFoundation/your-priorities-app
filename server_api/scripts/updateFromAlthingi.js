var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var http = require('http');
var parseString = require('xml2js').parseString;
var concat = require('concat-stream');

var althingiSessionId = 145; //process.argv[2];
var groupsConfigString = "1=23:2=24:3=25:4=26:5=27:6=28:7=29:8=29:9=30:10=31:11=32"; process.argv[3];
var baseIssueListURL = "http://www.althingi.is/altext/xml/thingmalalisti/?lthing=";
var baseIssueURL = "http://www.althingi.is/altext/xml/thingmalalisti/thingmal/?lthing=";


var althingiTopCategories = {
  'Atvinnuvegir': 1,
  'Erlend samskipti': 2,
  'Hagstjórn': 3,
  'Heilsa og heilbrigði': 4,
  'Lög og réttur': 5,
  'Mennta- og menningarmál': 6,
  'Samfélagsmál': 7,
  'Samgöngumál': 8,
  'Stjórnarskipan og stjórnsýsla': 9,
  'Trúmál og kirkja': 10,
  'Umhverfismál': 11
};

var getJsonFromXml = function(url, callback) {
  var opts = require('url').parse(url);
  opts.headers = {
    'User-Agent': 'Betra Ísland - Kæra Alþingi - Íbúar ses kt. 601210-1260'
  };
  http.get(opts, function(res) {
    res.setEncoding('utf8');

    res.pipe(concat(function(data) {
      console.log(data.length);
      console.log(data);
      parseString(data, function (err, result) {
        callback(null, JSON.parse(JSON.stringify(result)));
      });
    }))
  });
};

var getIssueList = function (callback) {
  getJsonFromXml(baseIssueListURL+althingiSessionId, function (error, jsonResults) {
    callback(error, jsonResults);
  });
};

var topCategoryIdToGroup = {};

var capitalize = function (string){
  string = string || '';
  string = string.trim();

  if (string[0]) {
    string = string[0].toUpperCase() + string.substr(1).toLowerCase()
  }

  return string
};

groupsConfigString.split(":").forEach(function (pair) {
  var splitPair = pair.split("=");
  topCategoryIdToGroup[splitPair[0]]=splitPair[1];
});

getIssueList(function (error, issueList) {
  if (error) {
    console.error(error);
    process.exit();
  } else {
    var issues = [];
    async.eachSeries(issueList['málaskrá']['mál'], function (issue, callback) {
      getJsonFromXml(issue['xml'][0], function (error, issueDetail) {
        var dbIssue = { althingiSessionId: althingiSessionId, id: issue.$['málsnúmer'], name: capitalize(issue['málsheiti'][0]),
                        externalHtmlLink: issue['html'][0], xmlLink: issue['xml'][0], issueType: issue['málstegund'][0]['heiti'][0] };
        if (error) {
          console.error(error);
          callback(error);
        } else {
          var a = issueDetail;
          dbIssue = _.merge(dbIssue, {
                              topCategory: issueDetail['þingmál']['efnisflokkar'][0]['yfirflokkur'][0]['heiti'][0],
                              subCategory: issueDetail['þingmál']['efnisflokkar'][0]['yfirflokkur'][0]['efnisflokkur'][0]['heiti'][0] });
          dbIssue = _.merge(dbIssue, { topCategoryId: althingiTopCategories[dbIssue.topCategory] });

          var description = dbIssue.name+". "+dbIssue.issueType+". "+dbIssue.topCategory+". "+dbIssue.subCategory+
                            ". Málið á Alþingi: "+dbIssue.externalHtmlLink;

          dbIssue = _.merge(dbIssue, { groupId: topCategoryIdToGroup[dbIssue.topCategoryId], description: description});
          issues.push(dbIssue);
          callback();
        }
      });

    }, function (error) {
      if (error)
        console.error(error);
      process.exit();
    });
  }
});
