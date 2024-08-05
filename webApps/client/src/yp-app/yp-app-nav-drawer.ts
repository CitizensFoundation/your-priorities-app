import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";

import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";

import "@material/web/iconbutton/outlined-icon-button.js";

import "@material/web/progress/linear-progress.js";

import "../common/languages/yp-language-selector.js";

import { YpNavHelpers } from "../common/YpNavHelpers.js";

@customElement("yp-app-nav-drawer")
export class YpAppNavDrawer extends YpBaseElement {
  @property({ type: Object })
  homeLink: YpHomeLinkData | undefined;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Boolean })
  opened = false;

  @property({ type: Boolean })
  spinner = false;

  @property({ type: String })
  route: string | undefined;

  @property({ type: Array })
  myAdminGroups: YpGroupData[] | undefined;

  @property({ type: Array })
  myAdminCommunities: YpCommunityData[] | undefined;

  @property({ type: Array })
  myGroups: YpGroupData[] | undefined;

  @property({ type: Array })
  myCommunities: YpCommunityData[] | undefined;

  @property({ type: Array })
  myDomains: YpDomainData[] | undefined;

  @property({ type: Object })
  adminRights: YpAdminRights | undefined;

  @property({ type: Object })
  memberships: YpMemberships | undefined;

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("user")) {
      this._userChanged();
    }

    if (changedProperties.has("opened")) {
      this._openChanged();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
  }

  async _openChanged() {
    if (this.opened === true) {
      this.spinner = true;
      this.adminRights = await window.serverApi.getAdminRightsWithNames();
      this.memberships = await window.serverApi.getMembershipsWithNames();
      this.spinner = false;
      this._reset();
    }
  }

  _selectedLocale() {
    return this.language;
  }

  _goBack() {
    if (this.homeLink) {
      YpNavHelpers.redirectTo(
        "/" + this.homeLink.type + "/" + this.homeLink.id
      );
      this.fire("yp-toggle-nav-drawer");
    }
  }

  _goToGroup(event: CustomEvent) {
    YpNavHelpers.redirectTo(
      "/group/" + (event.target as HTMLElement).getAttribute("data-args")
    );
    this.fire("yp-toggle-nav-drawer");
  }

  _goToCommunity(event: CustomEvent) {
    YpNavHelpers.redirectTo(
      "/community/" + (event.target as HTMLElement).getAttribute("data-args")
    );
    this.fire("yp-toggle-nav-drawer");
  }

  _goToDomain(event: CustomEvent) {
    YpNavHelpers.redirectTo(
      "/domain/" + (event.target as HTMLElement).getAttribute("data-args")
    );
    this.fire("yp-toggle-nav-drawer");
  }

  _userChanged() {
    if (this.user) {
      this._reset();
    }
  }

  _reset() {
    if (this.memberships) {
      const groupUsers = this.memberships.GroupUsers.filter((item) => {
        return item.name != "hidden_public_group_for_domain_level_points";
      });
      this.myGroups = groupUsers.slice(0, 1000) as YpGroupData[];
      this.myCommunities = this.memberships.CommunityUsers.slice(
        0,
        500
      ) as YpCommunityData[];
      this.myDomains = this.memberships.DomainUsers.slice(
        0,
        3
      ) as YpDomainData[];
    } else {
      this.myGroups = undefined;
      this.myCommunities = undefined;
      this.myDomains = undefined;
    }

    if (
      this.adminRights &&
      this.adminRights.CommunityAdmins &&
      this.adminRights.CommunityAdmins.length > 0
    ) {
      this.myAdminCommunities = this.adminRights
        .CommunityAdmins as YpCommunityData[];
    } else {
      this.myAdminCommunities = undefined;
    }

    if (
      this.adminRights &&
      this.adminRights.GroupAdmins &&
      this.adminRights.GroupAdmins.length > 0
    ) {
      const groupAdmins = this.adminRights.GroupAdmins.filter((item) => {
        return item.name != "hidden_public_group_for_domain_level_points";
      });
      this.myAdminGroups = groupAdmins as YpGroupData[];
    } else {
      this.myAdminGroups = undefined;
    }
  }

  static override get styles() {
    return [
      super.styles,
      css`

      :host {
        z-index: 5000;
      }
        .header {
          padding-top: 16px;
          font-weight: bold;
          padding-bottom: 8px;
          font-size: 18px;
          padding-left: 8px;
        }

        md-linear-progress {
          max-width: 200px;
          width: 100%;
        }

        .themeSelection {
          margin-bottom: 8px;
        }

        .thumbNail {
          width: 42px;
          height: 24px;
          padding-top: 24px;
          margin-left: 12px;
        }

        :host {
          height: 100%;
        }

        .lightDarkContainer {
          padding-left: 8px;
          padding-right: 8px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .darkModeButton {
          margin: 16px;
        }

        .material {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
        }

        .item {
          cursor: pointer;
          padding: 8px;
        }

        .languageSelector {
          margin-left: 8px;
          margin-right: 8px;
          margin-top: 8px;
        }

        yp-language-selector {
          padding-top: 0;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  override render() {
    return html`
      <div class="material">
        ${this.homeLink
          ? html`
              <div hidden class="header layout vertical center-center">
                <md-icon icon="home" @click="${this._goBack}"></md-icon>
                <div role="button" @click="${this._goBack}">
                  ${this.homeLink.name}
                </div>
              </div>
            `
          : nothing}
        <div hidden class="languageSelector layout vertical self-start">
          <yp-language-selector class="languageSelector"></yp-language-selector>
        </div>

        <div hidden class="layout horizontal center-center themeSelection">
          ${this.renderThemeToggle()}
        </div>

        ${this.spinner
          ? html`<div class="layout horizontal center-center">
              <md-linear-progress indeterminate></md-linear-progress>
            </div>`
          : nothing}

        <div
          class="layout vertical"
          role="navigation"
          aria-label="Community & Group navigation"
        >
          ${this.myAdminCommunities
            ? html`
                <div class="header">${this.t("myAdminCommunities")}</div>
                ${this.myAdminCommunities.map(
                  (community) => html`
                    <div class="layout horizontal">
                      <div
                        role="button"
                        class="item"
                        data-args="${community.id}"
                        @click="${this._goToCommunity}"
                      >
                        ${community.name}
                      </div>
                    </div>
                  `
                )}
              `
            : nothing}
          ${this.myAdminGroups
            ? html`
                <div class="header">${this.t("myAdminGroups")}</div>
                ${this.myAdminGroups.map(
                  (group) => html`
                    <div class="layout horizontal">
                      <div
                        role="button"
                        class="item"
                        data-args="${group.id}"
                        @click="${this._goToGroup}"
                      >
                        ${group.name}
                      </div>
                    </div>
                  `
                )}
              `
            : nothing}
          ${this.myCommunities
            ? html`
                <div class="header">${this.t("myCommunities")}</div>
                ${this.myCommunities.map(
                  (community) => html`
                    <div class="layout horizontal">
                      <div
                        role="button"
                        class="item"
                        data-args="${community.id}"
                        @click="${this._goToCommunity}"
                      >
                        ${community.name}
                      </div>
                    </div>
                  `
                )}
              `
            : nothing}
          ${this.myGroups
            ? html`
                <div class="header">${this.t("myGroups")}</div>
                ${this.myGroups.map(
                  (group) => html`
                    <div class="layout horizontal">
                      <div
                        role="button"
                        class="item"
                        data-args="${group.id}"
                        @click="${this._goToGroup}"
                      >
                        ${group.name}
                      </div>
                    </div>
                  `
                )}
              `
            : nothing}
        </div>
      </div>
    `;
  }
}
