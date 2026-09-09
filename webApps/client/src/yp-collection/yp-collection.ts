import { html, css, nothing, TemplateResult } from "lit";
import { property } from "lit/decorators.js";

//import { ifDefined } from 'lit/directives/if-defined.js';
import { YpBaseElement } from "../common/yp-base-element.js";
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";

import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";

import "@material/web/fab/fab.js";
import "@material/web/fab/fab.js";
import "./yp-collection-header.js";
import "./yp-collection-items-list.js";
import { YpCollectionItemsList } from "./yp-collection-items-list.js";
import { YpServerApi } from "../common/YpServerApi.js";

import "../ac-activities/ac-activities.js";
import "../yp-post/yp-post-map.js";
import "../yp-assistants/yp-assistant.js";

import { AcActivities } from "../ac-activities/ac-activities.js";
import { MdTabs } from "@material/web/tabs/tabs.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";

export const CollectionTabTypes: Record<string, number> = {
  Collection: 0,
  Newsfeed: 1,
  Map: 2,
  Assistant: 3,
};

type CollectionRequest = { id: number; type: string };
type HelpPagesRequest = CollectionRequest & {
  helpPagesType: string;
  helpPagesId: number;
};
type CollectionAccessState = {
  userId: number | undefined;
  adminRights: YpAdminRights | undefined;
  memberships: YpMemberships | undefined;
};

export abstract class YpCollection extends YpBaseElementWithLogin {
  @property({ type: Boolean })
  noHeader = false;

  @property({ type: Boolean })
  tabsHidden = false;

  @property({ type: Number })
  collectionId: number | undefined;

