import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import '../../../../@polymer/paper-button/paper-button.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      paper-dialog {
        background-color: #FFF;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="confirmationDialog">
      <div>[[confirmationText]]</div>
      <div class="buttons">
        <paper-button on-tap="_reset" dialog-dismiss="">[[t('cancel')]]</paper-button>
        <paper-button dialog-confirm="" on-tap="_confirm">[[t('confirm')]]</paper-button>
      </div>
    </paper-dialog>
`,

  is: 'yp-confirmation-dialog',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {

    confirmationText: {
      type: String
    },

    onConfirmedFunction: {
      type: Function,
      value: null
    }
  },

  _reset: function () {
    this.set('confirmationText', null);
    this.set('onConfirmedFunction', null);
  },

  open: function (confirmationText, onConfirmedFunction) {
    this.set('confirmationText', confirmationText);
    this.set('onConfirmedFunction', onConfirmedFunction);
    this.$$("#confirmationDialog").open();
  },

  _confirm: function () {
    if (this.onConfirmedFunction) {
      this.onConfirmedFunction();
      this._reset();
    }
  }
});
