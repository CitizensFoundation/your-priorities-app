import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { Dialog } from "@material/mwc-dialog";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import { Layouts } from "../../flexbox-literals/classes.js";

@customElement("yp-page-dialog")
export class YpPageDialog extends YpBaseElement {
  @property({ type: String })
  dialogTitle: string | undefined;

  @property({ type: Object })
  page: YpHelpPageData | undefined;

  @property({ type: String })
  textButtonText: string | undefined;

  @property({ type: Boolean })
  modal = false

  closeFunction: Function | undefined;

  static get styles() {
    return [
      super.styles,
      Layouts,
      css`
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
        }

        mwc-button {
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
          background-color: #ff0000;
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

  scrimDisableAction(event: CustomEvent<any>): void {
    if (this.modal) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  render() {
    return html`
      <md-dialog
        @cancel="${this.scrimDisableAction}"
        id="dialog"
        ?is-safari="${this.isSafari}"
        ?rtl="${this.rtl}"
      >
        <md-icon slot="icon">joystick</md-icon>
        <span slot="headline" class="headline">${this.pageTitle}</span>
        <div
          id="content"
          slot="content"
          style="text-align: left"
          class="layout vertical center-center"
        ></div>

        <div slot="actions">
          ${this.textButtonText
            ? html`
                <md-text-button class="startButton" @click="${this._close}"
                  >${this.textButtonText}</md-text-button
                >
              `
            : html`
          <md-text-button
            class="languageButton"
            @click="${this._switchLanguage}"
            >${this.language == "en" ? "Íslenska" : "English"}</md-text-button
          >
          <div class="flex"></div>

          <md-outlined-button
            class="startButton"
            autofocus
            @click="${this._close}"
            >${this.t("Start Game")}</md-outlined-button
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

  get pageTitle(): string {
    if (this.page) {
      return this.page!.title[this.language];
    } else {
      return "";
    }
  }

  async open(
    page: YpHelpPageData,
    language: string,
    closeFunction: Function | undefined = undefined,
    textButtonText: string | undefined = undefined,
    modal = false
  ) {
    this.modal = modal;
    if (closeFunction) {
      this.closeFunction = closeFunction;
    } else {
      this.closeFunction = undefined;
    }
    if (textButtonText) {
      this.textButtonText = textButtonText;
    } else {
      this.textButtonText = undefined;
    }
    this.page = page;
    this.language = language;
    await this.updateComplete;
    const contentEl = this.$$("#content") as HTMLElement;
    contentEl.innerHTML = this.page.content[this.language];
    (this.$$("#dialog") as Dialog).show();
  }

  _close() {
    (this.$$("#dialog") as Dialog).close();
    (this.$$("#content") as HTMLElement).innerHTML = "";
    window.appGlobals.activity("close", "pages");
    if (this.closeFunction) {
      this.closeFunction();
    }
  }
}
