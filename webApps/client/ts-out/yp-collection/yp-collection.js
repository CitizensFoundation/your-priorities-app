var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import "@material/web/fab/fab.js";
import "@material/web/fab/fab.js";
import "./yp-collection-header.js";
import "./yp-collection-items-grid.js";
import { YpServerApi } from "../common/YpServerApi.js";
import "../ac-activities/ac-activities.js";
import "../yp-post/yp-post-map.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export const CollectionTabTypes = {
    Collection: 0,
    Newsfeed: 1,
    Map: 2,
};
export class YpCollection extends YpBaseElementWithLogin {
    constructor(collectionType, collectionItemType, collectionCreateFabIcon, collectionCreateFabLabel) {
        super();
        this.noHeader = false;
        this.tabsHidden = false;
        this.selectedTab = CollectionTabTypes.Collection;
        this.hideNewsfeed = false;
        this.locationHidden = false;
        this.hideCollection = false;
        this.collectionType = collectionType;
        this.collectionItemType = collectionItemType;
        this.collectionCreateFabIcon = collectionCreateFabIcon;
        this.collectionCreateFabLabel = collectionCreateFabLabel;
        //TODO: Fix this as it causes loadMoreData to be called twice on post lists at least
        this.addGlobalListener("yp-logged-in", this.loggedInUserCustom.bind(this));
        this.addGlobalListener("yp-got-admin-rights", this.getCollection.bind(this));
    }
    async loggedInUserCustom() {
        //TODO: Look into this, find a better solution than waiting
        await new Promise((r) => setTimeout(r, 1500));
        if (!this.collection || !this.collection.id) {
            // this.getCollection();
        }
    }
    // DATA PROCESSING
    connectedCallback() {
        super.connectedCallback();
        if (this.collection)
            this.refresh();
    }
    refresh() {
        console.info("REFRESH");
        if (this.collection) {
            if (this.collection.default_locale != null) {
                window.appGlobals.changeLocaleIfNeeded(this.collection.default_locale);
            }
            this.fire("yp-set-home-link", {
                type: this.collectionType,
                id: this.collection.id,
                name: this.collection.name,
            });
            this.fire("yp-change-header", {
                headerTitle: null,
                documentTitle: this.collection.name,
                headerDescription: this.collection.description || this.collection.objectives,
            });
            if (this.collection.configuration?.hideAllTabs ||
                this.collection.configuration
                    ?.hideGroupLevelTabs) {
                this.tabsHidden = true;
            }
            else {
                this.tabsHidden = false;
            }
            if (this.$$("#collectionItems")) {
                this.$$("#collectionItems").refresh();
            }
        }
    }
    async getCollection() {
        if (this.collectionId) {
            //this.collection = undefined;
            this.collectionItems = undefined;
            this.collection = (await window.serverApi.getCollection(this.collectionType, this.collectionId));
            this.refresh();
        }
        else {
            console.error("No collection id for getCollection");
        }
    }
    async _getHelpPages(collectionTypeOverride = undefined, collectionIdOverride = undefined) {
        if (this.collectionId) {
            const helpPages = (await window.serverApi.getHelpPages(collectionTypeOverride ? collectionTypeOverride : this.collectionType, collectionIdOverride ? collectionIdOverride : this.collectionId));
            if (helpPages) {
                this.fire("yp-set-pages", helpPages);
            }
        }
        else {
            console.error("Collection id setup for get help pages");
        }
    }
    get collectionTabLabel() {
        const translatedCollectionItems = this.t(YpServerApi.transformCollectionTypeToApi(this.collectionItemType));
        return `${translatedCollectionItems} (${this.collectionItems ? this.collectionItems.length : 0})`;
    }
    // UI
    static get styles() {
        return [
            super.styles,
            css `
        md-fab {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 3000;
        }

        md-icon-button {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        md-filled-text-field {
          margin-left: 8px;
          margin-right: 8px;
        }

        mwc-tab {
          font-family: var(--app-header-font-family, Roboto);
        }

        md-tabs {
          width: 960px;
        }

        @media (max-width: 960px) {
          md-tabs {
            width: 100%;
          }
        }

        .header {
          background-image: var(--top-area-background-image, none);
          height: 300px;
        }

        .createFab[is-map] {
          right: inherit;
          left: 28px;
        }

        @media (max-width: 960px) {
          .header {
            height: 100%;
            background-image: none;
          }

          .currentPage {
            margin-bottom: 220px;
            margin-top: 16px
          }
        }
      `,
        ];
    }
    renderHeader() {
        return this.collection && !this.noHeader
            ? html `
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
        return html `
      <md-primary-tab ?hidden="${this.hideNewsfeed}"
        >${this.t("post.tabs.news")}<md-icon slot="icon"
          >rss_feed</md-icon
        ></md-primary-tab
      >
      <md-primary-tab
        ?hidden="${this.locationHidden || this.collectionType == "domain"}"
      >
        ${this.t("post.tabs.location")}<md-icon slot="icon"
          >location_on</md-icon
        ></md-primary-tab
      >
    `;
    }
    renderTabs() {
        if (this.collection && !this.tabsHidden) {
            return html `
        <div class="layout vertical center-center">
          <md-tabs
            @change="${this._selectTab}"
            .activeTabIndex="${this.selectedTab}"
          >
            <md-primary-tab ?hidden="${this.hideCollection}"
              >${this.collectionTabLabel}
              <md-icon slot="icon">groups</md-icon></md-primary-tab
            >
            ${this.renderNewsAndMapTabs()}
          </md-tabs>
        </div>
      `;
        }
        else {
            return nothing;
        }
    }
    renderCurrentTabPage() {
        let page;
        switch (this.selectedTab) {
            case CollectionTabTypes.Collection:
                page =
                    this.collectionItems && this.collectionItemType
                        ? html `<yp-collection-items-grid
                id="collectionItems"
                .collectionItems="${this.collectionItems}"
                .collection="${this.collection}"
                .collectionType="${this.collectionType}"
                .collectionItemType="${this.collectionItemType}"
                .collectionId="${this.collectionId}"
              ></yp-collection-items-grid>`
                        : html ``;
                break;
            case CollectionTabTypes.Newsfeed:
                page = html `<ac-activities
          id="collectionActivities"
          .selectedTab="${this.selectedTab}"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId}"
        ></ac-activities>`;
                break;
            case CollectionTabTypes.Map:
                page = html `<yp-post-map
          id="postsMap"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId}"
        ></yp-post-map>`;
                break;
        }
        return page;
    }
    createNewCollection() {
        let childCollectionType;
        if (this.collectionType == "domain") {
            childCollectionType = "community";
        }
        else if (this.collectionType == "community") {
            childCollectionType = "group";
        }
        else {
            console.error("Invalid collection type for create new collection");
            return;
        }
        YpNavHelpers.redirectTo(`/admin/${childCollectionType}/new/${this.collectionId}`);
    }
    render() {
        return html `
      ${this.renderHeader()} ${this.renderTabs()}
      ${this.createFabIcon && this.createFabLabel
            ? html `
            <div class="layout horizontal center-center wrap">
              <md-fab
                ?extended="${this.wide}"
                class="createFab"
                @click="${this.createNewCollection}"
                ?is-map="${this.selectedTab === CollectionTabTypes.Map}"
                .label="${this.t(this.createFabLabel)}"
                .icon="${this.createFabIcon}"
              >
                <md-icon slot="icon">add</md-icon></md-fab
              >
              <md-icon-button
                hidden
                class="filterButton"
                .label="${this.t("filter")}"
                ><md-icon>tune</md-icon></md-icon-button
              >
            </div>
          `
            : nothing}
      <div class="currentPage">
        ${this.renderCurrentTabPage()}
      </div>
    `;
    }
    // EVENTS
    collectionIdChanged() {
        this.getCollection();
        this._getHelpPages();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("subRoute") && this.subRoute) {
            const splitSubRoute = this.subRoute.split("/");
            this.collectionId = parseInt(splitSubRoute[1]);
            if (splitSubRoute.length > 2) {
                this._setSelectedTabFromRoute(splitSubRoute[1]);
            }
            else {
                this._setSelectedTabFromRoute("default");
            }
        }
        if (changedProperties.has("collectionId") && this.collectionId) {
            this.collectionIdChanged();
        }
    }
    _selectTab(event) {
        this.selectedTab = event.currentTarget.activeTabIndex;
    }
    _setSelectedTabFromRoute(routeTabName) {
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
            window.appGlobals.activity("open", this.collectionType + "_tab_" + routeTabName);
        }
    }
    scrollToCachedItem() {
        if (this.selectedTab === CollectionTabTypes.Newsfeed &&
            window.appGlobals.cache.cachedActivityItem) {
            const activities = this.$$("#collectionActivities");
            if (activities) {
                activities.scrollToItem(window.appGlobals.cache.cachedActivityItem);
                window.appGlobals.cache.cachedActivityItem = undefined;
            }
            else {
                console.error("No activities for scroll to item");
            }
        }
        else if (this.selectedTab === CollectionTabTypes.Collection) {
            this.scrollToCollectionItemSubClass();
        }
    }
    scrollToCollectionItemSubClassDomain() {
        if (this.collection &&
            window.appGlobals.cache.backToDomainCommunityItems &&
            window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]) {
            this.$$("#collectionItems").scrollToItem(window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]);
            window.appGlobals.cache.backToDomainCommunityItems[this.collection.id] =
                undefined;
        }
    }
    setFabIconIfAccess(onlyAdminCanCreate, hasCollectionAccess) {
        if (onlyAdminCanCreate || hasCollectionAccess) {
            this.createFabIcon = this.collectionCreateFabIcon;
            this.createFabLabel = this.collectionCreateFabLabel;
        }
        else {
            this.createFabIcon = undefined;
            this.createFabLabel = undefined;
        }
    }
    //TODO: Review this when we remove the group community links
    _useHardBack(configuration) {
        if (configuration && configuration.customBackURL) {
            const backUrl = configuration.customBackURL;
            if (backUrl.startsWith("/community/") ||
                backUrl.startsWith("/group/") ||
                backUrl.startsWith("/domain/") ||
                backUrl.startsWith("/post/")) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
}
__decorate([
    property({ type: Boolean })
], YpCollection.prototype, "noHeader", void 0);
__decorate([
    property({ type: Boolean })
], YpCollection.prototype, "tabsHidden", void 0);
__decorate([
    property({ type: Number })
], YpCollection.prototype, "collectionId", void 0);
__decorate([
    property({ type: String })
], YpCollection.prototype, "collectionName", void 0);
__decorate([
    property({ type: Object })
], YpCollection.prototype, "collection", void 0);
__decorate([
    property({ type: String })
], YpCollection.prototype, "subRoute", void 0);
__decorate([
    property({ type: Number })
], YpCollection.prototype, "selectedTab", void 0);
__decorate([
    property({ type: Array })
], YpCollection.prototype, "collectionItems", void 0);
__decorate([
    property({ type: Boolean })
], YpCollection.prototype, "hideNewsfeed", void 0);
__decorate([
    property({ type: Boolean })
], YpCollection.prototype, "locationHidden", void 0);
__decorate([
    property({ type: Boolean })
], YpCollection.prototype, "hideCollection", void 0);
__decorate([
    property({ type: String })
], YpCollection.prototype, "createFabIcon", void 0);
__decorate([
    property({ type: String })
], YpCollection.prototype, "createFabLabel", void 0);
//# sourceMappingURL=yp-collection.js.map