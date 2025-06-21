const models = require('../../models/index.cjs');
const moment = require('moment');

const maxNumberFromPath = process.argv[2];

const maxNumberOfGroupsToDelete = maxNumberFromPath ? maxNumberFromPath : 1000;

let numberOfDeletedGroups = 0;

let startTime = moment();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async ()=>{
  let haveGroupsToDelete = true;
  let allDeletions = "";
  try {

    let haveGroupsLeftToProcess = true;
    let groupsOffset = 0;

    while (haveGroupsLeftToProcess && numberOfDeletedGroups<maxNumberOfGroupsToDelete) {
      const groups = await models.Group.findAll({
        limit: 100,
        offset: groupsOffset,
        order: ['id'],
        attributes:['id','configuration','name','deleted'],
      });

      log.info(`${groups.length} groups offset ${groupsOffset}`);

      if (groups.length>0) {
        groupsOffset += 100;
        for (let i=0; i<groups.length;i++) {
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
              log.info(deleteText);
              allDeletions+=`${deleteText}\n`;
              groups[i].deleted = true;
              await groups[i].save();
            }
          }
        }
      } else {
        haveGroupsLeftToProcess = false;
        log.info("No more groups left to process from user")
      }
      await sleep(100);
    }
  } catch(error) {
    log.error(error);
    haveGroupsToDelete = false;
  }
  log.info(`${numberOfDeletedGroups} old anon groups deleted`);
  log.info(`Duration ${moment(moment()-startTime).format("HH:mm:ss.SSS")}`)
  log.info("ALL DELETIONS")
  log.info(allDeletions);
  process.exit();
})();
