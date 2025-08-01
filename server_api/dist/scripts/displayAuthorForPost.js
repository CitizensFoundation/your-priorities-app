var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var postId = process.argv[2];
models.Post.findOne({
    where: {
        id: postId
    },
    include: [
        models.User
    ]
}).then(function (post) {
    log.info(post.User.name + " " + post.User.email);
    process.exit();
});
export {};
