import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { Dialog } from '@material/mwc-dialog';

import '@material/mwc-dialog';
import '@material/mwc-button';

@customElement('yp-page-dialog')
export class YpPageDialog extends YpBaseElement {
  @property({ type: String })
  dialogTitle: string | undefined;

  @property({ type: Object })
  page: YpHelpPage | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        #dialog {
          background-color: #fff;
          max-width: 50%;
        }

        @media (max-width: 1100px) {
          #dialog {
            max-width: 80%;
          }
        }

        @media (max-width: 600px) {
          #dialog {
            max-width: 100%;
          }

          mwc-dialog {
            padding: 0;
            margin: 0;
          }
        }

        mwc-dialog[rtl] {
          direction: rtl;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  render() {
    return html`
      <mwc-dialog .heading="${this.pageTitle}" id="dialog" ?rtl="${this.rtl}">
        <div id="content"></div>
        <div class="buttons">
          <mwc-button
            @click="${this._close}"
            dialogDismiss
            .label="${this.t('close')}"></mwc-button>
        </div>
      </mwc-dialog>
    `;
  }

  get pageTitle(): string {
    if (this.page) {
      return this.page.title[this.language];
    } else {
      return '';
    }
  }

  open(page: YpHelpPage, language: string) {
    this.page = page;
    this.language = language;
    (this.$$('#content') as HTMLElement).innerHTML =  this.page.content[this.language];
    (this.$$('#dialog') as Dialog).open = true;
  }

  _close() {
    (this.$$('#dialog') as Dialog).open = false;
    (this.$$('#content') as HTMLElement).innerHTML = '';
  }
}
