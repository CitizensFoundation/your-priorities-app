"use strict";
const _ = require("lodash");
const FraudDeleteBase = require('./FraudDeleteBase.cjs');
const models = require("../../../../models/index.cjs");
class FraudDeleteEndorsements extends FraudDeleteBase {
    async destroyChunkItemsByModel(model, items) {
        return await new Promise(async (resolve, reject) => {
            const idsToDestroy = items.map(i => i.id);
            try {
                const modelUpdate = await model.update({
                    deleted: true
                }, {
                    where: {
                        id: {
                            $in: idsToDestroy
                        }
                    },
                    include: [
                        {
                            model: models.Post,
                            attributes: ['id'],
                            include: [
                                {
                                    model: models.Group,
                                    attributes: ['id'],
                                    include: [
                                        {
                                            model: models.Community,
                                            attributes: ['id'],
                                            where: {
                                                id: this.workPackage.communityId
                                            },
                                            required: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    attributes: ['id']
                });
                for (let i = 0; i < items.length; i++) {
                    if (this.postsToRecount.indexOf(items[i].post_id) === -1) {
                        this.postsToRecount.push(items[i].post_id);
                    }
                }
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async destroyChunkItems(items) {
        return this.destroyChunkItemsByModel(models.Endorsement, items);
    }
    async getModelItemsById(model, getGroup) {
        return await new Promise(async (resolve, reject) => {
            try {
                const items = await model.findAll({
                    where: {
                        id: {
                            $in: this.job.internal_data.idsToDelete
                        }
                    },
                    attributes: ["id", "created_at", "value", "post_id", "user_id", "user_agent", "ip_address", "data"],
                    include: [
                        {
                            model: models.User,
                            attributes: ['id', 'email'],
                        },
                        {
                            model: models.Post,
                            attributes: ['id', 'name'],
                            include: [
                                {
                                    model: models.Group,
                                    attributes: ['id'],
                                    include: [
                                        {
                                            model: models.Community,
                                            attributes: [],
                                            where: {
                                                id: this.workPackage.communityId
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });
                const itemsToAnalyse = _.sortBy(items, function (item) {
                    return [item.post_id, item.user_agent];
                });
                let groupConfiguration;
                if (getGroup) {
                    const group = await models.Group.findOne({
                        where: {
                            id: itemsToAnalyse[0].Post.Group.id
                        },
                        attributes: ['configuration']
                    });
                    if (group) {
                        groupConfiguration = group.configuration;
                    }
                }
                resolve({ itemsToAnalyse, groupConfiguration });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async getItemsById() {
        const itemsContainer = await this.getModelItemsById(models.Endorsement);
        return itemsContainer.itemsToAnalyse;
    }
}
module.exports = FraudDeleteEndorsements;
