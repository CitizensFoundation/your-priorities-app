import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-app-globals/yp-language-selector.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      paper-dialog {
        background-color: #FFF;
        max-width: 400px;
      }

      iron-icon {
        color: var(--accent-color);
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }

      .infoText {
        font-size: 18px;
        margin-bottom: 8px;
      }
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <yp-language-selector hidden="" id="languageSelector"></yp-language-selector>

    <paper-dialog id="dialog">
      <div class="layout vertical center-center">
        <div><iron-icon icon="translate"></iron-icon></div>
        <div class="infoText">[[t('shouldAutoTranslateInfo')]]</div>
      </div>
      <div class="buttons">
        <paper-button on-tap="_dontAskAgain" dialog-dismiss="">[[t('never')]]</paper-button>
        <paper-button dialog-dismiss="" on-tap="_no">[[t('no')]]</paper-button>
        <paper-button dialog-confirm="" on-tap="_startAutoTranslate">[[t('yes')]]</paper-button>
        <paper-button dialog-confirm="" on-tap="_startAutoTranslateAndDoSoAlways">[[t('always')]]</paper-button>
      </div>
    </paper-dialog>
`,

  is: 'yp-autotranslate-dialog',

  behaviors: [
    ypLanguageBehavior
  ],

  _no: function () {
    sessionStorage.setItem("dontPromptForAutoTranslation", true);
  },

  _dontAskAgain: function () {
    localStorage.setItem("dontPromptForAutoTranslation", true);
  },

  _startAutoTranslateAndDoSoAlways: function () {
    this._startAutoTranslate();
    localStorage.setItem("alwaysStartAutoTranslation", true);
  },

  _startAutoTranslate: function () {
    this.$.languageSelector._startTranslation();
  },

  openLaterIfAutoTranslationEnabled: function () {
    this.async(function () {
      if (this.$.dialog.opened===false) {
        if (this.$.languageSelector.canUseAutoTranslate === true &&
          window.autoTranslate !== true) {
          if (localStorage.getItem("alwaysStartAutoTranslation")!=null) {
            this._startAutoTranslate();
          } else {
            this.$.dialog.open();
          }
        }
      }
    }, 750);
  }
});
