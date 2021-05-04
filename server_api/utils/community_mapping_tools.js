const models = require('../models');

async function getTranslationForMap(textType, model, targetLanguage) {
  return await new Promise((resolve, reject) => {
    models.AcTranslationCache.getTranslation({query: {textType, targetLanguage}}, model, async (error, translation) => {
      if (!error && translation) {
        resolve(translation.content);
      } else {
        resolve();
        console.log("No translation");
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
          attributes: ['id','name','configuration'],
          required: false
        }
      ]
    }).then(async (community) => {
      if (community) {
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
              children: []
            }
            newCommunity.children.push(newEntry);
          }
        }

        map.children.push(newCommunity);

        resolve();
      } else {
        console.error("Cant find community "+communityId);
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

module.exports = {
  getMapForCommunity
};
