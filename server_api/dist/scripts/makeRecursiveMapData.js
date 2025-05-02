const models = require('../models/index.cjs');
const util = require('util');
const communityId = 1264; //process.argv[2];
async function getTranslationForMap(textType, model, targetLanguage) {
    return await new Promise((resolve, reject) => {
        models.AcTranslationCache.getTranslation({ query: { textType, targetLanguage } }, model, async (error, translation) => {
            if (!error && translation) {
                resolve(translation.content);
            }
            else {
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
    }
    else {
        let idx = input.lastIndexOf(' ', length);
        if (idx === -1) {
            idx = length;
        }
        input = input.substring(0, idx);
    }
    input += (end !== undefined && end !== null) ? end : '...';
    return input;
};
const getCommunityMap = async (communityId, map) => {
    return await new Promise((resolve, reject) => {
        models.Community.findOne({
            where: {
                id: communityId
            },
            attributes: ['id', 'name'],
            include: [
                {
                    model: models.Group,
                    attributes: ['id', 'name', 'configuration'],
                    required: false
                }
            ]
        }).then(async (community) => {
            if (community) {
                let communityName = await getTranslationForMap("communityName", community, "en");
                if (!communityName) {
                    communityName = community.name;
                }
                const newCommunity = {
                    name: truncate(communityName, 25) + `(C-${community.id})`,
                    type: "Community", children: []
                };
                for (const group of community.Groups) {
                    let groupName = await getTranslationForMap("groupName", group, "en");
                    if (!groupName) {
                        groupName = group.name;
                    }
                    if (group.configuration.actAsLinkToCommunityId) {
                        groupName = "(L)";
                    }
                    else {
                        groupName = truncate(groupName, 25) + `(G-${group.id}`;
                    }
                    const newEntry = {
                        name: groupName,
                        children: []
                    };
                    newCommunity.children.push(newEntry);
                    if (group.configuration.actAsLinkToCommunityId) {
                        await getCommunityMap(group.configuration.actAsLinkToCommunityId, newEntry);
                    }
                }
                map.children.push(newCommunity);
                resolve();
            }
            else {
                console.error("Cant find community " + communityId);
                map.children.push({ name: "Not found community id " + communityId, children: [] });
                resolve();
            }
        }).catch(error => {
            reject(error);
        });
    });
};
const run = async () => {
    let map = { name: "Aris", children: [] };
    try {
        await getCommunityMap(communityId, map);
    }
    catch (error) {
        console.error(error);
    }
    console.log(util.inspect(map, { showHidden: false, depth: null }));
    process.exit();
};
run();
export {};
