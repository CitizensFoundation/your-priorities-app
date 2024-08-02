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
import { AcActivities } from "../ac-activities/ac-activities.js";
import { MdTabs } from "@material/web/tabs/tabs.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";

export const CollectionTabTypes: Record<string, number> = {
  Collection: 0,
  Newsfeed: 1,
  Map: 2,
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

  collectionType: string;
  collectionItemType: string | null;
  collectionCreateFabIcon: string;
  collectionCreateFabLabel: string;

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

    //TODO: Fix this as it causes loadMoreData to be called twice on post lists at least
    this.addGlobalListener("yp-logged-in", this.loggedInUserCustom.bind(this));
    this.addGlobalListener(
      "yp-got-admin-rights",
      this.getCollection.bind(this)
    );
  }

  async loggedInUserCustom() {
    this.refresh();
    //TODO: Look into this, find a better solution than waiting
    await new Promise((r) => setTimeout(r, 1500));
    if (!this.collection || !this.collection.id) {
      // this.getCollection();
    }
  }

  abstract scrollToCollectionItemSubClass(): void;

  // DATA PROCESSING

  override connectedCallback() {
    super.connectedCallback();
    if (this.collection) this.refresh();
  }

  refresh(): void {
    console.info("REFRESH");
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
    }
  }

  async getCollection() {
    if (this.collectionId) {
      //this.collection = undefined;
      this.collectionItems = undefined;
      this.collection = undefined;
      this.collection = (await window.serverApi.getCollection(
        this.collectionType,
        this.collectionId
      )) as YpCollectionData | undefined;
      this.refresh();
    } else {
      console.error("No collection id for getCollection");
    }
  }

  async _getHelpPages(
    collectionTypeOverride: string | undefined = undefined,
    collectionIdOverride: number | undefined = undefined
  ) {
    if (this.collectionId) {
      const helpPages = (await window.serverApi.getHelpPages(
        collectionTypeOverride ? collectionTypeOverride : this.collectionType,
        collectionIdOverride ? collectionIdOverride : this.collectionId
      )) as Array<YpHelpPageData> | undefined;
      if (helpPages) {
        this.fire("yp-set-pages", helpPages);
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
        this._setSelectedTabFromRoute(splitSubRoute[1]);
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
      default:
        tabNumber = CollectionTabTypes.Collection;
        break;
    }

    if (tabNumber) {
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
    if (this.loggedInUser && (!onlyAdminCanCreate || hasCollectionAccess)) {
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
  createNewCollection() {
    let childCollectionType;
    if (this.collectionType == "domain") {
      childCollectionType = "community";
    } else if (this.collectionType == "community") {
      childCollectionType = "group";
    } else {
      console.error("Invalid collection type for create new collection");
      return;
    }
    YpNavHelpers.redirectTo(
      `/admin/${childCollectionType}/new/${this.collectionId}`
    );
  }

  get hasCustomTheme() {
    if (
      this.collection &&
      this.collection.configuration &&
      this.collection.configuration.theme
    ) {
      return !(this.collection.configuration as YpGroupConfiguration).theme!
        .oneDynamicColor;
    } else {
      return false;
    }
  }

  // UI

  static override get styles() {
    return [
      super.styles,
      css`
        md-fab {
          z-index: 1;
          --md-fab-container-shape: 4px;
          //--md-fab-label-text-size: 16px !important;
          --md-fab-label-text-weight: 600 !important;
          margin-bottom: 24px;
        }

        md-tabs {
          border-bottom-color: transparent;
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

        md-secondary-tab[has-custom-theme] {
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
            width: 100%;
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
              aria-label="${this.collectionType}"
              role="banner"
            ></yp-collection-header>
          </div>
        `
      : nothing;
  }

  renderNewsAndMapTabs() {
    return html`
      <md-secondary-tab
        ?has-custom-theme="${this.hasCustomTheme}"
        ?hidden="${this.hideNewsfeed}"
        >${this.t("post.tabs.news")}<md-icon slot="icon"
          >rss_feed</md-icon
        ></md-secondary-tab
      >
      <md-secondary-tab
        ?has-custom-theme="${this.hasCustomTheme}"
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
            <md-secondary-tab
              ?has-custom-theme="${this.hasCustomTheme}"
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
    }

    return page;
  }

  // FFDC2F

  override render() {
    if (this.collection) {
      return html`
        <div class="layout vertical center-center">
          <div class="layout vertical topContainer">
            ${this.renderHeader()}
            <div class="layout horizontal mainContent">
              ${this.renderTabs()}
              <div class="flex"></div>
              ${this.createFabIcon && this.createFabLabel
                ? html`
                    <md-icon-button
                      hidden
                      class="filterButton"
                      .label="${this.t("filter")}"
                      ><md-icon>tune</md-icon></md-icon-button
                    >
                    <md-fab
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
