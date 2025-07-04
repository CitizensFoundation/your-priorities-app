const models = require('../../models/index.cjs');
const copyCommunityNoUsersNoEndorsements = require('../../utils/copy_utils').copyCommunityNoUsersNoEndorsements;
const async = require('async');

//const communityId = 1272;// process.argv[2];
//var domainId = 3; //process.argv[3];

const communityId = process.argv[2];
var domainId = process.argv[3];

copyCommunityNoUsersNoEndorsements(communityId, domainId, (error) => {
  if (error) {
    log.error(error);
  } else {
    log.info("Done with copyCommunityNoUsersNoEndorsements")
  }
  process.exit();
});
