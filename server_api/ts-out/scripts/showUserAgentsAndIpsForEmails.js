var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');
emails = [];
async.eachSeries(emails, (email, eachOfCallback) => {
    models.User.findOne({
        where: {
            email: email
        }
    }).then((user) => {
        if (user) {
            console.log("\n\n\nemail: " + user.email) + "\n";
            let userAgent = null;
            let ipAddress = null;
            async.series([
                (seriesCallback) => {
                    models.Endorsement.findOne({
                        where: {
                            user_id: user.id
                        }
                    }).then((endorsement) => {
                        if (endorsement) {
                            ipAddress = endorsement.ip_address;
                            userAgent = endorsement.user_agent;
                        }
                        seriesCallback();
                    });
                },
                (seriesCallback) => {
                    models.Point.findOne({
                        where: {
                            user_id: user.id
                        }
                    }).then((point) => {
                        if (point) {
                            ipAddress = point.ip_address;
                            userAgent = point.user_agent;
                        }
                        seriesCallback();
                    });
                },
                (seriesCallback) => {
                    models.Post.findOne({
                        where: {
                            user_id: user.id
                        }
                    }).then((post) => {
                        if (post) {
                            ipAddress = post.ip_address;
                            userAgent = post.user_agent;
                        }
                        seriesCallback();
                    });
                },
            ], (error) => {
                console.log(ipAddress);
                console.log(userAgent);
                eachOfCallback();
            });
        }
        else {
            console.error("NOT FOUND: " + email);
            eachOfCallback();
        }
    });
});
export {};
