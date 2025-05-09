var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var fs = require('fs');
var importFolderPath = process.argv[2] ? process.argv[2] : '/home/robert/Downloads/yrpriLocaleImport';
var clientAppImportPath = importFolderPath + '/clientApp/';
var serverApiImportPath = importFolderPath + '/serverApi/';
var yourPrioritiesPath = process.argv[3] ? process.argv[3] : '/home/robert/production-your-priorities-app';
var clientAppLocales = yourPrioritiesPath + '/client_app/locales/';
var serverApiLocales = yourPrioritiesPath + '/server_api/services/locales/';
async.series([
    (callback) => {
        fs.readdir(clientAppImportPath, function (err, files) {
            if (err) {
                console.error("Could not list the directory.", err);
                callback(err);
            }
            async.forEachSeries(files, (function (file, seriesCallback) {
                if (file.indexOf('.json') > -1) {
                    var localePath = file.split('client-app_')[1];
                    var locale = localePath.split(".json")[0];
                    console.log(locale);
                    var clientApiLocaleFilePath = clientAppLocales + locale + '/translation.json';
                    var clientApiLocaleFolderPath = clientAppLocales + locale;
                    var fullImportPath = clientAppImportPath + file;
                    if (!fs.existsSync(clientApiLocaleFolderPath)) {
                        fs.mkdirSync(clientApiLocaleFolderPath);
                    }
                    fs.unlink(clientApiLocaleFilePath, (error) => {
                        console.warn(error);
                        fs.copyFile(fullImportPath, clientApiLocaleFilePath, function (error) {
                            if (error) {
                                console.error("File moving error.", error);
                                seriesCallback(error);
                            }
                            else {
                                console.log("Moved file '%s' to '%s'.", fullImportPath, clientApiLocaleFilePath);
                                seriesCallback();
                            }
                        });
                    });
                }
                else {
                    console.warn("Skipping: " + file);
                    seriesCallback();
                }
            }), callback);
        });
    }
], (error) => {
    if (error) {
        console.error(error);
    }
});
export {};
