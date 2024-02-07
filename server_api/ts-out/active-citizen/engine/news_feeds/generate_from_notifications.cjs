"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models = require("../../../models/index.cjs");
var async = require('async');
var log = require('../../utils/logger.cjs');
var _ = require('lodash');
var toJson = require('../../utils/to_json.cjs');
var airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../../utils/airbrake.cjs');
}
var isItemRecommended = require('../recommendations/events_manager.cjs').isItemRecommended;
var getNewsFeedDate = require('./news_feeds_utils.cjs').getNewsFeedDate;
var createItemFromNotification = function (notification, options, callback) {
    var detail = {};
    detail.ac_notification_id = notification.id;
    detail.ac_activity_id = _.last(notification.AcActivities).id;
    detail.user_id = notification.user_id;
    detail.latest_activity_at = _.last(notification.AcActivities).created_at;
    models.AcNewsFeedItem.findOne({ where: { ac_activity_id: detail.ac_activity_id } }).then(function (results) {
        if (!results) {
            models.AcNewsFeedItem.create(_.merge(detail, options)).then(function (item) {
                if (item) {
                    log.info("Generate News Feed Notifications Created item", { item: toJson(item) });
                    callback();
                }
                else {
                    callback('Could not created item');
                }
            }).catch(function (error) {
                callback(error);
            });
        }
        else {
            log.warn("Not creating news feed item for activitity that is already there", { acActivityId: detail.ac_activity_id, userId: detail.user_id });
            callback();
        }
    });
};
var buildNewsFeedItems = function (notification, callback) {
    var shouldInclude = false;
    var activity = _.last(notification.AcActivities);
    var lastNewsItem;
    async.series([
        // If my activity, new post, my post or some of my followings mark it as should include
        function (seriesCallback) {
            if (notification.user_id == activity.user_id ||
                activity.type == 'activity.post.new' ||
                (activity.Post && activity.Post.user_id == notification.user_id)) {
                shouldInclude = true;
                seriesCallback();
            }
            else {
                models.AcFollowing.findOne({
                    where: {
                        user_id: notification.user_id,
                        other_user_id: activity.user_id
                    }
                }).then(function (following) {
                    if (following) {
                        shouldInclude = true;
                    }
                    seriesCallback();
                }).catch(function (error) {
                    seriesCallback(error);
                });
            }
        },
        function (seriesCallback) {
            if (shouldInclude || !activity.Post) {
                seriesCallback();
            }
            else {
                models.Endorsement.findOne({
                    where: {
                        user_id: notification.user_id,
                        post_id: activity.Post.id
                    }
                }).then(function (endorsement) {
                    if (endorsement) {
                        shouldInclude = true;
                    }
                    seriesCallback();
                }).catch(function (error) {
                    seriesCallback(error);
                });
            }
        },
        function (seriesCallback) {
            // Create newsFeed item if needed
            if (shouldInclude) {
                createItemFromNotification(notification, {
                    type: 'newsFeed.from.notification.should',
                    domain_id: activity.domain_id,
                    group_id: activity.group_id,
                    post_id: activity.post_id,
                    community_id: activity.community_id,
                    latest_activity_at: activity.created_at
                }, seriesCallback);
            }
            else {
                var lastNewsItemUpdatedAt;
                async.series([
                    // Domain news feed from recommendations
                    function (innerSeriesCallback) {
                        lastNewsItemUpdatedAt = null;
                        getNewsFeedDate({ domain_id: activity.domain_id }, 'newsFeed.from.notification.recommendation', function (error, itemUpdatedAt) {
                            lastNewsItemUpdatedAt = itemUpdatedAt;
                            innerSeriesCallback(error);
                        });
                    },
                    function (innerSeriesCallback) {
                        isItemRecommended({}, activity.post_id, notification.User.id, {
                            limit: 15,
                            after: lastNewsItemUpdatedAt ? lastNewsItemUpdatedAt.toISOString() : null
                        }, {
                            domain_id: activity.domain_id
                        }, function (isRecommended) {
                            if (isRecommended) {
                                createItemFromNotification(notification, {
                                    type: 'newsFeed.from.notification.recommendation',
                                    domain_id: activity.domain_id
                                }, function (error) {
                                    innerSeriesCallback(error);
                                });
                            }
                            else {
                                innerSeriesCallback();
                            }
                        });
                    },
                    // Community news feed from recommendations
                    function (innerSeriesCallback) {
                        lastNewsItemUpdatedAt = null;
                        getNewsFeedDate({ community_id: activity.community_id }, 'newsFeed.from.notification.recommendation', function (error, itemUpdatedAt) {
                            lastNewsItemUpdatedAt = itemUpdatedAt;
                            innerSeriesCallback(error);
                        });
                    },
                    function (innerSeriesCallback) {
                        isItemRecommended({}, activity.post_id, notification.User.id, {
                            after: lastNewsItemUpdatedAt ? lastNewsItemUpdatedAt.toISOString() : null
                        }, {
                            community_id: activity.community_id
                        }, function (isRecommended) {
                            if (isRecommended) {
                                createItemFromNotification(notification, {
                                    type: 'newsFeed.from.notification.recommendation',
                                    community_id: activity.community_id
                                }, function (error) {
                                    innerSeriesCallback(error);
                                });
                            }
                            else {
                                innerSeriesCallback();
                            }
                        });
                    },
                    // Group news feed from recommendations
                    function (innerSeriesCallback) {
                        lastNewsItemUpdatedAt = null;
                        getNewsFeedDate({ group_id: activity.group_id }, 'newsFeed.from.notification.recommendation', function (error, itemUpdatedAt) {
                            lastNewsItemUpdatedAt = itemUpdatedAt;
                            innerSeriesCallback(error);
                        });
                    },
                    function (innerSeriesCallback) {
                        isItemRecommended({}, activity.post_id, notification.User.id, {
                            after: lastNewsItemUpdatedAt ? lastNewsItemUpdatedAt.toISOString() : null
                        }, {
                            group_id: activity.group_id
                        }, function (isRecommended) {
                            if (isRecommended) {
                                createItemFromNotification(notification, {
                                    type: 'newsFeed.from.notification.recommendation',
                                    group_id: activity.group_id
                                }, function (error) {
                                    innerSeriesCallback(error);
                                });
                            }
                            else {
                                innerSeriesCallback();
                            }
                        });
                    },
                    // Post news feed from recommendations
                    function (innerSeriesCallback) {
                        lastNewsItemUpdatedAt = null;
                        getNewsFeedDate({ post_id: activity.post_id }, 'newsFeed.from.notification.recommendation', function (error, itemUpdatedAt) {
                            lastNewsItemUpdatedAt = itemUpdatedAt;
                            innerSeriesCallback(error);
                        });
                    },
                    // Create item if recommended
                    function (innerSeriesCallback) {
                        isItemRecommended({}, activity.post_id, notification.User.id, {
                            after: lastNewsItemUpdatedAt ? lastNewsItemUpdatedAt.toISOString() : null
                        }, {
                            post_id: activity.post_id
                        }, function (isRecommended) {
                            if (isRecommended) {
                                createItemFromNotification(notification, {
                                    type: 'newsFeed.from.notification.recommendation',
                                    post_id: activity.post_id
                                }, function (error) {
                                    innerSeriesCallback(error);
                                });
                            }
                            else {
                                innerSeriesCallback();
                            }
                        });
                    }
                ], seriesCallback);
            }
        }
    ], callback);
};
module.exports = function (notification, user, callback) {
    var news_feed_item;
    var activity = _.last(notification.AcActivities);
    async.series([
        // See if news item for same notification exists and set updated time if needed
        function (seriesCallback) {
            models.AcNewsFeedItem.findOne({
                where: {
                    ac_notification_id: notification.id
                }
            }).then(function (oldNewsFeedItem) {
                if (oldNewsFeedItem) {
                    log.info("Generate News Feed Notifications found old item and updating timestamp", { oldNewsFeedItemId: oldNewsFeedItem.id });
                    news_feed_item = oldNewsFeedItem;
                    news_feed_item.latest_activity_at = activity.created_at;
                    news_feed_item.save().then(function (updateResults) {
                        if (!updateResults) {
                            log.error("Filtering News Feed Notifications Error", { err: "Could not update timestamp" });
                        }
                        seriesCallback();
                    });
                }
                else {
                    seriesCallback();
                }
            }).catch(function (error) {
                seriesCallback(error);
            });
        },
        function (seriesCallback) {
            if (news_feed_item) {
                seriesCallback();
            }
            else {
                buildNewsFeedItems(notification, seriesCallback);
            }
        }
    ], function (error) {
        if (error) {
            log.error("Generate News Feed Notifications Error", { err: error });
            if (airbrake) {
                airbrake.notify(error).then((airbrakeErr) => {
                    if (airbrakeErr.error) {
                        log.error("AirBrake Error", { context: 'airbrake', user: toJson(req.user), err: airbrakeErr.error, errorStatus: 500 });
                    }
                });
            }
        }
        callback(error);
    });
};
