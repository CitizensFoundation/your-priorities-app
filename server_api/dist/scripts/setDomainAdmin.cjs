"use strict";
var models = require('../models/index.cjs');
var async = require('async');
const log = require('../utils/logger.cjs');
var userEmail = process.argv[2];
var domainId = process.argv[3];
var user;
log.info("Adding " + userEmail + " as admin to domain " + domainId);
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
                callback("Cant find user");
            }
        });
    },
    function (callback) {
        models.Domain.findOne({
            where: {
                id: domainId
            }
        }).then(function (domain) {
            domain.hasDomainAdmins(user).then(function (results) {
                if (!results) {
                    log.info("Adding admin user for: " + domain.name);
                    domain.addDomainAdmins(user).then(callback);
                }
                else {
                    log.info("Already admin for for: " + domain.name);
                    callback();
                }
            });
        });
    }
], function (error) {
    log.info("Finished");
    process.exit();
});
