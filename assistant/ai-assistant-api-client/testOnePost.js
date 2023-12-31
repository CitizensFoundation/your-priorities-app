const models = require('../../../../models');
const _ = require('lodash');
const async = require('async');
const log = require('../../../../utils/logger');
const updateCollection = require('./aiAssistantClient').updateCollection;

if (process.env["AC_AI_ASSISTANT_KEY"] && process.env["AC_AI_ASSISTANT_BASE_URL"] ) {
  //const communityId = 161;
  //const communityId = 4314;
  const communityId = 6176;

  if (true) {
    updateCollection({
      //    postId: 71592
       communityId: communityId
        }, (error, result) => {
          if (error)
            console.error(error);
        });
  } else {
    models.Post.findAll({
      attributes: ['id'],
      where: {
        status: 'published'
      },
      include: [
        {
          model: models.Group,
          attributes: ['id'],
          required: true,
          include: [
            {
              model: models.Community,
              attributes: ['id'],
              required: true,
              where: {
                id: communityId
              }
            }
         ]
        }
      ]}).then((posts) => {
        async.forEachOfSeries(posts, (post, index, callback) => {
          console.log(`Updating post ${post.id} (${index+1}/${posts.length})`);
          updateCollection({
            //    postId: 71592
                postId: post.id
              }, (error, result) => {
                if (error)
                  console.error(error);
                callback();
              });
        }, (err) => {
          if (err) {
            console.error(err);
            process.exit();
          } else {
            console.log("Finished updating posts");
            process.exit();
          }
        })
      }).catch(function (error) {
        console.error(error);
        process.exit();
      })

  }

} else {
  console.error("NO AC_AI_ASSISTANT_KEY");
  process.exit();
}
