const models = require('../models/index.cjs');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
models.Community.findAll({
    attributes: ['id', 'counter_groups']
}).then(allCommunities => {
    async.forEachLimit(allCommunities, 5, (community, forEachCallback) => {
        models.Group.count({
            where: {
                community_id: community.id
            }
        }).then(count => {
            community.update({
                counter_groups: count
            }).then(() => {
                log.info(`Updated Community ${community.id} to ${count}`);
                forEachCallback();
            }).catch(error => {
                forEachCallback(error);
            });
        }).catch(error => {
            forEachCallback(error);
        });
    }, (error) => {
        log.info(error);
        process.exit();
    });
}).catch(error => {
    if (error)
        log.error(error);
    else
        log.info(done);
    process.exit();
});
export {};
