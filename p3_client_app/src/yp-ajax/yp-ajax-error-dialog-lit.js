import '@polymer/polymer/polymer-legacy.js';
import '@material/mwc-button';
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
        <mwc-button dialog-confirm .autofocus="" @click="${this.resetErrorText}" .label="OK" ></mwc-button>
      </div>
    </paper-dialog>
`
  }

  showErrorDialog(errorText) {
    this.errorText = errorText;
    this.$$("#error").open();
    const errorDialog = this.$$("#error");
  }

  resetErrorText(event) {
    this.$$("#error").close();
    this.$$("#errorText")="";
  }
}

window.customElements.define('yp-ajax-error-dialog-lit', YpAjaxErrorDialogLit)
