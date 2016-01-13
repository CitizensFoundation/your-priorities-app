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

router.get('/login', passport.authenticate('local'), function (req, res) {
  res.send(req.user);
});

router.post('/register', function (req, res) {

  var user = models.User.build({
    email: req.body.email,
    name: req.body.name
  });

  user.createPasswordHash(req.body.password);

  user.save().then(function () {
    req.logIn(user, function (err) {
      if (err) {
        return res.sendStatus(401);
      } else {
        res.send(user);
      }
    });
  }).catch(function (error) {
    res.sendStatus(500);
  });
});

router.put('/:id', auth.can('edit user'), function (req, res) {
  models.User.find({
    where: {id: req.params.id}
  }).then(function (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.save().then(function () {
      user.setupImages(req.body, function (err) {
        if (err) {
          res.sendStatus(403);
          console.error(err);
        } else {
          res.send(user);
        }
      });
    });
  });
});

router.post('/forgot_password', function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      models.User.find({
        where: {email: req.body.email}
      }).then(function (user) {
        if (!user) {
          res.send('No account with that email address exists.');
          return;
        }

        user.reset_password_token = token;
        user.reset_password_expires = Date.now() + 3600000; // 1 hour

        user.save().then(function () {
          done(err, token, user);
        }).catch(function (error) {
          res.sendStatus(500);
          return;
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@yrpri.org',
        subject: 'Your Priorities Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
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
