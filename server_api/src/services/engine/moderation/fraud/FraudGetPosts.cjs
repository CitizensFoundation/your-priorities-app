const _ = require("lodash");

const FraudGetBase = require('./FraudGetBase.cjs');
const models = require("../../../../models/index.cjs");
const log = require("../../../../utils/logger.cjs");

class FraudGetPosts extends FraudGetBase {
  async getAllItems() {
    return await new Promise(async (resolve, reject) => {
      try {
        const items = await models.Post.findAll({
          attributes: ["id","created_at","group_id","name","user_id","user_agent","ip_address","data"],
          include: [
            {
              model: models.User,
              attributes: ['id','email'],
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
        })

        const itemsToAnalyse = _.sortBy(items, function (item) {
          return [item.group_id, item.user_agent];
        });

        resolve(itemsToAnalyse);
      } catch (error) {
        reject(error);
      }
    });
  }

  getTopItems(items, type) {
    let topItems = this.setupTopItems(items);

    const pointMultiplier = 10;

    if (this.isDebugFraudDetectionCountAll()) {
      return this.getDebugTopItems(topItems);
    }

    if (type==="byIpFingerprint") {
      let out = [];
      _.each(topItems, function (item) {
        if (item.count>pointMultiplier) {
          if (item.count > 5*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 70);
          } else if (item.count > 4*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 60);
          } else if (item.count > 3*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 40);
          } else if (item.count > 2*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 20);
          } else {
            this.setWeightedConfidenceScore(item.items, 10);
          }
          out.push(item);
        }
      }.bind(this));
      return out;
    } else if (type==="byMissingFingerprint") {
      return topItems;
    } else if (type==="byIpAddress") {
      let out = [];
      _.each(topItems, function (item) {
        if (item.count>pointMultiplier) {
          if (item.count > 100*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 70);
          } else if (item.count > 50*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 65);
          } else if (item.count > 25*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 40);
          } else if (item.count > 10*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 35);
          } else if (item.count > 5*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 20);
          } else if (item.count > 2*pointMultiplier) {
            this.setWeightedConfidenceScore(item.items, 15);
          } else {
            this.setWeightedConfidenceScore(item.items, 10);
          }
          out.push(item);
        }
      }.bind(this));
      return out;
    } else {
      log.warn("Wrong type for e fraud check")
      return [];
    }
  }
}

module.exports = FraudGetPosts;
