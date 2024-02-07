"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queue = require('../../workers/queue.cjs');
var models = require("../../../models/index.cjs");
var truncate = require('../../utils/truncate_text.cjs');
const async = require('async');
const _ = require('lodash');
var i18n = require('../../utils/i18n.cjs');
var linkTo = function (url) {
    return '<a href="' + url + '">' + url + '</a>';
};
function countProperties(obj) {
    var count = 0;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            ++count;
    }
    return count;
}
const getPointsGroupedByModel = (pointIds, includeModel, whereIn, callback) => {
    const mergedWhere = _.merge(whereIn, {
        id: {
            $in: pointIds
        }
    });
    models.Point.findAll({
        where: mergedWhere,
        attributes: ['id', 'content', 'post_id', 'group_id', 'community_id', 'data'],
        order: [
            [models.PointRevision, 'created_at', 'asc']
        ],
        include: [
            {
                model: models[includeModel],
                attributes: ['id', 'name'],
                required: true
            },
            {
                model: models.PointRevision,
                required: false,
                attributes: ['id', 'content']
            }
        ]
    }).then((points) => {
        const groupedPoints = _.groupBy(points, (point) => {
            return point[includeModel].name;
        });
        callback(null, groupedPoints);
    }).catch((error) => {
        callback(error);
    });
};
const makeLinkToPost = (post, community, domain) => {
    const hostName = community.hostname ? community.hostname : 'app';
    const url = 'https://' + hostName + '.' + domain.domain_name + '/post/' + post.id;
    return '<a href="' + url + '">' + post.name + '</a>';
};
const makeLinkToPoint = (point, community, domain) => {
    const hostName = community.hostname ? community.hostname : 'app';
    let url;
    if (point.post_id) {
        url = 'https://' + hostName + '.' + domain.domain_name + '/post/' + point.post_id + '/' + point.id;
    }
    else if (point.group_id) {
        url = 'https://' + hostName + '.' + domain.domain_name + '/group/' + point.group_id + '/news/' + point.id;
    }
    else if (point.community_id) {
        url = 'https://' + hostName + '.' + domain.domain_name + '/community/' + point.community_id + '/news/' + point.id;
    }
    let content;
    if (point.content == null && point.PointRevisions[0]) {
        content = point.PointRevisions[0].content;
    }
    else if (point.content) {
        content = point.content;
    }
    else {
        log.error("Can't find any content");
        content = "Unknown";
    }
    return '<a href="' + url + '">' + truncate(content, 80) + '</a>';
};
const makeLinksForPoints = (pointsObject, community, domain) => {
    let finalContent = '';
    let savedKey = null;
    _.forEach(pointsObject, (points, key) => {
        if (savedKey != key) {
            finalContent += '<br><b>' + key + "</b><br>\n";
            savedKey = key;
        }
        _.forEach(points, (point) => {
            finalContent += makeLinkToPoint(point, community, domain) + "<br>\n";
        });
    });
    return finalContent;
};
const getLinkedPostAndPoints = (postIds, pointIds, community, domain, callback) => {
    let allPosts, allGroupedPostPoints, allGroupPoints, allCommunityPoints;
    let finalContent = '';
    async.parallel([
        (parallelCallback) => {
            models.Post.findAll({
                where: {
                    id: {
                        $in: postIds
                    }
                },
                attributes: ['id', 'name']
            }).then((posts) => {
                allPosts = posts;
                parallelCallback();
            }).catch((error) => {
                parallelCallback(error);
            });
        },
        (parallelCallback) => {
            getPointsGroupedByModel(pointIds, 'Post', {}, (error, points) => {
                allGroupedPostPoints = points;
                parallelCallback(error);
            });
        },
        (parallelCallback) => {
            getPointsGroupedByModel(pointIds, 'Group', { post_id: null }, (error, points) => {
                allGroupPoints = points;
                parallelCallback(error);
            });
        },
        (parallelCallback) => {
            getPointsGroupedByModel(pointIds, 'Community', { post_id: null, group_id: null }, (error, points) => {
                allCommunityPoints = points;
                parallelCallback(error);
            });
        }
    ], (error) => {
        if (error) {
            callback(error);
        }
        else {
            if (allPosts.length > 0) {
                finalContent += '<br><b>' + i18n.t('yourPosts') + '</b><br>\n';
            }
            _.forEach(allPosts, (post) => {
                finalContent += makeLinkToPost(post, community, domain) + "<br>\n";
            });
            if (allPosts.length > 0) {
                finalContent += "<br>\n";
            }
            if (countProperties(allGroupedPostPoints) > 0) {
                finalContent += '<b>' + i18n.t('yourPoints') + '</b><br>\n';
                finalContent += makeLinksForPoints(allGroupedPostPoints, community, domain);
                finalContent += "<br>\n";
            }
            if (countProperties(allGroupPoints) > 0) {
                finalContent += '<b>' + i18n.t('yourGroupPoints') + '</b><br>\n';
                finalContent += makeLinksForPoints(allGroupPoints, community, domain);
                finalContent += "<br>\n";
            }
            if (countProperties(allCommunityPoints) > 0) {
                finalContent += '<b>' + i18n.t('yourCommunityPoints') + '</b><br>\n';
                finalContent += makeLinksForPoints(allCommunityPoints, community, domain);
            }
            callback(null, finalContent);
        }
    });
};
const processContentToBeAnonymized = (notification, object, domain, community, group, user, callback) => {
    let link;
    let prependToContent;
    if (object.type === 'communityContentToBeAnonymized') {
        link = linkTo("https://" + community.hostname + "." + domain.domain_name);
        prependToContent = i18n.t('notification.communityContentToBeAnonymized') + '<br><br>\n';
    }
    else {
        link = linkTo("https://" + community.hostname + "." + domain.domain_name + "/group/" + group.id);
        prependToContent = i18n.t('notification.groupContentToBeAnonymized') + '<br><br>\n';
    }
    const header = object.name;
    getLinkedPostAndPoints(object.postIds, object.pointIds, community, domain, (error, content) => {
        if (error) {
            callback(error);
        }
        else {
            queue.add('send-one-email', {
                subject: { translateToken: 'notification.contentToBeAnonymized', contentName: object.name },
                template: 'general_user_notification',
                user: user,
                domain: domain,
                community: community,
                group: group,
                object: object,
                header: header,
                content: prependToContent + content,
                link: link
            }, 'high');
            callback();
        }
    });
};
module.exports = (notification, domain, community, group, user, callback) => {
    const object = notification.AcActivities[0].object;
    if (object && object.sendEmail === true) {
        if (object.type === 'communityContentToBeAnonymized' ||
            object.type === 'groupContentToBeAnonymized') {
            processContentToBeAnonymized(notification, object, domain, community, group, user, callback);
        }
        else {
            callback();
        }
    }
    else {
        callback();
    }
};
