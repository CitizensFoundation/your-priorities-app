#!/usr/bin/env node

var debug = require('debug')('your-priorities-app');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var ConnectRoles = require('connect-roles');
var RedisStore = require('connect-redis')(session);
var useragent = require('express-useragent');
var requestIp = require('request-ip');

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GitHubStrategy = require('passport-github').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var index = require('./controllers/index');
var news_feeds = require('./active-citizen/controllers/news_feeds');
var activities = require('./active-citizen/controllers/activities');

var posts = require('./controllers/posts');
var groups = require('./controllers/groups');
var communities = require('./controllers/communities');
var domains = require('./controllers/domains');
var points = require('./controllers/points');
var users = require('./controllers/users');
var categories = require('./controllers/categories');
var images = require('./controllers/images');
var models = require('./models');
var auth = require('./authorization');
var log = require('./utils/logger');
var toJson = require('./utils/to_json');

if (process.env.REDISTOGO_URL) {
  process.env.REDIS_URL = process.env.REDISTOGO_URL;
}

var app = express();
app.set('port', process.env.PORT || 4242);

if (app.get('env') != 'development') {
  app.use(function(req, res, next) {
    if (!/https/.test(req.protocol)){
      res.redirect("https://" + req.headers.host + req.url);
    } else {
      return next();
    }
  });
}

if (app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, '../client_app')));
} else {
  app.use(express.static(path.join(__dirname, '../client_dist')));
}

app.use(morgan('combined'));
app.use(useragent.express());
app.use(requestIp.mw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var sessionConfig = {
    store: new RedisStore({url: process.env.REDIS_URL}),
    name: 'yrpri.sid',
    secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'not so secret... use env var.',
    resave: true,
    saveUninitialized: true,
    cookie: {}
  };

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

// Setup the current domain from the host
app.use(function (req, res, next) {
  models.Domain.setYpDomain(req, res, function () {
    log.info("Setup Domain Completed", { context: 'setYpDomain', domain: toJson(req.ypDomain) });
    next();
  });
});

// Setup the current community from the host
app.use(function (req, res, next) {
  models.Community.setYpCommunity(req, res, function () {
    log.info("Setup Community Completed", { context: 'setYpCommunity', community: toJson(req.ypCommunity) });
    next();
  });
});

passport.serializeUser(function(user, done) {
  log.info("User Serialized", { context: 'deserializeUser', userEmail: user.email, userId: user.id });
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.find({
    where: {id: id},
    attributes: ["id", "name", "email", "facebook_id", "twitter_id", "google_id", "github_id"],
    include: [{
      model: models.Endorsement,
      attributes: ['id', 'value', 'post_id'],
      required: false
    },
    {
      model: models.PointQuality,
      attributes: ['id', 'value', 'point_id'],
      required: false
    },
    {
      model: models.Image, as: 'UserProfileImages',
      required: false
    },
    {
      model: models.Image, as: 'UserHeaderImages',
      required: false
    }
  ]
}).then(function(user) {
    if (user) {
      log.info("User Deserialized", { context: 'deserializeUser', user: toJson(user)});
      done(null, user);
    } else {
      log.error("User Deserialized Not found", { context: 'deserializeUser' });
      done();
    }
  }).catch(function(error) {
    log.error("User Deserialize Error", { context: 'deserializeUser', user: id, err: error, errorStatus: 500 });
    done(error);
  });
});

// Username and Password Authentication
passport.use(new LocalStrategy(
    {
      usernameField: "email"
    },
    function(email, password, done) {
      models.User.find({
        where: { email: email }
      }).then(function(user) {
        if (user) {
          user.validatePassword(password, done);
        } else {
          log.warn("User LocalStrategy Incorrect username", { context: 'localStrategy', user: toJson(user), err: 'Incorrect username', errorStatus: 401 });
          return done(null, false, { message: 'Incorrect username.' });
        }
      }).catch(function(error) {
        log.error("User LocalStrategy Error", { context: 'localStrategy', err: error, errorStatus: 500 });
        done(error);
      });
    }
));

if (process.env.FACEBOOK_APP_ID) {
  // Facebook Authentication
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/users/auth/facebook/callback",
      enableProof: false,
      profileFields: ['id', 'displayName', 'emails']
    },
    function(accessToken, refreshToken, profile, done) {
      var email = (profile.emails && profile.emails.length>0) ? profile.emails[0]: null;
      User.findOrCreate({where: { facebook_id: profile.id },
          defaults: { email: email, name: profile.displayName, facebook_profile: profile }})
        .spread(function(user, created) {
          log.info(created ? "User Created from Facebook" : "User Connected to Facebook", { context: 'loginFromFacebook', user: toJson(user)});
          done(error, user)
        }).catch(function (error) {
        done(error);
      });
    }
  ));
}

