// https://gist.github.com/mojodna/1251812
var log = require('../utils/logger');
var EmailWorker = function () {};
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');
var ejs = require('ejs');
var i18n = require('../utils/i18n');

var templatesDir = path.resolve(__dirname, '..', 'email_templates');

var i18nFilter = function(text) {
  return i18n.t(text);
};

var transport = nodemailer.createTransport({
  service: 'sendgrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

EmailWorker.prototype.sendOne = function (emailLocals, done) {

  var template = new EmailTemplate(path.join(templatesDir, emailLocals.template));

  emailLocals['t'] = i18nFilter;

  template.render(emailLocals, function (err, results) {
    if (err) {
      return log.error('EmailWorker', { err: err, user: emailLocals.user });
    }
    transport.sendMail({
      from: emailLocals.community.admin_email,
      to: emailLocals.user.email,
      subject: emailLocals.subject,
      html: results.html,
      text: results.text
    }, function (err, responseStatus) {
      if (err) {
        return log.error('EmailWorker', { err: err, user: emailLocals.user });
      }
      log.info('EmailWorker Completed', { responseStatusMessage: responseStatus.message, user: emailLocals.user });
    })
  });
  done();
};

module.exports = new EmailWorker();
