var models = require('../../models/index.cjs');
var async = require('async');
var _ = require('lodash');

var communityId = process.argv[2];
var groupId = process.argv[3];

var endorsementsToAnalyse;
var csvOut = "Method,E Id,E Value,Date,Browser Id,Fingerprint Id,IP Address,User Id,User Email,Post Id,Post Name,User Agent\n";

var writeItemToCsv = function (item) {
  let browserId = "";
  let browserFingerprint = "";

  if (item.data) {
    browserId = item.data.browserId;
    browserFingerprint = item.data.browserFingerprint;
  }

  return ","+item.id+","+item.value+","+item.created_at+
    ","+browserId+","+browserFingerprint+
    ","+item.ip_address+","+item.user_id+","+item.User.email+","+
    item.post_id+',"'+item.Post.name+'","'+item.user_agent+'"\n';
};

var writeItemsToCsv = function (header, items) {
  csvOut += '"'+header+'",,,,,,\n';
  _.forEach(items, function (item) {
    csvOut += '"'+item.key+' ('+item.count+")"+'",,,,,,\n';
    _.forEach(item.items, function (innerItem) {
      csvOut += writeItemToCsv(innerItem);
    });
  });
};

var getTopItems = function (items, max) {
  if (!max) max = 25;
  var topItems = [];
  _.each(items, function (items, key) {
    topItems.push({key: key, count: items.length, items: items });
  });
  topItems = _.sortBy(topItems, function (item) {
    return -item.count;
  });

  if (max===-1) {
    let out = [];
    _.each(topItems, function (item) {
      if (item.count>1) {
        out.push(item);
      }
    });
    return out;
  } else if (max===-2) {
    let out = [];
    _.each(topItems, function (item) {
      if (item.count>10) {
        out.push(item);
      }
    });
    return out;
  } else {
    return _.take(topItems, max);
  }
};

async.series([
  // Get all Community Endorsements
  function (seriesCallback) {
    if (communityId && !groupId) {
      models.Endorsement.findAll({
        attributes: ["id","created_at","value","post_id","user_id","user_agent","ip_address","data"],
        include: [
          {
            model: models.User,
            attributes: ['id','name','email'],
          },
          {
            model: models.Post,
            attributes: ['id','name','group_id'],
            include: [
              {
                model: models.Group,
                attributes: ['id','name'],
                include: [
                  {
                    model: models.Community,
                    attributes: ['id','name'],
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
        endorsementsToAnalyse = endorsements;
        endorsementsToAnalyse = _.sortBy(endorsementsToAnalyse, function (item) {
          return [item.post_id, item.user_agent];
        });
        seriesCallback();
      })

    } else {
      seriesCallback();
    }
  },
  // Get all Group Endorsements
  function (seriesCallback) {
    if (groupId) {
      models.Endorsement.findAll({
        attributes: ["id","post_id","value","user_id","user_agent","ip_address","data"],
        include: [
          {
            model: models.User,
            attributes: ['id','name','email'],
          },
          {
            model: models.Post,
            attributes: ['id','name','group_id'],
            include: [
              {
                model: models.Group,
                where: {
                  id: groupId
                }
              }
            ]
          }
        ]
      }).then(function (endorsements) {
        endorsementsToAnalyse = endorsements;
        seriesCallback();
      })

    } else {
      seriesCallback();
    }
  },
  // Top 10 IPs Unique User Agents + Post Ids
  function (seriesCallback) {
    var groupedByIPs = _.groupBy(endorsementsToAnalyse, function (endorsement) {
      return endorsement.ip_address+":"+endorsement.post_id+":"+endorsement.user_agent;
    });
    writeItemsToCsv("Top votes from IP, User agent, Post Id", getTopItems(groupedByIPs, -1));
    seriesCallback();
  },
  // Top 10 IPs
  function (seriesCallback) {
    var groupedByIPs = _.groupBy(endorsementsToAnalyse, function (endorsement) {
      return endorsement.ip_address;
    });
    writeItemsToCsv("Top votes from IPs", getTopItems(groupedByIPs, -2));
    seriesCallback();
  },
  // Top 10 IPs Unique User Agents
  /*function (seriesCallback) {
    var groupedByIPs = _.groupBy(endorsementsToAnalyse, function (endorsement) {
      return endorsement.ip_address+":"+endorsement.user_agent;
    });
    writeItemsToCsv("Top votes from IP & User agent", getTopItems(groupedByIPs));
    seriesCallback();
  },
  // Top 10 IPs Unique User Agents + User Ids
  function (seriesCallback) {
    var groupedByIPs = _.groupBy(endorsementsToAnalyse, function (endorsement) {
      return endorsement.ip_address+":"+endorsement.user_id+":"+endorsement.user_agent;
    });
    writeItemsToCsv("Top votes from IP User agent & User Id", getTopItems(groupedByIPs));
    seriesCallback();
  },
  // Top 10 IPs Unique User Agents + User Ids + Post Ids
  function (seriesCallback) {
    var groupedByIPs = _.groupBy(endorsementsToAnalyse, function (endorsement) {
      return endorsement.ip_address+":"+endorsement.user_id+":"+endorsement.post_id+":"+endorsement.user_agent;
    });
    writeItemsToCsv("Top votes from IP, User agent, User Id, Post Id", getTopItems(groupedByIPs));
    seriesCallback();
  }*/
], function (error) {
    if (error) {
      log.error(error);
    }
    log.info(csvOut);
    process.exit();
});


