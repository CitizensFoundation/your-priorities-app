var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/labs/navigationtab/navigation-tab.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/menu/menu.js";
import "../common/yp-image.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "./yp-admin-config-domain.js";
import "./yp-admin-config-community.js";
import "./yp-admin-config-group.js";
import "./yp-admin-communities.js";
import "./yp-admin-groups.js";
import "./yp-users-grid.js";
import "./yp-content-moderation.js";
import "./yp-pages-grid.js";
import "./yp-admin-translations.js";
import "./yp-admin-reports.js";
import "./yp-organization-grid.js";
const VERSION = "[VI]Version: {version} - built on {date}[/VI]";
import "../yp-collection/yp-domain.js";
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";
import { YpAdminConfigGroup } from "./yp-admin-config-group.js";
let YpAdminApp = class YpAdminApp extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          width: 100vw;
          height: 100vh;
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        body {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        .backContainer {
          margin-top: 0px;
          margin-left: 16px;
        }

        .backIcon {
          margin-bottom: 8px;
          margin-top: 4px;
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 7;
        }

        .drawer {
          width: 300px;
        }

        .headerContainer {
          width: 100%;
          margin-bottom: 8px;
          vertical-align: middle;
          margin-left: 16px;
        }

        .mainHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .collectionLogoImage {
          width: 140px;
          height: 79px;
        }

        .collectionName {
          padding: 8px;
          text-align: center;
          line-height: 1.5;
        }

        .splashImage {
          width: 500px;
          height: 500px;
          margin-top: 32px;
          margin-bottom: 1024px;
        }

        .splashHeader {
          font-size: 1.75rem;
          font-family: monospace;
          margin-top: 64px;
          color: var(--md-sys-color-primary);
        }

        @media (max-width: 1000px) {
          .mainHeaderText {
            margin-top: 48px;
            margin-bottom: 8px;
          }

          .splashImage {
            width: 100%;
            margin-top: 0;
          }

          .splashHeader {
            font-size: 1.75rem;
            margin-bottom: 8px;
          }
        }

        @media (max-width: 400px) {
          .splashHeader {
            font-size: 1.5rem;
            margin-bottom: 8px;
          }
        }

        .ypSmallLogo {
          margin-top: 16px;
        }

        .rightPanel {
          width: 100%;
          min-height: 100vh;
          margin-bottom: 64px;
          margin-top: 32px;
          margin-left: 32px;
        }

        .loadingText {
          margin-top: 48px;
        }

        .titleInPrimaryColor {
          color: var(--md-sys-color-primary);
        }

        .titleInSecondaryColor {
          color: var(--md-sys-color-secondary);
        }

        .nickname {
          font-size: 1.5rem;
          margin-top: 8px;
        }

        .score {
          font-size: 1.5rem;
          margin-top: 16px;
        }

        md-list-item {
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-secondary-container);
          --md-list-list-item-label-text-color: var(--md-sys-color-primary);
        }

        md-navigation-drawer {
          --md-navigation-drawer-container-color: var(--md-sys-color-surface);
        }

        md-list {
          --md-list-container-color: var(--md-sys-color-surface);
        }

        .topAppBar {
          border-radius: 48px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          margin-top: 32px;
          padding: 0px;
          padding-left: 32px;
          padding-right: 32px;
          text-align: center;
        }

        .mainPageContainer {
          margin-top: 16px;
        }

        yp-promotion-dashboard {
          max-width: 1000px;
        }

        @media (max-width: 1000px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
            margin-top: 0;
          }

          yp-promotion-dashboard {
            max-width: 100%;
          }
        }
      `,
        ];
    }
    constructor() {
        super();
        this.page = "configuration";
        this.route = "";
        this.userYpCollection = [];
        this.adminConfirmed = false;
        this.haveCheckedAdminRights = false;
        this.anchor = null;
        this._scrollPositionMap = {};
        this._setupEventListeners();
        this.updatePageFromPath();
    }
    updatePageFromPath() {
        let pathname = window.location.pathname;
        pathname = pathname.replace("/admin", "");
        if (pathname.endsWith("/"))
            pathname = pathname.substring(0, pathname.length - 1);
        if (pathname.startsWith("/"))
            pathname = pathname.substring(1, pathname.length);
        const splitPath = pathname.split("/");
        this.collectionType = splitPath[0];
        if (splitPath[1] == "new" && splitPath[2]) {
            this.collectionId = "new";
            if (window.appGlobals.originalQueryParameters["createCommunityForGroup"]) {
                this.parentCollectionId = window.appGlobals.domain?.id;
            }
            else {
                this.parentCollectionId = parseInt(splitPath[2]);
            }
            this.page = "configuration";
        }
        else {
            this.collectionId = parseInt(splitPath[1]);
            if (splitPath.length > 3) {
                this.page = splitPath[3];
            }
            else if (splitPath.length > 2) {
                this.page = splitPath[2];
            }
            else {
                this.page = "configuration";
            }
        }
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }
    connectedCallback() {
        super.connectedCallback();
        this.updateLocation();
    }
    updateLocation() {
        let path = window.location.pathname;
        path = path.replace("/admin", "");
        const pattern = "/:page";
        const remainingPieces = path.split("/");
        const patternPieces = pattern.split("/");
        const matched = [];
        const namedMatches = {};
        const oldRouteData = structuredClone(this.routeData);
        for (let i = 0; i < patternPieces.length; i++) {
            const patternPiece = patternPieces[i];
            if (!patternPiece && patternPiece !== "") {
                break;
            }
            const pathPiece = remainingPieces.shift();
            // We don't match this path.
            if (!pathPiece && pathPiece !== "") {
                return;
            }
            matched.push(pathPiece);
            if (patternPiece.charAt(0) == ":") {
                namedMatches[patternPiece.slice(1)] = pathPiece;
            }
            else if (patternPiece !== pathPiece) {
                return;
            }
        }
        let tailPath = remainingPieces.join("/");
        if (remainingPieces.length > 0) {
            tailPath = "/" + tailPath;
        }
        this.subRoute = tailPath;
        this.route = path;
        this.routeData = namedMatches;
        this.updatePageFromPath();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._removeEventListeners();
    }
    _pageChanged() {
        const page = this.page;
        //TODO: Get bundling working
        /*if (page) {
          let resolvedPageUrl;
          if (page=="view-404") {
            resolvedPageUrl = this.resolveUrl("yp-view-404.html");
          } else if (page==='community_folder') {
            resolvedPageUrl = this.resolveUrl('../yp-community/yp-community-folder.js?v=@version@');
          } else {
            resolvedPageUrl = this.resolveUrl('/src/yp-' + page + '/' + 'yp-' + page + ".js?v=@version@");
          }
          console.log("Trying to load "+resolvedPageUrl);
          import(resolvedPageUrl).then(null, this._showPage404.bind(this));
        }*/
        if (page) {
            window.appGlobals.analytics.sendToAnalyticsTrackers("send", "pageview", location.pathname);
        }
    }
    tabChanged(event) {
        if (event.detail.activeIndex == 0) {
            this.page = "configuration";
        }
        else if (event.detail.activeIndex == 1) {
            this.page = "moderation";
        }
        else if (event.detail.activeIndex == 3) {
            this.page = "users";
        }
        else if (event.detail.activeIndex == 4) {
            this.page = "admins";
        }
    }
    _setupEventListeners() {
        this.addGlobalListener("yp-logged-in", this._setAdminFromParent.bind(this));
    }
    _refreshAdminRights() {
        window.appUser.recheckAdminRights();
    }
    _removeEventListeners() {
        this.addGlobalListener("yp-logged-in", this._setAdminFromParent.bind(this));
    }
    _refreshGroup() {
        this._refreshByName("#groupPage");
    }
    _refreshCommunity() {
        this._refreshByName("#communityPage");
    }
    _refreshDomain() {
        this._refreshByName("#domainPage");
    }
    _refreshByName(id) {
        const el = this.$$(id);
        // TODO: Get refresh to work
        if (el) {
            //el._refreshAjax();
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("page")) {
            this._pageChanged();
        }
        if (changedProperties.has("collectionType") &&
            this.collectionId &&
            this.collectionId != "new") {
            this.getCollection();
        }
        else if (changedProperties.has("collectionId") &&
            this.collectionId == "new") {
            this._setAdminFromParent();
        }
        if (changedProperties.has("collection")) {
            //console.error("collection", this.collection);
        }
    }
    _needsUpdate() {
        this.requestUpdate();
    }
    updateFromCollection() {
        if (this.collection) {
            this.collection = { ...this.collection };
        }
    }
    renderGroupConfigPage() {
        return html `<yp-admin-config-group
      .collectionType="${this.collectionType}"
      .collection="${this.collection}"
      .collectionId="${this.collectionId}"
      .subRoute="${this.subRoute}"
      @yp-request-update-on-parent="${this.updateFromCollection}"
      .parentCollectionId="${this.parentCollectionId}"
    >
    </yp-admin-config-group>`;
    }
    renderCommunityConfigPage() {
        return html `
      <yp-admin-config-community
        .collectionType="${this.collectionType}"
        .collection="${this.collection}"
        .collectionId="${this.collectionId}"
        .parentCollectionId="${this.parentCollectionId}"
      >
      </yp-admin-config-community>
    `;
    }
    renderDomainConfigPage() {
        return html `
      <yp-admin-config-domain
        .collectionType="${this.collectionType}"
        .collection="${this.collection}"
        .collectionId="${this.collectionId}"
        .parentCollectionId="${this.parentCollectionId}"
      >
      </yp-admin-config-domain>
    `;
    }
    _renderPage() {
        if (this.adminConfirmed) {
            switch (this.page) {
                case "translations":
                    return html `
            ${this.collection
                        ? html `<yp-admin-translations
                  .collectionType="${this.collectionType}"
                  .collection="${this.collection}"
                  .collectionId="${this.collectionId}"
                >
                </yp-admin-translations>`
                        : nothing}
          `;
                case "organizations":
                    return html `
            ${this.collection
                        ? html `<yp-organization-grid
                  .domain="${this.collection}"
                  .domainId="${this.collectionId}"
                >
                </yp-organizations-grid>`
                        : nothing}
          `;
                case "reports":
                    return html `
            ${this.collection
                        ? html `<yp-admin-reports
                  .collectionType="${this.collectionType}"
                  .collection="${this.collection}"
                  .collectionId="${this.collectionId}"
                >
                </yp-yp-admin-reports>`
                        : nothing}
          `;
                case "communities":
                    return html `
            ${this.collection
                        ? html `<yp-admin-communities .domain="${this.collection}">
                </yp-admin-communities>`
                        : nothing}
          `;
                case "user":
                    return html `
            ${true
                        ? html `<yp-admin-user-settings .user="${this.user}">
                </yp-admin-user-settings>`
                        : nothing}
          `;
                case "groups":
                    return html `
            ${this.collection
                        ? html `<yp-admin-groups .community="${this.collection}">
                </yp-admin-groups>`
                        : nothing}
          `;
                case "configuration":
                    switch (this.collectionType) {
                        case "domain":
                            return html `
                ${this.collection || this.collectionId === "new" ? this.renderDomainConfigPage() : nothing}
              `;
                        case "community":
                            return html `
                ${this.collection || this.collectionId === "new"
                                ? this.renderCommunityConfigPage()
                                : nothing}
              `;
                        case "group":
                            return html `
                ${this.collection || this.collectionId === "new"
                                ? this.renderGroupConfigPage()
                                : nothing}
              `;
                        default:
                            return html ``;
                    }
                case "users":
                case "admins":
                    switch (this.collectionType) {
                        case "domain":
                            return html `
                ${this.collection
                                ? html `<yp-users-grid
                      .adminUsers="${this.page == "admins"}"
                      .domainId="${this.collectionId}"
                    >
                    </yp-users-grid>`
                                : nothing}
              `;
                        case "community":
                            return html `
                ${this.collection
                                ? html `<yp-users-grid
                      .adminUsers="${this.page == "admins"}"
                      .communityId="${this.collectionId}"
                    >
                    </yp-users-grid>`
                                : nothing}
              `;
                        case "group":
                            return html `
                ${this.collection
                                ? html `<yp-users-grid
                      .adminUsers="${this.page == "admins"}"
                      .groupId="${this.collectionId}"
                    >
                    </yp-users-grid>`
                                : nothing}
              `;
                        default:
                            return html ``;
                    }
                case "moderation":
                    switch (this.collectionType) {
                        case "domain":
                            return html `
                ${this.collection
                                ? html `<yp-content-moderation
                      .domainId="${this.collectionId}"
                    >
                    </yp-content-moderation>`
                                : nothing}
              `;
                        case "community":
                            return html `
                ${this.collection
                                ? html `<yp-content-moderation
                      .communityId="${this.collectionId}"
                    >
                    </yp-content-moderation>`
                                : nothing}
              `;
                        case "group":
                            return html `
                ${this.collection
                                ? html `<yp-content-moderation
                      .groupId="${this.collectionId}"
                    >
                    </yp-content-moderation>`
                                : nothing}
              `;
                        default:
                            return html ``;
                    }
                case "pages":
                    switch (this.collectionType) {
                        case "domain":
                            return html `
                ${this.collection
                                ? html `<yp-pages-grid
                      .domainId="${this.collectionId}"
                    >
                    </yp-pages-grid>`
                                : nothing}
              `;
                        case "community":
                            return html `
                ${this.collection
                                ? html `<yp-pages-grid
                      .communityId="${this.collectionId}"
                    >
                    </yp-pages-grid>`
                                : nothing}
              `;
                        case "group":
                            return html `
                ${this.collection
                                ? html `<yp-pages-grid
                      .groupId="${this.collectionId}"
                    >
                    </yp-pages-grid>`
                                : nothing}
              `;
                        default:
                            return html ``;
                    }
                default:
                    return html ``;
            }
        }
        else {
            return nothing;
        }
    }
    async getCollection() {
        const collectionData = (await window.serverApi.getCollection(this.collectionType, this.collectionId));
        if (this.collectionType == "group") {
            this.collection = collectionData.group;
            if (!this.collection.configuration) {
                this.collection.configuration = {};
            }
        }
        else {
            this.collection = collectionData;
        }
        this._setAdminConfirmed();
    }
    async _getAdminCollection() {
        switch (this.collectionType) {
            case "community":
            case "domain":
                const communityParentCollection = await window.serverApi.getCollection("domain", this.parentCollectionId);
                this._setAdminConfirmedFromParent(communityParentCollection);
                break;
            case "group":
                if (window.appGlobals.originalQueryParameters["createCommunityForGroup"]) {
                    const groupParentCollection = await window.serverApi.getCollection("domain", this.parentCollectionId);
                    this._setAdminConfirmedFromParent(groupParentCollection);
                }
                else {
                    const groupParentCollection = await window.serverApi.getCollection("community", this.parentCollectionId);
                    this._setAdminConfirmedFromParent(groupParentCollection);
                }
                break;
            default:
                this.fire("yp-network-error", { message: this.t("unauthorized") });
        }
    }
    async _setAdminFromParent() {
        if (window.appGlobals.originalQueryParameters["createCommunityForGroup"]) {
            this.parentCollectionId = window.appGlobals.domain?.id;
        }
        const checkLoginStatus = async (attemptsLeft) => {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    if (window.appUser.loggedIn()) {
                        clearInterval(interval);
                        resolve(true);
                    }
                    else {
                        attemptsLeft--;
                        if (attemptsLeft <= 0) {
                            clearInterval(interval);
                            resolve(false);
                        }
                    }
                }, 100);
            });
        };
        const loggedIn = await checkLoginStatus(7);
        if (loggedIn) {
            this._getAdminCollection();
        }
        else {
            window.appUser.openUserlogin();
        }
    }
    _setAdminConfirmedFromParent(collection) {
        let adminConfirmed = false;
        if (collection) {
            switch (this.collectionType) {
                case "community":
                case "domain":
                    adminConfirmed = YpAccessHelpers.checkDomainAccess(collection);
                    if (!adminConfirmed) {
                        if (!collection.configuration
                            .onlyAdminsCanCreateCommunities &&
                            window.appUser.user) {
                            adminConfirmed = true;
                        }
                    }
                    break;
                case "group":
                    if (window.appGlobals.originalQueryParameters["createCommunityForGroup"]) {
                        adminConfirmed = YpAccessHelpers.checkDomainAccess(collection);
                    }
                    else {
                        adminConfirmed = YpAccessHelpers.checkCommunityAccess(collection);
                    }
                    if (!adminConfirmed) {
                        if (!collection.configuration
                            .onlyAdminsCanCreateGroups &&
                            window.appUser.user) {
                            adminConfirmed = true;
                        }
                    }
                    break;
            }
            this.adminConfirmed = adminConfirmed;
            if (!adminConfirmed) {
                this.fire("yp-network-error", { message: this.t("unauthorized") });
            }
        }
    }
    _setAdminConfirmed() {
        if (this.collection) {
            switch (this.collectionType) {
                case "domain":
                    this.adminConfirmed = YpAccessHelpers.checkDomainAccess(this.collection);
                    break;
                case "community":
                    this.adminConfirmed = YpAccessHelpers.checkCommunityAccess(this.collection);
                    break;
                case "group":
                    this.adminConfirmed = YpAccessHelpers.checkGroupAccess(this.collection);
                    break;
                case "post":
                    this.adminConfirmed = YpAccessHelpers.checkPostAccess(this.collection);
                    break;
            }
        }
        if (this.collection &&
            this.haveCheckedAdminRights &&
            !this.adminConfirmed) {
            this.fire("yp-network-error", { message: this.t("unauthorized") });
        }
    }
    getParentCollectionType() {
        switch (this.collectionType) {
            case "group":
                return "community";
            case "community":
                return "domain";
            case "domain":
                return "domain";
            default:
                return "";
        }
    }
    exitToMainApp() {
        this.active = false;
        if (this.collectionId === "new") {
            if (window.appGlobals.originalQueryParameters["createCommunityForGroup"]) {
                YpNavHelpers.redirectTo(`/domain/${this.parentCollectionId}`);
            }
            else {
                YpNavHelpers.redirectTo(`/${this.getParentCollectionType()}/${this.parentCollectionId}`);
            }
        }
        else {
            YpNavHelpers.redirectTo(`/${this.collectionType}/${this.collectionId}`);
        }
    }
    render() {
        return html `
      <div class="layout horizontal" ?hidden="${!this.adminConfirmed}">
        ${this.renderNavigationBar()}
        <div class="rightPanel">
          <main>
            <div class="mainPageContainer">${this._renderPage()}</div>
          </main>
        </div>
      </div>
      <md-linear-progress
        indeterminate
        ?hidden="${this.adminConfirmed}"
      ></md-linear-progress>
    `;
    }
    _isPageSelectedClass(page) {
        if (page === this.page) {
            return "selectedContainer";
        }
        else {
            return "";
        }
    }
    _getListHeadline(type) {
        if (type === "configuration") {
            if (this.collectionType === "domain") {
                return this.t("Domain Configuration");
            }
            else if (this.collectionType === "community") {
                return this.t("Community Configuration");
            }
            else if (this.collectionType === "group") {
                return this.t("Group Configuration");
            }
            else if (this.collectionType === "post") {
                return this.t("Yp Configuration");
            }
            else if (this.collectionType === "profile_image") {
                return this.t("Profile Image Configuration");
            }
        }
        else if (type === "translations") {
            return this.t("Translations");
        }
        else if (type === "organizations") {
            return this.t("Organizations");
        }
        else if (type === "reports") {
            return this.t("reports");
        }
        else if (type === "users") {
            return this.t("Users");
        }
        else if (type === "admins") {
            return this.t("Admins");
        }
        else if (type === "moderation") {
            return this.t("Moderation");
        }
        else if (type === "aiAnalysis") {
            return this.t("aiAnalysis");
        }
        else if (type == "pages") {
            return this.t("Pages");
        }
        else if (type == "groups") {
            return this.t("Groups");
        }
        else if (type == "communities") {
            return this.t("Communities");
        }
        else if (type == "user") {
            return this.t("Settings");
        }
        else if (type == "badges") {
            return this.t("Badges");
        }
        else if (type == "profile_images") {
            return this.t("Profile Images");
        }
        else if (type == "back") {
            if (this.collectionType === "community") {
                return this.t("Back to domain");
            }
            else if (this.collectionType === "group") {
                return this.t("Back to community");
            }
            else if (this.collectionType === "post" ||
                this.collectionType === "profile_image") {
                return this.t("Back to group");
            }
        }
        return "";
    }
    _getListSupportingText(type) {
        if (type === "configuration") {
            if (this.collectionType === "domain") {
                return this.t("Configure your domain");
            }
            else if (this.collectionType === "community") {
                return this.t("Configure your community");
            }
            else if (this.collectionType === "group") {
                return this.t("Configure your group");
            }
            else if (this.collectionType === "post") {
                return this.t("Configure your yp");
            }
            else if (this.collectionType === "profile_image") {
                return this.t("Configure profile image");
            }
        }
        else if (type === "reports") {
            return this.t("reportsInfo");
        }
        else if (type === "organizations") {
            return this.t("organizationsAdmin");
        }
        else if (type === "translations") {
            if (this.collectionType === "domain") {
                return this.t("Translate your domain");
            }
            else if (this.collectionType === "community") {
                return this.t("Translate your community");
            }
            else if (this.collectionType === "group") {
                return this.t("Translate your group");
            }
            else if (this.collectionType === "post") {
                return this.t("Translate your yp");
            }
        }
        else if (type === "back") {
            if (this.collectionType === "community") {
                return this.t("Back to domain");
            }
            else if (this.collectionType === "group") {
                return this.t("Back to community");
            }
            else if (this.collectionType === "post") {
                return this.t("Back to group");
            }
            else if (this.collectionType === "profile_image") {
                return this.t("Back to group");
            }
        }
        else if (type === "users") {
            if (this.collectionType === "domain") {
                return this.t("Manage domain users");
            }
            else if (this.collectionType === "community") {
                return this.t("Manage community users");
            }
            else if (this.collectionType === "group") {
                return this.t("Manage group users");
            }
        }
        else if (type === "admins") {
            if (this.collectionType === "domain") {
                return this.t("Manage domain admins");
            }
            else if (this.collectionType === "community") {
                return this.t("Manage community admins");
            }
            else if (this.collectionType === "group") {
                return this.t("Manage group admins");
            }
        }
        else if (type === "aiAnalysis") {
            return this.t("aiAnalysis");
        }
        else if (type === "moderation") {
            if (this.collectionType === "domain") {
                return this.t("Moderate domain");
            }
            else if (this.collectionType === "community") {
                return this.t("Moderate community");
            }
            else if (this.collectionType === "group") {
                return this.t("Moderate group");
            }
        }
        else if (type === "pages") {
            if (this.collectionType === "domain") {
                return this.t("Manage domain pages");
            }
            else if (this.collectionType === "community") {
                return this.t("Manage community pages");
            }
            else if (this.collectionType === "group") {
                return this.t("Manage group pages");
            }
        }
        else if (type === "posts") {
            return this.t("Manage posts");
        }
        else if (type === "groups") {
            return this.t("Manage groups");
        }
        else if (type === "communities") {
            return this.t("Manage communities");
        }
        else if (type === "user") {
            return this.t("Theme, language, etc.");
        }
        else if (type === "badges") {
            return this.t("Manage badges");
        }
        else if (type === "profile_images") {
            return this.t("Manage profile images");
        }
        return "";
    }
    _getListIcon(type) {
        if (type === "configuration") {
            return "settings";
        }
        else if (type === "translations") {
            return "translate";
        }
        else if (type === "organizations") {
            return "add_business";
        }
        else if (type === "reports") {
            return "download";
        }
        else if (type === "users") {
            return "supervised_user_circle";
        }
        else if (type === "admins") {
            return "supervisor_account";
        }
        else if (type === "moderation") {
            return "checklist";
        }
        else if (type === "aiAnalysis") {
            return "document_scanner";
        }
        else if (type === "pages") {
            return "description";
        }
        else if (type === "posts") {
            return "rocket_launch";
        }
        else if (type === "groups") {
            return "videogroup_asset";
        }
        else if (type === "communities") {
            return "category";
        }
        else if (type === "badges") {
            return "workspace_premium";
        }
        else if (type === "profile_images") {
            return "supervised_user_circle";
        }
        else if (type === "user") {
            return "person";
        }
        else if (type === "back") {
            return "arrow_back";
        }
        return "";
    }
    setPage(type) {
        if (this.collectionType === "group") {
            if (type == "back") {
                YpNavHelpers.redirectTo(`/admin/community/${this.parentCollectionId}/groups`);
            }
            else if (type == "profile_images") {
                YpNavHelpers.redirectTo(`/admin/group/${this.collectionId}/profile_images`);
            }
            else if (type == "posts") {
                YpNavHelpers.redirectTo(`/group/${this.collectionId}/posts`);
            }
            else {
                this.page = type;
            }
        }
        else if (this.collectionType === "community") {
            if (type == "back") {
                YpNavHelpers.redirectTo(`/admin/domain/${this.collection.domain_id}/communities`);
            }
            else {
                this.page = type;
            }
        }
        else {
            this.page = type;
        }
        this.fireGlobal("yp-refresh-admin-content");
    }
    renderMenuListItem(type) {
        return html `
      <md-list-item
        type="button"
        @click="${() => this.setPage(type)}"
        class="${this._isPageSelectedClass(type)}"
      >
        <div slot="headline">${this._getListHeadline(type) || ""}</div>
        <div slot="supporting-text">
          ${this._getListSupportingText(type) || ""}
        </div>
        <md-icon slot="start">${this._getListIcon(type) || ""}</md-icon>
      </md-list-item>
    `;
    }
    get isAllOurIdeasGroupType() {
        if (this.collection) {
            return (this.collectionType === "group" &&
                this.collection.configuration.groupType ==
                    YpAdminConfigGroup.GroupType.allOurIdeas);
            console.error("TURE");
        }
        else {
            return false;
        }
    }
    renderNavigationBar() {
        if (this.wide) {
            return html `
        <div class="drawer">
          <div class="layout horizontal backContainer">
            <md-icon-button class="backIcon" @click="${this.exitToMainApp}">
              <md-icon>close</md-icon>
            </md-icon-button>
          </div>
          <div
            class="layout horizontal headerContainer"
            ?hidden="${this.collectionId == "new"}"
          >
            <div class="analyticsHeaderText layout vertical center-center">
              <yp-image
                class="collectionLogoImage"
                sizing="contain"
                .src="${this.collection
                ? YpCollectionHelpers.logoImagePath(this.collectionType, this.collection)
                : ""}"
              ></yp-image>
              <div class="collectionName">
                ${this.collection ? this.collection.name : ""}
              </div>
            </div>
          </div>

          <md-list>
            ${this.renderMenuListItem("configuration")}
            ${this.collectionId != "new"
                ? html `
                  ${this.collectionType !== "post"
                    ? html `
                        <md-divider></md-divider>

                        ${this.renderMenuListItem("users")}
                        ${this.renderMenuListItem("admins")}
                        ${!this.isAllOurIdeasGroupType
                        ? this.renderMenuListItem("moderation")
                        : nothing}
                        ${this.renderMenuListItem("pages")}
                        ${this.collectionType != "domain"
                        ? html `
                              ${this.renderMenuListItem("reports")}
                              ${this.renderMenuListItem("translations")}
                            `
                        : html ` ${this.renderMenuListItem("organizations")}`}
                        ${!this.isAllOurIdeasGroupType
                        ? /*this.renderMenuListItem("aiAnalysis")*/ nothing
                        : nothing}
                      `
                    : html ``}
                `
                : nothing}
          </md-list>
        </div>
      `;
        }
        else {
            return html `
        <div class="navContainer">
          <md-navigation-bar @navigation-bar-activated="${this.tabChanged}">
            <md-navigation-tab .label="${this.t("Config")}"
              ><md-icon slot="activeIcon">settings</md-icon>
              <md-icon slot="inactiveIcon"
                >rocket_launch</md-icon
              ></md-navigation-tab
            >

            <md-navigation-tab .label="${this.t("Moderation")}">
              <md-icon slot="activeIcon">checklist</md-icon>
              <md-icon slot="inactiveIcon">checklist</md-icon>
            </md-navigation-tab>

            <md-navigation-tab .label="${this.t("Users")}">
              <md-icon slot="activeIcon">group</md-icon>
              <md-icon slot="inactiveIcon">group</md-icon>
            </md-navigation-tab>

            <md-navigation-tab .label="${this.t("Admins")}">
              <md-icon slot="activeIcon">supervisor_account</md-icon>
              <md-icon slot="inactiveIcon">supervisor_account</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `;
        }
    }
};
__decorate([
    property({ type: String })
], YpAdminApp.prototype, "page", void 0);
__decorate([
    property({ type: Object })
], YpAdminApp.prototype, "user", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], YpAdminApp.prototype, "active", void 0);
__decorate([
    property({ type: String })
], YpAdminApp.prototype, "route", void 0);
__decorate([
    property({ type: String })
], YpAdminApp.prototype, "subRoute", void 0);
__decorate([
    property({ type: Object })
], YpAdminApp.prototype, "routeData", void 0);
__decorate([
    property({ type: Array })
], YpAdminApp.prototype, "userYpCollection", void 0);
__decorate([
    property({ type: String })
], YpAdminApp.prototype, "forwardToYpId", void 0);
__decorate([
    property({ type: String })
], YpAdminApp.prototype, "headerTitle", void 0);
__decorate([
    property({ type: String })
], YpAdminApp.prototype, "collectionType", void 0);
__decorate([
    property({ type: Number })
], YpAdminApp.prototype, "collectionId", void 0);
__decorate([
    property({ type: Number })
], YpAdminApp.prototype, "parentCollectionId", void 0);
__decorate([
    property({ type: Object })
], YpAdminApp.prototype, "parentCollection", void 0);
__decorate([
    property({ type: Object })
], YpAdminApp.prototype, "collection", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminApp.prototype, "adminConfirmed", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminApp.prototype, "haveCheckedAdminRights", void 0);
YpAdminApp = __decorate([
    customElement("yp-admin-app")
], YpAdminApp);
export { YpAdminApp };
//# sourceMappingURL=yp-admin-app.js.map