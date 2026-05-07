const _ = require("lodash");

const FraudGetEndorsements = require('./FraudGetEndorsements.cjs');
const models = require("../../../../models/index.cjs");
const log = require("../../../../utils/logger.cjs");

class FraudGetRatings extends FraudGetEndorsements {
  constructor(workPackage){
    super(workPackage);
    this.ratingDimensionCountsByGroupId = {};
  }

  async getAllItems() {
    const itemsContainer = await this.getAllModelItems(models.Rating, true);
    this.ratingDimensionCountsByGroupId = await this.getRatingDimensionCountsByGroupId(itemsContainer.itemsToAnalyse);
    return itemsContainer.itemsToAnalyse;
  }

  async getRatingDimensionCountsByGroupId(items) {
    const groupIds = _.uniq(items.map(item => {
      return item.Post && item.Post.Group && item.Post.Group.id;
    }).filter(groupId => groupId));

    if (groupIds.length===0) {
      return {};
    }

    const groups = await models.Group.findAll({
      where: {
        id: groupIds
      },
      attributes: ['id','configuration']
    });

    return groups.reduce((countsByGroupId, group) => {
      const customRatings = group.configuration && group.configuration.customRatings;
      countsByGroupId[group.id] =
        customRatings && typeof customRatings === "object"
          ? Math.max(Object.keys(customRatings).length, 1)
          : 1;
      return countsByGroupId;
    }, {});
  }

  getRatingDimensionsForItem(item) {
    const groupId = item.Post && item.Post.Group && item.Post.Group.id;
    return this.ratingDimensionCountsByGroupId[groupId] || 1;
  }

  getNormalizedRatingCount(items) {
    return _.sumBy(items, item => 1 / this.getRatingDimensionsForItem(item));
  }

  getTopItems(items, type) {
    let topItems = this.setupTopItems(items);
    const postIds = this.getPostIdsFromItems(topItems);
    const postCount = Math.max(_.uniq(postIds).length, 1);

    if (this.isDebugFraudDetectionCountAll()) {
      return this.getDebugTopItems(topItems);
    }

    if (type==="byIpUserAgentPostId") {
      let out = [];

      _.each(topItems, function (item) {
        const ratingRatio = this.getNormalizedRatingCount(item.items);
        if (ratingRatio>1) {
          if (ratingRatio > 10) {
            this.setWeightedConfidenceScore(item.items, 95);
          } else if (ratingRatio > 5) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if (ratingRatio > 4) {
            this.setWeightedConfidenceScore(item.items, 85);
          } else if (ratingRatio > 3) {
            this.setWeightedConfidenceScore(item.items, 80);
          } else if (ratingRatio > 2) {
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
        const ratingRatio = this.getNormalizedRatingCount(item.items) / postCount;
        if (ratingRatio>1) {
          if (ratingRatio > 5) {
            this.setWeightedConfidenceScore(item.items, 99);
          } else if (ratingRatio > 4) {
            this.setWeightedConfidenceScore(item.items, 95);
          } else if (ratingRatio > 3) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if (ratingRatio > 2) {
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
        const ratingRatio = this.getNormalizedRatingCount(item.items);
        if (ratingRatio>1) {
          if (ratingRatio > 10) {
            this.setWeightedConfidenceScore(item.items, 100);
          } else if (ratingRatio > 5) {
            this.setWeightedConfidenceScore(item.items, 98);
          } else if (ratingRatio > 4) {
            this.setWeightedConfidenceScore(item.items, 95);
          } else if (ratingRatio > 3) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if (ratingRatio > 2) {
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
        const ratingRatio = this.getNormalizedRatingCount(item.items) / postCount;
        if (ratingRatio>1) {
          if (ratingRatio > 100) {
            this.setWeightedConfidenceScore(item.items, 90);
          } else if (ratingRatio > 50) {
            this.setWeightedConfidenceScore(item.items, 85);
          } else if (ratingRatio > 25) {
            this.setWeightedConfidenceScore(item.items, 80);
          } else if (ratingRatio > 10) {
            this.setWeightedConfidenceScore(item.items, 75);
          } else if (ratingRatio > 5) {
            this.setWeightedConfidenceScore(item.items, 70);
          } else if (ratingRatio > 2) {
            this.setWeightedConfidenceScore(item.items, 65);
          } else {
            this.setWeightedConfidenceScore(item.items, 50);
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

module.exports = FraudGetRatings;
