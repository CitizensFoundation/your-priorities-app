var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');
var async = require('async');

var sendBulkStatusUpdateOrError = function (res, bulkStatusUpdate, context, user, error, errorStatus) {
  if (error || !bulkStatusUpdate) {
    if (errorStatus == 404) {
      log.warn("BulkStatusUpdate Not Found", { context: context, bulkStatusUpdate: toJson(bulkStatusUpdate), user: toJson(user), err: error,
        errorStatus: 404 });
    } else {
      log.error("BulkStatusUpdate Error", { context: context, bulkStatusUpdate: toJson(bulkStatusUpdate), user: toJson(user), err: error,
        errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(bulkStatusUpdate);
  }
};

var getBulkStatusUpdateAndUser = function (bulkStatusUpdateId, userId, callback) {
  var user, bulkStatusUpdate;

  async.parallel([
    function (seriesCallback) {
      models.BulkStatusUpdate.find({
        where: {
          id: bulkStatusUpdateId
        }
      }).then(function (bulkStatusUpdateIn) {
        if (bulkStatusUpdateIn) {
          bulkStatusUpdate = bulkStatusUpdateIn;
        }
        seriesCallback();
      }).catch(function (error) {
        seriesCallback(error);
      });
    },
    function (seriesCallback) {
      if (userId) {
        models.User.find({
          where: {
            id: userId
          },
          attributes: ['id','email','name','created_at']
        }).then(function (userIn) {
          if (userIn) {
            user = userIn;
          }
          seriesCallback();
        }).catch(function (error) {
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    }
  ], function (error) {
    if (error) {
      callback(error)
    } else {
      callback(null, bulkStatusUpdate, user);
    }
  });
};

router.get('/:id', auth.can('view bulkStatusUpdate'), function(req, res) {
  models.BulkStatusUpdate.find({
    where: { id: req.params.id },
    order: [
      [ { model: models.Group }, 'counter_users', 'desc' ],
      [ { model: models.Image, as: 'BulkStatusUpdateLogoImages' } , 'created_at', 'asc' ],
      [ { model: models.Image, as: 'BulkStatusUpdateHeaderImages' } , 'created_at', 'asc' ],
      [ models.Group, { model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc' ]
    ],
    include: [
      {
        model: models.Domain,
        attributes: models.Domain.defaultAttributesPublic
      },
      {
        model: models.Image, as: 'BulkStatusUpdateLogoImages',
        required: false
      },
      {
        model: models.Image, as: 'BulkStatusUpdateHeaderImages',
        required: false
      }
    ]
  }).then(function(bulkStatusUpdate) {
    if (bulkStatusUpdate) {
      log.info('BulkStatusUpdate Viewed', { bulkStatusUpdate: toJson(bulkStatusUpdate), context: 'view', user: toJson(req.user) });
      res.send(bulkStatusUpdate);
    } else {
      sendBulkStatusUpdateOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendBulkStatusUpdateOrError(res, null, 'view', req.user, error);
  });
});

router.post('/:communityId', auth.can('create domainBulkStatusUpdate'), function(req, res) {
  var bulkStatusUpdate = models.BulkStatusUpdate.build({
    name: req.body.name,
    community_id: req.params.communityId,
    user_id: req.user.id
  });
  bulkStatusUpdate.save().then(function() {
    log.info('BulkStatusUpdate Created', { bulkStatusUpdate: toJson(bulkStatusUpdate), context: 'create', user: toJson(req.user) });
    bulkStatusUpdate.initializeConfig(req.body.emailHeader, req.body.emailFooter, function (error) {
      sendBulkStatusUpdateOrError(res, bulkStatusUpdate, 'setupImages', req.user, error);
    });
  }).catch(function(error) {
    sendBulkStatusUpdateOrError(res, null, 'create', req.user, error);
  });
});

router.put('/:id', auth.can('edit bulkStatusUpdate'), function(req, res) {
  models.BulkStatusUpdate.find({
    where: { id: req.params.id }
  }).then(function(bulkStatusUpdate) {
    if (bulkStatusUpdate) {
      bulkStatusUpdate.name = req.body.name;
      bulkStatusUpdate.save().then(function () {
        log.info('BulkStatusUpdate Updated', { bulkStatusUpdate: toJson(bulkStatusUpdate), context: 'update', user: toJson(req.user) });
        sendBulkStatusUpdateOrError(res, bulkStatusUpdate, 'setupImages', req.user, error);
      });
    } else {
      sendBulkStatusUpdateOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendBulkStatusUpdateOrError(res, null, 'update', req.user, error);
  });
});

router.put('/:id/sendTest', auth.can('edit bulkStatusUpdate'), function(req, res) {
  models.BulkStatusUpdate.find({
    where: { id: req.params.id }
  }).then(function(bulkStatusUpdate) {
    if (bulkStatusUpdate) {
      bulkStatusUpdate.save().then(function () {
        log.info('BulkStatusUpdate Updated', { bulkStatusUpdate: toJson(bulkStatusUpdate), context: 'update', user: toJson(req.user) });
        sendBulkStatusUpdateOrError(res, bulkStatusUpdate, 'setupImages', req.user, error);
      });
    } else {
      sendBulkStatusUpdateOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendBulkStatusUpdateOrError(res, null, 'update', req.user, error);
  });
});

router.put('/:communityId/:id/updateConfig', auth.can('edit bulkStatusUpdate'), function(req, res) {
  models.BulkStatusUpdate.find({
    where: { id: req.params.id, community_id: req.params.communityId }
  }).then(function(bulkStatusUpdate) {
    if (bulkStatusUpdate) {
      bulkStatusUpdate.set(req.body.configName, req.body.configValue);
      bulkStatusUpdate.save().then(function () {
        log.info('BulkStatusUpdate Updated Config', { bulkStatusUpdate: toJson(bulkStatusUpdate), context: 'update_config', user: toJson(req.user) });
        sendBulkStatusUpdateOrError(res, bulkStatusUpdate, 'setupImages', req.user, error);
      });
    } else {
      sendBulkStatusUpdateOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendBulkStatusUpdateOrError(res, null, 'update', req.user, error);
  });
});

router.delete('/:communityId/:id', auth.can('edit bulkStatusUpdate'), function(req, res) {
  models.BulkStatusUpdate.find({
    where: {id: req.params.id, community_id: req.params.communityId }
  }).then(function (bulkStatusUpdate) {
    if (bulkStatusUpdate) {
      bulkStatusUpdate.deleted = true;
      bulkStatusUpdate.save().then(function () {
        log.info('BulkStatusUpdate Deleted', { bulkStatusUpdate: toJson(bulkStatusUpdate), user: toJson(req.user) });
        res.sendStatus(200);
      });
    } else {
      sendBulkStatusUpdateOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendBulkStatusUpdateOrError(res, null, 'delete', req.user, error);
  });
});

module.exports = router;
