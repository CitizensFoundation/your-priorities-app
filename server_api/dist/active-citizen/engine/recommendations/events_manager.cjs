"use strict";
const models = require('../../../models/index.cjs');
const _ = require('lodash');
const async = require('async');
const log = require('../../utils/logger.cjs');
const request = require('request');
let airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../../utils/airbrake.cjs');
}
const createAction = (userAgent, ipAddress, postId, userId, date, action, callback) => {
    var properties = {};
    const esId = `${postId}-${userId}-${action}`;
    properties = _.merge(properties, {
        user_agent: userAgent,
        ipAddress: ipAddress,
        postId,
        userId,
        date,
        action,
        esId
    });
    const options = {
        url: process.env["AC_ANALYTICS_BASE_URL"] + "addPostAction/" + process.env.AC_ANALYTICS_CLUSTER_ID,
        headers: {
            'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
        },
        json: properties
    };
    request.post(options, (error) => {
        callback(error);
    });
};
const createManyActions = (posts, callback) => {
    const options = {
        url: process.env["AC_ANALYTICS_BASE_URL"] + "addManyPostActions/" + process.env.AC_ANALYTICS_CLUSTER_ID,
        headers: {
            'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
        },
        json: { posts: posts }
    };
    request.post(options, (error) => {
        callback(error);
    });
};
const createEndorsementTypeAction = (model, activity, itemId, type, done) => {
    let userAgent;
    let ipAddress;
    async.series([
        (seriesCallback) => {
            if (itemId) {
                model.findOne({
                    where: {
                        id: itemId
                    },
                    attributes: ['id', 'user_agent', 'ip_address']
                }).then(endorsement => {
                    if (endorsement) {
                        userAgent = endorsement.user_agent;
                        ipAddress = endorsement.ip_address;
                        seriesCallback();
                    }
                    else {
                        seriesCallback("Can't find endorsement: " + activity.object.endorsementId);
                    }
                }).catch(error => {
                    seriesCallback(error);
                });
            }
            else {
                log.error("Can't find itemId for createEndorsementTypeAction");
                seriesCallback();
            }
        },
        (seriesCallback) => {
            createAction(userAgent, ipAddress, activity.Post.id, activity.user_id, activity.created_at.toISOString(), type, seriesCallback);
        }
    ], error => {
        done(error);
    });
};
const generateRecommendationEvent = (activity, callback) => {
    if (process.env["AC_ANALYTICS_BASE_URL"] && activity) {
        log.info('Events Manager generateRecommendationEvent', { type: activity.type, userId: activity.user_id });
        switch (activity.type) {
            case "activity.post.endorsement.new":
            case "activity.post.endorsement.copied":
                createEndorsementTypeAction(models.Endorsement, activity, activity.object.endorsementId, 'endorse', callback);
                break;
            case "activity.post.rating.new":
            case "activity.post.rating.copied":
                createEndorsementTypeAction(models.Rating, activity, activity.object.ratingId, 'endorse', callback);
                break;
            case "activity.post.opposition.new":
                createEndorsementTypeAction(models.Endorsement, activity, activity.object.endorsementId, 'oppose', callback);
                break;
            case "activity.post.new":
                createAction(activity.Post.user_agent, activity.Post.ip_address, activity.Post.id, activity.user_id, activity.created_at.toISOString(), 'new-post', callback);
                break;
            case "activity.point.new":
            case "activity.point.copied":
                if (activity.Point) {
                    if (activity.Point.value == 0 && activity.Point.Post) {
                        createAction(activity.Point.user_agent, activity.Point.ip_address, activity.Point.Post.id, activity.user_id, activity.created_at.toISOString(), 'new-point-comment', callback);
                    }
                    else if (activity.Point.Post) {
                        createAction(activity.Point.user_agent, activity.Point.ip_address, activity.Point.Post.id, activity.user_id, activity.created_at.toISOString(), 'new-point', callback);
                    }
                    else {
                        callback();
                    }
                }
                else {
                    callback();
                }
                break;
            case "activity.point.helpful.new":
            case "activity.point.helpful.copied":
                if (activity.Point.Post) {
                    createEndorsementTypeAction(models.PointQuality, activity, activity.object.pointQualityId, 'point-helpful', callback);
                }
                else {
                    callback();
                }
                break;
            case "activity.point.unhelpful.new":
            case "activity.point.unhelpful.copied":
                if (activity.Point.Post) {
                    createEndorsementTypeAction(models.PointQuality, activity, activity.object.pointQualityId, 'point-unhelpful', callback);
                }
                else {
                    callback();
                }
                break;
            default:
                callback();
        }
    }
    else {
        log.warn("Not setup for ac-analytics-api", { activityType: activity ? activity.type : null });
        callback();
    }
};
const getRecommendationFor = (req, userId, dateOptions, options, callback, userLocale) => {
    let collectionType, collectionId;
    //log.info('Events Manager getRecommendationFor', { fields: fields, dateRange: dateRange });
    if (options.domain_id) {
        collectionType = "domain";
        collectionId = options.domain_id;
    }
    else if (options.community_id) {
        collectionType = "community";
        collectionId = options.community_id;
    }
    else if (options.group_id) {
        collectionType = "group";
        collectionId = options.group_id;
    }
    //TODO: Add back dateRange options to backend and here
    if (process.env["AC_ANALYTICS_BASE_URL"] && collectionType) {
        const options = {
            url: process.env["AC_ANALYTICS_BASE_URL"] + "recommendations/" + collectionType + "/" + process.env.AC_ANALYTICS_CLUSTER_ID + "/" + collectionId + "/" + userId,
            headers: {
                'X-API-KEY': process.env["AC_ANALYTICS_KEY"]
            },
            json: { user_agent: req.useragent.source, ip_address: req.clientIp, date_options: dateOptions }
        };
        request.put(options, (error, content) => {
            let results = [];
            if (content && content.statusCode != 200) {
                error = content.statusCode;
            }
            else if (content) {
                results = content.body;
            }
            else {
                error = "No content";
            }
            callback(error, results);
        });
    }
    else {
        log.warn("ac-analytics-api getRecommendationFor or no collectionType");
        callback(null, []);
    }
};
const isItemRecommended = (req, itemId, userId, dateRange, options, callback) => {
    getRecommendationFor(req, userId, dateRange, options, (error, items) => {
        if (error) {
            log.error("Recommendation Events Manager Error", { itemId: itemId, userId: userId, err: error });
            if (airbrake) {
                airbrake.notify(error).then((airbrakeErr) => {
                    if (airbrakeErr.error) {
                        log.error("AirBrake Error", { context: 'airbrake', err: airbrakeErr.error, errorStatus: 500 });
                    }
                });
            }
            callback(_.includes([], itemId.toString()));
        }
        else {
            log.info('Events Manager isItemRecommended', { itemId: itemId, userId: userId });
            callback(_.includes(items, itemId.toString()));
        }
    });
};
module.exports = {
    generateRecommendationEvent,
    getRecommendationFor,
    isItemRecommended,
    createAction,
    createManyActions
};
