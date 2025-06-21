const _ = require("lodash");
const models = require("../../../../models/index.cjs");
const i18n = require('../../../utils/i18n.cjs');
const deepEqual = require('deep-equal');

const FraudGetEndorsements = require("./FraudGetEndorsements");
const FraudGetPointQualities = require("./FraudGetPointQualities");
const FraudGetRatings = require("./FraudGetRatings");
const queue = require("../../../workers/queue.cjs");
const Backend = require("i18next-fs-backend");
const path = require("path");

var localesPath = path.resolve(__dirname, '../../../locales');

class FraudScannerNotifier {
  constructor() {
    this.currentCommunity = null;
    this.uniqueCollectionItemsIds = {};
    this.collectionsToScan = ['endorsements', 'ratings','pointQualities'];
    this.scannerModels = [FraudGetEndorsements, FraudGetRatings, FraudGetPointQualities];
  }

  getCommunityURL () {
    if (this.currentCommunity && this.currentCommunity.Domain && this.currentCommunity.Domain.domain_name) {
      const domainName = this.currentCommunity.Domain.domain_name;
      let hostname = this.currentCommunity.hostname;
      const id = this.currentCommunity.id;

      if (domainName==="parliament.scot") {
        hostname = "engage";
      } else if (domainName==="multicitychallenge.org" && process.env.US_CLUSTER !=null) {
        hostname = "ideas";
      } else if (domainName==="engage-southampton.ac.uk") {
        hostname = "scca-online";
      } else if (domainName==="multicitychallenge.org") {
        hostname = "yp";
      } else if (domainName==="mycitychallenge.org") {
        hostname = "ideas";
      } else if (domainName==="engagebritain.org") {
        hostname = "socialcare";
      } else if (domainName==="boliden.com") {
        hostname = "sidtjarn";
      }

      if (hostname) {
        return `https://${hostname}.${domainName}/community/${id}`;
      } else {
        return `https://${domainName}/community/${id}`;
      }
    } else {
      log.error("No domain name for community");
      return "";
    }
  }

