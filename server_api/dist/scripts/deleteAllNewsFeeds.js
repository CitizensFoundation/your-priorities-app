var models = require('../models/index.cjs');
var async = require('async');
models.AcNewsFeedItem.destroy({ truncate: true }).then(function (results) {
    console.log("Have destroyed AcNewsFeedItems");
    models.AcNewsFeedProcessedRange.destroy({ truncate: true }).then(function (results) {
        console.log("Have destroyed AcNewsFeedProcessedRange");
        process.exit();
    });
});
export {};
