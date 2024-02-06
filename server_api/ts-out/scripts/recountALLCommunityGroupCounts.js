const models = require('../models/index.cjs');
const async = require('async');
const ip = require('ip');
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
                console.log(`Updated Community ${community.id} to ${count}`);
                forEachCallback();
            }).catch(error => {
                forEachCallback(error);
            });
        }).catch(error => {
            forEachCallback(error);
        });
    }, (error) => {
        console.log(error);
        process.exit();
    });
}).catch(error => {
    if (error)
        console.error(error);
    else
        console.log(done);
    process.exit();
});
export {};
