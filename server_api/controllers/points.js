var express = require('express');
var router = express.Router();
var models = require("../models");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401).send('Unauthorized');
}

router.post('/', isAuthenticated, function(req, res) {
  var point = models.Point.build({
    group_id: req.body.groupId,
    idea_id: req.body.ideaId,
    content: req.body.content,
    value: req.body.value,
    user_id: req.user.id
  });
  point.save().then(function() {
    var pointRevision = models.PointRevision.build({
      group_id: point.group_id,
      idea_id: point.idea_id,
      content: point.content,
      user_id: req.user.id,
      point_id: point.id
    });
    pointRevision.save().then(function() {
      models.Point.find({
        where: { id: point.id },
        include: [
          { model: models.PointRevision ,
            include: [
              { model: models.User, attributes: ["id", "login", "facebook_uid", "buddy_icon_file_name"] }
            ]
          }
        ]
      }).then(function(point) {
        res.send(point);
      });
    });
  }).catch(function(error) {
    res.sendStatus(403);
  });
});

module.exports = router;
