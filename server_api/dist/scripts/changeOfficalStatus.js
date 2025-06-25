var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
const postId = process.argv[2];
const officialStatus = process.argv[3];
if (postId && officialStatus) {
    models.Post.findOne({
        where: {
            id: postId
        },
        attributes: ['id', 'user_id', 'official_status']
    }).then((post) => {
        if (post) {
            post.official_status = officialStatus;
            post.save().then(() => {
                log.info("Done changing status: " + officialStatus);
                process.exit();
            });
        }
        else {
            log.error("No post");
            process.exit();
        }
    });
}
else {
    log.error("Nothing is done!");
    process.exit();
}
export {};
