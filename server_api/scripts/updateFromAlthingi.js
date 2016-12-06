var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var http = require('http');
var parseString = require('xml2js').parseString;
var concat = require('concat-stream');

var SESSION_ID = process.argv[2]; // 146;
var DOMAIN_ID = process.argv[3]; // 2
var CRAWLER_USER_ID = process.argv[4]; // 29887
var groupsConfigString = process.argv[5]; // "1=911:2=908:3=905:4=910:5=912:6=907:7=903:8=902:9=904:10=909:11=906"; //

var createActivityEnabled = process.argv[6] && process.argv[6]=="activityEnabled";

var baseIssueListURL = "http://www.althingi.is/altext/xml/thingmalalisti/?lthing=";
var baseIssueURL = "http://www.althingi.is/altext/xml/thingmalalisti/thingmal/?lthing=";

var USER_AGENT =  'Betra Ísland - Kæra Alþingi - Íbúar ses';

var lawTopCategories = {
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
    'User-Agent': USER_AGENT
  };
  http.get(opts, function(res) {
    res.setEncoding('utf8');

    res.pipe(concat(function(data) {
      parseString(data, function (err, result) {
        callback(null, JSON.parse(JSON.stringify(result)));
      });
    }))
  });
};

var getIssueList = function (callback) {
  getJsonFromXml(baseIssueListURL+SESSION_ID, function (error, jsonResults) {
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

var setPostOfficialStatus = function(post, dbIssue) {
  if (dbIssue.issueStatus) {
    if (dbIssue.issueStatus.indexOf("Samþykkt") > -1) {
      post.set('official_status', 2);
    } else if (dbIssue.issueStatus.indexOf("Fellt") > -1) {
      post.set('official_status', -2);
    } else {
      post.set('official_status', -1);
    }
  }
};

var addPost = function(dbIssue, userId, groupImageId, domain, callback) {
  var post = models.Post.build({
    name: dbIssue.name,
    description: dbIssue.description,
    group_id: dbIssue.groupId,
    cover_media_type: groupImageId ? 'image' : 'none',
    user_id: userId,
    status: 'published',
    counter_endorsements_up: 0,
    content_type: models.Post.CONTENT_IDEA,
    user_agent: USER_AGENT,
    ip_address: '127.0.0.1'
  });

  post.set('data', dbIssue);

  setPostOfficialStatus(post, dbIssue);

  post.save().then(function(post) {
    async.series([
      function (seriesCallback) {
        models.PostRevision.build({
          name: post.name,
          description: post.description,
          group_id: post.group_id,
          user_id: userId,
          this_id: post.id,
          status: post.status,
          user_agent: post.user_agent,
          ip_address: post.ip_address
        }).save().then(function () {
          post.updateAllExternalCounters({ypDomain: domain}, 'up', 'counter_posts', function () {
            seriesCallback();
          })
        }).catch(function (error) {
          seriesCallback(error);
        });
      },
      function (seriesCallback) {
        if (createActivityEnabled) {
          models.AcActivity.createActivity({
            type: 'activity.post.new',
            userId: post.user_id,
            domainId: domain.id,
            groupId: post.group_id,
//                communityId: req.ypCommunity ?  req.ypCommunity.id : null,
            postId : post.id,
            access: models.AcActivity.ACCESS_PUBLIC
          }, function (error) {
            seriesCallback(error);
          });
        } else {
          seriesCallback();
        }
      },
      function (seriesCallback) {
        if (groupImageId) {
          models.Image.find({
            where: {id: groupImageId}
          }).then(function (image) {
            if (image) {
              post.addPostHeaderImage(image).then(function (error) {
                seriesCallback();
              });
            } else {
              seriesCallback();
            }
          });
        } else {
          seriesCallback();
        }
      }
    ], function (error) {
      callback(error);
    });
  }).catch(function(error) {
    callback(error);
  });
};

var saveIssueIfNeeded = function (dbIssue, userId, callback) {
  models.Post.find({ where: {
    $and: [
      {
        "data.sessionId": SESSION_ID
      },
      {
        "data.issueId": dbIssue.issueId
      }
    ]
  }
}).then(function (post) {
  if (!post) {
    models.Domain.find({
      where: {
        id: DOMAIN_ID
      }
    }).then(function (domain) {
      models.Group.find({
        where: {
          id: dbIssue.groupId
        }
      }).then(function (group) {
        if (group) {
          var defaultImageId = null;
          if (group.configuration.defaultDataImageId) {
            defaultImageId = group.configuration.defaultDataImageId;
          }
          addPost(dbIssue, userId, defaultImageId, domain, callback);
        } else {
          console.error("Cant find group id: "+dbIssue.groupId);
          callback('Cant find group');
        }
      });
    });
  } else {
    console.log("Already saved issue id: "+dbIssue.issueId);
    if (post.data.issueStatus!=dbIssue.issueStatus) {
      post.set('data.issueStatus', dbIssue.issueStatus);
      setPostOfficialStatus(post, dbIssue);
      post.save().then(function (post) {
        callback();
      });
    } else {
      callback();
    }
  }
  }).catch(function (error) {
    callback(error);
  });
};

var getIssueStatusFromVotes = function(votingSessions) {
  if (!votingSessions || (votingSessions.length==0 || votingSessions[0]=="")) {
    return "Lagt fram";
  } else {
    var statusValue = "";
    if (votingSessions[0]['atkvæðagreiðsla'] && votingSessions[0]['atkvæðagreiðsla'].length>0) {
      _.each(votingSessions[0]['atkvæðagreiðsla'], function (votingSession) {
        var tegund = votingSession['tegund'][0];
        if (tegund=="Till.") {
          var resolution = votingSession['samantekt'][0]['afgreiðsla'][0];
          if (resolution=="samþykkt") {
            statusValue = "Samþykkt";
          } else {
            statusValue = "Fellt";
          }
        }
      }) ;
    } else {
      statusValue = "Í ferli";
    }
  }
  return statusValue;
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
        var dbIssue = { dataType: 'lawIssue', sessionId: SESSION_ID, issueId: issue.$['málsnúmer'], name: capitalize(issue['málsheiti'][0]),
                        externalHtmlLink: issue['html'][0], xmlLink: issue['xml'][0], issueType: issue['málstegund'][0]['heiti'][0] };
        if (error) {
          console.error(error);
          callback(error);
        } else {
          var topCategory, subCategory;
          if (issueDetail['þingmál']['efnisflokkar'][0]['yfirflokkur'] && issueDetail['þingmál']['efnisflokkar'][0]['yfirflokkur'][1]) {
            topCategory = issueDetail['þingmál']['efnisflokkar'][0]['yfirflokkur'][1]['heiti'][0];
            subCategory = issueDetail['þingmál']['efnisflokkar'][0]['yfirflokkur'][1]['efnisflokkur'][0]['heiti'][0]
          } else if (issueDetail['þingmál']['efnisflokkar'][0]['yfirflokkur']) {
            topCategory = issueDetail['þingmál']['efnisflokkar'][0]['yfirflokkur'][0]['heiti'][0];
            subCategory = issueDetail['þingmál']['efnisflokkar'][0]['yfirflokkur'][0]['efnisflokkur'][0]['heiti'][0]
          } else if (SESSION_ID==146 && (dbIssue.issueId == 1 || dbIssue.issueId == 2)) {
            topCategory = "Hagstjórn";
            subCategory = "Fjárreiður ríkisins";
          }

          if (topCategory) {
            var issueStatus = null;

            if (issueDetail['þingmál']['mál'][0]['staðamáls']) {
              issueStatus = issueDetail['þingmál']['mál'][0]['staðamáls'][0];
            }

            if (!issueStatus) {
              issueStatus = getIssueStatusFromVotes(issueDetail['þingmál']['atkvæðagreiðslur']);
            }

            dbIssue = _.merge(dbIssue, { topCategory: topCategory,subCategory: subCategory, issueStatus: issueStatus });
            dbIssue = _.merge(dbIssue, { topCategoryId: lawTopCategories[dbIssue.topCategory] });

            var description = capitalize(dbIssue.issueType)+". "+dbIssue.name+". "+dbIssue.topCategory+". "+dbIssue.subCategory+
              ". Málið á Alþingi: "+dbIssue.externalHtmlLink;

            dbIssue = _.merge(dbIssue, { groupId: topCategoryIdToGroup[dbIssue.topCategoryId], description: description});
            if (capitalize(dbIssue.issueType).indexOf("Fyrirspurn") > -1 || capitalize(dbIssue.issueType).indexOf("Beiðni um skýrslu") > -1) {
              console.log("Not doing questions or reports for now for "+dbIssue.issueId);
              callback()
            } else {
              saveIssueIfNeeded(dbIssue, CRAWLER_USER_ID, callback);
            }
          } else {
            console.error("No topCategory");
            callback();
          }
        }
      });

    }, function (error) {
      if (error)
        console.error(error);
      process.exit();
    });
  }
});
