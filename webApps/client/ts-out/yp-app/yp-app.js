/*
import './yp-app-nav-drawer.js';
import '../yp-dialog-container/yp-dialog-container.js';
import '../yp-user/yp-user-image.js';
import '../yp-app-globals/yp-sw-update-toast.js';
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import "../ac-notifications/ac-notification-list.js";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cache } from "lit/directives/cache.js";
import "@material/mwc-snackbar";
import "@material/mwc-drawer";
//import { Drawer } from '@material/mwc-drawer';
//import '@material/mwc-drawer';
import "@material/web/button/text-button.js";
import "@material/web/labs/badge/badge.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import "@material/web/button/text-button.js";
import "@material/mwc-top-app-bar";
import { YpBaseElement } from "../common/yp-base-element.js";
import { YpAppStyles } from "./YpAppStyles.js";
import { YpAppGlobals } from "./YpAppGlobals.js";
import { YpAppUser } from "./YpAppUser.js";
import { YpServerApi } from "../common/YpServerApi.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import "../yp-dialog-container/yp-app-dialogs.js";
import "../yp-collection/yp-domain.js";
import "../yp-collection/yp-community.js";
import "../yp-collection/yp-group.js";
import "./yp-app-nav-drawer.js";
import "../yp-post/yp-post.js";
import { Corner } from "@material/web/menu/menu.js";
import { YpServerApiAdmin } from "../common/YpServerApiAdmin.js";
let YpApp = class YpApp extends YpBaseElement {
    constructor() {
        super();
        this.appMode = "main";
        this.showSearch = false;
        this.showBack = false;
        this.loadingAppSpinner = false;
        this.hideHelpIcon = false;
        this.autoTranslate = false;
        this.showBackToPost = false;
        this.pages = [];
        this.route = "";
        this.routeData = {};
        this.userDrawerOpened = false;
        this.anchor = null;
        this.previousSearches = [];
        this.useHardBack = false;
        this._scrollPositionMap = {};
        this.goForwardCount = 0;
        this.firstLoad = true;
        this.userDrawerOpenedDelayed = false;
        this.navDrawOpenedDelayed = false;
        this.haveLoadedAdminApp = false;
        this.haveLoadedPromotionApp = false;
        window.app = this;
        window.serverApi = new YpServerApi();
        window.adminServerApi = new YpServerApiAdmin();
        window.appGlobals = new YpAppGlobals(window.serverApi);
        window.appUser = new YpAppUser(window.serverApi);
        window.appGlobals.setupTranslationSystem();
    }
    connectedCallback() {
        super.connectedCallback();
        console.log("App Starting __VERSION__");
        this._setupEventListeners();
        this._setupSamlCallback();
        this.updateLocation();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._removeEventListeners();
    }
    async updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("appMode")) {
            if (!this.haveLoadedAdminApp && this.appMode == "admin") {
                this.loadingAppSpinner = true;
                await this.updateComplete;
                import("../admin/yp-admin-app.js");
                this.haveLoadedAdminApp = true;
                this.loadingAppSpinner = false;
            }
            if (!this.haveLoadedPromotionApp &&
                (this.appMode == "analytics" || this.appMode == "promotion")) {
                console.log("Loading promotion app");
                this.loadingAppSpinner = true;
                await this.updateComplete;
                await import("../analytics-and-promotion/yp-promotion-app.js");
                this.haveLoadedPromotionApp = true;
                this.loadingAppSpinner = false;
            }
        }
    }
    _navDrawOpened(event) {
        setTimeout(() => {
            this.navDrawOpenedDelayed = event.detail;
        }, 500);
    }
    _netWorkError(event) {
        const detail = event.detail;
        let errorText = this.t("generalError")
            ? this.t("generalError")
            : "Can't connect to server, try again later";
        let statusCode = -1;
        if (detail.response && detail.response.status === 404)
            errorText = this.t("errorNotFound");
        else if (detail.response && detail.response.status === 401)
            errorText = this.t("errorNotAuthorized");
        else if (detail.response &&
            detail.response.status === 500 &&
            detail.response.message == "SequelizeUniqueConstraintError")
            errorText = this.t("user.alreadyRegisterred");
        else if (detail.errorText)
            errorText = detail.errorText;
        if (detail.response && detail.response.status)
            statusCode = detail.response.status;
        if (detail.showUserError) {
            this.notifyDialogText = errorText;
            this.$$("#dialog").open = true;
        }
        console.error(`Can't connect to server. ${statusCode} ${detail.jsonError}`);
    }
    _setupEventListeners() {
        this.addGlobalListener("yp-auto-translate", this._autoTranslateEvent.bind(this));
        this.addGlobalListener("yp-theme-configuration-updated", this._themeUpdated);
        this.addGlobalListener("yp-change-header", this._onChangeHeader.bind(this));
        this.addGlobalListener("yp-logged-in", this._onUserChanged.bind(this));
        this.addGlobalListener("yp-network-error", this._netWorkError.bind(this));
        this.addListener("yp-add-back-community-override", this._addBackCommunityOverride, this);
        this.addListener("yp-reset-keep-open-for-page", this._resetKeepOpenForPage, this);
        this.addListener("yp-open-login", this._login, this);
        this.addListener("yp-open-page", this._openPageFromEvent, this);
        this.addGlobalListener("yp-open-toast", this._openToast.bind(this));
        this.addListener("yp-open-notify-dialog", this._openNotifyDialog, this);
        this.addListener("yp-dialog-closed", this._dialogClosed, this);
        this.addListener("yp-language-name", this._setLanguageName, this);
        this.addGlobalListener("yp-refresh-domain", this._refreshDomain.bind(this));
        this.addGlobalListener("yp-refresh-community", this._refreshCommunity.bind(this));
        this.addGlobalListener("yp-refresh-group", this._refreshGroup.bind(this));
        this.addListener("yp-close-right-drawer", this._closeRightDrawer, this);
        this.addListener("yp-set-number-of-un-viewed-notifications", this._setNumberOfUnViewedNotifications, this);
        this.addListener("yp-redirect-to", this._redirectTo, this);
        this.addListener("yp-set-home-link", this._setHomeLink, this);
        this.addListener("yp-set-next-post", this._setNextPost, this);
        this.addListener("yp-set-pages", this._setPages, this);
        this.addListener("yp-clipboard-copy-notification", this._haveCopiedNotification, this);
        window.addEventListener("locationchange", this.updateLocation.bind(this));
        window.addEventListener("location-changed", this.updateLocation.bind(this));
        window.addEventListener("popstate", this.updateLocation.bind(this));
        this.addListener("yp-app-dialogs-ready", this._appDialogsReady.bind(this));
        this._setupTouchEvents();
    }
    _themeUpdated(event) {
        window.appGlobals.theme.updateLiveFromConfiguration(event.detail);
    }
    _removeEventListeners() {
        this.removeGlobalListener("yp-auto-translate", this._autoTranslateEvent);
        this.removeGlobalListener("yp-change-header", this._onChangeHeader);
        this.removeGlobalListener("yp-logged-in", this._onUserChanged);
        this.removeGlobalListener("yp-network-error", this._netWorkError);
        this.removeGlobalListener("yp-theme-configuration-updated", this._themeUpdated);
        this.removeListener("yp-add-back-community-override", this._addBackCommunityOverride, this);
        this.removeListener("yp-reset-keep-open-for-page", this._resetKeepOpenForPage, this);
        this.removeListener("yp-open-login", this._login, this);
        this.removeListener("yp-open-page", this._openPageFromEvent, this);
        this.removeGlobalListener("yp-open-toast", this._openToast.bind(this));
        this.removeListener("yp-open-notify-dialog", this._openNotifyDialog, this);
        this.removeListener("yp-dialog-closed", this._dialogClosed, this);
        this.removeListener("yp-language-name", this._setLanguageName, this);
        this.removeGlobalListener("yp-refresh-domain", this._refreshDomain);
        this.removeGlobalListener("yp-refresh-community", this._refreshCommunity);
        this.removeGlobalListener("yp-refresh-group", this._refreshGroup);
        this.removeListener("yp-close-right-drawer", this._closeRightDrawer, this);
        this.removeListener("yp-set-number-of-un-viewed-notifications", this._setNumberOfUnViewedNotifications, this);
        this.removeListener("yp-redirect-to", this._redirectTo, this);
        this.removeListener("yp-set-home-link", this._setHomeLink, this);
        this.removeListener("yp-set-next-post", this._setNextPost, this);
        this.removeListener("yp-set-pages", this._setPages, this);
        this.removeListener("yp-clipboard-copy-notification", this._haveCopiedNotification, this);
        window.removeEventListener("locationchange", this.updateLocation);
        window.removeEventListener("location-changed", this.updateLocation);
        window.removeEventListener("popstate", this.updateLocation);
        this.removeListener("yp-app-dialogs-ready", this._appDialogsReady.bind(this));
        this._removeTouchEvents();
    }
    static get styles() {
        return [super.styles, YpAppStyles];
    }
    _haveCopiedNotification() {
        this.notifyDialogText = this.t("copiedToClipboard");
        this.$$("#dialog").open = true;
    }
    _appDialogsReady(event) {
        if (event.detail) {
            window.appDialogs = event.detail;
        }
    }
    updateLocation() {
        let path = window.location.pathname;
        if (path.includes("/admin")) {
            this.appMode = "admin";
            path = path.replace("/admin", "");
        }
        else if (path.includes("/promotion")) {
            this.appMode = "promotion";
            path = path.replace("/promotion", "");
        }
        else if (path.includes("/analytics")) {
            this.appMode = "analytics";
            path = path.replace("/analytics", "");
        }
        else {
            this.appMode = "main";
        }
        const pattern = "/:page";
        const remainingPieces = path.split("/");
        const patternPieces = pattern.split("/");
        const matched = [];
        const namedMatches = {};
        const oldRouteData = { ...this.routeData };
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
        this._routeChanged();
        this._routePageChanged(oldRouteData);
    }
    //TODO: Use https://boguz.github.io/burgton-button-docs/
    renderNavigationIcon() {
        let icons;
        if (this.closePostHeader)
            icons = html `<md-icon-button
        title="${this.t("close")}"
        @click="${this._closePost}"
        ><md-icon>close</md-icon></md-icon-button
      >`;
        else
            icons = html ` <md-icon-button
        title="${this.t("goBack")}"
        slot="actionItems"
        ?hidden="${!this.backPath}"
        @click="${this.goBack}"
        ><md-icon>arrow_upward</md-icon>
      </md-icon-button>`;
        return html `${icons}
    ${this.goForwardToPostId
            ? html `
          <md-icon-button
            title="${this.t("forwardToPost")}"
            @click="${this._goToNextPost}"
            ><md-icon>fast_forward</md-icon></md-icon-button
          >
        `
            : nothing}`;
    }
    _openHelpMenu() {
        this.$$("#helpMenu").open = true;
    }
    renderActionItems() {
        return html `
      <md-icon-button
        id="translationButton"
        slot="actionItems"
        class="topActionItem"
        ?hidden="${!this.autoTranslate}"
        @click="${window.appGlobals.stopTranslation}"
        .label="${this.t("stopAutoTranslate")}"
        ><md-icon>translate</md-icon>
      </md-icon-button>

      <md-icon-button
        id="helpIconButton"
        slot="actionItems"
        class="topActionItem"
        @click="${this._toggleNavDrawer}"
        title="${this.t("menu.help")}"
        ><md-icon>menu</md-icon></md-icon-button
      >

      <div
        style="position: relative;"
        ?hidden="${this.hideHelpIcon}"
        slot="actionItems"
      >
        <span style="position: relative">
          <md-icon-button
            id="helpIconButton"
            class="topActionItem"
            @click="${this._openHelpMenu}"
            title="${this.t("menu.help")}"
            ><md-icon>help_outline</md-icon>
          </md-icon-button>
          <md-menu
            id="helpMenu"
            positioning="popover"
            .menuCorner="${Corner.START_END}"
            anchor="helpIconButton"
          >
            ${this.translatedPages(this.pages).map((page, index) => html `
                <md-menu-item
                  data-args="${index}"
                  @click="${this._openPageFromMenu}"
                >
                  <div slot="headline">${this._getLocalizePageTitle(page)}</div>
                </md-menu-item>
              `)}
          </md-menu>
        </span>
      </div>

      ${this.user
            ? html `
            <md-icon-button
              class="userImageNotificationContainer layout horizontal"
              @click="${this._toggleUserDrawer}"
              slot="actionItems"
            >
              <yp-user-image id="userImage" small .user="${this.user}">
              </yp-user-image>
              <md-badge
                id="notificationBadge"
                class="activeBadge"
                .value="${this.numberOfUnViewedNotifications}"
                ?hidden="${!this.numberOfUnViewedNotifications}"
              >
              </md-badge>
            </md-icon-button>
          `
            : html `
            <md-icon-button
              slot="actionItems"
              class="topActionItem"
              @click="${this._login}"
              title="${this.t("user.login")}"
              ><md-icon>person</md-icon>
            </md-icon-button>
          `}
    `;
    }
    renderMainApp() {
        return html `
      <mwc-top-app-bar
        dense
        role="navigation"
        aria-label="top navigation"
        ?hidden="${this.appMode !== "main"}"
      >
        <div slot="navigationIcon">${this.renderNavigationIcon()}</div>
        <div slot="title">
          ${this.goForwardToPostId ? this.goForwardPostName : this.headerTitle}
        </div>
        ${this.renderActionItems()}
        <div>${this.renderPage()}</div>
      </mwc-top-app-bar>
    `;
    }
    renderGroupPage() {
        return html `
      <yp-group id="groupPage" .subRoute="${this.subRoute}"></yp-group>
    `;
    }
    renderPage() {
        let pageHtml;
        if (this.page) {
            switch (this.page) {
                case "domain":
                    pageHtml = cache(html `
            <yp-domain id="domainPage" .subRoute="${this.subRoute}"></yp-domain>
          `);
                    break;
                case "community":
                    pageHtml = cache(html `
            <yp-community id="communityPage" .subRoute="${this.subRoute}">
            </yp-community>
          `);
                    break;
                case "community_folder":
                    pageHtml = cache(html `
            <yp-community-folder
              id="communityFolderPage"
              .subRoute="${this.subRoute}"
            >
            </yp-community-folder>
          `);
                    break;
                case "group":
                    pageHtml = cache(this.renderGroupPage());
                    break;
                case "group_data_viz":
                    pageHtml = cache(html `
            <yp-group-data-viz
              id="dataVizGroupPage"
              name="group_data_viz"
              .subRoute="${this.subRoute}"
            ></yp-group-data-viz>
          `);
                    break;
                case "post":
                    pageHtml = cache(html `
            <yp-post
              id="postPage"
              .currentPage="${this.page}"
              .subRoute="${this.subRoute}"
            ></yp-post>
          `);
                    break;
                default:
                    pageHtml = cache(html ` <yp-view-404 name="view-404"></yp-view-404> `);
                    break;
            }
        }
        else {
            pageHtml = nothing;
        }
        return pageHtml;
    }
    renderTopBar() {
        return html `
      <mwc-drawer type="modal">
        <div>
          <yp-app-nav-drawer
            id="ypNavDrawer"
            .homeLink="${this.homeLink}"
            .opened="${this.navDrawOpenedDelayed}"
            @yp-toggle-nav-drawer="${this._toggleNavDrawer}"
            .user="${this.user}"
            .route="${this.route}"
          ></yp-app-nav-drawer>
        </div>
        <div slot="appContent">${this.renderMainApp()}</div>
      </mwc-drawer>

      ${this.userDrawerOpened
            ? html `
            <div id="userDrawer">
              <ac-notification-list
                @yp-close-notification-list="${this._toggleUserDrawer}"
                id="acNotificationsList"
                .user="${this.user}"
                opened="${this.userDrawerOpened}"
                .route="${this.route}"
              ></ac-notification-list>
            </div>
          `
            : nothing}
    `;
    }
    renderFooter() {
        return html `
      <yp-sw-update-toast
        .buttonLabel="${this.t("reload")}"
        .message="${this.t("newVersionAvailable")}"
      >
      </yp-sw-update-toast>

      <md-dialog id="dialog">
        <div slot="content">
          <div class="errorText">${this.notifyDialogText}</div>
        </div>
        <div slot="actions" class="layout vertical center-center">
          <md-filled-button
            id="errorCloseButton"
            @click="${this._resetNotifyDialogText}"
          >
            ${this.t("close")}
          </md-filled-button>
        </div>
      </md-dialog>

      <mwc-snackbar id="toast">
        <md-icon-button icon="close" slot="dismiss"></md-icon-button>
      </mwc-snackbar>
    `;
    }
    renderAdminApp() {
        if (this.appMode == "main") {
            return nothing;
        }
        else {
            const isActive = this.appMode === "admin";
            const showSpinner = this.loadingAppSpinner; // Example loading state variable
            return html `
        <div class="loadingAppSpinnerPage ${showSpinner ? "" : "hidden"}">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>
        <yp-admin-app
          ?active="${isActive}"
          class="${isActive ? "active" : ""}"
          ?hidden="${showSpinner}"
        ></yp-admin-app>
      `;
        }
    }
    renderPromotionApp() {
        const isActive = this.appMode === "analytics" || this.appMode === "promotion";
        const showSpinner = this.loadingAppSpinner; // Example loading state variable
        return html `
      <div class="loadingAppSpinnerPage ${showSpinner ? "" : "hidden"}">
        <md-circular-progress indeterminate></md-circular-progress>
      </div>
      <yp-promotion-app
        ?active="${isActive}"
        class="${isActive ? "active" : ""}"
        ?hidden="${showSpinner}"
      ></yp-promotion-app>
    `;
    }
    render() {
        return html `
      ${this.renderTopBar()}
      <yp-app-dialogs id="dialogContainer"></yp-app-dialogs>
      ${this.renderAdminApp()} ${this.renderPromotionApp()}
      ${this.renderFooter()}
    `;
    }
    _openNotifyDialog(event) {
        this.notifyDialogText = event.detail;
        this.$$("#dialog").open = true;
    }
    _openToast(event) {
        this.$$("#toast").labelText = event.detail.text;
        this.$$("#toast").open = true;
    }
    _resetNotifyDialogText() {
        this.notifyDialogText = undefined;
        this.$$("#dialog").close();
    }
    // Translated Pages
    translatedPages(pages) {
        if (pages) {
            return JSON.parse(JSON.stringify(pages));
        }
        else {
            return [];
        }
    }
    openPageFromId(pageId) {
        if (this.pages) {
            this.pages.forEach((page) => {
                if (page.id == pageId) {
                    this._openPage(page);
                }
            });
        }
        else {
            console.warn("Trying to open a page when not loaded");
        }
    }
    _openPageFromMenu(event) {
        const element = event.currentTarget;
        const value = element.getAttribute("data-args");
        if (value) {
            const index = JSON.parse(value);
            const page = this.pages[index];
            this._openPage(page);
            //TODO: Make sure to reset menu here
            //this.$$("paper-listbox")?.select(null);
        }
    }
    _openPage(page) {
        window.appGlobals.activity("open", "pages", page.id);
        window.appDialogs.getDialogAsync("pageDialog", (dialog) => {
            const pageLocale = this._getPageLocale(page);
            dialog.open(page, pageLocale);
        });
    }
    _getPageLocale(page) {
        let pageLocale = "en";
        if (page.title[window.locale]) {
            pageLocale = window.locale;
        }
        else if (page.title["en"]) {
            pageLocale = "en";
        }
        else {
            const key = Object.keys(page.title)[0];
            if (key) {
                pageLocale = key;
            }
        }
        return pageLocale;
    }
    _getLocalizePageTitle(page) {
        const pageLocale = this._getPageLocale(page);
        return page.title[pageLocale];
    }
    _setPages(event) {
        this.pages = event.detail;
    }
    _addBackCommunityOverride(event) {
        const detail = event.detail;
        if (!this.communityBackOverride) {
            this.communityBackOverride = {};
        }
        this.communityBackOverride[detail.fromCommunityId] = {
            backPath: detail.backPath,
            backName: detail.backName,
        };
    }
    _goToNextPost() {
        if (this.currentPostId) {
            this.goBackToPostId = this.currentPostId;
        }
        else {
            console.error("No currentPostId on next");
        }
        if (this.goForwardToPostId) {
            YpNavHelpers.goToPost(this.goForwardToPostId, undefined, undefined, undefined, true);
            window.appGlobals.activity("recommendations", "goForward", this.goForwardToPostId);
            this.goForwardCount += 1;
            this.showBackToPost = true;
        }
        else {
            console.error("No goForwardToPostId");
        }
    }
    _goToPreviousPost() {
        if (this.goForwardCount > 0) {
            window.history.back();
            window.appGlobals.activity("recommendations", "goBack");
        }
        else {
            this.showBackToPost = false;
        }
        this.goForwardCount -= 1;
    }
    _setNextPost(event) {
        const detail = event.detail;
        if (detail.goForwardToPostId) {
            this.goForwardToPostId = detail.goForwardToPostId;
            this.goForwardPostName = detail.goForwardPostName;
        }
        else {
            this._clearNextPost();
        }
        this.currentPostId = detail.currentPostId;
    }
    _clearNextPost() {
        this.goForwardToPostId = undefined;
        this.goForwardPostName = undefined;
        this.goForwardCount = 0;
        this.showBackToPost = false;
    }
    _setupSamlCallback() {
        window.addEventListener("message", (e) => {
            if (e.data == "samlLogin" && window.appUser) {
                window.appUser.loginFromSaml();
            }
        }, false);
    }
    _openPageFromEvent(event) {
        if (event.detail.pageId) {
            this.openPageFromId(event.detail.pageId);
        }
    }
    openUserInfoPage(pageId) {
        if (this.pages && this.pages.length > 0) {
            this._openPage(this.pages[pageId]);
        }
        else {
            setTimeout(() => {
                if (this.pages && this.pages.length > 0) {
                    this._openPage(this.pages[pageId]);
                }
                else {
                    setTimeout(() => {
                        if (this.pages && this.pages.length > 0) {
                            this._openPage(this.pages[pageId]);
                        }
                        else {
                            setTimeout(() => {
                                if (this.pages && this.pages.length > 0) {
                                    this._openPage(this.pages[pageId]);
                                }
                            }, 1250);
                        }
                    }, 1250);
                }
            }, 1250);
        }
    }
    _setLanguageName(event) {
        this.languageName = event.detail;
    }
    _autoTranslateEvent(event) {
        this.autoTranslate = event.detail;
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
    async _refreshByName(id) {
        const el = this.$$(id);
        if (el) {
            await el.getCollection();
            el.refresh();
        }
    }
    _closeRightDrawer() {
        setTimeout(() => {
            // TODO: Fix
            // this.$$("#drawer")?.close();
        }, 100);
    }
    _setNumberOfUnViewedNotifications(event) {
        if (event.detail.count) {
            if (event.detail.count < 10) {
                this.numberOfUnViewedNotifications = event.detail.count;
            }
            else {
                this.numberOfUnViewedNotifications = "9+";
            }
        }
        else {
            this.numberOfUnViewedNotifications = "";
        }
    }
    _redirectTo(event) {
        if (event.detail.path) {
            YpNavHelpers.redirectTo(event.detail.path);
        }
    }
    async _routeChanged() {
        const route = this.route;
        // Support older pre version 6.1 links
        if (window.location.href.indexOf("/#!/") > -1) {
            window.location.href = window.location.href.replace("/#!/", "/");
        }
        /*setTimeout(() => {
          if (route.indexOf('domain') > -1) {
            (this.$$('#domainPage') as YpCollection).refresh();
          } else if (route.indexOf('community_folder') > -1) {
            (this.$$('#communityFolderPage') as YpCollection).refresh();
          } else if (route.indexOf('community') > -1) {
            (this.$$('#communityPage') as YpCollection).refresh();
          } else if (route.indexOf('group') > -1) {
            (this.$$('#groupPage') as YpCollection).refresh();
          } else if (route.indexOf('post') > -1) {
            (this.$$('#postPage') as YpCollection).refresh();
          } else if (route.indexOf('user') > -1) {
            (this.$$('#userPage') as YpCollection).refresh();
          }
        });*/
    }
    _routePageChanged(oldRouteData) {
        if (this.routeData) {
            const params = this.route.split("/");
            if (this.route.indexOf("/user/reset_password") > -1 ||
                this.route.indexOf("/user/open_notification_settings") > -1 ||
                this.route.indexOf("/user/accept/invite") > -1 ||
                this.route.indexOf("/user/info_page") > -1) {
                if (this.route.indexOf("/user/reset_password") > -1) {
                    this.openResetPasswordDialog(params[params.length - 1]);
                }
                else if (this.routeData &&
                    this.routeData.page === "user" &&
                    this.route.indexOf("/user/accept/invite") > -1) {
                    this.openAcceptInvitationDialog(params[params.length - 1]);
                }
                else if (this.route.indexOf("/user/open_notification_settings") > -1) {
                    this.openUserNotificationsDialog();
                }
                else if (this.route.indexOf("/user/info_page") > -1) {
                    this.openUserInfoPage(parseInt(params[params.length - 1]));
                    window.history.pushState({}, "", "/");
                    window.dispatchEvent(new CustomEvent("location-changed"));
                }
            }
            else {
                const map = this._scrollPositionMap;
                if (oldRouteData && oldRouteData.page != undefined) {
                    map[oldRouteData.page] = window.pageYOffset;
                }
                let delayUntilScrollToPost = 0;
                if (this.wide) {
                    delayUntilScrollToPost = 2;
                }
                setTimeout(() => {
                    let skipMasterScroll = false;
                    if (oldRouteData && oldRouteData.page && this.routeData) {
                        // Post -> Group
                        // Group -> Community
                        if ((oldRouteData.page === "group" || oldRouteData.page === "post") &&
                            this.routeData.page === "community") {
                            if (this.$$("#communityPage")) {
                                this.$$("#communityPage").scrollToGroupItem();
                                skipMasterScroll = true;
                            }
                            else {
                                console.warn("Can't find scroll communityPage for goToPostOrNewsItem, trying again");
                                setTimeout(() => {
                                    if (this.$$("#communityPage")) {
                                        this.$$("#communityPage").scrollToGroupItem();
                                    }
                                    else {
                                        console.error("Can't find scroll communityPage for goToPostOrNewsItem");
                                    }
                                }, 200);
                            }
                        }
                        // Community/CommunityFolder -> Domain
                        else if ((oldRouteData.page === "community_folder" ||
                            oldRouteData.page === "community" ||
                            oldRouteData.page === "post") &&
                            this.routeData.page === "domain") {
                            if (this.$$("#domainPage")) {
                                this.$$("#domainPage").scrollToCommunityItem();
                                skipMasterScroll = true;
                            }
                            else {
                                console.warn("Can't find scroll domainPage for scrollToCommunityItem, trying again");
                                setTimeout(() => {
                                    if (this.$$("#domainPage")) {
                                        this.$$("#domainPage").scrollToCommunityItem();
                                    }
                                    else {
                                        console.error("Can't find scroll domainPage for scrollToCommunityItem");
                                    }
                                }, 200);
                            }
                        }
                        // Community/CommunityFolder  -> Community
                        else if ((oldRouteData.page === "community" ||
                            oldRouteData.page === "community_folder") &&
                            this.routeData.page === "community_folder") {
                            if (this.$$("#communityFolderPage")) {
                                this.$$("#communityFolderPage").scrollToGroupItem();
                                skipMasterScroll = true;
                            }
                            else {
                                console.warn("Can't find scroll communityFolderPage for goToPostOrNewsItem, trying again");
                                setTimeout(() => {
                                    if (this.$$("#communityFolderPage")) {
                                        this.$$("#communityFolderPage").scrollToGroupItem();
                                    }
                                    else {
                                        console.error("Can't find scroll communityFolderPage for goToPostOrNewsItem");
                                    }
                                }, 200);
                            }
                        }
                    }
                    if (this.routeData.page !== "post") {
                        this._clearNextPost();
                    }
                    if (oldRouteData &&
                        this.subRoute &&
                        this.routeData &&
                        oldRouteData.page === this.routeData.page) {
                        let testRoute = this.subRoute;
                        testRoute = testRoute.replace("/", "");
                        if (isNaN(parseInt(testRoute))) {
                            skipMasterScroll = true;
                        }
                    }
                    if (map[this.routeData.page] != null &&
                        this.routeData.page !== "post" &&
                        !(oldRouteData &&
                            oldRouteData.page === "community" &&
                            this.routeData.page === "group")) {
                        if (!skipMasterScroll) {
                            window.scrollTo(0, map[this.routeData.page]);
                            console.info("Main window scroll " +
                                this.routeData.page +
                                " to " +
                                map[this.routeData.page]);
                        }
                        else {
                            console.info("Skipping master scroller for " + this.routeData.page);
                        }
                    }
                    else if (!skipMasterScroll) {
                        console.info("AppLayout scroll to top");
                        setTimeout(() => {
                            window.scrollTo(0, 0);
                        });
                    }
                }, delayUntilScrollToPost);
                if (this.routeData) {
                    this.page = this.routeData.page;
                    this._pageChanged();
                }
                else {
                    console.error("No page data, current page: " + this.page);
                }
            }
        }
    }
    loadDataViz() {
        window.appDialogs.loadDataViz();
    }
    _pageChanged() {
        const page = this.page;
        if (page && page === "group_data_viz") {
            this.loadDataViz();
        }
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
    openResetPasswordDialog(resetPasswordToken) {
        // TODO: Remove any
        this.getDialogAsync("resetPassword", (dialog) => {
            dialog.open(resetPasswordToken);
        });
    }
    openUserNotificationsDialog() {
        if (window.appUser && window.appUser.loggedIn() === true) {
            window.appUser.openNotificationSettings();
        }
        else {
            window.appUser.loginForNotificationSettings();
        }
    }
    openAcceptInvitationDialog(inviteToken) {
        // TODO: Remove any
        this.getDialogAsync("acceptInvite", (dialog) => {
            dialog.open(inviteToken);
        });
    }
    _showPage404() {
        this.page = "view-404";
    }
    _setHomeLink(event) {
        if (!this.homeLink) {
            this.homeLink = event.detail;
        }
    }
    setKeepOpenForPostsOn(goBackToPage) {
        this.keepOpenForPost = goBackToPage;
        this.storedBackPath = this.backPath;
        this.storedLastDocumentTitle = document.title;
    }
    _resetKeepOpenForPage() {
        this.keepOpenForPost = undefined;
        this.storedBackPath = undefined;
        this.storedLastDocumentTitle = undefined;
    }
    _closePost() {
        if (this.keepOpenForPost)
            YpNavHelpers.redirectTo(this.keepOpenForPost);
        if (this.storedBackPath)
            this.backPath = this.storedBackPath;
        if (this.storedLastDocumentTitle) {
            document.title = this.storedLastDocumentTitle;
            this.storedLastDocumentTitle = undefined;
        }
        this.keepOpenForPost = undefined;
        document.dispatchEvent(new CustomEvent("lite-signal", {
            bubbles: true,
            detail: { name: "yp-pause-media-playback", data: {} },
        }));
    }
    // Computed
    get closePostHeader() {
        if (this.page == "post" && this.keepOpenForPost)
            return true;
        else
            return false;
    }
    _isGroupOpen(params, keepOpenForPost = false) {
        if (params.groupId || (params.postId && keepOpenForPost))
            return true;
        else
            return false;
    }
    _isCommunityOpen(params, keepOpenForPost = false) {
        if (params.communityId || (params.postId && keepOpenForPost))
            return true;
        else
            return false;
    }
    _isDomainOpen(params, keepOpenForPost = false) {
        if (params.domainId || (params.postId && keepOpenForPost))
            return true;
        else
            return false;
    }
    _toggleNavDrawer() {
        this.$$("mwc-drawer").open = true;
        this.$$("#ypNavDrawer").opened = true;
    }
    getDialogAsync(idName, callback) {
        // Todo: Get Working
        //(this.$$("#dialogContainer") as YpAppDialog).getDialogAsync(idName, callback);
    }
    closeDialog(idName) {
        this.$$("#dialogContainer").closeDialog(idName);
    }
    _dialogClosed(event) {
        // TODO: Get working
        this.$$("#dialogContainer").dialogClosed(event.detail);
    }
    scrollPageToTop() {
        const mainArea = document.getElementById("#mainArea");
        if (mainArea) {
            mainArea.scrollTop = 0;
        }
    }
    _toggleUserDrawer() {
        this.userDrawerOpened = !this.userDrawerOpened;
    }
    _login() {
        if (window.appUser) {
            window.appUser.openUserlogin();
        }
    }
    _onChangeHeader(event) {
        const header = event.detail;
        this.headerTitle = document.title = header.headerTitle;
        setTimeout(() => {
            const headerTitle = this.$$("#headerTitle");
            if (headerTitle) {
                const length = headerTitle.innerHTML.length;
                if (this.wide) {
                    headerTitle.style.fontSize = "20px";
                }
                else {
                    if (length < 20) {
                        headerTitle.style.fontSize = "17px";
                    }
                    else if (length < 25) {
                        headerTitle.style.fontSize = "14px";
                    }
                    else if (length < 30) {
                        headerTitle.style.fontSize = "13px";
                    }
                    else {
                        headerTitle.style.fontSize = "12px";
                    }
                }
            }
        });
        if (header.documentTitle) {
            document.title = header.documentTitle;
        }
        this.headerDescription = header.headerDescription;
        //if (header.headerIcon)
        //app.headerIcon = header.headerIcon;
        if (header.enableSearch)
            this.showSearch = true;
        else
            this.showSearch = false;
        if (header.useHardBack === true) {
            this.useHardBack = true;
        }
        else {
            this.useHardBack = false;
        }
        if (header.backPath) {
            this.showBack = true;
            this.backPath = header.backPath;
        }
        else {
            this.showBack = false;
            this.backPath = undefined;
        }
        if (header.hideHelpIcon) {
            this.hideHelpIcon = true;
        }
        else {
            this.hideHelpIcon = false;
        }
        if (this.communityBackOverride &&
            this.backPath &&
            window.location.pathname.indexOf("/community/") > -1) {
            const communityId = window.location.pathname.split("/community/")[1];
            if (communityId && this.communityBackOverride[communityId]) {
                this.backPath = this.communityBackOverride[communityId].backPath;
                this.headerTitle = this.communityBackOverride[communityId].backName;
                this.useHardBack = false;
            }
        }
        if (this.showBack && header.disableDomainUpLink === true) {
            this.showBack = false;
            this.headerTitle = "";
        }
    }
    goBack() {
        if (this.backPath) {
            if (this.useHardBack) {
                this.fireGlobal("yp-pause-media-playback", {});
                window.location.href = this.backPath;
            }
            else {
                YpNavHelpers.redirectTo(this.backPath);
            }
        }
    }
    _onSearch(e) {
        this.toggleSearch();
        this.previousSearches.unshift(e.detail.value);
        const postsFilter = document.querySelector("#postsFilter");
        if (postsFilter) {
            //TODO: When we have postFilter live
            //postsFilter.searchFor(e.detail.value);
        }
    }
    _onUserChanged(event) {
        if (event.detail && event.detail.id) {
            this.user = event.detail;
        }
        else {
            this.user = undefined;
        }
    }
    toggleSearch() {
        //TODO: When we have postFilter live
        //this.$$("#search")?.toggle();
    }
    _setupTouchEvents() {
        document.addEventListener("touchstart", this._handleTouchStart.bind(this), {
            passive: true,
        });
        document.addEventListener("touchmove", this._handleTouchMove.bind(this), {
            passive: true,
        });
        document.addEventListener("touchend", this._handleTouchEnd.bind(this), {
            passive: true,
        });
    }
    _removeTouchEvents() {
        document.removeEventListener("touchstart", this._handleTouchStart.bind(this));
        document.removeEventListener("touchmove", this._handleTouchMove.bind(this));
        document.removeEventListener("touchend", this._handleTouchEnd.bind(this));
    }
    _handleTouchStart(event) {
        if (this.page === "post" && this.goForwardToPostId) {
            const touches = event.touches || event.originalEvent.touches;
            const firstTouch = touches[0];
            if (firstTouch.clientX > 32 &&
                firstTouch.clientX < window.innerWidth - 32) {
                this.touchXDown = firstTouch.clientX;
                this.touchYDown = firstTouch.clientY;
                this.touchXUp = undefined;
                this.touchYUp = undefined;
            }
        }
    }
    _handleTouchMove(event) {
        if (this.page === "post" && this.touchXDown && this.goForwardToPostId) {
            const touches = event.touches || event.originalEvent.touches;
            this.touchXUp = touches[0].clientX;
            this.touchYUp = touches[0].clientY;
        }
    }
    _handleTouchEnd() {
        if (this.page === "post" &&
            this.touchXDown &&
            this.touchYDown &&
            this.touchYUp &&
            this.touchXUp &&
            this.goForwardToPostId) {
            const xDiff = this.touchXDown - this.touchXUp;
            const yDiff = this.touchYDown - this.touchYUp;
            //console.error("xDiff: "+xDiff+" yDiff: "+yDiff);
            if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(yDiff) < 120) {
                let factor = 3;
                if (window.innerWidth > 500)
                    factor = 4;
                if (window.innerWidth > 1023)
                    factor = 5;
                if (window.innerWidth > 1400)
                    factor = 6;
                const minScrollFactorPx = Math.round(window.innerWidth / factor);
                if (!this.userDrawerOpenedDelayed && !this.navDrawOpenedDelayed) {
                    if (xDiff > 0 && xDiff > minScrollFactorPx) {
                        window.scrollTo(0, 0);
                        window.appGlobals.activity("swipe", "postForward");
                        this.$$("#goPostForward")?.dispatchEvent(new Event("tap"));
                    }
                    else if (xDiff < 0 && xDiff < -Math.abs(minScrollFactorPx)) {
                        if (this.showBackToPost === true) {
                            window.scrollTo(0, 0);
                            this._goToPreviousPost();
                            window.appGlobals.activity("swipe", "postBackward");
                        }
                    }
                }
                else {
                    console.log("Recommendation swipe not active with open drawers");
                }
                this.touchXDown = undefined;
                this.touchXUp = undefined;
                this.touchYDown = undefined;
                this.touchYUp = undefined;
            }
        }
    }
};
__decorate([
    property({ type: Object })
], YpApp.prototype, "homeLink", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "page", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "appMode", void 0);
__decorate([
    property({ type: Object })
], YpApp.prototype, "user", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "backPath", void 0);
__decorate([
    property({ type: Boolean })
], YpApp.prototype, "showSearch", void 0);
__decorate([
    property({ type: Boolean })
], YpApp.prototype, "showBack", void 0);
__decorate([
    property({ type: Boolean })
], YpApp.prototype, "loadingAppSpinner", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "forwardToPostId", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "headerTitle", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "numberOfUnViewedNotifications", void 0);
__decorate([
    property({ type: Boolean })
], YpApp.prototype, "hideHelpIcon", void 0);
__decorate([
    property({ type: Boolean })
], YpApp.prototype, "autoTranslate", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "languageName", void 0);
__decorate([
    property({ type: Number })
], YpApp.prototype, "goForwardToPostId", void 0);
__decorate([
    property({ type: Boolean })
], YpApp.prototype, "showBackToPost", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "goForwardPostName", void 0);
__decorate([
    property({ type: Array })
], YpApp.prototype, "pages", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "headerDescription", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "notifyDialogHeading", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "notifyDialogText", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "route", void 0);
__decorate([
    property({ type: String })
], YpApp.prototype, "subRoute", void 0);
__decorate([
    property({ type: Object })
], YpApp.prototype, "routeData", void 0);
__decorate([
    property({ type: Boolean })
], YpApp.prototype, "userDrawerOpened", void 0);
YpApp = __decorate([
    customElement("yp-app")
], YpApp);
export { YpApp };
//# sourceMappingURL=yp-app.js.map