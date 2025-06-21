const queue = require('../../services/workers/queue.cjs');
const models = require("../../models/index.cjs");

(async () => {
  log.info("Start")
  let offset = 0;
  let count= 0;
  let continueFetching = true;
  const chunkSize= 100;
  const communityId = process.argv[2];
  const postsProcessed = {};

  while (continueFetching) {
    log.info(`Fetching posts ${offset} to ${offset + chunkSize - 1}...`)
    const posts = await models.Post.findAll({
      attributes: [
        "id","name"
      ],
      include: [
        {
          model: models.Group,
          attributes: ['id'],
          include: [
            {
              model: models.Community,
              attributes: ['id'],
              where: {
                id: process.argv[2]
              }
            }
          ]
        }
      ],
      limit: chunkSize,
      offset: offset
    });

    // Process the posts
    for (let p=0; p<posts.length; p++) {
      log.info(`${posts[p].id} ${posts[p].name}`);
      queue.add('process-similarities', { type: 'update-collection', postId: posts[p].id }, 'low');
      await new Promise(resolve => setTimeout(resolve, 150));
      count++;
      if (postsProcessed[posts[p].id]) {
        log.error(`Post ${posts[p].id} already processed!`);
      } else {
        postsProcessed[posts[p].id] = true;
      }
    }

    // Check if there are fewer posts than the chunk size, which indicates that it's the last chunk
    if (posts.length < chunkSize) {
      continueFetching = false;
    } else {
      offset += chunkSize;
    }
  }

  log.info(`Done. Processed ${count} posts.`)
})();

