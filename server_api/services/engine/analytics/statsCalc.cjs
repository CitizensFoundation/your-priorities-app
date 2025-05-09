const models = require("../../../models/index.cjs");
const log = require('../../utils/logger.cjs');
const moment = require('moment');
const _ = require('lodash');

const getPointDomainIncludes = (id) => {
  return [
    {
      model: models.Post,
      required: true,
      attributes: [],
      include: getDomainIncludes(id)
    }
  ]
};

const getDomainIncludes = (id) => {
  return [
    {
      model: models.Group,
      required: true,
      attributes: [],
      include: [
        {
          model: models.Community,
          required: true,
          attributes: [],
          include: [
            {
              model: models.Domain,
              where: { id: id },
              required: true,
              attributes: []
            }
          ]
        }
      ]
    }
  ]
};

const getPointCommunityIncludes = (id) => {
  return [
    {
      model: models.Post,
      required: true,
      attributes: [],
      include: getCommunityIncludes(id)
    }
  ]
};

const getCommunityIncludes = (id) => {
  return [
    {
      model: models.Group,
      required: true,
      attributes: [],
      include: [
        {
          model: models.Community,
          where: { id: id },
          required: true,
          attributes: []
        }
      ]
    }
  ]
};

const getPointGroupIncludes = (id) => {
  return [
    {
      model: models.Post,
      required: true,
      attributes: [],
      include: getGroupIncludes(id)
    }
  ]
};

const getGroupIncludes = (id) => {
  return [
    {
      model: models.Group,
      required: true,
      where: { id: id },
      attributes: []
    }
  ]
};

const countModelRowsByTimePeriod = (req, cacheKey, model, whereOptions, includeOptions, done) => {
  const redisKey = "cachev4:"+cacheKey;
  req.redisClient.get(redisKey).then(results => {
    if (results) {
      done(null, results);
    } else {
      model.findAll({
        where: whereOptions,
        include: includeOptions,
        attributes: ['created_at'],
        order: [['created_at', 'ASC']]
      }).then((results) => {
        if (results && results.length>0) {const startDate = moment(results[0].created_at);
          const endDate = moment(results[results.length - 1].created_at);

          const days = _.groupBy(results, function (item) {
            return moment(item.created_at).format("YYYY/MM/DD");
          });

          const months = _.groupBy(results, function (item) {
            return moment(item.created_at).format("YYYY/MM");
          });

          const years = _.groupBy(results, function (item) {
            return moment(item.created_at).format("YYYY");
          });

          const totalDaysCount = endDate.diff(startDate, 'days', false) + 2;
          let currentDate = moment(results[0].created_at);
          let finalDays = [];
          for (let i = 0; i < totalDaysCount; i++) {
            const currentDateText = currentDate.format("YYYY/MM/DD");
            if (days[currentDateText]) {
              finalDays.push({x: currentDate.format("YYYY-MM-DD"), y: days[currentDateText].length})
            } else {
              //    finalDays.push({ x: currentDate.format("YYYY-MM-DD"), y: 0})
            }
            currentDate = currentDate.add(1, "days");
          }

          const totalMonthsCount = endDate.diff(startDate, 'months', false) + 2;
          let currentMonth = moment(results[0].created_at);
          let finalMonths = [];
          for (let i = 0; i < totalMonthsCount; i++) {
            const currentMonthText = currentMonth.format("YYYY/MM");
            if (months[currentMonthText]) {
              finalMonths.push({x: currentMonth.format("YYYY-MM"), y: months[currentMonthText].length})
            } else {
              //    finalMonths.push({ x: currentMonth.format("YYYY-MM"), y: 0})
            }
            currentMonth = currentMonth.add(1, "months");
          }

          const totalYearsCount = endDate.diff(startDate, 'years', false) + 2;
          let currentYear = moment(results[0].created_at);
          let finalYears = [];
          for (let i = 0; i < totalYearsCount; i++) {
            const currentYearText = currentYear.format("YYYY");
            if (years[currentYearText]) {
              finalYears.push({x: currentYearText, y: years[currentYearText].length})
            } else {
//        finalYears.push({ x: currentYearText, y: 0})
            }
            currentYear = currentYear.add(1, "years");
          }

          const finalResults = {finalDays, finalMonths, finalYears};
          req.redisClient.setEx(redisKey, process.env.STATS_CACHE_TTL ? parseInt(process.env.STATS_CACHE_TTL) : 5 * 60, JSON.stringify(finalResults));
          done(null, finalResults);
        } else {
          done(null, {});
        }
      }).catch((error) => {
        done(error);
      });
    }
  }).catch((error) => {
    if (error) {
      log.error('Could not get stats from redis', {
        err: error,
        context: 'countModelRowsByTimePeriod',
        userId: req.user ? req.user.id : null
      });
    }
    done(error);
  });
};

/*
countModelRowsByTimePeriod(models.AcActivity, {
  type: {
    $in: [
      "activity.user.login"
    ]
  },
  domain_id: 1
},[], (results) => {
  var a = results;
});

*/

module.exports = {
  getPointDomainIncludes,
  getDomainIncludes,
  getPointCommunityIncludes,
  getCommunityIncludes,
  getPointGroupIncludes,
  getGroupIncludes,
  countModelRowsByTimePeriod
};
