var async = require('async');
var _ = require('lodash');

"use strict";

module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define("Page", {
    title: { type: DataTypes.JSONB, allowNull: false },
    content: { type: DataTypes.JSONB, allowNull: false },
    weight: { type: DataTypes.INTEGER, defaultValue: 0 },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    legacy_page_id: DataTypes.INTEGER,
    legacy_new_domain_id: DataTypes.INTEGER
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    indexes: [
      {
        fields: ['community_id'],
        where: {
          deleted: false,
          published: true
        }
      },
      {
        fields: ['group_id'],
        where: {
          deleted: false,
          published: true
        }
      },
      {
        fields: ['domain_id'],
        where: {
          deleted: false,
          published: true
        }
      },
      {
        name: "community_id_only_deleted",
        fields: ['community_id'],
        where: {
          deleted: false
        }
      },
      {
        name: "group_id_only_deleted",
        fields: ['group_id'],
        where: {
          deleted: false
        }
      },
      {
        name: "domain_id_only_deleted",
        fields: ['domain_id'],
        where: {
          deleted: false
        }
      }
    ],

    underscored: true,

    tableName: 'pages',

    classMethods: {

      getPagesForAdmin: function (req, options, callback)  {
        sequelize.models.Page.findAll( {
          where: options,
          order: "created_at ASC"
        }).then( function (pages) {
          callback(null, pages);
        }).catch( function (error) {
          callback(error);
        });
      },

      newPage: function (req, options, callback)  {
        sequelize.models.Page.create(options).then(function (results) {
          callback();
        }).catch(function (error) {
          callback(error);
        });
      },

      updatePageLocale: function (req, options, callback)  {
        sequelize.models.Page.find({ where: options }).then(function (page) {
          if (page) {
            var content = {};
            if (!page.content) {
              page.content = {};
            }
            if (!page.title) {
              page.title = {};
            }
            page.set('content.'+req.body.locale, req.body.content);
            page.set('title.'+req.body.locale, req.body.title);
            page.save({fields: ['title','content']}).then(function (results) {
              callback();
            }).catch(function (error) {
              callback(error);
            });
          } else {
            callback("Not found");
          }
        }).catch(function (error) {
          callback(error);
        });
      },

      publishPage: function (req, options, callback)  {
        sequelize.models.Page.find({ where: options }).then(function (page) {
          if (page) {
            page.published = true;
            page.save().then(function (results) {
              callback();
            });
          } else {
            callback("Not found");
          }
        }).catch(function (error) {
          callback(error);
        });
      },

      unPublishPage: function (req, options, callback)  {
        sequelize.models.Page.find({ where: options }).then(function (page) {
          if (page) {
            page.published = false;
            page.save().then(function (results) {
              callback();
            });
          } else {
            callback("Not found");
          }
        }).catch(function (error) {
          callback(error);
        });
      },

      deletePage: function (req, options, callback)  {
        sequelize.models.Page.find({ where: options }).then(function (page) {
          if (page) {
            page.deleted = true;
            page.save().then(function (results) {
              callback();
            });
          } else {
            callback("Not found");
          }
        }).catch(function (error) {
          callback(error);
        });
      },

      getPages: function (req, options, callback)  {
        var groupPages = [];
        var communityPages = [];
        var domainPages = [];

        async.parallel([
          function (seriesCallback) {
            if (options.group_id) {
              sequelize.models.Page.findAll( {
                where: {
                  group_id: options.group_id,
                  published: true
                }
              }).then( function (pages) {
                if (pages) {
                  groupPages = groupPages.concat(pages);
                }
                seriesCallback();
              }).catch( function (error) {
                seriesCallback(error);
              });

            } else {
              seriesCallback();
            }
          },
          function (seriesCallback) {
            if (options.community_id) {
              sequelize.models.Page.findAll( {
                where: {
                  community_id: options.community_id,
                  published: true
                }
              }).then( function (pages) {
                if (pages) {
                  communityPages = communityPages.concat(pages);
                }
                seriesCallback();
              }).catch( function (error) {
                seriesCallback(error);
              });

            } else {
              seriesCallback();
            }
          },
          function (seriesCallback) {
            if (options.domain_id) {
              sequelize.models.Page.findAll( {
                where: {
                  domain_id: options.domain_id,
                  published: true
                }
              }).then( function (pages) {
                if (pages) {
                  domainPages = domainPages.concat(pages);
                }
                seriesCallback();
              }).catch( function (error) {
                seriesCallback(error);
              });

            } else {
              seriesCallback();
            }
          }
        ], function (error) {
          callback(error, groupPages.concat(communityPages,domainPages));
        })
      },

      associate: function(models) {
        Page.belongsTo(models.Domain);
        Page.belongsTo(models.Community);
        Page.belongsTo(models.Group);
        Page.belongsTo(models.User);
      }
    }
  });
  return Page;
};
