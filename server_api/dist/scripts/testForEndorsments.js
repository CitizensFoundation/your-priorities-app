var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var userEmail = process.argv[2];
var ideaId = process.argv[3];
models.User.findOne({
    where: {
        email: userEmail
    },
    include: [
        {
            model: models.Endorsement
        }
    ]
}).then(function (user) {
    log.info(user.email);
    log.info(user.facebook_id);
    log.info(_.map(user.Endorsements, function (e) { return e.post_id + " " + e.created_at; }));
    log.info(user.Endorsements);
});
export {};
