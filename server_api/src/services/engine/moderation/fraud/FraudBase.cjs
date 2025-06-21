const _ = require("lodash");
const moment = require("moment");

class FraudBase {
  constructor(workPackage) {
    this.workPackage = workPackage;
    this.items = null;
    this.dataToProcess = null;
  }

  average(arr)  {
    return arr.reduce((a,b) => a + b, 0) / arr.length;;
  }

  getTopItems() {
    log.error("Should be implemented in a sub class");
    return null;
  }

  async getAllItems() {
    log.error("Should be implemented in a sub class");
    return null;
  }

  getPostIdsFromItems(topItems) {
    const postIds = [];
    _.forEach(topItems, item => {
      for (let i=0;i<item.items.length;i++) {
        postIds.push(item.items[i].post_id);
      }
    });

    return postIds;
  }

  setupTopItems(items) {
    let topItems = [];

    _.each(items, function (items, key) {
      topItems.push({key: key, count: items.length, items: items });
    });

    return _.sortBy(topItems, function (item) {
      return -item.count;
    });
  }

  getTopDataByIp()  {
    return this.getTopItems(this.groupTopDataByIp(), "byIpAddress");
  }

  getTopDataByIpUserAgentPostId() {
    return this.getTopItems(this.groupTopDataByIpUserAgentPostId(), "byIpUserAgentPostId");
  }

  getTopDataByIpUserAgentPointId() {
    return this.getTopItems(this.groupTopDataByIpUserAgentPointId(), "byIpUserAgentPointId");
  }

  getTopDataByIpFingerprintPostId ()  {
    return this.getTopItems(this.groupTopDataByIpFingerprintPostId(), "byIpFingerprintPostId");
  }

  getTopDataByIpFingerprintPointId ()  {
    return this.getTopItems(this.groupTopDataByIpFingerprintPointId(), "byIpFingerprintPointId");
  }

  getTopDataByIpFingerprint () {
    return this.getTopItems(this.groupTopDataByIpFingerprint(), "byIpFingerprint");
  }

  getTopDataByNoFingerprints ()  {
    return this.getTopItems(this.groupTopDataByNoFingerprints(), "byMissingFingerprint");
  }

  setupDataToProcess() {
    switch (this.workPackage.selectedMethod) {
      case "byIpAddress":
        this.dataToProcess = this.getTopDataByIp();
        break;
      case "byIpUserAgentPostId":
        this.dataToProcess = this.getTopDataByIpUserAgentPostId();
        break;
      case "byIpUserAgentPointId":
        this.dataToProcess = this.getTopDataByIpUserAgentPointId();
        break;
      case "byIpFingerprintPostId":
        this.dataToProcess = this.getTopDataByIpFingerprintPostId();
        break;
      case "byIpFingerprintPointId":
        this.dataToProcess = this.getTopDataByIpFingerprintPointId();
        break;
      case "byIpFingerprint":
        this.dataToProcess = this.getTopDataByIpFingerprint();
        break;
      case "byMissingBrowserFingerprint":
        this.dataToProcess = this.getTopDataByNoFingerprints();
        break;
    }
  }

  getTimeDifferentScores (items) {
    const days = _.groupBy(items, item => {
      return moment(item.created_at).format("DD/MM/YY");
    });

    const daysScores = [];
    _.each(days, function (innerItems, key) {
      const seconds = [];
      const sortedItems = _.sortBy(innerItems, item => {
        return moment(item.created_at).valueOf()
      })

      for (let i=0; i<sortedItems.length;i++) {
        if (i<sortedItems.length-1) {
          const first = moment(sortedItems[i].created_at);
          const second = moment(sortedItems[i+1].created_at);
          const duration = moment.duration(second.diff(first));
          seconds.push(Math.round(duration.asSeconds()));
        }
      }

      const averageDay = this.average(seconds);
      let score;

      if (averageDay<1) {
        score = 99;
      } else if (averageDay<5) {
        score = 97;
      } else if (averageDay<50) {
        score = 95;
      } else if (averageDay<100) {
        score = 90;
      } else if (averageDay<200) {
        score = 85;
      } else if (averageDay<400) {
        score = 80;
      } else if (averageDay<800) {
        score = 75;
      } else if (averageDay<900) {
        score = 60;
      } else {
        score = 50;
      }

      daysScores.push(score);
    }.bind(this));

    return this.average(daysScores);
  }

