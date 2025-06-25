const models = require('../models/index.cjs');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const recountCommunity = require('../utils/recount_utils.cjs').recountCommunity;
/*
const urlToConfig = "https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/WBMoveIdeas160221.csv"//process.argv[1];
const urlToAddAddFront = "https://kyrgyz-aris.yrpri.org/"; // process.argv[2];
*/
const urlToConfig = process.argv[2];
const urlToAddAddFront = process.argv[3];
let config;
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
            if (index === 0 || !configLine || configLine.length < 3 || !splitLine || splitLine.length !== 1) {
                index += 1;
                forEachCallback();
            }
            else {
                index += 1;
                const communityId = splitLine[0];
                finalTargetOutput += urlToAddAddFront + "community/" + communityId + "\n\n";
                recountCommunity(communityId, forEachCallback);
            }
        }, error => {
            seriesCallback(error);
        });
    },
], error => {
    if (error)
        log.error(error);
    log.info("All done recounting");
    log.info(finalTargetOutput);
    process.exit();
});
export {};
