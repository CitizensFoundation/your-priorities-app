"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { addAllPlausibleGoals } = require("../../engine/analytics/plausible/manager");
(async function () {
    try {
        await addAllPlausibleGoals();
        console.log("All done");
        process.exit();
    }
    catch (error) {
        console.error(error);
        process.exit();
    }
})();
