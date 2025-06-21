const models = require("../../models/index.cjs");
const domainId = process.argv[2];
const useNewVersionStatus = process.argv[3];

models.Domain.findOne({ where: { id: domainId } }).then(async (domain) => {
  if (domain) {
    log.info("Domain " + domain.domain_name);
    if (useNewVersionStatus === "true" || useNewVersionStatus === "false") {
      domain.set(
        "configuration.useNewVersion",
        useNewVersionStatus === "true" ? true : false
      );
      domain.changed("configuration", true);
      await domain.save();
      log.info("Set useNewVersionStatus to " + useNewVersionStatus);
    } else {
      log.info("Invalid useNewVersionStatus");
    }
    process.exit();
  } else {
    log.info("Can't find user");
    process.exit();
  }
});
