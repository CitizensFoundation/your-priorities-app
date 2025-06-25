"use strict";
// https://gist.github.com/mojodna/1251812
var log = require('../../utils/logger.cjs');
/**
 * @class EmailWorker
 * @constructor
 */
function EmailWorker() { }
/**
 * Sends a single email.
 * @param {object} emailLocals - Locals for the email template.
 * @param {(error?: any) => void} callback - The callback function.
 * @memberof EmailWorker
 */
EmailWorker.prototype.sendOne = function (emailLocals, callback) {
    var sendOneEmail = require('../engine/notifications/emails_utils.cjs').sendOneEmail;
    sendOneEmail(emailLocals, callback);
};
/** @type {EmailWorker} */
module.exports = new EmailWorker();
