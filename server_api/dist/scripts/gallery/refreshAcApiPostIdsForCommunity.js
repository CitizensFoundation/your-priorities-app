const queue = require('../../active-citizen/workers/queue.cjs');
const models = require("../../models/index.cjs");
(async () => {
    console.log("Start");
    let offset = 0;
    let count = 0;
    let continueFetching = true;
    const chunkSize = 100;
    const communityId = process.argv[2];
    const postsProcessed = {};
    while (continueFetching) {
        console.log(`Fetching posts ${offset} to ${offset + chunkSize - 1}...`);
        const posts = await models.Post.findAll({
            attributes: [
                "id", "name"
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
        for (let p = 0; p < posts.length; p++) {
            console.log(`${posts[p].id} ${posts[p].name}`);
            queue.add('process-similarities', { type: 'update-collection', postId: posts[p].id }, 'low');
            await new Promise(resolve => setTimeout(resolve, 150));
            count++;
            if (postsProcessed[posts[p].id]) {
                console.error(`Post ${posts[p].id} already processed!`);
            }
            else {
                postsProcessed[posts[p].id] = true;
            }
        }
        // Check if there are fewer posts than the chunk size, which indicates that it's the last chunk
        if (posts.length < chunkSize) {
            continueFetching = false;
        }
        else {
            offset += chunkSize;
        }
    }
    console.log(`Done. Processed ${count} posts.`);
})();
export {};
