const models = require('../../models');

models.sequelize.sync().then(() => {
  models.Post.addFullTextIndex();
});
