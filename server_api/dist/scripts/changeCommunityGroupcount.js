var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
const communityId = process.argv[2];
const groupCount = process.argv[3];
if (communityId && groupCount) {
    models.communityId.findOne({
        where: {
            id: postId
        },
        attributes: ['id', 'counter_groups']
    }).then((community) => {
        if (community) {
            community.counter_groups = groupCount;
            community.save().then(() => {
                log.info("Done");
                process.exit();
            });
        }
        else {
            log.error("No community");
            process.exit();
        }
    });
}
else {
    log.error("Nothing is done!");
    process.exit();
}
export {};
