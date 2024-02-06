const _ = require("lodash");
const FraudDeleteEndorsements = require('./FraudDeleteEndorsements.js');
const models = require("../../../../models/index.cjs");
class FraudDeletePosts extends FraudDeleteEndorsements {
    async destroyChunkItems(items) {
        return await new Promise(async (resolve, reject) => {
            const idsToDestroy = items.map(i => i.id);
            try {
                const modelUpdate = await models.Post.update({
                    deleted: true
                }, {
                    where: {
                        id: {
                            $in: idsToDestroy
                        }
                    },
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
                    ],
                    attributes: ['id']
                });
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
                const items = await models.Post.findAll({
                    where: {
                        id: {
                            $in: this.job.internal_data.idsToDelete
                        }
                    },
                    attributes: ["id", "created_at", "group_id", "user_id", "user_agent", "ip_address", "data"],
                    include: [
                        {
                            model: models.User,
                            attributes: ['id', 'email'],
                        },
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
                });
                const itemsToAnalyse = _.sortBy(items, function (item) {
                    return [item.group_id, item.user_agent];
                });
                resolve(itemsToAnalyse);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = FraudDeletePosts;
export {};
