const models = require('../../models/index.cjs');
const copyPost = require('../../utils/copy_utils').copyPost;
const async = require('async');
//const communityId = 1906; //process.argv[2];
//var domainId = 3; // process.argv[3];
const postId = process.argv[2];
var groupId = process.argv[3];
copyPost(postId, groupId, { copyPoints: true, skipEndorsementQualitiesAndRatings: true, skipActivities: true }, (error, post) => {
    if (error) {
        log.error(error);
    }
    else {
        log.info("Done with copyPost. New post id: " + post.id);
    }
    process.exit();
});
export {};
