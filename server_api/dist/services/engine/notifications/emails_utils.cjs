"use strict";
var DEBUG_EMAILS_TO_TEMP_FIlE = false;
var log = require("../../../utils/logger.cjs");
var async = require("async");
var path = require("path");
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var i18n = require("../../utils/i18n.cjs");
var airbrake = null;
const redisConnection = require("../../utils/redisConnection.cjs");
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require("../../utils/airbrake.cjs");
}
var fs = require("fs");
var templatesDir = path.resolve(__dirname, "..", "..", "email_templates", "notifications");
var queue = require("../../workers/queue.cjs");
var models = require("../../../models/index.cjs");
var i18nFilter = function (text) {
    return i18n.t(text);
};
var transport = null;
if (process.env.SENDGRID_API_KEY) {
    transport = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false, // false for STARTTLS; use 465 for SSL if preferred
        auth: {
            user: "apikey", // This literal string "apikey" is required
            pass: process.env.SENDGRID_API_KEY
        }
    });
}
else if (process.env.GMAIL_ADDRESS &&
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_PRIVATE_KEY) {
    transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: process.env.GMAIL_ADDRESS,
            serviceClient: process.env.GMAIL_CLIENT_ID,
            privateKey: process.env.GMAIL_PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
    });
    transport.verify(function (error, success) {
        if (error) {
            log.error(error);
        }
        else {
            log.info("Server is ready to take our messages");
        }
    });
}
else if (process.env.SMTP_SERVER) {
    var smtpConfig = {
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: false, // upgrade later with STARTTLS
        auth: process.env.SMTP_USERNAME
            ? {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            }
            : null,
        tls: {
            rejectUnauthorized: !process.env.SMTP_ACCEPT_INVALID_CERT,
        },
    };
    transport = nodemailer.createTransport(smtpConfig);
    transport.verify(function (error, success) {
        if (error) {
            log.error(error);
        }
        else {
            log.info("Server is ready to take our messages");
        }
    });
}
const renderTemplateWithLocals = (templatePath, locals, done) => {
    let html;
    let text;
    async.parallel([
        (callback) => {
            ejs.renderFile(path.join(templatePath, "html.ejs"), locals, {}, (err, rendered) => {
                if (err) {
                    callback(err);
                }
                else {
                    html = rendered;
                    callback();
                }
            });
        },
        (callback) => {
            ejs.renderFile(path.join(templatePath, "text.ejs"), locals, {}, (err, rendered) => {
                if (err) {
                    callback(err);
                }
                else {
                    text = rendered;
                    callback();
                }
            });
        }
    ], (error) => {
        done(error, { html, text });
    });
};
const renderTemplatePart = (templatePath, locals, part, done) => {
    var fileName = part === "html" ? "html.ejs" : "text.ejs";
    ejs.renderFile(path.join(templatePath, fileName), locals, {}, (err, rendered) => {
        if (err) {
            done(err);
        }
        else {
            done(null, rendered);
        }
    });
};
const translateSubject = function (subjectHash) {
    if (typeof subjectHash === 'string') {
        return i18n.t(subjectHash);
    }
    var subject = i18n.t(subjectHash.translateToken);
    if (subjectHash.contentName) {
        subject += ": " + subjectHash.contentName;
    }
    return subject;
};
var linkTo = function (url) {
    return '<a href="' + url + '">' + url + "</a>";
};
const LIMIT_EMAILS_FOR_SECONDS = 60 * 60;
const SUPPRESSION_KEYBASE = "uelim_V1_";
const processNotification = (notification, user, template, subject, callback) => {
    var method = user.notifications_settings[notification.from_notification_setting].method;
    var frequency = user.notifications_settings[notification.from_notification_setting]
        .frequency;
    if (user.email) {
        if (method !== models.AcNotification.METHOD_MUTED) {
            if (frequency === models.AcNotification.FREQUENCY_AS_IT_HAPPENS) {
                if ((user.email && user.email.indexOf("_anonymous@citizens.is") > -1) ||
                    !(user.email.indexOf("@") > -1)) {
                    log.info("Email for anonymous or invalid not queued", {
                        email: user.email,
                    });
                    callback();
                }
                else if (notification.AcActivities[0].Point &&
                    notification.AcActivities[0].Point.Group &&
                    notification.AcActivities[0].Point.Group.name ===
                        "hidden_public_group_for_domain_level_points") {
                    log.info("Email for hidden_public_group_for_domain_level_points not queued", { email: user.email });
                    callback();
                }
                else {
                    log.info("Email queued", {
                        email: user.email,
                        method: method,
                        frequency: frequency,
                    });
                    queue.add("send-one-email", {
                        subject: subject,
                        template: template,
                        user: user,
                        domain: notification.AcActivities[0].Domain,
                        group: notification.AcActivities[0].Point &&
                            notification.AcActivities[0].Point.Group
                            ? notification.AcActivities[0].Point.Group
                            : notification.AcActivities[0].Group,
                        community: notification.AcActivities[0].Community,
                        activity: notification.AcActivities[0],
                        post: notification.AcActivities[0].Post,
                        point: notification.AcActivities[0].Point,
                    }, "medium");
                    const redisKey = `${SUPPRESSION_KEYBASE}${user.id}`;
                    redisConnection.setEx(redisKey, LIMIT_EMAILS_FOR_SECONDS, JSON.stringify({}));
                    callback();
                }
            }
            else if (method !== models.AcNotification.METHOD_MUTED) {
                callback();
                // Disabled for now
                /*models.AcDelayedNotification.findOrCreate({
                  where: {
                    user_id: user.id,
                    method: method,
                    frequency: frequency
                  },
                  defaults: {
                    user_id: user.id,
                    method: method,
                    frequency: frequency,
                    type: notification.from_notification_setting
                  }
                }).then( results => {
                  const [ delayedNotification, created ] = results;
                  if (created) {
                    log.info('AcDelayedNotification', { delayedNotificationId: delayedNotification ? delayedNotification.id : -1, context: 'create' });
                  } else {
                    log.info('AcDelayedNotification', { delayedNotificationId: delayedNotification ? delayedNotification.id : -1, context: 'loaded' });
                  }
                  delayedNotification.addAcNotifications(notification).then(function (results) {
                    if (delayedNotification.delivered) {
                      log.info('Notification Email Processing AcDelayedNotification already delivered resetting');
                      delayedNotification.delivered = false;
                      delayedNotification.save().then(function (results) {
                        callback();
                      });
                    } else {
                      callback();
                    }
                  });
                }).catch(function (error) {
                  callback(error);
                });*/
            }
        }
        else {
            callback();
        }
    }
    else {
        log.warn("Can't find email for user");
        callback();
    }
};
const filterNotificationForDelivery = function (notification, user, template, subject, callback) {
    //log.info("Notification Email Processing", {email: user.email, notification_settings_type: notification.notification_setting_type,
    //                                              method: method, frequency: frequency});
    if (template === "point_activity") {
        const group = notification.AcActivities[0].Point &&
            notification.AcActivities[0].Point.Group
            ? notification.AcActivities[0].Point.Group
            : notification.AcActivities[0].Group;
        if (group) {
            group.hasGroupAdmins(user).then((result) => {
                if (result) {
                    processNotification(notification, user, template, subject, callback);
                }
                else {
                    const redisKey = `${SUPPRESSION_KEYBASE}${user.id}`;
                    redisConnection.get(redisKey, (error, found) => {
                        if (found) {
                            log.info(`Suppressing emails for user ${user.email} settings ${LIMIT_EMAILS_FOR_SECONDS}`);
                            callback();
                        }
                        else {
                            processNotification(notification, user, template, subject, callback);
                        }
                    });
                }
            });
        }
        else {
            log.error("Can't find group for filterNotificationForDelivery");
            callback();
        }
    }
    else {
        processNotification(notification, user, template, subject, callback);
    }
};
var sendOneEmail = function (emailLocals, callback) {
    if (emailLocals &&
        emailLocals.user &&
        emailLocals.user.email &&
        emailLocals.user.email.indexOf("@") > 0) {
        let fromEmail = null;
        let sender = null;
        let replyTo = null;
        let envValues = null;
        if (process.env.EMAIL_CONFIG_FROM_ADDRESS &&
            process.env.EMAIL_CONFIG_FROM_NAME &&
            process.env.EMAIL_CONFIG_URL) {
            envValues = {
                emailName: process.env.EMAIL_CONFIG_FROM_NAME,
                email: process.env.EMAIL_CONFIG_FROM_ADDRESS,
                url: process.env.EMAIL_CONFIG_URL,
                banner_image: process.env.EMAIL_CONFIG_340_X_74_BANNER_IMAGE_URL,
            };
        }
        emailLocals.envValues = envValues;
        if (!emailLocals.isReportingContent)
            emailLocals.isReportingContent = false;
        if (!emailLocals.isAutomated)
            emailLocals.isAutomated = false;
        if (!emailLocals.isAutomatedVision)
            emailLocals.isAutomatedVision = false;
        if (emailLocals.user && emailLocals.user.email) {
            async.series([
                function (seriesCallback) {
                    if (emailLocals.domain && emailLocals.domain.domain_name) {
                        seriesCallback();
                    }
                    else {
                        log.error("EmailWorker Can't find domain for email", {
                            emailLocals: emailLocals,
                        });
                        seriesCallback("Can't find domain for email");
                    }
                },
                function (seriesCallback) {
                    if (emailLocals.user && emailLocals.user.email) {
                        seriesCallback();
                    }
                    else {
                        log.warn("EmailWorker Can't find email for users", {
                            emailLocals: emailLocals,
                        });
                        seriesCallback();
                    }
                },
                function (seriesCallback) {
                    emailLocals["t"] = i18nFilter;
                    emailLocals["linkTo"] = linkTo;
                    emailLocals["simpleFormat"] = function (text) {
                        if (text) {
                            return text.replace(/(\n)/g, "<br>");
                        }
                        else {
                            return "";
                        }
                    };
                    if (!emailLocals["community"]) {
                        emailLocals["community"] = {
                            hostname: process.env.DEFAULT_HOSTNAME
                                ? process.env.DEFAULT_HOSTNAME
                                : "app",
                        };
                    }
                    if (emailLocals.domain.domain_name.indexOf("betrireykjavik.is") > -1) {
                        fromEmail = "Betri Reykjavík <betrireykjavik@ibuar.is>";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("betraisland.is") > -1) {
                        fromEmail = "Betra Ísland <betraisland@ibuar.is>";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("forbrukerradet.no") > -1) {
                        fromEmail =
                            "Mine idéer Forbrukerrådet <mineideer@forbrukerradet.no>";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("multicitychallenge.org") >
                        -1) {
                        fromEmail = "Admins GovLab <admins@thegovlab.org>";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("mycitychallenge.org") > -1) {
                        fromEmail = "Admins GovLab <admins@thegovlab.org>";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("engagebritain.org") > -1) {
                        fromEmail = "Engage Britain <healthandcare@engagebritain.org>";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("tarsalgo.net") > -1) {
                        fromEmail = "Társalgó <tarsalgo@kofe.hu>";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("junges.wien") > -1) {
                        fromEmail = "Junges Wien <junges.wien@wienxtra.at>";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("openmontana.org") > -1) {
                        fromEmail = "Open Montana <openmontana@democracylab.org>";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("e-dem.nl") > -1) {
                        fromEmail = "admin@yrpr.e-dem.nl";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("engage-southampton.ac.uk") > -1) {
                        fromEmail = "SCCA Online Platform <scca@engage-southampton.ac.uk>";
                        emailLocals["community"] = {
                            hostname: "scca-online",
                        };
                    }
                    else if (emailLocals.domain.domain_name.indexOf("boliden.com") > -1) {
                        fromEmail = "Boliden Sidtjarn <sidtjarn@boliden.com>";
                        emailLocals["community"] = {
                            hostname: "sidtjarn",
                        };
                    }
                    else if (emailLocals.domain.domain_name.indexOf("parliament.scot") > -1) {
                        fromEmail =
                            "Engage Scottish Parliament <engage@engage.parliament.scot>";
                        sender = "engage@engage.parliament.scot";
                        replyTo = "engage@parliament.scot";
                        emailLocals["community"] = {
                            hostname: "engage",
                        };
                    }
                    else if (emailLocals.domain.domain_name.indexOf("puttingcommunitiesfirst.org.uk") > -1) {
                        fromEmail =
                            "The National Lottery Community Fund <share@tnlcommunityfund.org.uk>";
                        sender = "share@tnlcommunityfund.org.uk";
                        replyTo = "share@tnlcommunityfund.org.uk";
                        emailLocals["community"] = {
                            hostname: "discuss",
                        };
                    }
                    else if (emailLocals.domain.domain_name.indexOf("idea-synergy.com") > -1) {
                        fromEmail = "ideasynergy@idea-synergy.com";
                    }
                    else if (emailLocals.domain.domain_name.indexOf("smarter.nj.gov") > -1) {
                        fromEmail = "SmarterNJ <support@notifications.smarter.nj.gov>";
                        sender = "support@notifications.smarter.nj.gov";
                        replyTo = "support@smarter.nj.gov";
                    }
                    else if (process.env.EMAIL_FROM ||
                        (emailLocals.envValues)) {
                        fromEmail = process.env.EMAIL_FROM || emailLocals.envValues.email;
                    }
                    else {
                        fromEmail = "Your Priorities <admin@yrpri.org>";
                    }
                    emailLocals.headerImageUrl = "";
                    seriesCallback();
                },
                function (seriesCallback) {
                    var locale;
                    if (emailLocals.post &&
                        emailLocals.point &&
                        !emailLocals.point.Post) {
                        emailLocals.point.Post = emailLocals.post;
                    }
                    if (emailLocals.user.default_locale &&
                        emailLocals.user.default_locale != "") {
                        locale = emailLocals.user.default_locale;
                    }
                    else if (emailLocals.community &&
                        emailLocals.community.default_locale &&
                        emailLocals.community.default_locale != "") {
                        locale = emailLocals.community.default_locale;
                    }
                    else if (emailLocals.domain &&
                        emailLocals.domain.default_locale &&
                        emailLocals.domain.default_locale != "") {
                        locale = emailLocals.domain.default_locale;
                    }
                    else {
                        locale = "en";
                    }
                    if (locale && typeof locale === 'string') {
                        locale = locale.toLowerCase();
                    }
                    i18n.changeLanguage(locale, function (err, t) {
                        seriesCallback(err);
                    });
                },
                function (seriesCallback) {
                    log.info("EmailWorker Started Sending", { locale: i18n.language });
                    var hasRenderedHtml = emailLocals && typeof emailLocals.renderedHtml === "string";
                    var hasRenderedText = emailLocals && typeof emailLocals.renderedText === "string";
                    var usePreRendered = hasRenderedHtml || hasRenderedText;
                    var renderOrUse = function (done) {
                        if (!usePreRendered) {
                            return renderTemplateWithLocals(path.join(templatesDir, emailLocals.template), emailLocals, done);
                        }
                        var templatePath = emailLocals && emailLocals.template
                            ? path.join(templatesDir, emailLocals.template)
                            : null;
                        if ((hasRenderedHtml && hasRenderedText) || !templatePath) {
                            return done(null, {
                                html: hasRenderedHtml ? emailLocals.renderedHtml : undefined,
                                text: hasRenderedText ? emailLocals.renderedText : undefined,
                            });
                        }
                        if (hasRenderedHtml && !hasRenderedText) {
                            return renderTemplatePart(templatePath, emailLocals, "text", function (error, renderedText) {
                                if (error) {
                                    return done(error);
                                }
                                return done(null, {
                                    html: emailLocals.renderedHtml,
                                    text: renderedText,
                                });
                            });
                        }
                        return renderTemplatePart(templatePath, emailLocals, "html", function (error, renderedHtml) {
                            if (error) {
                                return done(error);
                            }
                            return done(null, {
                                html: renderedHtml,
                                text: emailLocals.renderedText,
                            });
                        });
                    };
                    renderOrUse((error, results) => {
                        if (error) {
                            log.error("EmailWorker Error", {
                                err: error,
                                userId: emailLocals.user.id,
                            });
                            seriesCallback(error);
                        }
                        else {
                            var translatedSubject = translateSubject(emailLocals.subject);
                            if (transport) {
                                if (emailLocals.user.email &&
                                    emailLocals.user.email.indexOf("_anonymous@citizens.is") >
                                        -1) {
                                    log.info("Not sending email for anonymous user", {
                                        email: emailLocals.user.email,
                                    });
                                    seriesCallback();
                                }
                                else {
                                    let bcc = process.env.ADMIN_EMAIL_BCC
                                        ? process.env.ADMIN_EMAIL_BCC
                                        : null;
                                    if (bcc === emailLocals.user.email) {
                                        bcc = null;
                                    }
                                    var mailOptions = {
                                        from: fromEmail,
                                        sender: sender,
                                        replyTo: replyTo,
                                        to: emailLocals.user.email,
                                        bcc: bcc,
                                        subject: translatedSubject,
                                    };
                                    if (typeof results.html === "string") {
                                        mailOptions.html = results.html;
                                    }
                                    if (typeof results.text === "string") {
                                        mailOptions.text = results.text;
                                    }
                                    transport.sendMail(mailOptions, function (error, responseStatus) {
                                        if (error) {
                                            log.error("EmailWorker", {
                                                errorHeaders: error.response
                                                    ? error.response.headers
                                                    : null,
                                                errorBody: error.response
                                                    ? error.response.body
                                                    : null,
                                                errorBodyString: error.response && error.response.body
                                                    ? JSON.stringify(error.response.body)
                                                    : null,
                                                err: error,
                                                user: emailLocals.user,
                                                fromEmail: fromEmail,
                                                sender: sender,
                                                replyTo: replyTo,
                                            });
                                            seriesCallback(error);
                                        }
                                        else {
                                            log.info("EmailWorker Completed", {
                                                responseStatusMessage: responseStatus.message,
                                                email: emailLocals.user.email,
                                                userId: emailLocals.user.id,
                                            });
                                            seriesCallback();
                                        }
                                    });
                                }
                            }
                            else {
                                log.warn("EmailWorker no email configured.", {
                                    subject: translatedSubject,
                                    userId: emailLocals.user.id,
                                });
                                //log.warn('EmailWorker no email configured.', { subject: translatedSubject, userId: emailLocals.user.id, resultsHtml: results.html , resultsText: results.text });
                                if (DEBUG_EMAILS_TO_TEMP_FIlE) {
                                    var fileName = "/tmp/testHtml_" +
                                        parseInt(Math.random() * (423432432432 - 1232) + 1232) +
                                        ".html";
                                    fs.unlink(fileName, function (err) {
                                        fs.writeFile(fileName, typeof results.html === "string" ? results.html : "", function (err) {
                                            if (err) {
                                                log.error(err);
                                            }
                                            seriesCallback();
                                        });
                                    });
                                }
                                else {
                                    seriesCallback();
                                }
                            }
                        }
                    });
                },
            ], function (error) {
                if (error) {
                    log.error("EmailWorker Error", { err: error });
                    if (airbrake) {
                        airbrake.notify(error).then((airbrakeErr) => {
                            if (airbrakeErr.error) {
                                log.error("AirBrake Error", {
                                    context: "airbrake",
                                    err: airbrakeErr.error,
                                    errorStatus: 500,
                                });
                            }
                            callback(error);
                        });
                    }
                    else {
                        callback(error);
                    }
                }
                else {
                    callback();
                }
            });
        }
        else {
            log.warn("EmailWorker Can't find email for user", {
                email: emailLocals.user ? emailLocals.user.email : "?",
            });
            callback();
        }
    }
    else {
        log.error("EmailWorker Email in wrong format no @ sign", {
            email: emailLocals && emailLocals.user ? emailLocals.user.email : "?",
        });
        callback();
    }
};
module.exports = {
    filterNotificationForDelivery: filterNotificationForDelivery,
    sendOneEmail: sendOneEmail,
};
