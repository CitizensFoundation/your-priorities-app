import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { Dialog } from "@material/mwc-dialog";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";

@customElement("yp-page-dialog")
export class YpPageDialog extends YpBaseElement {
  @property({ type: String })
  dialogTitle: string | undefined;

  @property({ type: Object })
  page: YpHelpPageData | undefined;

  closeFunction: Function | undefined;

  static get styles() {
    return [
      super.styles,
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

  render() {
    return html`
      <md-dialog
        escapeKeyAction=""
        scrimClickAction=""
        @closed="${this._close}"
        id="dialog"
        ?rtl="${this.rtl}"
      >
        <md-icon slot="headline-prefix">joystick</md-icon>
        <span slot="headline" class="headline">${this.pageTitle}</span>
        <div id="content" style="text-align: left"></div>
        <md-outlined-button
          class="startButton"
          slot="footer"
          dialogFocus
          dialogAction="${this._close}"
          >${this.t("Start Game")}</md-outlined-button
        >
      </md-dialog>
    `;
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
    closeFunction: Function | undefined = undefined
  ) {
    if (closeFunction) {
      this.closeFunction = closeFunction;
    }
    await this.updateComplete;
    this.page = page;
    this.language = language;
    (this.$$("#content") as HTMLElement).innerHTML =
      this.page.content[this.language];
    (this.$$("#dialog") as Dialog).open = true;
  }

  _close() {
    (this.$$("#dialog") as Dialog).open = false;
    setTimeout(() => {
      (this.$$("#content") as HTMLElement).innerHTML = "";
    }, 50);
    window.appGlobals.activity("close", "pages");
    if (this.closeFunction) {
      this.closeFunction();
    }
  }
}
