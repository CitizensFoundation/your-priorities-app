// https://gist.github.com/mojodna/1251812
var log = require('../utils/logger');
var EmailWorker = function () {};
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');
var ejs = require('ejs');
var i18n = require('../utils/i18n');

var templatesDir = path.resolve(__dirname, '..', 'email_templates');

ejs.filters.t = function(text) {
  return i18n.t(text);
};

var transport = nodemailer.createTransport({
  service: 'sendgrid',
  auth: {
    user: 'some-user@gmail.com',
    pass: 'some-password'
  }
});

EmailWorker.prototype.sendOne = function (emailLocals, done) {

  var template = new EmailTemplate(path.join(templatesDir, emailLocals.template));

  template.render(emailLocals, function (err, results) {
    if (err) {
      return log.error('EmailWorker', { err: err });
    }
    transport.sendMail({
      from: emailLocals.community.admin_email,
      to: emailLocals.user.email,
      subject: emailLocals.subject,
      html: results.html,
      text: results.text
    }, function (err, responseStatus) {
      if (err) {
        return log.error('EmailWorker', { err: err });
      }
      log.info('EmailWorker Completed', { responseStatusMessage: responseStatus.message });
    })
  });
  done();
};

module.exports = new EmailWorker();
