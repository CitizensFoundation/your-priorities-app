const models = require('../../models/index.cjs');
const _ = require('lodash');
const communityId = process.argv[2];

let groupsInCommunity = [];
let communities = [];

async function getTranslationForMap(textType, model, targetLanguage) {
  return await new Promise((resolve, reject) => {
    models.AcTranslationCache.getTranslation({query: {textType, targetLanguage}}, model, async (error, translation) => {
      if (!error && translation) {
        resolve(translation.content);
      } else {
        resolve();
        log.info("No translation");
      }
    });
  });
}

const truncate = (input, length, killwords, end) => {
  length = length || 255;

  if (input.length <= length)
    return input;

  if (killwords) {
    input = input.substring(0, length);
  } else {
    let idx = input.lastIndexOf(' ', length);
    if (idx === -1) {
      idx = length;
    }

    input = input.substring(0, idx);
  }

  input += (end !== undefined && end !== null) ? end : '...';
  return input;
}

const getCommunityMap = async (communityId, map, options) => {
  return await new Promise((resolve, reject) => {
    models.Community.findOne({
      where: {
        id: communityId
      },
      attributes: ['id','name'],
      include: [
        {
          model: models.Group,
          attributes: ['id','name','configuration','community_id'],
          required: false
        }
      ]
    }).then(async (community) => {
      if (community) {
        communities.push(community);
        let communityName;

        if (options.targetLocale) {
          communityName = await getTranslationForMap("communityName", community, "en");
        } else {
          communityName = community.name;
        }

        if (!communityName) {
          communityName = community.name;
        }

        const newCommunity = {
          name:  truncate(communityName, 25) + ` (C-${community.id})`,
          link: "/community/"+community.id,
          type: "Community", children: []
        }

        for (const group of community.Groups) {
          let groupName;

          if (options.targetLocale) {
            groupName = await getTranslationForMap("groupName", group, "en");
          } else {
            groupName = group.name;
          }

          if (!groupName) {
            groupName = group.name;
          }

          groupName = truncate(groupName, 25) + ` (G-${group.id})`;

          if (group.configuration.actAsLinkToCommunityId) {
            await getCommunityMap(group.configuration.actAsLinkToCommunityId, newCommunity, options);
          } else {
            const newEntry = {
              name: groupName,
              link: "/group/"+group.id,
              id: group.id,
              realGroupName: group.name,
              communityId: group.community_id,
              children: []
            }
            groupsInCommunity.push(newEntry);
            newCommunity.children.push(newEntry);
          }
        }

        map.children.push(newCommunity);

        resolve();
      } else {
        log.error("Cant find community "+communityId);
        map.children.push({ name: "Not found community id "+communityId, children: []});
        resolve();
      }
    }).catch(error => {
      reject(error)
    });
  });
}

const getMapForCommunity = async (communityId, options) => {
  return await new Promise((resolve, reject) => {
    models.Community.findOne({
      where: {
        id: communityId
      },
      attributes: ['name','id']
    }).then( async community => {
      communities.push(community);
      let map = { name: community.name, children: []};
      try {
        await getCommunityMap(communityId, map, options);
        resolve(map);
      } catch(error) {
        reject(error);
      }
    }).catch( error => {
      reject(error);
    })
  });
}

(async () => {
  await getMapForCommunity(communityId, {});
  log.info("Groups")
  groupsInCommunity = _.orderBy(groupsInCommunity, group => {
    return group.id
  })
  groupsInCommunity.forEach( group => {
    log.info(`${group.id},"${group.realGroupName}",${group.communityId}`)
  })
  communities.forEach( community => {
    log.info(`${community.id},"${community.name}"`)
  })

  process.exit();
})();
