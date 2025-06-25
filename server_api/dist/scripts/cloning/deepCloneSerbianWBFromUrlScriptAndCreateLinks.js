const models = require('../../models/index.cjs');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const deepCopyCommunityOnlyStructureWithAdminsAndPosts = require('../../utils/copy_utils').deepCopyCommunityOnlyStructureWithAdminsAndPosts;
const updateTranslation = require('../../services/utils/translation_helpers').updateTranslation;
let domainId = process.argv[2];
let userId = process.argv[3];
let urlToConfig = process.argv[4];
let urlToAddAddFront = process.argv[5];
/*domainId = "3"; //process.argv[2];
userId = "84397" //process.argv[3];
urlToConfig = "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/CESA+cloning+sheet+10202021-TEST.csv";// process.argv[4];
urlToAddAddFront = "https://kyrgyz-aris.yrpri.org/";*/
// node server_api/scripts/cloneWBFromUrlScriptAndCreateLinks.js 3 84397 https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/CF_clone_WB_140221.csv https://kyrgyz-aris.yrpri.org/
let config;
let finalOutput = '';
let finalTargetOutput = '';
async.series([
    (seriesCallback) => {
        const options = {
            url: urlToConfig,
        };
        request.get(options, (error, content) => {
            if (content && content.statusCode != 200) {
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
        let index = 0;
        async.forEachSeries(config.split('\r\n'), (configLine, forEachCallback) => {
            const splitLine = configLine.split(",");
            log.info(splitLine);
            if (index == 0 || !configLine || configLine.length < 3 || !splitLine || splitLine.length !== 4 || splitLine[0].length < 2) {
                index += 1;
                forEachCallback();
            }
            else {
                const fromCommunityId = splitLine[0];
                const linkToCommunityId = splitLine[1];
                const serbianName = splitLine[2].trim();
                const englishName = splitLine[3].trim();
                deepCopyCommunityOnlyStructureWithAdminsAndPosts(fromCommunityId, domainId, (error, newCommunity) => {
                    if (error) {
                        forEachCallback(error);
                    }
                    else {
                        models.Community.findOne({
                            where: {
                                id: linkToCommunityId
                            },
                            attributes: ['id', 'name']
                        }).then(linkCommunity => {
                            newCommunity.hostname = newCommunity.hostname + "-" + newCommunity.id;
                            newCommunity.name = serbianName;
                            newCommunity.language = "sr";
                            newCommunity.save().then(() => {
                                newCommunity.set('configuration.customBackURL', linkToCommunityId);
                                newCommunity.set('configuration.customBackName', linkCommunity.name);
                                newCommunity.save().then(() => {
                                    updateTranslation({
                                        contentId: newCommunity.id,
                                        textType: "communityName",
                                        targetLocale: "en",
                                        content: serbianName,
                                        translatedText: englishName
                                    }, (error) => {
                                        log.info(newCommunity.id);
                                        finalOutput += urlToAddAddFront + "community/" + newCommunity.id + "\n";
                                        finalTargetOutput += urlToAddAddFront + "community/" + linkToCommunityId + "\n";
                                        const linkModel = models.Group.build({
                                            name: "Link for community - " + linkToCommunityId,
                                            objectives: "Link for community - " + linkToCommunityId,
                                            access: models.Group.ACCESS_PUBLIC,
                                            user_id: userId,
                                            configuration: { actAsLinkToCommunityId: newCommunity.id },
                                            community_id: linkToCommunityId
                                        });
                                        linkModel.save().then((model) => {
                                            models.User.findOne({
                                                where: {
                                                    id: userId
                                                }
                                            }).then(user => {
                                                linkModel.addGroupAdmin(user).then(function () {
                                                    forEachCallback();
                                                }).catch((error) => {
                                                    forEachCallback(error);
                                                });
                                            }).catch(error => {
                                                forEachCallback(error);
                                            });
                                        }).catch(error => {
                                            forEachCallback(error);
                                        });
                                    });
                                }).catch(error => {
                                    forEachCallback(error);
                                });
                            }).catch(error => {
                                forEachCallback(error);
                            });
                        }).catch(error => {
                            forEachCallback(error);
                        });
                    }
                });
            }
        }, error => {
            seriesCallback(error);
        });
    },
], error => {
    if (error)
        log.error(error);
    log.info("All done clones");
    log.info(finalOutput);
    log.info("All done targets");
    log.info(finalTargetOutput);
    process.exit();
});
export {};
