var models = require('../../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var moment = require('moment');

var id = process.argv[2];

const updatedConfig = { groups: [], emailHeader: "", emailFooter: "" };
const newConfig = { groups: [], emailHeader: "", emailFooter: "" };

let bulkStatusUpdate;

const getUpdatedPostsForGroup = (groupId) => {
  for (let i=0;i<updatedConfig.groups.length;i++) {
    if (updatedConfig.groups[i].id==groupId){
      return updatedConfig.groups[i].posts;
    }
  }
  console.error("Found no posts for group id: "+groupId);
  return [];
}

const hasPost = (updatePosts, post) => {
  for (let i=0;i<updatePosts.length;i++) {
    if (updatePosts[i].id==post.id) {
      return true;
    }
  }
  return false;
}

const getUpdatedPosts = (currentPosts, updatedPosts, currentGroupName) => {
  const posts = [];

  for (let i = 0; i < currentPosts.length; i++) {
    if (hasPost(updatedPosts, currentPosts[i])) {
      posts.push(currentPosts[i]);
    } else {
      console.log(`Post removed from ${currentGroupName}: ${currentPosts[i].name}`)
    }
  }

  for (let i = 0; i < updatedPosts.length; i++) {
    if (!hasPost(currentPosts, updatedPosts[i])) {
      posts.push(updatedPosts[i]);
      console.log(`Post added to ${currentGroupName}: ${updatedPosts[i].name}`)
    }
  }

  return posts;
}

async.series([
  seriesCallback => {
    models.BulkStatusUpdate.findOne({
      where: {
        id: id
      }
    }).then(update => {
      bulkStatusUpdate = update;
      models.Group.findAll({
        where: {
          community_id: update.community_id
        }
      }).then((groups) => {
        async.eachSeries(groups, (group, seriesCallback) => {
          const configPosts = [];

          models.Post.findAll({
            where: {
              group_id: group.id
            }
          }).then((posts) => {
            async.eachSeries(posts, (post, innerSeriesCallback) => {
              configPosts.push({
                id: post.id, name: post.name, location: post.location,
                currentOfficialStatus: post.official_status, newOfficialStatus: null,
                selectedTemplateTitle: null, uniqueStatusMessage: null, moveToGroupId: null
              });
              innerSeriesCallback();
            }, (error) => {
              updatedConfig.groups.push({id: group.id, name: group.name, posts: configPosts});
              seriesCallback();
            });
          });
        }, (error) => {
          seriesCallback(error);
        });
      });
    }).catch( error=> {
      seriesCallback(error);
    })
  },
  seriesCallback => {
    const currentConfig = bulkStatusUpdate.config;

    for (let i=0;i<currentConfig.groups.length;i++) {
      const currentPosts = currentConfig.groups[i].posts;
      const updatedPosts = getUpdatedPostsForGroup(currentConfig.groups[i].id);

      const newGroup = {
        id: currentConfig.groups[i].id,
        name: currentConfig.groups[i].name,
        posts: getUpdatedPosts(currentPosts, updatedPosts, currentConfig.groups[i].name)
      }
      newConfig.groups.push(newGroup)
    }

    bulkStatusUpdate.set('config', newConfig);
    bulkStatusUpdate.save().then( () => {
      seriesCallback();
    }).catch( error => {
      seriesCallback(error);
    })
  },
], error => {
  if (error)
    console.error();
  else
    console.log("Completed")
  process.exit();
});




