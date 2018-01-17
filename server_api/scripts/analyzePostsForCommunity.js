var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var moment = require('moment');

var communityIdA = 699; // process.argv[2];
var communityIdB = 470; // process.argv[2];
var dateRangeAFrom = moment("01.09.2017","DD.MM.YYYY");
var dateRangeATo = moment("15.09.2017","DD.MM.YYYY");
var dateRangeBFrom = moment("12.05.2016","DD.MM.YYYY");
var dateRangeBTo = moment("26.05.2016","DD.MM.YYYY");

var getCsvLinesWithHeader = function (csv, headertext, items) {
  var days = _.groupBy(items, function (item) {
    return moment(item.created_at).format("DD/MM/YYYY");
  });
  var dayCounts = _.map(days, function (items) {
    return { date: moment(items[0].created_at).format("DD/MM/YYYY"), count: items.length }
  });
  var orderedCounts = _.orderBy(dayCounts, ['date'], ['asc']);
  var a = orderedCounts;
  var line1 = "";
  var line2 = "";
  _.forEach(orderedCounts, function (item, index) {
    line1 += '"'+item.date+'"';
    line2 += '"'+item.count+'"';
    if (index<orderedCounts.length-1) {
      line1 += ",";
      line2 += ",";
    } else {
      line1 += "\n";
      line2 += "\n";
    }
  });
  return headertext+"\n"+line1+line2;
};

var getNumberOfPosts = function (csv, headerText, communityId, dateRangeFrom, dateRangeTo, done) {
  models.Post.findAll({
    where: {
      created_at: {
        $between: [dateRangeFrom.toDate(), dateRangeTo.toDate()]
      }
    },
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
    done(getCsvLinesWithHeader(csv, headerText, posts));
  });
};

var getNumberOfPoints = function (csv, headerText, communityId, dateRangeFrom, dateRangeTo, done) {
  models.Point.findAll({
    where: {
      created_at: {
        $between: [dateRangeFrom.toDate(), dateRangeTo.toDate()]
      }
    },
    include: [
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
  }).then(function (posts) {
    done(getCsvLinesWithHeader(csv, headerText, posts));
  });
};

var getNumberOfEndorsement = function (csv, headerText, communityId, dateRangeFrom, dateRangeTo, done) {
  models.Endorsement.findAll({
    where: {
      created_at: {
        $between: [dateRangeFrom.toDate(), dateRangeTo.toDate()]
      }
    },
    include: [
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
  }).then(function (posts) {
    done(getCsvLinesWithHeader(csv, headerText, posts));
  });
};

var getNumberOfUsers = function (csv, headerText, communityId, dateRangeFrom, dateRangeTo, done) {
  models.Community.find({
    where: {
      id: communityId
    },
    include: [
      {
        model: models.User,
        as: 'CommunityUsers',
        where: {
          created_at: {
            $between: [dateRangeFrom.toDate(), dateRangeTo.toDate()]
          }
        }
      }
    ]
  }).then(function (community) {
    if (community) {
      done(getCsvLinesWithHeader(csv, headerText, community.CommunityUsers));
    } else {
      done(getCsvLinesWithHeader(csv, headerText, []));
    }
  });
};

var csv = "";
async.series([
  function (seriesCallback) {
    getNumberOfPoints("", "2016 points", communityIdB, dateRangeBFrom, dateRangeBTo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfPoints("", "2017 points", communityIdA, dateRangeAFrom, dateRangeATo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfPosts("", "2016 posts", communityIdB, dateRangeBFrom, dateRangeBTo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfPosts("", "2017 posts", communityIdA, dateRangeAFrom, dateRangeATo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfEndorsement("", "2016 idea votes", communityIdB, dateRangeBFrom, dateRangeBTo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfEndorsement("", "2017 idea votes", communityIdA, dateRangeAFrom, dateRangeATo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  }
], function () {
  console.log(csv);
  process.exit();
});
