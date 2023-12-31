var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
let YpPageDialog = class YpPageDialog extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.modal = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
        }

        md-text-button {
          font-weight: bold;
        }

        .fab {
          text-align: center;
        }

        #content {
          padding: 16px;
        }

        #dialog[slot="footer"] {
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
          text-align: center;
        }

        #dialog {
        }

        .languageButton {
          text-align: left;
          align-items: flex-start;
        }

        md-dialog {
         // height: 100%;
        }

        md-dialog[open][is-safari] {
          //height: 100%;
        }

        @media (max-width: 1100px) {
        }

        @media (max-width: 600px) {
          #content {
            padding: 0;
          }

          .headline {
            text-align: center;
            padding-top: 8px;
            padding-bottom: 8px;
          }

          .startButton {
            padding-bottom: 8px;
            margin-bottom: 8px;
          }


        }

        md-dialog[rtl] {
          direction: rtl;
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    scrimDisableAction(event) {
        if (this.modal) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    render() {
        return html `
      <md-dialog
        @cancel="${this.scrimDisableAction}"
        id="dialog"
        ?is-safari="${this.isSafari}"
        ?rtl="${this.rtl}"
      >
        <md-icon slot="icon">help</md-icon>
        <span slot="headline" class="headline">${this.pageTitle}</span>
        <div
          id="content"
          slot="content"
          style="text-align: left"
          class="layout vertical center-center"
        ></div>

        <div slot="actions">
          ${this.textButtonText
            ? html `
                <md-text-button class="startButton" @click="${this._close}"
                  >${this.textButtonText}</md-text-button
                >
              `
            : html `

          <div class="flex"></div>

          <md-text-button
            class="startButton"
            autofocus
            @click="${this._close}"
            >${this.t("close")}</md-text-button
          >

        </div>


        `}
        </div>
      </md-dialog>
    `;
    }
    _switchLanguage() {
        const locale = this.language == "en" ? "is" : "en";
        window.appGlobals.changeLocaleIfNeeded(locale, true);
        localStorage.setItem("yp-user-locale", locale);
        console.info("Saving locale");
        if (window.appUser && window.appUser.user) {
            window.appUser.setLocale(locale);
        }
        window.appGlobals.activity("click", "changeLanguage", locale);
    }
    get pageTitle() {
        if (this.page) {
            return this.page.title[this.language];
        }
        else {
            return "";
        }
    }
    async open(page, language, closeFunction = undefined, textButtonText = undefined, modal = false) {
        this.modal = modal;
        if (closeFunction) {
            this.closeFunction = closeFunction;
        }
        else {
            this.closeFunction = undefined;
        }
        if (textButtonText) {
            this.textButtonText = textButtonText;
        }
        else {
            this.textButtonText = undefined;
        }
        this.page = page;
        this.language = language;
        await this.updateComplete;
        const contentEl = this.$$("#content");
        contentEl.innerHTML = this.page.content[this.language];
        this.$$("#dialog").show();
    }
    _close() {
        this.$$("#dialog").close();
        this.$$("#content").innerHTML = "";
        window.appGlobals.activity("close", "pages");
        if (this.closeFunction) {
            this.closeFunction();
        }
    }
};
__decorate([
    property({ type: String })
], YpPageDialog.prototype, "dialogTitle", void 0);
__decorate([
    property({ type: Object })
], YpPageDialog.prototype, "page", void 0);
__decorate([
    property({ type: String })
], YpPageDialog.prototype, "textButtonText", void 0);
__decorate([
    property({ type: Boolean })
], YpPageDialog.prototype, "modal", void 0);
YpPageDialog = __decorate([
    customElement("yp-page-dialog")
], YpPageDialog);
export { YpPageDialog };
//# sourceMappingURL=yp-page-dialog.js.map