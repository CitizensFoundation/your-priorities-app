var express = require('express');
var router = express.Router();
var models = require("../models");
var passport = require('passport');
var auth = require('../authorization');

var needsGroup = function (groupId) {
  return function (req, res, next) {
    if (req.user && req.user.group === groupId)
      next();
    else
      res.send(401, 'Unauthorized');
  };
};

var sendUserOrError = function (res, user, context, error, errorStatus) {
  if (error || !user) {
    if (errorStatus == 404) {
      log.warning("User Not Found", { context: context, err: error, user: user,
                                      errorStatus: 404 });
    } else {
      log.error("User Error", { context: context, post: post, user: user, err: error,
                                errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(user);
  }
};

router.get('/login', passport.authenticate('local'), function (req, res) {
  log.info('User Login', { context: 'view', user: req.user });
  res.send(req.user);
});

router.post('/register', function (req, res) {
  var user = models.User.build({
    email: req.body.email,
    name: req.body.name
  });
  user.createPasswordHash(req.body.password);
  user.save().then(function () {
    log.info('User Created', { user: user, context: 'create', loggedInUser: req.user });
    req.logIn(user, function (error) {
      sendUserOrError(res, user, 'registerUser', error, 401);
    });
  }).catch(function (error) {
    sendUserOrError(res, null, 'create', error);
  });
});

router.put('/:id', auth.can('edit user'), function (req, res) {
  models.User.find({
    where: {id: req.params.id}
  }).then(function (user) {
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.save().then(function () {
        log.info('User Updated', { user: user, context: 'update', loggedInUser: req.user });
        user.setupImages(req.body, function (error) {
          sendUserOrError(res, user, 'setupImages', error);
        });
      });
    } else {
      sendUserOrError(res, req.params.id, 'update', 'Not found', 404);
    }
  });
});

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
        where: { email: req.body.email }
      }).then(function (user) {
        if (user) {
          user.reset_password_token = token;
          user.reset_password_expires = Date.now() + 3600000; // 1 hour
          user.save().then(function () {
            log.info('User Reset Password Token Created', { user: user, context: 'forgotPassword', loggedInUser: req.user });
            done(null, token, user);
          }).catch(function (error) {
            log.error('User Reset Password Token Error', { user: user, context: 'forgotPassword', loggedInUser: req.user, errorStatus: 500 });
            res.sendStatus(500);
            return;
          });
        } else {
          log.info('User Reset Password Token Not Found', { user: user, context: 'forgotPassword', loggedInUser: req.user, errorStatus: 404 });
          res.sendStatus(404);
          return;
        }
      });
    },
    function(token, user, done) {
      log.error('User Reset Password Token Error', { user: user, context: 'forgotPassword', loggedInUser: req.user });
      models.AcActivity.createPasswordRecovery(user, req.ypDomain, req.ypCommunity, token, function (error) {
        done(error, token, user);
      });
    }
  ], function(error, token, user) {
    if (error) {
      res.sendStatus(500);
    } else {
      log.info('User Reset Password Token Activity Created', { user: user, context: 'forgotPassword', loggedInUser: req.user });
      res.sendStatus(200);
    }
  });
});

router.get('/reset/:token', function(req, res) {
  models.User.find({
    where:
    {
      reset_password_token: req.params.token,
      reset_password_expires: {
        $gt: Date.now()
      }
    }
  }).then(function (user) {
    if (!user) {
      res.send('Password reset token is invalid or has expired.');
      res.sendStatus(401);
    }
    res.send(user);
  });
});


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      models.User.find({
        where:
        {
          reset_password_token: req.params.token,
          reset_password_expires: {
            $gt: Date.now()
          }
        }
      }).then(function (user) {
        if (!user) {
          res.send('Password reset token is invalid or has expired.');
          res.sendStatus(401);
          return
        }
        user.password = req.body.password;
        user.reset_password_token = null;
        user.reset_password_expires = null;

        user.save().then(function () {
          req.logIn(user, function (err) {
            if (err) {
              res.sendStatus(401);
              return;
            } else {
              done(err, user);
            }
          });
        }).catch(function (error) {
          res.sendStatus(500);
          return;
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.send('Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

router.get('/isloggedin', function (req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

router.post('/logout', function (req, res) {
  var userEmail = "";
  if (req.user) {
    userEmail = req.user.email;
  }
  req.logOut();
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
