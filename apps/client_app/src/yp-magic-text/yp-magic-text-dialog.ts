import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import { YpMagicText } from './yp-magic-text.js';
import { Dialog } from '@material/mwc-dialog';

@customElement('yp-magic-text-dialog')
export class YpMagicTextDialog extends YpMagicText {
  static get styles() {
    return [
      super.styles,
        css`

        :host {
          display: block;
        }

        #dialog {
          background-color: #FFF;
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

        .buttons {
          color: var(--accent-color);
        }
      `
    ]
  }

  render() {
    return html`
      <mwc-dialog id="dialog" aria-label="${this.t('textDialog')}">
        <div>
          ${ this.finalContent ? html`
            <div>${unsafeHTML(this.finalContent)}</div>
          ` : html`
            <div>${this.content}</div>
          `}
        </div>
        <mwc-button
            slot="primaryAction"
            dialogAction="discard">
          ${this.closeDialogText}
        </mwc-button>
      </mwc-dialog>
    `
  }

  subClassProcessing() {
    this.processedContent = this.processedContent?.replace(/\n/g, "<br />");
  }

  open(content: string, contentId: number, extraId: number, textType: string, contentLanguage: string, closeDialogText: string, structuredQuestionsConfig: string) {
    this.contentId = contentId;
    this.extraId = extraId;
    this.textType = textType;
    this.contentLanguage = contentLanguage;
    this.structuredQuestionsConfig = structuredQuestionsConfig;
    this.content = content;
    this.closeDialogText = closeDialogText;
    (this.$$("#dialog") as Dialog).open = true;
  }
}