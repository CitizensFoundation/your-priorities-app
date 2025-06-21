const models = require('../../../models/index.cjs');
const _ = require('lodash');
const async = require('async');
const log = require('../../../utils/logger.cjs');

const createAction = require('./events_manager.cjs').createAction;

const createManyActions = require('./events_manager.cjs').createManyActions;

let postUpdateAsyncLimit = 42;

var lineCrCounter = 0;

var processDots = function() {
  if (lineCrCounter>250) {
    process.stdout.write("\n");
    lineCrCounter = 1;
  } else {
    process.stdout.write(".");
    lineCrCounter += 1;
  }
};

const chunkArray = (myArray, chunk_size) => {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = myArray.slice(index, index+chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
}

const importAllActionsFor = function (model, where, include, action, done, attributes) {
  log.info('AcImportAllActionsFor', {action:action, model: model, where: where, include: include});

  model.findAll(
    {
      where: where,
      include: include,
      attributes: attributes
    }
  ).then(function (objects) {
    lineCrCounter = 0;
    const chunks = chunkArray(objects, 1000);

    async.eachOfLimit(chunks, 1, (objects, index, callback) => {
      const actionsToSend = [];
      async.eachOfSeries(objects, (object, index, seriesCallback) => {
        let postId;
        if (action.indexOf('help') > -1) {
          postId = object.Point.Post.id;
        } else if (action.indexOf('post') > -1) {
          postId = object.id;
        } else {
          postId = object.Post.id;
        }

        if (postId) {
          const esId = `${postId}-${object.user_id}-${action}`;
          actionsToSend.push({
            postId,
            userId: object.user_id,
            date: object.created_at.toISOString(),
            user_agent: object.user_agent,
            ip_address: object.ip_address,
            action,
            esId
          });
          processDots();
          seriesCallback();
        } else {
          log.error("Can't find id for object: " + object);
          seriesCallback();
        }
    }, error => {
        if (!error) {
          createManyActions(JSON.parse(JSON.stringify(actionsToSend)), callback);
        } else {
          callback(error);}
      });
    }, function (error) {
      log.info(error);
      log.info("\n FIN");
      done();
    });
  });
};

var importAll = function(done) {
  async.series([
    function(callback){
      importAllActionsFor(models.Post, {}, [], 'new-post', function () {
        callback();
      }, ['id','user_id','created_at','ip_address','user_agent']);
    },
    function(callback){
      importAllActionsFor(models.Endorsement, { value: { $gt: 0 } }, [ { model: models.Post, attributes: ['id'] }  ], 'endorse', function () {
        callback();
      }, ['id','user_id','created_at','value','ip_address','user_agent']);
    },
    function(callback){
      importAllActionsFor(models.Endorsement, { value: { $lt: 0 } }, [  { model: models.Post, attributes: ['id'] } ], 'oppose', function () {
        callback();
      }, ['id','user_id','created_at','value','ip_address','user_agent']);
    },
    function(callback){
      importAllActionsFor(models.Point, { value: { $ne: 0 }}, [ { model: models.Post, attributes: ['id'] } ], 'new-point', function () {
        callback();
      }, ['id','user_id','created_at','value','ip_address','user_agent']);
    },
    function(callback){
      importAllActionsFor(models.Point, { value: 0 },  [{ model: models.Post, attributes: ['id'] } ], 'new-point-comment', function () {
        callback();
      }, ['id','user_id','created_at','value','ip_address','user_agent']);
    },
    function(callback){
      importAllActionsFor(models.PointQuality, { value: { $gt: 0 } }, [{
          model: models.Point,
          attributes: ['id','value'],
          include: [{ model: models.Post, attributes: ['id'] } ]
        }], 'point-helpful', function () {
        callback();
      }, ['id','user_id','created_at','value','ip_address','user_agent']);
    },
    function(callback){
      importAllActionsFor(models.PointQuality, { value: { $lt: 0 } }, [{
        model: models.Point,
        attributes: ['id','value'],
        include: [ models.Post ]
      }], 'point-unhelpful', function () {
        callback();
      }, ['id','user_id','created_at','value','ip_address','user_agent']);
    }
  ], function () {
    log.info("FIN");
    done();
  });
};

importAll(function () {
  log.info("Done importing all");
  process.exit();
});