  setupCounts(items, collectionType) {
    if (!this.uniqueCollectionItemsIds[collectionType]) {
      this.uniqueCollectionItemsIds[collectionType]=[];
    }

    if (items) {
      for (let i=0;i<items.length;i++)  {
        if (this.uniqueCollectionItemsIds[collectionType].indexOf(items[i].id) === -1) {
          const confidenceScore = parseInt(items[i].confidenceScore.replace("%",""));
          if (confidenceScore>75) {
            this.uniqueCollectionItemsIds[collectionType].push(items[i].id);
          }
        }
      }
    } else {
      log.error(`No job data for ${collectionType}`);
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  formatNumber(value) {
    if (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "0";
    }
  }

  getNumberSign(number) {
    if (number>=0) {
      return "+";
    } else {
      return "";
    }
  }

  async sendNotificationEmails(fraudAuditResults) {
    if (this.currentCommunity && this.currentCommunity.CommunityAdmins && this.currentCommunity.CommunityAdmins.length>0) {
      const admins = this.currentCommunity.CommunityAdmins;
      let textsHtml = "";
      for (let t=0;t<fraudAuditResults.length;t++) {
        textsHtml += `${fraudAuditResults[t].collectionType}: ${this.formatNumber(fraudAuditResults[t].count)} items`
        if (fraudAuditResults[t].changeFromLastCount) {
          textsHtml += ` (${this.getNumberSign(fraudAuditResults[t].changeFromLastCount)}${this.formatNumber(fraudAuditResults[t].changeFromLastCount)})`
        }
        textsHtml += `</br>`;
      }

      const content = `
        <div>
          <h1>${i18n.t('notification.email.possibleFraudHeader')}</h1>
          <p>${i18n.t('notification.email.possibleFraudInformation')}</p>
          <h2>${i18n.t('notification.email.possibleFraudSubHeader')}</h2>
          <p>${textsHtml}</p>
          <p>${i18n.t('notification.email.possibleFraudFooter')}</p>
        </div>
      `
      for (let u=0;u<Math.min(admins.length, 5);u++) {
        queue.add('send-one-email', {
          subject: { translateToken: 'notification.email.possibleFraudHeader', contentName: this.currentCommunity.name },
          template: 'general_user_notification',
          user: admins[u],
          domain: this.currentCommunity.Domain,
          community: this.currentCommunity,
          object: fraudAuditResults,
          header: "",
          content: content,
          link: this.getCommunityURL()
        }, 'high');
      }
    } else {
      log.error("No community admins found");
      return;
    }
  }

  getContainerOldCount(collectionType) {
    let foundCollection;

    if (this.currentCommunity.data.lastFraudScanResults) {
      for (let i=0;i<this.currentCommunity.data.lastFraudScanResults.length;i++) {
        if (this.currentCommunity.data.lastFraudScanResults[i].collectionType &&
            this.currentCommunity.data.lastFraudScanResults[i].collectionType===collectionType) {
          foundCollection = this.currentCommunity.data.lastFraudScanResults[i];
          break;
        }
      }
    }

    return foundCollection;
  }

  getWithDifference(results) {
    const newResults = JSON.parse(JSON.stringify(results));

    for (let i=0;i<newResults.length;i++) {
      const oldResults = this.getContainerOldCount(newResults[i].collectionType);

      if (oldResults) {
        newResults[i].changeFromLastCount = newResults[i].count-oldResults.count;
      }

    }

    return newResults;
  }


  async notify() {
    const fraudScanResults = [];

    for (let c=0;c<this.collectionsToScan.length;c++) {
      const collectionLength = this.uniqueCollectionItemsIds[this.collectionsToScan[c]].length;
      if (collectionLength>0) {
        fraudScanResults.push({ collectionType: this.capitalizeFirstLetter(this.collectionsToScan[c]), count: collectionLength});
      }
    }

    if (fraudScanResults.length>0) {
      if (!this.currentCommunity.data ||
          !this.currentCommunity.data.lastFraudScanResults ||
          !deepEqual(this.currentCommunity.data.lastFraudScanResults, fraudScanResults)
      ) {
        await this.sendNotificationEmails(this.getWithDifference(fraudScanResults));

        await this.currentCommunity.reload();

        if (!this.currentCommunity.data) {
          this.currentCommunity.data = {};
        }

        this.currentCommunity.data.lastFraudScanResults = fraudScanResults;
        this.currentCommunity.changed('data', true);
        await this.currentCommunity.save();
      } else {
        log.info("Not resending same numbers");
      }
    }
  }

  async scan() {
    for (let c=0;c<this.collectionsToScan.length;c++) {
      let methodsToScan = ['byIpFingerprint','byMissingBrowserFingerprint','byIpAddress'];

      if (this.collectionsToScan[c]==="pointQualities") {
        methodsToScan = methodsToScan.concat(['byIpFingerprintPointId', 'byIpUserAgentPointId']);
      } else {
        methodsToScan = methodsToScan.concat(['byIpFingerprintPostId', 'byIpUserAgentPostId']);
      }

      for (let m=0;m<methodsToScan.length;m++) {
        let job = await models.AcBackgroundJob.createJobAsync({},{});
        const workPackage = {
          userId: -1,
          communityId: this.currentCommunity.id,
          jobId: job.id,
          collectionType: this.collectionsToScan[c],
          selectedMethod: methodsToScan[m]
        }

        const scanner = new this.scannerModels[c](workPackage);
        await scanner.processAndGetFraudItems();
        job = await job.reload();
        this.setupCounts(job.data.items, this.collectionsToScan[c]);
        await job.destroy();
      }
    }
  }

  async scanAndNotify() {
    return await new Promise(async (resolve, reject) => {
      try {
        const communities = await models.Community.findAll({
          where: {
            "configuration.enableFraudDetection": true
          },
          attributes: ['id','configuration','name','data','hostname'],
          include: [
            {
              model: models.Domain,
              attributes: ['id','name','domain_name']
            },
            {
              model: models.User,
              as: 'CommunityAdmins',
              attributes: ['id','email','name']
            }
          ]
        });

        for (let i=0;i<communities.length;i++) {
          log.info("Processing community: "+communities[i].name);
          this.currentCommunity = communities[i];
          try {
            await this.scan();
            await this.notify();
          } catch (error) {
            log.error("Error processing community: "+communities[i].name);
            log.error(error);
            reject(error)
            return;
          }
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    })
  }
}

i18n
  .use(Backend)
  .init({
    preload: ['en', 'fr', 'sk','bg', 'cs','it','da', 'kl', 'es', 'sv', 'sq','uz','uk', 'ca', 'hr','ro','ru',
      'ro_md','pt_br', 'hu', 'tr', 'is', 'nl','no', 'pl', 'zh_tw','ky'],

    fallbackLng:'en',

    // this is the defaults
    backend: {
      // path where resources get loaded from
      loadPath: localesPath+'/{{lng}}/translation.json',

      // path to post missing resources
      addPath: localesPath+'/{{lng}}/translation.missing.json',

      // jsonIndent to use when storing json files
      jsonIndent: 2
    }
  }, function (err, t) {
    (async () => {
      try {
        const scanner = new FraudScannerNotifier();
        await scanner.scanAndNotify();
        log.info("Fraud Scanning Complete");
        process.exit();
      } catch (error) {
        log.error(error);
        process.exit();
      }
    })();
  }
)

