const models = require('../../models');

let users = [];
let postCount = 0;
let pointCount = 0;

function mergeArrays(...arrays) {
  let jointArray = []

  arrays.forEach(array => {
    jointArray = [...jointArray, ...array]
  });
  return [...new Set([...jointArray])]
}

const countCommunities = async (communityId, options) => {
  return await new Promise((resolve, reject) => {
    models.Community.findOne({
      where: {
        id: communityId
      },
      attributes: ['id','name'],
      include: [
        {
          model: models.Group,
          attributes: ['id','name','configuration','counter_posts','counter_points'],
          include: [
            {
              model: models.User,
              as: 'GroupUsers',
              attributes: ['id'],
              required: false
            }
          ],
          required: false
        }
      ]
    }).then(async (community) => {
      if (community) {
        const linksToVisit = [];
        for (let i=0;i<community.Groups.length;i++) {
          const group = community.Groups[i];
          if (group.configuration.actAsLinkToCommunityId) {
            await countCommunities(group.configuration.actAsLinkToCommunityId, options);
          } else {
            users = mergeArrays(users, group.GroupUsers.map((u) => u.id));
            postCount += group.counter_posts;
            pointCount += group.counter_points;
          }
        }
       resolve();
      } else {
        console.error("Cant find community "+communityId);
        resolve();
      }
    }).catch(error => {
      reject(error);
    });
  });
}

const recountCommunityRecursive = async (communityId, options) => {
  return await new Promise((resolve, reject) => {
    models.Community.findOne({
      where: {
        id: communityId
      },
      attributes: ['name','id']
    }).then( async community => {
      try {
        await countCommunities(communityId, options);
        community.counter_users = users.length;
        community.counter_posts = postCount;
        community.counter_points = pointCount;
        await community.save();
        console.log(`Save community ${users.length} ${postCount} ${pointCount}`)
        resolve();
      } catch(error) {
        reject(error);
      }
    }).catch( error => {
      reject(error);
    })
  });
}

(async function() {
  const communities = await models.Community.findAll({
    where: {
      "configuration.recalculateCountersRecursively": true
    },
    attributes: ['id','configuration']
  });
  for (let i=0;i<communities.length;i++) {
    console.log("Processing community: "+communities[i].id);
    users = [];
    postCount = 0;
    pointCount = 0;
    await recountCommunityRecursive(communities[i].id, {});
  }
  process.exit();
})();

