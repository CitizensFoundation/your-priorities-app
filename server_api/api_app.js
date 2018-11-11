#!/usr/bin/env node

FORCE_PRODUCTION = false;

var debug = require('debug')('your-priorities-app');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var ConnectRoles = require('connect-roles');
var RedisStore = require('connect-redis')(session);
var useragent = require('express-useragent');
var requestIp = require('request-ip');
var compression = require('compression');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GitHubStrategy = require('passport-github').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var index = require('./controllers/index');
var news_feeds = require('./active-citizen/controllers/news_feeds');
var activities = require('./active-citizen/controllers/activities');
var notifications = require('./active-citizen/controllers/notifications');
var recommendations = require('./active-citizen/controllers/recommendations');

var posts = require('./controllers/posts');
var groups = require('./controllers/groups');
var communities = require('./controllers/communities');
var domains = require('./controllers/domains');
var organizations = require('./controllers/organizations');
var points = require('./controllers/points');
var users = require('./controllers/users');
var categories = require('./controllers/categories');
var images = require('./controllers/images');
var bulkStatusUpdates = require('./controllers/bulkStatusUpdates');
var videos = require('./controllers/videos');
var audios = require('./controllers/audios');

var legacyPosts = require('./controllers/legacyPosts');
var legacyUsers = require('./controllers/legacyUsers');
var legacyPages = require('./controllers/legacyPages');

var nonSPArouter = require('./controllers/nonSpa');

var generateSitemap = require('./utils/sitemap_generator');
var generateManifest = require('./utils/manifest_generator');

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

var airbrake = null;

if (process.env.AIRBRAKE_PROJECT_ID) {
  airbrake = require('airbrake').createClient(process.env.AIRBRAKE_PROJECT_ID, process.env.AIRBRAKE_API_KEY);
  airbrake.handleExceptions();
  app.use(airbrake.expressHandler());
}

if (app.get('env') != 'development' && !process.env.DISABLE_FORCE_HTTPS) {
  app.use(function (req, res, next) {
    if (!/https/.test(req.protocol)) {
      res.redirect("https://" + req.headers.host + req.url);
    } else {
      return next();
    }
  });
}

app.use(compression());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(cors());

app.use(morgan('combined'));
app.use(useragent.express());
app.use(requestIp.mw());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

var sessionConfig = {
  store: new RedisStore({url: process.env.REDIS_URL}),
  name: 'yrpri.sid',
  secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'not so secret... use env var.',
  resave: true,
  cookie: {autoSubDomain: true},
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

app.get('/*', function (req, res, next) {
  if (req.url.indexOf("service-worker.js") > -1) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Last-Modified", new Date(Date.now()).toUTCString());
  }
  next();
});

