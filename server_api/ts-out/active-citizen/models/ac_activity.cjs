"use strict";
const log = require('../utils/logger.cjs');
const queue = require('../workers/queue.cjs');
const toJson = require('../utils/to_json.cjs');
const commonIndexForActivitiesAndNewsFeeds = require('../engine/news_feeds/activity_and_item_index_definitions.cjs').commonIndexForActivitiesAndNewsFeeds;
const _ = require('lodash');
module.exports = (sequelize, DataTypes) => {
    const AcActivity = sequelize.define("AcActivity", {
        access: { type: DataTypes.INTEGER, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
        sub_type: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.STRING, allowNull: false },
        object: DataTypes.JSONB,
        actor: DataTypes.JSONB,
        target: DataTypes.JSONB,
        context: DataTypes.JSONB,
        user_interaction_profile: DataTypes.JSONB,
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        defaultScope: {
            where: {
                deleted: false,
                status: 'active'
            }
        },
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: _.concat(commonIndexForActivitiesAndNewsFeeds('created_at'), [
            {
                name: 'activity_active_by_type',
                fields: ['type'],
                where: {
                    status: 'active',
                    deleted: false
                }
            },
            {
                name: 'activity_active_by_community_id',
                fields: ['community_id'],
                where: {
                    status: 'active',
                    deleted: false
                }
            },
            {
                name: 'ac_activities_idx_post_id_user_id_type_delete_status',
                fields: ['post_id', 'user_id', 'type', 'deleted']
            },
            {
                name: 'activity_active_by_group_id',
                fields: ['group_id'],
                where: {
                    status: 'active',
                    deleted: false
                }
            },
            {
                name: 'userid_groupid_deleted',
                fields: ['user_id', 'group_id', 'deleted']
            },
            {
                name: 'activity_active_by_post_id',
                fields: ['post_id'],
                where: {
                    status: 'active',
                    deleted: false
                }
            },
            {
                name: 'activity_all_by_type',
                fields: ['type']
            }
        ]),
        underscored: true,
        tableName: 'ac_activities'
    });
    AcActivity.associate = (models) => {
        AcActivity.belongsTo(models.Domain, { foreignKey: 'domain_id' });
        AcActivity.belongsTo(models.Community, { foreignKey: 'community_id' });
        AcActivity.belongsTo(models.Group, { foreignKey: 'group_id' });
        AcActivity.belongsTo(models.Post, { foreignKey: 'post_id' });
        AcActivity.belongsTo(models.Point, { foreignKey: 'point_id' });
        AcActivity.belongsTo(models.Invite, { foreignKey: 'invite_id' });
        AcActivity.belongsTo(models.User, { foreignKey: 'user_id' });
        AcActivity.belongsTo(models.Image, { foreignKey: 'image_id' });
        AcActivity.belongsTo(models.PostStatusChange, { foreignKey: 'post_status_change_id' });
        AcActivity.belongsToMany(models.User, { through: 'other_users' });
        AcActivity.belongsToMany(models.AcNotification, { as: 'AcActivities', through: 'notification_activities' });
    };
    AcActivity.ACCESS_PUBLIC = 0;
    AcActivity.ACCESS_COMMUNITY = 1;
    AcActivity.ACCESS_GROUP = 2;
    AcActivity.ACCESS_PRIVATE = 3;
    //TODO Refactor duplicate code with Post and point
    AcActivity.setOrganizationUsersForActivities = (activities, done) => {
        const filteredActivities = activities.filter(p => p.User);
        if (filteredActivities && filteredActivities.length > 0) {
            const userIds = filteredActivities.map(p => {
                return p.User.id;
            });
            sequelize.models.User.findAll({
                attributes: ['id', 'created_at'],
                where: {
                    id: {
                        $in: userIds
                    }
                },
                include: [
                    {
                        model: sequelize.models.Organization,
                        as: 'OrganizationUsers',
                        required: true,
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: sequelize.models.Image,
                                as: 'OrgLogoImgs',
                                attributes: ['id', 'formats'],
                                required: false
                            }
                        ]
                    }
                ],
                order: [
                    [{ model: sequelize.models.Organization, as: 'OrganizationUsers' }, { model: sequelize.models.Image, as: 'OrgLogoImgs' }, 'created_at', 'asc']
                ]
            }).then(users => {
                if (users && users.length > 0) {
                    for (let u = 0; u < users.length; u++) {
                        for (let p = 0; p < filteredActivities.length; p++) {
                            if (filteredActivities[p].User.id === users[u].id) {
                                filteredActivities[p].User.OrganizationUsers = users[u].OrganizationUsers;
                                filteredActivities[p].User.setDataValue('OrganizationUsers', users[u].OrganizationUsers);
                            }
                        }
                    }
                    done();
                }
                else {
                    done();
                }
            }).catch(error => {
                done(error);
            });
        }
        else {
            done();
        }
    };
    AcActivity.createActivity = (options, callback) => {
        queue.add('delayed-job', { type: 'create-priority-activity', workData: options }, 'high');
        callback();
    };
    AcActivity.createPasswordRecovery = (user, domain, community, token, done) => {
        sequelize.models.AcActivity.build({
            type: "activity.password.recovery",
            status: 'active',
            actor: { user: user },
            object: {
                domainId: domain.id,
                communityId: community ? community.id : null,
                token: token
            },
            domain_id: domain.id,
            community_id: community ? community.id : null,
            user_id: user.id,
            access: sequelize.models.AcActivity.ACCESS_PRIVATE
        }).save().then((activity) => {
            if (activity) {
                queue.add('process-activity', activity, 'critical');
                log.info('Activity Created', { activityId: activity.id, userId: user ? user.id : -1 });
                done(null);
            }
            else {
                done('Activity Not Found');
            }
        }).catch((error) => {
            log.error('Activity Created Error', { err: error });
            done(error);
        });
    };
    AcActivity.inviteCreated = (options, done) => {
        sequelize.models.AcActivity.build({
            type: "activity.user.invite",
            status: 'active',
            actor: { user_id: options.user_id, sender_user_id: options.sender_user_id },
            object: {
                email: options.email,
                token: options.token,
                invite_id: options.invite_id,
                sender_name: options.sender_name
            },
            community_id: options.community_id,
            group_id: options.group_id,
            domain_id: options.domain_id,
            user_id: options.user_id,
            access: sequelize.models.AcActivity.ACCESS_PRIVATE
        }).save().then((activity) => {
            if (activity) {
                queue.add('process-activity', activity, 'critical');
                log.info('Activity Created', { activityId: activity.id, userId: options.user_id, email: options.email });
                done(null);
            }
            else {
                done('Activity Not Found');
            }
        }).catch((error) => {
            log.error('Activity Created Error', { err: error });
            done(error);
        });
    };
    return AcActivity;
};
