const models = require('../models/index.cjs');
const async = require('async');
const groupId = 2102; //process.argv[2];
let points;
let posts;
async.series([
    (seriesCallback) => {
        models.Post.findAll({
            where: {
                group_id: groupId
            },
            attributes: ['id', 'language']
        }).then((postsIn) => {
            posts = postsIn;
            seriesCallback();
        }).catch((error) => {
            seriesCallback(error);
        });
    },
    (seriesCallback) => {
        models.Point.findAll({
            where: {
                group_id: groupId
            },
            attributes: ['id', 'language']
        }).then((pointsIn) => {
            points = pointsIn;
            seriesCallback();
        }).catch((error) => {
            seriesCallback(error);
        });
    },
], (error) => {
    if (error) {
        log.error(error);
    }
    else {
        if (posts) {
            log.info("Posts");
            posts.forEach((post) => {
                log.info(post.id + " - " + post.language);
            });
        }
        if (points) {
            log.info("Points");
            points.forEach((point) => {
                log.info(point.id + " - " + point.language);
            });
        }
    }
    log.info("Done");
    process.exit();
});
export {};
