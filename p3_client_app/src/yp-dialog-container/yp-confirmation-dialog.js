import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      paper-dialog {
        background-color: #FFF;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="confirmationDialog">
      <div>[[confirmationText]]</div>
      <div class="buttons">
        <paper-button hidden\$="[[hideCancel]]" on-tap="_reset" dialog-dismiss="">[[t('cancel')]]</paper-button>
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
    },

    useFinalWarning: Boolean,

    haveIssuedFinalWarning: Boolean,

    hideCancel: {
      type: Boolean,
      value: false
    }
  },

  _reset: function () {
    this.set('confirmationText', null);
    this.set('onConfirmedFunction', null);
    this.haveIssuedFinalWarning = false;
    this.useFinalWarning = false;
    this.set('hideCancel', false);
  },

  open: function (confirmationText, onConfirmedFunction, useModal, useFinalWarning, hideCancel) {
    this.set('confirmationText', confirmationText);
    this.set('onConfirmedFunction', onConfirmedFunction);
    if (useModal) {
      this.$$("#confirmationDialog").modal = true;
    } else {
      this.$$("#confirmationDialog").modal = false;
    }
    this.$$("#confirmationDialog").open();
    if (useFinalWarning) {
      this.useFinalWarning = true;
    } else {
      this.useFinalWarning = false;
    }
    this.haveIssuedFinalWarning = false;
    if (hideCancel) {
      this.set('hideCancel', true);
    } else {
      this.set('hideCancel', false);
    }
  },

  _confirm: function () {
    if (this.useFinalWarning && !this.haveIssuedFinalWarning) {
      this.haveIssuedFinalWarning = true;
      this.$.confirmationDialog.close();
      this.set('confirmationText', this.t("finalDeleteWarning"));
      this.async(function () {
        this.$.confirmationDialog.open();
      });
    } else {
      if (this.onConfirmedFunction) {
        this.onConfirmedFunction();
        this._reset();
      }
    }
  }
});
