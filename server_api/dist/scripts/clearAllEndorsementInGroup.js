var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var groupId = process.argv[2];
models.Post.unscoped().findAll({
    where: {
        group_id: groupId
    },
    attributes: ['id', 'counter_endorsements_up', "counter_endorsements_down"],
    include: [
        {
            model: models.Endorsement,
            attributes: ['id', 'deleted'],
            required: false
        }
    ]
}).then((posts) => {
    async.eachSeries(posts, (post, callback) => {
        post.counter_endorsements_up = 0;
        post.counter_endorsements_down = 0;
        post.save().then(() => {
            async.eachSeries(post.Endorsements, (endorsement, innerCallback) => {
                endorsement.deleted = true;
                endorsement.save().then(() => {
                    log.info(`Deleted endorsement for id ${endorsement.id}`);
                    innerCallback();
                }).catch(error => {
                    innerCallback(error);
                });
            }, (error) => {
                log.info(`Cleared endorsement for post id ${post.id}`);
                callback(error);
            });
        }).catch(error => {
            callback(error);
        });
    }, (error) => {
        if (error) {
            log.error(error);
        }
        else {
            log.info("Done clearing");
        }
        process.exit();
    });
}).catch(error => {
    log.error(error);
    process.exit();
});
export {};
