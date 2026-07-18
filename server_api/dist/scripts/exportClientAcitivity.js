var models = require('../models/index.cjs');
const { Op } = require("sequelize");
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
const type = "domain"; //process.argv[2];
const containerId = "422"; //= process.argv[3];
const fromDate = moment("14/11/2019", "DD/MM/YYYY").toISOString(); //process.argv[4];
const endDate = moment("30/12/2019", "DD/MM/YYYY").toISOString(); //process.argv[5];
const typeFilter = "completed"; //process.argv[6];
const actionFilter = "newPost"; //process.argv[7];
const oldData = true; // process.argv[7] ? true ; false;
if (oldData) {
    models.AcActivity.findAll({
        where: {
            [Op.and]: [
                {
                    created_at: {
                        [Op.gt]: fromDate
                    }
                },
                {
                    created_at: {
                        [Op.lt]: endDate
                    }
                }
            ]
        },
        attributes: ['object', 'actor', 'type', 'sub_type']
    }).then(function (actitities) {
        process.exit();
    });
}
else {
    process.exit();
}
export {};
