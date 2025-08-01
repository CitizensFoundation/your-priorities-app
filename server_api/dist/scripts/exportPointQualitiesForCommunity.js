var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var fs = require('fs');
var communityId = process.argv[2];
var outFile = process.argv[3];
var clean = function (text) {
    //log.info("Before: "+ text);
    if (text) {
        var newText = text.replace('"', "'").replace('\n', '').replace('\r', '').replace(/(\r\n|\n|\r)/gm, "").replace(/"/gm, "'").replace(',', ';').trim();
        //log.info("After:" + newText);
        return newText.replace(/´/g, '');
    }
    else {
        return "empty";
    }
};
var getType = function (value) {
    if (value > 0) {
        return "for";
    }
    else if (value < 0) {
        return "against";
    }
    else {
        return "comment/news";
    }
};
models.PointQuality.findAll({
    order: [
        ['created_at', 'asc']
    ],
    include: [
        models.User,
        {
            model: models.Point,
            include: [
                {
                    model: models.Post,
                    include: [
                        {
                            model: models.Group,
                            include: [
                                {
                                    model: models.Community,
                                    where: {
                                        id: communityId
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}).then(function (endorsements) {
    var outFileContent = "";
    log.info(endorsements.length);
    outFileContent += "Point qualities for Community Id: " + communityId + "\n";
    outFileContent += "User Id, External User Id, State, Group Id, Post Id, Point Id, Vote Value\n";
    async.eachSeries(endorsements, function (endorsement, seriesCallback) {
        var externalUserId = '', state = '';
        if (endorsement.User.profile_data) {
            if (endorsement.User.profile_data.trackingParameters && endorsement.User.profile_data.trackingParameters.externalUserId) {
                externalUserId = endorsement.User.profile_data.trackingParameters.externalUserId;
            }
            if (endorsement.User.profile_data.trackingParameters && endorsement.User.profile_data.trackingParameters.state) {
                state = endorsement.User.profile_data.trackingParameters.state;
            }
        }
        outFileContent += endorsement.User.id + ',' + externalUserId + ',' + state + ',' + endorsement.Point.Post.group_id + ',' + endorsement.Point.post_id + ',' + endorsement.Point.id + ',' + getType(endorsement.value) + '\n';
        seriesCallback();
    }, function (error) {
        fs.writeFile(outFile, outFileContent, function (err) {
            if (err) {
                log.info(err);
            }
            log.info("The file was saved!");
            process.exit();
        });
    });
});
export {};
