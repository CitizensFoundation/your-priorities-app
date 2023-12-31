"use strict";
const models = require('../../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const farmhash = require('farmhash');
//const communityId = "1264"; //process.argv[2];
//const communityId = "1402"; //process.argv[2];
//const communityId = "1321"; //process.argv[2];
//const communityId = "1403"; //process.argv[2];
const communityId = process.argv[2];
const targetLocale = process.argv[3];
const urlToConfig = process.argv[4];
let config;
let changeCount = 0;
const searchAndReplaceTranslation = (textType, id, content, done) => {
    if (!content)
        done();
    const indexKey = `${textType}-${id}-${targetLocale}-${farmhash.hash32(content).toString()}`;
    models.AcTranslationCache.findOne({
        where: {
            index_key: indexKey
        }
    }).then((result) => {
        if (result) {
            let newContent = result.content;
            config.split('\r\n').forEach(searchLine => {
                if (searchLine && searchLine !== "") {
                    const searchLineSplit = searchLine.split(",");
                    if (newContent.indexOf(searchLineSplit[0]) > -1) {
                        const regExp = new RegExp(searchLineSplit[0], 'g');
                        newContent = newContent.replace(regExp, searchLineSplit[1]);
                        changeCount += 1;
                    }
                }
            });
            if (newContent !== result.content) {
                result.set('content', newContent);
                result.save().then(() => {
                    console.log(`Updated ${result.index_key} to ${result.content}`);
                    done();
                }).catch(error => {
                    done(error);
                });
            }
            else {
                done();
            }
        }
        else {
            console.warn("Not found: " + indexKey);
            done();
        }
    }).catch((error) => {
        done(error);
    });
};
const updateTranslationForPosts = (posts, done) => {
    async.forEachSeries(posts, (post, forEachCallback) => {
        searchAndReplaceTranslation('postName', post.id, post.name, (error) => {
            if (error) {
                forEachCallback(error);
            }
            else {
                searchAndReplaceTranslation('postContent', post.id, post.description, (error) => {
                    forEachCallback(error);
                });
            }
        });
    }, error => {
        done(error);
    });
};
const updateTranslationForGroups = (groups, done) => {
    async.forEachSeries(groups, (group, forEachCallback) => {
        searchAndReplaceTranslation('groupName', group.id, group.name, (error) => {
            if (error) {
                forEachCallback(error);
            }
            else {
                searchAndReplaceTranslation('groupContent', group.id, group.objectives, (error) => {
                    forEachCallback(error);
                });
            }
        });
    }, error => {
        done(error);
    });
};
const updateTranslationForCommunity = (community, done) => {
    searchAndReplaceTranslation('communityName', community.id, community.name, (error) => {
        if (error) {
            done(error);
        }
        else {
            searchAndReplaceTranslation('communityContent', community.id, community.description, (error) => {
                done(error);
            });
        }
    });
};
async.series([
    (seriesCallback) => {
        const options = {
            url: urlToConfig,
        };
        request.get(options, (error, content) => {
            if (content && content.statusCode !== 200) {
                seriesCallback(content.statusCode);
            }
            else if (content) {
                config = content.body;
                seriesCallback();
            }
            else {
                seriesCallback("No content");
            }
        });
    },
    (seriesCallback) => {
        async.series([
            (innerSeriesCallback) => {
                models.Post.findAll({
                    attributes: ['id', 'name', 'description'],
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
                }).then(posts => {
                    updateTranslationForPosts(posts, innerSeriesCallback);
                }).catch(error => {
                    innerSeriesCallback(error);
                });
            },
            (innerSeriesCallback) => {
                models.Group.findAll({
                    attributes: ['id', 'name', 'objectives'],
                    where: {
                        community_id: communityId
                    }
                }).then(groups => {
                    updateTranslationForGroups(groups, innerSeriesCallback);
                }).catch(error => {
                    innerSeriesCallback(error);
                });
            },
            (innerSeriesCallback) => {
                models.Community.findOne({
                    attributes: ['id', 'name', 'description'],
                    where: {
                        id: communityId
                    }
                }).then(community => {
                    updateTranslationForCommunity(community, innerSeriesCallback);
                }).catch(error => {
                    innerSeriesCallback(error);
                });
            }
        ], (error) => {
            seriesCallback(error);
        });
    },
], error => {
    if (error)
        console.error(error);
    console.log(`All done with ${changeCount} changes`);
    process.exit();
});
