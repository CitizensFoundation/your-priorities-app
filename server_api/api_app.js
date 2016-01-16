var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var ConnectRoles = require('connect-roles');

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var index = require('./controllers/index');
var posts = require('./controllers/posts');
var groups = require('./controllers/groups');
var communities = require('./controllers/communities');
var domains = require('./controllers/domains');
var points = require('./controllers/points');
var users = require('./controllers/users');
var categories = require('./controllers/categories');
var images = require('./controllers/images');
var models = require('./models');
var user = require('./authorisation.js');
var log = require('./utils/logger');

var app = express();

app.use(express.static(path.join(__dirname, '../client_app')));
//app.use(express.static(path.join(__dirname, '../client_dist')));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({ secret: 'keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(user.middleware());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.find({
    where: {id: id},
    attributes: ["id", "name", "email", "facebook_uid", "twitter_id", "google_id", "github_id", "buddy_icon_file_name"],
    include: [
      {
        model: models.Endorsement,
        attributes: ['id', 'value', 'post_id']
      },
      {
        model: models.PointQuality,
        attributes: ['id', 'value', 'point_id']
      },
      {
        model: models.Image, as: 'UserProfileImages'
      },
      {
        model: models.Image, as: 'UserHeaderImages'
      }
    ]
  }).then(function(user) {
    log.info("User Deserialized", { context: 'deserializeUser', user: user});
    done(null, user);
  }).catch(function(error) {
    log.error("User Deserialize Error", { context: 'deserializeUser', user: req.user, err: error, errorStatus: 500 });
    done(error);
  });
});

passport.use(new LocalStrategy(
    {
      usernameField: "email"
    },
    function(email, password, done) {
      models.User.find({
        where: { email: email }
      }).then(function(user) {
        if (user) {
          user.validatePassword(password,done);
        } else {
          log.warning("User LocalStrategy Incorrect username", { context: 'localStrategy', user: user, err: 'Incorrect username', errorStatus: 401 });
          return done(null, false, { message: 'Incorrect username.' });
        }
      }).catch(function(error) {
        log.error("User LocalStrategy Error", { context: 'localStrategy', user: req.user, err: error, errorStatus: 500 });
        done(error);
      });
    }
));

// Setup the current domain from the host
app.use(function (req, res, next) {
  models.Domain.setYpDomain(req, res, function () {
    log.info("Setup Domain Completed", { context: 'setYpDomain', domain: req.ypDomain });
    next();
  });
});

// Setup the current community from the host
app.use(function (req, res, next) {
  models.Community.setYpCommunity(req, res, function () {
    log.info("Setup Community Completed", { context: 'setYpCommunity', community: req.ypCommunity });
    next();
  });
});

app.use('/', index);
app.use('/api/posts', posts);
app.use('/api/groups', groups);
app.use('/api/communities', communities);
app.use('/api/domains', domains);
app.use('/api/points', points);
app.use('/api/users', users);
app.use('/api/images', images);
app.use('/api/categories', categories);

app.use(function(err, req, res, next) {
  if (err instanceof auth.UnauthorizedError) {
    log.error("User Unauthorized", { context: 'unauthorizedError', user: req.user, err: 'Unauthorized', errorStatus: 401 });
    res.sendStatus(401);
  } else {
    next(err);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  log.warning("Not Found", { context: 'notFound', user: req.user, err: 'Not Found', errorStatus: 404 });
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log("Development mode");
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error("General Error", { context: 'generalError', user: req.user, err: err, errorStatus: 500 });
    res.send({
      message: err.message,
      error: err
    });
  });
} else {
// production error handler
// no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error("General Error", { context: 'generalError', user: req.user, err: err, errorStatus: 500 });
    res.send({
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
