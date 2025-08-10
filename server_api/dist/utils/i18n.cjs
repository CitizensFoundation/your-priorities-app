"use strict";
var i18n = require('i18next');
var Backend = require('i18next-fs-backend');
var path = require('path');
var fs = require('fs');
function buildLoadPath(language, namespace) {
    var localesDir = path.resolve(__dirname, '../services/locales');
    var filePath = path.join(localesDir, language, 'translation.json');
    if (!fs.existsSync(filePath)) {
        var altLanguage = language.replace(/-/g, '_');
        filePath = path.join(localesDir, altLanguage, 'translation.json');
        if (!fs.existsSync(filePath)) {
            filePath = path.join(localesDir, 'en', 'translation.json');
        }
    }
    return filePath;
}
i18n
    .use(Backend)
    .init({
    fallbackLng: 'en',
    lowerCaseLng: true,
    // this is the defaults
    backend: {
        // path where resources get loaded from
        loadPath: buildLoadPath,
        // path to post missing resources
        addPath: '../locales/{{lng}}/translation.missing.json',
        // jsonIndent to use when storing json files
        jsonIndent: 2
    }
});
module.exports = i18n;
module.exports.buildLoadPath = buildLoadPath;
