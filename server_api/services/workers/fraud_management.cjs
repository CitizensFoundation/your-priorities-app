const async = require("async");
const models = require("../../models/index.cjs");
const log = require('../utils/logger.cjs');
const queue = require('./queue.cjs');
const i18n = require('../utils/i18n.cjs');
const toJson = require('../utils/to_json.cjs');
const _ = require('lodash');

const FraudGetEndorsements = require("../engine/moderation/fraud/FraudGetEndorsements.cjs");
const FraudGetPointQualities = require("../engine/moderation/fraud/FraudGetPointQualities.cjs");
const FraudGetRatings = require("../engine/moderation/fraud/FraudGetRatings.cjs");
const FraudGetPoints = require("../engine/moderation/fraud/FraudGetPoints.cjs");
const FraudGetPosts = require("../engine/moderation/fraud/FraudGetPosts.cjs");

const FraudDeleteEndorsements = require("../engine/moderation/fraud/FraudDeleteEndorsements.cjs");
const FraudDeleteRatings = require("../engine/moderation/fraud/FraudDeleteRatings.cjs");
const FraudDeletePointQualities = require("../engine/moderation/fraud/FraudDeletePointQualities.cjs");
const FraudDeletePoints = require("../engine/moderation/fraud/FraudDeletePoints.cjs");
const FraudDeletePosts = require("../engine/moderation/fraud/FraudDeletePosts.cjs");

let airbrake = null;
if(process.env.AIRBRAKE_PROJECT_ID) {
  airbrake = require('../utils/airbrake.cjs');
}

/**
 * @class FraudManagementWorker
 * @constructor
 */
function FraudManagementWorker() {}

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
    } else {
      done("Could not find engine");
    }

  } catch (error) {
    console.error(error);
    await models.AcBackgroundJob.updateErrorAsync(workPackage.jobId, error);
    done(error);
  }
}

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
    } else {
      done("Could not find engine");
    }
  } catch (error) {
    console.error(error);
    await models.AcBackgroundJob.updateErrorAsync(workPackage.jobId, error.toString());
    done(error);
  }
}

/**
 * Processes a fraud management work package.
 * @param {object} workPackage - The work package for fraud management.
 * @param {(error?: any) => void} callback - The callback function.
 * @memberof FraudManagementWorker
 */
FraudManagementWorker.prototype.process = async function(workPackage, callback) {
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

/** @type {FraudManagementWorker} */
module.exports = new FraudManagementWorker();
