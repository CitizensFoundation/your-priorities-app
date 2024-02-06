const _ = require("lodash");
const FraudDeleteBase = require('./FraudDeleteBase.js');
const models = require("../../../../models/index.cjs");
class FraudDeletePointQualities extends FraudDeleteBase {
    async destroyChunkItems(items) {
        return await new Promise(async (resolve, reject) => {
            const idsToDestroy = items.map(i => i.id);
            try {
                const modelUpdate = await models.Point.update({
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
                    if (this.postsToRecount.indexOf(items[i].Post.id) === -1) {
                        this.postsToRecount.push(items[i].Post.id);
                    }
                }
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async getItemsById() {
        return await new Promise(async (resolve, reject) => {
            try {
                const items = await models.Point.findAll({
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
                    return [item.point_id, item.user_agent];
                });
                resolve(itemsToAnalyse);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = FraudDeletePointQualities;
export {};
