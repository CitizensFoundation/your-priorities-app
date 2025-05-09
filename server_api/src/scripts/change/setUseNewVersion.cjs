const models = require("../../models/index.cjs");
const domainId = process.argv[2];
const useNewVersionStatus = process.argv[3];

models.Domain.findOne({ where: { id: domainId } }).then(async (domain) => {
  if (domain) {
    console.log("Domain " + domain.domain_name);
    if (useNewVersionStatus === "true" || useNewVersionStatus === "false") {
      domain.set(
        "configuration.useNewVersion",
        useNewVersionStatus === "true" ? true : false
      );
      await domain.save();
      console.log("Set useNewVersionStatus to " + useNewVersionStatus);
    } else {
      console.log("Invalid useNewVersionStatus");
    }
    process.exit();
  } else {
    console.log("Can't find user");
    process.exit();
  }
});
