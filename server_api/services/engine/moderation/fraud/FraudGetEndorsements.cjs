const _ = require("lodash");

const FraudGetBase = require('./FraudGetBase.cjs');
const models = require("../../../../models/index.cjs");

//TODO: Change to native JS instead of lodash
class FraudGetEndorsements extends FraudGetBase {
  async getAllModelItems(model, getGroup) {
    return await new Promise(async (resolve, reject) => {
      try {
        const items = await model.findAll({
          attributes: ["id","created_at","value","post_id","user_id","user_agent","ip_address","data"],
          include: [
            {
              model: models.User,
              attributes: ['id','email'],
            },
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
        })

        const itemsToAnalyse = _.sortBy(items, function (item) {
          return [item.post_id, item.user_agent];
        });

        let groupConfiguration;

        if (getGroup && items.length>0) {
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

        resolve({itemsToAnalyse, groupConfiguration});
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllItems() {
    const itemsContainer = await this.getAllModelItems(models.Endorsement);
    return itemsContainer.itemsToAnalyse;
  }

  getTopItems(items, type) {
    let topItems = this.setupTopItems(items);
    const postIds = this.getPostIdsFromItems(topItems);
    const postCount = _.uniq(postIds).length;

    if (type==="byIpUserAgentPostId") {
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
        if ((item.count/postCount)>1) {
          if ((item.count/postCount) > 5) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count/postCount) > 4) {
            this.setWeightedConfidenceScore(item.items, 80);
          } else if ((item.count/postCount) > 3) {
            this.setWeightedConfidenceScore(item.items, 60);
          } else if ((item.count/postCount) > 2) {
            this.setWeightedConfidenceScore(item.items, 55);
          } else {
            this.setWeightedConfidenceScore(item.items, 30);
          }
          out.push(item);
        }
      }.bind(this));
      return out;
    } else if (type==="byMissingFingerprint") {
      return topItems;
    } else if (type==="byIpFingerprintPostId") {
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
        if ((item.count/postCount)>1) {
          if ((item.count/postCount) > 100) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count/postCount) > 50) {
            this.setWeightedConfidenceScore(item.items, 80);
          } else if ((item.count/postCount) > 25) {
            this.setWeightedConfidenceScore(item.items, 70);
          } else if ((item.count/postCount) > 10) {
            this.setWeightedConfidenceScore(item.items, 60);
          } else if ((item.count/postCount) > 5) {
            this.setWeightedConfidenceScore(item.items, 50);
          } else if ((item.count/postCount) > 2) {
            this.setWeightedConfidenceScore(item.items, 40);
          } else {
            this.setWeightedConfidenceScore(item.items, 30);
          }
          out.push(item);
        }
      }.bind(this));
      return out;
    } else {
      console.warn("Wrong type for e fraud check")
      return [];
    }
  }
}

module.exports = FraudGetEndorsements;