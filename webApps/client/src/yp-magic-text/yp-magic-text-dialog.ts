import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { YpMagicText } from "./yp-magic-text.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import "@material/web/dialog/dialog.js";

@customElement("yp-magic-text-dialog")
export class YpMagicTextDialog extends YpMagicText {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        #dialog {
          padding: 32px;
          --md-dialog-container-shape: 4px;
        }

        md-text-button {
        }

        .content {
          margin: 32px;
          line-height: 25px;
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

          md-dialog {
            padding: 0;
            margin: 0;
          }
        }

        .buttons {
          flex: none;
          align-self: end;
        }
      `,
    ];
  }

  override render() {
    return html`
      <md-dialog id="dialog" aria-label="${this.t("textDialog")}">
        <div slot="content" class="content">
          ${this.finalContent
            ? html` <div>${unsafeHTML(this.finalContent)}</div> `
            : html` <div>${this.content}</div> `}
        </div>
        <div class="buttons" slot="actions">
          <md-text-button
            @click="${() => ((this.$$("#dialog") as MdDialog).open = false)}"
          >
            ${this.closeDialogText}
          </md-text-button>
        </div>
      </md-dialog>
    `;
  }

  override subClassProcessing() {
    this.processedContent = this.processedContent?.replace(/\n/g, "<br />");
  }

  async open(
    content: string,
    contentId: number,
    extraId: number,
    additionalId: number,
    textType: string,
    contentLanguage: string,
    closeDialogText: string,
    structuredQuestionsConfig: string,
    skipSanitize = false,
    disableTranslation = false
  ) {
    this.skipSanitize = skipSanitize;
    this.isDialog = true;
    this.content = content;
    this.contentId = contentId;
    this.extraId = extraId;
    this.additionalId = additionalId;
    this.textType = textType;
    this.contentLanguage = contentLanguage;
    this.structuredQuestionsConfig = structuredQuestionsConfig;
    this.closeDialogText = closeDialogText;
    this.disableTranslation = disableTranslation;
    await this.updateComplete;
    (this.$$("#dialog") as MdDialog).open = true;
    setTimeout(() => {
      //TODO: What to fire here?
      this.fire("iron-resize");
    }, 50);
  }
}
