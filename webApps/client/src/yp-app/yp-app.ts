/*
import './yp-app-nav-drawer.js';
import '../yp-dialog-container/yp-dialog-container.js';
import '../yp-user/yp-user-image.js';
import '../yp-app-globals/yp-sw-update-toast.js';
*/

import "../ac-notifications/ac-notification-list.js";

import { html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { cache } from "lit/directives/cache.js";

//TODO: Fix moment
//import moment from 'moment';

import "./yp-snackbar.js";
import "./yp-drawer.js";

//import { Drawer } from '@material/yp-drawer';
//import '@material/yp-drawer';

import "@material/web/button/text-button.js";
import "@material/web/labs/badge/badge.js";
import "@material/web/iconbutton/icon-button.js";

import "@material/web/iconbutton/icon-button.js";

import "@material/web/progress/circular-progress.js";
import "@material/web/menu/menu.js";
import "@material/web/fab/fab.js";
import "@material/web/menu/menu-item.js";
import "@material/web/button/text-button.js";

import "./yp-top-app-bar.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpAppStyles } from "./YpAppStyles.js";
import { YpAppGlobals } from "./YpAppGlobals.js";
import { YpAppUser } from "./YpAppUser.js";
import { YpServerApi } from "../common/YpServerApi.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpAppDialogs } from "../yp-dialog-container/yp-app-dialogs.js";

import "../yp-dialog-container/yp-app-dialogs.js";

import "../yp-collection/yp-domain.js";
import "../yp-collection/yp-community.js";
import "../yp-collection/yp-group.js";

import "./yp-app-nav-drawer.js";
import "./yp-agent-bundle-top-bar.js";

import { YpDomain } from "../yp-collection/yp-domain.js";
import { YpCommunity } from "../yp-collection/yp-community.js";
import { YpGroup } from "../yp-collection/yp-group.js";
import "../yp-post/yp-post.js";
import { YpCollection } from "../yp-collection/yp-collection.js";
import { YpPageDialog } from "../yp-page/yp-page-dialog.js";
import { YpAppNavDrawer } from "./yp-app-nav-drawer.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";
import { Corner, Menu } from "@material/web/menu/menu.js";
import { YpServerApiAdmin } from "../common/YpServerApiAdmin.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import { YpDrawer } from "./yp-drawer.js";
import { YpSnackbar } from "./yp-snackbar.js";
import { PsAppGlobals } from "../policySynth/PsAppGlobals.js";
import { PsServerApi } from "../policySynth/PsServerApi.js";
import { YpTopAppBar } from "./yp-top-app-bar.js";
import { YpGroupType } from "../yp-collection/ypGroupType.js";
import { YpUserEdit } from "../yp-user/yp-user-edit.js";

import "../yp-assistants/yp-agent-bundle.js";
import { YpAssistant } from "../yp-assistants/yp-assistant.js";

declare global {
  interface Window {
    appGlobals: YpAppGlobals;
    psAppGlobals: PsAppGlobals;
    psServerApi: PsServerApi;
    appUser: YpAppUser;
    appDialogs: YpAppDialogs;
    serverApi: YpServerApi;
    adminServerApi: YpServerApiAdmin;
    app: YpApp;
    locale: string;
    autoTranslate: boolean;
    MSStream: any;
    PasswordCredential?: any;
    FederatedCredential?: any;
  }
}

type YpAppModes = "main" | "admin" | "promotion" | "analytics";

@customElement("yp-app")
export class YpApp extends YpBaseElement {
  @property({ type: Object })
  homeLink: YpHomeLinkData | undefined;

  @property({ type: String })
  page: string | undefined;

  @property({ type: Number })
  scrollPosition = 0;

  @property({ type: String })
  appMode = "main" as YpAppModes;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: String })
  backPath: string | undefined;

  @property({ type: Boolean })
  showSearch = false;

  @property({ type: Boolean })
  showBack = false;

  @property({ type: Boolean })
  loadingAppSpinner = false;

  @property({ type: String })
  forwardToPostId: string | undefined;

  @property({ type: String })
  headerTitle: string | undefined;

  @property({ type: String })
  numberOfUnViewedNotifications: string | undefined;

  @property({ type: Boolean })
  hideHelpIcon = false;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: String })
  languageName: string | undefined;

  @property({ type: Number })
  goForwardToPostId: number | undefined;

  @property({ type: Boolean })
  showBackToPost = false;

  @property({ type: String })
  goForwardPostName: string | undefined;

  @property({ type: Array })
  pages: Array<YpHelpPageData> = [];

  @property({ type: String })
  headerDescription: string | undefined;

  @property({ type: String })
  notifyDialogHeading: string | undefined;

  @property({ type: String })
  notifyDialogText: string | undefined;

  @property({ type: String })
  route = "";

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: String })
  currentTitle: string | undefined;

  @property({ type: Object })
  routeData: Record<string, string> = {};

  @property({ type: Boolean })
  userDrawerOpened = false;

  @property({ type: Boolean })
  navDrawerOpened = false;

  @property({ type: Boolean })
  notificationDrawerOpened = false;

  @property({ type: Object })
  currentTheme?: YpThemeConfiguration;

  //TODO: Refactor this
  @property({ type: String })
  keepOpenForPost: string | undefined;

  //TODO: Refactor this
  @property({ type: String })
  keepOpenForGroup: string | undefined;

  @property({ type: Array })
  breadcrumbs: Array<{ name: string; url: string }> = [];

  anchor: HTMLElement | null = null;

  previousSearches: Array<string> = [];

  storedBackPath: string | undefined;

  storedLastDocumentTitle: string | undefined;

  useHardBack = false;

  _scrollPositionMap = {};

  goBackToPostId: number | undefined;

  currentPostId: number | undefined;

  goForwardCount = 0;

  firstLoad = true;

  communityBackOverride: Record<string, Record<string, string>> | undefined;

  touchXDown: number | undefined;
  touchYDown: number | undefined;
  touchXUp: number | undefined;
  touchYUp: number | undefined;

  userDrawerOpenedDelayed = false;
  navDrawOpenedDelayed = false;
  haveLoadedAdminApp = false;
  haveLoadedPromotionApp = false;

  private _boundHandleKeyDown = this._handleKeyDown.bind(this);
  private _boundHandleScroll = this._handleScroll.bind(this);
  private _boundTouchStart = this._handleTouchStart.bind(this);
  private _boundTouchMove = this._handleTouchMove.bind(this);
  private _boundTouchEnd = this._handleTouchEnd.bind(this);
  private _boundUpdateLocation = this.updateLocation.bind(this);
  private _boundAutoTranslateEvent = this._autoTranslateEvent.bind(this);
  private _boundOnChangeHeader = this._onChangeHeader.bind(this);
  private _boundOnUserChanged = this._onUserChanged.bind(this);
  private _boundNetWorkError = this._netWorkError.bind(this);
  private _boundYpError = this._ypError.bind(this);
  private _boundOpenToast = this._openToast.bind(this);
  private _boundLanguageLoaded = this._languageLoaded.bind(this);
  private _boundRefreshDomain = this._refreshDomain.bind(this);
  private _boundRefreshCommunity = this._refreshCommunity.bind(this);
  private _boundRefreshGroup = this._refreshGroup.bind(this);
  private _boundCloseNavDrawer = this._closeNavDrawer.bind(this);
  private _boundAppDialogsReady = this._appDialogsReady.bind(this);

  constructor() {
    super();
    window.app = this;
    window.serverApi = new YpServerApi();
    window.adminServerApi = new YpServerApiAdmin();
    this.setupAppGlobals();
    window.appUser = new YpAppUser(window.serverApi);
    window.appGlobals.setupTranslationSystem();
  }

  setupAppGlobals() {
    window.appGlobals = new YpAppGlobals(window.serverApi);
  }

  override connectedCallback() {
    super.connectedCallback();
    console.log("App Starting __VERSION__");
    this._setupEventListeners();
    this._setupSamlCallback();
    this.updateLocation();
    document.addEventListener("keydown", this._boundHandleKeyDown);
    window.addEventListener("scroll", this._boundHandleScroll);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
    document.removeEventListener("keydown", this._boundHandleKeyDown);
    window.removeEventListener("scroll", this._boundHandleScroll);
  }

  _handleScroll() {
    this.scrollPosition = window.pageYOffset;
    this.requestUpdate("scrollPosition");
  }

  override async updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): Promise<void> {
    super.updated(changedProperties);

    if (changedProperties.has("appMode")) {
      if (!this.haveLoadedAdminApp && this.appMode == "admin") {
        this.loadingAppSpinner = true;
        await this.updateComplete;
        await import("../admin/yp-admin-app.js");
        this.haveLoadedAdminApp = true;
        this.loadingAppSpinner = false;
      }

      if (
        !this.haveLoadedPromotionApp &&
        (this.appMode == "analytics" || this.appMode == "promotion")
      ) {
        console.log("Loading promotion app");
        this.loadingAppSpinner = true;
        await this.updateComplete;
        await import("../analytics-and-promotion/yp-promotion-app.js");
        this.haveLoadedPromotionApp = true;
        this.loadingAppSpinner = false;
      }
    }
  }

  _navDrawOpened(event: CustomEvent) {
    setTimeout(() => {
      this.navDrawOpenedDelayed = event.detail;
    }, 500);
  }

  _languageLoaded() {
    this.languageLoaded = true;
  }

  _ypError(event: CustomEvent) {
    const text = event.detail;
    if (text) {
      this.notifyDialogText = text;
      (this.$$("#dialog") as Dialog).open = true;
    }
  }

  _netWorkError(event: CustomEvent) {
    const detail = event.detail;
    let errorText = this.t("generalError");

    if (errorText == "generalError") {
      errorText = "Can't connect to server, try again later";
    }

    let statusCode = -1;

    if (detail.response && detail.response.status === 404)
      errorText = this.t("errorNotFound");
    else if (detail.response && detail.response.status === 401)
      errorText = this.t("errorNotAuthorized");
    else if (
      detail.response &&
      detail.response.status === 500 &&
      detail.response.message == "SequelizeUniqueConstraintError"
    )
      errorText = this.t("user.alreadyRegisterred");
    else if (detail.errorText) errorText = detail.errorText;

    if (detail.response && detail.response.status)
      statusCode = detail.response.status;

    if (detail.showUserError) {
      this.notifyDialogText = errorText;
      (this.$$("#dialog") as Dialog).open = true;
    }

    console.error(`Can't connect to server. ${statusCode} ${detail.jsonError}`);
  }

  _setupEventListeners() {
    this.addGlobalListener(
      "yp-auto-translate",
      this._boundAutoTranslateEvent
    );
    this.addGlobalListener(
      "yp-theme-configuration-updated",
      this._themeUpdated
    );
    this.addGlobalListener("yp-change-header", this._boundOnChangeHeader);
    this.addGlobalListener("yp-logged-in", this._boundOnUserChanged);
    this.addGlobalListener("yp-network-error", this._boundNetWorkError);
    this.addGlobalListener("yp-error", this._boundYpError);
    this.addListener(
      "yp-add-back-community-override",
      this._addBackCommunityOverride,
      this
    );
    this.addListener(
      "yp-reset-keep-open-for-page",
      this._resetKeepOpenForPage,
      this
    );
    this.addListener("yp-open-login", this._login, this);
    this.addListener("yp-open-page", this._openPageFromEvent, this);
    this.addGlobalListener("yp-open-toast", this._boundOpenToast);
    this.addListener("yp-open-notify-dialog", this._openNotifyDialog, this);
    this.addListener("yp-dialog-closed", this._dialogClosed, this);
    this.addListener("yp-language-name", this._setLanguageName, this);

    this.addGlobalListener(
      "yp-language-loaded",
      this._boundLanguageLoaded
    );

    this.addGlobalListener("yp-refresh-domain", this._boundRefreshDomain);
    this.addGlobalListener(
      "yp-refresh-community",
      this._boundRefreshCommunity
    );
    this.addGlobalListener("yp-refresh-group", this._boundRefreshGroup);

    this.addListener("yp-close-right-drawer", this._closeUserDrawer, this);
    this.addGlobalListener(
      "yp-close-all-drawers",
      this._boundCloseNavDrawer
    );
    this.addListener(
      "yp-set-number-of-un-viewed-notifications",
      this._setNumberOfUnViewedNotifications,
      this
    );
    this.addListener("yp-redirect-to", this._redirectTo, this);
    this.addListener("yp-set-home-link", this._setHomeLink, this);
    this.addListener("yp-set-next-post", this._setNextPost, this);
    this.addListener("yp-set-pages", this._setPages, this);

    this.addListener(
      "yp-clipboard-copy-notification",
      this._haveCopiedNotification,
      this
    );

    window.addEventListener("locationchange", this._boundUpdateLocation);
    window.addEventListener("location-changed", this._boundUpdateLocation);
    window.addEventListener("popstate", this._boundUpdateLocation);
    this.addGlobalListener(
      "yp-app-dialogs-ready",
      this._boundAppDialogsReady
    );
    this._setupTouchEvents();
  }

  _themeUpdated(event: CustomEvent) {
    window.appGlobals.theme.updateLiveFromConfiguration(event.detail);
  }

  _removeEventListeners() {
    this.removeGlobalListener("yp-auto-translate", this._boundAutoTranslateEvent);
    this.removeGlobalListener("yp-change-header", this._boundOnChangeHeader);
    this.removeGlobalListener("yp-logged-in", this._boundOnUserChanged);
    this.removeGlobalListener("yp-network-error", this._boundNetWorkError);
    this.removeGlobalListener("yp-error", this._boundYpError);
    this.removeGlobalListener(
      "yp-theme-configuration-updated",
      this._themeUpdated
    );
    this.removeGlobalListener(
      "yp-language-loaded",
      this._boundLanguageLoaded
    );

    this.removeListener(
      "yp-add-back-community-override",
      this._addBackCommunityOverride,
      this
    );
    this.removeListener(
      "yp-reset-keep-open-for-page",
      this._resetKeepOpenForPage,
      this
    );
    this.removeGlobalListener(
      "yp-close-all-drawers",
      this._boundCloseNavDrawer
    );
    this.removeListener("yp-open-login", this._login, this);
    this.removeListener("yp-open-page", this._openPageFromEvent, this);
    this.removeGlobalListener("yp-open-toast", this._boundOpenToast);
    this.removeListener("yp-open-notify-dialog", this._openNotifyDialog, this);
    this.removeListener("yp-dialog-closed", this._dialogClosed, this);
    this.removeListener("yp-language-name", this._setLanguageName, this);
    this.removeGlobalListener("yp-refresh-domain", this._boundRefreshDomain);
    this.removeGlobalListener("yp-refresh-community", this._boundRefreshCommunity);
    this.removeGlobalListener("yp-refresh-group", this._boundRefreshGroup);
    this.removeListener("yp-close-right-drawer", this._closeUserDrawer, this);
    this.removeListener(
      "yp-set-number-of-un-viewed-notifications",
      this._setNumberOfUnViewedNotifications,
      this
    );
    this.removeListener("yp-redirect-to", this._redirectTo, this);
    this.removeListener("yp-set-home-link", this._setHomeLink, this);
    this.removeListener("yp-set-next-post", this._setNextPost, this);
    this.removeListener("yp-set-pages", this._setPages, this);
    this.removeListener(
      "yp-clipboard-copy-notification",
      this._haveCopiedNotification,
      this
    );

    window.removeEventListener("locationchange", this._boundUpdateLocation);
    window.removeEventListener("location-changed", this._boundUpdateLocation);
    window.removeEventListener("popstate", this._boundUpdateLocation);
    this.removeGlobalListener(
      "yp-app-dialogs-ready",
      this._boundAppDialogsReady
    );
    this._removeTouchEvents();
  }

  static override get styles() {
    return [super.styles, YpAppStyles];
  }

  _haveCopiedNotification() {
    this.notifyDialogText = this.t("copiedToClipboard");
    (this.$$("#dialog") as Dialog).open = true;
  }

  _appDialogsReady(event: CustomEvent) {
    if (event.detail) {
      window.appDialogs = event.detail;
    }
  }

  get hasStaticBadgeTheme() {
    if (this.currentTheme) {
      return !this.currentTheme.oneDynamicColor;
    } else {
      return false;
    }
  }

  updateLocation() {
    let path = window.location.pathname;

    if (path.includes("/admin")) {
      this.appMode = "admin";
      path = path.replace("/admin", "");
    } else if (path.includes("/promotion")) {
      this.appMode = "promotion";
      path = path.replace("/promotion", "");
    } else if (path.includes("/analytics")) {
      this.appMode = "analytics";
      path = path.replace("/analytics", "");
    } else {
      this.appMode = "main";
    }

    const pattern = "/:page";

    const remainingPieces = path.split("/");
    const patternPieces = pattern.split("/");

    const matched = [];
    const namedMatches: Record<string, string> = {};

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
      } else if (patternPiece !== pathPiece) {
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

  _openUserEdit() {
    this.fireGlobal("yp-close-all-drawers");
    window.appDialogs.getDialogAsync("userEdit", (dialog: YpUserEdit) => {
      dialog.setup(this.user!, false, undefined);
      dialog.open(false, { userId: this.user?.id || -1 });
    });
  }

  get isFullScreenMode() {
    return (
      this.page == "group" &&
      window.appGlobals.currentGroup?.configuration.groupType ==
        YpGroupType.PsAgentWorkflow
    );
  }

  renderNavigationIcon() {
    return html`
      <md-filled-tonal-icon-button
        id="navIconButton"
        ?has-no-organizations="${!window.appGlobals.myDomains ||
        window.appGlobals.myDomains.length < 2}"
        slot="actionItems"
        ?hidden="${!this.user ||
        this.page === "agent_bundle"}"
        class="topActionItem"
        @click="${this._openNavDrawer}"
        title="${this.t("navigationMenu")}"
        ><md-icon>apps</md-icon></md-filled-tonal-icon-button
      >
    `;
  }

  renderNavigation() {
    if (
      window.appGlobals.domain?.configuration.disableArrowBasedTopNavigation &&
      !this.closePostHeader &&
      !this.keepOpenForGroup
    ) {
      return this.renderNavigationIcon();
    }

    let icons = html``;

    let closeButtonVisible = true;

    if (this.closePostHeader) {
      icons = html`<md-icon-button
        title="${this.t("close")}"
        class="closeButton ${closeButtonVisible ? "visible" : ""}"
        @click="${this._closePost}"
        ><md-icon>close</md-icon></md-icon-button
      >`;
    } else if (this.keepOpenForGroup) {
      icons = html`<md-icon-button
        title="${this.t("close")}"
        @click="${this._closeForGroup}"
        ><md-icon>close</md-icon></md-icon-button
      >`;
      //TODO: Fix this it should show arrow up when landing on the site for the first time not going back
    } else if (this.showBack && this.breadcrumbs.length > 1) {
      icons = html`<md-icon-button
        title="${this.t("goBack")}"
        slot="actionItems"
        ?hidden="${!this.backPath}"
        @click="${this.goBack}"
        ><md-icon>arrow_back</md-icon>
      </md-icon-button>`;
    } else if (this.showBack) {
      icons = html`<md-icon-button
        title="${this.t("goBack")}"
        slot="actionItems"
        class="closeButton ${closeButtonVisible ? "visible" : ""}"
        ?hidden="${!this.backPath}"
        @click="${this.goBack}"
        ><md-icon>arrow_upward</md-icon>
      </md-icon-button>`;
    }

    return html`${icons}
    ${this.goForwardToPostId
      ? html`
          <md-icon-button
            title="${this.t("forwardToPost")}"
            @click="${this._goToNextPost}"
            ><md-icon>fast_forward</md-icon></md-icon-button
          >
        `
      : nothing}`;
  }

  _openHelpMenu() {
    (this.$$("#helpMenu") as Menu).open = true;
  }

  renderNonArrowNavigation() {
    return html` ${this.renderNavigationIcon()} `;
  }

  renderActionItems() {
    return html`
      <md-icon-button
        id="translationButton"
        slot="actionItems"
        class="topActionItem"
        ?hidden="${!this.autoTranslate}"
        @click="${window.appGlobals.stopTranslation}"
        .label="${this.t("stopAutoTranslate")}"
        ><md-icon>translate</md-icon>
      </md-icon-button>

      ${window.appGlobals.domain?.configuration.disableArrowBasedTopNavigation
        ? nothing
        : this.renderNonArrowNavigation()}

      <div
        style="position: relative;"
        ?hidden="${this.hideHelpIcon}"
        slot="actionItems"
      >
        <span style="position: relative">
          <md-filled-tonal-icon-button
            id="helpIconButton"
            class="topActionItem"
            @click="${this._openHelpMenu}"
            title="${this.t("menu.help")}"
            ><md-icon>help_outline</md-icon>
          </md-filled-tonal-icon-button>
          <md-menu
            id="helpMenu"
            positioning="popover"
            .menuCorner="${Corner.START_START}"
            anchor="helpIconButton"
          >
            ${this.translatedPages(this.pages).map(
              (page: YpHelpPageData, index) => html`
                <md-menu-item
                  data-args="${index}"
                  @click="${this._openPageFromMenu}"
                >
                  <div slot="headline">${this._getLocalizePageTitle(page)}</div>
                </md-menu-item>
              `
            )}
          </md-menu>
        </span>
      </div>

      ${this.user
        ? html`
            <div style="position: relative;">
              <md-filled-tonal-icon-button
                class="layout horizontal topActionItem"
                @click="${this._openNotificationDrawer}"
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
              class="userIcon"
              @click="${this._openUserDrawer}"
              slot="actionItems"
            >
              <yp-user-image id="userImage" small .user="${this.user}">
              </yp-user-image>
            </md-icon-button>
          `
        : html`
            <md-text-button
              slot="actionItems"
              ?hidden="${this.isOnDomainLoginPageAndNotLoggedIn ||
              this.isOnAgentBundleLoginPageAndNotLoggedIn}"
              class="topActionItem userImageNotificationContainer"
              @click="${this._login}"
              title="${this.t("user.login")}"
              >${this.t("user.login")}
            </md-text-button>
          `}
    `;
  }

  renderTopBar() {
    let titleString =
      this.goForwardToPostId && this.goForwardPostName
        ? this.goForwardPostName
        : (this.showBack ? this.headerTitle : "") || "";

    //TODO: Refactor this logic
    if (this.keepOpenForGroup || this.closePostHeader) {
      titleString = "";
    }

    if (
      this.page === "agent_bundle" ||
      window.appGlobals.originalQueryParameters.forAgentBundle
    ) {
      return html` <yp-agent-bundle-top-bar
        .numberOfUnViewedNotifications="${this.numberOfUnViewedNotifications}"
        .hasStaticBadgeTheme="${this.hasStaticBadgeTheme}"
        .page="${this.page}"
        @open-notification-drawer="${this._openNotificationDrawer}"
        @open-user-drawer="${this._openUserDrawer}"
      ></yp-agent-bundle-top-bar>`;
    } else {
      return html` <yp-top-app-bar
        role="navigation"
        .useLowestContainerColor="${this.page === "agent_bundle"}"
        .restrictWidth="${!this.isFullScreenMode}"
        .titleString="${this.currentTitle || titleString}"
        ?hideTitle="${this.page === "agent_bundle"}"
        aria-label="top navigation"
        ?fixed="${true ||
        window.appGlobals.domain?.configuration.useFixedTopAppBar}"
        ?disableArrowBasedNavigation="${window.appGlobals.domain?.configuration
          .disableArrowBasedTopNavigation}"
        ?hideBreadcrumbs="${!titleString || titleString == ""}"
        ?hidden="${this.appMode !== "main" ||
        window.appGlobals.domain?.configuration.hideAppBarIfWelcomeHtml}"
      >
        <div slot="navigation">${this.renderNavigation()}</div>
        <div slot="title" ?hidden="${this.page === "agent_bundle"}"></div>
        <div slot="action">${this.renderActionItems()}</div>
      </yp-top-app-bar>`;
    }
  }

  renderMainApp() {
    return html`
      ${this.renderTopBar()}
      <div
        class="mainPage"
        ?agentBundle="${this.page === "agent_bundle" ||
        window.appGlobals.originalQueryParameters.forAgentBundle}"
        ?hidden="${this.appMode !== "main"}"
      >
        ${this.renderPage()}
      </div>
    `;
  }

  renderGroupPage() {
    return html`
      <yp-group id="groupPage" .subRoute="${this.subRoute}"></yp-group>
    `;
  }

  renderPage() {
    let pageHtml;
    if (this.page) {
      switch (this.page) {
        case "domain":
        case "organization":
          pageHtml = cache(html`
            <yp-domain id="domainPage" .subRoute="${this.subRoute}"></yp-domain>
          `);
          break;
        case "agent_bundle":
          pageHtml = cache(html`
            <yp-agent-bundle
              id="agentBundlePage"
              .subRoute="${this.subRoute}"
            ></yp-agent-bundle>
          `);
          break;
        case "community":
          pageHtml = cache(html`
            <yp-community id="communityPage" .subRoute="${this.subRoute}">
            </yp-community>
          `);
          break;
        case "community_folder":
          pageHtml = cache(html`
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
          pageHtml = cache(html`
            <yp-group-data-viz
              id="dataVizGroupPage"
              name="group_data_viz"
              .subRoute="${this.subRoute}"
            ></yp-group-data-viz>
          `);
          break;
        case "post":
          pageHtml = cache(html`
            <yp-post
              id="postPage"
              .currentPage="${this.page}"
              .subRoute="${this.subRoute}"
            ></yp-post>
          `);
          break;
        default:
          pageHtml = cache(html` <yp-view-404 name="view-404"></yp-view-404> `);
          break;
      }
    } else {
      pageHtml = nothing;
    }

    return pageHtml;
  }

  renderDrawers() {
    return html`
      <yp-drawer
        id="leftDrawer"
        position="${window.appGlobals.domain?.configuration
          .disableArrowBasedTopNavigation
          ? "left"
          : "right"}"
        @closed="${this._closeNavDrawer}"
      >
        <yp-app-nav-drawer
          id="ypNavDrawer"
          .homeLink="${this.homeLink}"
          .opened="${this.navDrawOpenedDelayed}"
          @yp-toggle-nav-drawer="${this._openNavDrawer}"
          .user="${this.user}"
          .route="${this.route}"
        ></yp-app-nav-drawer>
      </yp-drawer>

      <yp-drawer
        id="notificationDrawer"
        position="right"
        ?hidden="${!this.notificationDrawerOpened}"
        @closed="${this._closeNotificationDrawer}"
      >
        ${this.user
          ? html`
              <ac-notification-list
                @yp-close-notification-list="${this._closeNotificationDrawer}"
                id="acNotificationsList"
                ?hidden="${!this.notificationDrawerOpened}"
                .user="${this.user}"
                opened="${this.userDrawerOpened}"
                .route="${this.route}"
              ></ac-notification-list>
            `
          : nothing}
      </yp-drawer>

      <yp-drawer
        id="userDrawer"
        position="right"
        ?hidden="${!this.userDrawerOpened}"
        @closed="${this._closeUserDrawer}"
      >
        ${this.userDrawerOpened && this.user
          ? html`
              <yp-user-info
                @open-user-edit="${this._openUserEdit}"
                .user="${this.user}"
              ></yp-user-info>
              <div class="languageSelector layout vertical self-start">
                <yp-language-selector
                  class="languageSelector"
                ></yp-language-selector>
              </div>
              <div class="layout horizontal center-center themeSelection">
                ${this.renderThemeToggle()}
              </div>
            `
          : nothing}
      </yp-drawer>
    `;
  }

  renderFooter() {
    return html`
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

      <yp-snackbar id="toast">
        <md-icon-button icon="close" slot="dismiss"></md-icon-button>
      </yp-snackbar>
    `;
  }

  renderAdminApp() {
    if (this.appMode == "main") {
      return nothing;
    } else {
      const isActive = this.appMode === "admin";
      const showSpinner = this.loadingAppSpinner;

      return html`
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
    if (this.appMode == "main") {
      return nothing;
    } else {
      const isActive =
        this.appMode === "analytics" || this.appMode === "promotion";
      const showSpinner = this.loadingAppSpinner;

      return html`
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
  }

  override render() {
    return html`
      ${this.renderDrawers()} ${this.renderMainApp()}
      <yp-app-dialogs id="dialogContainer"></yp-app-dialogs>
      ${this.renderAdminApp()} ${this.renderPromotionApp()}
      ${this.renderFooter()}
    `;
  }

  _openNotifyDialog(event: CustomEvent) {
    this.notifyDialogText = event.detail;
    (this.$$("#dialog") as Dialog).open = true;
  }

  _openToast(event: CustomEvent) {
    (this.$$("#toast") as YpSnackbar).labelText = event.detail.text;
    (this.$$("#toast") as YpSnackbar).open = true;
  }

  _resetNotifyDialogText() {
    this.notifyDialogText = undefined;
    (this.$$("#dialog") as MdDialog).close();
  }

  // Translated Pages
  translatedPages(pages: Array<YpHelpPageData>): Array<YpHelpPageData> {
    if (pages) {
      return JSON.parse(JSON.stringify(pages)) as Array<YpHelpPageData>;
    } else {
      return [] as Array<YpHelpPageData>;
    }
  }

  openPageFromId(pageId: number) {
    if (this.pages) {
      this.pages.forEach((page) => {
        if (page.id == pageId) {
          this._openPage(page);
        }
      });
    } else {
      console.warn("Trying to open a page when not loaded");
    }
  }

  _openPageFromMenu(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.getAttribute("data-args");
    if (value) {
      const index = JSON.parse(value);
      const page = this.pages[index];
      this._openPage(page);
      //TODO: Make sure to reset menu here
      //this.$$("paper-listbox")?.select(null);
    }
  }

  _openPage(page: YpHelpPageData) {
    window.appGlobals.activity("open", "pages", page.id);
    window.appDialogs.getDialogAsync("pageDialog", (dialog: YpPageDialog) => {
      const pageLocale = this._getPageLocale(page);
      dialog.open(page, pageLocale);
    });
  }

  _getPageLocale(page: YpHelpPageData) {
    let pageLocale = "en";
    if (page.title[window.locale]) {
      pageLocale = window.locale;
    } else if (page.title["en"]) {
      pageLocale = "en";
    } else {
      const key = Object.keys(page.title)[0];
      if (key) {
        pageLocale = key;
      }
    }

    return pageLocale;
  }

  _getLocalizePageTitle(page: YpHelpPageData) {
    const pageLocale = this._getPageLocale(page);
    return page.title[pageLocale];
  }

  _setPages(event: CustomEvent) {
    this.pages = event.detail;
  }

  _addBackCommunityOverride(event: CustomEvent) {
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
    } else {
      console.error("No currentPostId on next");
    }

    if (this.goForwardToPostId) {
      YpNavHelpers.goToPost(
        this.goForwardToPostId,
        undefined,
        undefined,
        undefined,
        true
      );
      window.appGlobals.activity(
        "recommendations",
        "goForward",
        this.goForwardToPostId
      );
      this.goForwardCount += 1;
      this.showBackToPost = true;
    } else {
      console.error("No goForwardToPostId");
    }
  }

  _goToPreviousPost() {
    if (this.goForwardCount > 0) {
      window.history.back();
      window.appGlobals.activity("recommendations", "goBack");
    } else {
      this.showBackToPost = false;
    }
    this.goForwardCount -= 1;
  }

  _setNextPost(event: CustomEvent) {
    const detail = event.detail;
    if (detail.goForwardToPostId) {
      this.goForwardToPostId = detail.goForwardToPostId;
      this.goForwardPostName = detail.goForwardPostName;
    } else {
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
    window.addEventListener(
      "message",
      (e) => {
        if (e.data == "samlLogin" && window.appUser) {
          window.appUser.loginFromSaml();
        }
      },
      false
    );
  }

  _openPageFromEvent(event: CustomEvent) {
    if (event.detail.pageId) {
      this.openPageFromId(event.detail.pageId);
    }
  }

  openUserInfoPage(pageId: number) {
    if (this.pages && this.pages.length > 0) {
      this._openPage(this.pages[pageId]);
    } else {
      setTimeout(() => {
        if (this.pages && this.pages.length > 0) {
          this._openPage(this.pages[pageId]);
        } else {
          setTimeout(() => {
            if (this.pages && this.pages.length > 0) {
              this._openPage(this.pages[pageId]);
            } else {
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

  _setLanguageName(event: CustomEvent) {
    this.languageName = event.detail;
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
  }

  async _refreshGroup() {
    this._refreshByName("#groupPage");
  }

  async _refreshCommunity() {
    this._refreshByName("#communityPage");
  }

  _refreshDomain() {
    this._refreshByName("#domainPage");
  }

  async _refreshByName(id: string) {
    const el = this.$$(id) as YpCollection;
    if (el) {
      await el.getCollection();
      el.refresh();
    } else {
      console.warn("Can't find element to refresh", id);
    }
  }

  _setNumberOfUnViewedNotifications(event: CustomEvent) {
    if (event.detail.count) {
      if (event.detail.count < 10) {
        this.numberOfUnViewedNotifications = event.detail.count;
      } else {
        this.numberOfUnViewedNotifications = "9+";
      }
    } else {
      this.numberOfUnViewedNotifications = "";
    }
  }

  _redirectTo(event: CustomEvent) {
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

  _routePageChanged(oldRouteData: Record<string, string>) {
    if (this.routeData) {
      let params = this.route.split("/");
      params = params.filter((el) => {
        return el != "";
      });
      if (
        this.route.indexOf("/user/reset_password") > -1 ||
        this.route.indexOf("/user/open_notification_settings") > -1 ||
        this.route.indexOf("/user/accept/invite") > -1 ||
        this.route.indexOf("/user/info_page") > -1
      ) {
        if (this.route.indexOf("/user/reset_password") > -1) {
          this.openResetPasswordDialog(params[params.length - 1]);
        } else if (
          this.routeData &&
          this.routeData.page === "user" &&
          this.route.indexOf("/user/accept/invite") > -1
        ) {
          this.openAcceptInvitationDialog(params[params.length - 1]);
        } else if (
          this.route.indexOf("/user/open_notification_settings") > -1
        ) {
          this.openUserNotificationsDialog();
        } else if (this.route.indexOf("/user/info_page") > -1) {
          this.openUserInfoPage(parseInt(params[params.length - 1]));
          window.history.pushState({}, "", "/");
          window.dispatchEvent(new CustomEvent("location-changed"));
        }
      } else {
        const map: Record<string, number> = this._scrollPositionMap;

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
            if (
              (oldRouteData.page === "group" || oldRouteData.page === "post") &&
              this.routeData.page === "community"
            ) {
              if (this.$$("#communityPage")) {
                (this.$$("#communityPage") as YpCommunity).scrollToGroupItem();
                skipMasterScroll = true;
              } else {
                console.warn(
                  "Can't find scroll communityPage for goToPostOrNewsItem, trying again"
                );
                setTimeout(() => {
                  if (this.$$("#communityPage")) {
                    (
                      this.$$("#communityPage") as YpCommunity
                    ).scrollToGroupItem();
                  } else {
                    console.error(
                      "Can't find scroll communityPage for goToPostOrNewsItem"
                    );
                  }
                }, 200);
              }
            }

            // Community/CommunityFolder -> Domain
            else if (
              (oldRouteData.page === "community_folder" ||
                oldRouteData.page === "community" ||
                oldRouteData.page === "post") &&
              this.routeData.page === "domain"
            ) {
              if (this.$$("#domainPage")) {
                (this.$$("#domainPage") as YpDomain).scrollToCommunityItem();
                skipMasterScroll = true;
              } else {
                console.warn(
                  "Can't find scroll domainPage for scrollToCommunityItem, trying again"
                );
                setTimeout(() => {
                  if (this.$$("#domainPage")) {
                    (
                      this.$$("#domainPage") as YpDomain
                    ).scrollToCommunityItem();
                  } else {
                    console.error(
                      "Can't find scroll domainPage for scrollToCommunityItem"
                    );
                  }
                }, 200);
              }
            }

            // Community/CommunityFolder  -> Community
            else if (
              (oldRouteData.page === "community" ||
                oldRouteData.page === "community_folder") &&
              this.routeData.page === "community_folder"
            ) {
              if (this.$$("#communityFolderPage")) {
                (
                  this.$$("#communityFolderPage") as YpCommunity
                ).scrollToGroupItem();
                skipMasterScroll = true;
              } else {
                console.warn(
                  "Can't find scroll communityFolderPage for goToPostOrNewsItem, trying again"
                );
                setTimeout(() => {
                  if (this.$$("#communityFolderPage")) {
                    (
                      this.$$("#communityFolderPage") as YpCommunity
                    ).scrollToGroupItem();
                  } else {
                    console.error(
                      "Can't find scroll communityFolderPage for goToPostOrNewsItem"
                    );
                  }
                }, 200);
              }
            }
          }

          if (this.routeData.page !== "post") {
            this._clearNextPost();
          }

          if (
            oldRouteData &&
            this.subRoute &&
            this.routeData &&
            oldRouteData.page === this.routeData.page
          ) {
            let testRoute = this.subRoute;
            testRoute = testRoute.replace("/", "");
            if (isNaN(parseInt(testRoute))) {
              skipMasterScroll = true;
            }
          }

          if (
            map[this.routeData.page] != null &&
            this.routeData.page !== "post" &&
            !(
              oldRouteData &&
              oldRouteData.page === "community" &&
              this.routeData.page === "group"
            )
          ) {
            if (oldRouteData && oldRouteData.page == "post") {
              skipMasterScroll = true;
            }

            if (!skipMasterScroll) {
              window.scrollTo(0, map[this.routeData.page]);
              console.error(
                "Main window scroll " +
                  this.routeData.page +
                  " to " +
                  map[this.routeData.page]
              );
            } else {
              console.info(
                "Skipping master scroller for " + this.routeData.page
              );
            }
          } else if (!skipMasterScroll) {
            console.info("AppLayout scroll to top");
            setTimeout(() => {
              window.scrollTo(0, 0);
            });
          }
        }, delayUntilScrollToPost);

        if (this.routeData) {
          this.page = this.routeData.page;
          this._pageChanged();
        } else {
          console.error("No page data, current page: " + this.page);
        }
      }
    }

    if (this.page === "assistant") {
      (this.$$("#assistant") as YpAssistant).scrollDown();
      document.body.style.backgroundColor =
        "var(--md-sys-color-surface-container-lowest)";
    } else {
      document.body.style.backgroundColor = "var(--md-sys-color-surface)";
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
      window.appGlobals.analytics.sendToAnalyticsTrackers(
        "send",
        "pageview",
        location.pathname
      );
    }
  }

  openResetPasswordDialog(resetPasswordToken: string) {
    // TODO: Remove any
    this.getDialogAsync("resetPassword", async (dialog: any) => {
      dialog.open(resetPasswordToken);
    });
  }

  openUserNotificationsDialog() {
    if (window.appUser && window.appUser.loggedIn() === true) {
      window.appUser.openNotificationSettings();
    } else {
      window.appUser.loginForNotificationSettings();
    }
  }

  openAcceptInvitationDialog(inviteToken: string) {
    // TODO: Remove any
    this.getDialogAsync("acceptInvite", (dialog: any) => {
      dialog.open(inviteToken);
    });
  }

  _showPage404() {
    this.page = "view-404";
  }

  _setHomeLink(event: CustomEvent) {
    if (!this.homeLink) {
      this.homeLink = event.detail;
    }
  }

  setKeepOpenForPostsOn(goBackToPage: string) {
    this.keepOpenForPost = goBackToPage;
    this.storedBackPath = this.backPath;
    this.storedLastDocumentTitle = document.title;
  }

  _resetKeepOpenForPage() {
    this.keepOpenForPost = undefined;
    this.storedBackPath = undefined;
    this.storedLastDocumentTitle = undefined;
  }

  _closeForGroup() {
    if (this.keepOpenForGroup) {
      YpNavHelpers.redirectTo(this.keepOpenForGroup);
    } else {
      console.error("No keepOpenForGroup");
    }
    this.keepOpenForGroup = undefined;
  }

  _closePost() {
    if (this.keepOpenForPost) YpNavHelpers.redirectTo(this.keepOpenForPost);

    if (this.storedBackPath) this.backPath = this.storedBackPath;

    if (this.storedLastDocumentTitle) {
      document.title = this.storedLastDocumentTitle;
      this.storedLastDocumentTitle = undefined;
    }

    this.keepOpenForPost = undefined;
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        detail: { name: "yp-pause-media-playback", data: {} },
      })
    );
  }

  // Computed

  get closePostHeader() {
    if (this.page == "post" && this.keepOpenForPost) return true;
    else return false;
  }

  _isGroupOpen(
    params: { groupId?: number; postId?: number },
    keepOpenForPost = false
  ) {
    if (params.groupId || (params.postId && keepOpenForPost)) return true;
    else return false;
  }

  _isCommunityOpen(
    params: { communityId?: number; postId?: number },
    keepOpenForPost = false
  ) {
    if (params.communityId || (params.postId && keepOpenForPost)) return true;
    else return false;
  }

  _isDomainOpen(
    params: { domainId?: number; postId?: number },
    keepOpenForPost = false
  ) {
    if (params.domainId || (params.postId && keepOpenForPost)) return true;
    else return false;
  }

  async _openNavDrawer() {
    this.navDrawerOpened = true;
    (this.$$("#leftDrawer") as any).open = true;
    await this.updateComplete;
    (this.$$("#ypNavDrawer") as YpAppNavDrawer).opened = true;
  }

  async _closeNavDrawer() {
    if (this.$$("#leftDrawer")) {
      (this.$$("#leftDrawer") as any).open = false;
    }
    if (this.$$("#ypNavDrawer")) {
      (this.$$("#ypNavDrawer") as YpAppNavDrawer).opened = false;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.navDrawerOpened = false;
  }

  async getDialogAsync(idName: string, callback: Function) {
    await this.updateComplete;
    (this.$$("#dialogContainer") as YpAppDialogs).getDialogAsync(
      idName,
      callback
    );
  }

  closeDialog(idName: string) {
    (this.$$("#dialogContainer") as YpAppDialogs).closeDialog(idName);
  }

  _dialogClosed(event: CustomEvent) {
    // TODO: Get working
    (this.$$("#dialogContainer") as YpAppDialogs).dialogClosed(event.detail);
  }

  scrollPageToTop() {
    const mainArea = document.getElementById("mainArea");
    if (mainArea) {
      mainArea.scrollTop = 0;
    }
  }

  async _openUserDrawer() {
    this.userDrawerOpened = true;
    (this.$$("#userDrawer") as YpDrawer).open = true;
  }

  async _closeUserDrawer() {
    (this.$$("#userDrawer") as YpDrawer).open = false;
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.userDrawerOpened = false;
  }

  async _openNotificationDrawer() {
    this.notificationDrawerOpened = true;
    (this.$$("#notificationDrawer") as YpDrawer).open = true;
  }

  async _closeNotificationDrawer() {
    (this.$$("#notificationDrawer") as YpDrawer).open = false;
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.notificationDrawerOpened = false;
  }

  get isOnDomainLoginPageAndNotLoggedIn() {
    return (
      window.appGlobals.domain &&
      window.appGlobals.domain.configuration?.useLoginOnDomainIfNotLoggedIn &&
      this.page === "domain" &&
      !this.user
    );
  }

  get isOnAgentBundleLoginPageAndNotLoggedIn() {
    return (
      window.appGlobals.domain &&
      window.appGlobals.domain.configuration?.useLoginOnDomainIfNotLoggedIn &&
      this.page === "agent_bundle" &&
      !this.user
    );
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

  _onChangeHeader(event: CustomEvent) {
    const header = event.detail;
    this.headerTitle = document.title = header.headerTitle;

    setTimeout(() => {
      const headerTitle = this.$$("#headerTitle") as HTMLElement | void;
      if (headerTitle) {
        const length = headerTitle.innerHTML.length;
        if (this.wide) {
          headerTitle.style.fontSize = "20px";
        } else {
          if (length < 20) {
            headerTitle.style.fontSize = "17px";
          } else if (length < 25) {
            headerTitle.style.fontSize = "14px";
          } else if (length < 30) {
            headerTitle.style.fontSize = "13px";
          } else {
            headerTitle.style.fontSize = "12px";
          }
        }
      }
    });

    if (header.documentTitle) {
      document.title = header.documentTitle;
      this.currentTitle = header.documentTitle;
    }
    this.headerDescription = header.headerDescription;

    //if (header.headerIcon)
    //app.headerIcon = header.headerIcon;
    if (header.enableSearch) this.showSearch = true;
    else this.showSearch = false;

    if (header.useHardBack === true) {
      this.useHardBack = true;
    } else {
      this.useHardBack = false;
    }

    if (header.backPath) {
      this.showBack = true;
      this.backPath = header.backPath;
    } else {
      this.showBack = false;
      this.backPath = undefined;
    }

    if (header.hideHelpIcon) {
      this.hideHelpIcon = true;
    } else {
      this.hideHelpIcon = false;
    }

    if (header.keepOpenForGroup) {
      this.keepOpenForGroup = header.keepOpenForGroup;
    }

    if (
      this.communityBackOverride &&
      this.backPath &&
      window.location.pathname.indexOf("/community/") > -1
    ) {
      const communityId = window.location.pathname.split(
        "/community/"
      )[1] as unknown as number;
      if (communityId && this.communityBackOverride[communityId]) {
        this.backPath = this.communityBackOverride[communityId].backPath;
        this.headerTitle = this.communityBackOverride[communityId].backName;
        this.useHardBack = false;
      }
    }

    if (this.showBack && header.disableCollectionUpLink === true) {
      this.showBack = false;
      this.headerTitle = "";
    }

    if (header.headerTitle && header.backPath) {
      this.updateBreadcrumbs({
        name: header.headerTitle || "",
        url: header.backPath || "",
      });
    } else {
      this.breadcrumbs = [];
      if (this.$$("yp-top-app-bar")) {
        (this.$$("yp-top-app-bar") as YpTopAppBar).breadcrumbs = this.breadcrumbs;
      }
    }

    if (header.currentTheme) {
      this.currentTheme = header.currentTheme;
    }
  }

  updateBreadcrumbs(newBreadcrumb: { name: string; url: string }) {
    const existingIndex = this.breadcrumbs.findIndex(
      (b) => b.url === newBreadcrumb.url
    );
    if (existingIndex !== -1) {
      // If the breadcrumb already exists, trim the array to this point
      this.breadcrumbs = this.breadcrumbs.slice(0, existingIndex + 1);
    } else {
      // Otherwise, add the new breadcrumb
      this.breadcrumbs = [...this.breadcrumbs, newBreadcrumb];
    }

    if (this.$$("yp-top-app-bar")) {
      (this.$$("yp-top-app-bar") as YpTopAppBar).breadcrumbs = this.breadcrumbs;
    }
  }

  goBack() {
    if (this.backPath) {
      if (this.useHardBack) {
        this.fireGlobal("yp-pause-media-playback", {});
        window.location.href = this.backPath;
      } else {
        YpNavHelpers.redirectTo(this.backPath);
      }
    }
  }

  _onSearch(e: CustomEvent) {
    this.toggleSearch();
    this.previousSearches.unshift(e.detail.value);
    const postsFilter = document.querySelector("#postsFilter") as LitElement;
    if (postsFilter) {
      //TODO: When we have postFilter live
      //postsFilter.searchFor(e.detail.value);
    }
  }

  _onUserChanged(event: CustomEvent) {
    if (event.detail && event.detail.id) {
      this.user = event.detail;
    } else {
      this.user = undefined;
    }
  }

  toggleSearch() {
    //TODO: When we have postFilter live
    //this.$$("#search")?.toggle();
  }

  _handleKeyDown(event: KeyboardEvent) {
    if (
      event.key === "Escape" &&
      window.location.pathname.indexOf("/edit") === -1
    ) {
      if (this.closePostHeader) {
        this._closePost();
      } else if (this.keepOpenForGroup) {
        this._closeForGroup();
      } else if (!this.showBack) {
        // If there's no back arrow, we don't want to do anything on ESC
        event.preventDefault();
      }
    }
  }

  _setupTouchEvents() {
    document.addEventListener("touchstart", this._boundTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", this._boundTouchMove, {
      passive: true,
    });
    document.addEventListener("touchend", this._boundTouchEnd, {
      passive: true,
    });
  }

  _removeTouchEvents() {
    document.removeEventListener("touchstart", this._boundTouchStart);
    document.removeEventListener("touchmove", this._boundTouchMove);
    document.removeEventListener("touchend", this._boundTouchEnd);
  }

  _handleTouchStart(event: any) {
    if (this.page === "post") {
      const touches = event.touches || event.originalEvent.touches;
      const firstTouch = touches[0];

      if (
        firstTouch.clientX > 32 &&
        firstTouch.clientX < window.innerWidth - 32
      ) {
        this.touchXDown = firstTouch.clientX;
        this.touchYDown = firstTouch.clientY;
        this.touchXUp = undefined;
        this.touchYUp = undefined;
      }
    }
  }

  _handleTouchMove(event: any) {
    if (this.page === "post" && this.touchXDown) {
      const touches = event.touches || event.originalEvent.touches;
      this.touchXUp = touches[0].clientX;
      this.touchYUp = touches[0].clientY;
    }
  }

  _handleTouchEnd() {
    if (
      this.page === "post" &&
      this.touchXDown &&
      this.touchYDown &&
      this.touchYUp &&
      this.touchXUp
    ) {
      const xDiff = this.touchXDown - this.touchXUp;
      const yDiff = this.touchYDown - this.touchYUp;
      //console.error("xDiff: "+xDiff+" yDiff: "+yDiff);

      if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(yDiff) < 120) {
        let factor = 3;

        if (window.innerWidth > 500) factor = 4;

        if (window.innerWidth > 1023) factor = 5;

        if (window.innerWidth > 1400) factor = 6;

        const minScrollFactorPx = Math.round(window.innerWidth / factor);

        if (!this.userDrawerOpenedDelayed && !this.navDrawOpenedDelayed) {
          if (xDiff > 0 && xDiff > minScrollFactorPx) {
            window.scrollTo(0, 0);
            window.appGlobals.activity("swipe", "postForward");
            this.$$("#goPostForward")?.dispatchEvent(new Event("tap"));
            this.fireGlobal("yp-go-to-next-post");
          } else if (xDiff < 0 && xDiff < -Math.abs(minScrollFactorPx)) {
            if (this.showBackToPost === true) {
              window.scrollTo(0, 0);
              this._goToPreviousPost();
            }
            this.fireGlobal("yp-go-to-previous-post");
            window.appGlobals.activity("swipe", "postBackward");
        }
        } else {
          console.log("Recommendation swipe not active with open drawers");
        }

        this.touchXDown = undefined;
        this.touchXUp = undefined;
        this.touchYDown = undefined;
        this.touchYUp = undefined;
      }
    }
  }
}
