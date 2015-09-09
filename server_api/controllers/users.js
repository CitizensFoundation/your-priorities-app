var express = require('express');
var router = express.Router();
var models = require("../models");
var passport = require('passport');

router.get('/:id/endorsements', function(req, res) {
    models.Endorsement.findAll({
        where: { user_id: req.params.id, status: 'active' },
        order: "created_at DESC"
    }).then(function(endorsements) {
        res.send(endorsements);
    });
});

module.exports = router;
