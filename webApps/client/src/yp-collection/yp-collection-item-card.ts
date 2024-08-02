import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { ShadowStyles } from "../common/ShadowStyles.js";
import { MdMenu } from "@material/web/menu/menu.js";
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";

import "../common/yp-image.js";
import "../yp-magic-text/yp-magic-text.js";
import "./yp-collection-stats.js";
import { YpGroup } from "./yp-group.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpGroupType } from "./ypGroupType.js";

@customElement("yp-collection-item-card")
export class YpCollectionItemCard extends YpBaseElement {
  @property({ type: Object })
  item: YpCollectionData | undefined;

  @property({ type: String })
  itemType: string | undefined;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  static override get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .description {
          line-height: 25px;
          font-size: 17px;
          flex: 1;
          min-width: 0; /* This prevents overflow issues in some browsers */
          width: 100%;
        }

        .groupType {
          font-size: 14px;
          font-weight: 500;
          color: var(--md-sys-color-primary);
          text-transform: uppercase;
        }

        .groupType[is-folder] {
          color: var(--md-sys-color-secondary);
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
          margin-bottom: 16px;
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
          margin-right: 80px;
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

        .collection-name[featured] {
        }

        .collection-name[archived] {
        }

        .collection-name[has-data-viz] {
          padding-top: 26px;
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
            width: 100%;
            height: 100%;
            padding-bottom: 8px;
            max-width: 430px;
          }

          yp-image {
            width: 96vw;
            height: calc(96vw * 9 / 16);
            border-radius: 16px 16px 0px 0px;
            object-fit: cover;
            max-width: 430px;
            max-height: 242px;
          }

          yp-image[featured] {
          }

          .description {
            margin-bottom: 32px;
          }
        }

        @media (max-width: 420px) {
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

  get archived(): boolean {
    return this.item?.status === "archived";
  }

  get featured(): boolean {
    return this.item?.status === "featured";
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.item && (this.item as YpGroupData).Community) {
      this.collection = (this.item as YpGroupData).Community;
      const group = this.collection as YpGroupData;

      if (group.CommunityLink) {
        this.itemType = "groupCommunityLink";
      } else if (group.configuration.dataForVisualizationJson) {
        this.itemType = "groupDataViz";
      } else {
        this.itemType = "group";
      }
    } else if (this.item && (this.item as YpCommunityData).Domain) {
      this.collection = (this.item as YpCommunityData).Domain;
      this.itemType = "community";
    }
  }

  get groupTypeName() {
    if ((this.item as YpGroupData).configuration.hideGroupType === true) {
      return "";
    } else if ((this.item as YpGroupData).configuration.groupType) {
      switch (
        parseInt(
          (this.item as YpGroupData).configuration
            .groupType as unknown as string
        )
      ) {
        case YpGroupType.AllOurIdeas:
          return this.t("pairwiseVoting");
        case YpGroupType.IdeaGenerationAndDebate:
          return this.t("ideas");
        case YpGroupType.PsAgentWorkflow:
          return this.t("workFlow");
        case YpGroupType.StaticHtml:
          return this.t("html");
        default:
          return this.t("ideas");
      }
    } else {
      return this.t("ideas");
    }
  }

  goToItem(event: CustomEvent) {
    event.preventDefault();
    if (event.currentTarget && event.currentTarget) {
      const href = (event.currentTarget as HTMLElement).getAttribute("href");
      if (href) {
        YpNavHelpers.redirectTo(href);
      }
    }
  }

  _setupFontNameFontSize() {
    const collectionName = this.$$("#collectionName") as HTMLElement;
    if (collectionName && this.collection) {
      let classNames = "collection-name ";
      if (this.wide) {
        if (this.collection.name.length <= 18) {
          classNames += "collectionNameFontSize4Wide";
        } else if (this.collection.name.length > 40) {
          classNames += "collectionNameFontSize1Wide";
        } else if (this.collection.name.length > 30) {
          classNames += "collectionNameFontSize2Wide";
        } else if (this.collection.name.length > 18) {
          classNames += "collectionNameFontSize3Wide";
        }
      } else {
        if (this.collection.name.length <= 18) {
          classNames += "collectionNameFontSize4Mobile";
        } else if (this.collection.name.length > 40) {
          classNames += "collectionNameFontSize1Mobile";
        } else if (this.collection.name.length > 30) {
          classNames += "collectionNameFontSize2Mobile";
        } else if (this.collection.name.length > 18) {
          classNames += "collectionNameFontSize3Mobile";
        }
      }

      collectionName.className = classNames;
    }
  }

  get isGroupFolder() {
    return (
      (this.collection &&
        (this.collection as YpGroupData).configuration.groupType ===
          YpGroupType.Folder) ||
      (this.collection as YpGroupData).is_group_folder
    );
  }

