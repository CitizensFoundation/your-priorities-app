if(process.env.AIRBRAKE_PROJECT_ID) {
  const Airbrake = require('@airbrake/node');
  let airBrake = null;

  try {
    airBrake = new Airbrake.Notifier({
      projectId: process.env.AIRBRAKE_PROJECT_ID,
      projectKey: process.env.AIRBRAKE_API_KEY,
      performanceStats: false
    });
  } catch (error) {
    airBrake = null;
    log.error(error);
  }

  module.exports = airBrake;
}
