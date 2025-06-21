const models = require('../models/index.cjs');

var postId = process.argv[2];

log.info(`Id,PostId,TypeIndex,Value`);
models.Rating.findAll({
  where: {
    post_id: postId
  },
  attributes: ['id','post_id','value','type_index']
}).then(ratings => {
  ratings.forEach( rating => {
    log.info(`${rating.id},${rating.post_id},${rating.type_index},${rating.value}`)
  });
  process.exit();
});