var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { css, html } from "lit";
import "@material/web/iconbutton/filled-icon-button.js";
import "../../yp-user/yp-login.js";
let YpConfigurationSubmitted = class YpConfigurationSubmitted extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
        .confirmation {
          width: 756px !important;
          font-size: 15px;
          font-weight: 500;
          font-family: var(--md-ref-typeface-brand);
          margin-top: 16px;
          margin-bottom: 16px;
          line-height: 32.5px;
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

        .confirmation-text {
          font-weight: 700;
          text-transform: lowercase;
        }
      `,
        ];
    }
    render() {
        return html `
      <div class="layout horizontal center-center container confirmation">
        <div class="confirmation">
          ${this.t("configuration")}
          <span class="confirmation-text">${this.t("submitted")}</span>
        </div>
      </div>
    `;
    }
};
YpConfigurationSubmitted = __decorate([
    customElement("yp-configuration-submitted")
], YpConfigurationSubmitted);
export { YpConfigurationSubmitted };
//# sourceMappingURL=yp-configuration-submitted.js.map