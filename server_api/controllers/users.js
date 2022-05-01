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
var queue = require('../active-citizen/workers/queue');
const url = require('url');

const randomstring = require('randomstring');

var getAllModeratedItemsByUser = require('../active-citizen/engine/moderation/get_moderation_items').getAllModeratedItemsByUser;
const performSingleModerationAction = require('../active-citizen/engine/moderation/process_moderation_items').performSingleModerationAction;

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
      res.status(errorStatus).send({ message: error ? error.name  : "Unknown"});
    } else {
      res.status(500).send({ message: error.name });
    }
  } else {
    delete user.dataValues.encrypted_password;
    res.send(user);
  }
};

var getUserWithAll = function (userId, getPrivateProfileData, callback) {
  var user, endorsements, ratings, pointQualities;

  //TODO: Optimize this and get those items above more on demand

  let attributes =  _.concat(models.User.defaultAttributesWithSocialMediaPublic, ['notifications_settings','profile_data','email','ssn','default_locale']);

  if (getPrivateProfileData) {
    attributes = _.concat(attributes, ['private_profile_data']);
  }

  async.parallel([
    function (seriesCallback) {
      models.User.findOne({
        where: {id: userId},
        attributes,
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
        attributes: ['id', 'value', 'post_id'],
        include: [
          {
            model: models.Post,
            attributes: ['group_id']
          }
        ]
      }).then(function(endorsementsIn) {
        endorsements = endorsementsIn;
        seriesCallback();
      }).catch(function(error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      models.Rating.findAll({
        where: {
          user_id: userId
        },
        attributes: ['id', 'value', 'post_id', 'type_index']
      }).then(function(ratingsIn) {
        ratings = ratingsIn;
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
      user.dataValues.Ratings = ratings;
    }
    callback(error, user);
  })
};

// Login
router.post('/login', function (req, res) {
  const startTime = new Date();
  log.info('User Login start', { elapsedTime: (new Date()-startTime), userId: req.user ? req.user.id : null});
  req.sso.authenticate('local-strategy', {}, req, res, function(err, user) {
    log.info('User Login before get', { elapsedTime: (new Date()-startTime), userId: req.user ? req.user.id : null});
    getUserWithAll(req.user.id, true,function (error, user) {
      log.info('User Login completed', { elapsedTime: (new Date()-startTime), userId: req.user ? req.user.id : null});
      if (error || !user) {
        log.error("User Login Error", {context: 'login', user: user ? user.id : null, err: error, errorStatus: 500});
        res.sendStatus(500);
      } else {
        if (user.email) {
          delete user.email;
        } else {
          user.missingEmail = true;
        }

        if (user.private_profile_data && user.private_profile_data.registration_answers) {
          user.dataValues.hasRegistrationAnswers = true;
        } else {
          user.dataValues.hasRegistrationAnswers = false;
        }

        delete user.private_profile_data;

        res.send(user)
      }
    });
  });
});

router.put('/setRegistrationAnswers',  auth.isLoggedIn, (req, res) => {
  getUserWithAll(req.user.id, true,function (error, user) {
    if (error) {
      log.error("Error in setRegistrationAnswers", { error });
      res.sendStatus(500);
    } else {
      setUserProfileData(user, req.body.registration_answers);
      user.save().then(()=>{
        log.info("Have set registration questions");
        res.sendStatus(200);
      }).catch(error=>{
        log.error("Error in setRegistrationAnswers", { error });
        res.sendStatus(500);
      })
    }
  });
});

const setUserProfileData = (user, profileData) => {
  if (!user.private_profile_data) {
    user.set('private_profile_data', {});
  }
  user.set('private_profile_data.registration_answers',profileData);
}

// Register
router.post('/register', function (req, res) {
  var user = models.User.build({
    email: req.body.email.toLowerCase(),
    name: req.body.name,
    notifications_settings: models.AcNotification.defaultNotificationSettings,
    status: 'active'
  });

  user.createPasswordHash(req.body.password);

  if (req.body.registration_answers) {
    setUserProfileData(user, req.body.registration_answers);
    user.dataValues.hasRegistrationAnswers = true;
  } else {
    user.dataValues.hasRegistrationAnswers = false;
  }

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

// Register anonymous
router.post('/register_anonymously', function (req, res) {
  log.info("Anon debug in register_anonymously");
  const groupId = req.body.groupId;
  const oneTimeLoginName = req.body.oneTimeLoginName;

  models.Group.findOne({
    where: {
      id: groupId
    }
  }).then(function (group) {
    if (group &&
        group.configuration &&
       (group.configuration.allowAnonymousUsers ||
        group.configuration.allowOneTimeLoginWithName)) {
      var anonEmail = req.sessionID+"_anonymous@citizens.is";
      models.User.findOne({
        where: {
          email: anonEmail
        }
      }).then(function (existingUser) {
        if (existingUser && existingUser.profile_data && existingUser.profile_data.isAnonymousUser) {
          log.info('Found Already Registered Anonymous', { user: toJson(existingUser), context: 'register_anonymous' });
          req.logIn(existingUser, function (error, detail) {
            log.info("Have logged in Anon 1", { error: error ? error : null, user: req.user });
            sendUserOrError(res, existingUser, 'register_anonymous', error, 401);
          });
        } else {
          var user = models.User.build({
            email: anonEmail,
            name: oneTimeLoginName ? oneTimeLoginName : "Anonymous User",
            notifications_settings: models.AcNotification.anonymousNotificationSettings,
            status: 'active'
          });

          user.set('profile_data', {});
          user.set('profile_data.isAnonymousUser', true);
          user.set('profile_data.trackingParameters', req.body.trackingParameters);

          if (req.body.registration_answers) {
            setUserProfileData(user, req.body.registration_answers);
          }

          user.save().then(function () {
            log.info('User Created Anonymous', { user: toJson(user), context: 'register_anonymous' });
            req.logIn(user, function (error, detail) {
              log.info("Have logged in Anon 2", { error: error ? error : null, user: req.user });
              log.info("Anon debug Session 2", { sessionID: req.sessionID, session: req.session });
              sendUserOrError(res, user, 'register_anonymous', error, 401);
            });
          }).catch(function (error) {
            if (error && error.name=='SequelizeUniqueConstraintError') {
              log.error("User Error", { context: 'SequelizeUniqueConstraintError', user: user, err: error,
                errorStatus: 500 });
              res.status(500).send({status:500, message: error.name, type:'internal'});
            } else {
              sendUserOrError(res, null, 'register_anonymous', error);
            }
          });
        }
      }).catch(function (error) {
        log.error("User Error", { context: 'register_anonymous', err: error, errorStatus: 500 });
        res.status(500).send({status:500, message: error.name, type:'internal'});
      });
    } else {
      log.error("Tried ot register to a group anonymously", { context: 'register_anonymous', err: "", errorStatus: 401 });
      res.sendStatus(401);
    }
  }).catch(function (error) {
    log.error("User Error", { context: 'register_anonymous', err: error, errorStatus: 500 });
    res.status(500).send({status:500, message: error.name, type:'internal'});
  });
});

// Moderation

router.delete('/:userId/:itemId/:itemType/:actionType/process_one_moderation_item', auth.can('edit user'), (req, res) => {
  performSingleModerationAction(req, res, {
    userId: req.params.userId,
    itemId: req.params.itemId,
    itemType: req.params.itemType,
    actionType: req.params.actionType
  });
});

router.delete('/:userId/:actionType/process_many_moderation_item', auth.can('edit user'), (req, res) => {
  queue.add('process-moderation', {
    type: 'perform-many-moderation-actions',
    items: req.body.items,
    actionType: req.params.actionType,
    userId: req.params.userId
  }, 'critical');
  res.send({});
});

router.get('/:userId/moderate_all_content', auth.can('edit user'), (req, res) => {
  getAllModeratedItemsByUser({ userId: req.params.userId, allContent: true }, (error, items) => {
    if (error) {
      log.error("Error getting items for moderation", { error });
      res.sendStatus(500)
    } else {
      res.send(items);
    }
  });
});

// Edit User
router.put('/:id', auth.can('edit user'), function (req, res) {
  models.User.findOne({
    where: {id: req.params.id},
    attributes: _.concat(models.User.defaultAttributesWithSocialMediaPublic, ['created_at', 'profile_data', 'notifications_settings'])
  }).then(function (user) {
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.description = req.body.description;
      user.notifications_settings = JSON.parse(req.body.notifications_settings);
      if (user.profile_data && user.profile_data.isAnonymousUser) {
        user.set('profile_data.isAnonymousUser', false);
      }
      user.save().then(function () {
        log.info('User Updated', { user: toJson(user.simple()), context: 'update', loggedInUser: toJson(req.user.simple()) });
        user.setupImages(req.body, function (error) {
          sendUserOrError(res, user, 'setupImages', error);
        });
      }).catch((error) => {
        log.error("User Error", { context: 'user_edit', err: error, errorStatus: 500 });
        if (error.name==="SequelizeUniqueConstraintError") {
          res.send({ duplicateEmail: true, isError: true });
        } else {
          res.sendStatus(500);
        }
      });
    } else {
      sendUserOrError(res, req.params.id, 'update', 'Not found', 404);
    }
  }).catch((error) => {
    log.error("User Error", { context: 'user_edit', err: error, errorStatus: 500 });
    res.sendStatus(500);
  });
});

router.get('/:id', auth.can('edit user'), function (req, res) {
  if (true) {
    log.error("In Get User - Should not be called error", { context: 'user_get' });
    res.sendStatus(401);
  } else {
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

    models.User.findOne({
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
  }
});

router.get('/loggedInUser/adminRights', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    var adminAccess = {};
    async.parallel([
      function (seriesCallback) {
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Domain,
              as: 'DomainAdmins',
              attributes: ['id'],
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
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Community,
              as: 'CommunityAdmins',
              attributes: ['id'],
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
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Group,
              as: 'GroupAdmins',
              attributes: ['id'],
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
        models.User.findOne({
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
        log.info('User Sent Admin Rights', { userId: req.user ? req.user.id : -1, context: 'adminRights'});
        if (adminAccess.OrganizationAdmins.length===0 &&
            adminAccess.GroupAdmins.length===0 &&
            adminAccess.CommunityAdmins.length===0 &&
            adminAccess.DomainAdmins.length===0) {
          res.send('0');
        } else {
          res.send(adminAccess);
        }
      } else {
        log.error("User AdminRights Error", { context: 'adminRights', err: error, errorStatus: 500 });
        res.sendStatus(500);
      }
    });
  } else {
    log.info('Not Logged in', { context: 'adminRights'});
    res.send('0');
  }
});

router.get('/loggedInUser/adminRightsWithNames', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    var adminAccess = {};
    async.parallel([
      function (seriesCallback) {
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          order: [
            [ { model: models.Domain, as: 'DomainAdmins' } , 'updated_at', 'desc' ]
          ],
          include: [
            {
              model: models.Domain,
              as: 'DomainAdmins',
              attributes: ['id','name','updated_at'],
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
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          order: [
            [ { model: models.Community, as: 'CommunityAdmins' } , 'updated_at', 'desc' ]
          ],
          include: [
            {
              model: models.Community,
              as: 'CommunityAdmins',
              attributes: ['id','name','updated_at'],
              required: false
            }
          ]
        }).then(function(user) {
          adminAccess.CommunityAdmins = _.take(user.CommunityAdmins, req.query.getAll ? 1000000 : 500);
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      },
      function (seriesCallback) {
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          order: [
            [ { model: models.Group, as: 'GroupAdmins' } , 'updated_at', 'desc' ]
          ],
          include: [
            {
              model: models.Group,
              as: 'GroupAdmins',
              attributes: ['id','name','configuration','updated_at'],
              required: false,
              include: [
                {
                  model: models.Community,
                  attributes: ['id','name','domain_id','updated_at'],
                  required: false
                }
              ]
            }
          ]
        }).then(function(user) {
          adminAccess.GroupAdmins = _.take(user.GroupAdmins, req.query.getAll ? 1000000 : 500);
          seriesCallback()
        }).catch(function(error) {
          seriesCallback(error);
        });
      },
      function (seriesCallback) {
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          order: [
            [ { model: models.Organization, as: 'OrganizationAdmins' } , 'updated_at', 'desc' ]
          ],
          include: [
            {
              model: models.Organization,
              as: 'OrganizationAdmins',
              attributes: ['id','name','description','website','access','updated_at'],
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
        log.info('User Sent Admin Rights', { userId: req.user ? req.user.id : -1, context: 'adminRights'});
        if (adminAccess.OrganizationAdmins.length===0 &&
          adminAccess.GroupAdmins.length===0 &&
          adminAccess.CommunityAdmins.length===0 &&
          adminAccess.DomainAdmins.length===0) {
          res.send('0');
        } else {
          res.send(adminAccess);
        }
      } else {
        log.error("User AdminRights Error", { context: 'adminRights', err: error, errorStatus: 500 });
        res.sendStatus(500);
      }
    });
  } else {
    log.info('Not Logged in', { context: 'adminRights'});
    res.send('0');
  }
});

router.get('/loggedInUser/memberships', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    var memberships = {};
    async.parallel([
      function (seriesCallback) {
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Domain,
              as: 'DomainUsers',
              attributes: ['id'],
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
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Community,
              as: 'CommunityUsers',
              attributes: ['id'],
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
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Group,
              as: 'GroupUsers',
              attributes: ['id'],
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
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          include: [
            {
              model: models.Organization,
              as: 'OrganizationUsers',
              attributes: ['id'],
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
        log.info('User Sent Memberships', { userId: req.user ? req.user.id : -1, context: 'memberships'});
        res.send(memberships);
      } else {
        log.error("User Memberships Error", { context: 'memberships', err: error, errorStatus: 500 });
        res.sendStatus(500);
      }
    });
  } else {
    log.info('Not Logged in', { context: 'memberships'});
    res.send('0');
  }
});

router.get('/loggedInUser/membershipsWithNames', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    var memberships = {};
    async.parallel([
      function (seriesCallback) {
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          order: [
            [ { model: models.Domain, as: 'DomainUsers' } , 'updated_at', 'desc' ]
          ],
          include: [
            {
              model: models.Domain,
              as: 'DomainUsers',
              attributes: ['id','name','counter_users','updated_at'],
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
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          order: [
            [ { model: models.Community, as: 'CommunityUsers' } , 'updated_at', 'desc' ]
          ],
          include: [
            {
              model: models.Community,
              as: 'CommunityUsers',
              attributes: ['id','name','counter_users','updated_at'],
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
        models.User.findOne({
          where: {id: req.user.id},
          attributes: ['id'],
          order: [
            [ { model: models.Group, as: 'GroupUsers' } , 'updated_at', 'desc' ]
          ],
          include: [
            {
              model: models.Group,
              as: 'GroupUsers',
              attributes: ['id','name','counter_users','configuration','updated_at'],
              required: false,
              include: [
                {
                  model: models.Community,
                  attributes: ['id','name','domain_id','updated_at'],
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
        models.User.findOne({
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
        log.info('User Sent Memberships', { userId: req.user ? req.user.id : -1, context: 'memberships'});
        res.send(memberships);
      } else {
        log.error("User Memberships Error", { context: 'memberships', err: error, errorStatus: 500 });
        res.sendStatus(500);
      }
    });
  } else {
    log.info('Not Logged in', { context: 'memberships'});
    res.send('0');
  }
});

router.put('/loggedInUser/setLocale', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    getUserWithAll(req.user.id, false,function (error, user) {
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

const setSAMLSettingsOnUser = (req, user, done) => {
  let forceSecureSamlLogin = null;
  let customSamlLoginMessage = null;
  let customSamlDeniedMessage = null;
  const referrer = req.get('Referrer');
  let id=null;
  let urlComponents;
  if (referrer) {
    urlComponents = url.parse(referrer);
  } else {
    log.warn("Can't find referrer for URL when setting up SAML");
  }
  if (urlComponents && urlComponents.pathname && urlComponents.pathname.split("/").length>1) {
    id = urlComponents.pathname.split("/")[2];
  }

  let community, group, isGroupAdmin, isCommunityAdmin;

  async.parallel([
    (parallelCallback) => {
      if (id && referrer.indexOf("/community/")>-1) {
        models.Community.findOne({
          where: {
            id: id
          },
          attributes: ['id','configuration']
        }).then((communityIn) => {
          community = communityIn;
          parallelCallback();
        }).catch((error)=> {
          parallelCallback(error);
        });
      } else {
        parallelCallback();
      }
    },
    (parallelCallback) => {
      if (id && referrer.indexOf("/group/")>-1) {
        models.Group.findOne({
          where: {
            id: id
          },
          attributes: ['id','configuration'],
          include: [
            {
              model: models.Community,
              attributes: ['id','configuration'],
            }
          ]
        }).then((groupIn) => {
          if (groupIn) {
            group = groupIn;
            community = groupIn.Community;
          }
          parallelCallback();
        }).catch((error)=> {
          parallelCallback(error);
        });
      } else {
        parallelCallback();
      }
    },
    (parallelCallback) => {
      if (id && referrer.indexOf("/post/")>-1) {
        models.Post.findOne({
          where: {
            id: id
          },
          attributes: ['id'],
          include: [
            {
              model: models.Group,
              attributes: ['id','configuration'],
              include: [
                {
                  model: models.Community,
                  attributes: ['id','configuration'],
                }
              ]
            }
          ]
        }).then((postIn) => {
          if (postIn) {
            group = postIn.Group;
            community = postIn.Group.Community;
          } else {
            log.error("Can't find post for SAML setup")
          }
          parallelCallback();
        }).catch((error)=> {
          parallelCallback(error);
        });
      } else {
        parallelCallback();
      }
    },
    (parallelCallback) => {
      if (group && req.user) {
        group.hasGroupAdmins(req.user).then((results) => {
          isGroupAdmin = results;
          parallelCallback();
        }).catch((error)=>{
          parallelCallback(error);
        })
      } else {
        parallelCallback();
      }
    },
    (parallelCallback) => {
      if (community && req.user) {
        community.hasCommunityAdmins(req.user).then((results) => {
          isCommunityAdmin = results;
          parallelCallback();
        }).catch((error)=>{
          parallelCallback(error);
        })
      } else {
        parallelCallback();
      }
    }
  ], (error) => {
    if (error) {
      done(error);
    } else {
      if (group && group.configuration && !isGroupAdmin) {
        if (group.configuration.forceSecureSamlLogin) {
          forceSecureSamlLogin = true;
        }
      }

      if (community && community.configuration && !isCommunityAdmin) {
        if (community.configuration.forceSecureSamlLogin) {
          forceSecureSamlLogin = true;
        }

        if (community.configuration.customSamlDeniedMessage) {
          customSamlDeniedMessage = community.configuration.customSamlDeniedMessage;
        }

        if (community.configuration.customSamlLoginMessage) {
          customSamlLoginMessage = community.configuration.customSamlLoginMessage;
        }
      }

      if (user.dataValues) {
        user.dataValues.forceSecureSamlLogin = forceSecureSamlLogin;
        user.dataValues.customSamlDeniedMessage = customSamlDeniedMessage;
        user.dataValues.customSamlLoginMessage = customSamlLoginMessage;
      } else {
        user.forceSecureSamlLogin = forceSecureSamlLogin;
        user.customSamlDeniedMessage = customSamlDeniedMessage;
        user.customSamlLoginMessage = customSamlLoginMessage;
      }
      done();
    }
  });
};

router.get('/loggedInUser/isloggedin', function (req, res) {
  if (req.isAuthenticated()) {
    log.info('Logged in', { userId: req.user ? req.user.id : -1, context: 'isLoggedIn'});
  } else {
    log.info('Not Logged in');
  }
  if (req.isAuthenticated() && req.user) {
    getUserWithAll(req.user.id, true,function (error, user) {
      if (error || !user) {
        log.error("User IsLoggedIn Error 1", { context: 'isloggedin', user: req.user.id, err: error, errorStatus: 500 });
        res.sendStatus(500);
      } else {
        if (user.email && user.email!="") {
          delete user.email;
        } else {
          user.dataValues.missingEmail = true;
        }

        if (user.private_profile_data && user.private_profile_data.registration_answers) {
          user.dataValues.hasRegistrationAnswers = true;
        } else {
          user.dataValues.hasRegistrationAnswers = false;
        }

        delete user.private_profile_data;

        if (req.user.loginProvider)
          user.dataValues.loginProvider = req.user.loginProvider;

        if (req.user.isSamlEmployee)
          user.dataValues.isSamlEmployee = req.user.isSamlEmployee;

        setSAMLSettingsOnUser(req, user, (error) => {
          if (error) {
            log.error("User IsLoggedIn Error 2", { context: 'isloggedin', user: req.user.id, err: error, errorStatus: 500 });
            res.sendStatus(500);
          } else {
            res.send(user);
          }
        });
      }
    })
  } else {
    const user = { notLoggedIn: true };
    setSAMLSettingsOnUser(req, user, (error) => {
      if (error) {
        log.error("User IsLoggedIn Error 3", {context: 'isloggedin', user: req.user ? req.user.id : -1, err: error, errorStatus: 500});
        res.sendStatus(500);
      } else {
        res.send(user);
      }
    })
  }
});

router.delete('/delete_current_user', function (req, res) {
  if (req.isAuthenticated() && req.user) {
    log.info('Deleting user', { user: toJson(req.user), context: 'delete_current_user'});
    var userId = req.user.id;
    models.User.findOne({
      where: {
        id: userId
      }
    }).then(function (user) {
      if (user) {
        user.deleted = true;
        user.email = user.email+"_deleted_"+Math.floor(Math.random() * 9000);
        user.save().then(function () {
          log.info('User deleted', { context: 'delete', user: toJson(req.user) });
          queue.add('process-deletion', { type: 'delete-user-content', userId: userId }, 'critical');
          req.logOut();
          res.sendStatus(200);
        }).catch((error) => {
          log.error('User delete error', { error: error, user: toJson(req.user), context: 'delete_current_user'});
          res.sendStatus(500);
        });
      } else {
        log.error('User delete user not found', { error: error, user: toJson(req.user), context: 'delete_current_user'});
        res.sendStatus(404);
      }
    }).catch(function (error) {
      log.error('User delete error', { error: error, user: toJson(req.user), context: 'delete_current_user'});
      res.sendStatus(500);
    });
  } else {
    log.error('Trying to delete user but not logged in', { user: toJson(req.user), context: 'delete_current_user'});
    res.sendStatus(401);
  }
});

router.delete('/anonymize_current_user', function (req, res) {
  if (req.isAuthenticated()) {
    log.info('Anonymizing user', { user: toJson(req.user), context: 'delete_current_user'});
    var userId = req.user.id;
    models.User.findOne({
      where: {
        id: userId
      }
    }).then(function (user) {
      if (user) {
        user.email = user.email+"_anonymous_anonymized_"+Math.floor(Math.random() * 90000);
        user.name = "Anonymous";
        user.ssn = null;
        user.age_group = null;
        user.post_code = null;
        user.my_gender = null;
        user.description = null;
        user.facebook_id = null;
        user.facebook_profile = null;
        user.twitter_id = null;
        user.twitter_profile = null;
        user.google_id = null;
        user.google_profile = null;
        user.github_id = null;
        user.github_profile = null;
        user.counter_login = 0;
        user.buddy_icon_file_name = null;
        user.twitter_profile_image_url = null;
        user.interaction_profile = null;
        user.social_points = null;
        user.legacy_user_id = null;
        user.ignore_list = null;
        if (!user.profile_data)
          user.set('profile_data', {});
        user.set('profile_data.isAnonymousUser', true);
        user.setUserProfileImages([]).then(() => {
          user.save().then(function () {
            log.info('User anonymized', { context: 'delete', user: toJson(req.user) });
            queue.add('process-anonymization', { type: 'anonymize-user-content', userId: userId }, 'high');
            req.logOut();
            res.sendStatus(200);
          }).catch((error) => {
            log.error('User delete error', { error: error, user: toJson(req.user), context: 'delete_current_user'});
            req.logOut();
            res.sendStatus(500);
          });
        }).catch((error) => {
          log.error('User delete error', { error: error, user: toJson(req.user), context: 'delete_current_user'});
          req.logOut();
          res.sendStatus(500);
        });
      } else {
        log.error('User anonymize user not found', { error: error, user: toJson(req.user), context: 'delete_current_user'});
        res.sendStatus(404);
      }
    }).catch(function (error) {
      log.error('User anonymization error', { error: error, user: toJson(req.user), context: 'delete_current_user'});
      res.sendStatus(500);
    });
  } else {
    log.error('Trying to anonymize user but not logged in', { user: toJson(req.user), context: 'delete_current_user'});
    res.sendStatus(401);
  }
});

router.post('/logout', function (req, res) {
  log.info("Anon debug logout");
  if (req.isAuthenticated()) {
    log.info('User Logging out', { user: toJson(req.user), context: 'logout'});
  } else {
    log.warn('User Logging out but not logged in', { user: toJson(req.user), context: 'logout'});
  }
  if (req.session) {
    req.session.destroy(function(err) {
      req.logOut();
      if (err) {
        log.error("Error on destroying session", { err: err });
        res.sendStatus(500);
      } else {
        log.info("Have destroy session")
        req.user = null;
        req.session = null;
        res.sendStatus(200);
      }
    })
  } else {
    req.logOut();
    res.sendStatus(200);
  }
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
      models.User.findOne({
        where: { email: req.body.email.toLowerCase() },
        attributes: ['id','email','reset_password_token','reset_password_expires','legacy_passwords_disabled']
      }).then(function (user) {
        if (user) {
          user.reset_password_token = token;
          user.reset_password_expires = Date.now() + (3600000 * 240); // 10 days
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
  if (req.params.token) {
    models.User.findOne({
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
        getUserWithAll(user.id, false,function (error, user) {
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
  } else {
    log.error('No token with request', { user: null, context: 'getUserToken', loggedInUser: req.user ? toJson(req.user) : null, errorStatus: 404 });
    res.sendStatus(404);
  }
});

router.post('/createActivityFromApp', function(req, res) {
  const workData = {
    body: {
      actor: req.body.actor,
      type: req.body.type,
      object: req.body.object,
      target: req.body.target,
      path_name: req.body.path_name,
      context: req.body.context,
      event_time: req.body.event_time,
      sessionId: req.body.sessionId,
      user_agent: req.body.user_agent,
      screen_width: req.body.screen_width,
      referrer: req.body.referrer,
      url: req.body.url,
      ipAddress: req.ip,
      server_timestamp: Date.now()
    },

    userId: req.user ? req.user.id : null,
    domainId: req.ypDomain.id,
    communityId: req.ypCommunity ? req.ypCommunity.id : null,
    groupId: req.params.groupId,
    postId: req.body.object ? req.body.object.postId : null
  };

  queue.add('delayed-job', { type: 'create-activity-from-app', workData }, 'medium');
  res.sendStatus(200);
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      models.User.findOne({
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
      getUserWithAll(req.user.id, false,function (error, user) {
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
  models.Invite.findOne({
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
      var targetName, configuration;
      if (invite.Group) {
        targetName = invite.Group.name;
        configuration = invite.Group.configuration;
      } else if (invite.Community) {
        targetName = invite.Community.name;
        configuration = invite.Community.configuration;
      }
      res.send({
        configuration: configuration,
        targetName: targetName,
        inviteName: invite.FromUser.name,
        targetEmail: invite.metadata ? invite.metadata.toEmail : null
      });
    } else {
      log.info('User Invite Token Not found', {context: 'get_invite_info'});
      res.sendStatus(404);
    }
  });
});

router.post('/accept_invite/:token', auth.isLoggedIn, function(req, res) {
  models.Invite.findOne({
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
          models.Group.addUserToGroupIfNeeded(invite.Group.id, req, function () {
            res.send({name: invite.Group.name, redirectTo: "/group/"+ invite.Group.id});
          });
        } else if (invite.Community) {
          invite.Community.addCommunityUsers(req.user).then(function (error) {
            invite.Community.increment('counter_users');
            res.send({name: invite.Community.name, redirectTo: "/community/"+ invite.Community.id});
          });
        }
      })
    } else {
      res.sendStatus(404);
      log.warn('User Invite Token Not found', {context: 'get_invite_info'});
    }
  });
});

router.put('/missingEmail/setEmail', auth.isLoggedIn, function(req, res, next) {
  models.User.findOne({
    where: {
      email: req.body.email
    }}).then( function (user) {
      if (user) {
        res.send({
          alreadyRegistered: true
        })
      } else {
        models.User.findOne({
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

router.put('/missingEmail/emailConfirmationShown', auth.isLoggedIn, function(req, res, next) {
  log.info("email_confirmation_shown 1");
  models.User.findOne({
    attributes: ['id', 'profile_data'],
    where: {
      id: req.user.id
    }}).then( function (user) {
      log.info("email_confirmation_shown 2");
      if (user) {
        log.info("email_confirmation_shown 3");
        if (user.profile_data && user.profile_data.saml_show_confirm_email_completed===false) {
           log.info("email_confirmation_shown 4");
           user.set('profile_data.saml_show_confirm_email_completed', true);
           user.save().then(function () {
             res.sendStatus(200);
           }).catch(function (error) {
             log.error("Error in saving user", { error });
             res.sendStatus(500);
           });
        } else {
          res.sendStatus(200);
        }
      } else {
        res.sendStatus(404);
      }
  }).catch(function (error) {
    log.error("Error from setEmail", { err: error });
    res.sendStatus(500);
  });
});

router.delete('/disconnectFacebookLogin', auth.isLoggedIn, function(req, res, next) {
  models.User.findOne({
    where: {
      id: req.user.id
    }}).then( function (user) {
      if (user) {
        user.facebook_id = null;
        user.save().then(function (results) {
          log.info("Disconnected from Facebook", { userId: user.id });
          res.sendStatus(200);
        });
      } else {
        res.sendStatus(404);
      }
  }).catch(function (error) {
    log.error("Error in disconnect from Facebook", { err: error });
    res.sendStatus(500);
  });
});

router.delete('/disconnectSamlLogin', auth.isLoggedIn, function(req, res, next) {
  models.User.findOne({
    where: {
      id: req.user.id
    }}).then( function (user) {
    if (user) {
      user.ssn = null;
      user.save().then(function (results) {
        log.info("Disconnected from Saml", { userId: user.id });
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(404);
    }
  }).catch(function (error) {
    log.error("Error in disconnect from Saml", { err: error });
    res.sendStatus(500);
  });
});

const completeCreationOfApiKey = (user, apiKey, res) => {
  user.set('private_profile_data.apiKey', apiKey);
  user.save().then(()=>{
    log.info("ApiKey created for user", { userId: user.id });
    res.send({ apiKey: user.private_profile_data.apiKey })
  }).catch(error=>{
    log.error("Error in createApiKey", { err: error });
    res.sendStatus(500);
  })
}

router.post('/createApiKey', auth.isLoggedIn, function(req, res, next) {
  models.User.findOne({
    where: {
      id: req.user.id
    }}).then( function (user) {
    if (user) {
      if (!user.private_profile_data) {
        user.set('private_profile_data', {});
      }

      if (!user.profile_data) {
        user.set('profile_data', {});
      }

      user.set('profile_data.hasApiKey', true);

      let apiKey = randomstring.generate(48);

      models.User.findOne({
        where: {
          private_profile_data: {
            apiKey: apiKey
          }
        },
        attributes: ['id']
      }).then(findUser=>{
        if (!findUser) {
          completeCreationOfApiKey(user, apiKey, res);
        } else {
          apiKey = randomstring.generate(48);
          models.User.findOne({
            where: {
              private_profile_data: {
                apiKey: apiKey
              }
            },
            attributes: ['id']
          }).then(findUserTwo=>{
            if (!findUserTwo) {
              completeCreationOfApiKey(user, apiKey, res);
            } else {
              log.error("Can't create unique createApiKey", {});
              res.sendStatus(500);
            }
          }).catch(error=>{
            log.error("Error in createApiKey", { err: error });
            res.sendStatus(500);
          })
        }
      }).catch(error=>{
        log.error("Error in createApiKey", { err: error });
        res.sendStatus(500);
      })
    } else {
      res.sendStatus(404);
    }
  }).catch(function (error) {
    log.error("Error in disconnect from Saml", { err: error });
    res.sendStatus(500);
  });
});


router.put('/missingEmail/linkAccounts', auth.isLoggedIn, function(req, res, next) {
  log.info("User Serialized Link 1", {loginProvider: req.user.loginProvider});
  models.User.findOne({
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
            user.provider = "facebook";
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

            var profileData = req.user.profile_data;
            if (profileData && user.profile_data)
              profileData = _.merge(req.user.profile_data, user.profile_data);

            if (!profileData && user.profile_data)
              profileData = user.profile_data;

            var privateProfileData = req.user.private_profile_data;
            if (privateProfileData && user.private_profile_data)
              privateProfileData = _.merge(req.user.private_profile_data, user.private_profile_data);

            if (!privateProfileData && user.private_profile_data)
              privateProfileData = user.private_profile_data;

            user.set('private_profile_data', privateProfileData);
            user.set('profile_data', profileData);

            user.UserSSN = user.ssn;
            user.provider = "saml";
            req.user.set('ssn', null);
            log.info("User Serialized Linked Accounts SAML", { userFrom: req.user, toUser: user, toUserSsn: user.ssn, fromUserSsn: req.user.ssn });
          } else {
            foundLoginProvider = false;
          }
          user.loginProvider = req.user.loginProvider;
          if (foundLoginProvider) {
            models.sequelize.transaction(function (t) {
              return user.save({transaction: t}).then(function (user) {
                return req.user.save({transaction: t});
              });
            }).then(function (result) {
              log.info("User Serialized Linked Accounts", { toUserSsn: user.ssn, fromUserSsn: req.user.ssn, userFrom: req.user, toUser: user });
              queue.add('process-deletion', { type: 'move-user-endorsements', toUserId: user.id, fromUserId: req.user.id }, 'high');
              req.logIn(user, function (error, detail) {
                if (error) {
                  sendUserOrError(res, null, 'linkAccounts', error, 401);
                } else {
                  res.send({email: user.email, accountLinked: true });
                }
              });
            }).catch(function (err) {
              log.error("User Serialized Linked Accounts Error", { userFrom: req.user, toUser: user, err: err });
              res.send( {
                error: 'Unexpected error'
              });
            });
          } else {
            res.send( {
              error: 'no login provider to move from'
            });
          }
        }
      });
    } else {
      log.error("Email not found for linkAccounts", {});
      res.sendStatus(404);
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


router.get('/has/AutoTranslation', function(req, res) {
  const hasAutoTranslation = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ? true : false;
  if (typeof hasAutoTranslation==="boolean") {
    res.send({ hasAutoTranslation: hasAutoTranslation });
  } else {
    res.sendStatus(500);
  }
});

router.get('/:id/status_update/:bulkStatusUpdateId', function(req, res, next) {
  if (false) {
    log.error("In status_update status_update - Should not be called error", { context: 'user_get' });
    res.sendStatus(500);
  } else {
    var statusUpdate;
    var allUserEndorsementsPostId = [];
    var config;

    async.series([
      function (seriesCallback) {
        models.BulkStatusUpdate.findOne({
          where: { id: req.params.bulkStatusUpdateId },
          order: [
            [ models.Community, {model: models.Image, as: 'CommunityLogoImages'}, 'created_at', 'asc'],
            [ models.Community, {model: models.Image, as: 'CommunityHeaderImages'}, 'created_at', 'asc']
          ],
          include: [
            {
              model: models.Community,
              required: true,
              attributes: models.Community.defaultAttributesPublic,
              include: [
                {
                  model: models.Image, as: 'CommunityLogoImages',
                  attributes: ['id','formats'],
                  required: false
                },
                {
                  model: models.Image, as: 'CommunityHeaderImages',
                  attributes: ['id','formats'],
                  required: false
                }
              ]
            },
            {
              model: models.User,
              required: true,
              attributes: ['id']
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
  }
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
    order: [['created_at','DESC']],
  }).then(function (endorsements) {
    res.send(endorsements);
  });
});
*/

module.exports = router;
