"use strict";
const _ = require("lodash");
const FraudDeleteEndorsements = require('./FraudDeleteEndorsements.cjs');
const models = require("../../../../models/index.cjs");
//TODO: Change to native JS instead of lodash
class FraudDeleteRatings extends FraudDeleteEndorsements {
    getAllItemsExceptOne(items) {
        if (items.length === 1 && this.getAllowedSingleDelete()) {
            return items;
        }
        const itemsByTypeIndex = _.groupBy(items, item => {
            return item.type_index === undefined || item.type_index === null
                ? "default"
                : item.type_index;
        });
        let itemsToDelete = [];
        _.each(itemsByTypeIndex, innerItems => {
            itemsToDelete = itemsToDelete.concat(super.getAllItemsExceptOne(innerItems));
        });
        return itemsToDelete;
    }
    async destroyChunkItems(items, transaction) {
        return this.destroyChunkItemsByModel(models.Rating, items, transaction);
    }
    async getItemsById() {
        return await new Promise(async (resolve, reject) => {
            try {
                const items = await models.Rating.findAll({
                    where: {
                        id: {
                            $in: this.job.internal_data.idsToDelete
                        }
                    },
                    attributes: ["id", "created_at", "value", "type_index", "post_id", "user_id", "user_agent", "ip_address", "data"],
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
                    return [item.post_id, item.type_index, item.user_agent];
                });
                resolve(itemsToAnalyse);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = FraudDeleteRatings;
