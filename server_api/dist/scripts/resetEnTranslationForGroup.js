var models = require('../models/index.cjs');
var async = require('async');
var groupId = process.argv[2];
models.Post.findAll({
    where: {
        group_id: groupId,
        language: {
            $in: ['en', 'sv']
        }
    }
}).then(function (posts) {
    async.forEachSeries(posts, (post, callback) => {
        post.language = null;
        post.save().then(() => {
            console.log("Saving post id: " + post.id);
            callback();
        });
    }, (error) => {
        if (error) {
            console.error(error);
        }
        else {
            models.Point.findAll({
                where: {
                    group_id: groupId,
                    language: 'en'
                }
            }).then(function (points) {
                async.forEachSeries(points, (point, callback) => {
                    point.language = null;
                    point.save().then(() => {
                        console.log("Saving point id: " + point.id);
                        callback();
                    });
                }, (error) => {
                    if (error)
                        console.error(error);
                    console.log("Done");
                    process.exit();
                });
            });
        }
    });
});
export {};
