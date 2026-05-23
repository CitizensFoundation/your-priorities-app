var models = require('../../models/index.cjs');
var async = require('async');
var fs = require('fs');
var trainCategoriesCsv;
var testCategoriesCsv;
var classesCategoriesCsv;
var trainCategoriesCsvFilename = 'datasets/better_reykjavik/categories/train.csv';
var testCategoriesCsvFilename = 'datasets/better_reykjavik/categories/test.csv';
var classesCategoriesCsvFilename = 'datasets/better_reykjavik/categories/classes.csv';
var categories = {};
var categoriesIds = [];
MAX_CATEGORY_LENGTH = 1700;
var clean = require('./dataset_tools.js').clean;
var shuffleArray = require('./dataset_tools.js').shuffleArray;
var replaceBetterReykjavikCategoryId = require('./dataset_tools.js').replaceBetterReykjavikCategoryId;
async.series([
    function (callback) {
        var categoriesCsvRows = [];
        models.Post.findAll({
            where: {
                status: 'published'
            },
            include: [
                {
                    model: models.Point,
                    where: {
                        status: 'published'
                    }
                },
                {
                    model: models.Group,
                    required: true,
                    include: [
                        {
                            model: models.Community,
                            required: true,
                            include: [
                                {
                                    model: models.Domain,
                                    required: true,
                                    where: {
                                        id: 1
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }).then(function (posts) {
            log.info('Found ' + posts.length + " posts");
            async.eachSeries(posts, function (post, seriesCallback) {
                var newId = replaceBetterReykjavikCategoryId(post.category_id);
                if (newId && newId != 11) {
                    if (!categories[newId]) {
                        categories[newId] = [];
                        categoriesIds.push(newId);
                    }
                    var content;
                    if (post.description) {
                        content = '"' + clean(post.name) + ' ' + clean(post.description) + '"';
                    }
                    else {
                        content = '"' + clean(post.name) + '"';
                    }
                    if (content.indexOf('Lorem Ipsum har') == -1) {
                        categories[newId].push(content);
                    }
                    async.eachSeries(post.Points, function (point, innerSeriesCallback) {
                        log.info(point.status);
                        if (point.value != 0) {
                            content = '"' + clean(point.content) + '"';
                            if (content != "" && content.length > 17) {
                                if (content.indexOf('Mypoint my point') == -1 &&
                                    content.indexOf('Point against Point') == -1) {
                                    categories[newId].push(content);
                                }
                            }
                        }
                        innerSeriesCallback();
                    }, function () {
                        seriesCallback();
                    });
                }
                else {
                    seriesCallback();
                }
            }, function () {
                async.eachSeries(categoriesIds, function (category_id, seriesCallback) {
                    log.info(category_id);
                    log.info("-----" + category_id + "---------------------------: " + categories[category_id].length);
                    if (categories[category_id].length > MAX_CATEGORY_LENGTH) {
                        categories[category_id] = categories[category_id].splice(0, MAX_CATEGORY_LENGTH);
                        log.info("-----" + category_id + "---------------------------: " + categories[category_id].length);
                    }
                    async.eachSeries(categories[category_id], function (post, innerSeriesCallback) {
                        categoriesCsvRows.push(category_id + ',' + post);
                        log.info("Key: " + category_id + " value: " + post);
                        innerSeriesCallback();
                    }, function () {
                        seriesCallback();
                    });
                }, function () {
                    trainCategoriesCsv = shuffleArray(categoriesCsvRows);
                    testCategoriesCsv = trainCategoriesCsv.splice(0, categoriesCsvRows.length * 0.1);
                    callback();
                });
            });
        }).catch(function (error) {
            log.info("ERROR: " + error);
        });
    },
    function (callback) {
        fs.writeFile(trainCategoriesCsvFilename, trainCategoriesCsv.join('\n'), function (err) {
            if (err) {
                log.info(err);
            }
            callback();
        });
    },
    function (callback) {
        fs.writeFile(testCategoriesCsvFilename, testCategoriesCsv.join('\n'), function (err) {
            if (err) {
                log.info(err);
            }
            callback();
        });
    },
    function (callback) {
        classesCategoriesCsv = [];
        async.eachSeries(categoriesIds, function (category_id, seriesCallback) {
            models.Category.findOne({
                where: { id: category_id }
            }).then(function (category) {
                classesCategoriesCsv.push(category.id + ',' + category.name);
                seriesCallback();
            });
        }, function () {
            callback();
        });
    },
    function (callback) {
        fs.writeFile(classesCategoriesCsvFilename, classesCategoriesCsv.join('\n'), function (err) {
            if (err) {
                log.info(err);
            }
            callback();
        });
    }
], function (error) {
    log.info("FINISHED :)");
});
export {};
