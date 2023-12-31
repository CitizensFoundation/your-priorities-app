"use strict";
var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var communityId = process.argv[2];
var groupId = process.argv[3];
var ratingsToAnalyse;
var csvOut = "";
var writeItemToCsv = function (item) {
    return "," + item.id + "," + item.post_id + "," + item.created_at + "," + item.ip_address + "," + item.user_id + "," + item.User.email + "," + item.post_id + ',"' + item.user_agent + '"\n';
};
var writeItemsToCsv = function (header, items) {
    csvOut += '"' + header + '",,,,,,,,,\n';
    _.forEach(items, function (item) {
        csvOut += '"' + item.key + '(' + item.count + ")" + '",,,,,,,,,\n';
        _.forEach(item.items, function (innerItem) {
            csvOut += writeItemToCsv(innerItem);
        });
    });
};
var getTopItems = function (items) {
    var topItems = [];
    _.each(items, function (items, key) {
        topItems.push({ key: key, count: items.length, items: items });
    });
    topItems = _.sortBy(topItems, function (item) {
        return -item.count;
    });
    return _.take(topItems, 25);
};
async.series([
    // Get all Community Endorsements
    function (seriesCallback) {
        if (communityId && !groupId) {
            models.Rating.findAll({
                attributes: ["id", "created_at", "post_id", "user_id", "email", "user_agent", "ip_address"],
                include: [
                    {
                        model: models.User,
                        attributes: ['id', 'email']
                    },
                    {
                        model: models.Post,
                        attributes: ['id', 'group_id'],
                        include: [
                            {
                                model: models.Group,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: models.Community,
                                        attributes: ['id'],
                                        where: {
                                            id: communityId
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }).then(function (ratings) {
                ratingsToAnalyse = ratings;
                seriesCallback();
            });
        }
        else {
            seriesCallback();
        }
    },
    // Get all Group Endorsements
    function (seriesCallback) {
        if (groupId) {
            models.Rating.findAll({
                attributes: ["id", "created_at", "post_id", "user_id", "user_agent", "ip_address"],
                include: [
                    {
                        model: models.User,
                        attributes: ['id', 'email']
                    },
                    {
                        model: models.Post,
                        attributes: ['id', 'group_id'],
                        include: [
                            {
                                model: models.Group,
                                attributes: ['id'],
                                where: {
                                    id: groupId
                                }
                            }
                        ]
                    }
                ]
            }).then(function (ratings) {
                ratingsToAnalyse = ratings;
                seriesCallback();
            });
        }
        else {
            seriesCallback();
        }
    },
    // Top 10 IPs
    function (seriesCallback) {
        var groupedByIPs = _.groupBy(ratingsToAnalyse, function (rating) {
            return rating.ip_address;
        });
        writeItemsToCsv("Top votes from IPs", getTopItems(groupedByIPs));
        seriesCallback();
    },
    // Top 10 IPs Unique User Agents
    function (seriesCallback) {
        var groupedByIPs = _.groupBy(ratingsToAnalyse, function (rating) {
            return rating.ip_address + ":" + rating.user_agent;
        });
        writeItemsToCsv("Top votes from IP & User agent", getTopItems(groupedByIPs));
        seriesCallback();
    },
    /*// Top 10 IPs Unique User Agents + User Ids
    function (seriesCallback) {
      var groupedByIPs = _.groupBy(ratingsToAnalyse, function (rating) {
        return rating.ip_address+":"+rating.user_id+":"+rating.user_agent;
      });
      writeItemsToCsv("Top votes from IP User agent & User Id", getTopItems(groupedByIPs));
      seriesCallback();
    },
    // Top 10 IPs Unique User Agents + User Ids + Post Ids
    function (seriesCallback) {
      var groupedByIPs = _.groupBy(ratingsToAnalyse, function (rating) {
        return rating.ip_address+":"+rating.user_id+":"+rating.post_id+":"+rating.user_agent;
      });
      writeItemsToCsv("Top votes from IP, User agent, User Id, Post Id", getTopItems(groupedByIPs));
      seriesCallback();
    },
    // Top 10 IPs Unique User Agents + Post Ids
    function (seriesCallback) {
      var groupedByIPs = _.groupBy(ratingsToAnalyse, function (rating) {
        return rating.ip_address+":"+rating.post_id+":"+rating.user_agent;
      });
      writeItemsToCsv("Top votes from IP, User agent, Post Id", getTopItems(groupedByIPs));
      seriesCallback();
    }*/
], function (error) {
    if (error) {
        console.error(error);
    }
    console.log(csvOut);
    process.exit();
});
