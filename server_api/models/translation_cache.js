var async = require("async");

"use strict";

// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  let TranslationCache = sequelize.define("TranslationCache", {
    index: { type: DataTypes.STRING, allowNull: false },
    translation: { type: DataTypes.TEXT, allowNull: false }
  }, {

    indexes: [
      {
        name: 'index_group_id',
        fields: ['index', 'group_id']
      },
      {
        name: 'index_community_id',
        fields: ['index', 'community_id']
      },
      {
        name: 'index_domain_id',
        fields: ['index', 'domain_id']
      },
    ],

    underscored: true,

    timestamps: true,

    tableName: 'translation_cache',

    classMethods: {

      associate: function(models) {
        TranslationCache.belongsTo(models.Group, {foreignKey: "group_id"});
        TranslationCache.belongsTo(models.Community, {foreignKey: "community_id"});
        TranslationCache.belongsTo(models.Domain, {foreignKey: "domain_id"});
      },

      getTranslationFromGoogle: function (index, language, content, callback) {

      },


      getTranslationForContent: function (index, modelType, modelId, language, content, callback) {
        let where = {};
        where["index"] = index;
        where[modelType] = modelId;

        TranslationCache.findOne({
          where: where
        }).then(function (translationModel) {
          if (translationModel) {
            callback(null, translationModel.translation);
          } else {
            TranslationCache.getTranslationFromGoogle(index, language, content, callback)
          }
        }).catch(function (error) {
          callback(error);
        });
      }
    },

    instanceMethods: {
      simple: function() {
        return { id: this.id, name: this.name };
      }
    }
  });

  return TranslationCache;
};
