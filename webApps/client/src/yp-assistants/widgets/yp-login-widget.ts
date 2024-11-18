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
          font-size: 1.2em;
          font-weight: bold;
          margin-top: 16px;
          margin-bottom: 16px;
          text-align: center;
          padding: 16px;
          border: 1px solid var(--yp-sys-color-up);
        }
      `,
    ];
  }

  override render() {
    if (this.isLoggedIn) {
      return html`
        <div class="layout horizontal center-center flex">
          <div class="logged-in">${this.t("loggedIn")}</div>
        </div>
      `;
    } else {
      return html`
        <div class="layout horizontal center-center flex">
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
