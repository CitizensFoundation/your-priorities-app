var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var routes = require('./controllers/index');
var ideas = require('./controllers/ideas');
var groups = require('./controllers/groups');

var app = express();

app.configure(function() {
  app.use(express.static(path.join(__dirname, '../client_app')));
  app.use(express.cookieParser());
  app.use(express.bodyParser.json());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.find({
    where: {id: id}
  }).then(function(user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
      models.User.find({
        where: {email: username}
      }).then(function(user) {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
));

app.use('/', routes);
app.use('/api/ideas', ideas);
app.use('/api/groups', groups);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log("Development mode");
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
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
    res.send({
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
