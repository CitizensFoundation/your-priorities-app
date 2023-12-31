"use strict";
// https://gist.github.com/mojodna/1251812
var log = require('../utils/logger');
var EmailWorker = function () { };
EmailWorker.prototype.sendOne = function (emailLocals, callback) {
    var sendOneEmail = require('../engine/notifications/emails_utils').sendOneEmail;
    sendOneEmail(emailLocals, callback);
};
module.exports = new EmailWorker();
