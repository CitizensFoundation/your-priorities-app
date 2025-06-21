const async = require("async");
const models = require("../../models/index.cjs");
const log = require("../../utils/logger.cjs");
const queue = require("./queue.cjs");
const i18n = require("../utils/i18n.cjs");
const toJson = require("../utils/to_json.cjs");
const _ = require("lodash");

const {
  addPlausibleEvent,
} = require("../engine/analytics/plausible/manager.cjs");
const { recountGroupFolder } = require("./recount.cjs");

let airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
  airbrake = require("../utils/airbrake.cjs");
}

/**
 * @class DelayedJobWorker
 * @constructor
 */
function DelayedJobWorker() {}

const delayedCreatePriorityActivity = (workPackage, callback) => {
  const options = workPackage.workData;

  var context, actor, object;

  if (options.object) object = options.object;
  else object = {};

  if (options.context) context = options.context;
  else context = {};

  if (options.actor) actor = options.actor;
  else actor = {};

  if (options.userId) actor["userId"] = options.userId;

  if (options.domainId) object["domainId"] = options.domainId;

  if (options.communityId) object["communityId"] = options.communityId;

  if (options.groupId) object["groupId"] = options.groupId;

  if (options.postId) object["postId"] = options.postId;

  if (options.pointId) object["pointId"] = options.pointId;

  if (options.endorsementId) object["endorsementId"] = options.endorsementId;

  if (options.pointQualityId) object["pointQualityId"] = options.pointQualityId;

  if (options.ratingId) object["ratingId"] = options.ratingId;

  async.series(
    [
      // Checking for missing values for community or group if its a post related event
      function (seriesCallback) {
        if (
          options.postId == null ||
          (options.groupId && options.communityId)
        ) {
          seriesCallback();
        } else if (options.groupId) {
          models.Group.findOne({
            where: { id: options.groupId },
            attributes: ["id", "community_id"],
          })
            .then(function (group) {
              if (group) {
                log.info("Found group info for post acitivity from app");
                options.communityId = group.community_id;
                seriesCallback();
              } else {
                seriesCallback("Can't find group");
              }
            })
            .catch(function (error) {
              seriesCallback(error);
            });
        } else if (options.postId) {
          log.info("Looking for post, group and community START");
          models.Post.findOne({
            where: { id: options.postId },
            attributes: ["id", "group_id"],
            include: [
              {
                model: models.Group,
                attributes: ["id", "community_id"],
              },
            ],
          })
            .then(function (post) {
              log.info("Looking for post, group and community END");
              if (post) {
                log.info("Found post info for post acitivity from app");
                options.groupId = post.Group.id;
                options.communityId = post.Group.community_id;
                seriesCallback();
              } else {
                seriesCallback("Can't find post");
              }
            })
            .catch(function (error) {
              seriesCallback(error);
            });
        } else {
          seriesCallback(
            "Strange state of create ac activity looking up community id"
          );
        }
      },
    ],
    function (error) {
      if (error) {
        callback(error);
      } else {
        models.AcActivity.build({
          type: options.type,
          status: "active",
          sub_type: options.subType,
          actor: actor,
          object: object,
          context: context,
          user_id: options.userId,
          domain_id: options.domainId,
          community_id: options.communityId,
          group_id: options.groupId,
          post_id: options.postId,
          point_id: options.pointId,
          post_status_change_id: options.postStatusChangeId,
          access: !isNaN(options.access)
            ? options.access
            : models.AcActivity.ACCESS_PRIVATE,
        })
          .save()
          .then(function (activity) {
            if (activity) {
              if (activity.type != "activity.fromApp") {
                queue.add("process-activity", activity, "high");
              }
              log.info("Activity Created", {
                activityId: activity.id,
                userId: options.userId,
              });
              callback();
            } else {
              callback("Activity Not Found");
            }
          })
          .catch(function (error) {
            log.error("Activity Created Error", { err: error });
            callback(error);
          });
      }
    }
  );
};

const delayedCreateActivityFromApp = (workPackage, callback) => {
  const workData = workPackage.workData;

  models.AcClientActivity.build({
    type: "activity.fromApp",
    sub_type: workData.body.type,
    actor: { appActor: workData.body.actor },
    object: {
      name: workData.body.object,
      target: workData.body.target,
    },
    context: {
      pathName: workData.body.path_name,
      name: workData.body.context,
      eventTime: workData.body.event_time,
      sessionId: workData.body.sessionId,
      userAgent: workData.body.user_agent,
      userLocale: workData.body.userLocale,
      userAutoTranslate: workData.body.userAutoTranslate,
      server_timestamp: workData.body.server_timestamp,
      url: workData.body.url,
      screenWidth: workData.body.screen_width,
      referrer: workData.body.referrer,
      ipAddress: workData.body.ipAddress,
      object: workData.body.object,
      type: workData.body.type,
      useTypeNameUnchanged: workData.body.useTypeNameUnchanged,
      originalQueryString: workData.body.originalQueryString,
      props: workData.body.props,
    },
    user_id: workData.userId,
    domain_id: workData.domainId,
    point_id: workData.pointId,
    group_id: workData.groupId ? parseInt(workData.groupId) : null,
    community_id: workData.communityId,
    post_id: workData.postId ? parseInt(workData.postId) : null,
  })
    .save()
    .then(async (clientActivity) => {
      if (!clientActivity) {
        log.error("Client Activity not created", {
          context: "createClientActivity",
          errorStatus: 500,
        });
      }

      if (process.env.PLAUSIBLE_API_KEY) {
        let plausibleEvent;

        if (workData.body.type === "pageview") {
          plausibleEvent = `pageview`;
        } else if (
          !workData.body.useTypeNameUnchanged &&
          workData.body.object
        ) {
          plausibleEvent = `${workData.body.object} - ${workData.body.type}`;
        } else {
          plausibleEvent = workData.body.type;
        }

        try {
          await addPlausibleEvent(plausibleEvent, workData);
          callback();
        } catch (error) {
          callback(error);
        }
      } else {
        callback();
      }
    })
    .catch(function (error) {
      log.error("Client Activity Created Error", {
        context: "createClientActivity",
        err: error,
      });
      callback(error);
    });
};

/**
 * Processes a delayed job.
 * @param {object} workPackage - The work package for the delayed job.
 * @param {(error?: any) => void} callback - The callback function.
 * @memberof DelayedJobWorker
 */
DelayedJobWorker.prototype.process = function(workPackage, callback) {
  switch (workPackage.type) {
    case "create-activity-from-app":
      delayedCreateActivityFromApp(workPackage, callback);
      break;
    case "create-priority-activity":
      delayedCreatePriorityActivity(workPackage, callback);
      break;
    case "recount-group-folder":
      recountGroupFolder(workPackage, callback);
      break;
    default:
      callback("Unknown type for workPackage: " + workPackage.type);
  }
};

/** @type {DelayedJobWorker} */
module.exports = new DelayedJobWorker();
