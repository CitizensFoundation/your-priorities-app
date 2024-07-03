"use strict";
const models = require("../../../../models/index.cjs");
const log = require("../../../utils/logger.cjs");
const request = require("request");
const moment = require("moment");
// This SQL is needed to allow the site API
// UPDATE api_keys SET scopes = '{sites:provision:*}' WHERE name = 'Development';
const allGoals = [
    "newPost - completed",
    "newPost - open",
    "pointHelpful - clicked",
    "pointHelpful - completed",
    "endorse_down - clicked",
    "endorse_down - completed",
    "pointDown - add",
    "pointDown - focus",
    "Login and Signup - Login Fail",
    "endorse_up - clicked",
    "endorse_up - completed",
    "Login and Signup - Signup/Login Opened",
    "Login and Signup - Signup Fail",
    "newPointFor - completed",
    "Login and Signup - Login Submit",
    "post.ratings - open",
    "Login and Signup - Signup Submit",
    "newPointAgainst - completed",
    "Login and Signup - Login Success",
    "Login and Signup - Signup Success",
    "pointUp - focus",
    "pages - open",
    "pointUp - add",
    "pointNotHelpful - clicked",
    "pointNotHelpful - completed",
    "mediaRecorder - open",
    "videoUpload - starting",
    "audioUpload - starting",
    "audioUpload - error",
    "videoUpload - error",
    "post - open",
    "postForward - swipe",
    "postBackward - swipe",
    "recommendations - goForward",
    "recommendations - goBack",
    "stopTranslation - click",
    "startTranslation - click",
    "changeLanguage - click",
    "video - completed",
    "audio - completed",
    "editCommunity - completed",
    "community.bulkStatusUpdates - open",
    "community.users - open",
    "community.admins - open",
    "community.pagesAdmin - open",
    "createReportXlsUsers - open",
    "createReportFraudReport - open",
    "communityContentModeration - open",
    "communityFraudManagement - open",
    "communityAllContentModeration - open",
    "community.delete - open",
    "community.deleteContents - open",
    "community.anonymize - open",
    "community.edit - open",
    "community_tab - open",
    "newGroup - open",
    "editDomain - completed",
    "domainUsers - open",
    "domainAdmins - open",
    "domain.organizationsGrid - open",
    "domain.pagesAdmin - open",
    "domainEdit - open",
    "domainContentModeration - open",
    "domainAllContentModeration - open",
    "organizationEdit - open",
    "domain_tab_communities - open",
    "domain_tab_news - open",
    "newCommunity - open",
    "newCommunityFolder - open",
    "ziggeo - open",
    "attachmentUpload - starting",
    "imageUpload - starting",
    "mediaTranscoding - starting",
    "mediaTranscoding - error",
    "videoUpload - complete",
    "audioUpload - complete",
    "imageUpload - complete",
    "mediaTranscoding - complete",
    "mediaUpload - error",
    "group - open",
    "groupContentModeration - open",
    "groupAllContentModeration - open",
    "group.pagesAdmin - open",
    "group.users - open",
    "group.admins - open",
    "group.edit - open",
    "createReportDocx - open",
    "createReportXls - open",
    "group.deleteContent - open",
    "group.clone - open",
    "community.clone - open",
    "group.anonymize - open",
    "category.new - open",
    "twitter - pointShareOpen",
    "group.delete - open",
    "group_tab_map - open",
    "toggleCommunityMembership - clicked",
    "facebook - pointShareOpen",
    "editGroup - complete",
    "group_tab_posts - open",
    "group_tab_news - open",
    "pages - close",
    "toggleGroupMembership - clicked",
    "community - open",
    "point.report - open",
    "email - pointShareOpen",
    "whatsapp - pointShareOpen",
    "twitter - postShareCardOpen",
    "facebook - postShareCardOpen",
    "email - postShareCardOpen",
    "whatsapp - postShareCardOpen",
    "post.report - open",
    "post.edit - open",
    "post.delete - open",
    "postDeleteContent - open",
    "postAnonymizeContent - open",
    "filter - click",
    "search - click",
    "marker - clicked",
    "userImage.edit - open",
    "userImage.delete - open",
    "newUserImage - open",
    "post_tab_debate - open",
    "post_tab_map - open",
    "post_tab_news - open",
    "filter - open",
    "filter - change",
    "post.ratings - add",
    "post.ratings - delete",
    "post.ratings - completed",
    "post.ratings.dialog - open",
    "setEmail - cancel",
    "setEmail - logout",
    "forgotPasswordFromSetEmail - open",
    "linkAccountsAjax - confirm",
    "setEmail - confirm",
    "registrationAnswers - submit",
    "user.createApiKey - open",
    "user.reCreateApiKey - open",
    "userAllContentModeration - open",
    "evaluated - point toxicity low",
    "evaluated - point toxicity medium",
    "evaluated - point toxicity high",
    "evaluated - post toxicity low",
    "evaluated - post toxicity medium",
    "evaluated - post toxicity high",
    "open - share dialog options",
    "open - share dialog - brand:whatsapp",
    "open - share dialog - brand:facebook",
    "open - share dialog - brand:twitter",
    "open - share dialog - clipboard"
];
async function plausibleStatsProxy(plausibleUrl, props) {
    return await new Promise((resolve, reject) => {
        if (process.env["PLAUSIBLE_BASE_URL"] && process.env["PLAUSIBLE_API_KEY"]) {
            const firstPartOfUrl = plausibleUrl.split("?")[0];
            const searchParams = new URLSearchParams(plausibleUrl.split("?")[1]);
            let filtersContent;
            let baseUrl;
            baseUrl = process.env["PLAUSIBLE_BASE_URL"].replace("/api/v1/", "");
            if (plausibleUrl.indexOf("timeseries") > -1 ||
                plausibleUrl.indexOf("aggregate") > -1) {
                const customPropertyName = Object.keys(props)[0];
                const customPropertyValue = Object.values(props)[0];
                filtersContent = searchParams.get('filters');
                filtersContent = `${filtersContent};event:props:${customPropertyName}==${customPropertyValue}`;
                searchParams.set('filters', filtersContent);
                //searchParams.delete('metrics');
                //searchParams.set('metrics', 'visitors')
                searchParams.delete('with_imported');
                let period = searchParams.get('period');
                if (period === "all") {
                    searchParams.delete('date');
                    searchParams.set('period', "custom");
                    const statsBeginTime = moment(searchParams.get('statsBegin'));
                    const plausibleBeginTime = moment("2022-08-13");
                    let beingTime;
                    if (statsBeginTime < plausibleBeginTime) {
                        beingTime = plausibleBeginTime.format("YYYY-MM-DD");
                    }
                    else {
                        beingTime = statsBeginTime.format("YYYY-MM-DD");
                    }
                    const dateNow = moment(new Date()).format("YYYY-MM-DD");
                    searchParams.set('date', `${beingTime},${dateNow}`);
                }
                searchParams.delete('statsBegin');
                baseUrl = `https://${baseUrl.split("@")[1]}`;
            }
            else {
                filtersContent = JSON.parse(searchParams.get('filters'));
                if (firstPartOfUrl.indexOf("/property/") > -1) {
                    props = {};
                }
                filtersContent = { ...filtersContent, ...{ props } };
                searchParams.set('filters', JSON.stringify(filtersContent));
            }
            let newUrl = firstPartOfUrl + "?" + searchParams.toString();
            const options = {
                url: baseUrl + newUrl,
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.3",
                    referrer: "",
                    Authorization: `Bearer ${process.env["PLAUSIBLE_API_KEY"]}`,
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                }
            };
            log.debug(JSON.stringify(options));
            request.get(options, (error, content) => {
                if (content && content.statusCode != 200) {
                    log.error(error);
                    log.error(content);
                    reject(content.statusCode);
                }
                else if (content) {
                    log.debug(content.body);
                    resolve(content.body);
                }
                else {
                    reject("No body for plausible content");
                }
            });
        }
        else {
            log.warn("No plausible base url or api key");
            resolve();
        }
    });
}
async function getPlausibleStats(statsParams) {
    return await new Promise((resolve, reject) => {
        if (process.env["PLAUSIBLE_BASE_URL"] && process.env["PLAUSIBLE_API_KEY"]) {
            const options = {
                url: process.env["PLAUSIBLE_BASE_URL"] + "stats/" + statsParams,
                headers: {
                    Authorization: `Bearer ${process.env["PLAUSIBLE_API_KEY"]}`,
                    "X-Forwarded-For": "127.0.0.1",
                    "Content-Type": "application/json",
                },
            };
            log.info(JSON.stringify(options));
            request.get(options, (error, content) => {
                if (content && content.statusCode != 200) {
                    log.error(error);
                    log.error(content);
                    reject(content.statusCode);
                }
                else if (content) {
                    console.log(content.body);
                    resolve(content.body);
                }
                else {
                    reject("No body for plausible content");
                }
            });
        }
        else {
            log.warn("No plausible base url or api key");
            resolve();
        }
    });
}
async function addAllPlausibleGoals() {
    for (let i = 0; i < allGoals.length; i++) {
        await addPlausibleGoal(allGoals[i]);
        await new Promise(r => setTimeout(r, 1));
    }
}
async function addPlausibleGoal(eventName) {
    return await new Promise((resolve, reject) => {
        if (process.env["PLAUSIBLE_BASE_URL"] && process.env["PLAUSIBLE_API_KEY"]) {
            let plausibleUrl = `https://${process.env["PLAUSIBLE_BASE_URL"].split("@")[1]}`;
            const options = {
                url: plausibleUrl + "sites/goals",
                formData: {
                    site_id: process.env.PLAUSIBLE_SITE_NAME,
                    goal_type: "event",
                    event_name: eventName
                },
                headers: {
                    Authorization: `Bearer ${process.env["PLAUSIBLE_API_KEY"]}`,
                    //"X-Forwarded-For": "127.0.0.1",
                    "Content-Type": "multipart/form-data",
                    "User-Agent": "your priorities"
                },
                method: "PUT",
            };
            console.log(`${JSON.stringify(options)}`);
            request(options, (error, content) => {
                if (content && content.statusCode != 200) {
                    log.error(error);
                    log.error(content);
                    reject(content.statusCode);
                }
                else if (content) {
                    console.log(content.body);
                    resolve(content.body);
                }
                else {
                    reject("No body for plausible content");
                }
            });
        }
        else {
            log.warn("No plausible base url or api key");
            resolve();
        }
    });
}
async function addPlausibleEvent(eventName, workData) {
    const userAgent = workData.body.user_agent;
    const url = workData.body.url;
    const screenWidth = workData.body.screen_width;
    const referrer = workData.body.referrer;
    const ipAddress = workData.body.ipAddress;
    return await new Promise(async (resolve, reject) => {
        if (process.env["PLAUSIBLE_EVENT_BASE_URL"] &&
            process.env["PLAUSIBLE_API_KEY"]) {
            let communityId;
            let projectId, externalId;
            let useUrl = url;
            try {
                if (workData.groupId) {
                    const group = await models.Group.findOne({
                        where: {
                            id: workData.groupId,
                        },
                        attributes: ["community_id"],
                    });
                    if (group) {
                        communityId = group.community_id;
                    }
                }
                if (!communityId && workData.postId) {
                    const post = await models.Post.findOne({
                        where: {
                            id: workData.postId,
                        },
                        attributes: ["id"],
                        include: [
                            {
                                model: models.Group,
                                attributes: ["community_id"],
                                required: true,
                            },
                        ],
                    });
                    if (post) {
                        communityId = post.Group.community_id;
                    }
                }
                if (!communityId && workData.communityId) {
                    communityId = workData.communityId;
                }
                if (!workData.groupId && workData.postId) {
                    const post = await models.Post.findOne({
                        where: {
                            id: workData.postId,
                        },
                        attributes: ["group_id"],
                    });
                    if (post) {
                        workData.groupId = post.group_id;
                    }
                }
                if (workData.body.originalQueryString && useUrl.indexOf("?") === -1) {
                    useUrl += "?" + workData.body.originalQueryString;
                }
                if (workData.body.userAutoTranslate &&
                    typeof workData.body.userAutoTranslate === "string") {
                    workData.body.userAutoTranslate = workData.body.userAutoTranslate.toLowerCase() === 'true';
                }
                if (communityId) {
                    const community = await models.Community.findOne({
                        where: {
                            id: communityId
                        },
                        attributes: ['id', 'configuration']
                    });
                    if (community && community.configuration) {
                        projectId = community.configuration.projectId;
                        externalId = community.configuration.externalId;
                    }
                }
            }
            catch (error) {
                reject(error);
                return;
            }
            let inProps = workData.body.props ? workData.body.props : {};
            const props = {
                ...inProps,
                ...{
                    communityId: communityId ? parseInt(communityId) : undefined,
                    groupId: workData.groupId ? parseInt(workData.groupId) : undefined,
                    domainId: workData.domainId ? parseInt(workData.domainId) : undefined,
                    postId: workData.postId ? parseInt(workData.postId) : undefined,
                    pointId: workData.pointId ? parseInt(workData.pointId) : undefined,
                    userId: workData.userId ? parseInt(workData.userId) : -1,
                    userLocale: workData.body.userLocale,
                    userAutoTranslate: workData.body.userAutoTranslate,
                    projectId: projectId,
                    externalId: externalId
                }
            };
            const options = {
                url: process.env["PLAUSIBLE_EVENT_BASE_URL"] + "event/",
                headers: {
                    "X-Forwarded-For": ipAddress,
                    "User-Agent": userAgent,
                    "referer": referrer,
                    "Content-Type": "application/json",
                },
                method: "POST",
                json: {
                    name: eventName,
                    url: useUrl,
                    domain: process.env["PLAUSIBLE_SITE_NAME"],
                    screen_width: parseInt(screenWidth),
                    referrer: referrer,
                    referer: referrer,
                    props: JSON.stringify(props),
                },
            };
            //log.info(JSON.stringify(options));
            const logLine = `${ipAddress} Plausible ${eventName} - ${JSON.stringify(props)} - ${useUrl} - ${referrer} -${userAgent}`;
            log.debug(logLine);
            request.post(options, async (error, content) => {
                if (content && content.statusCode != 202) {
                    if (content.statusCode == 403) {
                        log.warn(`Got 403 from plausible for ${logLine}`);
                        resolve();
                    }
                    else {
                        log.error(`Error in sending to plausible ${content.statusCode} ${content.error} ${logLine}`);
                        log.error(content);
                        reject(content.statusCode);
                    }
                }
                else {
                    resolve();
                }
            });
        }
        else {
            log.warn("No plausible base url or api key");
            resolve();
        }
    });
}
async function sendPlausibleFavicon(sourceName) {
    return await new Promise((resolve, reject) => {
        if (process.env["PLAUSIBLE_BASE_URL"] && process.env["PLAUSIBLE_API_KEY"]) {
            const url = process.env["PLAUSIBLE_BASE_URL"].replace("/api/v1/", "/favicon/sources/") + sourceName;
            const options = {
                url,
                headers: {
                    Authorization: `Bearer ${process.env["PLAUSIBLE_API_KEY"]}`,
                    "Content-Type": "image/x-icon",
                    "X-Forwarded-For": "127.0.0.1"
                },
                encoding: null
            };
            log.info(JSON.stringify(options));
            request.get(options, (error, content) => {
                if (content && content.statusCode != 200) {
                    log.error(error);
                    log.error(content);
                    reject(content.statusCode);
                }
                else if (content) {
                    resolve(content.body);
                }
                else {
                    reject("No content");
                }
            });
        }
        else {
            log.warn("No plausible base url or api key");
            resolve();
        }
    });
}
module.exports = {
    addPlausibleEvent,
    getPlausibleStats,
    addAllPlausibleGoals,
    plausibleStatsProxy,
    sendPlausibleFavicon
};
