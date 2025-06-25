var models = require('../models/index.cjs');
var async = require('async');
models.Post.findAll().then(function (posts) {
    async.eachSeries(posts, function (post, callback) {
        if (post.official_status != 0) {
            log.info(post.official_status);
            log.info(post.group_id);
        }
        if (post.status != 'published') {
            log.info(post.status);
        }
        callback();
    }, function done() {
        log.info("DONE");
    });
});
export {};
