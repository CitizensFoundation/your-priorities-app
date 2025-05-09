const _ = require("lodash");

const FraudGetBase = require('./FraudGetBase.cjs');
const models = require("../../../../models/index.cjs");

//TODO: Change to native JS instead of lodash
class FraudGetPointQualities extends FraudGetBase {
  async getAllItems() {
    return await new Promise(async (resolve, reject) => {
      try {
        const items = await models.PointQuality.findAll({
          attributes: ["id","created_at","value","point_id","user_id","user_agent","ip_address","data"],
          include: [
            {
              model: models.User,
              attributes: ['id','email'],
            },
            {
              model: models.Point,
              attributes: ['id'],
              include: [
                {
                  model: models.Post,
                  attributes: ['id','name'],
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
            },
          ]
        })

        const itemsToAnalyse = _.sortBy(items, function (item) {
          return [item.post_id, item.user_agent];
        });

        resolve(itemsToAnalyse);
      } catch (error) {
        reject(error);
      }
    });
  }

  getPointIdsFromItems(topItems) {
    const postIds = [];
    _.forEach(topItems, item => {
      for (let i=0;i<item.items.length;i++) {
        postIds.push(item.items[i].point_id);
      }
    });

    return postIds;
  }

  getTopItems(items, type) {
    let topItems = this.setupTopItems(items);
    const pointIds = this.getPointIdsFromItems(topItems);
    const pointCount = _.uniq(pointIds).length;

    if (type==="byIpUserAgentPointId") {
      let out = [];
      _.each(topItems, function (item) {
        if (item.count>1) {
          if ((item.count) > 10) {
            this.setWeightedConfidenceScore(item.items, 95);
          } else if ((item.count) > 5) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count) > 4) {
            this.setWeightedConfidenceScore(item.items, 85);
          } else if ((item.count) > 3) {
            this.setWeightedConfidenceScore(item.items, 80);
          } else if ((item.count) > 2) {
            this.setWeightedConfidenceScore(item.items, 75);
          } else {
            this.setWeightedConfidenceScore(item.items, 70);
          }
          out.push(item);
        }
      }.bind(this));
      return out;
    } else if (type==="byIpFingerprint") {
      let out = [];
      _.each(topItems, function (item) {
        if ((item.count/pointCount)>1) {
          if ((item.count/pointCount) > 5) {
            this.setWeightedConfidenceScore(item.items, 99);
          } else if ((item.count/pointCount) > 4) {
            this.setWeightedConfidenceScore(item.items, 95);
          } else if ((item.count/pointCount) > 3) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count/pointCount) > 2) {
            this.setWeightedConfidenceScore(item.items, 85);
          } else {
            this.setWeightedConfidenceScore(item.items, 80);
          }
          out.push(item);
        }
      }.bind(this));
      return out;
    } else if (type==="byMissingFingerprint") {
      return topItems;
    } else if (type==="byIpFingerprintPointId") {
      let out = [];
      _.each(topItems, function (item) {
        if (item.count>1) {
          if ((item.count) > 10) {
            this.setWeightedConfidenceScore(item.items, 100);
          } else if ((item.count) > 5) {
            this.setWeightedConfidenceScore(item.items, 98);
          } else if ((item.count) > 4) {
            this.setWeightedConfidenceScore(item.items, 95);
          } else if ((item.count) > 3) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count) > 2) {
            this.setWeightedConfidenceScore(item.items, 85);
          } else {
            this.setWeightedConfidenceScore(item.items, 80);
          }
          out.push(item);
        }
      }.bind(this));
      return out;
    } else if (type==="byIpAddress") {
      let out = [];
      _.each(topItems, function (item) {
        if ((item.count/pointCount)>1) {
          if ((item.count/pointCount) > 100) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count/pointCount) > 50) {
            this.setWeightedConfidenceScore(item.items, 85);
          } else if ((item.count/pointCount) > 25) {
            this.setWeightedConfidenceScore(item.items, 80);
          } else if ((item.count/pointCount) > 10) {
            this.setWeightedConfidenceScore(item.items, 75);
          } else if ((item.count/pointCount) > 5) {
            this.setWeightedConfidenceScore(item.items, 70);
          } else if ((item.count/pointCount) > 2) {
            this.setWeightedConfidenceScore(item.items, 65);
          } else {
            this.setWeightedConfidenceScore(item.items, 50);
          }
          out.push(item);
        }
      }.bind(this));
      return out;
    } else {
      console.warn(`Wrong type for e fraud check: ${type}`)
      return [];
    }
  }
}

module.exports = FraudGetPointQualities;