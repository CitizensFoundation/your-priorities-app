const { addAllPlausibleGoals } = require("../../engine/analytics/plausible/manager");

(async function() {
  try {
    await addAllPlausibleGoals();
    log.info("All done");
    process.exit();
  } catch (error) {
    log.error(error);
    process.exit();
  }
})();

