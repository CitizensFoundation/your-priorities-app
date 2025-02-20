var models = require('../../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var communityId = process.argv[2];
const ratingCount = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0
};
var size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};
const countRatings = (rateValueMin, notMoreThan, ratings) => {
    let count = 0;
    for (let i = 0; i < ratings.length; i++) {
        if (ratings[i].value >= rateValueMin && ratings[i].value < notMoreThan) {
            count += 1;
        }
    }
    return count;
};
models.Rating.findAll({
    attributes: ["id", "user_id", "type_index", "value"],
    where: {
        value: {
            [models.Sequelize.Op.not]: 0
        }
    },
    include: [
        {
            model: models.User,
            attributes: ['id', 'ssn', 'name', 'email']
        },
        {
            model: models.Post,
            attributes: ["id", "name"],
            include: [
                {
                    model: models.Group,
                    attributes: ["id", 'name'],
                    include: [
                        {
                            model: models.Community,
                            attributes: ["id", "name"],
                            where: {
                                id: communityId
                            }
                        }
                    ]
                }
            ]
        }
    ]
}).then((ratings) => {
    console.log(`"Vote distribution report for ${ratings[0].Post.Group.Community.name}"`);
    console.log(`"Rating value","Vote count"`);
    console.log(`"1+",${countRatings(1, 2, ratings)}`);
    console.log(`"2+",${countRatings(2, 3, ratings)}`);
    console.log(`"3+",${countRatings(3, 4, ratings)}`);
    console.log(`"4+",${countRatings(4, 5, ratings)}`);
    process.exit();
});
export {};
