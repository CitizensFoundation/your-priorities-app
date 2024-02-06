var models = require('../../models/index.cjs');
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
    console.log(`"Up / Down","Email","Name","Post Id","Post name","Group name"\n`);
    for (let i = 0; i < endorsements.length; i++) {
        const e = endorsements[i];
        console.log(`${e.value},"${e.User.email}","${e.User.name}","${e.Post.id}","${e.Post.name}","${e.Post.Group.name}"`);
    }
    process.exit();
});
export {};
