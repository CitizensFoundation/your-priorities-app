var async = require("async");
var crypto = require("crypto");
var express = require('express');
var router = express.Router();
var models = require("../models");
var passport = require('passport');
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');

var sendUserOrError = function (res, user, context, error, errorStatus) {
  if (error || !user) {
    if (errorStatus == 404) {
      log.warn("User Not Found", { context: context, err: error, user: user,
                                      errorStatus: 404 });
    } else {
      log.error("User Error", { context: context, user: user, err: error,
                                errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.status(errorStatus).send({ message: error.name });
    } else {
      res.status(500).send({ message: error.name });
    }
  } else {
    res.send(user);
  }
};

var getUserWithAll = function (userId, callback) {
  models.User.find({
    where: {id: userId},
    attributes: _.concat(models.User.defaultAttributesWithSocialMedia, ['notifications_settings']),
    order: [
      [ { model: models.Image, as: 'UserProfileImages' } , 'created_at', 'asc' ],
      [ { model: models.Image, as: 'UserHeaderImages' } , 'created_at', 'asc' ]
    ],
    include: [
      {
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
        attributes: ['id', 'created_at', 'formats'],
        required: false
      },
      {
        model: models.Image, as: 'UserHeaderImages',
        attributes: ['id', 'created_at', 'formats'],
        required: false
      }
    ]
  }).then(function(user) {
    callback(null, user);
  }).catch(function(error) {
    callback(error);
  });
};

// Login
router.get('/login', passport.authenticate('local'), function (req, res) {
  log.info('User Login', {context: 'view', user: toJson(req.user)});
  getUserWithAll(req.user.id, function (error, user) {
    if (error || !user) {
      log.error("User Login Error", {context: 'login', user: user.id, err: error, errorStatus: 500});
      res.sendStatus(500);
    } else {
      res.send(user)
    }
  });
});

// Register
router.post('/register', function (req, res) {
  var user = models.User.build({
    email: req.body.email,
    name: req.body.name,
    notification_settings: models.AcNotification.defaultNotificationSettings,
    status: 'active'
  });
  user.createPasswordHash(req.body.password);
  user.save().then(function () {
    log.info('User Created', { user: toJson(user), context: 'create', loggedInUser: toJson(req.user) });
    req.logIn(user, function (error, detail) {
      sendUserOrError(res, user, 'registerUser', error, 401);
    });
  }).catch(function (error) {
    sendUserOrError(res, null, 'create', error);
  });
});

// Edit User
router.put('/:id', auth.can('edit user'), function (req, res) {
  models.User.find({
    where: {id: req.params.id}
  }).then(function (user) {
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.notifications_settings = JSON.parse(req.body.notifications_settings);
      user.save().then(function () {
        log.info('User Updated', { user: toJson(user.simple()), context: 'update', loggedInUser: toJson(req.user.simple()) });
        user.setupImages(req.body, function (error) {
          sendUserOrError(res, user, 'setupImages', error);
        });
      });
    } else {
      sendUserOrError(res, req.params.id, 'update', 'Not found', 404);
    }
  });
});

router.get('/adminRights', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    var adminAccess = {};
    async.parallel([
      function (seriesCallback) {
        models.User.find({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Domain,
              as: 'DomainAdmins',
              attributes: ['id','name'],
              required: false
            }
          ]
        }).then(function(user) {
          adminAccess.DomainAdmins = user.DomainAdmins;
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      },
      function (seriesCallback) {
        models.User.find({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Community,
              as: 'CommunityAdmins',
              attributes: ['id','name'],
              required: false
            }
          ]
        }).then(function(user) {
          adminAccess.CommunityAdmins = user.CommunityAdmins;
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      },
      function (seriesCallback) {
        models.User.find({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Group,
              as: 'GroupAdmins',
              attributes: ['id','name'],
              required: false
            }
          ]
        }).then(function(user) {
          adminAccess.GroupAdmins = user.GroupAdmins;
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      },
      function (seriesCallback) {
        models.User.find({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Organization,
              as: 'OrganizationAdmins',
              attributes: ['id','name'],
              required: false
            }
          ]
        }).then(function(user) {
          adminAccess.OrganizationAdmins = user.OrganizationAdmins;
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      }
    ], function (error) {
      if (!error) {
        log.info('User Sent Admin Rights', { user: toJson(req.user.simple()), context: 'adminRights'});
        res.send(adminAccess);
      } else {
        log.error("User AdminRights Error", { context: 'adminRights', err: error, errorStatus: 500 });
        res.sendStatus(500);
      }
    });
  } else {
    log.info('User Not Logged in', { context: 'adminRights'});
    res.send('0');
  }
});

