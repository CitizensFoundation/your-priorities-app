var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');

var communityIdA = 973; // process.argv[2];
var communityIdB = 777; // process.argv[2];
var dateRangeAFrom = moment("20.03.2019","DD.MM.YYYY");
var dateRangeATo = moment("30.03.2019","DD.MM.YYYY");
var dateRangeBFrom = moment("27.02.2018","DD.MM.YYYY");
var dateRangeBTo = moment("09.03.2018","DD.MM.YYYY");

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
  models.Community.findOne({
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
    getNumberOfPoints("", "2018 points", communityIdB, dateRangeBFrom, dateRangeBTo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfPoints("", "2019 points", communityIdA, dateRangeAFrom, dateRangeATo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfPosts("", "2018 posts", communityIdB, dateRangeBFrom, dateRangeBTo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfPosts("", "2019 posts", communityIdA, dateRangeAFrom, dateRangeATo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfEndorsement("", "2018 idea votes", communityIdB, dateRangeBFrom, dateRangeBTo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  },
  function (seriesCallback) {
    getNumberOfEndorsement("", "2019 idea votes", communityIdA, dateRangeAFrom, dateRangeATo, function (csvIn) {
      csv += csvIn;
      seriesCallback();
    })
  }
], function () {
  log.info(csv);
  process.exit();
});
