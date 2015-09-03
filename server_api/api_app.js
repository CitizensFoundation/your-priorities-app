var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var index = require('./controllers/index');
var ideas = require('./controllers/ideas');
var groups = require('./controllers/groups');

var User = require('./models/idea');

var app = express();

app.use(express.static(path.join(__dirname, '../client_app')));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.find({
    where: {id: id}
  }).then(function(user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    {
      usernameField: "email"
    },
    function(email, password, done) {
      /*User.find({
        where: { email: username }
      }).then(function(email) {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        user.validPassword(password,done);
      });*/
      return done()
    }
));

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.send(401, 'Unauthorized');
}

var needsGroup = function(groupId) {
  return function(req, res, next) {
    if (req.user && req.user.group === groupId)
      next();
    else
      res.send(401, 'Unauthorized');
  };
};

var needsAdmin = function() {
  return function(req, res, next) {
    if (req.user && req.user.is_admin)
      next();
    else
      res.send(401, 'Unauthorized');
  };
};

var needsRoot = function() {
  return function(req, res, next) {
    if (req.user && req.user.is_root)
      next();
    else
      res.send(401, 'Unauthorized');
  };
};

app.get('/api/user/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});


app.post('/api/user/logout', function(req, res){
  req.logOut();
  res.send(200);
});

app.use('/', index);
app.use('/api/ideas', ideas);
app.use('/api/groups', groups);
//app.use('/api/users', users);

app.get('/api/users/login',  passport.authenticate('local'), function(req, res) {
  res.send(200);
//  res.send(req.user);
});

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
