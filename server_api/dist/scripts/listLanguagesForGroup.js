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
        console.error(error);
    }
    else {
        if (posts) {
            console.log("Posts");
            posts.forEach((post) => {
                console.log(post.id + " - " + post.language);
            });
        }
        if (points) {
            console.log("Points");
            points.forEach((point) => {
                console.log(point.id + " - " + point.language);
            });
        }
    }
    console.log("Done");
    process.exit();
});
export {};
