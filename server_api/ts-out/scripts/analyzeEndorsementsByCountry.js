"use strict";
var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
var fs = require('fs');
const Reader = require('@maxmind/geoip2-node').Reader;
const postId = process.argv[2];
const mmDbPath = process.argv[3];
const clean = (text) => {
    if (text) {
        var newText = text.replace('"', "'").replace('\n', '').replace('\r', '').replace(/(\r\n|\n|\r)/gm, "").replace(/"/gm, "'").replace(',', ';').trim();
        //console.log("After:" + newText);
        return newText.replace(/´/g, '');
    }
    else {
        return "empty";
    }
};
const countriesCount = {};
const countriesUpCount = {};
const countriesDownCount = {};
Reader.open(mmDbPath, {}).then(reader => {
    models.Endorsement.findAll({
        order: [
            ['created_at', 'asc']
        ],
        include: [
            models.User,
            {
                model: models.Post,
                where: {
                    id: postId
                }
            }
        ]
    }).then(endorsements => {
        for (let i = 0; i < endorsements.length; i++) {
            const country = reader.country(endorsements[i].ip_address).country.names.en;
            if (!countriesCount[country]) {
                countriesCount[country] = 0;
            }
            if (!countriesUpCount[country]) {
                countriesUpCount[country] = 0;
            }
            if (!countriesDownCount[country]) {
                countriesDownCount[country] = 0;
            }
            countriesCount[country] += 1;
            if (endorsements[i].value > 0) {
                countriesUpCount[country] += 1;
            }
            else {
                countriesDownCount[country] += 1;
            }
        }
        console.log("All count");
        for (const property in countriesCount) {
            console.log(`${property},${countriesCount[property]}`);
        }
        console.log("\n\nUp votes count");
        for (const property in countriesUpCount) {
            console.log(`${property},${countriesUpCount[property]}`);
        }
        console.log("\n\nDown votes count");
        for (const property in countriesDownCount) {
            console.log(`${property},${countriesDownCount[property]}`);
        }
        process.exit();
    });
});
