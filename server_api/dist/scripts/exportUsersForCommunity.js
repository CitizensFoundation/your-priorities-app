var models = require('../models/index.cjs');
var async = require('async');
var communityId = process.argv[2];
models.Community.findOne({
    where: {
        id: communityId
    },
    include: [
        {
            model: models.User,
            as: 'CommunityUsers'
        }
    ]
}).then(function (community) {
    log.info(community.CommunityUsers.length);
    log.info("email, Name");
    async.eachSeries(community.CommunityUsers, function (user, seriesCallback) {
        log.info('"' + user.email + '","' + user.name + '"');
        seriesCallback();
    }, function () {
        process.exit();
    });
});
export {};
