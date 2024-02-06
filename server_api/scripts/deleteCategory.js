const models = require('../models/index.cjs');

var categoryId = process.argv[2];

models.Category.findOne({
  where: {
    id: categoryId
  }
}).then(category => {
  category.deleted = true;
  category.save().then(() => {
    console.log("Done")
  });
});