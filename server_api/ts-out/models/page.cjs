"use strict";
const async = require('async');
const _ = require('lodash');
module.exports = (sequelize, DataTypes) => {
    const Page = sequelize.define("Page", {
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
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
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
            },
            {
                name: 'pages_idx_domain_id_published_deleted',
                fields: ['domain_id', 'published', 'deleted']
            },
            {
                name: 'pages_idx_community_id_published_deleted',
                fields: ['community_id', 'published', 'deleted']
            },
            {
                name: 'pages_idx_group_id_published_deleted',
                fields: ['group_id', 'published', 'deleted']
            }
        ],
        underscored: true,
        tableName: 'pages'
    });
    Page.associate = (models) => {
        Page.belongsTo(models.Domain, { foreignKey: 'domain_id' });
        Page.belongsTo(models.Community, { foreignKey: 'community_id' });
        Page.belongsTo(models.Group, { foreignKey: 'group_id' });
        Page.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    Page.getPagesForAdmin = (req, options, callback) => {
        sequelize.models.Page.findAll({
            where: options,
            order: [["created_at", "asc"]]
        }).then((pages) => {
            callback(null, pages);
        }).catch((error) => {
            callback(error);
        });
    };
    Page.newPage = (req, options, callback) => {
        sequelize.models.Page.create(options).then((results) => {
            callback();
        }).catch((error) => {
            callback(error);
        });
    };
    Page.updatePageWeight = (req, options, callback) => {
        sequelize.models.Page.findOne({ where: options }).then((page) => {
            if (page) {
                page.weight = req.body.weight;
                page.save().then((results) => {
                    callback();
                }).catch((error) => {
                    callback(error);
                });
            }
            else {
                callback("Not found");
            }
        }).catch((error) => {
            callback(error);
        });
    };
    Page.updatePageLocale = (req, options, callback) => {
        sequelize.models.Page.findOne({ where: options }).then((page) => {
            if (page) {
                const content = {};
                if (!page.content) {
                    page.content = {};
                }
                if (!page.title) {
                    page.title = {};
                }
                page.set('content.' + req.body.locale, req.body.content);
                page.set('title.' + req.body.locale, req.body.title);
                page.save({ fields: ['title', 'content'] }).then((results) => {
                    callback();
                }).catch((error) => {
                    callback(error);
                });
            }
            else {
                callback("Not found");
            }
        }).catch((error) => {
            callback(error);
        });
    };
    Page.publishPage = (req, options, callback) => {
        sequelize.models.Page.findOne({ where: options }).then((page) => {
            if (page) {
                page.published = true;
                page.save().then((results) => {
                    callback();
                });
            }
            else {
                callback("Not found");
            }
        }).catch((error) => {
            callback(error);
        });
    };
    Page.unPublishPage = (req, options, callback) => {
        sequelize.models.Page.findOne({ where: options }).then((page) => {
            if (page) {
                page.published = false;
                page.save().then((results) => {
                    callback();
                });
            }
            else {
                callback("Not found");
            }
        }).catch((error) => {
            callback(error);
        });
    };
    Page.deletePage = (req, options, callback) => {
        sequelize.models.Page.findOne({ where: options }).then((page) => {
            if (page) {
                page.deleted = true;
                page.save().then((results) => {
                    callback();
                });
            }
            else {
                callback("Not found");
            }
        }).catch((error) => {
            callback(error);
        });
    };
    Page.getPages = (req, options, callback) => {
        let groupPages = [];
        let communityPages = [];
        let domainPages = [];
        async.parallel([
            (seriesCallback) => {
                if (options.group_id) {
                    sequelize.models.Page.findAll({
                        where: {
                            group_id: options.group_id,
                            published: true
                        },
                        order: [
                            ['weight', 'asc'],
                            ['created_at', 'asc']
                        ]
                    }).then((pages) => {
                        if (pages) {
                            groupPages = groupPages.concat(pages);
                        }
                        seriesCallback();
                    }).catch((error) => {
                        seriesCallback(error);
                    });
                }
                else {
                    seriesCallback();
                }
            },
            (seriesCallback) => {
                if (options.community_id) {
                    sequelize.models.Page.findAll({
                        where: {
                            community_id: options.community_id,
                            published: true
                        },
                        order: [
                            ['weight', 'asc'],
                            ['created_at', 'asc']
                        ]
                    }).then((pages) => {
                        if (pages) {
                            communityPages = communityPages.concat(pages);
                        }
                        seriesCallback();
                    }).catch((error) => {
                        seriesCallback(error);
                    });
                }
                else {
                    seriesCallback();
                }
            },
            (seriesCallback) => {
                if (options.domain_id) {
                    sequelize.models.Page.findAll({
                        where: {
                            domain_id: options.domain_id,
                            published: true
                        },
                        order: [
                            ['weight', 'asc'],
                            ['created_at', 'asc']
                        ]
                    }).then((pages) => {
                        if (pages) {
                            domainPages = domainPages.concat(pages);
                        }
                        seriesCallback();
                    }).catch((error) => {
                        seriesCallback(error);
                    });
                }
                else {
                    seriesCallback();
                }
            }
        ], (error) => {
            callback(error, groupPages.concat(communityPages, domainPages));
        });
    };
    return Page;
};
