const models = require('../models/index.cjs');
const async = require('async');
const fromId = parseInt(process.argv[2]);
const toId = parseInt(process.argv[3]);
const log = require('../utils/logger.cjs');
let currentId = fromId;
async.whilst(() => { return currentId <= toId; }, (callback) => {
    let currentFrom = currentId;
    let currentTo = Math.min(currentId + 200, toId);
    log.info("Deleting ids from " + currentFrom + " to " + currentTo);
    models.AcActivity.destroy({
        where: {
            type: 'activity.fromApp',
            $and: [
                {
                    "id": {
                        $gte: currentFrom
                    }
                },
                {
                    "id": {
                        $lte: currentTo
                    }
                },
            ]
        }
    }).then((results) => {
        log.info(results);
        currentId += 200;
        callback();
    });
}, (error) => {
    if (error) {
        log.error(error);
    }
    else {
        log.info("Have updated deleted all requested acitivities");
    }
    process.exit();
});
export {};
