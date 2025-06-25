var models = require('../models/index.cjs');
var async = require('async');
var domainId = process.argv[2];
models.PostStatusChange.findAll({
    include: [
        {
            model: models.Post,
            attributes: ['id'],
            required: true,
            include: [
                {
                    model: models.Group,
                    attributes: ['id'],
                    where: {
                        access: models.Group.ACCESS_PUBLIC
                    },
                    required: true
                }
            ]
        }
    ]
}).then(function (updates) {
    async.eachSeries(updates, function (update, seriesCallback) {
        if (update.content) {
            log.info("------------------------------------------ STATUS CHANGE ID " + update.id + " ------------------------------------------");
            log.info("\n");
            log.info(update.content);
            log.info("\n");
        }
        seriesCallback();
    }, function () {
        process.exit();
        log.info("Done");
    });
});
export {};
