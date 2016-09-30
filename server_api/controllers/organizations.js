var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');
var async = require('async');

var sendOrganizationOrError = function (res, organization, context, user, error, errorStatus) {
  if (error || !organization) {
    if (errorStatus == 404) {
      log.warn("Organization Not Found", { context: context, organization: toJson(organization), user: toJson(user), err: error,
        errorStatus: 404 });
    } else {
      log.error("Organization Error", { context: context, organization: toJson(organization), user: toJson(user), err: error,
        errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(organization);
  }
};


var getOrganizationAndUser = function (organizationId, userId, callback) {
  var user, organization;

  async.parallel([
    function (seriesCallback) {
      models.Organization.find({
        where: {
          id: organizationId
        }
      }).then(function (organizationIn) {
        if (organizationIn) {
          organization = organizationIn;
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
      callback(null, organization, user);
    }
  });
};

router.get('/:id', auth.can('view organization'), function(req, res) {
  models.Organization.find({
    where: { id: req.params.id },
    order: [
      [ { model: models.Group }, 'counter_users', 'desc' ],
      [ { model: models.Image, as: 'OrganizationLogoImages' } , 'created_at', 'asc' ],
      [ { model: models.Image, as: 'OrganizationHeaderImages' } , 'created_at', 'asc' ],
      [ models.Group, { model: models.Image, as: 'GroupLogoImages' }, 'created_at', 'asc' ]
    ],
    include: [
      {
        model: models.Domain,
        attributes: models.Domain.defaultAttributesPublic
      },
      {
        model: models.Image, as: 'OrganizationLogoImages',
        required: false
      },
      {
        model: models.Image, as: 'OrganizationHeaderImages',
        required: false
      }
    ]
  }).then(function(organization) {
    if (organization) {
      log.info('Organization Viewed', { organization: toJson(organization), context: 'view', user: toJson(req.user) });
      res.send(organization);
    } else {
      sendOrganizationOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendOrganizationOrError(res, null, 'view', req.user, error);
  });
});

router.post('/:domainId', auth.can('create domainOrganization'), function(req, res) {
  var hostname;
  if (req.hostname=='localhost') {
    hostname = 'localhost';
  } else {
    hostname = models.Domain.extractHost(req.headers.host);
  }
  var admin_email = req.user.email;
  var admin_name = "Administrator";
  var organization = models.Organization.build({
    name: req.body.name,
    description: req.body.description,
    access: models.Organization.convertAccessFromRadioButtons(req.body),
    domain_id: req.params.domainId,
    user_id: req.user.id,
    website: req.body.website,
    user_agent: req.useragent.source,
    ip_address: req.clientIp
  });
  organization.save().then(function() {
    log.info('Organization Created', { organization: toJson(organization), context: 'create', user: toJson(req.user) });
    organization.updateAllExternalCounters(req, 'up', 'counter_organizations', function () {
      organization.setupImages(req.body, function(error) {
        organization.addOrganizationAdmins(req.user).then(function (results) {
          sendOrganizationOrError(res, organization, 'setupImages', req.user, error);
        });
      });
    });
  }).catch(function(error) {
    sendOrganizationOrError(res, null, 'create', req.user, error);
  });
});

router.put('/:id', auth.can('edit organization'), function(req, res) {
  models.Organization.find({
    where: { id: req.params.id }
  }).then(function(organization) {
    if (organization) {
      organization.name = req.body.name;
      organization.description = req.body.description;
      organization.website = req.body.website;
      organization.access = models.Organization.convertAccessFromRadioButtons(req.body);
      organization.save().then(function () {
        log.info('Organization Updated', { organization: toJson(organization), context: 'update', user: toJson(req.user) });
        organization.setupImages(req.body, function(error) {
          sendOrganizationOrError(res, organization, 'setupImages', req.user, error);
        });
      });
    } else {
      sendOrganizationOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendOrganizationOrError(res, null, 'update', req.user, error);
  });
});

router.delete('/:id', auth.can('edit organization'), function(req, res) {
  models.Organization.find({
    where: {id: req.params.id, user_id: req.user.id }
  }).then(function (organization) {
    if (organization) {
      organization.deleted = true;
      organization.save().then(function () {
        log.info('Organization Deleted', { organization: toJson(organization), user: toJson(req.user) });
        organization.updateAllExternalCounters(req, 'down', 'counter_organizations', function () {
          res.sendStatus(200);
        });
      });
    } else {
      sendOrganizationOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendOrganizationOrError(res, null, 'delete', req.user, error);
  });
});

router.delete('/:organizationId/:userId/remove_user', auth.can('edit organization'), function(req, res) {
  getOrganizationAndUser(req.params.organizationId, req.params.userId, function (error, organization, user) {
    if (error) {
      log.error('Could not remove user', { err: error, organizationId: req.params.organizationId, userRemovedId: req.params.userId, context: 'remove_user', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else if (user && organization) {
      organization.removeOrganizationUsers(user).then(function (results) {
        log.info('User removed', {context: 'remove_user', organizationId: req.params.organizationId, userRemovedId: req.params.userId, user: toJson(req.user.simple()) });
        res.send({email: user.email});
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/:organizationId/:userId/add_user', auth.can('edit organization'), function(req, res) {
  getOrganizationAndUser(req.params.organizationId, req.params.userId, function (error, organization, user) {
    if (error) {
      log.error('Could not add user', { err: error, organizationId: req.params.organizationId, userAddEmail: req.params.email, context: 'remove_user', user: toJson(req.user.simple()) });
      res.sendStatus(500);
    } else if (user && organization) {
      organization.addOrganizationUsers(user).then(function (results) {
        log.info('User Added', {context: 'add_user', organizationId: req.params.organizationId, userAddEmail: req.params.email, user: toJson(req.user.simple()) });
        res.send({email: user.email});
      });
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
