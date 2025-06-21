const models = require('../../models/index.cjs');
const _ = require('lodash');

const indexKey = process.argv[2];
const textToReplace = process.argv[3];

models.AcTranslationCache.findOne({
  where: {
    index_key: indexKey
  }
}).then((result) => {
  if (result) {
    result.set('content', textToReplace);
    result.save().then(function () {
      log.info(`Updated ${result.index_key} to ${result.content}`);
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
