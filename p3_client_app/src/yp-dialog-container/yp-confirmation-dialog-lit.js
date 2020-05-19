import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
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
        <paper-button ?hidden="${this.hideCancel}" @tap="${this._reset}" dialog-dismiss>${this.t('cancel')}</paper-button>
        <paper-button dialog-confirm @tap="${this._confirm}">${this.t('confirm')}</paper-button>
      </div>
    </paper-dialog>
`
  }

  _reset() {
    this.set('confirmationText', null);
    this.set('onConfirmedFunction', null);
    this.haveIssuedFinalWarning = false;
    this.useFinalWarning = false;
    this.set('hideCancel', false);
  }

  open(confirmationText, onConfirmedFunction, useModal, useFinalWarning, hideCancel) {
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
  }

  _confirm() {
    if (this.useFinalWarning && !this.haveIssuedFinalWarning) {
      this.haveIssuedFinalWarning = true;
      this.$$("#confirmationDialog").close();
      this.set('confirmationText', this.t("finalDeleteWarning"));
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
