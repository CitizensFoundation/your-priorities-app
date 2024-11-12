var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators.js";
import { css, html } from "lit";
import "@material/web/iconbutton/filled-icon-button.js";
import { YpBaseElementWithLogin } from "../../common/yp-base-element-with-login.js";
import "../../yp-user/yp-login.js";
let YpLoginWidget = class YpLoginWidget extends YpBaseElementWithLogin {
    static get styles() {
        return [
            super.styles,
            css `
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
    render() {
        if (this.isLoggedIn) {
            return html `<div class="logged-in">${this.t("loggedIn")}</div>`;
        }
        else {
            return html `
        <yp-login
          id="userLogin"
          class="loginSurface"
          fullWithLoginButton
          assistantMode
        ></yp-login>
      `;
        }
    }
};
YpLoginWidget = __decorate([
    customElement("yp-login-widget")
], YpLoginWidget);
export { YpLoginWidget };
//# sourceMappingURL=yp-login-widget.js.map