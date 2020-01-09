import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpAjaxErrorDialogLit extends YpBaseElement {
  static get properties() {
    return {
      errorText: {
        type: String,
        value: ""
      }
    }
  }
 
  static get styles() {
    return [
      css`
      
      paper-dialog {
        background-color: #FFF;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-dialog id="error">
      <p id="errorText">${this.errorText}</p>
      <div class="buttons">
        <paper-button dialog-confirm .autofocus="" @tap="${this.resetErrorText}">OK</paper-button>
      </div>
    </paper-dialog>
`
  }

  showErrorDialog(errorText) {
    this.errorText = errorText;
    this.$$("#error").open();
    var errorDialog = this.$$("#error");
  }

  resetErrorText(event) {
    this.$.error.close();
    this.$.errorText="";
  }
}

window.customElements.define('yp-ajax-error-dialog-lit', YpAjaxErrorDialogLit)
