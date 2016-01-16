var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');

var sendDomainOrError = function (res, domain, context, user, error, errorStatus) {
  if (error || !domain) {
    if (errorStatus == 404) {
      log.warning("Domain Not Found", { context: context, domain: domain, user: req.user, err: error,
        errorStatus: 404 });
    } else {
      log.error("Domain Error", { context: context, domain: domain, user: req.user, err: error,
        errorStatus: errorStatus ? errorStatus : 500 });
    }
    if (errorStatus) {
      res.sendStatus(errorStatus);
    } else {
      res.sendStatus(500);
    }
  } else {
    res.send(domain);
  }
};

router.get('/', function(req, res) {
  if (req.ypCommunity) {
    log.info('Domain Lookup Found Community', { community: eq.ypCommunity, context: 'index', user: req.user });
    res.send({community: req.ypCommunity, domain: req.ypDomain});
  } else {
    log.info('Domain Lookup Found Domain', { domain: req.ypDomain, context: 'index', user: req.user });
    res.send({domain: req.ypDomain})
  }
});

router.get('/:id', auth.can('view domain'), function(req, res) {
  models.Domain.find({
    where: { id: req.params.id },
    order: [
      [ { model: models.Community } ,'user_id', 'asc' ],
      [ { model: models.Community } ,'created_at', 'asc' ],
      [ { model: models.Image, as: 'DomainLogoImages' } , 'created_at', 'asc' ]
    ],
    include: [
      {
        model: models.User, as: 'DomainUsers',
        attributes: ['id'],
        required: false
      },
      {
        model: models.Image, as: 'DomainLogoImages'
      },
      {
        model: models.Image, as: 'DomainHeaderImages'
      },
      { model: models.Community,
        where: {
          access: {
            $ne: models.Community.ACCESS_SECRET
          }
        },
        order: [
          [ { model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc' ],
          [ { model: models.Image, as: 'CommunityHeaderImages' }, 'created_at', 'asc' ]
        ],
        include: [
          {
            model: models.Image, as: 'CommunityLogoImages',
            order: [
              [ { model: models.Image, as: 'CommunityLogoImages' }, 'created_at', 'asc' ],
              [ { model: models.Image, as: 'CommunityHeaderImages' }, 'created_at', 'asc' ]
            ]
          },
          {
            model: models.Image, as: 'CommunityHeaderImages', order: 'created_at asc'
          },
          {
            model: models.User, as: 'CommunityUsers',
            attributes: ['id'],
            required: false
          }
        ],
        required: false
      }
    ]
  }).then(function(domain) {
    if (domain) {
      log.info('Domain Viewed', { domain: domain, context: 'view', user: req.user });
      res.send(domain);
    } else {
      sendDomainOrError(res, req.params.id, 'view', req.user, 'Not found', 404);
    }
    res.send(domain);
  }).catch(function(error) {
    sendDomainOrError(res, null, 'view', req.user, error);
  });
});

router.put('/:id', auth.can('edit domain'), function(req, res) {
  models.Domain.find({
    where: { id: req.params.id }
  }).then(function(domain) {
    if (domain) {
      domain.name = req.body.name;
      domain.description = req.body.description;
      domain.save().then(function () {
        log.info('Domain Updated', { domain: domain, user: req.user });
        domain.setupImages(req.body, function(err) {
          if (err) {
            res.sendStatus(500);
            log.error('Domain Error Setup images', { domain: domain, user: req.user, err: err });
          } else {
            res.send(domain);
          }
        });
      });
    } else {
      sendDomainOrError(res, req.params.id, 'update', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendDomainOrError(res, null, 'update', req.user, error);
  });
});

router.delete('/:id', auth.can('edit domain'), function(req, res) {
  models.Domain.find({
    where: {id: req.params.id}
  }).then(function (domain) {
    if (domain) {
      domain.deleted = true;
      domain.save().then(function () {
        log.info('Domain Deleted', { group: group, context: 'delete', user: req.user });
        res.sendStatus(200);
      });
    } else {
      sendDomainOrError(res, req.params.id, 'delete', req.user, 'Not found', 404);
    }
  }).catch(function(error) {
    sendDomainOrError(res, null, 'delete', req.user, error);
  });
});

module.exports = router;
