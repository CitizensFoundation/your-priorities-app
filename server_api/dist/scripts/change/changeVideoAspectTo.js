var models = require('../../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var videoId = 1671; //process.argv[2];
var aspect = "portrait"; //process.argv[3];
models.Video.findOne({
    where: {
        id: videoId
    },
    attributes: ['id', 'meta', 'public_meta']
}).then(video => {
    if (video) {
        if (aspect === "portrait") {
            video.set('meta.aspect', "portrait");
            video.set('public_meta.aspect', "portrait");
        }
        else if (aspect === "landscape") {
            video.set('meta.aspect', "landscape");
            video.set('public_meta.aspect', "landscape");
        }
        video.save().then(() => {
            log.info(`Video ${videoId} set to ${aspect}`);
            process.exit();
        });
    }
    else {
        log.warn(`Video not found for ${videoId} ${aspect}`);
        process.exit();
    }
}).catch(error => {
    log.error(error);
    process.exit();
});
export {};
