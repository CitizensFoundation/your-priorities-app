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
  var user, endorsements, pointQualities;

  async.parallel([
    function (seriesCallback) {
      models.User.find({
        where: {id: userId},
        attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublic, ['notifications_settings','email','default_locale']),
        order: [
          [ { model: models.Image, as: 'UserProfileImages' } , 'created_at', 'asc' ],
          [ { model: models.Image, as: 'UserHeaderImages' } , 'created_at', 'asc' ]
        ],
        include: [
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
      }).then(function(userIn) {
        user = userIn;
        seriesCallback();
      }).catch(function(error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      models.Endorsement.findAll({
        where: {user_id: userId},
        attributes: ['id', 'value', 'post_id']
      }).then(function(endorsementsIn) {
        endorsements = endorsementsIn;
        seriesCallback();
      }).catch(function(error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      models.PointQuality.findAll({
        where: {user_id: userId},
        attributes: ['id', 'value', 'point_id']
      }).then(function (pointQualitiesIn) {
        pointQualities = pointQualitiesIn;
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    }
  ], function (error) {
    if (user) {
      user.dataValues.Endorsements = endorsements;
      user.dataValues.PointQualities = pointQualities;
    }
    callback(error, user);
  })
};

// Login
router.post('/login', function (req, res) {
  req.sso.authenticate('local-strategy', {}, req, res, function(err, user) {
    console.log(user);
    log.info('User Login', {context: 'view', user: toJson(req.user)});
    getUserWithAll(req.user.id, function (error, user) {
      if (error || !user) {
        log.error("User Login Error", {context: 'login', user: user.id, err: error, errorStatus: 500});
        res.sendStatus(500);
      } else {
        if (user.email) {
          delete user.email;
        } else {
          user.missingEmail = true;
        }
        res.send(user)
      }
    });
  });
});

// Register
router.post('/register', function (req, res) {
  var user = models.User.build({
    email: req.body.email,
    name: req.body.name,
    notifications_settings: models.AcNotification.defaultNotificationSettings,
    status: 'active'
  });
  user.createPasswordHash(req.body.password);
  user.save().then(function () {
    log.info('User Created', { user: toJson(user), context: 'create', loggedInUser: toJson(req.user) });
    req.logIn(user, function (error, detail) {
      sendUserOrError(res, user, 'registerUser', error, 401);
    });
  }).catch(function (error) {
    if (error && error.name=='SequelizeUniqueConstraintError') {
      log.error("User Error", { context: 'SequelizeUniqueConstraintError', user: user, err: error,
        errorStatus: 500 });
      res.status(500).send({status:500, message: error.name, type:'internal'});
      } else {
      sendUserOrError(res, null, 'create', error);
    }
  });
});

// Edit User
router.put('/:id', auth.can('edit user'), function (req, res) {
  models.User.find({
    where: {id: req.params.id},
    attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublic, ['created_at', 'notifications_settings'])
  }).then(function (user) {
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.description = req.body.description;
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

router.get('/:id', function (req, res) {
  var groupsInclude, communitiesInclude;

  var where = {
    id: req.params.id
  };

  groupsInclude = {
    model: models.Group,
    as: 'GroupUsers',
    attributes: ['id','name','objectives'],
    include: [
      {
        model: models.Image, as: 'GroupLogoImages',
        attributes: ['id','formats'],
        required: false
      }
    ]
  };

  communitiesInclude = {
    model: models.Community,
    as: 'CommunityUsers',
    attributes: ['id','name','description'],
    include: [
      {
        model: models.Image, as: 'CommunityLogoImages',
        attributes: ['id','formats'],
        required: false
      }
    ]
  };

  var attributes = ['id','name','description'];

  if (req.user && req.user.id==req.params.id) {
    attributes = _.concat(attributes, ['email'])
  }

  if (req.user && req.user.id == parseInt(req.params.id)) {
  } else {
    _.merge(communitiesInclude, {
      where: {
        access: models.Community.ACCESS_PUBLIC
      }
    });

    _.merge(groupsInclude, {
      where: {
        access: models.Group.ACCESS_PUBLIC
      }
    });
  }

  models.User.find({
    where: where,
    order: [
      [ { model: models.Community, as: "CommunityUsers" }, 'counter_users', 'desc' ],
      [ { model: models.Community, as: "CommunityUsers" }, { model: models.Image, as: 'CommunityLogoImages' } , 'created_at', 'asc' ],
      [ { model: models.Group, as: "GroupUsers" }, { model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc' ],
      [ { model: models.Group, as: "GroupUsers" }, 'counter_users', 'desc' ],
      [ { model: models.Image, as: 'UserProfileImages' } , 'created_at', 'asc' ],
      [ { model: models.Image, as: 'UserHeaderImages' } , 'created_at', 'asc' ]
    ],

    attributes: attributes,

    include: [
      communitiesInclude,
      groupsInclude,
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
  }).then(function (user) {
    res.send(user);
  }).catch(function (error) {
    log.error("User Get Error", { context: 'user_get', err: error, errorStatus: 500 });
    res.sendStatus(500);
  });
});

router.get('/loggedInUser/adminRights', function (req, res) {
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
              attributes: ['id','name','configuration'],
              required: false,
              include: [
                {
                  model: models.Community,
                  attributes: ['id','name','domain_id'],
                  required: false
                }
              ]
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
              attributes: ['id','name','description','website','access'],
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

router.get('/loggedInUser/memberships', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    var memberships = {};
    async.parallel([
      function (seriesCallback) {
        models.User.find({
          where: {id: req.user.id},
          attributes: ['id'],
          order: [
            [ { model: models.Domain, as: 'DomainUsers' } , 'counter_users', 'desc' ]
          ],
          include: [
            {
              model: models.Domain,
              as: 'DomainUsers',
              attributes: ['id','name','counter_users'],
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
          order: [
            [ { model: models.Community, as: 'CommunityUsers' } , 'counter_users', 'desc' ]
          ],
          include: [
            {
              model: models.Community,
              as: 'CommunityUsers',
              attributes: ['id','name','counter_users'],
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
          order: [
            [ { model: models.Group, as: 'GroupUsers' } , 'counter_users', 'desc' ]
          ],
          include: [
            {
              model: models.Group,
              as: 'GroupUsers',
              attributes: ['id','name','counter_users','configuration'],
              required: false,
              include: [
                {
                  model: models.Community,
                  attributes: ['id','name','domain_id'],
                  required: false
                }
              ]
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

router.put('/loggedInUser/setLocale', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    getUserWithAll(req.user.id, function (error, user) {
      if (error || !user) {
        log.error("User setLocale Error", { context: 'setLocale', user: req.user.id, err: error, errorStatus: 500 });
        res.sendStatus(500);
      } else {
        user.set('default_locale', req.body.locale);
        user.save().then(function (user) {
          log.info("User setLocale", {context: 'setLocale', user: req.user.id});
          res.sendStatus(200);
        }).catch(function (error) {
          log.error("User setLocale Error", { context: 'setLocale', user: req.user.id, err: error, errorStatus: 500 });
          res.sendStatus(500);
        });
      }
    })
  } else {
    res.send('0');
  }
});

router.get('/loggedInUser/isloggedin', function (req, res) {
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
        if (user.email && user.email!="") {
          delete user.email;
        } else {
          user.dataValues.missingEmail = true;
        }

        if (req.user.loginProvider)
          user.dataValues.loginProvider = req.user.loginProvider;

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
          user.reset_password_expires = Date.now() + (3600000 * 48); // 2 days
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
      res.send({ error: 'not_found' });
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
    context: { pathName: req.body.path_name, name: req.body.context, eventTime: req.body.event_time,
               sessionId: req.body.sessionId, userAgent: req.body.user_agent },
    userId: req.user ? req.user.id : null,
    domainId: req.ypDomain.id,
    groupId: req.params.groupId,
//    communityId: req.ypCommunity ? req.ypCommunity.id : null,
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
          user.createPasswordHash(req.body.password);
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
          groupId: req.params.groupId
//          communityId: req.ypCommunity ?  req.ypCommunity.id : null
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
        res.send({ error: 'not_found' });
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

router.get('/get_invite_info/:token', function(req, res) {
  models.Invite.find({
    where: {
      token: req.params.token,
      joined_at: null
    },
    include: [
      {
        model: models.User,
        as: 'FromUser',
        attributes: ['id', 'name', 'email'],
        required: true
      },
      {
        model: models.Group,
        required: false
      },
      {
        model: models.Community,
        required: false
      }
    ]
  }).then(function (invite) {
    if (invite) {
      var targetName;
      if (invite.Group) {
        targetName = invite.Group.name;
      } else if (invite.Community) {
        targetName = invite.Community.name;
      }
      res.send({ targetName: targetName, inviteName: invite.FromUser.name });
    } else {
      log.info('User Invite Token Not found', {context: 'get_invite_info'});
      res.sendStatus(404);
    }
  });
});

router.post('/accept_invite/:token', auth.isLoggedIn, function(req, res) {
  models.Invite.find({
    where: {
      token: req.params.token,
      joined_at: null
    },
    include: [
      {
        model: models.User,
        as: 'FromUser',
        attributes: ['id', 'name', 'email'],
        required: true
      },
      {
        model: models.Group,
        required: false
      },
      {
        model: models.Community,
        required: false
      }
    ]
  }).then(function (invite) {
    if (invite) {
      invite.joined_at = Date.now();
      invite.save().then(function (results) {
        if (invite.Group) {
          invite.Group.addGroupUsers(req.user).then(function (error) {
            res.send({name: invite.Group.name, redirectTo: "/group/"+ invite.Group.id});
          });
        } else if (invite.Community) {
          invite.Community.addCommunityUsers(req.user).then(function (error) {
            res.send({name: invite.Community.name, redirectTo: "/community/"+ invite.Community.id});
          });
        }
      })
    } else {
      log.warn('User Invite Token Not found', {user: toJson(user), context: 'get_invite_info'});
      res.sendStatus(404);
    }
  });
});

// Facebook Authentication
router.get('/auth/facebook', function(req, res) {
  req.sso.authenticate('facebook-strategy-'+req.ypDomain.id, {}, req, res, function(error, user) {
    if (error) {
      log.error("Error from Facebook login init", { err: error });
      throw error;
    }
  });
});

router.put('/missingEmail/setEmail', function(req, res, next) {
  models.User.find({
    where: {
      email: req.body.email
    }}).then( function (user) {
      if (user) {
        res.send({
          alreadyRegistered: true
        })
      } else {
        models.User.find({
          where: {
            id: req.user.id
          }}).then( function (user) {
            user.email = req.body.email;
            user.save().then(function (results) {
              res.send({email: user.email});
            });
          })
       }
    }).catch(function (error) {
      log.error("Error from setEmail", { err: error });
      res.sendStatus(500);
  });
});

router.put('/missingEmail/linkAccounts', function(req, res, next) {
  log.info("User Serialized Link 1", {loginProvider: req.user.loginProvider});
  models.User.find({
    where: {
      email: req.body.email
    }}).then( function (user) {
    if (user) {
      user.validatePassword( req.body.password, function (hmm, userWithPassword, message) {
        if (!userWithPassword) {
          res.send( {
           error: 'wrong password'
          });
        } else {
          var foundLoginProvider = true;
          log.info("User Serialized Link 2", {loginProvider: req.user.loginProvider});
          if (req.user.loginProvider=='facebook') {
            user.facebook_id = req.user.facebook_id;
            req.user.facebook_id = null;
          } else if (req.user.loginProvider=='google') {
              user.google_id = req.user.google_id;
              req.user.google_id = null;
          } else if (req.user.loginProvider=='twitter') {
            user.twitter_id = req.user.twitter_id;
            req.user.twitter_id = null;
          } else if (req.user.loginProvider=='github') {
            user.github_id = req.user.github_id;
            req.user.github_id = null;
          } else if (req.user.loginProvider=='saml') {
            user.set('ssn', req.user.ssn);
            req.user.set('ssn', null);
            log.info("User Serialized Linked Accounts SAML", { userFrom: req.user, toUser: user, toUserSsn: user.ssn, fromUserSsn: req.user.ssn });
          } else {
            foundLoginProvider = false;
          }
          if (foundLoginProvider) {
            models.sequelize.transaction(function (t) {
              return user.save({transaction: t}).then(function (user) {
                return req.user.save({transaction: t});
              });
            }).then(function (result) {
              log.info("User Serialized Linked Accounts", { toUserSsn: user.ssn, fromUserSsn: req.user.ssn, userFrom: req.user, toUser: user });
              req.logIn(user, function (error, detail) {
                if (error) {
                  sendUserOrError(res, null, 'linkAccounts', error, 401);
                } else {
                  res.send({email: user.email, accountLinked: true });
                }
              });
            }).catch(function (err) {
              log.error("User Serialized Linked Accounts Error", { userFrom: req.user, toUser: user, err: err });
              req.send( {
                error: 'Unexpected error'
              });
            });
          } else {
            req.send( {
              error: 'no login provider to move from'
            });
          }
        }
      });
    } else {
      log.error("Email not found for linkAccounts", {});
      req.sendStatus(404);
    }
  }).catch(function (error) {
    log.error("Error from linkAccounts", { err: error });
    res.sendStatus(500);
  });
});

router.get('/available/groups', function(req, res, next) {
  models.Group.findAll({
    attributes: ['id','name','access','configuration'],
    include: [
      {
        model: models.Community,
        required: true,
        attributes: [
          'id','domain_id'
        ],
        where: {
          domain_id: req.ypDomain.id
        }
      }
    ],
    where: {
      access: models.Group.ACCESS_PUBLIC
    }}).then( function (groups) {
      res.send({ groups: groups, domainId: req.ypDomain.id });
  }).catch(function (error) {
    log.error("Error from get available groups", { err: error });
    res.sendStatus(500);
  });
});

router.get('/:id/status_update/:bulkStatusUpdateId', function(req, res, next) {
  var statusUpdate;
  var allUserEndorsementsPostId = [];
  var config;

  async.series([
    function (seriesCallback) {
      models.BulkStatusUpdate.find({
        where: { id: req.params.bulkStatusUpdateId },
        order: [
          [ models.Community, {model: models.Image, as: 'CommunityLogoImages'}, 'created_at', 'asc'],
          [ models.Community, {model: models.Image, as: 'CommunityHeaderImages'}, 'created_at', 'asc']
        ],
        include: [
          {
            model: models.Community,
            required: true,
            include: [
              {
                model: models.Image, as: 'CommunityLogoImages',
                required: false
              },
              {
                model: models.Image, as: 'CommunityHeaderImages',
                required: false
              }
            ]
          },
          {
            model: models.User,
            required: true,
            attributes: models.User.defaultAttributesWithSocialMediaPublic
          }
        ]
      }).then(function(statusUpdateIn) {
        if (statusUpdateIn) {
          statusUpdate = statusUpdateIn;
          seriesCallback();
        } else {
          seriesCallback("Bulk status update not found");
        }
      }).catch(function(error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      models.Endorsement.findAll({
        where: {
          user_id: req.params.id
        },
        attributes: ['id','post_id']
      }).then(function (endorsements) {
        _.each(endorsements, function (endorsement) {
          allUserEndorsementsPostId.push(endorsement.post_id);
        });
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
       config = JSON.parse(JSON.stringify(statusUpdate.config));
      _.each(config.groups, function (group, groupsIndex) {
        log.info("Before posts reject count "+config.groups[groupsIndex].posts.length);
        /*config.groups[groupsIndex].posts = _.reject(config.groups[groupsIndex].posts, function (post) {
          return !_.includes(allUserEndorsementsPostId, post.id)
        });*/
        log.info("After posts reject count "+config.groups[groupsIndex].posts.length);
        config.groups[groupsIndex]["statuses"] = [];
        var gotStatus = {};
        _.each(config.groups[groupsIndex].posts, function (post) {
          if (!post.newOfficialStatus)
            post.newOfficialStatus = 0;
          if (!gotStatus[post.newOfficialStatus]) {
            gotStatus[post.newOfficialStatus] = true;
            if (post.newOfficialStatus) {
              config.groups[groupsIndex]["statuses"].push({official_status: post.newOfficialStatus, posts: []});
            }
          }
          _.each(config.groups[groupsIndex]["statuses"], function (status, index) {
            if (status.official_status == post.newOfficialStatus) {
              config.groups[groupsIndex]["statuses"][index].posts.push(post);
            }
          });
          config.groups[groupsIndex].posts = null;
        });
      });
      config.groups = _.reject(config.groups, function (group) {
        var totalCount = 0;
        _.each(group.statuses, function (status) {
          totalCount += status.posts.length;
        });
        return totalCount == 0;
      });
      seriesCallback();
    }
  ], function (error) {
    if (error) {
      log.error("Error from status_update", { err: error });
      res.sendStatus(500);
    } else {
     res.send({ config: config, templates: statusUpdate.templates, community: statusUpdate.Community });
    }
  });
});

// SAML Authentication
router.get('/auth/saml', function(req, res, next) {
  req.sso.authenticate('saml-strategy-'+req.ypDomain.id, {}, req, res, function(error, user) {
    if (error) {
      log.error("Error from SAML login", { err: error });
      res.sendStatus(500);
    }
  });
});

router.get('/auth/facebook/callback', function(req, res) {
  req.sso.authenticate('facebook-strategy-'+req.ypDomain.id, {}, req, res, function(error, user) {
    if (error) {
      log.error("Error from Facebook login", { err: error });
      res.sendStatus(500);
    } else {
      res.render('facebookLoginComplete', {});
    }
  })
});

// Twitter Authentication
//router.get('/auth/twitter', passport.authenticate('twitter'));

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
