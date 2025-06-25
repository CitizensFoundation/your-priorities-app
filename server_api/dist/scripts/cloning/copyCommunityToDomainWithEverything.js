const models = require('../../models/index.cjs');
const copyCommunityWithEverything = require('../../utils/copy_utils').copyCommunityWithEverything;
const async = require('async');
//const communityId = 1906; //process.argv[2];
//var domainId = 3; // process.argv[3];
const communityId = process.argv[2];
var domainId = process.argv[3];
copyCommunityWithEverything(communityId, domainId, {}, (error) => {
    if (error) {
        log.error(error);
    }
    else {
        log.info("Done with copyCommunityWithEverything");
    }
    process.exit();
});
export {};
