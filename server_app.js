var application_root = __dirname,
    express = require("express"),
    debug = require('debug')('express-example'),
    path = require("path"),
    models = require("./models");

app = express();
// Config

/*app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "app" )));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
*/
app.set('port', process.env.PORT || 4242);

models.sequelize.sync().success(function () {
  var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
  });
});

app.get('/ideas', function (req, res) {
  models.Idea.findAll({
    limit: 10,
    include: [ models.Point ]
  }).success(function(ideas) {
      res.send(ideas);
    });
});
