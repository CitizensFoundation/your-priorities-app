const models = require('../../models/index.cjs');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const cloneTranslationForConfig = require('../../active-citizen/utils/translation_cloning').cloneTranslationForConfig;
const userId = process.argv[2];
const type = process.argv[3];
const urlToConfig = process.argv[4];
const urlToAddAddFront = process.argv[5];
/*const userId = "84397" //process.argv[3];
const type = "onlyRegistrationQuestionsAndOneTimeLogin";
const urlToConfig = "https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/CopyConfigGroups7421.csv";
const urlToConfigCommunity = "https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/copyConfigCommunities7421.csv";
const urlToAddAddFront = "https://kyrgyz-aris.yrpri.org/";*/
// node server_api/scripts/cloneWBFromUrlScriptAndCreateLinks.js 3 84397 https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/CF_clone_WB_140221.csv https://kyrgyz-aris.yrpri.org/
let config;
let finalOutput = '';
let user;
async.series([
    seriesCallback => {
        if (userId && type && urlToConfig && urlToAddAddFront) {
            seriesCallback();
        }
        else {
            seriesCallback("Not all values set");
        }
    },
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
    seriesCallback => {
        models.User.findOne({
            where: {
                id: userId
            }
        }).then(userIn => {
            if (userIn) {
                user = userIn;
                seriesCallback();
            }
            else {
                seriesCallback("User not found");
            }
        }).catch(error => {
            seriesCallback(error);
        });
    },
    (seriesCallback) => {
        let index = 0;
        async.forEachSeries(config.split('\r\n'), (configLine, forEachCallback) => {
            const splitLine = configLine.split(",");
            process.stdout.write(".");
            if (index == 0 || !configLine || configLine.length < 3 || !splitLine || splitLine.length !== 2) {
                index += 1;
                forEachCallback();
            }
            else {
                const fromGroupId = splitLine[0];
                const toGroupId = splitLine[1];
                if (fromGroupId === toGroupId) {
                    forEachCallback();
                }
                else {
                    let fromGroup;
                    let toGroup;
                    async.series([
                        innerSeriesCallback => {
                            models.Group.findOne({
                                where: {
                                    id: fromGroupId
                                },
                                attributes: ['id', 'name', 'configuration']
                            }).then(groupIn => {
                                if (groupIn) {
                                    fromGroup = groupIn;
                                    innerSeriesCallback();
                                }
                                else {
                                    innerSeriesCallback("from group not found");
                                }
                            }).catch(error => {
                                innerSeriesCallback(error);
                            });
                        },
                        innerSeriesCallback => {
                            models.Group.findOne({
                                where: {
                                    id: toGroupId
                                },
                                attributes: ['id', 'name', 'configuration']
                            }).then(groupIn => {
                                if (groupIn) {
                                    toGroup = groupIn;
                                    innerSeriesCallback();
                                }
                                else {
                                    innerSeriesCallback("to group not found");
                                }
                            }).catch(error => {
                                innerSeriesCallback(error);
                            });
                        },
                        innerSeriesCallback => {
                            fromGroup.hasGroupAdmins(user).then((results => {
                                if (results) {
                                    innerSeriesCallback();
                                }
                                else {
                                    innerSeriesCallback("No access to fromGroup: " + fromGroup.id);
                                }
                            })).catch(error => {
                                innerSeriesCallback(error);
                            });
                        },
                        innerSeriesCallback => {
                            toGroup.hasGroupAdmins(user).then((results => {
                                if (results) {
                                    innerSeriesCallback();
                                }
                                else {
                                    innerSeriesCallback("No access to toGroup: " + toGroup.id);
                                }
                            })).catch(error => {
                                innerSeriesCallback(error);
                            });
                        },
                        innerSeriesCallback => {
                            if (type === "onlyRegistrationQuestions") {
                                toGroup.set('configuration.registrationQuestionsJson', fromGroup.configuration.registrationQuestionsJson);
                                toGroup.set('configuration.registrationQuestions', fromGroup.configuration.registrationQuestions);
                                toGroup.save().then(() => {
                                    finalOutput += urlToAddAddFront + "group/" + toGroup.id + "\n";
                                    innerSeriesCallback();
                                }).catch(error => {
                                    innerSeriesCallback(error);
                                });
                            }
                            else if (type === "onlyRegistrationQuestionsAndOneTimeLogin") {
                                toGroup.set('configuration.registrationQuestionsJson', fromGroup.configuration.registrationQuestionsJson);
                                toGroup.set('configuration.registrationQuestions', fromGroup.configuration.registrationQuestions);
                                toGroup.set('configuration.allowOneTimeLoginWithName', fromGroup.configuration.allowOneTimeLoginWithName);
                                toGroup.save().then(() => {
                                    finalOutput += urlToAddAddFront + "group/" + toGroup.id + "\n";
                                    innerSeriesCallback();
                                }).catch(error => {
                                    innerSeriesCallback(error);
                                });
                            }
                            else if (type === "configurationObject") {
                                toGroup.set('configuration', fromGroup.configuration);
                                toGroup.save().then(() => {
                                    finalOutput += urlToAddAddFront + "group/" + toGroup.id + "\n";
                                    innerSeriesCallback();
                                }).catch(error => {
                                    innerSeriesCallback(error);
                                });
                            }
                            else {
                                innerSeriesCallback();
                            }
                        },
                        innerSeriesCallback => {
                            if (type === "onlyRegistrationQuestions" || type === "onlyRegistrationQuestionsAndOneTimeLogin") {
                                cloneTranslationForConfig("GroupRegQuestions", fromGroup.id, toGroup.id, innerSeriesCallback);
                            }
                            else if (type === "everything") {
                                cloneTranslationForConfig("GroupRegQuestions", fromGroup.id, toGroup.id, innerSeriesCallback);
                                cloneTranslationForConfig("GroupQuestions", fromGroup.id, toGroup.id, innerSeriesCallback);
                            }
                            else {
                                innerSeriesCallback();
                            }
                        }
                    ], error => {
                        forEachCallback(error);
                    });
                }
            }
        }, error => {
            seriesCallback(error);
        });
    },
], error => {
    if (error)
        console.error(error);
    console.log("All done copying config to groups");
    console.log(finalOutput);
    process.exit();
});
export {};
