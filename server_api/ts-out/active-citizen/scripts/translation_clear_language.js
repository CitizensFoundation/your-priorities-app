const models = require('../../models/index.cjs');
const _ = require('lodash');
const objectType = process.argv[2];
const objectId = process.argv[3];
if (objectType === "point") {
    models.Point.findOne({
        where: {
            id: objectId
        },
        attributes: ['id', 'language']
    }).then((result) => {
        if (result) {
            console.log(`Clearing current point language of ${result.language}`);
            result.set('language', null);
            result.save().then(function () {
                console.log(`Cleared language for point ${result.id}`);
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
}
else if (objectType === "group") {
    models.Group.findOne({
        where: {
            id: objectId
        },
        attributes: ['id', 'language']
    }).then((result) => {
        if (result) {
            console.log(`Clearing current group language of ${result.language}`);
            result.set('language', null);
            result.save().then(function () {
                console.log(`Cleared language for group ${result.id}`);
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
}
else if (objectType === "community") {
    models.Community.findOne({
        where: {
            id: objectId
        },
        attributes: ['id', 'language']
    }).then((result) => {
        if (result) {
            console.log(`Clearing current community language of ${result.language}`);
            result.set('language', null);
            result.save().then(function () {
                console.log(`Cleared language for community ${result.id}`);
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
}
else if (objectType === "domain") {
    models.Domain.findOne({
        where: {
            id: objectId
        },
        attributes: ['id', 'language']
    }).then((result) => {
        if (result) {
            console.log(`Clearing current domain language of ${result.language}`);
            result.set('language', null);
            result.save().then(function () {
                console.log(`Cleared language for domain ${result.id}`);
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
}
else {
    console.log("No object type selected");
    process.exit();
}
export {};
