import { customElement, property } from "lit/decorators.js";
import { YpAssistantBase } from "./yp-assistant-base.js";
import { YpLanguages } from "../common/languages/ypLanguages.js";
import { YpAssistantServerApi } from "./AssistantServerApi.js";
import { css, html } from "lit";
import { YpCollection } from "../yp-collection/yp-collection.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";

@customElement("yp-agent-bundle")
export class YpAgentBundle extends YpBaseElementWithLogin {
  @property({ type: Number })
  domainId!: number;

  @property({ type: String })
  subRoute?: string;

  static override get styles() {
    return [
      super.styles,
      css`
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

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("subRoute") && this.subRoute) {
      const splitSubRoute = this.subRoute.split("/");
      this.domainId = parseInt(splitSubRoute[1]);
    }
  }

  renderLogo() {
    return html`<div class="logoContainer">
      ${this.themeDarkMode
        ? html`
            <img
              class="agentBundleLogo"
              src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/amplifierLogo.png"
            />
          `
        : html`
            <img
              class="agentBundleLogo"
              src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/amplifierLogo.png"
            />
          `}
    </div> `;
  }

  override render() {
    return html`
      <div class="layout horizontal center-center container">
        <div class="selfStart fixed" hidden>${this.renderLogo()}</div>
        ${this.domainId
          ? html` <yp-assistant
              id="assistant"
              .domainId="${this.domainId!}"
              class="selfStart"
            ></yp-assistant>`
          : html`<div class="assistantPlaceholder"></div>`}

        <div hidden class="selfStart agentBundleLogo"></div>
      </div>
    `;
  }
}
