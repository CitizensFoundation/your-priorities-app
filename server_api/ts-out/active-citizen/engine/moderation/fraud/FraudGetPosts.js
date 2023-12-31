"use strict";
const _ = require("lodash");
const FraudGetBase = require('./FraudGetBase.js');
const models = require("../../../../models");
class FraudGetPoints extends FraudGetBase {
    async getAllItems() {
        return await new Promise(async (resolve, reject) => {
            try {
                const items = await models.Post.findAll({
                    attributes: ["id", "created_at", "group_id", "name", "user_id", "user_agent", "ip_address", "data"],
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
    getTopItems(items, type) {
        let topItems = this.setupTopItems(items);
        const postIds = this.getPostIdsFromItems(topItems);
        const postCount = _.uniq(postIds).length;
        const pointMultiplier = 10;
        if (type === "byIpFingerprint") {
            let out = [];
            _.each(topItems, function (item) {
                if ((item.count / postCount) > pointMultiplier) {
                    if ((item.count / postCount) > 5 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 70);
                    }
                    else if ((item.count / postCount) > 4 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 60);
                    }
                    else if ((item.count / postCount) > 3 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 40);
                    }
                    else if ((item.count / postCount) > 2 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 20);
                    }
                    else {
                        this.setWeightedConfidenceScore(item.items, 10);
                    }
                    out.push(item);
                }
            }.bind(this));
            return out;
        }
        else if (type === "byMissingFingerprint") {
            return topItems;
        }
        else if (type === "byIpAddress") {
            let out = [];
            _.each(topItems, function (item) {
                if ((item.count / postCount) > pointMultiplier) {
                    if ((item.count / postCount) > 100 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 70);
                    }
                    else if ((item.count / postCount) > 50 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 65);
                    }
                    else if ((item.count / postCount) > 25 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 40);
                    }
                    else if ((item.count / postCount) > 10 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 35);
                    }
                    else if ((item.count / postCount) > 5 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 20);
                    }
                    else if ((item.count / postCount) > 2 * pointMultiplier) {
                        this.setWeightedConfidenceScore(item.items, 15);
                    }
                    else {
                        this.setWeightedConfidenceScore(item.items, 10);
                    }
                    out.push(item);
                }
            }.bind(this));
            return out;
        }
        else {
            console.warn("Wrong type for e fraud check");
            return [];
        }
    }
}
module.exports = FraudGetPoints;