router.get('/memberships', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    var memberships = {};
    async.parallel([
      function (seriesCallback) {
        models.User.find({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Domain,
              as: 'DomainUsers',
              attributes: ['id','name'],
              required: false
            }
          ]
        }).then(function(user) {
          memberships.DomainUsers = user.DomainUsers;
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      },
      function (seriesCallback) {
        models.User.find({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Community,
              as: 'CommunityUsers',
              attributes: ['id','name'],
              required: false
            }
          ]
        }).then(function(user) {
          memberships.CommunityUsers = user.CommunityUsers;
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      },
      function (seriesCallback) {
        models.User.find({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Group,
              as: 'GroupUsers',
              attributes: ['id','name'],
              required: false
            }
          ]
        }).then(function(user) {
          memberships.GroupUsers = user.GroupUsers;
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      },
      function (seriesCallback) {
        models.User.find({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Organization,
              as: 'OrganizationUsers',
              attributes: ['id','name'],
              required: false
            }
          ]
        }).then(function(user) {
          memberships.OrganizationUsers = user.OrganizationUsers;
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      }
    ], function (error) {
      if (!error) {
        log.info('User Sent Memberships', { user: toJson(req.user.simple()), context: 'memberships'});
        res.send(memberships);
      } else {
        log.error("User Memberships Error", { context: 'memberships', err: error, errorStatus: 500 });
        res.sendStatus(500);
      }
    });
  } else {
    log.info('User Not Logged in', { user: toJson(req.user), context: 'memberships'});
    res.send('0');
  }
});

router.get('/isloggedin', function (req, res) {
  if (req.isAuthenticated()) {
    log.info('User Logged in', { user: toJson(req.user), context: 'isLoggedIn'});
  } else {
    log.info('User Not Logged in', { user: toJson(req.user), context: 'isLoggedIn'});
  }
  if (req.isAuthenticated() && req.user) {
    getUserWithAll(req.user.id, function (error, user) {
      if (error || !user) {
        log.error("User IsLoggedIn Error", { context: 'isloggedin', user: req.user.id, err: error, errorStatus: 500 });
        res.sendStatus(500);
      } else {
        res.send(user);
      }
    })
  } else {
    res.send('0');
  }
});

router.post('/logout', function (req, res) {
  if (req.isAuthenticated()) {
    log.info('User Logging out', { user: toJson(req.user), context: 'logout'});
  } else {
    log.warn('User Logging out vut not logged in', { user: toJson(req.user), context: 'logout'});
  }
  req.logOut();
  res.sendStatus(200);
});

// Reset password
router.post('/forgot_password', function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(error, buf) {
        var token = buf.toString('hex');
        done(error, token);
      });
    },
    function(token, done) {
      models.User.find({
        where: { email: req.body.email },
        attributes: ['id','email','reset_password_token','reset_password_expires','legacy_passwords_disabled']
      }).then(function (user) {
        if (user) {
          user.reset_password_token = token;
          user.reset_password_expires = Date.now() + 3600000; // 1 hour
          user.save().then(function () {
            log.info('User Reset Password Token Created', { user: toJson(user), context: 'forgotPassword', loggedInUser: toJson(req.user) });
            done(null, token, user);
          });
        } else {
          log.info('User Reset Password Token Not Found', { user: toJson(user), context: 'forgotPassword',
                                                            loggedInUser: toJson(req.user), error: 'Token not found', errorStatus: 404 });
          res.sendStatus(404);
          return;
        }
      }).catch(function (error) {
        log.error('User Reset Password Token Error', { user: null, context: 'forgotPassword', loggedInUser: toJson(req.user), err: error, errorStatus: 500 });
        res.sendStatus(500);
      });
    },
    function(token, user, done) {
      models.AcActivity.createPasswordRecovery(user, req.ypDomain, req.ypCommunity, token, function (error) {
        done(error, token, user);
      });
    }
  ], function(error, token, user) {
    if (error) {
      log.error('User Reset Password Token Error', { user: toJson(user), context: 'forgotPassword', loggedInUser: toJson(req.user), err: error, errorStatus: 500 });
      res.sendStatus(500);
    } else {
      log.info('User Reset Password Token Activity Created', { user: toJson(user), context: 'forgotPassword', loggedInUser: toJson(req.user) });
      res.sendStatus(200);
    }
  });
});

router.get('/reset/:token', function(req, res) {
  models.User.find({
    attributes: ['id','email','reset_password_token','reset_password_expires','legacy_passwords_disabled'],
    where:
    {
      reset_password_token: req.params.token,
      reset_password_expires: {
        $gt: Date.now()
      }
    }
  }).then(function (user) {
    if (user) {
      log.info('Get User For Reset Password Token', { user: toJson(user), context: 'getUserToken', loggedInUser: toJson(req.user), errorStatus: 401 });
      getUserWithAll(user.id, function (error, user) {
        if (error || !user) {
          log.error("User Error", { context: 'reset_password_expires', user: req.user.id, err: error, errorStatus: 500 });
          res.sendStatus(500);
        } else {
          res.send(user);
        }
      });
    } else {
      log.error('Get User For Reset Password Token Not found', { user: null, context: 'getUserToken', err: 'Token not found', loggedInUser: toJson(req.user), errorStatus: 401 });
      res.sendStatus(404);
    }
  }).catch(function (error) {
    log.error('Get User For Reset Password Token Error', { user: null, context: 'getUserToken', loggedInUser: toJson(req.user), err: error, errorStatus: 500 });
    res.sendStatus(500);
  });
});

