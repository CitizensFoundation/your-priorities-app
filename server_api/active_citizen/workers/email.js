// https://gist.github.com/mojodna/1251812

var EmailWorker = function () {};

var log = require('../utils/logger');
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');
var ejs = require('ejs');
var i18n = require('../utils/i18n');
var toJson = require('../utils/to_json');

var templatesDir = path.resolve(__dirname, '..', 'email_templates', 'notifications');

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
  try {
    var template = new EmailTemplate(path.join(templatesDir, emailLocals.template));

    emailLocals['t'] = i18nFilter;

    if (!emailLocals['community']) {
      emailLocals['community'] = { hostname: 'www' }
    }

    template.render(emailLocals, function (error, results) {
      if (error) {
        log.errors('EmailWorker', { err: error, user: emailLocals.user });
        done();
      } else {
        if (process.env.SENDGRID_USERNAME && (emailLocals.user.email=='robert@citizens.is' || emailLocals.user.email=='gunnar@citizens.is')) {
          transport.sendMail({
            from: emailLocals.community.admin_email,
            to: emailLocals.user.email,
            bcc: 'robert@ibuar.is',
            subject: emailLocals.subject,
            html: results.html,
            text: results.text
          }, function (error, responseStatus) {
            if (error) {
              log.error('EmailWorker', { err: error, user: emailLocals.user });
              done(error);
            } else {
              log.info('EmailWorker Completed', { responseStatusMessage: responseStatus.message, user: emailLocals.user });
              done();
            }
          })
        } else {
          log.warn('EmailWorker no SMTP server', { emailLocals: emailLocals, resultsHtml: results.html , resultsText: results.text });
          done();
        }
      }
    });
  } catch (err) {
    log.error("Processing Email Error", {err: err});
    done();
  }
};

module.exports = new EmailWorker();
