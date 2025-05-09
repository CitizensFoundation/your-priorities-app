"use strict";
const async = require("async");
const models = require("../../models/index.cjs");
const log = require('../utils/logger.cjs');
const queue = require('./queue.cjs');
const i18n = require('../utils/i18n.cjs');
const toJson = require('../utils/to_json.cjs');
const _ = require('lodash');
const fs = require('fs');
const sendCampaign = require('../engine/marketing/campaign.cjs').sendCampaign;
let airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake.cjs');
}
/**
 * @class MarketingWorker
 * @constructor
 */
function MarketingWorker() { }
/**
 * Processes a marketing work package.
 * @param {object} workPackage - The work package for marketing.
 * @param {(error?: any) => void} callback - The callback function.
 * @memberof MarketingWorker
 */
MarketingWorker.prototype.process = function (workPackage, callback) {
    switch (workPackage.type) {
        case 'send-campaign':
            sendCampaign(workPackage, callback);
            break;
        default:
            callback("Unknown type for workPackage: " + workPackage.type);
    }
};
/** @type {MarketingWorker} */
module.exports = new MarketingWorker();
