"use strict";
// https://gist.github.com/mojodna/1251812
var log = require('../utils/logger.cjs');
var EmailWorker = function () { };
EmailWorker.prototype.sendOne = function (emailLocals, callback) {
    var sendOneEmail = require('../engine/notifications/emails_utils.cjs').sendOneEmail;
    sendOneEmail(emailLocals, callback);
};
module.exports = new EmailWorker();
