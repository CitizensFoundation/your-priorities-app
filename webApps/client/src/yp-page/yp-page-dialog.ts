import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";

import { Dialog } from "@material/web/dialog/internal/dialog.js";

@customElement("yp-page-dialog")
export class YpPageDialog extends YpBaseElement {
  @property({ type: String })
  dialogTitle: string | undefined;

  @property({ type: Object })
  page: YpHelpPageData | undefined;

  @property({ type: String })
  textButtonText: string | undefined;

  @property({ type: Boolean })
  modal = false;

  closeFunction: Function | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
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

        .dialog {
          max-width: 1024px;
          max-height: 90vh;
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
            padding: 8px;
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

          .dialog {
            max-width: calc(100vw - 16px);
            max-height: calc(100vh - 16px);
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
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

  override scrimDisableAction(event: CustomEvent<any>): void {
    if (this.modal) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  override render() {
    return html`
      <md-dialog
        @cancel="${this.scrimDisableAction}"
        id="dialog"
        class="dialog"
        ?is-safari="${this.isSafari}"
        ?rtl="${this.rtl}"
      >
        <md-icon slot="icon">help</md-icon>
        <span slot="headline" class="headline">${this.pageTitle}</span>
        <div
          id="content"
          slot="content"
          style="text-align: left;line-height: 1.5;"
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
    debugger;
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
