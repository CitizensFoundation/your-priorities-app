var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');

var logger;

if (false && process.env.NODE_ENV != 'production') {
  var prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);

  logger = bunyan.createLogger({
    name: 'your-priorities',
    streams: [{
      level: 'debug',
      type: 'raw',
      stream: prettyStdOut
    }]
  });
} else {
  logger = console;
  //  logger = bunyan.createLogger({name: "your-priorities"});
}

module.exports = logger;
