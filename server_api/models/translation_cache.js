var async = require("async");
const Translate = require('@google-cloud/translate');
const farmhash = require('farmhash');

"use strict";

module.exports = function(sequelize, DataTypes) {
  let TranslationCache = sequelize.define("TranslationCache", {
    index_key: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
  }, {

    indexes: [
      {
        name: 'main_index',
        fields: ['index_key']
      }
    ],

    underscored: true,

    timestamps: true,

    tableName: 'translation_cache',

    classMethods: {

      getContentToTranslate: function (req, modelInstance) {
        switch(req.query.textType) {
          case 'postName':
          case 'domainName':
          case 'communityName':
          case 'groupName':
            return modelInstance.name;
          case 'postContent':
          case 'domainContent':
          case 'communityContent':
            return modelInstance.description;
          case 'pointContent':
            return modelInstance.PointRevisions[modelInstance.PointRevisions.length-1].content;
          case 'statusChangeContent':
            return modelInstance.content;
          case 'groupContent':
            return modelInstance.objectives;
          case 'categoryName':
            return modelInstance.name;
          case 'postTranscriptContent':
            return modelInstance.public_data.transcript.text;
          default:
            console.error("No valid textType for translation");
            return null;
        }
      },

      getTranslationFromGoogle: function (textType, indexKey, contentToTranslate, targetLanguage, modelInstance, callback) {
        const translateAPI = new Translate({
          credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
        });

        translateAPI.translate(contentToTranslate, targetLanguage)
          .then( function (results) {
            const translationResults = results[1];
            if (translationResults && translationResults.data
                && translationResults.data.translations &&
                translationResults.data.translations.length>0) {
              const translation = translationResults.data.translations[0];
              TranslationCache.create({
                index_key: indexKey,
                content: translation.translatedText
              }).then(function () {
                if (textType==='postTranscriptContent') {
                  modelInstance.set('public_data.transcript.language', translation.detectedSourceLanguage);
                  modelInstance.save().then( () => {
                    callback(null, { content: translation.translatedText });
                  }).catch( error => {
                    callback(error);
                  });
                } else {
                  modelInstance.update({
                    language: translation.detectedSourceLanguage
                  }).then(function () {
                    callback(null, { content: translation.translatedText });
                  });
                }
              }).catch(function (error) {
                callback(error);
              });
            } else {
              callback("No translations");
            }
          }).catch(function (error) {
          callback(error);
        });
      },

      getTranslation: function (req, modelInstance, callback) {
        const contentToTranslate = TranslationCache.getContentToTranslate(req, modelInstance);
        const contentHash = farmhash.hash32(contentToTranslate).toString();
        const textType = req.query.textType;
        let indexKey = `${textType}-${modelInstance.id}-${req.query.targetLanguage}-${contentHash}`;

        TranslationCache.findOne({
          where: {
            index_key: indexKey
          }
        }).then(function (translationModel) {
          if (translationModel) {
            callback(null, { content: translationModel.content });
          } else {
            TranslationCache.getTranslationFromGoogle(textType, indexKey, contentToTranslate, req.query.targetLanguage, modelInstance, callback);
          }
        }).catch(function (error) {
          callback(error);
        });
      }
    }
  });

  return TranslationCache;
};
