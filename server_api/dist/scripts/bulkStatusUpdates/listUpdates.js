var models = require('../../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var id = process.argv[2];
models.BulkStatusUpdate.findAll({}).then(function (bulkStatusUpdates) {
    _.forEach(bulkStatusUpdates, function (update) {
        log.info("Update: " + update.id + " name: " + update.name);
    });
    process.exit();
}).catch(function (error) {
    log.error(error);
});
export {};
