var express = require('express');
var router = express.Router();
var models = require("../models");
var multer  = require('multer');
var upload = multer().single('file');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401).send('Unauthorized');
}

router.post('/', isAuthenticated, function(req, res) {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return
    }
    var image = models.Image.build({
      user_id: req.user.id
    });
    image.save().then(function() {
      res.send(image);
    }).catch(function(error) {
      res.sendStatus(403);
    });
  });

});

module.exports = router;
