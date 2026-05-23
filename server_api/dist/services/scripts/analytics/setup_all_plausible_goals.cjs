"use strict";
const { addAllPlausibleGoals } = require("../../engine/analytics/plausible/manager");
const log = require("../../../utils/logger.cjs");
(async function () {
    try {
        await addAllPlausibleGoals();
        log.info("All done");
        process.exit();
    }
    catch (error) {
        log.error(error);
        process.exit();
    }
})();
