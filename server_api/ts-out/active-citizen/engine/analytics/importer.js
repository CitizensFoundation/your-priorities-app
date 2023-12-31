"use strict";
const models = require('../../../models');
const _ = require('lodash');
const async = require('async');
const log = require('../../../utils/logger');
const importDomain = require('./utils').importDomain;
const importCommunity = require('./utils').importCommunity;
const importGroup = require('./utils').importGroup;
const importPost = require('./utils').importPost;
const importPoint = require('./utils').importPoint;
let updateAsyncLimit = 5;
let lineCrCounter = 0;
const processDots = () => {
    if (lineCrCounter > 250) {
        process.stdout.write("\n");
        lineCrCounter = 1;
    }
    else {
        process.stdout.write(".");
        lineCrCounter += 1;
    }
};
const importAllDomains = (done) => {
    log.info('AcSimilarityDomainImport', {});
    models.Domain.unscoped().findAll({
        attributes: ['id', 'name', 'description', 'default_locale', 'created_at', 'updated_at'],
        order: [
            ['id', 'asc']
        ]
    }).then((domains) => {
        lineCrCounter = 0;
        async.eachOfLimit(domains, updateAsyncLimit, (domain, index, callback) => {
            importDomain(domain, callback);
        }, () => {
            console.log("Finished updating domains");
            done();
        });
    }).catch(function (error) {
        done(error);
    });
};
const importAllCommunities = (done) => {
    log.info('AcSimilarityCommunityImport', {});
    models.Community.unscoped().findAll({
        include: [
            {
                model: models.Domain,
                attributes: ['id', 'default_locale', 'created_at', 'updated_at'],
                required: true
            }
        ],
        attributes: ['id', 'name', 'description', 'default_locale', 'created_at', 'updated_at'],
        order: [
            ['id', 'asc']
        ]
    }).then((communities) => {
        lineCrCounter = 0;
        async.eachOfLimit(communities, updateAsyncLimit, (community, index, callback) => {
            importCommunity(community, callback);
        }, () => {
            console.log("Finished updating communities");
            done();
        });
    }).catch(function (error) {
        done(error);
    });
};
const importAllGroups = (done) => {
    log.info('AcSimilarityGroupImport', {});
    models.Group.unscoped().findAll({
        include: [
            {
                model: models.Community,
                attributes: ['id', 'access', 'status', 'default_locale', 'created_at', 'updated_at'],
                required: true,
                include: [
                    {
                        model: models.Domain,
                        attributes: ['id', 'default_locale', 'created_at', 'updated_at'],
                        required: true
                    }
                ]
            }
        ],
        attributes: ['id', 'name', 'created_at', 'objectives', 'updated_at'],
        order: [
            ['id', 'asc']
        ]
    }).then((groups) => {
        lineCrCounter = 0;
        async.eachOfLimit(groups, updateAsyncLimit, (group, index, callback) => {
            importGroup(group, callback);
        }, () => {
            console.log("Finished updating communities");
            done();
        });
    }).catch(function (error) {
        done(error);
    });
};
const importAllPosts = (done) => {
    log.info('AcSimilarityImport', {});
    models.Post.unscoped().findAll({
        include: [
            {
                model: models.Point,
                required: false,
                attributes: ['id', 'content'],
            },
            {
                model: models.Group,
                required: true,
                attributes: ['id', 'access', 'status', 'configuration'],
                include: [
                    {
                        attributes: ['id', 'formats'],
                        model: models.Image, as: 'GroupLogoImages',
                        required: false
                    },
                    {
                        model: models.Community,
                        attributes: ['id', 'access', 'status', 'default_locale'],
                        required: true,
                        include: [
                            {
                                attributes: ['id', 'formats'],
                                model: models.Image, as: 'CommunityLogoImages',
                                required: false
                            },
                            {
                                model: models.Domain,
                                attributes: ['id', 'default_locale'],
                                required: true
                            }
                        ]
                    }
                ]
            },
            {
                model: models.Image,
                required: false,
                as: 'PostHeaderImages',
                attributes: ['id', 'formats']
            },
            {
                model: models.Video,
                required: false,
                attributes: ['id', 'formats', 'updated_at', 'viewable', 'public_meta'],
                as: 'PostVideos',
                include: [
                    {
                        model: models.Image,
                        as: 'VideoImages',
                        attributes: ["formats", 'updated_at'],
                        required: false
                    },
                ]
            },
            {
                model: models.Audio,
                required: false,
                attributes: ['id', 'formats', 'updated_at', 'listenable'],
                as: 'PostAudios',
            }
        ],
        order: [
            ['id', 'desc'],
            [{ model: models.Image, as: 'PostHeaderImages' }, 'updated_at', 'asc'],
            [{ model: models.Group }, { model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'desc'],
            [{ model: models.Group }, { model: models.Community }, { model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'desc']
        ],
        attributes: ['id', 'name', 'description', 'group_id', 'category_id', 'status', 'deleted', 'language', 'created_at', 'updated_at',
            'user_id', 'official_status', 'public_data', 'cover_media_type',
            'counter_endorsements_up', 'counter_endorsements_down', 'counter_points', 'counter_flags']
    }).then((posts) => {
        //posts = _.take(posts, 100);
        lineCrCounter = 0;
        async.eachOfLimit(posts, updateAsyncLimit, (post, index, callback) => {
            importPost(post, callback);
        }, () => {
            console.log("Finished updating posts");
            done();
        });
    }).catch(function (error) {
        done(error);
    });
};
const importAllPoints = (done) => {
    models.Point.unscoped().findAll({
        attributes: ['id', 'name', 'content', 'user_id', 'post_id', 'value', 'status', 'counter_quality_up', 'counter_quality_down', 'language', 'created_at', 'updated_at'],
        order: [
            ['id', 'desc'],
            [models.PointRevision, 'created_at', 'asc'],
            [{ model: models.Video, as: "PointVideos" }, 'updated_at', 'desc'],
            [{ model: models.Audio, as: "PointAudios" }, 'updated_at', 'desc'],
        ],
        include: [
            {
                model: models.PointRevision,
                attributes: ['content', 'value', 'created_at'],
                required: false
            },
            {
                model: models.Video,
                required: false,
                attributes: ['id', 'formats'],
                as: 'PointVideos'
            },
            {
                model: models.Audio,
                required: false,
                attributes: ['id', 'formats'],
                as: 'PointAudios'
            },
            {
                model: models.Post,
                attributes: ['id', 'group_id', 'created_at', 'category_id', 'official_status', 'status', 'language'],
                required: true,
                include: [
                    {
                        model: models.Group,
                        attributes: ['id', 'access', 'status', 'configuration'],
                        required: true,
                        include: [
                            {
                                model: models.Community,
                                attributes: ['id', 'access', 'status', 'default_locale'],
                                required: true,
                                include: [
                                    {
                                        model: models.Domain,
                                        attributes: ['id', 'default_locale'],
                                        required: true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }).then(function (points) {
        //points = _.take(points, 100);
        lineCrCounter = 0;
        async.eachOfLimit(points, updateAsyncLimit, (point, index, callback) => {
            importPoint(point, callback);
        }, () => {
            console.log("Finished updating posts");
            done();
        });
    }).catch(function (error) {
        done(error);
    });
};
const importAll = (done) => {
    async.series([
        (callback) => {
            importAllDomains((error) => {
                callback(error);
            });
        },
        (callback) => {
            importAllCommunities((error) => {
                callback(error);
            });
        },
        (callback) => {
            importAllGroups((error) => {
                callback(error);
            });
        },
        (callback) => {
            importAllPosts((error) => {
                callback(error);
            });
        },
        (callback) => {
            importAllPoints((error) => {
                callback(error);
            });
        }
    ], (error) => {
        console.log("Finished importing all");
        if (error)
            console.error(error);
        done();
    });
};
if (process.env["AC_ANALYTICS_KEY"] && process.env["AC_ANALYTICS_BASE_URL"]) {
    log.info('AcSimilarityImportStarting', {});
    if (process.argv[2] && process.argv[2] === "onlyUpdatePosts") {
        updateAsyncLimit = 5;
        importAllPosts(() => {
            console.log("Done updating posts");
            process.exit();
        });
    }
    else {
        importAll(() => {
            console.log("Done importing all");
            process.exit();
        });
    }
}
else {
    console.error("NO AC_ANALYTICS_KEY");
    process.exit();
}
