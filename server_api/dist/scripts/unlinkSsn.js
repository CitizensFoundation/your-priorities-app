var models = require('../models/index.cjs');
var async = require('async');
var ssn = process.argv[2];
log.info("Unlinking " + ssn + " from user");
models.User.findOne({
    where: {
        ssn: ssn
    }
}).then(function (user) {
    if (user) {
        log.info("Unlinking " + ssn + " from " + user.email);
        user.ssn = null;
        user.save().then(function () {
            log.info("Completed unlinking " + ssn + " from " + user.email);
            process.exit();
        });
    }
    else {
        log.info("Not found");
        process.exit();
    }
});
export {};
