const models = require('../models/index.cjs');
const async = require('async');
const moment = require('moment');
const domainId = process.argv[2];
const oldUserId = process.argv[3];
const newUserId = process.argv[4];
const beforeDate = process.argv[5];
const log = require('../utils/logger.cjs');
log.info("Fix wrong user id on status updated");
if (!domainId || !oldUserId || !newUserId || !beforeDate) {
    log.error("Missing parameters");
    process.exit();
}
else {
    let beforeDateObject = moment(beforeDate);
    models.User.findOne({
        where: {
            id: newUserId
        }
    }).then(function (newUser) {
        if (newUser) {
            models.AcActivity.findAll({
                where: {
                    domain_id: domainId,
                    type: 'activity.post.status.change',
                    user_id: oldUserId,
                    created_at: {
                        $lt: beforeDateObject
                    }
                }
            }).then(function (activities) {
                async.eachSeries(activities, function (activity, innerCallback) {
                    activity.user_id = newUser.id;
                    activity.save().then(function (results) {
                        log.info('Adding admin user to missing status updates for activities ' + newUser.email);
                        innerCallback();
                    });
                }, function (error) {
                    log.info("Completed");
                    process.exit();
                });
            });
        }
        else {
            log.error("Missing user");
            process.exit();
        }
    });
}
export {};
