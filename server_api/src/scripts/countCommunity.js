var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');

var communityId = process.argv[2];
var totalEndorsements;
var endorsementsCount;
var oppositionCount;
var totalPointQualities;
var pointsHelpful;
var pointsUnhelpful;
var totalPoints;
var pointsAgainst;
var pointsFor;

async.parallel([
  function (parallelCallback) {
    models.Endorsement.count({
      include: [
        {
          model: models.Post,
          include: [
            {
              model: models.Group,
              include: [
                {
                  model: models.Community,
                  where: {
                    id: communityId
                  }
                }
              ]
            }
          ]
        }
      ]
    }).then(function (count) {
      totalEndorsements = count;
      parallelCallback();
    })
  },
  function (parallelCallback) {
    models.Point.count({
      include: [
        {
          model: models.Post,
          include: [
            {
              model: models.Group,
              include: [
                {
                  model: models.Community,
                  where: {
                    id: communityId
                  }
                }
              ]
            }
          ]
        }
      ]
    }).then(function (count) {
      totalPoints = count;
      parallelCallback();
    })
  },
  function (parallelCallback) {
    models.Point.count({
      where: {
        value: -1
      },
      include: [
        {
          model: models.Post,
          include: [
            {
              model: models.Group,
              include: [
                {
                  model: models.Community,
                  where: {
                    id: communityId
                  }
                }
              ]
            }
          ]
        }
      ]
    }).then(function (count) {
      pointsAgainst = count;
      parallelCallback();
    })
  },
  function (parallelCallback) {
    models.Point.count({
      where: {
        value: 1
      },
      include: [
        {
          model: models.Post,
          include: [
            {
              model: models.Group,
              include: [
                {
                  model: models.Community,
                  where: {
                    id: communityId
                  }
                }
              ]
            }
          ]
        }
      ]
    }).then(function (count) {
      pointsFor = count;
      parallelCallback();
    })
  },
  function (parallelCallback) {
    models.Endorsement.count({
      where: {
        value: 1
      },
      include: [
        {
          model: models.Post,
          include: [
            {
              model: models.Group,
              include: [
                {
                  model: models.Community,
                  where: {
                    id: communityId
                  }
                }
              ]
            }
          ]
        }
      ]
    }).then(function (count) {
      endorsementsCount = count;
      parallelCallback();
    })
  },
  function (parallelCallback) {
    models.Endorsement.count({
      where: {
        value: -1
      },
      include: [
        {
          model: models.Post,
          include: [
            {
              model: models.Group,
              include: [
                {
                  model: models.Community,
                  where: {
                    id: communityId
                  }
                }
              ]
            }
          ]
        }
      ]
    }).then(function (count) {
      oppositionCount = count;
      parallelCallback();
    })
  },
  function (parallelCallback) {
    models.PointQuality.count({
      include: [
        {
          model: models.Point,
          include: [
            {
              model: models.Post,
              include: [
                {
                  model: models.Group,
                  include: [
                    {
                      model: models.Community,
                      where: {
                        id: communityId
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }).then(function (count) {
      totalPointQualities = count;
      parallelCallback();
    })
  },
  function (parallelCallback) {
    models.PointQuality.count({
      where: {
        value: 1
      },
      include: [
        {
          model: models.Point,
          include: [
            {
              model: models.Post,
              include: [
                {
                  model: models.Group,
                  include: [
                    {
                      model: models.Community,
                      where: {
                        id: communityId
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }).then(function (count) {
      pointsHelpful = count;
      parallelCallback();
    })
  },
  function (parallelCallback) {
    models.PointQuality.count({
      where: {
        value: -1
      },
      include: [
        {
          model: models.Point,
          include: [
            {
              model: models.Post,
              include: [
                {
                  model: models.Group,
                  include: [
                    {
                      model: models.Community,
                      where: {
                        id: communityId
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }).then(function (count) {
      pointsUnhelpful = count;
      parallelCallback();
    })
  }
], function (error) {
  if (error) {
    log.error(error);
  } else {
    log.info("Community id: "+communityId);
    log.info("Total endorsements: "+totalEndorsements);
    log.info("Endorsements: "+endorsementsCount);
    log.info("Oppositions: "+oppositionCount);
    log.info("Total point qualities: "+totalPointQualities);
    log.info("Points helpful: "+pointsHelpful);
    log.info("Points not helpful: "+pointsUnhelpful);
    log.info("Points count: "+totalPoints);
    log.info("Points for: "+pointsFor);
    log.info("Points against: "+pointsAgainst);
  }
  process.exit();
});

