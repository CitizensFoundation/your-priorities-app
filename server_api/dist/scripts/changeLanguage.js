var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
const modelType = process.argv[2];
const modelId = process.argv[3];
const language = process.argv[4];
if (modelType === "post") {
    models.Post.findOne({
        where: {
            id: modelId
        },
        attributes: ['id', 'language']
    }).then((post) => {
        if (post) {
            post.language = language;
            post.save().then(() => {
                log.info("Done");
                process.exit();
            });
        }
        else {
            log.error("No post");
            process.exit();
        }
    });
}
else if (modelType === "point") {
    models.Point.findOne({
        where: {
            id: modelId
        },
        attributes: ['id', 'language']
    }).then((point) => {
        if (point) {
            point.language = language;
            point.save().then(() => {
                log.info("Done");
                process.exit();
            });
        }
        else {
            log.error("No point");
            process.exit();
        }
    });
}
else {
    process.exit();
}
export {};
