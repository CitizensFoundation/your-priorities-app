import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";

import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";

import "@material/web/iconbutton/outlined-icon-button.js";

import "@material/web/progress/linear-progress.js";

import "../common/languages/yp-language-selector.js";

import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpGroupType } from "../yp-collection/ypGroupType.js";

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
  myGroups: YpGroupData[] | undefined;

  @property({ type: Array })
  myCommunities: YpCommunityData[] | undefined;

  @property({ type: Array })
  myDomains: YpDomainData[] | undefined;

  @property({ type: Object })
  adminRights: YpAdminRights | undefined;

  @property({ type: Object })
  memberships: YpMemberships | undefined;

  @property({ type: Number })
  communitiesCount = 0;

  @property({ type: Number })
  groupsCount = 0;

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
    this.addGlobalListener("yp-close-all-drawers", this._closeAllDrawers);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeGlobalListener(
      "yp-close-all-drawers",
      this._closeAllDrawers
    );
  }

  _closeAllDrawers() {
    this.opened = false;
  }

  getGroupTypeName(group: YpGroupData) {
    if (
      group &&
      group.configuration &&
      group.configuration.hideGroupType === true
    ) {
      return "";
    } else if (group && group.configuration && group.configuration.groupType) {
      switch (parseInt(group.configuration.groupType as unknown as string)) {
        case YpGroupType.AllOurIdeas:
          return this.t("pairwiseVoting");
        case YpGroupType.IdeaGenerationAndDebate:
          return this.t("ideas");
        case YpGroupType.PsAgentWorkflow:
          return this.t("workflow");
        case YpGroupType.StaticHtml:
          return this.t("html");
        default:
          return this.t("ideas");
      }
    } else {
      return this.t("ideas");
    }
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
    this.fireGlobal("yp-close-all-drawers");
  }

  _goToGroup(event: CustomEvent) {
    YpNavHelpers.redirectTo(
      "/group/" + (event.target as HTMLElement).getAttribute("data-args")
    );
    this.fire("yp-toggle-nav-drawer");
    this.fireGlobal("yp-close-all-drawers");
  }

  _goToCommunity(event: CustomEvent) {
    YpNavHelpers.redirectTo(
      "/community/" + (event.target as HTMLElement).getAttribute("data-args")
    );
    this.fire("yp-toggle-nav-drawer");
    this.fireGlobal("yp-close-all-drawers");
  }

  _goToDomain(event: CustomEvent) {
    YpNavHelpers.redirectTo(
      "/domain/" + (event.target as HTMLElement).getAttribute("data-args")
    );
    this.fire("yp-toggle-nav-drawer");
    this.fireGlobal("yp-close-all-drawers");
  }

  private _handleKeyActivate(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      (event.currentTarget as HTMLElement).click();
    }
  }

  _userChanged() {
    if (this.user) {
      this._reset();
    }
  }

  _deduplicateById(array: any[]) {
    const ids = new Set();
    const deduplicated = [];
    for (const item of array) {
      if (!ids.has(item.id)) {
        ids.add(item.id);
        deduplicated.push(item);
      }
    }
    return deduplicated;
  }

  _reset() {
    let groupUsers: YpGroupData[] = [];
    let adminGroups: YpGroupData[] = [];
    let communityUsers: YpCommunityData[] = [];
    let adminCommunities: YpCommunityData[] = [];

    if (this.memberships) {
      groupUsers = this.memberships.GroupUsers.filter((item) => {
        return item.name != "hidden_public_group_for_domain_level_points";
      }) as YpGroupData[];

      communityUsers = this.memberships.CommunityUsers.slice(
        0,
        500
      ) as YpCommunityData[];

      this.myDomains = this.memberships.DomainUsers.slice(
        0,
        3
      ) as YpDomainData[];
    }

    if (this.adminRights) {
      if (
        this.adminRights.GroupAdmins &&
        this.adminRights.GroupAdmins.length > 0
      ) {
        adminGroups = this.adminRights.GroupAdmins.filter((item) => {
          return item.name != "hidden_public_group_for_domain_level_points";
        }) as YpGroupData[];
      }

      if (
        this.adminRights.CommunityAdmins &&
        this.adminRights.CommunityAdmins.length > 0
      ) {
        adminCommunities = this.adminRights
          .CommunityAdmins as YpCommunityData[];
      }
    }

    // Combine and deduplicate groups
    const combinedGroups = [...groupUsers, ...adminGroups];
    this.myGroups = this._deduplicateById(combinedGroups).slice(0, 1000);
    this.groupsCount = this.myGroups ? this.myGroups.length : 0;

    // Combine and deduplicate communities
    const combinedCommunities = [...communityUsers, ...adminCommunities];
    this.myCommunities = this._deduplicateById(combinedCommunities).slice(
      0,
      500
    );
    this.communitiesCount = this.myCommunities ? this.myCommunities.length : 0;
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          z-index: 5000;
        }

        .count {
          font-size: 18px;
        }

        .item {
          border-bottom: 3px solid transparent;
        }

        .item:hover {
          border-bottom: 3px solid var(--md-sys-color-primary-container);
        }


        .groupTypeName {
          font-size: 12px;
          text-align: left;
          line-height: 18px;
          font-weight: 500;
          margin-top: 8px;
          margin-left: 8px;
          color: var(--md-sys-color-tertiary);
        }

        .header {
          padding-top: 16px;
          font-weight: 700;
          padding-bottom: 8px;
          font-size: 20px;
          padding-left: 8px;
          line-height: 22px;
          font-family: var(--md-ref-typeface-brand);
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
          background-color: var(--md-sys-color-surface);
        }

        .item {
          cursor: pointer;
          padding: 8px;
          padding-top: 4px;
          padding-bottom: 4px;
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
                <div
                  role="button"
                  tabindex="0"
                  @keydown="${this._handleKeyActivate}"
                  @click="${this._goBack}"
                >
                  ${this.homeLink.name}
                </div>
              </div>
            `
          : nothing}
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
          ${this.myCommunities && this.myCommunities.length > 0
            ? html`
                <div class="header">
                  ${this.t("Communities")}
                  <span class="count">(${this.communitiesCount})</span>
                </div>
                ${this.myCommunities.map(
                  (community) => html`
                    <div class="layout horizontal communityName">
                      <div
                        role="button"
                        class="item"
                        data-args="${community.id}"
                        tabindex="0"
                        @keydown="${this._handleKeyActivate}"
                        @click="${this._goToCommunity}"
                      >
                        ${community.name}
                      </div>
                    </div>
                  `
                )}
              `
            : nothing}
          ${this.myGroups && this.myGroups.length > 0
            ? html`
                <div class="header">
                  ${this.t("Groups")}
                  <span class="count">(${this.groupsCount})</span>
                </div>
                ${this.myGroups.map(
                  (group) => html`
                    <div class="layout vertical">
                      <div class="groupTypeName">
                        ${this.getGroupTypeName(group)}
                      </div>
                      <div class="layout horizontal groupName">
                      <div
                        role="button"
                        class="item"
                        data-args="${group.id}"
                        tabindex="0"
                        @keydown="${this._handleKeyActivate}"
                        @click="${this._goToGroup}"
                      >
                        ${group.name}
                      </div>
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
