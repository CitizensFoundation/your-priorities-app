import {
  LitElement,
  html,
  css,
  CSSResult,
  TemplateResult,
  PropertyValues,
  nothing,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";

import { YpBaseElement } from "../common/yp-base-element";
import { Corner } from "@material/web/menu/menu.js";
import { YpNavHelpers } from "../common/YpNavHelpers";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login";

@customElement("yp-agent-bundle-top-bar")
export class YpAgentBundleTopBar extends YpBaseElementWithLogin {
  @state()
  private domain: YpDomainData | undefined;

  @property({ type: String })
  numberOfUnViewedNotifications: string | undefined;

  @property({ type: String })
  page: string | undefined;

  @property({ type: Boolean })
  hasStaticBadgeTheme = false;

  static override get styles() {
    return [
      super.styles,
      css`
        .topBar {
          width: 1185px;
          position: fixed;
          top: 0;
          left: 50%;
          padding-top: 12px;
          transform: translateX(-50%);
        }

        .topBar[for-agent-bundle] {
          z-index: 1;
          background: var(--md-sys-color-surface-container-lowest);
          padding-bottom: 12px;
        }

        @media (max-width: 1200px) {
          .topBar {
            width: 100%;
            padding-bottom: 12px;
            padding-left: 16px;
            padding-right: 16px;
          }
        }

        @media (max-width: 820px) {
          .topBar {
            z-index: 1;
            background: var(--md-sys-color-surface-container-lowest);
          }
        }

        .loginOrUserButton {
          margin-top: 12px;
        }

        .agentBundleLogo {
          height: 30px;
          padding-top: 10px;
          z-index: 1;
        }

        .logoContainer {
          padding: 16px;
          z-index: 1;
        }

        md-filled-button[has-static-theme] {
          --md-filled-button-container-color: var(
            --md-sys-color-primary-container
          );
          --md-sys-color-on-primary: var(--md-sys-color-on-primary-container);
        }
      `,
    ];
  }

  constructor() {
    super();
  }

  get inForAgentBundle() {
    return (
      window.appGlobals.originalQueryParameters.forAgentBundle &&
      this.page !== "agent_bundle"
    );
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has("titleString")) {
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addGlobalListener(
      "yp-domain-changed",
      this._onDomainChanged.bind(this)
    );
  }

  renderLogo() {
    return html`<div class="logoContainer">
      ${this.themeDarkMode
        ? html`
            <img
              class="agentBundleLogo"
              src="https://evoly.ai/is/img/evoly-logo.png"
            />
          `
        : html`
            <img
              class="agentBundleLogo"
              src="https://evoly.ai/is/img/evoly-logo.png"
            />
          `}
    </div> `;
  }

  override disconnectedCallback(): void {
    this.removeGlobalListener(
      "yp-domain-changed",
      this._onDomainChanged.bind(this)
    );

    super.disconnectedCallback();
  }

  private _onDomainChanged(event: CustomEvent) {
    if (
      event.detail &&
      event.detail.domain &&
      event.detail.domain.id &&
      event.detail.domain.id !== this.domain?.id
    ) {
      this.domain = event.detail.domain;
    }
  }

  _login() {
    if (
      window.appGlobals.domain &&
      window.appGlobals.domain.configuration?.useLoginOnDomainIfNotLoggedIn
    ) {
      YpNavHelpers.redirectTo(`/organization/${window.appGlobals.domain.id}`);
    } else if (window.appUser) {
      window.appUser.openUserlogin();
    }
  }

  renderUser() {
    if (!this.languageLoaded) {
      return nothing;
    }

    return html` ${this.loggedInUser
      ? html`
          <div style="position: relative;" hidden>
            <md-filled-tonal-icon-button
              class="layout horizontal"
              @click="${() => this.fire("open-notification-drawer")}"
              slot="actionItems"
            >
              <md-icon>notifications</md-icon>
            </md-filled-tonal-icon-button>
            <md-badge
              id="notificationBadge"
              class="activeBadge"
              ?has-static-theme="${this.hasStaticBadgeTheme}"
              .value="${this.numberOfUnViewedNotifications}"
              ?hidden="${!this.numberOfUnViewedNotifications}"
            >
            </md-badge>
          </div>
          <md-icon-button
            class="layout horizontal loginOrUserButton"
            @click="${() => this.fire("open-user-drawer")}"
            slot="actionItems"
          >
            <yp-user-image id="userImage" useImageBorder medium .user="${this.loggedInUser}">
            </yp-user-image>
          </md-icon-button>
        `
      : html`
          <md-filled-button
            ?has-static-theme="${this.hasStaticTheme}"
            slot="actionItems"
            hidden
            class="loginOrUserButton"
            @click="${this._login}"
            title="${this.t("user.login")}"
            >${this.t("user.login")}
          </md-filled-button>
        `}`;
  }

  override render(): TemplateResult {
    return html`<div class="layout vertical center-center">
      <div
        class="topBar layout horizontal"
        ?for-agent-bundle="${this.inForAgentBundle}"
      >
        <div class="agentBundleLogo">${this.renderLogo()}</div>
        <div class="flex"></div>
        ${this.renderUser()}
      </div>
    </div>`;
  }
}
