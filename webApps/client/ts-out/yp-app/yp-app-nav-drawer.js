var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/progress/linear-progress.js";
import "../common/languages/yp-language-selector.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
let YpAppNavDrawer = class YpAppNavDrawer extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.opened = false;
        this.spinner = false;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("user")) {
            this._userChanged();
        }
        if (changedProperties.has("opened")) {
            this._openChanged();
        }
    }
    connectedCallback() {
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
            YpNavHelpers.redirectTo("/" + this.homeLink.type + "/" + this.homeLink.id);
            this.fire("yp-toggle-nav-drawer");
        }
    }
    _goToGroup(event) {
        YpNavHelpers.redirectTo("/group/" + event.target.getAttribute("data-args"));
        this.fire("yp-toggle-nav-drawer");
    }
    _goToCommunity(event) {
        YpNavHelpers.redirectTo("/community/" + event.target.getAttribute("data-args"));
        this.fire("yp-toggle-nav-drawer");
    }
    _goToDomain(event) {
        YpNavHelpers.redirectTo("/domain/" + event.target.getAttribute("data-args"));
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
            this.myGroups = groupUsers.slice(0, 1000);
            this.myCommunities = this.memberships.CommunityUsers.slice(0, 500);
            this.myDomains = this.memberships.DomainUsers.slice(0, 3);
        }
        else {
            this.myGroups = undefined;
            this.myCommunities = undefined;
            this.myDomains = undefined;
        }
        if (this.adminRights &&
            this.adminRights.CommunityAdmins &&
            this.adminRights.CommunityAdmins.length > 0) {
            this.myAdminCommunities = this.adminRights.CommunityAdmins;
        }
        else {
            this.myAdminCommunities = undefined;
        }
        if (this.adminRights &&
            this.adminRights.GroupAdmins &&
            this.adminRights.GroupAdmins.length > 0) {
            const groupAdmins = this.adminRights.GroupAdmins.filter((item) => {
                return item.name != "hidden_public_group_for_domain_level_points";
            });
            this.myAdminGroups = groupAdmins;
        }
        else {
            this.myAdminGroups = undefined;
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        .header {
          padding-top: 16px;
          font-weight: bold;
          padding-bottom: 8px;
          font-size: 18px;
          padding-left: 8px;
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
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
        }

        .item {
          cursor: pointer;
          padding: 8px;
        }

        md-icon {
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
    render() {
        return html `
      <div class="material">
        ${this.homeLink
            ? html `
              <div class="header layout vertical center-center">
                <md-icon icon="home" @click="${this._goBack}"></md-icon>
                <div role="button" @click="${this._goBack}">
                  ${this.homeLink.name}
                </div>
              </div>
            `
            : nothing}
        <div class="languageSelector layout vertical self-start">
          <yp-language-selector
            class="languageSelector"
            selected-locale="{{selectedLocale}}"
          ></yp-language-selector>
        </div>

        <div class="layout horizontal center-center">
          ${this.renderThemeToggle()}
        </div>

        ${this.spinner
            ? html `<md-linear-progress indeterminate></md-linear-progress>`
            : nothing}

        <div
          class="layout vertical"
          role="navigation"
          aria-label="Community & Group navigation"
        >
          ${this.myAdminCommunities
            ? html `
                <div class="header">${this.t("myAdminCommunities")}</div>
                ${this.myAdminCommunities.map((community) => html `
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
                  `)}
              `
            : nothing}
          ${this.myAdminGroups
            ? html `
                <div class="header">${this.t("myAdminGroups")}</div>
                ${this.myAdminGroups.map((group) => html `
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
                  `)}
              `
            : nothing}
          ${this.myCommunities
            ? html `
                <div class="header">${this.t("myCommunities")}</div>
                ${this.myCommunities.map((community) => html `
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
                  `)}
              `
            : nothing}
          ${this.myGroups
            ? html `
                <div class="header">${this.t("myGroups")}</div>
                ${this.myGroups.map((group) => html `
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
                  `)}
              `
            : nothing}
        </div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Object })
], YpAppNavDrawer.prototype, "homeLink", void 0);
__decorate([
    property({ type: Object })
], YpAppNavDrawer.prototype, "user", void 0);
__decorate([
    property({ type: Boolean })
], YpAppNavDrawer.prototype, "opened", void 0);
__decorate([
    property({ type: Boolean })
], YpAppNavDrawer.prototype, "spinner", void 0);
__decorate([
    property({ type: String })
], YpAppNavDrawer.prototype, "route", void 0);
__decorate([
    property({ type: Array })
], YpAppNavDrawer.prototype, "myAdminGroups", void 0);
__decorate([
    property({ type: Array })
], YpAppNavDrawer.prototype, "myAdminCommunities", void 0);
__decorate([
    property({ type: Array })
], YpAppNavDrawer.prototype, "myGroups", void 0);
__decorate([
    property({ type: Array })
], YpAppNavDrawer.prototype, "myCommunities", void 0);
__decorate([
    property({ type: Array })
], YpAppNavDrawer.prototype, "myDomains", void 0);
__decorate([
    property({ type: Object })
], YpAppNavDrawer.prototype, "adminRights", void 0);
__decorate([
    property({ type: Object })
], YpAppNavDrawer.prototype, "memberships", void 0);
YpAppNavDrawer = __decorate([
    customElement("yp-app-nav-drawer")
], YpAppNavDrawer);
export { YpAppNavDrawer };
//# sourceMappingURL=yp-app-nav-drawer.js.map