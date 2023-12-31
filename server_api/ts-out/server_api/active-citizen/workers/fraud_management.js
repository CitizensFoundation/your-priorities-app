"use strict";
const async = require("async");
const models = require("../../models");
const log = require('../utils/logger');
const queue = require('./queue');
const i18n = require('../utils/i18n');
const toJson = require('../utils/to_json');
const _ = require('lodash');
const FraudGetEndorsements = require("../engine/moderation/fraud/FraudGetEndorsements");
const FraudGetPointQualities = require("../engine/moderation/fraud/FraudGetPointQualities");
const FraudGetRatings = require("../engine/moderation/fraud/FraudGetRatings");
const FraudGetPoints = require("../engine/moderation/fraud/FraudGetPoints");
const FraudGetPosts = require("../engine/moderation/fraud/FraudGetPosts");
const FraudDeleteEndorsements = require("../engine/moderation/fraud/FraudDeleteEndorsements");
const FraudDeleteRatings = require("../engine/moderation/fraud/FraudDeleteRatings");
const FraudDeletePointQualities = require("../engine/moderation/fraud/FraudDeletePointQualities");
const FraudDeletePoints = require("../engine/moderation/fraud/FraudDeletePoints");
const FraudDeletePosts = require("../engine/moderation/fraud/FraudDeletePosts");
let airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake');
}
let FraudManagementWorker = function () { };
const ProcessFraudGet = async (workPackage, done) => {
    let fraudGetEngine;
    try {
        switch (workPackage.collectionType) {
            case "endorsements":
                fraudGetEngine = new FraudGetEndorsements(workPackage);
                break;
            case "ratings":
                fraudGetEngine = new FraudGetRatings(workPackage);
                break;
            case "pointQualities":
                fraudGetEngine = new FraudGetPointQualities(workPackage);
                break;
            case "points":
                fraudGetEngine = new FraudGetPoints(workPackage);
                break;
            case "posts":
                fraudGetEngine = new FraudGetPosts(workPackage);
                break;
        }
        if (fraudGetEngine) {
            await fraudGetEngine.processAndGetFraudItems();
            done();
        }
        else {
            done("Could not find engine");
        }
    }
    catch (error) {
        console.error(error);
        await models.AcBackgroundJob.updateErrorAsync(workPackage.jobId, error);
        done(error);
    }
};
const ProcessFraudDelete = async (workPackage, done) => {
    let fraudDeleteEngine;
    try {
        switch (workPackage.collectionType) {
            case "endorsements":
                fraudDeleteEngine = new FraudDeleteEndorsements(workPackage);
                break;
            case "ratings":
                fraudDeleteEngine = new FraudDeleteRatings(workPackage);
                break;
            case "pointQualities":
                fraudDeleteEngine = new FraudDeletePointQualities(workPackage);
                break;
            case "points":
                fraudDeleteEngine = new FraudDeletePoints(workPackage);
                break;
            case "posts":
                fraudDeleteEngine = new FraudDeletePosts(workPackage);
                break;
        }
        if (fraudDeleteEngine) {
            await fraudDeleteEngine.deleteItems();
            done();
        }
        else {
            done("Could not find engine");
        }
    }
    catch (error) {
        console.error(error);
        await models.AcBackgroundJob.updateErrorAsync(workPackage.jobId, error.toString());
        done(error);
    }
};
FraudManagementWorker.prototype.process = async (workPackage, callback) => {
    switch (workPackage.type) {
        case 'delete-one-item':
        case 'delete-items':
            await ProcessFraudDelete(workPackage, callback);
            break;
        case 'delete-job':
            await models.AcBackgroundJob.destroyJobAsync(workPackage.jobId);
            callback();
            break;
        case 'get-items':
            await ProcessFraudGet(workPackage, callback);
            break;
        default:
            callback("Unknown type for workPackage: " + workPackage.type);
    }
};
module.exports = new FraudManagementWorker();
