const models = require('../../models/index.cjs');
const copyCommunityNoUsersNoEndorsementsOneGroup = require('../../utils/copy_utils').copyCommunityNoUsersNoEndorsementsOneGroup;
const async = require('async');

//const communityId = 1272;// process.argv[2];
//var domainId = 3; //process.argv[3];

const communityId = process.argv[2];
const groupId = process.argv[3];
var domainId = process.argv[4];

copyCommunityNoUsersNoEndorsementsOneGroup(communityId, groupId, domainId, (error) => {
  if (error) {
    log.error(error);
  } else {
    log.info("Done with copyCommunityNoUsersNoEndorsementsOneGroup")
  }
  process.exit();
});
