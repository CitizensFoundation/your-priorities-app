"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue = require('../workers/queue.cjs');
module.exports = (sequelize, DataTypes) => {
    const AcCampaign = sequelize.define("AcCampaign", {
        data: DataTypes.JSONB,
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        ac_list_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'ac_campaigns'
    });
    AcCampaign.associate = (models) => {
        AcCampaign.belongsTo(models.AcList, { foreignKey: 'ac_list_id' });
        AcCampaign.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    AcCampaign.updateCampaignAndUser = (parameters, updateParameter, done) => {
        const marketingTrackingUserId = parameters.yu;
        const marketingTrackingCampaignId = parameters.yc;
        async.parallel([
            (seriesCallback) => {
                sequelize.models.AcCampaign.findOne({
                    where: {
                        id: marketingTrackingCampaignId
                    }
                }).then(campaign => {
                    if (campaign) {
                        campaign.set('data.' + updateParameter, campaign.data[updateParameter] + 1);
                        campaign.save().then(() => {
                            seriesCallback();
                        }).catch(error => {
                            seriesCallback(error);
                        });
                    }
                    else {
                        seriesCallback("Tracking campaign not found");
                    }
                }).catch(error => {
                    seriesCallback(error);
                });
            },
            (seriesCallback) => {
                sequelize.models.AcListUser.findOne({
                    where: {
                        id: marketingTrackingUserId
                    }
                }).then(listUser => {
                    if (listUser) {
                        listUser.set('data.' + updateParameter, listUser.data[updateParameter] + 1);
                        listUser.save().then(() => {
                            seriesCallback();
                        }).catch(error => {
                            seriesCallback(error);
                        });
                    }
                    else {
                        seriesCallback("Tracking list user not found");
                    }
                }).catch(error => {
                    seriesCallback(error);
                });
            }
        ], (error) => {
            done(error);
        });
    };
    AcCampaign.sendCampaign = (campaignId, done) => {
        models.AcBackgroundJob.createJob({}, {}, (error, jobId) => {
            if (error) {
                done(error);
            }
            else {
                queue.add('process-marketing', {
                    type: 'send-campaign',
                    jobId: jobId,
                    campaignId: campaignId,
                }, 'medium');
                done();
            }
        });
    };
    AcCampaign.getSendStatus = (jobId, done) => {
        sequelize.models.AcBackgroundJob.findOne({
            where: {
                id: jobId
            },
            attributes: ['id', 'progress', 'error', 'data']
        }).then(job => {
            done(null, job);
        }).catch(error => {
            done(error);
        });
    };
    return AcCampaign;
};
