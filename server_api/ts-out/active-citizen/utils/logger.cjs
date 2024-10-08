"use strict";
var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var logger;
if (process.env.USE_BUNYAN_LOGGER && process.env.NODE_ENV != 'production') {
    var prettyStdOut = new PrettyStream({ useColor: true });
    prettyStdOut.pipe(process.stdout);
    logger = bunyan.createLogger({
        name: 'your-priorities',
        streams: [{
                level: 'debug',
                type: 'raw',
                stream: prettyStdOut
            }]
    });
}
else {
    if (process.env.USE_BUNYAN_LOGGER) {
        logger = bunyan.createLogger({ name: "your-priorities" });
    }
    else {
        logger = console;
    }
}
module.exports = logger;
