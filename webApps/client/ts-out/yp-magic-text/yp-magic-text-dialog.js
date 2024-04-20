var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { YpMagicText } from "./yp-magic-text.js";
import "@material/web/dialog/dialog.js";
let YpMagicTextDialog = class YpMagicTextDialog extends YpMagicText {
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
        }

        #dialog {
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

          md-dialog {
            padding: 0;
            margin: 0;
          }
        }

        .buttons {
        }
      `,
        ];
    }
    render() {
        return html `
      <md-dialog id="dialog" aria-label="${this.t("textDialog")}">
        <div slot="content">
          ${this.finalContent
            ? html ` <div>${unsafeHTML(this.finalContent)}</div> `
            : html ` <div>${this.content}</div> `}
        </div>
        <md-text-button
          slot="actions"
          @click="${() => (this.$$("#dialog").open = false)}"
        >
          ${this.closeDialogText}
        </md-text-button>
      </md-dialog>
    `;
    }
    subClassProcessing() {
        this.processedContent = this.processedContent?.replace(/\n/g, "<br />");
    }
    async open(content, contentId, extraId, additionalId, textType, contentLanguage, closeDialogText, structuredQuestionsConfig, skipSanitize = false, disableTranslation = false) {
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
        this.$$("#dialog").open = true;
        setTimeout(() => {
            //TODO: What to fire here?
            this.fire("iron-resize");
        }, 50);
    }
};
YpMagicTextDialog = __decorate([
    customElement("yp-magic-text-dialog")
], YpMagicTextDialog);
export { YpMagicTextDialog };
//# sourceMappingURL=yp-magic-text-dialog.js.map