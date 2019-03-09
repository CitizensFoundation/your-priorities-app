import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      #dialog {
        background-color: #FFF;
        max-width: 50%;
      }

      @media (max-width: 1100px) {
        #dialog {
          max-width: 80%;
        }
      }

      @media (max-width: 600px) {
        #dialog {
          max-width: 100%;
        }

        paper-dialog {
          padding: 0;
          margin: 0;
        }
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="dialog">
      <h2>[[pageTitle]]</h2>
      <paper-dialog-scrollable>
        <div id="content"></div>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button on-tap="_close" dialog-dismiss="">[[t('close')]]</paper-button>
      </div>
    </paper-dialog>
`,

  is: 'yp-page-dialog',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {
    title: {
      type: String
    },
    page: Object,
    pageTitle: {
      type: String,
      computed: '_pageTitle(page, language)'
    }
  },

  _pageTitle: function (page, language) {
    if (page) {
      return page.title;
    } else {
      return "";
    }
  },

  open: function (title, content) {
    this.set('title', title);
    this.$.content.innerHTML = content;
    this.$.dialog.fit();
    this.$.dialog.notifyResize();
    this.$.dialog.open();
  },

  _close: function () {
    this.set('title', null);
    this.$.content.innerHTML = '';
  }
});
