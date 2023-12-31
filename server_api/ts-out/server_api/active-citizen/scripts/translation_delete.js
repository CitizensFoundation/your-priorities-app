"use strict";
const models = require('../../models');
const _ = require('lodash');
const indexKey = process.argv[2];
const textToReplace = process.argv[3];
models.AcTranslationCache.findOne({
    where: {
        index_key: indexKey
    }
}).then((result) => {
    if (result) {
        result.destroy().then(function () {
            console.log(`Deleted ${result.index_key} to ${result.content}`);
            process.exit();
        }).catch((error) => {
            console.error(error);
            process.exit();
        });
    }
    else {
        console.warn("Not found: " + indexKey);
        process.exit();
    }
}).catch((error) => {
    console.error(error);
    process.exit();
});
