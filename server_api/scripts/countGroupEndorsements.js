var models = require('../models');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');

var communityId = process.argv[2];
var totalEndorsements;
var endorsementsCount;
var oppositionCount;
var totalPointQualities;
var pointsHelpful;
var pointsUnhelpful;

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
    console.error(error);
  } else {
    console.log("Community id: "+communityId);
    console.log("Total endorsements: "+totalEndorsements);
    console.log("Endorsements: "+endorsementsCount);
    console.log("Oppositions: "+oppositionCount);
    console.log("Total point qualities: "+totalPointQualities);
    console.log("Points helpful: "+pointsHelpful);
    console.log("Points not helpful: "+pointsUnhelpful);
  }
  process.exit();
});

