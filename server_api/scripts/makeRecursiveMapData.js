const models = require('../models');
const util = require('util');


const communityId = 1264; //process.argv[2];


async function getTranslation(textType, model, targetLanguage) {
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

const getCommunity = async (communityId, map) => {
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
        let communityName = await getTranslation("communityName", community, "en");

        if (!communityName) {
          communityName = community.name;
        }

        const newCommunity = { name: communityName+" (C)", type: "Community", children: []}

        for (const group of community.Groups) {
          let groupName = await getTranslation("groupName", group, "en");

          if (!groupName) {
            groupName = group.name;
          }

          if (group.configuration.actAsLinkToCommunityId) {
            groupName += " (LINK)"
          } else {
            groupName += " (G)"
          }

          const newEntry = {
            name: groupName,
            children: []
          }

          newCommunity.children.push(newEntry);

          if (group.configuration.actAsLinkToCommunityId) {
            await getCommunity(group.configuration.actAsLinkToCommunityId, newEntry);
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
      return reject(error)
    });
  });
}

const run = async () => {
  let map = { name: "Aris", children: []};
  await getCommunity(communityId, map);
  console.log(util.inspect(map, {showHidden: false, depth: null}))
  process.exit();
}

run();