import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@material/mwc-button';
import '../yp-ajax/yp-ajax.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpApiActionDialogLit extends YpBaseElement {
  static get properties() {
    return {
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
      },
  
      finalDeleteWarning: {
        type: Boolean,
        value: false
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
    <yp-ajax .method="${this.method}" id="apiAjax" @response="${this._response}"></yp-ajax>
    <paper-dialog id="confirmationDialog">
      <div>${this.confirmationText}</div>
      <div class="buttons">
        <mwc-button dialog-dismiss .label="${this.t('cancel')}"></mwc-button>
        <mwc-button dialog-confirm @click="${this._delete}" .label="${this.confirmButtonText}"></mwc-button>
      </div>
    </paper-dialog>
`
  }

  setup(action, confirmationText, onFinishedFunction, confirmButtonText, method) {
    this.action = action;
    this.confirmationText = confirmationText;
    this.onFinishedFunction = onFinishedFunction;
    if (confirmButtonText) {
      this.confirmButtonText = confirmButtonText;
    } else {
      this.confirmButtonText = this.t('delete');
    }
    if (method) {
      this.method = method;
    } else {
      this.method = 'DELETE';
    }
  }

  open(options) {
    if (options && options.finalDeleteWarning) {
      this.finalDeleteWarning = true;
    }
    this.$$("#confirmationDialog").open();
  }

  _delete() {
    if (!this.finalDeleteWarning) {
      this.$$("#apiAjax").url = this.action;
      this.$$("#apiAjax").setBody({deleteConfirmed: true});
      this.$$("#apiAjax").generateRequest();
    } else {
      this.finalDeleteWarning = false;
      this.confirmationText = this.t('finalDeleteWarning');
      this.$$("#confirmationDialog").close();
      this.async(() => {
        this.$$("#confirmationDialog").open();
      },10);
    }
  }

  _response() {
    this.fire("api-action-finished");
    if (this.onFinishedFunction) {
      this.onFinishedFunction();
    }
  }
}

window.customElements.define('yp-api-action-dialog-lit', YpApiActionDialogLit)
