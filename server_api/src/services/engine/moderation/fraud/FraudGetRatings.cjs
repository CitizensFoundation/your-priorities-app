const _ = require("lodash");

const FraudGetEndorsements = require('./FraudGetEndorsements.cjs');
const models = require("../../../../models/index.cjs");

class FraudGetRatings extends FraudGetEndorsements {
  constructor(workPackage){
    super(workPackage);
    this.groupConfiguration = null;
  }

  async getAllItems() {
    const itemsContainer = await this.getAllModelItems(models.Rating, true);
    this.groupConfiguration = itemsContainer.groupConfiguration;
    return itemsContainer.itemsToAnalyse;
  }

  getTopItems(items, type) {
    let topItems = this.setupTopItems(items);
    const postIds = this.getPostIdsFromItems(topItems);
    const postCount = _.uniq(postIds).length;

    let ratingsCount = 10000000;
    if (this.groupConfiguration) {
      ratingsCount = Object.keys(this.groupConfiguration.customRatings).length;
    }

    if (type==="byIpUserAgentPostId") {
      let out = [];

      _.each(topItems, function (item) {
        if ((item.count/ratingsCount)>1) {
          if ((item.count/ratingsCount) > 10) {
            this.setWeightedConfidenceScore(item.items, 95);
          } else if ((item.count/ratingsCount) > 5) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count/ratingsCount) > 4) {
            this.setWeightedConfidenceScore(item.items, 85);
          } else if ((item.count/ratingsCount) > 3) {
            this.setWeightedConfidenceScore(item.items, 80);
          } else if ((item.count/ratingsCount) > 2) {
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
        if ((item.count/postCount/ratingsCount)>1) {
          if ((item.count/postCount/ratingsCount) > 5) {
            this.setWeightedConfidenceScore(item.items, 99);
          } else if ((item.count/postCount/ratingsCount) > 4) {
            this.setWeightedConfidenceScore(item.items, 95);
          } else if ((item.count/postCount/ratingsCount) > 3) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count/postCount/ratingsCount) > 2) {
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
    } else if (type==="byIpFingerprintPostId") {
      let out = [];
      _.each(topItems, function (item) {
        if ((item.count/ratingsCount)>1) {
          if ((item.count/ratingsCount) > 10) {
            this.setWeightedConfidenceScore(item.items, 100);
          } else if ((item.count/ratingsCount) > 5) {
            this.setWeightedConfidenceScore(item.items, 98);
          } else if ((item.count/ratingsCount) > 4) {
            this.setWeightedConfidenceScore(item.items, 95);
          } else if ((item.count/ratingsCount) > 3) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count/ratingsCount) > 2) {
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
        if ((item.count/postCount/ratingsCount)>1) {
          if ((item.count/postCount/ratingsCount) > 100) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if ((item.count/postCount/ratingsCount) > 50) {
            this.setWeightedConfidenceScore(item.items, 85);
          } else if ((item.count/postCount/ratingsCount) > 25) {
            this.setWeightedConfidenceScore(item.items, 80);
          } else if ((item.count/postCount/ratingsCount) > 10) {
            this.setWeightedConfidenceScore(item.items, 75);
          } else if ((item.count/postCount/ratingsCount) > 5) {
            this.setWeightedConfidenceScore(item.items, 70);
          } else if ((item.count/postCount/ratingsCount) > 2) {
            this.setWeightedConfidenceScore(item.items, 65);
          } else {
            this.setWeightedConfidenceScore(item.items, 50);
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

module.exports = FraudGetRatings;