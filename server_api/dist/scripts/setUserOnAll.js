var models = require('../models/index.cjs');
var async = require('async');
var userEmail = process.argv[2];
var user;
log.info("Adding " + userEmail + " to all public communities and groups + domains");
async.series([
    function (callback) {
        models.User.findOne({ where: { email: userEmail } }).then(function (incomingUser) {
            if (incomingUser) {
                user = incomingUser;
                log.info("Found user " + user.name);
                callback();
            }
            else {
                log.info("Can't find user");
            }
        });
    },
    function (callback) {
        models.Domain.findAll({}).then(function (models) {
            async.eachSeries(models, function (model, seriesCallback) {
                model.hasDomainUsers(user).then(function (results) {
                    if (!results) {
                        log.info("Adding users user for: " + model.name);
                        model.addDomainUsers(user).then(seriesCallback);
                    }
                    else {
                        log.info("Already users for for: " + model.name);
                        seriesCallback();
                    }
                });
            }, function () {
                callback();
            });
        });
    },
    function (callback) {
        models.Organization.findAll({}).then(function (models) {
            async.eachSeries(models, function (model, seriesCallback) {
                model.hasOrganizationUsers(user).then(function (results) {
                    if (!results) {
                        log.info("Adding users user for: " + model.name);
                        model.addOrganizationUsers(user).then(seriesCallback);
                    }
                    else {
                        log.info("Already users for for: " + model.name);
                        seriesCallback();
                    }
                });
            }, function () {
                callback();
            });
        });
    },
    function (callback) {
        models.Community.findAll({}).then(function (models) {
            async.eachSeries(models, function (model, seriesCallback) {
                model.hasCommunityUsers(user).then(function (results) {
                    if (!results) {
                        log.info("Adding users user for community: " + model.name);
                        model.addCommunityUsers(user).then(function () {
                            log.info("Im back");
                            seriesCallback();
                        });
                    }
                    else {
                        log.info("Already users for for: " + model.name);
                        seriesCallback();
                    }
                });
            }, function () {
                callback();
            });
        });
    },
    function (callback) {
        models.Group.findAll({}).then(function (models) {
            async.eachSeries(models, function (model, seriesCallback) {
                model.hasGroupUsers(user).then(function (results) {
                    if (!results) {
                        log.info("Adding users user for group: " + model.name);
                        model.addGroupUsers(user).then(function () {
                            log.info("Im back");
                            seriesCallback();
                        });
                    }
                    else {
                        log.info("Already users for for: " + model.name);
                        seriesCallback();
                    }
                });
            }, function () {
                callback();
            });
        });
    }
], function (error) {
    log.info("Finished");
    process.exit();
});
export {};
