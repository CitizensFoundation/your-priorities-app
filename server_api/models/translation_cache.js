var async = require("async");
const Translate = require('@google-cloud/translate');
const farmhash = require('farmhash');

"use strict";

module.exports = function(sequelize, DataTypes) {
  let TranslationCache = sequelize.define("TranslationCache", {
    index_key: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    hash_value: { type: DataTypes.STRING, allowNull: false }
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
        switch(req.params.textType) {
          case 'postTitle':
          case 'domainTitle':
          case 'communityTitle':
          case 'groupTitle':
            return modelInstance.title;
          case 'postContent':
          case 'domainContent':
          case 'communityContent':
            return modelInstance.description;
          case 'pointContent':
          case 'statusChangeContent':
            return modelInstance.content;
          case 'groupContent':
            return modelInstance.objectives;
          case 'categoryName':
            return modelInstance.name;
          default:
            console.error("No valid textType for translation");
            return null;
        }
      },

      getTranslationFromGoogle: function (indexKey, contentToTranslate, targetLanguage, modelInstance, callback) {
        const translateAPI = new Translate({
          credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
        });

        translateAPI.translate(contentToTranslate, targetLanguage)
          .then( function (results) {
            if (results[0]) {
              TranslateCache.create({
                index_key: indexKey,
                content: results[0].translatedText
              }).then(function () {
                modelInstance.update({
                  language: results[0].detectedSourceLanguage
                }).then(function () {
                  callback(null, { content: results[0].translatedText });
                });
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

      getTranslationForContent: function (req, modelInstance, callback) {
        const contentToTranslate = TranslationCache.getContentToTranslate(req, modelInstance);
        const contentHash = farmhash.hash32(contentToTranslate).toString();
        let indexKey = `${req.params.textType}-${modelInstance.id}-${req.params.targetLanguage}-${contentHash}`;

        TranslationCache.findOne({
          where: {
            index_key: indexKey
          }
        }).then(function (translationModel) {
          if (translationModel) {
            callback(null, { content: translationModel.content });
          } else {
            TranslationCache.getTranslationFromGoogle(indexKey, contentToTranslate, req.params.targetLanguage, modelInstance, callback);
          }
        }).catch(function (error) {
          callback(error);
        });
      }
    }
  });

  return TranslationCache;
};
