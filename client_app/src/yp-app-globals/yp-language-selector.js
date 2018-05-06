import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import { IronFormElementBehavior } from '../../../../@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import '../../../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-item/paper-item.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../yp-ajax/yp-ajax.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        padding-top: 8px;
      }

      paper-dropdown-menu {
        max-width: 250px;
      }

      .translateButton {
        padding: 8px;
        color: var(--accent-color);
        margin-top: 8px;
      }

      .stopTranslateButton {
        padding: 8px;
        color: white;
        background: var(--accent-color);
        margin-top: 8px;
      }

      .translateText {
        margin-left: 8px;
      }

      .stopIcon {
        margin-left: 8px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-auto-translate="_autoTranslateEvent"></lite-signal>

    <div class="layout vertical">
      <paper-dropdown-menu label="Select language" selected="{{selectedLocale}}" attr-for-selected="name">
        <paper-listbox slot="dropdown-content" selected="{{selectedLocale}}" attr-for-selected="name">
          <template is="dom-repeat" items="[[languages]]">
            <paper-item name="[[item.language]]">[[item.name]]</paper-item>
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <div hidden\$="[[!canUseAutoTranslate]]">
        <paper-button hidden\$="[[autoTranslate]]" raised="" class="layout horizontal translateButton" on-tap="_startTranslation" title="{{t('autoTranslate')}}">
          <iron-icon icon="translate"></iron-icon>
          <div class="translateText">{{t('autoTranslate')}}</div>
        </paper-button>
        <paper-button hidden\$="[[!autoTranslate]]" raised="" class="layout horizontal stopTranslateButton" on-tap="_stopTranslation" title="{{t('stopAutoTranslate')}}">
          <iron-icon icon="translate"></iron-icon>
          <iron-icon class="stopIcon" icon="do-not-disturb"></iron-icon>
        </paper-button>
      </div>
    </div>

    <yp-ajax id="hasAutoTranslationAjax" url="/api/users/has/AutoTranslation" on-response="_hasAutoTranslationResponse"></yp-ajax>
`,

  is: 'yp-language-selector',

  behaviors: [
    ypLanguageBehavior,
    IronFormElementBehavior
  ],

  properties: {
    supportedLanguages: {
      type: Object,
      value: {
        en: 'English',
        fr: 'Français',
        is: 'Íslenska',
        da: 'Danish',
        kl: 'Greenlandic',
        pl: 'Polish',
        nl: 'Dutch',
        no: 'Norwegian',
        pt_BR: 'Portuguese (Brazil)',
        hu: 'Hungarian',
        zh_TW: 'Chinese (TW)',
        sr: 'Serbian',
        sr_latin: 'Serbian (latin)',
        hr: 'Croatian',
        sl: 'Slovenian',
        pt: 'Portuguese'
      }
    },

    noGoogleTranslateLanguages: {
      type: Array,
      value: ['kl','sr_latin']
    },

    languages: {
      type: Array,
      computed: '_languages(supportedLanguages)'
    },

    selectedLocale: {
      type: String,
      observer: '_selectedLocaleChanged'
    },

    noUserEvents: {
      type: Boolean,
      value: false
    },

    value: {
      type: String,
      value: ""
    },

    canUseAutoTranslate: {
      type: Boolean,
      computed: '_canUseAutoTranslate(language, hasServerAutoTranslation)'
    },

    autoTranslate: {
      type: Boolean,
      value: false
    },

    hasServerAutoTranslation: {
      type: Boolean,
      value: false
    }
  },

  observers: [
    '_langChangedLocally(language)',
  ],

  ready: function () {
    if (!this.noUserEvents) {
      this.$.hasAutoTranslationAjax.generateRequest();
    }
  },

  _langChangedLocally: function () {
    this.set('selectedLocale', this.language);
  },

  _autoTranslateEvent: function (event, detail) {
    this.set('autoTranslate', detail);
  },

  _stopTranslation: function () {
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-auto-translate', data: false }
      })
    );
    window.autoTranslate = false;
    this.fire('yp-language-name', this.supportedLanguages[this.language]);
    dom(document).querySelector('yp-app').getDialogAsync("masterToast", function (toast) {
      toast.text = this.t('autoTranslationStopped');
      toast.show();
    }.bind(this));
    window.appGlobals.activity('click', 'stopTranslation', this.language);
  },

  _startTranslation: function () {
    if (this._canUseAutoTranslate(this.language, this.hasServerAutoTranslation)) {
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'yp-auto-translate', data: true }
        })
      );
      window.autoTranslate = true;
      this.fire('yp-language-name', this.supportedLanguages[this.language]);
      dom(document).querySelector('yp-app').getDialogAsync("masterToast", function (toast) {
        toast.text = this.t('autoTranslationStarted');
        toast.show();
      }.bind(this));
    }
    window.appGlobals.activity('click', 'startTranslation', this.language);
  },

  _canUseAutoTranslate: function (language, hasServerAutoTranslation) {
    if (language && hasServerAutoTranslation && !this.noUserEvents) {
      var found = this.noGoogleTranslateLanguages.indexOf(language) > -1;
      return !found;
    } else {
      return false;
    }
  },

  _hasAutoTranslationResponse: function (event, detail) {
    if (detail.response && detail.response.hasAutoTranslation===true) {
      this.set('hasServerAutoTranslation', true);
    } else {
      this.set('hasServerAutoTranslation', false);
    }
  },

  _languages: function (supportedLanguages) {
    if (supportedLanguages) {
      var arr = [];
      for (var key in supportedLanguages) {
        if (supportedLanguages.hasOwnProperty(key)) {
          arr.push({ language: key, name: supportedLanguages[key] });
        }
      }
      return arr;
    } else {
      return [];
    }
  },

  _selectedLocaleChanged: function (locale, oldLocale) {
    if (locale) {
      this.set('value', locale);
      if (!this.noUserEvents) {
        if (!this._canUseAutoTranslate(locale, this.hasServerAutoTranslation) && this.autoTranslate) {
          this._stopTranslation();
        }
        this.fire('yp-language-name', this.supportedLanguages[locale]);
        window.appGlobals.changeLocaleIfNeeded(locale, true);
        localStorage.setItem('yp-user-locale', locale);
        if (window.appUser && window.appUser.user) {
          window.appUser.setLocale(locale);
        }
        window.appGlobals.activity('click', 'changeLanguage', locale);
      }
    }
  }
});
