import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';

import '@material/mwc-button';
import '@material/mwc-dialog';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { Dialog } from '@material/mwc-dialog';

@customElement('yp-api-action-dialog')
export class YpApiActionDialog extends YpBaseElement {
  @property({ type: String })
  action: string | undefined;

  @property({ type: String })
  method: string | undefined;

  @property({ type: String })
  confirmationText: string | undefined;

  @property({ type: String })
  confirmButtonText: string | undefined;

  @property({ type: Object })
  onFinishedFunction: Function | undefined;

  @property({ type: Boolean })
  finalDeleteWarning = false;

  static get styles() {
    return [
      super.styles,
      css`
        paper-dialog {
          background-color: #fff;
        }
      `,
    ];
  }

  render() {
    return html`
      <yp-ajax
        .method="${this.method}"
        id="apiAjax"
        @response="${this._response}"></yp-ajax>
      <mwc-dialog id="confirmationDialog">
        <div>${this.confirmationText}</div>
        <div class="buttons">
          <mwc-button
            dialogAction="cancel"
            slot="secondaryAction"
            .label="${this.t('cancel')}"></mwc-button>
          <mwc-button
            dialogAction="discard"
            slot="primaryAction"
            @click="${this._delete}"
            .label="${this.confirmButtonText || ''}"></mwc-button>
        </div>
      </mwc-dialog>
    `;
  }

  setup(
    action: string,
    confirmationText: string,
    onFinishedFunction: Function,
    confirmButtonText: string,
    method: string
  ) {
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

  open(options: { finalDeleteWarning: boolean }) {
    if (options && options.finalDeleteWarning) {
      this.finalDeleteWarning = true;
    }
    (this.$$('#confirmationDialog') as Dialog).open = true;
  }

  _delete() {
    if (!this.finalDeleteWarning) {
      this.$$('#apiAjax').url = this.action;
      this.$$('#apiAjax').setBody({ deleteConfirmed: true });
      this.$$('#apiAjax').generateRequest();
    } else {
      this.finalDeleteWarning = false;
      this.confirmationText = this.t('finalDeleteWarning');
      (this.$$('#confirmationDialog') as Dialog).open = true;
    }
  }

  _response() {
    this.fire('api-action-finished');
    if (this.onFinishedFunction) {
      this.onFinishedFunction();
    }
  }
}