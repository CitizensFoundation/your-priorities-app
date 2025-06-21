var models = require("../models/index.cjs");

var questionId = process.argv[2];
var groupId = process.argv[3];

log.info(
  "Adding pariwise question id " + questionId + " to group " + groupId
);

models.Group.findOne({
  where: {
    id: groupId,
  },
})
  .then((group) => {
    if (
      group.configuration.allOurIdeas &&
      group.configuration.allOurIdeas.earl
    ) {
      group.set("configuration.allOurIdeas.earl.question_id", questionId);
      group.set("configuration.allOurIdeas.earl.question.id", questionId);
      group.save().then(() => {
        log.info("Finished");
        process.exit();
      });
    } else {
      log.info("Group does not have allOurIdeas configuration");
      process.exit();
    }
  })
  .catch((error) => {
    log.info("Error: ", error);
    process.exit();
  });
