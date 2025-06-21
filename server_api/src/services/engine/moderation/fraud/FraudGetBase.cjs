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

      if (!cDoneEmails[item.User.email]) {
        cDoneEmails[item.User.email] = true;
        outData.cEmails.push(item.User.email);
      }

      if (!cDoneNames[item.User.name]) {
        cDoneNames[item.User.name] = true;
        outData.cNames.push(item.User.name);
      }

      if (this.workPackage.collectionType==="endorsements" ||
        this.workPackage.collectionType==="ratings" ||
        this.workPackage.collectionType==="points") {
        if (!cDonePostNames[item.Post.name]) {
          cDonePostNames[item.Post.name] = true;
          outData.cPostNames.push(item.Post.name);
        }
        item.Post.name = outData.cPostNames.indexOf(item.Post.name);
      }

      if (this.workPackage.collectionType==="posts") {
        if (!cDonePostNames[item.name]) {
          cDonePostNames[item.name] = true;
          outData.cPostNames.push(item.name);
        }
        item.name = outData.cPostNames.indexOf(item.name);
      }

      if (this.workPackage.collectionType==="pointQualities") {
        if (!cDonePostNames[item.Point.Post.name]) {
          cDonePostNames[item.Point.Post.name] = true;
          outData.cPostNames.push(item.Point.Post.name);
        }
        item.Point.Post.name = outData.cPostNames.indexOf(item.Point.Post.name);
      }

      item.dataValues.backgroundColor = outData.cBackgroundColors.indexOf(item.dataValues.backgroundColor);
      item.dataValues.confidenceScoreSort = parseInt(item.dataValues.confidenceScore.replace("%",''));
      item.ip_address = outData.cIpAddresses.indexOf(item.ip_address);
      item.user_agent = outData.cUserAgents.indexOf(item.user_agent);
      item.User.email = outData.cEmails.indexOf(item.User.email);
      item.User.name = outData.cEmails.indexOf(item.User.name);

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