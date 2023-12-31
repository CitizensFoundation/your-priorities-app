"use strict";
const async = require("async");
const models = require("../../models");
const log = require('../utils/logger');
const queue = require('./queue');
const i18n = require('../utils/i18n');
const toJson = require('../utils/to_json');
const _ = require('lodash');
const fs = require('fs');
const updateSimilaritiesCollection = require('../engine/analytics/manager').updateCollection;
let SimilaritiesWorker = function () { };
SimilaritiesWorker.prototype.process = (workPackage, callback) => {
    switch (workPackage.type) {
        case 'update-collection':
            updateSimilaritiesCollection(workPackage, callback);
            break;
        default:
            callback("Unknown type for workPackage: " + workPackage.type);
    }
};
module.exports = new SimilaritiesWorker();