if (process.env.TWITTER_CONSUMER_KEY) {
  // Twitter Authentication
  passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "/api/users/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      var email = (profile.emails && profile.emails.length>0) ? profile.emails[0]: null;
      User.findOrCreate({where: { twitter_id: profile.id },
          defaults: { email: email, name: profile.displayName, twitter_profile: profile }})
        .spread(function(user, created) {
          log.info(created ? "User Created from Twitter" : "User Connected to Twitter", { context: 'loginFromTwitter', user: toJson(user)});
          done(error, user)
        }).catch(function (error) {
        done(error);
      });
    }
  ));
}

// Google Authentication
if (process.env.GOOGLE_CONSUMER_KEY) {
  passport.use(new GoogleStrategy({
      consumerKey: process.env.GOOGLE_CONSUMER_KEY,
      consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
      callbackURL: "/api/users/auth/google/callback"
    },
    function(token, tokenSecret, profile, done) {
      var email = (profile.emails && profile.emails.length>0) ? profile.emails[0]: null;
      User.findOrCreate({where: { google_id: profile.id },
          defaults: { email: email, name: profile.displayName, google_profile: profile }})
        .spread(function(user, created) {
          log.info(created ? "User Created from Google" : "User Connected to Google", { context: 'loginFromGoogle', user: toJson(user)});
          done(error, user)
        }).catch(function (error) {
        done(error);
      });
    }
  ));
}

// Github Authentication
if (process.env.GITHUB_CLIENT_ID) {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/users/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      var email = (profile.emails && profile.emails.length>0) ? profile.emails[0]: null;
      User.findOrCreate({where: { github_id: profile.id },
          defaults: { email: email, name: profile.displayName, github_profile: profile }})
        .spread(function(user, created) {
          log.info(created ? "User Created from Github" : "User Connected to Github", { context: 'loginFromGoogle', user: toJson(user)});
          done(error, user)
        }).catch(function (error) {
        done(error);
      });
    }
  ));
}

app.use('/', index);
app.use('/api/domains', domains);
app.use('/api/communities', communities);
app.use('/api/groups', groups);
app.use('/api/posts', posts);
app.use('/api/points', points);
app.use('/api/images', images);
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/news_feeds', news_feeds);
app.use('/api/activities', activities);

app.use(function(err, req, res, next) {
  if (err instanceof auth.UnauthorizedError) {
    log.error("User Unauthorized", { context: 'unauthorizedError', user: toJson(req.user), err: 'Unauthorized', errorStatus: 401 });
    res.sendStatus(401);
  } else {
    next(err);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  log.warn("Not Found", { context: 'notFound', user: toJson(req.user), err: 'Not Found', errorStatus: 404 });
  next(err);
});

// Error handlers
if (app.get('env') === 'development') {
  console.log("Development mode");
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error("General Error", { context: 'generalError', user: toJson(req.user), err: err, errorStatus: 500 });
    res.send({
      message: err.message,
      error: err
    });
  });
} else {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error("General Error", { context: 'generalError', user: toJson(req.user), err: err, errStack: err.stack, errorStatus: 500 });
    res.send({
      message: err.message,
      error: {}
    });
  });
}

var server = app.listen(app.get('port'), function() {
  debug('Your Priorities server listening on port ' + server.address().port);
});

module.exports = app;
