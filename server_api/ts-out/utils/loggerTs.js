import * as bunyan from 'bunyan';
import PrettyStream from 'bunyan-prettystream';
let logger;
if (process.env.USE_BUNYAN_LOGGER && process.env.NODE_ENV !== 'production') {
    const prettyStdOut = new PrettyStream();
    prettyStdOut.pipe(process.stdout);
    logger = bunyan.createLogger({
        name: 'yrpri',
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
        // If you don't want to use any logger, you can assign 'console' to 'logger'.
        // However, you need to cast it to any as 'console' and 'bunyan' have different types.
        logger = console;
    }
}
export default logger;
