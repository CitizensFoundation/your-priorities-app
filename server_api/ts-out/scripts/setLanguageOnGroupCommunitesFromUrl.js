"use strict";
const models = require('../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
/*
const urlToConfig = "https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/WB_ResetLanguageOnCommuntiesList_16_02_21.csv"//process.argv[1];
const toLanguage = "ru"; // process.argv[2];
const urlToAddAddFront = "https://kyrgyz-aris.yrpri.org/"; // process.argv[3];
*/
const urlToConfig = process.argv[2];
const toLanguage = process.argv[3];
const urlToAddAddFront = process.argv[4];
let config;
let finalTargetOutput = '';
const setLanguageOnGroupCommunties = (communityId, done) => {
    models.Community.findOne({
        where: {
            id: communityId
        },
        include: [
            {
                model: models.Group,
            }
        ]
    }).then(community => {
        async.forEach(community.Groups, (group, forEachCallback) => {
            if (group.language !== toLanguage) {
                group.set('language', toLanguage);
                group.save().then(() => {
                    finalTargetOutput += urlToAddAddFront + "group/" + group.id + "\n";
                    forEachCallback();
                }).catch(error => {
                    forEachCallback(error);
                });
            }
            else {
                forEachCallback();
            }
        }, error => {
            done(error);
        });
    }).catch(error => {
        done(error);
    });
};
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
        async.forEachSeries(config.split('\r\n'), (configLine, forEachCallback) => {
            const splitLine = configLine.split(",");
            if (!configLine || configLine.length < 3 || !splitLine || splitLine.length !== 1) {
                forEachCallback();
            }
            else {
                const communityId = splitLine[0];
                setLanguageOnGroupCommunties(communityId, forEachCallback);
            }
        }, error => {
            seriesCallback();
        });
    },
], error => {
    if (error)
        console.error(error);
    console.log("All done set to " + toLanguage);
    console.log(finalTargetOutput);
    process.exit();
});
