const async = require("async");
const models = require("../../models/index.cjs");
const log = require('../utils/logger.cjs');
const queue = require('./queue.cjs');
const i18n = require('../utils/i18n.cjs');
const toJson = require('../utils/to_json.cjs');
const _ = require('lodash');
const fs = require('fs');
const createDocxReport = require('../engine/reports/docx_group_report.cjs').createDocxReport;
const createXlsReport = require('../engine/reports/xls_group_report.cjs').createXlsReport;
const createXlsCommunityUsersReport = require('../engine/reports/xls_community_users_report.cjs').createXlsCommunityUsersReport;
const createFraudAuditReport = require('../engine/moderation/fraud/CreateFraudAuditReport.cjs').createFraudAuditReport;

let airbrake = null;
if(process.env.AIRBRAKE_PROJECT_ID) {
  airbrake = require('../utils/airbrake.cjs');
}

let ReportsWorker = function () {};

import(
  "../engine/reports/xlsAllOurIdeasExport.js"
).then(({exportChoiceVotes}) => {

  ReportsWorker.prototype.process = (workPackage, callback) => {
    switch (workPackage.type) {
      case 'start-docx-report-generation':
        createDocxReport(workPackage, callback);
        break;
      case 'start-xls-report-generation':
        createXlsReport(workPackage, callback);
        break;
      case 'start-aoi-xls-report-generation':
        exportChoiceVotes(workPackage, callback);
        break;
      case 'start-xls-users-community-report-generation':
        createXlsCommunityUsersReport(workPackage, callback);
        break;
      case 'start-fraud-audit-report-generation':
        createFraudAuditReport(workPackage, callback);
        break;
      default:
        callback("Unknown type for workPackage: " + workPackage.type);
    }
  };
});


module.exports = new ReportsWorker();
