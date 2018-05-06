import '../../../../@polymer/polymer/polymer.js';

export const ypLanguageBehavior = {

  properties: {
    t: {
      type: Function,
      computed: '_translate(loadedLanguage)'
    },

    language: {
      type: String,
      value: null
    },

    loadedLanguage: {
      type: String,
      value: null
    }
  },

  ready: function () {
    if (window.i18nTranslation) {
      this.set('loadedLanguage', window.locale);
      this.set('language', window.locale);
    }
  },

  _languageEvent: function (event, detail) {
    if (detail.type == 'language-loaded') {
      this.set('loadedLanguage', detail.language);
      this.set('language', detail.language);
      window.locale = detail.language;
    }
  },

  _translate: function (language) {
    return function() {
      var key = arguments[0];
      if (window.i18nTranslation) {
        var translation = window.i18nTranslation.t(key);
        if (translation=='')
          translation = key;
        return translation;
      } else {
        return key;
        //console.warn("Translation system i18n not initialized for "+key);
      }
    };
  },
};
