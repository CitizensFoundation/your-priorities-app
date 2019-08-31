const models = require('../models');
const copyCommunityWithEverything = require('../utils/copy_utils').copyCommunityWithEverything;
const async = require('async');
const ip = require('ip');

const communityId = process.argv[2];
var domainId = process.argv[3];

copyCommunityWithEverything(communityId, domainId, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Done with copyCommunityWithEverything")
  }
  process.exit();
});
