const async = require("async");
const models = require("../../models/index.cjs");
const log = require('../../utils/logger.cjs');
const queue = require('./queue.cjs');
const i18n = require('../utils/i18n.cjs');
const toJson = require('../utils/to_json.cjs');
const _ = require('lodash');
const fs = require('fs');
const PostLabeling = require("../engine/moderation/image_labeling/PostLabeling.cjs");
const PointLabeling = require("../engine/moderation/image_labeling/PointLabeling.cjs");
const GroupLabeling = require("../engine/moderation/image_labeling/GroupLabeling.cjs");
const CommunityLabeling = require("../engine/moderation/image_labeling/CommunityLabeling.cjs");
const estimateToxicityScoreForPost = require('../engine/moderation/toxicity_analysis.cjs').estimateToxicityScoreForPost;
const estimateToxicityScoreForPoint = require('../engine/moderation/toxicity_analysis.cjs').estimateToxicityScoreForPoint;
const estimateToxicityScoreForCollection = require('../engine/moderation/toxicity_analysis.cjs').estimateToxicityScoreForCollection;
const performManyModerationActions = require("../engine/moderation/process_moderation_items.cjs").performManyModerationActions;

let airbrake = null;
if(process.env.AIRBRAKE_PROJECT_ID) {
  airbrake = require('../utils/airbrake.cjs');
}

/**
 * @class ModerationWorker
 * @constructor
 */
function ModerationWorker() {}

/**
 * Processes a moderation work package.
 * @param {object} workPackage - The work package for moderation.
 * @param {(error?: any) => void} callback - The callback function.
 * @memberof ModerationWorker
 */
ModerationWorker.prototype.process = async function(workPackage, callback) {
  switch (workPackage.type) {
    case 'estimate-post-toxicity':
      estimateToxicityScoreForPost(workPackage, callback);
      break;
    case 'estimate-point-toxicity':
      estimateToxicityScoreForPoint(workPackage, callback);
      break;
    case 'estimate-collection-toxicity':
      estimateToxicityScoreForCollection(workPackage, callback);
      break;
    case 'post-review-and-annotate-images':
      try {
        await new PostLabeling(workPackage).reviewAndLabelVisualMedia();
        callback();
      } catch (error) {
        callback(error);
      }
      break;
    case 'point-review-and-annotate-images':
      try {
        await new PointLabeling(workPackage).reviewAndLabelVisualMedia();
        callback();
      } catch (error) {
        callback(error);
      }
      break;
    case 'collection-review-and-annotate-images':
      try {
        if (workPackage.collectionType === 'community') {
          await new CommunityLabeling(workPackage).reviewAndLabelVisualMedia();
        } else if (workPackage.collectionType === 'group') {
          await new GroupLabeling(workPackage).reviewAndLabelVisualMedia();
        }
        callback();
      } catch (error) {
        callback(error);
      }
      break;
    case 'perform-many-moderation-actions':
      performManyModerationActions(workPackage, callback);
      break;
    default:
      callback("Unknown type for workPackage: " + workPackage.type);
  }
};

/** @type {ModerationWorker} */
module.exports = new ModerationWorker();
