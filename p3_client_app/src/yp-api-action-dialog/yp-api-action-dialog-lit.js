import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
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
        <paper-button dialog-dismiss>${this.t('cancel')}</paper-button>
        <paper-button dialog-confirm @tap="${this._delete}">${this.confirmButtonText}</paper-button>
      </div>
    </paper-dialog>
`
  }

/*
  behaviors: [
    ypLanguageBehavior
  ],
*/


  setup(action, confirmationText, onFinishedFunction, confirmButtonText, method) {
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
  }

  open(options) {
    if (options && options.finalDeleteWarning) {
      this.set('finalDeleteWarning', true);
    }
    this.$$("#confirmationDialog").open();
  }

  _delete() {
    if (!this.finalDeleteWarning) {
      this.$$("#apiAjax").url = this.action;
      this.$$("#apiAjax").setBody({deleteConfirmed: true});
      this.$$("#apiAjax").generateRequest();
    } else {
      this.set('finalDeleteWarning', false);
      this.set('confirmationText', this.t('finalDeleteWarning'));
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
