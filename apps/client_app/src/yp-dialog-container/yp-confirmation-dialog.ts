import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@material/mwc-button';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpConfirmationDialogLit extends YpBaseElement {
  static get properties() {
    return {
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
    <paper-dialog id="confirmationDialog">
      <div>${this.confirmationText}</div>
      <div class="buttons">
        <mwc-button ?hidden="${this.hideCancel}" @click="${this._reset}" dialog-dismiss .label="${this.t('cancel')}"></mwc-button>
        <mwc-button dialog-confirm @click="${this._confirm}" .label="${this.t('confirm')}"></mwc-button>
      </div>
    </paper-dialog>
`
  }

  _reset() {
    this.confirmationText = null;
    this.onConfirmedFunction = null;
    this.haveIssuedFinalWarning = false;
    this.useFinalWarning = false;
    this.hideCancel = false;
  }

  open(confirmationText, onConfirmedFunction, useModal, useFinalWarning, hideCancel) {
    this.confirmationText = confirmationText;
    this.onConfirmedFunction = onConfirmedFunction;
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
      this.hideCancel = true;
    } else {
      this.hideCancel = false;
    }
  }

  _confirm() {
    if (this.useFinalWarning && !this.haveIssuedFinalWarning) {
      this.haveIssuedFinalWarning = true;
      this.$$("#confirmationDialog").close();
      this.confirmationText = this.t("finalDeleteWarning");
      this.async(function () {
        this.$$("#confirmationDialog").open();
      });
    } else {
      if (this.onConfirmedFunction) {
        this.onConfirmedFunction();
        this._reset();
      }
    }
  }
}

window.customElements.define('yp-confirmation-dialog-lit', YpConfirmationDialogLit) 
