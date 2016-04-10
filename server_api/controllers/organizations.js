var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var _ = require('lodash');

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
        model: models.Domain
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

router.post('/:domainId', auth.can('create organization'), function(req, res) {
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
    organization.updateAllExternalCounters(req, 'up', 'counter_communities', function () {
      organization.setupImages(req.body, function(error) {
        sendOrganizationOrError(res, organization, 'setupImages', req.user, error);
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
        organization.updateAllExternalCounters(req, 'down', 'counter_communities', function () {
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

module.exports = router;
