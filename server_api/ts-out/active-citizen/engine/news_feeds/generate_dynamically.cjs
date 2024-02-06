"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models = require("../../../models/index.cjs");
var async = require('async');
var log = require('../../utils/logger.cjs');
var _ = require('lodash');
var getRecommendationFor = require('../recommendations/events_manager.cjs').getRecommendationFor;
var getProcessedRange = require('./news_feeds_utils.cjs').getProcessedRange;
var activitiesDefaultIncludes = require('./news_feeds_utils.cjs').activitiesDefaultIncludes;
var getCommonWhereOptions = require('./news_feeds_utils.cjs').getCommonWhereOptions;
var defaultKeyActivities = require('./news_feeds_utils.cjs').defaultKeyActivities;
var getActivityDate = require('./news_feeds_utils.cjs').getActivityDate;
var airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../../utils/airbrake');
}
// Load current news feed generated from notifications by modified_at
// Get recommendations and insert into the news with the modified_at timestamps
// Get promotions to add to the news feed
// Create critical priority job to insert recommendation and promotions to postgres
// Send data back to user
var GENERAL_NEWS_FEED_LIMIT = 20;
var RECOMMENDATION_FILTER_THRESHOLD = 14;
var getNewsFeedItems = function (options, callback) {
    var where = getCommonWhereOptions(options);
    models.AcNewsFeedItem.findAll({
        where: where,
        order: [
            ["latest_activity_at", "desc"],
            [models.AcActivity, models.User, { model: models.Image, as: 'UserProfileImages' }, 'created_at', 'asc'],
            [models.AcActivity, models.User, { model: models.Organization, as: 'OrganizationUsers' }, { model: models.Image, as: 'OrganizationLogoImages' }, 'created_at', 'asc']
        ],
        limit: options.limit || GENERAL_NEWS_FEED_LIMIT,
        include: [
            {
                model: models.AcActivity,
                required: true,
                include: activitiesDefaultIncludes(options)
            }
        ]
    }).then(function (items) {
        log.info("Generate News Feed Dynamically Got news feed", { itemsLength: items.length });
        callback(null, items);
    }).catch(function (error) {
        callback(error);
    });
};
var getAllActivities = function (options, callback) {
    var where = getCommonWhereOptions(_.merge(options, { dateColumn: 'created_at' }));
    where = _.merge(where, {
        type: {
            $in: defaultKeyActivities
        }
    });
    delete where.user_id;
    models.AcActivity.findAll({
        where: where,
        limit: GENERAL_NEWS_FEED_LIMIT,
        order: [
            ["created_at", "desc"],
            [models.User, { model: models.Image, as: 'UserProfileImages' }, 'created_at', 'asc'],
            [models.User, { model: models.Organization, as: 'OrganizationUsers' }, { model: models.Image, as: 'OrganizationLogoImages' }, 'created_at', 'asc']
        ],
        include: activitiesDefaultIncludes(options)
    }).then(function (activities) {
        log.info("Generate News Feed Dynamically Got defaultKeyActivities", { activitiesLength: activities.length });
        callback(null, activities);
    }).catch(function (error) {
        callback(error);
    });
};
var filterRecommendations = function (allActivities, options, callback) {
    log.info("Generate News Feed Dynamically Breached Recommendation Filter Threshold", {
        allActivitiesLength: allActivities.length, threshold: RECOMMENDATION_FILTER_THRESHOLD
    });
    // Add my own activities
    var myActivities = _.filter(allActivities, function (activity) { return activity.user_id == options.user_id; });
    allActivities = _.filter(allActivities, function (activity) { return activity.user_id != options.user_id; });
    // Add non post activities
    var noPostActivities = _.filter(allActivities, function (activity) { return !activity.post_id; });
    allActivities = _.filter(allActivities, function (activity) { return activity.post_id; });
    var currentPostIds = _.map(allActivities, function (item) { return item.post_id ? item.post_id.toString() : null; });
    // There can be more than one instance of a post_id from a group of activities
    // Get all status updates and make sure they are not removed due to lack of recommendations
    currentPostIds = _.uniq(currentPostIds);
    currentPostIds = _.without(currentPostIds, null);
    var dateRange = {};
    if (options.afterDate && options.beforeDate) {
        dateRange = { name: 'date', after: options.afterDate, before: options.beforeDate };
    }
    else if (options.afterDate) {
        dateRange = { name: 'date', after: options.afterDate };
    }
    else if (options.beforeDate) {
        dateRange = { name: 'date', before: options.beforeDate };
    }
    getRecommendationFor({}, options.user_id, dateRange, options, function (error, recommendedItemIds) {
        if (error) {
            recommendedItemIds = [];
            if (airbrake) {
                airbrake.notify(error).then((airbrakeErr) => {
                    if (airbrakeErr.error) {
                        log.error("AirBrake Error", { context: 'airbrake', err: airbrakeErr.error, errorStatus: 500 });
                    }
                });
            }
        }
        var recommendedPostIds = _.filter(currentPostIds, function (activity) { return _.includes(recommendedItemIds, activity); });
        var notRecommendedPostIds = _.filter(currentPostIds, function (activity) { return !_.includes(recommendedItemIds, activity); });
        log.info("Generate News Feed Dynamically Recommendation status", {
            recommendedPostIdsLength: recommendedPostIds.length, notRecommendedPostIdsLength: notRecommendedPostIds.length
        });
        var finalPostIds;
        if (recommendedPostIds.length < RECOMMENDATION_FILTER_THRESHOLD) {
            // Randomize the remaining not recommended activities
            notRecommendedPostIds = _.shuffle(notRecommendedPostIds);
            // Merge the recommended activities using the not recommended ones and drop the rest
            finalPostIds = _.concat(recommendedPostIds, _.dropRight(notRecommendedPostIds, notRecommendedPostIds.length - (RECOMMENDATION_FILTER_THRESHOLD - recommendedPostIds.length)));
        }
        else {
            finalPostIds = recommendedPostIds;
        }
        allActivities = _.filter(allActivities, function (activity) { return (activity.post_id && _.includes(finalPostIds, activity.post_id.toString())); });
        allActivities = _.concat(allActivities, myActivities);
        allActivities = _.concat(allActivities, noPostActivities);
        callback(null, allActivities);
    });
};
var removeDuplicates = function (allActivities, options, callback) {
    allActivities = _.uniq(allActivities);
    var currentActivityIds = _.map(allActivities, function (item) { return item.id; });
    var where = _.merge(getCommonWhereOptions(options), {
        ac_activity_id: {
            $in: currentActivityIds
        }
    });
    models.AcNewsFeedItem.findAll({
        where: where
    }).then(function (alreadySavedActivities) {
        log.info("Generate News Feed Dynamically Found already saved", {
            alreadySavedActivitiesLength: alreadySavedActivities.length
        });
        var alreadySavedActivitiesIds = _.map(alreadySavedActivities, function (item) { return item.id; });
        // Filter out activities already in this newsfeed
        allActivities = _.filter(allActivities, function (activity) { return !_.includes(alreadySavedActivities, activity.id); });
        callback(null, allActivities);
    }).catch(function (error) {
        callback(error);
    });
};
var createNewsFeedItemsFromActivities = function (allActivities, options, callback) {
    log.info("Generate News Feed Dynamically Saving new news items", { allActivitiesLength: allActivities.length });
    models.sequelize.transaction(function (t1) {
        allInserts = [];
        _.forEach(allActivities, function (activity) {
            allInserts.push(models.AcNewsFeedItem.create({ ac_activity_id: activity.id, latest_activity_at: activity.created_at,
                type: 'newsFeed.dynamic.recommendation', user_id: options.user_id,
                domain_id: options.domain_id, community_id: options.community_id,
                group_id: options.group_id, post_id: options.post_id }, { transaction: t1 }));
        });
        return Promise.all(allInserts);
    }).then(function (result) {
        log.info("Generate News Feed Dynamically Saved", { result: result });
        callback(null, result);
    }).catch(function (error) {
        callback(error);
    });
};
var loadOtherNewsItemsInRange = function (latestActivity, oldestActivity, options, callback) {
    getNewsFeedItems(_.merge(options, {
        afterOrEqualFilter: oldestActivity.created_at,
        beforeOrEqualFilter: latestActivity.created_at,
        type: 'newsFeed.from.notification.recommendation',
        dateColumn: 'latest_activity_at'
    }), callback);
};
var createProcessedRange = function (latestActivity, oldestActivity, options, callback) {
    models.AcNewsFeedProcessedRange.create({
        latest_activity_at: latestActivity.created_at,
        oldest_activity_at: oldestActivity.created_at,
        user_id: options.user_id, domain_id: options.domain_id, community_id: options.community_id,
        group_id: options.group_id, post_id: options.post_id
    }).then(function (results) {
        callback(null, results);
    }).catch(function (error) {
        callback(error);
    });
};
var generateNewsFeedFromActivities = function (options, callback) {
    var allActivities, finalActivities, latestActivity, oldestActivity, otherNewsItems, processedRange;
    async.series([
        // Get all activities
        function (seriesCallback) {
            getAllActivities(options, function (error, activities) {
                if (error) {
                    seriesCallback(error);
                }
                else {
                    allActivities = activities;
                    latestActivity = _.first(allActivities);
                    oldestActivity = _.last(allActivities);
                    seriesCallback();
                }
            });
        },
        // Filter out activities if needed based on recommendations
        function (seriesCallback) {
            if (allActivities.length > RECOMMENDATION_FILTER_THRESHOLD) {
                filterRecommendations(allActivities, options, function (error, activities) {
                    if (error) {
                        seriesCallback(error);
                    }
                    else {
                        allActivities = activities;
                        seriesCallback();
                    }
                });
            }
            else {
                log.info("Generate News Feed Dynamically Not being filtered", {
                    allActivitiesLength: allActivities.length, threshold: RECOMMENDATION_FILTER_THRESHOLD
                });
                seriesCallback();
            }
        },
        // Make sure there are no duplicated activities in news feed
        function (seriesCallback) {
            removeDuplicates(allActivities, options, function (error, activities) {
                if (error) {
                    seriesCallback(error);
                }
                else {
                    // Save all new news feed items
                    createNewsFeedItemsFromActivities(activities, options, function (error, results) {
                        if (error) {
                            seriesCallback(error);
                        }
                        else {
                            seriesCallback();
                        }
                    });
                }
            });
        },
        // Load other news items created from notifications
        function (seriesCallback) {
            if (oldestActivity) {
                loadOtherNewsItemsInRange(latestActivity, oldestActivity, options, function (error, newsItems) {
                    if (error) {
                        seriesCallback(error);
                    }
                    else {
                        otherNewsItems = newsItems;
                        seriesCallback();
                    }
                });
            }
            else {
                seriesCallback();
            }
        },
        // Combine older and new dynamically recommended activities
        function (seriesCallback) {
            var olderActivities = _.map(otherNewsItems, function (item) { return item.AcActivity; });
            finalActivities = _.concat(allActivities, olderActivities);
            // Sort the combined activities
            finalActivities = _.orderBy(finalActivities, ['created_at'], ['desc']);
            log.info("Generate News Feed Dynamically Have created the final activities to deliver", { finalActivitiesLength: finalActivities.length });
            seriesCallback();
        },
        // Create the News Feed Processed Range
        function (seriesCallback) {
            if (latestActivity && oldestActivity) {
                createProcessedRange(latestActivity, oldestActivity, options, function (error, processedRangeIn) {
                    if (error) {
                        seriesCallback(error);
                    }
                    else {
                        processedRange = processedRangeIn;
                        seriesCallback();
                    }
                });
            }
            else {
                seriesCallback();
            }
        }
    ], function (error) {
        // Return all
        callback(error, finalActivities, processedRange ? processedRange.oldest_activity_at : null);
    });
};
var getNewsFeedItemsFromProcessedRange = function (processedRange, options, callback) {
    getNewsFeedItems(_.merge(options, {
        afterOrEqualFilter: processedRange.oldest_activity_at,
        beforeOrEqualFilter: processedRange.latest_activity_at,
        dateColumn: 'latest_activity_at'
    }), function (error, newsitems) {
        if (error) {
            callback(error, false);
        }
        else if (newsitems.length == 0) {
            // We delete the processed range as the activities in it have been deleted
            processedRange.deleted = true;
            processedRange.save().then(function () {
                callback(null, true);
            }).catch(function (error) {
                callback(error, false);
            });
        }
        else {
            var activities = _.map(newsitems, function (item) { return item.AcActivity; });
            callback(null, false, activities, processedRange.oldest_activity_at);
        }
    });
};
var getCuratedNewsItems = function (options, callback) {
    var latestActivityTime, latestProcessedRange;
    var possibleEmptyRanges = true;
    var originalOptions = JSON.parse(JSON.stringify(options));
    async.whilst(function () { return possibleEmptyRanges; }, function (whilstCallback) {
        options = JSON.parse(JSON.stringify(originalOptions));
        async.parallel([
            function (seriesCallback) {
                getActivityDate(options, function (error, latestActivityTimeIn) {
                    latestActivityTime = latestActivityTimeIn;
                    seriesCallback(error);
                });
            },
            function (seriesCallback) {
                getProcessedRange(options, function (error, latestProcessedRangeIn) {
                    latestProcessedRange = latestProcessedRangeIn;
                    seriesCallback(error);
                });
            }
        ], function (error) {
            if (error) {
                whilstCallback(error);
            }
            else {
                if (!latestProcessedRange || latestActivityTime > latestProcessedRange.latest_activity_at) {
                    possibleEmptyRanges = false;
                    if (latestProcessedRange) {
                        options.afterFilter = latestProcessedRange.latest_activity_at;
                    }
                    generateNewsFeedFromActivities(options, whilstCallback);
                }
                else {
                    getNewsFeedItemsFromProcessedRange(latestProcessedRange, options, function (error, possibleEmptyRangesIn, activities, oldestActivityAt) {
                        possibleEmptyRanges = possibleEmptyRangesIn;
                        whilstCallback(error, activities, oldestActivityAt);
                    });
                }
            }
        });
    }, function (error, activities, oldestActivityAt) {
        callback(error, activities, oldestActivityAt);
    });
};
module.exports = {
    getNewsFeedItems: getNewsFeedItems,
    getCuratedNewsItems: getCuratedNewsItems
};
