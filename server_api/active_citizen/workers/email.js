// https://gist.github.com/mojodna/1251812

var EmailWorker = function () {};
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var async = require('async');

var templatesDir = path.resolve(__dirname, '..', 'email_templates');

var transport = nodemailer.createTransport({
  service: 'sendgrid',
  auth: {
    user: 'some-user@gmail.com',
    pass: 'some-password'
  }
});

EmailWorker.prototype.sendOne = function (emailLocals, done) {

  emailLocals = {
    subject: i18n.t('email.subject.password_recovery'),
    template: 'password_recovery',
    user: {
      name: 'Gunnar Grimson',
      email: 'gunnar@citizens.is'
    },
    group: {
      name: 'Laugardalur 2015'
    },
    community: {
      name: 'Betri Hverfi',
      admin_email: 'support@yrpri.org',
      admin_name: 'Your Priorities support'
    }
  };

  var template = new EmailTemplate(path.join(templatesDir, local.template));

  template.render(locals, function (err, results) {
    if (err) {
      return console.error(err)
    }

    transport.sendMail({
      from: emailLocals.community.admin_email,
      to: emailLocals.user.email,
      subject: emailLocals.subject,
      html: results.html,
      text: results.text
    }, function (err, responseStatus) {
      if (err) {
        return console.error(err)
      }
      console.log(responseStatus.message)
    })
  });
  done();
};

module.exports = new EmailWorker();
