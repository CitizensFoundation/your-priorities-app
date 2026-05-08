const _ = require("lodash");
const moment = require("moment");

const FraudBase = require('./FraudBase.cjs');
const models = require("../../../../models/index.cjs");
const ColorHash = require('color-hash').default;
const log = require("../../../../utils/logger.cjs");

class FraudGetBase extends FraudBase {
  constructor(workPackage){
    super(workPackage);
  }

  formatTime()  {
    _.forEach(this.dataToProcess, item => {
      for (let i=0;i<item.items.length;i++) {
        item.items[i].dataValues.createAtValue = moment( item.items[i].created_at).valueOf();
        item.items[i].dataValues.created_at = moment( item.items[i].created_at).format("DD/MM/YY HH:mm:ss");
      }
    });
  }

  setBackgroundColorsFromKey ()  {
    const colorHash = new ColorHash({lightness: 0.83});
    _.forEach(this.dataToProcess, item => {
      const color = colorHash.hex(item.key);
      for (let i=0;i<item.items.length;i++) {
        item.items[i].dataValues.backgroundColor = color;
      }
    });
  }

  getUserEmail(item) {
    return item.User && item.User.email ? item.User.email : "";
  }

  getUserName(item) {
    return item.User && item.User.name ? item.User.name : "";
  }

  getPostName(item) {
    return item.Post && item.Post.name ? item.Post.name : "";
  }

  getPointQualityPostName(item) {
    return item.Point && item.Point.Post && item.Point.Post.name ? item.Point.Post.name : "";
  }

  getItemName(item) {
    return item && item.name ? item.name : "";
  }

  customCompress() {
    const flatData = [];

    _.forEach(this.dataToProcess, item => {
      for (let i=0;i<item.items.length;i++) {
        const innerItem = item.items[i];
        innerItem.key = item.key;
        innerItem.dataValues.groupCount = item.items.length;
        flatData.push(innerItem);
      }
    });

    const cDoneBackgroundColors = {};
    const cDoneIpAddresses = {};
    const cDoneUserAgents = {};
    const cDoneEmails = {};
    const cDoneNames = {};
    const cDonePostNames = {};
    const cKeysDone = {};
    const cKeys = [];

    const outData = {
      cBackgroundColors: [],
      cIpAddresses: [],
      cUserAgents: [],
      cEmails: [],
      cNames: [],
      cPostNames: [],
      items: []
    }

    _.forEach(flatData,  item => {
      if (!cKeysDone[item.key]) {
        cKeysDone[item.key] = true;
        cKeys.push(item.key);
      }

      item.dataValues.key = cKeys.indexOf(item.key);

      if (!cDoneBackgroundColors[item.dataValues.backgroundColor]) {
        cDoneBackgroundColors[item.dataValues.backgroundColor] = true;
        outData.cBackgroundColors.push(item.dataValues.backgroundColor);
      }

      if (!cDoneIpAddresses[item.ip_address]) {
        cDoneIpAddresses[item.ip_address] = true;
        outData.cIpAddresses.push(item.ip_address);
      }

      if (!cDoneUserAgents[item.user_agent]) {
        cDoneUserAgents[item.user_agent] = true;
        outData.cUserAgents.push(item.user_agent);
      }

      const userEmail = this.getUserEmail(item);
      const userName = this.getUserName(item);
      item.User = item.User || {};

      if (!cDoneEmails[userEmail]) {
        cDoneEmails[userEmail] = true;
        outData.cEmails.push(userEmail);
      }

      if (!cDoneNames[userName]) {
        cDoneNames[userName] = true;
        outData.cNames.push(userName);
      }

      if (this.workPackage.collectionType==="endorsements" ||
        this.workPackage.collectionType==="ratings" ||
        this.workPackage.collectionType==="points") {
        const postName = this.getPostName(item);
        item.Post = item.Post || {};
        if (!cDonePostNames[postName]) {
          cDonePostNames[postName] = true;
          outData.cPostNames.push(postName);
        }
        item.Post.name = outData.cPostNames.indexOf(postName);
      }

      if (this.workPackage.collectionType==="posts") {
        const postName = this.getItemName(item);
        if (!cDonePostNames[postName]) {
          cDonePostNames[postName] = true;
          outData.cPostNames.push(postName);
        }
        item.name = outData.cPostNames.indexOf(postName);
      }

      if (this.workPackage.collectionType==="pointQualities") {
        const postName = this.getPointQualityPostName(item);
        item.Point = item.Point || {};
        item.Point.Post = item.Point.Post || {};
        if (!cDonePostNames[postName]) {
          cDonePostNames[postName] = true;
          outData.cPostNames.push(postName);
        }
        item.Point.Post.name = outData.cPostNames.indexOf(postName);
      }

      item.dataValues.backgroundColor = outData.cBackgroundColors.indexOf(item.dataValues.backgroundColor);
      item.dataValues.confidenceScoreSort = parseInt(item.dataValues.confidenceScore.replace("%",''));
      item.ip_address = outData.cIpAddresses.indexOf(item.ip_address);
      item.user_agent = outData.cUserAgents.indexOf(item.user_agent);
      item.User.email = outData.cEmails.indexOf(userEmail);
      item.User.name = outData.cNames.indexOf(userName);

      outData.items.push(item);
    });

    this.dataToProcess = outData;
  }

  async processAndGetFraudItems() {
    return await new Promise(async (resolve, reject) => {
      try {
        log.info(`Get Fraud ${JSON.stringify(this.workPackage)}`);

        this.items = await this.getAllItems();

        this.setupDataToProcess();

        this.setBackgroundColorsFromKey();
        this.formatTime();
        this.customCompress();

        await models.AcBackgroundJob.updateDataAsync(this.workPackage.jobId, this.dataToProcess);
        await models.AcBackgroundJob.updateProgressAsync(this.workPackage.jobId, 100);
        resolve();
      } catch (error) {
        reject(error);
      }
    })
  }
}

module.exports = FraudGetBase;