  setWeightedConfidenceScore (items, score) {
    const timeScore = this.getTimeDifferentScores(items);
    const averageScore = (timeScore+score)/2;
    for (let i=0;i<items.length;i++) {
      const item = items[i];
      const hasData = item.data ? Object.keys(item.data).length === 0 : false;
      if (hasData && !item.data.browserId && moment(item.created_at)>this.getStartFingerprintMoment()) {
        if (["posts","points"].indexOf(this.workPackage.collectionType) > -1) {
          item.dataValues.confidenceScore = `50%`;
        } else {
          item.dataValues.confidenceScore = `100%`;
        }
      } else {
        item.dataValues.confidenceScore = `${averageScore.toFixed(0)}%`;
      }
    }
  }

  getStartFingerprintMoment()  {
    if (this.workPackage.collectionType==="endorsements") {
      return moment("16/02/2022","DD/MM/YYYY").valueOf();
    } else {
      return moment("24/02/2022","DD/MM/YYYY").valueOf();
    }
  }

  groupTopDataByIp()  {
    return _.groupBy(this.items, item => {
      return item.ip_address;
    });
  }

  groupTopDataByIpUserAgentPostId()  {
    return _.groupBy(this.items, (item) => {
      return item.ip_address+":"+item.post_id+":"+item.user_agent;
    });
  }

  groupTopDataByIpUserAgentPointId()  {
    return _.groupBy(this.items, (item) => {
      return item.ip_address+":"+item.point_id+":"+item.user_agent;
    });
  }

  groupTopDataByIpFingerprintPostId() {
    const filtered = _.filter(this.items, (item) => {
      return item.data &&
             item.data.browserFingerprint &&
             item.data.browserFingerprint !== "undefined";
    });

    return _.groupBy(filtered, (item) => {
      return item.ip_address+":"+item.post_id+":"+item.data.browserFingerprint;
    });
  }

  groupTopDataByIpFingerprintPointId() {
    const filtered = _.filter(this.items, (item) => {
      return item.data &&
        item.data.browserFingerprint &&
        item.data.browserFingerprint !== "undefined";
    });

    return _.groupBy(filtered, (item) => {
      return item.ip_address+":"+item.point_id+":"+item.data.browserFingerprint;
    });
  }

  groupTopDataByIpFingerprint()  {
    const filtered = _.filter(this.items, (item) => {
      return item.data &&
             item.data.browserFingerprint &&
             item.data.browserFingerprint !== "undefined";
    });

    return _.groupBy(filtered, (item) => {
      return item.ip_address+":"+item.data.browserFingerprint;
    });
  }

  groupTopDataByNoFingerprints() {
    const filtered = _.filter(this.items, item => {
      return item.data &&
             (!item.data.browserFingerprint ||
              !item.data.browserId) &&
              moment(item.created_at).valueOf()>this.getStartFingerprintMoment();
    });

    const scoreHundred = (["posts","points"].indexOf(this.workPackage.collectionType) > -1) ? "50%" : "100%";
    const scoreNinety = (["posts","points"].indexOf(this.workPackage.collectionType) > -1) ? "45%" : "90%";
    const scoreSeventy = (["posts","points"].indexOf(this.workPackage.collectionType) > -1) ? "60%" : "70%";

    _.forEach(filtered,  item => {
      if (!item.data.browserFingerprint &&
        !item.data.browserId) {
        item.dataValues.confidenceScore = scoreHundred;
        item.dataValues.key = "bothUndefined";
      } else if (!item.data.browserId) {
        item.dataValues.confidenceScore = scoreNinety;
        item.dataValues.key = "browserIdUndefined";
      } else {
        item.dataValues.confidenceScore = scoreSeventy;
        item.dataValues.key = "fingerPrintUndefined";
      }
    })

    return _.groupBy(filtered, item => {
      return item.key;
    });
  }
}

module.exports = FraudBase;