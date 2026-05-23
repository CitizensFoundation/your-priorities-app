"use strict";
const async = require('async');
module.exports = (sequelize, DataTypes) => {
    const BulkStatusUpdate = sequelize.define("BulkStatusUpdate", {
        config: { type: DataTypes.JSONB, allowNull: true },
        templates: { type: DataTypes.JSONB, allowNull: true },
        name: { type: DataTypes.STRING, allowNull: false },
        sent_at: { type: DataTypes.DATE },
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        defaultScope: {
            where: {
                deleted: false
            }
        },
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
        tableName: 'bulk_status_updates'
    });
    BulkStatusUpdate.associate = (models) => {
        BulkStatusUpdate.belongsTo(models.Group, { foreignKey: 'group_id' });
        BulkStatusUpdate.belongsTo(models.Community, { foreignKey: 'community_id' });
        BulkStatusUpdate.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    BulkStatusUpdate.prototype.initializeConfig = function (emailHeader, emailFooter, done) {
        const config = { groups: [], emailHeader: emailHeader, emailFooter: emailFooter };
        const self = this;
        sequelize.models.Group.findAll({
            where: {
                community_id: this.community_id
            }
        }).then((groups) => {
            async.eachSeries(groups, (group, seriesCallback) => {
                const configPosts = [];
                sequelize.models.Post.findAll({
                    where: {
                        group_id: group.id
                    }
                }).then((posts) => {
                    async.eachSeries(posts, (post, innerSeriesCallback) => {
                        configPosts.push({ id: post.id, name: post.name, location: post.location,
                            currentOfficialStatus: post.official_status, newOfficialStatus: null,
                            selectedTemplateTitle: null, uniqueStatusMessage: null, moveToGroupId: null });
                        innerSeriesCallback();
                    }, (error) => {
                        config.groups.push({ id: group.id, name: group.name, posts: configPosts });
                        seriesCallback();
                    });
                });
            }, (error) => {
                done(error, config);
            });
        });
    };
    return BulkStatusUpdate;
};