  get collectionItemCount() {
    if (this.statsCollectionType === "group") {
      return (this.item as YpGroupData).counter_posts || 0;
    } else if (this.statsCollectionType === "community") {
      return (this.item as YpCommunityData).counter_groups || 0;
    } else if (this.statsCollectionType === "domain") {
      return (this.item as YpDomainData).counter_communities || 0;
    } else {
      return 0;
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("collection") && this.collection) {
      //TODO: Check if we need to setTimeout here
      this._setupFontNameFontSize();
    }
  }

  renderLogoImage() {
    return html`
      ${YpCollectionHelpers.logoImagePath(this.itemType, this.item!)
        ? html`
            <yp-image
              sizing="cover"
              ?archived="${this.archived}"
              alt="${this.collection!.name}"
              ?featured="${this.featured}"
              preload
              .src="${YpCollectionHelpers.logoImagePath(
                this.itemType,
                this.item!
              )}"
              class="post-image withPointer"
            ></yp-image>
          `
        : html`
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
    return html`
      <yp-data-visualization
        small
        .data="${(this.item as YpGroupData).configuration
          .dataForVisualizationJson}"
      ></yp-data-visualization>
    `;
  }

  renderCollectionType() {
    if (this.statsCollectionType === "group" &&
      this.item?.configuration &&
      (this.item as YpGroupData).configuration.hideGroupType !== true
    ) {
      return html`<div class="groupType" ?is-folder="${this.isGroupFolder}">
        ${this.groupTypeName}
      </div>`;
    } else {
      return nothing;
    }
  }

  renderCardInfo() {
    return html`
      <div class="layout horizontal wrap">
        ${this.itemType === "groupDataViz"
          ? html` ${this.renderDataViz()} `
          : html` ${this.renderLogoImage()} `}
        <div class="informationText layout vertical flex">
          ${this.renderCollectionType()}
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
              ?disableTranslation="${this.collection!.configuration
                ?.disableNameAutoTranslation}"
              textOnly
              .content="${this.contentName}"
              .contentId="${this.contentId}"
            ></yp-magic-text>
            ${this.collectionItemCount > 0
              ? html`
                  <div class="collectionItemCount">
                    (${this.collectionItemCount})
                  </div>
                `
              : nothing}
          </div>
          <yp-magic-text
            id="description"
            class="description layout vertical withPointer"
            ?featured="${this.featured}"
            ?largefont="${this.largeFont}"
            textType="collectionContent"
            .textType="${YpCollectionHelpers.descriptionTextType(
              this.itemType
            )}"
            .contentLanguage="${this.contentLanguage}"
            textOnly
            removeUrls
            .content="${this.contentDescription}"
            .contentId="${this.contentId}"
            truncate="300"
          >
          </yp-magic-text>
          <div class="stats layout horizontal">
            <yp-collection-stats
              .collectionType="${this.statsCollectionType}"
              .collection="${this.statsCollection}"
            ></yp-collection-stats>
          </div>
        </div>

        ${!this.collection
          ? html`
              <yp-membership-button
                .archived="${this.archived}"
                .featured="${this.featured}"
                .collection="${this.collection}"
              ></yp-membership-button>
            `
          : html``}
      </div>
    `;
  }

  get statsCollection() {
    if (this.itemType === "groupCommunityLink") {
      return (this.item as YpGroupData).CommunityLink!;
    } else {
      return this.item!;
    }
  }

  get statsCollectionType() {
    if (this.itemType === "groupCommunityLink") {
      return "communtiy";
    } else if (this.itemType === "groupDataViz") {
      return "group";
    } else {
      return this.itemType!;
    }
  }

  get contentDescription() {
    if (this.itemType === "groupCommunityLink") {
      return (this.item as YpGroupData).CommunityLink!.description;
    } else {
      return this.item!.description || this.item!.objectives;
    }
  }

  get contentName() {
    if (this.itemType === "groupCommunityLink") {
      return (this.item as YpGroupData).CommunityLink!.name;
    } else {
      return this.item!.name;
    }
  }

  get contentId() {
    if (this.itemType === "groupCommunityLink") {
      return (this.item as YpGroupData).CommunityLink!.id;
    } else {
      return this.item!.id;
    }
  }

  get contentLanguage() {
    if (this.itemType === "groupCommunityLink") {
      return (this.item as YpGroupData).CommunityLink!.language;
    } else {
      return this.item!.language;
    }
  }

  get contentUrlBase() {
    if (this.itemType === "groupCommunityLink") {
      return "community";
    } else if (this.itemType === "groupDataViz") {
      return "group_data_viz";
    } else {
      return this.itemType;
    }
  }

  override render() {
    return this.item && this.collection
      ? html`
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
}
