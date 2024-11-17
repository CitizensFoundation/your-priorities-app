var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import { css, html } from "lit";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
let YpAgentBundle = class YpAgentBundle extends YpBaseElementWithLogin {
    static get styles() {
        return [
            super.styles,
            css `
        .container {
          background-color: var(--md-sys-color-surface-container-lowest);
          height: 100vh;
        }

        .selfStart {
          align-self: start;
        }

        .fixed {
          position: fixed;
          top: 156px;
          left: 48px;
        }

        yp-assistant,
        .assistantPlaceholder {
          width: 820px;
          max-width: 820px;
          height: 100vh;
        }

        .agentBundleLogo {
          width: 125px;
          height: 39px;
          margin-right: 64px;
          z-index: 25;
        }

        .logoContainer {
          padding: 16px;
          z-index: 15;
        }
      `,
        ];
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("subRoute") && this.subRoute) {
            const splitSubRoute = this.subRoute.split("/");
            this.domainId = parseInt(splitSubRoute[1]);
        }
    }
    renderLogo() {
        return html `<div class="logoContainer">
      ${this.themeDarkMode
            ? html `
            <img
              class="agentBundleLogo"
              src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/amplifierLogo.png"
            />
          `
            : html `
            <img
              class="agentBundleLogo"
              src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/amplifierLogo.png"
            />
          `}
    </div> `;
    }
    render() {
        return html `
      <div class="layout horizontal center-center container">
        <div class="selfStart fixed" hidden>${this.renderLogo()}</div>
        ${this.domainId
            ? html ` <yp-assistant
              id="assistant"
              .domainId="${this.domainId}"
              class="selfStart"
            ></yp-assistant>`
            : html `<div class="assistantPlaceholder"></div>`}

        <div class="selfStart agentBundleLogo"></div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Number })
], YpAgentBundle.prototype, "domainId", void 0);
__decorate([
    property({ type: String })
], YpAgentBundle.prototype, "subRoute", void 0);
YpAgentBundle = __decorate([
    customElement("yp-agent-bundle")
], YpAgentBundle);
export { YpAgentBundle };
//# sourceMappingURL=yp-agent-bundle.js.map