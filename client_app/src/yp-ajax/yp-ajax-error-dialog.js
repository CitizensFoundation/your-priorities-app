import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">

      paper-dialog {
        background-color: #FFF;
      }
    </style>

    <paper-dialog id="error">
      <p id="errorText">[[errorText]]</p>
      <div class="buttons">
        <paper-button dialog-confirm="" autofocus="" on-tap="resetErrorText">OK</paper-button>
      </div>
    </paper-dialog>
`,

  is: 'yp-ajax-error-dialog',

  properties: {

    errorText: {
      type: String,
      value: ""
    }

  },

  showErrorDialog: function(errorText) {
    this.errorText = errorText;
    this.$$("#error").open();
    var errorDialog = this.$$("#error");
  },

  resetErrorText: function(event) {
    this.$.error.close();
    this.$.errorText="";
  }
})
