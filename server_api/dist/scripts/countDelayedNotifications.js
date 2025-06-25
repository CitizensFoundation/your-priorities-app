var models = require('../models/index.cjs');
var async = require('async');
models.AcDelayedNotification.findAll({
    include: [
        {
            model: models.AcActivity,
            as: 'AcDelayedNotifications'
        }
    ]
}).then(function (notifications) {
    async.eachSeries(notifications, function (notification, seriesCallback) {
        log.info("Notification: " + notification.id);
        log.info("User id: " + notification.user_id);
        log.info("Number of delayed notifications:" + notification.AcActivity.length);
        seriesCallback();
    });
});
export {};
