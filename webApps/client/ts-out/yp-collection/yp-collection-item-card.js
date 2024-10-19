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
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";
import "../common/yp-image.js";
import "../yp-magic-text/yp-magic-text.js";
import "./yp-collection-stats.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpGroupType } from "./ypGroupType.js";
let YpCollectionItemCard = class YpCollectionItemCard extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.useEvenOddItemLayout = false;
        this.index = 0;
    }
    get isEvenIndex() {
        return this.index % 2 === 0;
    }
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
        .description {
          line-height: 25px;
          font-size: 17px;
          width: 618px;
          min-width: 100%;
        }

        .groupType {
          font-size: 14px;
          font-weight: 500;
          color: var(--md-sys-color-tertiary);
          text-transform: uppercase;
        }

        .groupType[is-folder] {
          color: var(--md-sys-color-tertiary);
        }

        .stats {
          width: 100%;
          text-align: right;
          justify-content: flex-end;
        }

        .collectionCard {
          padding-right: 32px;
          padding-top: 16px;
          padding-bottom: 16px;
          margin-bottom: 48px;
        }

        a {
          color: var(--md-sys-color-on-surface);
        }

        .collectionCard[featured] {
        }

        yp-image {
          width: 292px;
          height: 164px;
        }

        yp-image[featured] {
        }

        .card-content {
        }

        yp-image {
          padding: 0;
          margin: 0;
          margin-right: 42px;
        }

        yp-image[is-odd] {
          margin-right: 0;
          margin-left: 42px;
        }

        .collectionCard {
          vertical-align: text-top;
        }

        .informationText {
          vertical-align: text-top;
        }

        .collection-name,
        .collectionItemCount {
          cursor: pointer;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
          font-family: var(--md-ref-typeface-brand);
        }

        .collectionItemCount {
          padding-left: 8px;
        }

        yp-image[archived] {
        }

        yp-membership-button {
          position: absolute;
          top: 159px;
          right: 24px;
          width: 30px;
          height: 30px;
        }

        .edit {
          position: absolute;
          bottom: 0;
          right: 0;
          padding-right: 0;
          margin-right: 0;
          text-align: right;
        }

        yp-membership-button[archived] {
          display: none;
        }

        @media (max-width: 960px) {
          :host {
            max-width: 100%;
            width: 100%;
            padding-top: 0 !important;
            max-width: 430px;
          }

          yp-membership-button {
            top: 205px;
          }

          .collectionCard {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 90%;
            height: 100%;
            padding-bottom: 8px;
            max-width: 90%;
          }

          yp-image {
            width: 80vw;
            height: calc(80vw * 9 / 16);
            max-width: 430px;
            max-height: 242px;
          }

          yp-image[featured] {
          }

          .description {
            margin-bottom: 32px;
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .description {
            width: 100%;
          }

          yp-membership-button {
            top: 205px;
          }
        }

        @media (max-width: 375px) {
          yp-membership-button {
            top: 185px;
          }
        }

        @media (max-width: 360px) {
        }

        @media (max-width: 320px) {
          yp-membership-button {
            top: 155px;
          }
        }

        .withPointer {
          cursor: pointer;
        }

        [hidden] {
          display: none !important;
        }

        a {
          text-decoration: none;
        }
      `,
        ];
    }
    get archived() {
        return this.item?.status === "archived";
    }
    get featured() {
        return this.item?.status === "featured";
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.item && this.item.Community) {
            this.collection = this.item;
            const group = this.collection;
            if (group.CommunityLink) {
                this.itemType = "groupCommunityLink";
            }
            else if (group.configuration.dataForVisualizationJson) {
                this.itemType = "groupDataViz";
            }
            else {
                this.itemType = "group";
            }
        }
        else if (this.item && this.item.Domain) {
            this.collection = this.item.Domain;
            this.itemType = "community";
        }
    }
    get groupTypeName() {
        if (this.item.configuration.hideGroupType === true) {
            return "";
        }
        else if (this.item.configuration.groupType) {
            switch (parseInt(this.item.configuration
                .groupType)) {
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
        }
        else {
            return this.t("ideas");
        }
    }
    goToItem(event) {
        event.preventDefault();
        if (event.currentTarget && event.currentTarget) {
            const href = event.currentTarget.getAttribute("href");
            if (href) {
                YpNavHelpers.redirectTo(href);
            }
        }
    }
    // Deprecated
    _setupFontNameFontSize() { }
    get isGroupFolder() {
        return ((this.collection &&
            this.collection.configuration.groupType ===
                YpGroupType.Folder) ||
            this.collection.is_group_folder);
    }
    get collectionItemCount() {
        if (this.statsCollectionType === "group") {
            return this.item.counter_posts || 0;
        }
        else if (this.statsCollectionType === "community") {
            return this.item.counter_groups || 0;
        }
        else if (this.statsCollectionType === "domain") {
            return this.item.counter_communities || 0;
        }
        else {
            return 0;
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("collection") && this.collection) {
            //TODO: Check if we need to setTimeout here
            this._setupFontNameFontSize();
        }
    }
    renderLogoImage() {
        return html `
      ${YpCollectionHelpers.logoImagePath(this.itemType, this.item)
            ? html `
            <yp-image
             ?is-odd="${this.useEvenOddItemLayout && !this.isEvenIndex}"
              sizing="cover"
              ?archived="${this.archived}"
              alt="${this.collection.name}"
              ?featured="${this.featured}"
              preload
              .src="${YpCollectionHelpers.logoImagePath(this.itemType, this.item)}"
              class="post-image withPointer"
            ></yp-image>
          `
            : html `
            <yp-image
              ?archived="${this.archived}"
              sizing="cover"
              class="main-image withPointer"
              src="https://i.imgur.com/sdsFAoT.png"
            ></yp-image>
          `}
    `;
    }
    renderDataViz() {
        return html `
      <yp-data-visualization
        small
        .data="${this.item.configuration
            .dataForVisualizationJson}"
      ></yp-data-visualization>
    `;
    }
    renderCollectionType() {
        if (this.statsCollectionType === "group" &&
            this.item?.configuration &&
            this.item.configuration.hideGroupType !== true) {
            return html `<div class="groupType" ?is-folder="${this.isGroupFolder}">
        ${this.groupTypeName}
      </div>`;
        }
        else {
            return nothing;
        }
    }
    renderCollectionName() {
        return html `
      <div class="layout horizontal">
        <yp-magic-text
          id="collectionName"
          class="collection-name"
          ?archived="${this.archived}"
          ?featured="${this.featured}"
          ?largefont="${this.largeFont}"
          @click="${this.goToItem}"
          .textType="${YpCollectionHelpers.nameTextType(this.itemType)}"
          .contentLanguage="${this.contentLanguage}"
          ?disableTranslation="${this.collection.configuration
            ?.disableNameAutoTranslation}"
          textOnly
          .content="${this.contentName}"
          .contentId="${this.contentId}"
        ></yp-magic-text>
        ${this.collectionItemCount > 0
            ? html `
              <div class="collectionItemCount">
                (${this.collectionItemCount})
              </div>
            `
            : nothing}
      </div>
    `;
    }
    renderCollectionDescription() {
        return html `
      <yp-magic-text
        id="description"
        class="description layout vertical withPointer"
        ?featured="${this.featured}"
        ?largefont="${this.largeFont}"
        textType="collectionContent"
        .textType="${YpCollectionHelpers.descriptionTextType(this.itemType)}"
        .contentLanguage="${this.contentLanguage}"
        textOnly
        removeUrls
        .content="${this.contentDescription}"
        .contentId="${this.contentId}"
        truncate="300"
      >
      </yp-magic-text>
    `;
    }
    renderMembershipButton() {
        if (false) {
            return html `${!this.collection
                ? html `
            <yp-membership-button
              hidden
              .archived="${this.archived}"
              .featured="${this.featured}"
              .collection="${this.collection}"
            ></yp-membership-button>
          `
                : html ``} `;
        }
        else {
            return nothing;
        }
    }
    renderCollectionStats() {
        return html `<div class="stats layout horizontal" ?hidden="${this.itemType == "groupCommunityLink"}">
      <yp-collection-stats
        .collectionType="${this.statsCollectionType}"
        .collection="${this.statsCollection}"
      ></yp-collection-stats>
    </div>`;
    }
    renderCardInfo() {
        if (this.useEvenOddItemLayout && !this.isEvenIndex) {
            return html `
        <div class="layout horizontal wrap">
          <div class="informationText layout vertical flex">
            ${this.renderCollectionType()} ${this.renderCollectionName()}
            ${this.renderCollectionDescription()}
            ${this.renderCollectionStats()}
          </div>
          ${this.renderLogoImage()}
        </div>
      `;
        }
        else {
            return html `
        <div class="layout horizontal wrap">
          ${this.renderLogoImage()}
          <div class="informationText layout vertical flex">
            ${this.renderCollectionType()} ${this.renderCollectionName()}
            ${this.renderCollectionDescription()}
            ${this.renderCollectionStats()}
          </div>
        </div>
      `;
        }
    }
    get statsCollection() {
        if (this.itemType === "groupCommunityLink") {
            return this.item.CommunityLink;
        }
        else {
            return this.item;
        }
    }
    get statsCollectionType() {
        if (this.itemType === "groupCommunityLink") {
            return "communtiy";
        }
        else if (this.itemType === "groupDataViz") {
            return "group";
        }
        else {
            return this.itemType;
        }
    }
    get contentDescription() {
        if (this.itemType === "groupCommunityLink") {
            return this.item.CommunityLink.description;
        }
        else {
            return this.item.description || this.item.objectives;
        }
    }
    get contentName() {
        if (this.itemType === "groupCommunityLink") {
            return this.item.CommunityLink.name;
        }
        else {
            return this.item.name;
        }
    }
    get contentId() {
        if (this.itemType === "groupCommunityLink") {
            return this.item.CommunityLink.id;
        }
        else {
            return this.item.id;
        }
    }
    get contentLanguage() {
        if (this.itemType === "groupCommunityLink") {
            return this.item.CommunityLink.language;
        }
        else {
            return this.item.language;
        }
    }
    get contentUrlBase() {
        if (this.itemType === "groupCommunityLink") {
            return "community";
        }
        else if (this.itemType === "groupDataViz") {
            return "group_data_viz";
        }
        else {
            return this.itemType;
        }
    }
    render() {
        return this.item && this.collection
            ? html `
          <a
            href="/${this.contentUrlBase}/${this.contentId}"
            @click="${this.goToItem}"
            class="layout vertical center-center"
          >
            <div
              ?featured="${this.featured}"
              class="collectionCard layout horizontal"
            >
              ${this.renderCardInfo()}
            </div>
          </a>
        `
            : nothing;
    }
};
__decorate([
    property({ type: Object })
], YpCollectionItemCard.prototype, "item", void 0);
__decorate([
    property({ type: String })
], YpCollectionItemCard.prototype, "itemType", void 0);
__decorate([
    property({ type: Object })
], YpCollectionItemCard.prototype, "collection", void 0);
__decorate([
    property({ type: Boolean })
], YpCollectionItemCard.prototype, "useEvenOddItemLayout", void 0);
__decorate([
    property({ type: Number })
], YpCollectionItemCard.prototype, "index", void 0);
YpCollectionItemCard = __decorate([
    customElement("yp-collection-item-card")
], YpCollectionItemCard);
export { YpCollectionItemCard };
//# sourceMappingURL=yp-collection-item-card.js.map