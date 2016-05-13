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
var organizations = require('./controllers/organizations');
var points = require('./controllers/points');
var users = require('./controllers/users');
var categories = require('./controllers/categories');
var images = require('./controllers/images');

var legacyPosts = require('./controllers/legacyPosts');
var legacyUsers = require('./controllers/legacyUsers');
var legacyPages = require('./controllers/legacyPages');

var nonSPArouter = require('./controllers/nonSpa');

var models = require('./models');
var auth = require('./authorization');
var log = require('./utils/logger');
var toJson = require('./utils/to_json');
var sso = require('passport-sso');
var cors = require('cors');

if (process.env.REDISTOGO_URL) {
  process.env.REDIS_URL = process.env.REDISTOGO_URL;
}

var app = express();
app.set('port', process.env.PORT || 4242);

var airbrake = require('airbrake').createClient(process.env.AIRBRAKE_PROJECT_ID, process.env.AIRBRAKE_API_KEY);
airbrake.handleExceptions();
app.use(airbrake.expressHandler());

if (app.get('env') != 'development') {
  app.use(function(req, res, next) {
    if (!/https/.test(req.protocol)){
      res.redirect("https://" + req.headers.host + req.url);
    } else {
      return next();
    }
  });
}

app.set('views', __dirname+'/views');
app.set('view engine', 'jade');

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
  cookie: { autoSubDomain: true },
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next) {
  var ua = req.headers['user-agent'];
  if (/^(facebookexternalhit)|(Twitterbot)|(Slackbot)|(Pinterest)/gi.test(ua)) {
    console.log(ua,' is a bot');
    nonSPArouter(req,res,next);
  } else {
    next();
  }
});

if (app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, '../client_app')));
} else {
  app.use(express.static(path.join(__dirname, '../client_dist')));
}

// Setup the current domain from the host
app.use(function (req, res, next) {
  models.Domain.setYpDomain(req, res, function () {
    log.info("Setup Domain Completed", { context: 'setYpDomain', domain: toJson(req.ypDomain.simple()) });
    next();
  });
});

// Setup the current community from the host
app.use(function (req, res, next) {
  models.Community.setYpCommunity(req, res, function () {
    log.info("Setup Community Completed", { context: 'setYpCommunity', community: req.ypCommunity.hostname });
    next();
  });
});

var bearerCallback = function (req, token) {
  return console.log('The user has tried to authenticate with a bearer token');
};

app.use(function (req, res, next) {
  if (req.url.indexOf('/auth') > -1 || req.url.indexOf('/login') > -1) {
    sso.init(req.ypDomain.loginHosts, req.ypDomain.loginProviders, {
      authorize: bearerCallback,
      login: models.User.localCallback
    });
    req.sso = sso;
  }
  next();
});

passport.serializeUser(function(profile, done) {
  if (profile.provider && profile.provider=='facebook') {
    models.User.serializeFacebookUser(profile, function (error, user) {
      if (error) {
        log.error("Error in User from Facebook", {err: error });
        done(error);
      } else {
        log.info("User Connected to Facebook", { context: 'loginFromFacebook', user: toJson(user)});
        done(null, { userId: user.id, loginProvider: 'facebook' });
      }
    });
  } else if (profile.provider && profile.provider=='saml') {
      models.User.serializeSamlUser(profile, function (error, user) {
        if (error) {
          log.error("Error in User from SAML", {err: error });
          done(error);
        } else {
          log.info("User Connected to SAML", { context: 'loginFromSaml', user: toJson(user)});
          done(null, { userId: user.id, loginProvider: 'facebook' });
        }
      });
  } else {
    log.info("User Serialized", { context: 'deserializeUser', userEmail: profile.email, userId: profile.id });
    done(null, { userId: profile.id, loginProvider: 'email' } );
  }
});

passport.deserializeUser(function(sessionUser, done) {
  models.User.find({
    where: { id: sessionUser.userId },
    attributes: ["id", "name", "email", "facebook_id", "twitter_id", "google_id", "github_id"],
    include: [
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
      user.loginProvider = sessionUser.loginProvider;
      done(null, user);
    } else {
      log.error("User Deserialized Not found", { context: 'deserializeUser' });
      airbrake.notify("User Deserialized Not found", function(airbrakeErr, url) {
        if (airbrakeErr) {
          log.error("AirBrake Error", { context: 'airbrake', user: toJson(req.user), err: airbrakeErr, errorStatus: 500 });
        }
        done(null, false);
      });
    }
  }).catch(function(error) {
    log.error("User Deserialize Error", { context: 'deserializeUser', user: id, err: error, errorStatus: 500 });
    airbrake.notify(error, function(airbrakeErr, url) {
      if (airbrakeErr) {
        log.error("AirBrake Error", { context: 'airbrake', user: toJson(req.user), err: airbrakeErr, errorStatus: 500 });
      }
      done(null, false);
    });
  });
});

app.use('/', index);
app.use('/api/domains', domains);
app.use('/api/organizations', organizations);
app.use('/api/communities', communities);
app.use('/api/groups', groups);
app.use('/api/posts', posts);
app.use('/api/points', points);
app.use('/api/images', images);
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/news_feeds', news_feeds);
app.use('/api/activities', activities);

app.use('/ideas', legacyPosts);
app.use('/users', legacyUsers);
app.use('/pages', legacyPages);

app.post('/authenticate_from_island_is', function (req, res) {
  log.info("SAML SAML 1", {domainId: req.ypDomain.id});
  req.sso.authenticate('saml-strategy-'+req.ypDomain.id, {}, req, res, function(error, user) {
    log.info("SAML SAML 2", {domainId: req.ypDomain.id, err: error});
    if (error) {
      log.error("Error from SAML login", { err: error });
      error.url = req.url;
      airbrake.notify(error, function(airbrakeErr, url) {
        if (airbrakeErr) {
          log.error("AirBrake Error", { context: 'airbrake', user: toJson(req.user), err: airbrakeErr, errorStatus: 500 });
        }
        res.sendStatus(500);
      });
    } else {
      log.info("SAML SAML 3", {domainId: req.ypDomain.id});
      res.render('samlLoginComplete', {});
    }
  })
});

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
app.use(function(err, req, res, next) {
  var status = err.status || 500;
  res.status(status);
  if (status==404) {
    log.warn("Not found", { context: 'notFound', errorStatus: status, url: req.url });
  } else {
    log.error("General Error", { context: 'generalError', user: toJson(req.user), err: err, errStack: err.stack, errorStatus: status });
  }
  err.url = req.url;
  err.params = req.params;
  if (status!=404) {
    airbrake.notify(err, function(airbrakeErr, url) {
      if (airbrakeErr) {
        log.error("AirBrake Error", { context: 'airbrake', user: toJson(req.user), err: airbrakeErr, errorStatus: 500 });
      }
      res.send({
        message: err.message,
        error: err
      });
    });
  } else {
    res.send({
      message: err.message,
      error: err
    });
  }
});

var server = app.listen(app.get('port'), function() {
  debug('Your Priorities server listening on port ' + server.address().port);
});

module.exports = app;
