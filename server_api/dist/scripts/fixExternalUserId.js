var models = require('../models/index.cjs');
var async = require('async');
models.User.findAll({
    attributes: ['id', 'profile_data']
}).then((users) => {
    async.forEachSeries(users, (user, callback) => {
        if (user.profile_data && user.profile_data.trackingParameters && user.profile_data.trackingParameters.externalUserID) {
            user.set('profile_data.trackingParameters.externalUserId', user.profile_data.trackingParameters.externalUserID);
            user.save().then(() => {
                callback();
            });
        }
        else {
            callback();
        }
    }, (error) => {
        log.info("Done");
        if (error)
            log.error(error);
        process.exit();
    });
});
export {};
// profile_data.trackingParameters.externalUserId
