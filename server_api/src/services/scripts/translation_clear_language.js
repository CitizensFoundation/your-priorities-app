const models = require('../../models/index.cjs');
const _ = require('lodash');

const objectType = process.argv[2];
const objectId = process.argv[3];

if (objectType==="point") {
  models.Point.findOne({
    where: {
      id: objectId
    },
    attributes: ['id','language']
  }).then((result) => {
    if (result) {
      log.info(`Clearing current point language of ${result.language}`);
      result.set('language', null);
      result.save().then(function () {
        log.info(`Cleared language for point ${result.id}`);
        process.exit();
      }).catch((error)=>{
        log.error(error);
        process.exit();
      });
    } else {
      log.warn("Not found: "+indexKey);
      process.exit();
    }
  }).catch((error)=>{
    log.error(error);
    process.exit();
  });
} else if (objectType==="group") {
  models.Group.findOne({
    where: {
      id: objectId
    },
    attributes: ['id','language']
  }).then((result) => {
    if (result) {
      log.info(`Clearing current group language of ${result.language}`);
      result.set('language', null);
      result.save().then(function () {
        log.info(`Cleared language for group ${result.id}`);
        process.exit();
      }).catch((error)=>{
        log.error(error);
        process.exit();
      });
    } else {
      log.warn("Not found: "+indexKey);
      process.exit();
    }
  }).catch((error)=>{
    log.error(error);
    process.exit();
  });
} else if (objectType==="community") {
  models.Community.findOne({
    where: {
      id: objectId
    },
    attributes: ['id','language']
  }).then((result) => {
    if (result) {
      log.info(`Clearing current community language of ${result.language}`);
      result.set('language', null);
      result.save().then(function () {
        log.info(`Cleared language for community ${result.id}`);
        process.exit();
      }).catch((error)=>{
        log.error(error);
        process.exit();
      });
    } else {
      log.warn("Not found: "+indexKey);
      process.exit();
    }
  }).catch((error)=>{
    log.error(error);
    process.exit();
  });
} else if (objectType==="domain") {
  models.Domain.findOne({
    where: {
      id: objectId
    },
    attributes: ['id','language']
  }).then((result) => {
    if (result) {
      log.info(`Clearing current domain language of ${result.language}`);
      result.set('language', null);
      result.save().then(function () {
        log.info(`Cleared language for domain ${result.id}`);
        process.exit();
      }).catch((error)=>{
        log.error(error);
        process.exit();
      });
    } else {
      log.warn("Not found: "+indexKey);
      process.exit();
    }
  }).catch((error)=>{
    log.error(error);
    process.exit();
  });
} else {
  log.info("No object type selected");
  process.exit();
}

