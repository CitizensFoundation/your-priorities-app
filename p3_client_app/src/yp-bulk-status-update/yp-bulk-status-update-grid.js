import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-ajax/yp-ajax.js';
import { WordWrap } from '../yp-behaviors/word-wrap.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      #dialog {
        width: 100%;
        max-height: 100%;
        background-color: #FFF;
      }

      iron-list {
        color: #000;
        height: 500px;
        width: 100%;
      }

      .pageItem {
        padding-right: 16px;
      }

      .id {
        width: 60px;
      }

      .title {
        width: 200px;
      }

      .email {
        width: 240px;
      }

      #editPageLocale {
        width: 80%;
        max-height: 80%;
        background-color: #FFF;
      }

      .locale {
        width: 30px;
        cursor: pointer;
      }

      paper-textarea {
        height: 60%;
      }

      .localeInput {
        width: 26px;
      }

      .pageItem {
        padding-top: 8px;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="dialog">
      <h2>[[t('bulkStatusUpdate')]]</h2>
      <paper-dialog-scrollable>
        <iron-list items="[[bulkStatusUpdates]]" as="bulkStatusUpdate">
          <template>
            <div class="layout horizontal">
              <div class="pageItem id">
                [[bulkStatusUpdate.name]]
              </div>
              <paper-button data-args\$="[[bulkStatusUpdate]]" on-tap="_editBulkStatusUpdate">[[t('update')]]</paper-button>
              <paper-button data-args\$="[[bulkStatusUpdate]]" on-tap="_editConfig">[[t('config')]]</paper-button>
            </div>
          </template>
        </iron-list>
      </paper-dialog-scrollable>

      <paper-button on-tap="_newBulkStatusUpdate">[[t('new')]]</paper-button>

      <div class="buttons">
        <paper-button dialog-dismiss="">[[t('close')]]</paper-button>
      </div>
    </paper-dialog>

    <div class="layout horizontal center-center">
      <yp-ajax method="GET" id="getBulkStatusUpdatesAjax" on-response="_bulkStatusUpdateResponse"></yp-ajax>
    </div>
`,

  is: 'yp-bulk-status-update-grid',

  behaviors: [
    ypLanguageBehavior,
    WordWrap
  ],

  properties: {
    bulkStatusUpdates: {
      type: Array,
      notify: true
    },

    selectedUpdate: {
      type: Object
    },

    headerText: {
      type: String
    },

    selected: {
      type: Object
    },

    communityId: Number

  },

  _newBulkStatusUpdate: function () {
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {communityId: this.communityId});
    }.bind(this));
  },

  _editConfig: function (event) {
    var bulkStatusUpdate = JSON.parse(event.target.getAttribute('data-args'));
    this.set('selectedUpdate', bulkStatusUpdate);
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateConfig", function (dialog) {
      dialog.reset();
      dialog.open(this.selectedUpdate);
      this.$.dialog.close();
    }.bind(this));
  },

  _editBulkStatusUpdate: function (event) {
    var bulkStatusUpdate = JSON.parse(event.target.getAttribute('data-args'));
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateEdit", function (dialog) {
      dialog._clear();
      dialog.setup(bulkStatusUpdate, false, null);
      dialog.open('edit', {communityId: this.communityId, bulkStatusUpdateId: bulkStatusUpdate.id});
    }.bind(this));
  },

  _bulkStatusUpdateResponse: function (event, detail) {
    this.set('bulkStatusUpdates', detail.response);
  },

  open: function (communityId) {
    this.set('communityId', communityId);
    this.set('bulkStatusUpdates', null);
    this.set('selectedUpdate', null);
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateConfig", function (dialog) {
      dialog.reset();
      this.$.getBulkStatusUpdatesAjax.url = "/api/bulk_status_updates/" + communityId;
      this.$.getBulkStatusUpdatesAjax.generateRequest();
      this.$.dialog.open();
    }.bind(this));
  }
});
