const models = require('../../models/index.cjs');
const copyCommunityOnlyGroups = require('../../utils/copy_utils').copyCommunityOnlyGroups;
const async = require('async');
const ip = require('ip');
const {recountCommunity} = require("../../utils/recount_utils.cjs");

//const communityId = 1906; //process.argv[2];
//var domainId = 3; // process.argv[3];

const communityId = process.argv[2];
var domainId = process.argv[3];

copyCommunityOnlyGroups(communityId, domainId, (error, newCommunityId) => {
  if (error) {
    console.error(error);
    process.exit();

  } else {
    recountCommunity(newCommunityId.id, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Done with copyCommunityOnlyGroups new community "+newCommunityId.id)
      }
      process.exit();
    });
  }
});