if (!FORCE_PRODUCTION && app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, '../client_app'), { index: false }));
} else {
  app.use(express.static(path.join(__dirname, '../client_app/build/bundled'), { index: false, dotfiles:'allow' }));
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

// Setup the current domain from the host
app.use(function (req, res, next) {
  models.Domain.setYpDomain(req, res, function () {
    log.info("Setup Domain Completed", {context: 'setYpDomain', domain: req.ypDomain ? toJson(req.ypDomain.simple()) : null});
    next();
  });
});

// Setup the current community from the host
app.use(function (req, res, next) {
  models.Community.setYpCommunity(req, res, function () {
    log.info("Setup Community Completed", {context: 'setYpCommunity', community: req.ypCommunity.hostname});
    next();
  });
});

app.use(function (req, res, next) {
  var ua = req.headers['user-agent'];
  if (/^(facebookexternalhit)|(web\/snippet)|(Twitterbot)|(Slackbot)|(Embedly)|(LinkedInBot)|(Pinterest)|(XING-contenttabreceiver)/gi.test(ua)) {
    console.log(ua, ' is a bot');
    nonSPArouter(req, res, next);
  } else {
    next();
  }
});

app.get('/sitemap.xml', function (req, res) {
  generateSitemap(req, res);
});

app.get('/manifest.json', function (req, res) {
  generateManifest(req, res);
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

passport.serializeUser(function (req, profile, done) {
  log.info("User Serialized From", {profile: profile});
  if (profile.provider && profile.provider == 'facebook') {
    models.User.serializeFacebookUser(profile, req.ypDomain, function (error, user) {
      if (error) {
        log.error("Error in User Serialized from Facebook", {err: error});
        done(error);
      } else {
        log.info("User Serialized Connected to Facebook", {context: 'loginFromFacebook', user: toJson(user)});
        done(null, {userId: user.id, loginProvider: 'facebook'});
      }
    });
  } else if (profile.provider && profile.UserSSN) {
    models.User.serializeSamlUser(profile, function (error, user) {
      if (error) {
        log.error("Error in User Serialized from SAML", {err: error});
        done(error);
      } else {
        log.info("User Serialized Connected to SAML", {context: 'loginFromSaml', user: toJson(user)});
        done(null, {userId: user.id, loginProvider: 'saml'});
      }
    });
  } else {
    log.info("User Serialized", {
      profile: profile,
      context: 'deserializeUser',
      userEmail: profile.email,
      userId: profile.id
    });
    done(null, {userId: profile.id, loginProvider: 'email'});
  }
});

passport.deserializeUser(function (sessionUser, done) {
  models.User.find({
    where: {id: sessionUser.userId},
    attributes: ["id", "name", "email", "default_locale", "facebook_id", "twitter_id", "google_id", "github_id", "ssn", "profile_data"],
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
  }).then(function (user) {
    if (user) {
      log.info("User Deserialized", {context: 'deserializeUser', user: user.email});
      user.loginProvider = sessionUser.loginProvider;
      done(null, user);
      return null;
    } else {
      log.error("User Deserialized Not found", {context: 'deserializeUser'});
      if (airbrake) {
        airbrake.notify("User Deserialized Not found", function (airbrakeErr, url) {
          if (airbrakeErr) {
            log.error("AirBrake Error", {
              context: 'airbrake',
              user: toJson(req.user),
              err: airbrakeErr,
              errorStatus: 500
            });
          }
        });
      }
      return done(null, false);
    }
  }).catch(function (error) {
    log.error("User Deserialize Error", {context: 'deserializeUser', user: sessionUser.userId, err: error, errorStatus: 500});
    if (airbrake) {
      airbrake.notify(error, function (airbrakeErr, url) {
        if (airbrakeErr) {
          log.error("AirBrake Error", {
            context: 'airbrake',
            user: null,
            err: airbrakeErr,
            errorStatus: 500
          });
        }
      });
    }
    return done(null, false);
  });
});

app.use('/', index);

// Set caching for IE so it wont cache the json queries
app.use(function (req, res, next) {
  var ua = req.headers['user-agent'];
  if (/Trident/gi.test(ua)) {
    res.set("Cache-Control", "no-cache,no-store");
  }
  next();
});

app.use('/domain', index);
app.use('/community', index);
app.use('/group', index);
app.use('/post', index);
app.use('/user', index);
app.use('/api/domains', domains);
app.use('/api/organizations', organizations);
app.use('/api/communities', communities);
app.use('/api/groups', groups);
app.use('/api/posts', posts);
app.use('/api/points', points);
app.use('/api/images', images);
app.use('/api/videos', videos);
app.use('/api/audios', audios);
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/news_feeds', news_feeds);
app.use('/api/activities', activities);
app.use('/api/notifications', notifications);
app.use('/api/bulk_status_updates', bulkStatusUpdates);
app.use('/api/recommendations', recommendations);
app.use('/ideas', legacyPosts);
app.use('/users', legacyUsers);
app.use('/pages', legacyPages);

app.post('/authenticate_from_island_is', function (req, res) {
  log.info("SAML SAML 1", {domainId: req.ypDomain.id});
  req.sso.authenticate('saml-strategy-' + req.ypDomain.id, {}, req, res, function (error, user) {
    log.info("SAML SAML 2", {domainId: req.ypDomain.id, err: error});
    if (error) {
      log.error("Error from SAML login", {err: error});
      error.url = req.url;
      if (airbrake) {
        airbrake.notify(error, function (airbrakeErr, url) {
          if (airbrakeErr) {
            log.error("AirBrake Error", {context: 'airbrake', err: airbrakeErr, errorStatus: 500});
          }
          res.sendStatus(500);
        });
      }
    } else {
      log.info("SAML SAML 3", {domainId: req.ypDomain.id});
      res.render('samlLoginComplete', {});
    }
  })
});

app.use(function (err, req, res, next) {
  if (err instanceof auth.UnauthorizedError) {
    log.error("User Unauthorized", {
      context: 'unauthorizedError',
      user: toJson(req.user),
      err: 'Unauthorized',
      errorStatus: 401
    });
    res.sendStatus(401);
  } else {
    next(err);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  log.warn("Not Found", {context: 'notFound', user: toJson(req.user), err: 'Not Found', errorStatus: 404});
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  var status = err.status || 500;
  if (status == 404) {
    log.warn("Not found", {context: 'notFound', errorStatus: status, url: req.url});
  } else {
    log.error("General Error", {
      context: 'generalError',
      user: req ? toJson(req.user) : null,
      err: err,
      errStack: err.stack,
      errorStatus: status
    });
  }
  err.url = req.url;
  err.params = req.params;
  if (status != 404 && status != 401) {
    if (airbrake) {
      airbrake.notify(err, function (airbrakeErr, url) {
        if (airbrakeErr) {
          log.error("AirBrake Error", {
            context: 'airbrake',
            user: toJson(req.user),
            err: airbrakeErr,
            errorStatus: 500
          });
        }
        res.status(status).send({
          message: err.message,
          error: err
        });
      });
    } else {
      res.status(status).send({
        message: err.message,
        error: err
      });
    }
  } else {
    res.status(status).send({
      message: err.message,
      error: err
    });
  }
});

var server = app.listen(app.get('port'), function () {
  debug('Your Priorities server listening on port ' + server.address().port);
});

module.exports = app;
