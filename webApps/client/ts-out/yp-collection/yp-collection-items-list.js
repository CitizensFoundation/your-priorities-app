var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { ShadowStyles } from "../common/ShadowStyles.js";
import { YpIronListHelpers } from "../common/YpIronListHelpers.js";
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";
import { FlowLayout } from "@lit-labs/virtualizer/layouts/flow.js";
import { GridLayout } from "@lit-labs/virtualizer/layouts/grid.js";
import "./yp-collection-item-card.js";
let YpCollectionItemsList = class YpCollectionItemsList extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.grid = false;
        this.useEvenOddItemLayout = false;
        this.skipIronListWidth = false;
    }
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
        .card {
          padding: 0;
          width: 100%;
        }

        .topLevelListItem {
        }

        lit-virtualizer {
          margin-top: 80px;
          margin-left: 32px;
          margin-right: 32px;
          padding-left: 32px;
          padding-right: 32px;
          //TODO: Check this !important usage
          max-width: 888px !important;
          min-width: 888px !important;
        }

        a {
          text-decoration: none;
          width: 100%;
        }

        @media (max-width: 600px) {
          lit-virtualizer {
            margin-top: 80px;
            margin-left: 8px;
            margin-right: 8px;
            padding-left: 8px;
            padding-right: 8px;
            width: 100% !important;
            min-width: 100% !important;
          }
          .card {
            margin-bottom: 16px;
          }
        }
      `,
        ];
    }
    render() {
        return this.sortedCollectionItems
            ? html `
          <lit-virtualizer
            id="list"
            role="main"
            .layout="${this.grid ? GridLayout : FlowLayout}"
            aria-label="${this.t(this.pluralItemType)}"
            .items="${this.sortedCollectionItems}"
            .scrollTarget="${window}"
            .keyFunction="${(item) => item.id}"
            .renderItem="${this.renderItem.bind(this)}"
          ></lit-virtualizer>
        `
            : nothing;
    }
    renderItem(item, index) {
        return html `
      <div class="layout vertical center-center topLevelListItem">
        <yp-collection-item-card
          class="card"
          .index="${index}"
          ?useEvenOddItemLayout="${this.useEvenOddItemLayout}"
          aria-label="${item.name}"
          ariarole="listitem"
          .item="${item}"
          @keypress="${this._keypress.bind(this)}"
          @click="${this._selectedItemChanged.bind(this)}"
        ></yp-collection-item-card>
      </div>
    `;
    }
    get pluralItemType() {
        if (this.collectionItemType == "community") {
            return "communities";
        }
        else if (this.collectionItemType == "group") {
            return "groups";
        }
        else if (this.collectionItemType == "post") {
            return "posts";
        }
        else {
            return "unknownItemType";
        }
    }
    _keypress(event) {
        if (event.keyCode == 13) {
            this._selectedItemChanged(event);
        }
    }
    async refresh() { }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        YpIronListHelpers.attachListeners(this);
    }
    async connectedCallback() {
        super.connectedCallback();
        if (this.collection && this.collectionItems) {
            const splitCommunities = YpCollectionHelpers.splitByStatus(this.collectionItems, this.collection.configuration);
            this.sortedCollectionItems = splitCommunities.featured.concat(splitCommunities.active.concat(splitCommunities.archived));
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        YpIronListHelpers.detachListeners(this);
    }
    // TODO: Make sure this fires each time on keyboard, mouse & phone - make sure back key on browser works also just with the A
    _selectedItemChanged(event) {
        const item = event.target.item;
        if (this.collectionItemType && item) {
            window.appGlobals.activity("open", this.collectionItemType, `/${this.collectionItemType}/${item.id}`, { id: item.id });
            if (this.collectionItemType === "community") {
                const community = item;
                if (community != undefined) {
                    window.appGlobals.cache.backToDomainCommunityItems[community.domain_id] = community;
                }
            }
            else if (this.collectionItemType === "group" && item) {
                const group = item;
                window.appGlobals.cache.backToCommunityGroupItems[group.community_id] =
                    group;
                window.appGlobals.cache.groupItemsCache[group.id] = group;
            }
        }
    }
    scrollToItem(item) {
        if (item && this.sortedCollectionItems) {
            for (let i = 0; i < this.sortedCollectionItems.length; i++) {
                if (this.sortedCollectionItems[i] == item) {
                    this.$$("#list").scrollToIndex(i);
                    break;
                }
            }
            this.fireGlobal("yp-refresh-activities-scroll-threshold");
        }
        else {
            console.error("No item to scroll too");
        }
    }
};
__decorate([
    property({ type: Object })
], YpCollectionItemsList.prototype, "collection", void 0);
__decorate([
    property({ type: Array })
], YpCollectionItemsList.prototype, "collectionItems", void 0);
__decorate([
    property({ type: String })
], YpCollectionItemsList.prototype, "collectionItemType", void 0);
__decorate([
    property({ type: Array })
], YpCollectionItemsList.prototype, "sortedCollectionItems", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], YpCollectionItemsList.prototype, "grid", void 0);
__decorate([
    property({ type: Boolean })
], YpCollectionItemsList.prototype, "useEvenOddItemLayout", void 0);
YpCollectionItemsList = __decorate([
    customElement("yp-collection-items-list")
], YpCollectionItemsList);
export { YpCollectionItemsList };
//# sourceMappingURL=yp-collection-items-list.js.map