  @property({ type: String })
  collectionName: string | undefined;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Number })
  selectedTab = CollectionTabTypes.Collection;

  @property({ type: Array })
  collectionItems: Array<YpCommunityData | YpGroupData> | undefined;

  @property({ type: Boolean })
  hideNewsfeed = false;

  @property({ type: Boolean })
  locationHidden = false;

  @property({ type: Boolean })
  hideCollection = false;

  @property({ type: String })
  createFabIcon: string | undefined;

  @property({ type: String })
  createFabLabel: string | undefined;

  @property({ type: String })
  headerImageUrl: string | undefined;

  @property({ type: Boolean })
  useEvenOddItemLayout = false;

  @property({ type: Boolean })
  collectionHeaderHidden = false;

  collectionType: string;
  collectionItemType: string | null;
  collectionCreateFabIcon: string;
  collectionCreateFabLabel: string;

  protected readonly _boundGetCollection = this.getCollection.bind(this);
  private readonly _boundLoggedInUserCustom = this.loggedInUserCustom.bind(this);
  private readonly _boundThemeApplied = this.themeApplied.bind(this);
  private readonly _boundHideCollectionHeader = this.hideCollectionHeader.bind(this);
  private _collectionRequest: CollectionRequest | undefined;
  private _helpPagesRequest: HelpPagesRequest | undefined;
  private _interruptedHelpPagesRequest: HelpPagesRequest | undefined;
  private _reloadCollectionOnConnect = false;
  private _disconnectedAccessState: CollectionAccessState | undefined;
  protected _collectionAccessChanged = false;

  constructor(
    collectionType: string,
    collectionItemType: string | null,
    collectionCreateFabIcon: string,
    collectionCreateFabLabel: string
  ) {
    super();
    this.collectionType = collectionType;
    this.collectionItemType = collectionItemType;
    this.collectionCreateFabIcon = collectionCreateFabIcon;
    this.collectionCreateFabLabel = collectionCreateFabLabel;
  }

  async loggedInUserCustom() {
    this.refresh();
  }

  abstract scrollToCollectionItemSubClass(): void;

  setupTheme() {
    console.error("Implement setupTheme in subclass");
  }

  // DATA PROCESSING

  override connectedCallback() {
    super.connectedCallback();

    const accessState = this._getCollectionAccessState();
    const disconnectedAccessState = this._disconnectedAccessState;
    this._disconnectedAccessState = undefined;
    if (disconnectedAccessState && (
      disconnectedAccessState.userId !== accessState.userId ||
      disconnectedAccessState.adminRights !== accessState.adminRights ||
      disconnectedAccessState.memberships !== accessState.memberships
    )) {
      this._collectionAccessChanged = true;
      this._reloadCollectionOnConnect = true;
    }
    this.loggedInUser = window.appUser?.user ?? undefined;
    this.addGlobalListener("yp-logged-in", this._boundLoggedInUserCustom);
    this.addGlobalListener("yp-got-admin-rights", this._boundGetCollection);
    this.addGlobalListener("yp-theme-applied", this._boundThemeApplied);

    if (this.collection && this._isCurrentCollection(this.collection.id)) {
      if (!this._collectionAccessChanged) this.refresh();

      if (
        this.collectionType == "domain" &&
        window.appGlobals.domainNeedsRefresh
      ) {
        window.appGlobals.domainNeedsRefresh = false;
        this._reloadCollectionOnConnect = true;
      } else if (
        this.collectionType == "community" &&
        window.appGlobals.communityNeedsRefresh
      ) {
        window.appGlobals.communityNeedsRefresh = false;
        this._reloadCollectionOnConnect = true;
      } else if (
        this.collectionType == "group" &&
        window.appGlobals.groupNeedsRefresh
      ) {
        window.appGlobals.groupNeedsRefresh = false;
        this._reloadCollectionOnConnect = true;
      }
    }

    this.addGlobalListener(
      "yp-hide-collection-header-status",
      this._boundHideCollectionHeader
    );

    // Lit caches disconnected pages. Resume interrupted loads when the page
    // returns, after any newly supplied route has been processed.
    if (this._reloadCollectionOnConnect || this._interruptedHelpPagesRequest) {
      void this._resumeRequestsOnConnect();
    }
  }

  private async _resumeRequestsOnConnect() {
    // A sub-route update schedules another update for collectionId. Let that
    // update start its load before deciding whether a reconnect needs one too.
    while (this.isConnected && !(await this.updateComplete)) {}
    if (!this.isConnected) return;
    if (this._reloadCollectionOnConnect) {
      this._reloadCollectionOnConnect = false;
      if (!this._collectionRequest && this.collectionId) {
        this.collectionIdChanged();
      }
    }
    const helpRequest = this._interruptedHelpPagesRequest;
    this._interruptedHelpPagesRequest = undefined;
    if (
      helpRequest && !this._helpPagesRequest &&
      this.collectionType === helpRequest.type &&
      this._isCurrentCollection(helpRequest.id)
    ) {
      void this._getHelpPages(helpRequest.helpPagesType, helpRequest.helpPagesId);
    }
  }

  hideCollectionHeader(event: CustomEvent) {
    this.collectionHeaderHidden = event.detail;
  }

  async themeApplied() {
    this.requestUpdate();
  }

  override disconnectedCallback(): void {
    this._disconnectedAccessState = this._getCollectionAccessState();
    this._reloadCollectionOnConnect ||= !!this._collectionRequest;
    this._invalidateCollectionRequest();
    // Help can still be pending after the main collection has finished loading.
    this._interruptedHelpPagesRequest =
      this._helpPagesRequest ?? this._interruptedHelpPagesRequest;
    this._helpPagesRequest = undefined;
    super.disconnectedCallback();
    this.removeGlobalListener("yp-logged-in", this._boundLoggedInUserCustom);
    this.removeGlobalListener("yp-got-admin-rights", this._boundGetCollection);
    this.removeGlobalListener("yp-theme-applied", this._boundThemeApplied);
    this.removeGlobalListener(
      "yp-hide-collection-header-status",
      this._boundHideCollectionHeader
    );
    if (window.appGlobals.retryMethodAfter401Login === this._boundGetCollection) {
      window.appGlobals.retryMethodAfter401Login = undefined;
    }
  }

  private _getCollectionAccessState(): CollectionAccessState {
    // YpAppUser replaces these objects when rights/memberships are fetched.
    // Compare snapshots on return without keeping detached pages subscribed.
    return {
      userId: window.appUser?.user?.id,
      adminRights: window.appUser?.adminRights,
      memberships: window.appUser?.memberships,
    };
  }

  protected _beginCollectionRequest(): CollectionRequest {
    // A new route or rights event can already satisfy a pending reconnect load.
    this._reloadCollectionOnConnect = false;
    // Object identity also distinguishes overlapping reloads of the same ID.
    const request = { id: this.collectionId!, type: this.collectionType };
    this._collectionRequest = request;
    return request;
  }

  protected _isCurrentCollection(id: number) {
    return (
      this.isConnected && this.collectionId === id &&
      (!this.subRoute || parseInt(this.subRoute.split("/")[1]) === id)
    );
  }

  protected _isCurrentCollectionRequest(request: CollectionRequest) {
    return (
      this._collectionRequest === request &&
      this.collectionType === request.type && this._isCurrentCollection(request.id)
    );
  }

  protected _finishCollectionRequest(request: CollectionRequest) {
    if (this._collectionRequest === request) this._collectionRequest = undefined;
  }

  protected _invalidateCollectionRequest() {
    this._collectionRequest = undefined;
  }

  refresh(): void {
    if (this.collection) {
      if (this.collection.default_locale != null) {
        window.appGlobals.changeLocaleIfNeeded(this.collection.default_locale);
      }

      this.fire("yp-set-home-link", {
        type: this.collectionType,
        id: this.collection.id,
        name: this.collection.name,
      } as YpHomeLinkData);

      this.fire("yp-change-header", {
        headerTitle: null,
        documentTitle: this.collection.name,
        headerDescription:
          this.collection.description || this.collection.objectives,
        currentTheme: this.collection.configuration?.theme,
      });

      if (
        this.collection.configuration?.hideAllTabs ||
        (this.collection.configuration as YpGroupConfiguration)
          ?.hideGroupLevelTabs
      ) {
        this.tabsHidden = true;
      } else {
        this.tabsHidden = false;
      }

      if (this.$$("#collectionItems")) {
        (this.$$("#collectionItems") as YpCollectionItemsList).refresh();
      }
    } else {
      console.debug("No collection for refresh");
    }
  }

  async getCollection() {
    if (!this.isConnected) return;
    if (this.collectionId) {
      const request = this._beginCollectionRequest();
      this.collectionItems = undefined;
      //TODO: Look into this if its ok
      if (this.collectionType != "domain") {
        this.collection = undefined;
      }
      try {
        const collection = (await window.serverApi.getCollection(
          request.type,
          request.id
        )) as YpCollectionData | undefined;
        if (!this._isCurrentCollectionRequest(request)) return;
        if (collection) this._collectionAccessChanged = false;
        this.collection = collection;
        this.refresh();
      } finally {
        this._finishCollectionRequest(request);
      }
    } else {
      console.error("No collection id for getCollection");
    }
  }

  async _getHelpPages(
    collectionTypeOverride: string | undefined = undefined,
    collectionIdOverride: number | undefined = undefined
  ) {
    if (!this.isConnected) return;
    if (this.collectionId) {
      const request: HelpPagesRequest = {
        id: this.collectionId,
        type: this.collectionType,
        // Posts use their group's help pages rather than their own type/ID.
        helpPagesType: collectionTypeOverride ?? this.collectionType,
        helpPagesId: collectionIdOverride ?? this.collectionId,
      };
      this._helpPagesRequest = request;
      this._interruptedHelpPagesRequest = undefined;
      try {
        const helpPages = (await window.serverApi.getHelpPages(
          request.helpPagesType,
          request.helpPagesId
        )) as Array<YpHelpPageData> | undefined;
        if (helpPages && this._helpPagesRequest === request &&
          this.collectionType === request.type && this._isCurrentCollection(request.id)) {
          this.fire("yp-set-pages", helpPages);
        }
      } finally {
        if (this._helpPagesRequest === request) this._helpPagesRequest = undefined;
      }
    } else {
      console.error("Collection id setup for get help pages");
    }
  }

  get collectionTabLabel(): string {
    const translatedCollectionItems = this.t(
      YpServerApi.transformCollectionTypeToApi(this.collectionItemType!)
    );
    return `${translatedCollectionItems} (${
      this.collectionItems ? this.collectionItems.length : 0
    })`;
  }

  // EVENTS

  collectionIdChanged() {
    this.getCollection();
    this._getHelpPages();
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("subRoute") && this.subRoute) {
      const splitSubRoute = this.subRoute.split("/");
      this.collectionId = parseInt(splitSubRoute[1]);
      if (splitSubRoute.length > 2) {
        this._setSelectedTabFromRoute(splitSubRoute[2]);
      } else {
        this._setSelectedTabFromRoute("default");
      }
    }

    if (changedProperties.has("collectionId") && this.collectionId) {
      this.collectionIdChanged();
    }
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = (event.currentTarget as MdTabs).activeTabIndex;
  }

  _openAdmin() {
    YpNavHelpers.redirectTo(
      `/admin/${this.collectionType}/${this.collection!.id}`
    );
  }

  _setSelectedTabFromRoute(routeTabName: string): void {
    let tabNumber;

    switch (routeTabName) {
      case "collection":
        tabNumber = CollectionTabTypes.Collection;
        break;
      case "news":
        tabNumber = CollectionTabTypes.Newsfeed;
        break;
      case "map":
        tabNumber = CollectionTabTypes.Map;
        break;
      case "assistant":
        tabNumber = CollectionTabTypes.Assistant;
        break;
      default:
        tabNumber = CollectionTabTypes.Collection;
        break;
    }

    if (tabNumber !== undefined) {
      this.selectedTab = tabNumber;
      window.appGlobals.activity(
        "open",
        this.collectionType + "_tab_" + routeTabName
      );
    }
  }

  scrollToCachedItem() {
    if (
      this.selectedTab === CollectionTabTypes.Newsfeed &&
      window.appGlobals.cache.cachedActivityItem
    ) {
      const activities = this.$$("#collectionActivities") as AcActivities;
      if (activities) {
        activities.scrollToItem(window.appGlobals.cache.cachedActivityItem);
        window.appGlobals.cache.cachedActivityItem = undefined;
      } else {
        console.error("No activities for scroll to item");
      }
    } else if (this.selectedTab === CollectionTabTypes.Collection) {
      this.scrollToCollectionItemSubClass();
    }
  }

  scrollToCollectionItemSubClassDomain() {
    if (
      this.collection &&
      window.appGlobals.cache.backToDomainCommunityItems &&
      window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
    ) {
      (this.$$("#collectionItems") as YpCollectionItemsList).scrollToItem(
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
      );
      window.appGlobals.cache.backToDomainCommunityItems[this.collection.id] =
        undefined;
    }
  }

  setFabIconIfAccess(
    onlyAdminCanCreate: boolean,
    hasCollectionAccess: boolean
  ) {
    if (!onlyAdminCanCreate || hasCollectionAccess) {
      this.createFabIcon = this.collectionCreateFabIcon;
      this.createFabLabel = this.collectionCreateFabLabel;
    } else {
      this.createFabIcon = undefined;
      this.createFabLabel = undefined;
    }
  }

  //TODO: Review this when we remove the group community links
  _useHardBack(configuration: YpCollectionConfiguration) {
    if (configuration && configuration.customBackURL) {
      const backUrl = configuration.customBackURL;
      if (
        backUrl.startsWith("/community/") ||
        backUrl.startsWith("/group/") ||
        backUrl.startsWith("/domain/") ||
        backUrl.startsWith("/post/")
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  async createNewCollection() {
    let childCollectionType;
    if (this.collectionType == "domain") {
      childCollectionType = "community";
    } else if (this.collectionType == "community") {
      childCollectionType = "group";
    } else {
      console.error("Invalid collection type for create new collection");
      return;
    }
    const createPath = `/admin/${childCollectionType}/new/${this.collectionId}`;
    if (this.loggedInUser || (await window.appUser.ensureLoginChecked())) {
      YpNavHelpers.redirectTo(createPath);
    } else {
      window.appUser.openUserlogin(undefined, undefined, createPath);
    }
  }

  // UI

  static override get styles() {
    return [
      super.styles,
      css`
        md-fab {
          --md-fab-container-shape: 4px;
          --md-fab-label-text-size: 16px !important;
          --md-fab-label-text-weight: 600 !important;
          margin-bottom: 24px;
          --md-fab-container-elevation: 0;
          --md-fab-container-shadow-color: transparent;
        }

        md-fab:not([has-static-theme]) {
          --md-sys-color-primary-container: var(--md-sys-color-primary);
          --md-sys-color-on-primary-container: var(--md-sys-color-on-primary);
        }

        md-linear-progress {
          --md-sys-color-primary: var(--md-sys-color-on-surface-variant);
        }

        .topContainer {
          background-color: var(--md-sys-color-surface);
        }

        .createFab {
          width: 225px;
          margin-left: 64px;
        }

        md-tabs {
          border-bottom-color: transparent;
          max-width: 720px;
          overflow-y: scroll;
          --md-divider-thickness: 0px;
        }

        .mainContent {
          margin-left: 64px;
          margin-right: 64px;
        }

        md-secondary-tab {
          width: 180px;
          padding-right: 16px;
          padding-left: 16px;
          --md-secondary-tab-active-indicator-height: 3px;
        }

        md-secondary-tab[has-static-theme] {
          --md-secondary-tab-active-indicator-color: var(
            --md-sys-color-primary-container
          );
        }

        md-icon-button {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        md-filled-text-field {
          margin-left: 8px;
          margin-right: 8px;
        }

        md-tabs {
          width: 100%;
        }

        .topContainer {
          max-width: 1080px;
          width: 100%;
        }

        @media (max-width: 960px) {
          md-tabs {
            width: 100vw;
            max-width: 100%;
          }

          @media (max-width: 960px) {
            .createFab {
              margin-top: 32px;
              max-width: 100%;
            }
          }

          .mainContent {
            margin-left: 0;
            margin-right: 0;
          }

          md-secondary-tab {
            width: 100%;
            max-width: 100%;
          }

          .topContainer {
            width: 100%;
            max-width: 100%;
          }
        }

        .createFab[is-map] {
          right: inherit;
          left: 28px;
        }

        @media (max-width: 960px) {
          .header {
            height: 100%;
          }

          .createFab {
            width: 100%;
            margin-left: 0;
          }

          .currentPage {
            margin-bottom: 220px;
            margin-top: 16px;
          }
        }
      `,
    ];
  }

  renderHeader() {
    return this.collection && !this.noHeader
      ? html`
          <div class="layout vertical center-center header">
            <yp-collection-header
              .collection="${this.collection}"
              .collectionType="${this.collectionType}"
              aria-label="${this.collection?.name || this.collectionType}"
              role="banner"
            ></yp-collection-header>
          </div>
        `
      : nothing;
  }

  renderAssistantTab() {
    return html`<md-secondary-tab
      hidden
      ?has-static-theme="${this.hasStaticTheme}"
      >${this.t("assistant")}<md-icon slot="icon"
        >assistant</md-icon
      ></md-secondary-tab
    >`;
  }

  renderNewsAndMapTabs() {
    return html`
      <md-secondary-tab
        ?has-static-theme="${this.hasStaticTheme}"
        ?hidden="${this.hideNewsfeed}"
        >${this.t("post.tabs.news")}<md-icon slot="icon"
          >rss_feed</md-icon
        ></md-secondary-tab
      >
      <md-secondary-tab
        ?has-static-theme="${this.hasStaticTheme}"
        ?hidden="${this.locationHidden || this.collectionType == "domain"}"
      >
        ${this.t("post.tabs.location")}<md-icon slot="icon"
          >location_on</md-icon
        ></md-secondary-tab
      >
    `;
  }

  renderTabs() {
    if (this.collection && !this.tabsHidden) {
      return html`
        <div class="layout vertical center-center">
          <md-tabs
            @change="${this._selectTab}"
            .activeTabIndex="${this.selectedTab}"
          >
            ${/*this.renderAssistantTab()*/ nothing}
            <md-secondary-tab
              ?has-static-theme="${this.hasStaticTheme}"
              ?hidden="${this.hideCollection}"
              >${this.collectionTabLabel}
              <md-icon slot="icon">groups</md-icon></md-secondary-tab
            >
            ${this.renderNewsAndMapTabs()}
          </md-tabs>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderCurrentTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedTab) {
      case CollectionTabTypes.Collection:
        page =
          this.collectionItems && this.collectionItemType
            ? html`<yp-collection-items-list
                id="collectionItems"
                .collectionItems="${this.collectionItems}"
                .collection="${this.collection}"
                .collectionType="${this.collectionType}"
                .collectionItemType="${this.collectionItemType}"
                .collectionId="${this.collectionId!}"
                ?grid="${this.collection?.configuration?.itemViewMode ===
                "grid"}"
                ?useEvenOddItemLayout="${this.useEvenOddItemLayout}"
              ></yp-collection-items-list>`
            : html``;
        break;
      case CollectionTabTypes.Newsfeed:
        page = html`<ac-activities
          id="collectionActivities"
          .selectedTab="${this.selectedTab}"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId!}"
        ></ac-activities>`;
        break;
      case CollectionTabTypes.Map:
        page = html`<yp-post-map
          id="postsMap"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId!}"
        ></yp-post-map>`;
        break;
      case CollectionTabTypes.Assistant:
        page = html`<yp-assistant
          id="assistant"
          .domainId="${this.collectionId!}"
        ></yp-assistant>`;
        break;
    }

    return page;
  }

  // FFDC2F

  override render() {
    if (this.collection) {
      return html`
        <div class="layout vertical center-center">
          <div class="layout vertical topContainer">
            <div ?hidden="${this.collectionHeaderHidden}">
              ${this.renderHeader()}
            </div>
            <div class="layout horizontal mainContent wrap">
              ${this.renderTabs()}
              <div class="flex"></div>
              ${this.createFabIcon && this.createFabLabel
                ? html`
                    <md-icon-button
                      hidden
                      class="filterButton"
                      .label="${this.t("filter")}"
                      aria-label="${this.t("filter")}"
                      ><md-icon>tune</md-icon></md-icon-button
                    >
                    <md-fab
                      ?has-static-theme="${this.hasStaticTheme}"
                      lowered
                      size="large"
                      ?extended="${this.wide}"
                      class="createFab"
                      variant="primary"
                      @click="${this.createNewCollection}"
                      ?is-map="${this.selectedTab === CollectionTabTypes.Map}"
                      .label="${this.t(this.createFabLabel)}"
                      .icon="${this.createFabIcon}"
                    >
                      <md-icon hidden slot="icon">add_circle</md-icon></md-fab
                    >
                  `
                : nothing}
            </div>
          </div>
        </div>
        <div class="currentPage layout vertical center-center">
          <div class="topContainer">${this.renderCurrentTabPage()}</div>
        </div>
      `;
    } else {
      return html` <md-linear-progress indeterminate></md-linear-progress> `;
    }
  }
}
