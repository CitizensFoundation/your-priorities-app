"use strict";
var models = require('../models');
var async = require('async');
var ip = require('ip');
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
                console.log("Done");
                process.exit();
            });
        }
        else {
            console.error("No community");
            process.exit();
        }
    });
}
else {
    console.error("Nothing is done!");
    process.exit();
}
