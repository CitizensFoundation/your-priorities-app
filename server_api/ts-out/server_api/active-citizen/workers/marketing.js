"use strict";
const async = require("async");
const models = require("../../models");
const log = require('../utils/logger');
const queue = require('./queue');
const i18n = require('../utils/i18n');
const toJson = require('../utils/to_json');
const _ = require('lodash');
const fs = require('fs');
const sendCampaign = require('../engine/marketing/campaign').sendCampaign;
let airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake');
}
let MarketingWorker = function () { };
MarketingWorker.prototype.process = (workPackage, callback) => {
    switch (workPackage.type) {
        case 'send-campaign':
            sendCampaign(workPackage, callback);
            break;
        default:
            callback("Unknown type for workPackage: " + workPackage.type);
    }
};
module.exports = new MarketingWorker();
