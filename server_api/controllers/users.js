var express = require('express');
var router = express.Router();
var models = require("../models");
var passport = require('passport');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(401).send('Unauthorized');
}

var needsGroup = function(groupId) {
    return function(req, res, next) {
        if (req.user && req.user.group === groupId)
            next();
        else
            res.send(401, 'Unauthorized');
    };
};

router.get('/login',  passport.authenticate('local'), function(req, res) {
    res.send(req.user);
});

router.post('/register', function(req, res) {

    var user = models.User.build({
        email: req.body.email,
        name: req.body.name
    });

    user.createPasswordHash(req.body.password);

    user.save().then(function() {
        req.logIn(user, function(err) {
            if (err) {
                return res.sendStatus(401);
            } else {
                res.send(user);
            }
        });
    }).catch(function(error) {
        res.sendStatus(500);
    });
});

router.put('/:id', isAuthenticated, function(req, res) {
    models.User.find({
        where: { id: req.params.id }
    }).then(function(user) {
        user.name = req.body.name;
        user.email = req.body.email;
        user.save().then(function () {
            user.setupImages(req.body, function(err) {
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

router.get('/isloggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

router.post('/logout', function(req, res){
    var userEmail = "";
    if (req.user) {
        userEmail = req.user.email;
    }
    req.logOut();
    res.sendStatus(200);
});

router.get('/:id/endorsements', function(req, res) {
    models.Endorsement.findAll({
        where: { user_id: req.params.id, status: 'active' },
        order: "created_at DESC"
    }).then(function(endorsements) {
        res.send(endorsements);
    });
});

module.exports = router;
