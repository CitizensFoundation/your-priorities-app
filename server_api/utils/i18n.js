var i18n = require('i18next');
var Backend = require('i18next-node-fs-backend');

i18n
  .use(Backend)
  .init({
    // this is the defaults
    backend: {
      // path where resources get loaded from
      loadPath: '../locales/{{lng}}/translation.json',

      // path to post missing resources
      addPath: '../locales/{{lng}}/translation.missing.json',

      // jsonIndent to use when storing json files
      jsonIndent: 2
    }
  });

module.exports = i18n;
