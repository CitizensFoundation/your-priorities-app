var path = require('path');
var fs = require('fs');
var _ = require('lodash');
const readline = require('readline');
var walkSync = function (dir, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            if (file.endsWith((".html"))) {
                if (!(dir.indexOf("test") > -1) && !(dir.indexOf("demo") > -1) && !(file.indexOf('-container-') > -1)) {
                    filelist.push(path.join(dir, file));
                }
                else {
                    //log.error("SKIP: "+ dir);
                }
            }
        }
    });
    return filelist;
};
var checkFile = function (filePath) {
    var lines = fs.readFileSync(filePath, 'utf-8')
        .split('\n')
        .filter(Boolean);
    var importLines = _.reject(lines, function (line) {
        return !line.endsWith('.html">') || line.indexOf("iron-flex-layout") > -1 ||
            line.indexOf("behavior") > -1 || line.indexOf("/polymer.html") > -1 ||
            line.indexOf("yp-app-icons") > -1 || line.indexOf("app-helpers") > -1;
    });
    var importedElements = _.map(importLines, function (importLine) {
        var last = importLine.split("/").pop();
        last = last.replace('.html">', '');
        last = last.replace('<link rel="import" href="', '');
        return { import: importLine, element: "<" + last };
    });
    _.forEach(importedElements, function (elementObject) {
        var found = false;
        _.forEach(lines, function (line) {
            if (line.indexOf(elementObject.element) > -1) {
                found = true;
            }
        });
        if (!found) {
            log.error(filePath + ": " + elementObject.element + ">");
        }
    });
};
var dir = "/home/robert/Projects/production-your-priorities-app/client_app/src";
_.forEach(walkSync(dir), function (filePath) {
    checkFile(filePath);
});
export {};
