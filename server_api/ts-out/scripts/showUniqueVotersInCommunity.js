var models = require('../models/index.cjs');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var moment = require('moment');
var communityId = process.argv[2];
const allUsers = {};
const uniqueSsns = [];
var size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};
models.Endorsement.findAll({
    attributes: ["id", "user_id", "value"],
    where: {
        value: {
            [models.Sequelize.Op.not]: 0
        }
    },
    include: [
        {
            model: models.User,
            attributes: ['id', 'ssn', 'name']
        },
        {
            model: models.Post,
            attributes: ["id", "name"],
            include: [
                {
                    model: models.Group,
                    attributes: ["id"],
                    include: [
                        {
                            model: models.Community,
                            attributes: ["id"],
                            where: {
                                id: communityId
                            }
                        }
                    ]
                }
            ]
        }
    ]
}).then((endorsements) => {
    console.log(`Votes: ${endorsements.length}`);
    endorsements.forEach(e => {
        if (!allUsers[e.User.ssn]) {
            allUsers[e.User.ssn] = 1;
            uniqueSsns.push(e.User.ssn);
            console.log(`${e.User.ssn} - ${e.User.name}`);
        }
    });
    console.log(`Voters: ${size(allUsers)}`);
    console.log(`Average votes per user: ${parseInt(endorsements.length / size(allUsers))}`);
    process.exit();
});
export {};
