"use strict";
const models = require('../models');
var categoryId = process.argv[2];
models.Category.findOne({
    where: {
        id: categoryId
    }
}).then(category => {
    category.deleted = true;
    category.save().then(() => {
        console.log("Done");
    });
});
