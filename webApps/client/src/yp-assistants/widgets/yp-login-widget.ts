import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { css, html } from "lit";

import "@material/web/iconbutton/filled-icon-button.js";
import { YpBaseElementWithLogin } from "../../common/yp-base-element-with-login.js";

import "../../yp-user/yp-login.js";

@customElement("yp-login-widget")
export class YpLoginWidget extends YpBaseElementWithLogin {
  static override get styles() {
    return [
      super.styles,
      css`
        .logged-in {
          width: 768px !important;
          font-size: 22px;
          font-weight: 700;
          font-family: var(--md-ref-typeface-brand);
          margin-top: 16px;
          margin-bottom: 16px;
          text-align: center;
          padding: 0;
          background-color: var(--yp-sys-color-agent-green-10);
          border-radius: 4px;
        }

        .container {
          width: calc(768px - 42px);
        }

        yp-login {
          width: 430px;
        }
      `,
    ];
  }

  override render() {
    if (this.isLoggedIn) {
      return html`
        <div class="layout horizontal center-center container logged-in">
          <div class="logged-in">${this.t("loggedIn")}</div>
        </div>
      `;
    } else {
      return html`
        <div class="layout horizontal center-center container">
          <yp-login
            id="userLogin"
            class="loginSurface"
            fullWithLoginButton
            assistantMode
          ></yp-login>
        </div>
      `;
    }
  }
}