router.post('/createActivityFromApp', function(req, res) {
  models.AcActivity.createActivity({
    type: 'activity.fromApp',
    sub_type: req.body.type,
    actor: { appActor: req.body.actor },
    object: { name: req.body.object },
    context: { name: req.body.context, eventTime: req.body.event_time,
               sessionId: req.body.sessionId, userAgent: req.body.user_agent },
    userId: req.user ? req.user.id : null,
    domainId: req.ypDomain.id,
    groupId: req.params.groupId,
    communityId: req.ypCommunity ? req.ypCommunity.id : null,
    postId: req.body.object ? req.body.object.postId : null
  }, function (error) {
    if (error) {
      log.error('Create Activity Error', { user: null, context: 'createActivity', loggedInUser: req.user ? toJson(req.user) : null, err: error, errorStatus: 500 });
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      models.User.find({
        attributes: ['id','email','reset_password_token','reset_password_expires','legacy_passwords_disabled'],
        where:
        {
          reset_password_token: req.params.token,
          reset_password_expires: {
            $gt: Date.now()
          }
        }
      }).then(function (user) {
        if (user) {
          user.password = req.body.password;
          user.reset_password_token = null;
          user.reset_password_expires = null;
          user.legacy_passwords_disabled = true;
          user.save().then(function () {
            req.logIn(user, function (error) {
              if (error) {
                log.error('User Reset Password Cant login', { user: toJson(user), context: 'useResetToken', loggedInUser: toJson(req.user), err: error, errorStatus: 500 });
                done(error);
              } else {
                log.info('User Reset Password User logged in', { user: toJson(user), context: 'useResetToken', loggedInUser: toJson(req.user) });
                done();
              }
            });
          });
        } else {
          log.info('User Reset Password Token Not found', { user: toJson(user), context: 'useResetToken'});
          done('Not found');
        }
      });
    },
    function(done) {
      if (req.user) {
        models.AcActivity.createActivity({
          type: 'activity.password.changed',
          userId: req.user.id,
          domainId: req.ypDomain.id,
          groupId: req.params.groupId,
          communityId: req.ypCommunity ?  req.ypCommunity.id : null
        }, function (error) {
          done(error);
        });
      } else {
        done('Not found');
      }
    }
  ], function(error) {
    if (error) {
      log.error('User Reset Password Token Error', { user: null, context: 'useResetToken', loggedInUser: toJson(req.user), err: error, errorStatus: 500 });
      if (error=='Not found') {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    } else {
      log.info('User Reset Password Completed', { user: req.user, context: 'useResetToken', loggedInUser: toJson(req.user) });
      getUserWithAll(req.user.id, function (error, user) {
        if (error || !user) {
          log.error("User Error", { context: 'useResetToken', user: req.user.id, err: error, errorStatus: 500 });
          res.sendStatus(500);
        } else {
          res.send(user);
        }
      });
    }
  });
});

// Facebook Authentication
router.get('/auth/facebook/', function(req, res, next) {
  passport.authenticate(
    'facebook',
    { clientID: req.ypDomain.facebook_client_id,
      clientSecret: req.ypDomain.facebook_client_secret }
  ) (req, res, next);
});

router.get('/auth/facebook/callback', function(req, res, next) {
  passport.authenticate(
    'facebook',
    { clientID: req.ypDomain.facebook_client_id,
      clientSecret: req.ypDomain.facebook_client_secret }
  ) (req, res, next) },
    function(req, res) {
      log.info('User Logged in from Facebook', { user: toJson(req.user), context: 'facebookCallback' });
      res.sendStatus(200);
    }
);

// Twitter Authentication
router.get('/auth/twitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    log.info('User Logged in from Twitter', { user: toJson(req.user), context: 'twitterCallback' });
    res.sendStatus(200);
  });

// Google Authentication
router.get('/auth/google', passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    log.info('User Logged in from Google', { user: toJson(req.user), context: 'googleCallback' });
    res.sendStatus(200);
  });

// GitHub Authentication
router.get('/auth/github',
  passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    log.info('User Logged in from GitHub', { user: toJson(req.user), context: 'githubCallback' });
    res.sendStatus(200);
  });
/*
router.get('/:id/endorsements', auth.can('view user'), function (req, res) {
  models.Endorsement.findAll({
    where: {user_id: req.params.id, status: 'active'},
    order: "created_at DESC"
  }).then(function (endorsements) {
    res.send(endorsements);
  });
});
*/

module.exports = router;
