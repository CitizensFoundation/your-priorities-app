import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import '../../../../@polymer/paper-button/paper-button.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-ajax/yp-ajax.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
        height: 0;
      }

      paper-dialog {
        background-color: #FFF;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-ajax method\$="[[method]]" id="apiAjax" on-response="_response"></yp-ajax>
    <paper-dialog id="confirmationDialog">
      <div>[[confirmationText]]</div>
      <div class="buttons">
        <paper-button dialog-dismiss="">[[t('cancel')]]</paper-button>
        <paper-button dialog-confirm="" on-tap="_delete">[[confirmButtonText]]</paper-button>
      </div>
    </paper-dialog>
`,

  is: 'yp-api-action-dialog',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {

    confirmationText: {
      type: String
    },

    action: {
      type: String
    },

    onFinishedFunction: {
      type: Function,
      value: null
    },

    confirmButtonText: {
      type: String
    }
  },

  setup: function (action, confirmationText, onFinishedFunction, confirmButtonText, method) {
    this.set('action', action);
    this.set('confirmationText', confirmationText);
    this.set('onFinishedFunction', onFinishedFunction);
    if (confirmButtonText) {
      this.set('confirmButtonText', confirmButtonText);
    } else {
      this.set('confirmButtonText', this.t('delete'));
    }
    if (method) {
      this.set('method', method);
    } else {
      this.set('method', 'DELETE');
    }
  },

  open: function () {
    this.$$("#confirmationDialog").open();
  },

  _delete: function () {
    this.$$("#apiAjax").url = this.action;
    this.$$("#apiAjax").setBody({deleteConfirmed: true});
    this.$$("#apiAjax").generateRequest();
  },

  _response: function () {
    this.fire("api-action-finished");
    if (this.onFinishedFunction) {
      this.onFinishedFunction();
    }
  }
});
