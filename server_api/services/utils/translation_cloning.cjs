const models = require('../../models/index.cjs');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const farmhash = require('farmhash');
const fixTargetLocale = require('./translation_helpers.cjs').fixTargetLocale;

// For post get translations in all locales (that exists)
// select * from translation_cache where index_key LIKE 'communityContent-728-%-3536451109';
// Clone them with the new post id
// Same
// Domains
// Communities
// Groups
// Points

const getTranslationsForSearch = (textType, id, content, callback) => {
  const indexSearch = `${textType}-${id}-%-${farmhash.hash32(content).toString()}`;
  models.AcTranslationCache.findAll({
    where: {
      index_key: {
        $like: indexSearch
      }
    }
  }).then( translations => {
    callback(null, translations);
  }).catch( error=> {
    callback(error);
  })
}

const getTranslationsConfigSearch = (textType, id, callback) => {
  const indexSearch = `${textType}-${id}-%-%`;
  models.AcTranslationCache.findAll({
    where: {
      index_key: {
        $like: indexSearch
      }
    }
  }).then( translations => {
    callback(null, translations);
  }).catch( error=> {
    callback(error);
  })
}

const updateIndexKey = (current_index_key, objectId) => {
  const splitIndex = current_index_key.split("-");
  splitIndex[1] = objectId;
  const newIndexKey = splitIndex.join("-");
  return newIndexKey;
}

const cloneTranslations = (translations, objectId, callback) => {
  async.forEach(translations, (translation, forEachCallback) => {
    const newTranslationJson = JSON.parse(JSON.stringify(translation.toJSON()));
    delete newTranslationJson['id'];
    newTranslationJson['index_key'] = updateIndexKey(translation.index_key, objectId);
    models.AcTranslationCache.findOne({
      where: {
        index_key: newTranslationJson.index_key
      }
    }).then( translation=> {
      if (translation) {
        translation.content = newTranslationJson.content;
        translation.save().then( () => {
          forEachCallback();
        }).catch( error => {
          forEachCallback(error);
        })
      } else {
        const newTranslation = models.AcTranslationCache.build(newTranslationJson);
        newTranslation.save().then(()=>{
          forEachCallback();
        }).catch( error=> {
          forEachCallback(error);
        });
      }
    }).catch( error => {
      forEachCallback(error);
    })
  }, (error) => {
    callback(error);
  })
}

const cloneTranslationForItem = (textType, inObjectId, outObjectId, content, callback) => {
  getTranslationsForSearch(textType, inObjectId, content, (error, translations) => {
    if (error) {
      callback(error);
    } else {
      if (translations.length>0) {
        cloneTranslations(translations, outObjectId, callback);
      }  else {
        callback();
      }
    }
  })
}

const cloneTranslationForConfig = (textType, inObjectId, outObjectId, callback) => {
  getTranslationsConfigSearch(textType, inObjectId, (error, translations) => {
    if (error) {
      callback(error);
    } else {
      if (translations.length>0) {
        cloneTranslations(translations, outObjectId, callback);
      }  else {
        callback();
      }
    }
  })
}

const cloneTranslationForPost = (inPost, outPost, done) => {
  async.parallel([
    (parallelCallback) => {
      cloneTranslationForItem("postName", inPost.id, outPost.id, inPost.name, parallelCallback);
    },
    (parallelCallback) => {
      cloneTranslationForItem("postContent", inPost.id, outPost.id, inPost.description, parallelCallback);
    }
  ], error => {
    done(error);
  })
}

const cloneTranslationForCommunity = (inCommunity, outCommunity, done) => {
  async.parallel([
    (parallelCallback) => {
      cloneTranslationForItem("communityName", inCommunity.id, outCommunity.id, inCommunity.name, parallelCallback);
    },
    (parallelCallback) => {
      cloneTranslationForItem("communityContent", inCommunity.id, outCommunity.id, inCommunity.description, parallelCallback);
    }
  ], error => {
    done(error);
  })
}

const cloneTranslationForGroup = (inGroup, outGroup, done) => {
  async.parallel([
    (parallelCallback) => {
      cloneTranslationForItem("groupName", inGroup.id, outGroup.id, inGroup.name, parallelCallback);
    },
    (parallelCallback) => {
      cloneTranslationForItem("groupContent", inGroup.id, outGroup.id, inGroup.objectives || "", parallelCallback);
    },
    (parallelCallback) => {
      cloneTranslationForConfig("GroupQuestions", inGroup.id, outGroup.id, parallelCallback);
    },
    (parallelCallback) => {
      cloneTranslationForConfig("GroupRegQuestions", inGroup.id, outGroup.id, parallelCallback);
    }
  ], error => {
    done(error);
  })
}

const cloneTranslationForPoint = (inPoint, outPoint, done) => {
  async.parallel([
    (parallelCallback) => {
      cloneTranslationForItem("pointContent", inPoint.id, outPoint.id, inPoint.PointRevisions[inPoint.PointRevisions.length-1].content, parallelCallback);
    }
    ], error => {
    done(error);
  })
}

module.exports = {
  cloneTranslationForPoint,
  cloneTranslationForPost,
  cloneTranslationForCommunity,
  cloneTranslationForGroup,
  cloneTranslationForConfig
};
