var i18n = require('../utils/i18n.cjs');
var Backend = require('i18next-fs-backend');
var log = require('../utils/logger.cjs');
var path = require('path');
var activity = require('./activity.cjs');
var notification_delivery = require('./notification_delivery.cjs');
var notification_news_feed = require('./notification_news_feed.cjs');
var bulk_status_update = require('./bulk_status_update.cjs');
var deletions = require('./deletions.cjs');
var delayedJobs = require('./delayed_jobs.cjs');
var anonymizations = require('./anonymizations.cjs');
var moderation = require('./moderation.cjs');
var email = require('./email.cjs');
var queue = require('./queue.cjs');
var speechToText = require('./speech_to_text.cjs');
const similarities = require('./similarities.cjs');
const reports = require('./reports.cjs');
const marketing = require('./marketing.cjs');
const fraudManagement = require('./fraud_management.cjs');

log.info("Dirname", {dirname: __dirname});

var localesPath = path.resolve(__dirname, '../locales');

i18n
  .use(Backend)
  .init({
    preload: ['en', 'fr', 'mk', 'cy', 'sk','bg', 'cs','it','da', 'kl', 'th', 'es', 'cnr', 'lv', 'et', 'el', 'sv', 'sq','uz','uk', 'ca', 'hr','ro','ru',
              'ro_md','pt_br', 'hu', 'tr', 'is', 'nl','no', 'pl', 'zh_tw','ky'],

    fallbackLng:'en',
    lowerCaseLng: true,

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
    log.info("Have Loaded i18n", {err: err});

    queue.process('send-one-email', 20, function(job, done) {
      email.sendOne(job.data, done);
    });

    queue.process('process-notification-delivery', 25, function(job, done) {
      notification_delivery.process(job.data, done);
    });

    queue.process('process-activity', 10, function(job, done) {
      activity.process(job.data, done);
    });

    queue.process('delayed-job', 15, function(job, done) {
      delayedJobs.process(job.data, done);
    });

    queue.process('process-notification-news-feed', 10, function(job, done) {
      notification_news_feed.process(job.data, done);
    });

    queue.process('process-bulk-status-update', 1, function(job, done) {
      bulk_status_update.process(job.data, done);
    });

    queue.process('process-deletion', 5, function(job, done) {
      deletions.process(job.data, done);
    });

    queue.process('process-anonymization', 5, function(job, done) {
      anonymizations.process(job.data, done);
    });

    queue.process('process-voice-to-text', 1, function(job, done) {
      speechToText.process(job.data, done);
    });

    queue.process('process-moderation', 1, function(job, done) {
      moderation.process(job.data, done);
    });

    queue.process('process-similarities', 1, function(job, done) {
      similarities.process(job.data, done);
    });

    queue.process('process-fraud-action', 2, function(job, done) {
      fraudManagement.process(job.data, done);
    });

    queue.process('process-reports', 1, function(job, done) {
      reports.process(job.data, done);
    });

    queue.process('process-marketing', 20, function(job, done) {
      marketing.process(job.data, done);
    });

    import(
      "./generativeAi.js"
    ).then(({GenerativeAiWorker}) => {
      const generativeAi = new GenerativeAiWorker();
      queue.process('process-generative-ai', 1, function(job, done) {
        generativeAi.process(job.data, done);
      });
    });
  });

