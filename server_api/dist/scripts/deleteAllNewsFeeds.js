var models = require('../models/index.cjs');
var async = require('async');
models.AcNewsFeedItem.destroy({ truncate: true }).then(function (results) {
    log.info("Have destroyed AcNewsFeedItems");
    models.AcNewsFeedProcessedRange.destroy({ truncate: true }).then(function (results) {
        log.info("Have destroyed AcNewsFeedProcessedRange");
        process.exit();
    });
});
export {};
