"use strict";
const models = require('../../models');
const moment = require('moment');
const maxNumberFromPath = process.argv[2];
const maxNumberOfGroupsToDelete = maxNumberFromPath ? maxNumberFromPath : 1000;
let numberOfDeletedGroups = 0;
let startTime = moment();
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
(async () => {
    let haveGroupsToDelete = true;
    let allDeletions = "";
    try {
        let haveGroupsLeftToProcess = true;
        let groupsOffset = 0;
        while (haveGroupsLeftToProcess && numberOfDeletedGroups < maxNumberOfGroupsToDelete) {
            const groups = await models.Group.findAll({
                limit: 100,
                offset: groupsOffset,
                order: ['id'],
                attributes: ['id', 'configuration', 'name', 'deleted'],
            });
            console.log(`${groups.length} groups offset ${groupsOffset}`);
            if (groups.length > 0) {
                groupsOffset += 100;
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i].configuration &&
                        groups[i].configuration.actAsLinkToCommunityId) {
                        const community = await models.Community.findOne({
                            where: {
                                id: groups[i].configuration.actAsLinkToCommunityId
                            },
                            attributes: ['id']
                        });
                        if (!community) {
                            const deleteText = `Deleting groupLink id ${groups[i].id} - name ${groups[i].name} - community id ${groups[i].configuration.actAsLinkToCommunityId}`;
                            console.log(deleteText);
                            allDeletions += `${deleteText}\n`;
                            groups[i].deleted = true;
                            await groups[i].save();
                        }
                    }
                }
            }
            else {
                haveGroupsLeftToProcess = false;
                console.log("No more groups left to process from user");
            }
            await sleep(100);
        }
    }
    catch (error) {
        console.error(error);
        haveGroupsToDelete = false;
    }
    console.log(`${numberOfDeletedGroups} old anon groups deleted`);
    console.log(`Duration ${moment(moment() - startTime).format("HH:mm:ss.SSS")}`);
    console.log("ALL DELETIONS");
    console.log(allDeletions);
    process.exit();
})();
