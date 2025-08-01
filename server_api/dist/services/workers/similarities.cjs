"use strict";
const async = require("async");
const models = require("../../models/index.cjs");
const log = require('../../utils/logger.cjs');
const queue = require('./queue.cjs');
const i18n = require('../utils/i18n.cjs');
const toJson = require('../utils/to_json.cjs');
const _ = require('lodash');
const fs = require('fs');
const updateSimilaritiesCollection = require('../engine/analytics/manager.cjs').updateCollection;
/**
 * @class SimilaritiesWorker
 * @constructor
 */
function SimilaritiesWorker() { }
/**
 * Processes a similarities work package.
 * @param {object} workPackage - The work package for similarities.
 * @param {(error?: any) => void} callback - The callback function.
 * @memberof SimilaritiesWorker
 */
SimilaritiesWorker.prototype.process = function (workPackage, callback) {
    switch (workPackage.type) {
        //TODO: This is disabled until our new similarities backend is ready
        case 'update-collection':
            // updateSimilaritiesCollection(workPackage, callback);
            callback();
            break;
        default:
            callback("Unknown type for workPackage: " + workPackage.type);
    }
};
/** @type {SimilaritiesWorker} */
module.exports = new SimilaritiesWorker();
