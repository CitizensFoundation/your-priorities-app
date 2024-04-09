var models = require("../models/index.cjs");

var questionId = process.argv[2];
var groupId = process.argv[3];

console.log(
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
        console.log("Finished");
        process.exit();
      });
    } else {
      console.log("Group does not have allOurIdeas configuration");
      process.exit();
    }
  })
  .catch((error) => {
    console.log("Error: ", error);
    process.exit();
  });
