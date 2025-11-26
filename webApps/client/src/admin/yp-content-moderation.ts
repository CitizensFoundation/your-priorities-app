import { LitElement, PropertyValueMap, css, html, nothing, render } from "lit";
import { property, customElement } from "lit/decorators.js";

import { Corner, MdMenu } from "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/progress/circular-progress.js";

import "@vaadin/vaadin-grid/vaadin-grid.js";
import type {
  GridElement,
  GridItemModel,
} from "@vaadin/vaadin-grid/vaadin-grid.js";

import { GridColumnElement } from "@vaadin/vaadin-grid/src/vaadin-grid-column";

import "@vaadin/grid/vaadin-grid.js";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/grid/vaadin-grid-filter-column.js";
import "@vaadin/grid/vaadin-grid-sort-column.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog";
import "../yp-magic-text/yp-magic-text.js";
import "../yp-point/yp-point.js";
import "../yp-post/yp-post.js";

interface RowData {
  item: YpModerationItem;
}

interface SelectedItemIdsAndType {
  id: number;
  modelType: string;
}

@customElement("yp-content-moderation")
export class YpContentModeration extends YpBaseElement {
  @property({ type: Boolean })
  multiSortEnabled = false;

  @property({ type: Boolean })
  opened = false;

  @property({ type: Boolean })
  showReload = false;

  @property({ type: Boolean })
  forceSpinner = false;

  @property({ type: Boolean })
  selectedItemsEmpty = true;

  @property({ type: Array })
  items: Array<YpModerationItem> | undefined;

  @property({ type: Array })
  selectedItems: Array<YpModerationItem> | undefined;

  @property({ type: String })
  headerText: string | undefined;

  @property({ type: Number })
  groupId: number | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Number })
  domainId: number | undefined;

  @property({ type: Number })
  userId: number | undefined;

  @property({ type: Object })
  selected: YpDatabaseItem | undefined;

  @property({ type: String })
  modelType: string | undefined;

  @property({ type: Number })
  selectedItemsCount = 0;

  @property({ type: Array })
  selectedItemIdsAndType: Array<SelectedItemIdsAndType> | undefined;

  @property({ type: Number })
  selectedItemId: number | undefined;

  @property({ type: String })
  selectedModelClass: string | undefined | null;

  @property({ type: String })
  collectionName: string | undefined;

  @property({ type: String })
  itemsCountText: string | undefined;

  @property({ type: Object })
  resizeTimeout: any | undefined;

  @property({ type: String })
  typeOfModeration: "moderate_all_content" | "flagged_content" =
    "moderate_all_content";

  @property({ type: Object })
  activeItem: YpDatabaseItem | undefined;

  allowGridEventsAfterMenuOpen = false;

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);
    if (
      changedProperties.has("groupId") ||
      changedProperties.has("communityId") ||
      changedProperties.has("domainId") ||
      changedProperties.has("userId")
    ) {
      this._refreshAfterChange();
    }
    if (changedProperties.has("activeItem")) {
      this._activeItemChanged(
        this.activeItem,
        changedProperties.get("activeItem") as YpDatabaseItem | undefined
      );
    }
  }

  private _onActiveItemChanged(
    e: CustomEvent<GridItemModel<YpModerationItem>>
  ) {
    //@ts-ignore - investigate why the right type is not working
    this.activeItem = e.detail.value;
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100%;
          height: 100%;
          margin: 0;
          top: unset !important;
          left: unset !important;
        }

        .itemItem {
          padding-right: 16px;
        }

        .id {
          width: 40px;
        }

        .name {
          width: 200px;
        }

        .email {
          width: 190px;
          overflow-wrap: break-word;
        }

        .addDeletedButtons {
          width: 150px;
        }

        [hidden] {
          display: none !important;
        }

        vaadin-grid {
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          font-family: var(--md-sys-typescale-body-medium-font-family-name);
          font-size: var(--md-sys-typescale-body-medium-font-size);
          font-weight: var(--md-sys-typescale-body-medium-font-weight);
          line-height: var(--md-sys-typescale-body-medium-line-height);
        }

        vaadin-grid::part(header-cell) {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface-variant);
          font-weight: var(--md-sys-typescale-title-small-font-weight);
        }

        vaadin-grid::part(cell) {
          color: var(--md-sys-color-on-surface-container);
        }

        vaadin-grid::part(body-cell) {
          background-color: var(--md-sys-color-surface-container-lowest);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        vaadin-grid::part(row) {
          background-color: var(--md-sys-color-surface-container-lowest);
          color: var(--md-sys-color-on-surface);
        }

        vaadin-grid::part(row):nth-child(even) {
          background-color: var(--md-sys-color-surface-variant);
        }

        vaadin-grid::part(row:hover) {
          background-color: var(--md-sys-color-surface-container-highest);
        }

        vaadin-grid::part(selected-row) {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        /* Ensure proper spacing and alignment */
        vaadin-grid-cell-content {
          padding: 12px 16px;
        }

        /* Style for the sort indicators */
        vaadin-grid-sorter {
          color: var(--md-sys-color-on-surface-variant);
        }

        vaadin-grid-sorter[direction] {
          color: var(--md-sys-color-primary);
        }

        .headerBox {
          background-color: var(--md-sys-primary-container);
          color: var(--md-sys-on-primary-container);
          margin: 0;
          padding: 0 0;
          padding-top: 12px;
          padding-bottom: 10px;
        }

        md-text-button {
          margin-left: 8px;
        }

        #grid {
          margin-top: 0;
        }

        .headerText {
          padding: 0 0 !important;
        }

        .collectionName {
          font-size: 22px;
          margin-bottom: 1px;
          margin-top: 4px;
        }

        .innerHeader {
          font-size: 17px;
        }

        .closeButton {
          width: 50px;
          height: 50px;
          margin-left: 4px;
          margin-right: 4px;
        }

        md-checkbox {
          margin-top: 16px;
          margin-right: 24px;
        }

        @media (max-width: 600px) {
          .closeButton {
            width: 45px;
            height: 45px;
          }

          paper-listbox {
            margin-right: 8px;
          }

          #dialog {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }

          .headerText {
            font-size: 20px;
            line-height: 1.2em;
            text-align: center;
          }
        }

        .details {
          display: flex;
          margin: 8px;
          max-width: 100%;
          overflow: hidden;
        }

        .detailArea {
          max-width: 100%;
          padding: 16px;
          box-sizing: border-box;
        }

        .creatorEmail {
          font-weight: 500;
          color: var(--md-sys-color-primary);
          margin-bottom: 8px;
          font-size: 13px;
        }

        .contentText {
          max-width: 600px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
          line-height: 1.4;
          padding: 12px;
          background: var(--md-sys-color-surface-container-low);
          border-radius: 8px;
          margin-bottom: 12px;
        }

        yp-point {
          min-height: 100px;
          max-width: 500px;
          margin-bottom: 8px;
        }

        yp-post-header {
          margin-bottom: 8px;
        }

        md-text-button {
          font-size: 18px;
          margin-top: 16px;
        }

        .analysis {
          margin-top: 12px;
          font-size: 12px;
        }

        .leftColumn {
          padding-right: 16px;
        }

        .mainScore {
          font-weight: 500;
        }

        .linkIcon {
        }

        vaadin-grid {
          font-size: 12px;
          max-width: 100%;
        }

        vaadin-grid::part(header-cell) {
          font-size: 12px;
        }

        vaadin-grid-cell-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 8px 6px;
        }
      `,
    ];
  }

  renderContent(root: HTMLElement, column: any, rowData: RowData) {
    const item = rowData.item;
    return render(
      html`
        <div class="layout horizontal">
          <yp-magic-text
            .contentId="${item.id}"
            .content="${item.pointTextContent}"
            textType="pointContent"
          ></yp-magic-text>
          <yp-magic-text
            .contentId="${item.id}"
            .content="${item.postNameContent}"
            textType="postName"
          ></yp-magic-text>
          &nbsp;
          <yp-magic-text
            .contentId="${item.id}"
            .content="${item.postTextContent}"
            textType="postContent"
          ></yp-magic-text>
          &nbsp;
          <yp-magic-text
            .contentId="${item.id}"
            .content="${item.postTranscriptContent}"
            textType="postTranscriptContent"
          ></yp-magic-text>
        </div>
      `,
      root
    );
  }

  renderItemDetail(root: HTMLElement, column: any, rowData: RowData) {
    const item = rowData.item;
    const contentText = item.pointTextContent || item.postNameContent || item.postTextContent || item.postTranscriptContent || "";
    return render(
      html`
        <div class="details layout vertical detailArea">
          <div class="creatorEmail">${item.user_email || "n/a"}</div>
          <div class="contentText">${contentText}</div>
          <div class="layout horizontal center-center">
            ${item.is_post
              ? html`
                  <a href="/post/${item.id}" target="_blank">
                    <md-icon-button .ariaLabel="${this.t("linkToContentItem")}">
                      <md-icon>link</md-icon>
                    </md-icon-button>
                  </a>
                `
              : nothing}
            ${item.is_point && item.post_id
              ? html`
                  <a href="/post/${item.post_id}/${item.id}" target="_blank">
                    <md-icon-button .ariaLabel="${this.t("linkToContentItem")}">
                      <md-icon>link</md-icon>
                    </md-icon-button>
                  </a>
                `
              : nothing}
          </div>

          ${item.moderation_data &&
          item.moderation_data.moderation &&
          item.moderation_data.moderation.toxicityScore
            ? html`
                <div class="layout horizontal analysis">
                  <div
                    class="layout vertical leftColumn"
                    ?hidden="${this.userId != undefined}"
                  >
                    <div
                      class="mainScore"
                      ?hidden="${!item.moderation_data.moderation
                        .toxicityScore}"
                    >
                      Toxicity Score:
                      ${this._toPercent(
                        item.moderation_data.moderation.toxicityScore
                      )}
                    </div>
                    <div
                      ?hidden="${!item.moderation_data.moderation
                        .identityAttackScore}"
                    >
                      Identity Attack Score:
                      ${this._toPercent(
                        item.moderation_data.moderation.identityAttackScore
                      )}
                    </div>
                    <div
                      ?hidden="${!item.moderation_data.moderation.threatScore}"
                    >
                      Threat Score:
                      ${this._toPercent(
                        item.moderation_data.moderation.threatScore
                      )}
                    </div>
                    <div
                      ?hidden="${!item.moderation_data.moderation.insultScore}"
                    >
                      Insult Score:
                      ${this._toPercent(
                        item.moderation_data.moderation.insultScore
                      )}
                    </div>
                  </div>
                  <div
                    class="layout vertical"
                    ?hidden="${this.userId != undefined}"
                  >
                    <div
                      class="mainScore"
                      ?hidden="${!item.moderation_data.moderation
                        .severeToxicityScore}"
                    >
                      Severe Toxicity Score:
                      ${this._toPercent(
                        item.moderation_data.moderation.severeToxicityScore
                      )}
                    </div>
                    <div
                      ?hidden="${!item.moderation_data.moderation
                        .profanityScore}"
                    >
                      Profanity Score:
                      ${this._toPercent(
                        item.moderation_data.moderation.profanityScore
                      )}
                    </div>
                    <div
                      ?hidden="${!item.moderation_data.moderation
                        .sexuallyExplicitScore}"
                    >
                      Sexually Excplicit Score:
                      ${this._toPercent(
                        item.moderation_data.moderation.sexuallyExplicitScore
                      )}
                    </div>
                    <div
                      ?hidden="${!item.moderation_data.moderation
                        .flirtationScore}"
                    >
                      Flirtation Score:
                      ${this._toPercent(
                        item.moderation_data.moderation.flirtationScore
                      )}
                    </div>
                  </div>
                </div>
              `
            : nothing}
        </div>
      `,
      root
    );
  }

  renderActionHeader(
    root: HTMLElement,
    column?: GridColumnElement | undefined
  ) {
    return render(
      html`
        <div style="position: relative;">
          <md-icon-button
            id="selected-items-anchor"
            .ariaLabel="${this.t("openSelectedItemsMenu")}"
            @click="${this._openSelectedMenu.bind(this)}"
          ><md-icon>more_vert</md-icon></md-icon-button>
          <md-menu
            id="selectedItemsMenu"
            class="helpButton"
            positioning="popover"
            .menuCorner="${Corner.START_END}"
            anchor="selected-items-anchor"
            ?disabled="${this.selectedItemsEmpty}"
            @opened="${this._refreshGridAsyncDelay.bind(this)}"
          >
            <md-menu-item
              ?hidden="${this.userId != undefined}"
              @click="${this._approveSelected.bind(this)}"
            >
              ${this.t("approveSelectedContent")} ${this.selectedItemsCount}
            </md-menu-item>
            <md-menu-item
              ?hidden="${!this.onlyFlaggedItems}"
              @click="${this._clearSelectedFlags.bind(this)}"
            >
              ${this.t("clearSelectedFlags")} ${this.selectedItemsCount}
            </md-menu-item>
            <md-menu-item
              ?hidden="${this.userId != undefined}"
              @click="${this._blockSelected.bind(this)}"
            >
              ${this.t("blockSelectedContent")} ${this.selectedItemsCount}
            </md-menu-item>
            <md-menu-item
              ?hidden="${!this.userId}"
              @click="${this._anonymizeSelected.bind(this)}"
            >
              ${this.t("anonymizeSelectedContent")} ${this.selectedItemsCount}
            </md-menu-item>
            <md-menu-item @click="${this._deleteSelected.bind(this)}">
              ${this.t("deleteSelectedContent")} ${this.selectedItemsCount}
            </md-menu-item>
          </md-menu>
        </div>
      `,
      root
    );
  }

  renderAction(root: HTMLElement, column: any, rowData: RowData) {
    const item = rowData.item;
    return render(
      html`
        <div style="position: relative;">
          <md-icon-button
            .ariaLabel="${this.t("openOneItemMenu")}"
            id="item-${item.id}-anchor"
            data-args="${item.id}"
            @click="${this._setSelected.bind(this)}"
          ><md-icon>more_vert</md-icon></md-icon-button>
          <md-menu
            id="itemMenu${item.id}"
            class="helpButton"
            positioning="popover"
            .menuCorner="${Corner.START_END}"
            anchor="item-${item.id}-anchor"
            @opened="${this._refreshGridAsyncDelay.bind(this)}"
          >
            <md-menu-item
              data-args="${item.id}"
              data-model-class="${item.type}"
              ?hidden="${this.userId != undefined}"
              @click="${this._approve.bind(this)}"
            >
              ${this.t("approveContent")}
            </md-menu-item>
            <md-menu-item
              data-args="${item.id}"
              data-model-class="${item.type}"
              ?hidden="${!this.onlyFlaggedItems}"
              @click="${this._clearFlags.bind(this)}"
            >
              ${this.t("clearFlags")}
            </md-menu-item>
            <md-menu-item
              data-args="${item.id}"
              data-model-class="${item.type}"
              ?hidden="${this.userId != undefined}"
              @click="${this._block.bind(this)}"
            >
              ${this.t("blockContent")}
            </md-menu-item>
            <md-menu-item
              data-args="${item.id}"
              data-model-class="${item.type}"
              ?hidden="${!this.userId}"
              @click="${this._anonymize.bind(this)}"
            >
              ${this.t("anonymizeContent")}
            </md-menu-item>
            <md-menu-item
              data-args="${item.id}"
              data-model-class="${item.type}"
              @click="${this._delete.bind(this)}"
            >
              ${this.t("deleteContent")}
            </md-menu-item>
          </md-menu>
        </div>
      `,
      root
    );
  }

  override render() {
    return html`
      <div class="layout horizontal headerBox wrap">
        <div>
          <md-icon-button
            .ariaLabel="${this.t("close")}"
            id="dismissBtn"
            icon="close"
            class="closeButton"
            dialogDismiss
          ></md-icon-button>
        </div>

        <div class="headerText layout vertical">
          <div class="layout horizontal">
            <div class="collectionName">${this.collectionName}</div>
          </div>
          <div class="innerHeader">
            ${this.headerText}
            <span ?hidden="${!this.totalItemsCount}"
              >(${this.totalItemsCount} ${this.itemsCountText})</span
            >
          </div>
        </div>
        <div ?hidden="${!this.spinnerActive}">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>
        <div class="flex"></div>
        <div class="checkBox" ?hidden="${!this.wide}">
          <md-checkbox ?checked="${this.multiSortEnabled}"
            >${this.t("multiSortEnabled")}</md-checkbox
          >
        </div>
        <div ?hidden="${!this.showReload}">
          <md-icon-button
            .ariaLabel="${this.t("reload")}"
            icon="autorenew"
            class="closeButton"
            @click="${this._reload.bind(this)}"
            ><md-icon>autorenew</md-icon></md-icon-button
          >
        </div>
      </div>

      <vaadin-grid
        id="grid"
        theme="row-dividers"
        column-reordering-allowed
        multi-sort="${this.multiSortEnabled}"
        .activeItem="${this.activeItem}"
        .ariaLabel="${this.headerText}"
        @active-item-changed="${this._onActiveItemChanged.bind(this)}"
        .rowDetailsRenderer="${this.renderItemDetail.bind(this)}"
        .items="${this.items}"
        .selectedItems="${this.selectedItems as Array<unknown>}"
      >
        <vaadin-grid-selection-column> </vaadin-grid-selection-column>

        <vaadin-grid-sort-column
          width="90px"
          flexGrow="0"
          path="firstReportedDateFormatted"
          .header="${this.t("firstReported")}"
          ?hidden="${this.onlyFlaggedItems}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="90px"
          flexGrow="0"
          path="lastReportedAtDateFormatted"
          .header="${this.t("lastReported")}"
          ?hidden="${this.userId != undefined}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="70px"
          textAlign="start"
          flexGrow="0"
          path="type"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: YpModerationItem }
          ) => {
            root.textContent = this._getType(rowData.item.type);
          }}"
          .header="${this.t("type")}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="80px"
          textAlign="start"
          flexGrow="0"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: YpModerationItem }
          ) => {
            root.textContent = rowData.item.status || "unknown";
          }}"
          path="status"
          header="Status"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="55px"
          textAlign="center"
          flexGrow="0"
          path="counter_flags"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: YpModerationItem }
          ) => {
            root.textContent = `${rowData.item.counter_flags}`;
          }}"
          .header="${this.t("flags")}"
          ?hidden="${this.userId != undefined}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="80px"
          textAlign="start"
          flexGrow="0"
          path="source"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: YpModerationItem }
          ) => {
            root.textContent = rowData.item.source || "n/a";
          }}"
          .header="${this.t("source")}"
          ?hidden="${!this.onlyFlaggedItems}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="60px"
          textAlign="center"
          flexGrow="0"
          path="toxicityScoreRaw"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: YpModerationItem }
          ) => {
            root.textContent = `${rowData.item.toxicityScore || "n/a"}`;
          }}"
          .header="${this.t("toxic")}?"
          ?hidden="${this.userId != undefined}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="120px"
          textAlign="start"
          flexGrow="0"
          path="groupName"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: YpModerationItem }
          ) => {
            root.textContent = `${rowData.item.groupName}`;
          }}"
          .header="${this.t("groupName")}"
          ?hidden="${!this.userId}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-filter-column
          width="150px"
          flexGrow="1"
          path="content"
          .renderer="${this.renderContent.bind(this)}"
          .header="${this.t("content")}"
        >
        </vaadin-grid-filter-column>

        <vaadin-grid-filter-column
          flexGrow="0"
          path="user_email"
          width="120px"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: YpModerationItem }
          ) => {
            root.textContent = `${rowData.item.user_email || "n/a"}`;
          }}"
          .header="${this.t("creator")}"
          ?hidden="${this.userId != undefined}"
        >
        </vaadin-grid-filter-column>

        <vaadin-grid-filter-column
          flexGrow="0"
          path="lastReportedByEmail"
          width="120px"
          .header="${this.t("flaggedBy")}"
          ?hidden="${!this.onlyFlaggedItems}"
        >
        </vaadin-grid-filter-column>

        <vaadin-grid-column
          width="48px"
          flexGrow="0"
          .headerRenderer="${this.renderActionHeader.bind(this)}"
          .renderer="${this.renderAction.bind(this)}"
        >
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  /*
    behaviors: [
      ypNumberFormatBehavior
    ],

    observers: [
      '_selectedItemsChanged(selectedItems.splices)'
    ],

  */

  get spinnerActive() {
    return !this.totalItemsCount || this.forceSpinner;
  }

  _ajaxError(error: any | undefined = undefined) {
    this.forceSpinner = false;
    //TODO: Show error
  }

  async _reload() {
    this.forceSpinner = true;
    await this._refreshAfterChange();
    this.forceSpinner = false;
  }

  async _masterRequest(
    action: string,
    itemIdsAndType: Array<SelectedItemIdsAndType> | undefined = undefined
  ) {
    let url, collectionId;
    if (this.modelType === "groups" && this.groupId) {
      collectionId = this.groupId;
    } else if (this.modelType === "communities" && this.communityId) {
      collectionId = this.communityId;
    } else if (this.modelType === "domains" && this.domainId) {
      collectionId = this.domainId;
    } else if (this.modelType === "users" && this.userId) {
      collectionId = this.userId;
    } else {
      console.error("Can't find model type or ids");
      return;
    }

    try {
      this.forceSpinner = true;
      if (itemIdsAndType && itemIdsAndType.length > 0) {
        url = `/api/${this.modelType}/${collectionId}/${action}/process_many_moderation_item`;
        await window.adminServerApi.adminMethod(
          url,
          "DELETE",
          { items: itemIdsAndType }
        );
        this._manyItemsResponse();
      } else if (this.selectedItemId && this.selectedModelClass) {
        url = `/api/${this.modelType}/${collectionId}/${this.selectedItemId}/${this.selectedModelClass}/${action}/process_one_moderation_item`;
        await window.adminServerApi.adminMethod(url, "DELETE");
        this._singleItemResponse();
      } else {
        console.error("No item ids to process");
        this.forceSpinner = false;
        return;
      }
      this._resetSelectedAndClearCache();
    } catch (error) {
      this._ajaxError(error);
    }
  }

  async _generateRequest(id: number) {
    try {
      const response = await window.adminServerApi.adminMethod(
        `/api/${this.modelType}/${id}/${this.typeOfModeration}`,
        "GET"
      );
      this.items = response;
    } catch (error) {
      this._ajaxError(error);
    }
  }

  _itemsResponse(items: Array<YpModerationItem>) {
    this.forceSpinner = false;
    this.items = items;
    this._resetSelectedAndClearCache();
  }

  get onlyFlaggedItems() {
    return this.typeOfModeration === "flagged_content";
  }

  _manyItemsResponse() {
    this.forceSpinner = false;
    this.showReload = true;
    window.appGlobals.notifyUserViaToast(
      this.t("operationInProgressTryReloading")
    );
  }

  _singleItemResponse() {
    this._reload();
  }

  _menuSelection() {
    const allMenus = this.renderRoot.querySelectorAll("md-menu");
    allMenus.forEach((menu) => {
      // Close all menus
      menu.open = false;
    });
    this._refreshGridAsync();
  }

  async _reallyAnonymize() {
    await this._masterRequest("anonymize");
  }

  async _reallyAnonymizeSelected() {
    await this._masterRequest("anonymize", this.selectedItemIdsAndType);
  }

  async _reallyDelete() {
    await this._masterRequest("delete");
  }

  async _reallyDeleteSelected() {
    await this._masterRequest("delete", this.selectedItemIdsAndType);
  }

  async _approve(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    await this._masterRequest("approve");
  }

  async _approveSelected(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    await this._masterRequest("approve", this.selectedItemIdsAndType);
  }

  async _block(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    await this._masterRequest("block");
  }

  async _blockSelected(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    await this._masterRequest("block", this.selectedItemIdsAndType);
  }

  async _clearFlags(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    await this._masterRequest("clearFlags");
  }

  async _clearSelectedFlags(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    await this._masterRequest("clearFlags", this.selectedItemIdsAndType);
  }

  async _refreshAfterChange() {
    if (this.domainId) {
      this._reset();
      this.modelType = "domains";
      await this._generateRequest(this.domainId);
    }
    if (this.groupId) {
      this._reset();
      this.modelType = "groups";
      await this._generateRequest(this.groupId);
    }
    if (this.communityId) {
      this._reset();
      this.modelType = "communities";
      await this._generateRequest(this.communityId);
    }
    if (this.userId) {
      this._reset();
      this.modelType = "users";
      await this._generateRequest(this.userId);
    }

    this._setupHeaderText();
  }

  _domainIdChanged() {}

  _groupIdChanged() {}

  _communityIdChanged() {}

  _userIdChanged() {}

  _getType(type: string) {
    if (type === "post") return this.t("posts.posts");
    else if (type === "point") return this.t("point.point");
    else return this.t("unknown");
  }

  _activeItemChanged(
    item: YpDatabaseItem | undefined,
    oldItem: YpDatabaseItem | undefined
  ) {
    if (item) {
      (this.$$("#grid") as GridElement).openItemDetails(item);
    }

    if (oldItem) {
      (this.$$("#grid") as GridElement).closeItemDetails(oldItem);
    }

    this._refreshGridAsync();
  }

  _refreshGridAsync() {
    this._refreshGridAsyncBase(10);
  }

  _refreshGridAsyncDelay() {
    if (this.allowGridEventsAfterMenuOpen) {
      this._refreshGridAsyncBase(250);
    }
  }

  _refreshGridAsyncBase(ms: number) {
    setTimeout(() => {
      //      (this.$$('#grid') as GridElement).fire('iron-resize');
      (this.$$("#grid") as GridElement).notifyResize();
    }, ms);
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this._resizeThrottler.bind(this), false);
  }

  protected override firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this._setGridSize();
  }

  _toPercent(number: number | undefined) {
    if (number) {
      return Math.round(number * 100) + "%";
    } else {
      return null;
    }
  }

  _resizeThrottler() {
    if (!this.resizeTimeout) {
      this.resizeTimeout = setTimeout(() => {
        this.resizeTimeout = null;
        this._setGridSize();
      }, 66);
    }
  }

  _setGridSize() {
    const grid = this.$$("#grid") as HTMLElement;
    if (!grid) return;

    // Account for sidebar drawer (300px) and rightPanel margin (32px) + padding
    const sidebarWidth = this.wide ? 332 : 0;
    const availableWidth = window.innerWidth - sidebarWidth - 48;

    grid.style.width = Math.max(availableWidth, 400).toFixed() + "px";
    grid.style.height = (window.innerHeight - 150).toFixed() + "px";
  }

  get totalItemsCount() {
    if (this.items) {
      return YpFormattingHelpers.number(this.items.length);
    } else {
      return null;
    }
  }

  _selectedItemsChanged() {
    if (this.selectedItems && this.selectedItems.length > 0) {
      this.selectedItemsEmpty = false;
      this.selectedItemsCount = this.selectedItems.length;
    } else {
      this.selectedItemsEmpty = true;
      this.selectedItemsCount = 0;
    }
    this.selectedItemIdsAndType = this.selectedItems!.map((item) => {
      return { id: item.id, modelType: item.type } as SelectedItemIdsAndType;
    });
    this._refreshGridAsyncDelay();
  }

  _setupItemIdFromEvent(event: CustomEvent) {
    const target = event.target as HTMLElement;
    if (target != null) {
      let itemId = target.parentElement!.getAttribute("data-args") as string;
      if (!itemId) itemId = target.getAttribute("data-args") as string;
      if (itemId) this.selectedItemId = parseInt(itemId);
      let modelClass = target.parentElement!.getAttribute("data-model-class");
      if (!modelClass) modelClass = target.getAttribute("data-model-class");
      this.selectedModelClass = modelClass;
      this._refreshGridAsync();
    }
  }

  _deleteSelected(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureDeleteSelectedContent"),
          this._reallyDeleteSelected.bind(this),
          true,
          true
        );
      }
    );
  }

  _delete(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureDeleteContent"),
          this._reallyDelete.bind(this),
          true,
          false
        );
      }
    );
  }

  _anonymizeSelected(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureAnonymizeSelectedContent"),
          this._reallyAnonymizeSelected.bind(this),
          true,
          true
        );
      }
    );
  }

  _anonymize(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureAnonymizeContent"),
          this._reallyAnonymize.bind(this),
          true,
          false
        );
      }
    );
  }

  _openSelectedMenu(_event: CustomEvent) {
    (this.$$("#selectedItemsMenu") as MdMenu).open = true;
  }

  _menuOpened() {
    this.allowGridEventsAfterMenuOpen = true;
  }

  _setSelected(event: CustomEvent) {
    const itemFromEvent = (event.target as HTMLInputElement).getAttribute(
      "data-args"
    );
    if (itemFromEvent) {
      const item = this._findItemFromId(parseInt(itemFromEvent));
      if (item) {
        (this.$$("#grid") as GridElement).selectItem(item);
      }
      this.allowGridEventsAfterMenuOpen = true;
      setTimeout(() => {
        (this.$$(`#itemMenu${itemFromEvent}`) as MdMenu).open = true;
      });
      this._refreshGridAsync();
    }
  }

  _findItemFromId(id: number) {
    let foundItem;
    if (this.items) {
      this.items.forEach((item) => {
        if (item.id == id) {
          foundItem = item;
        }
      });
    } else {
      console.warn("No item for _findItemFromId");
    }
    return foundItem;
  }

  setup(
    groupId: number | undefined,
    communityId: number | undefined,
    domainId: number | undefined,
    typeOfModeration: "flagged_content" | "moderate_all_content" | undefined,
    userId: number | undefined
  ) {
    if (typeOfModeration) {
      this.typeOfModeration = typeOfModeration;
    } else {
      this.typeOfModeration = "flagged_content";
    }

    this.groupId = undefined;
    this.communityId = undefined;
    this.domainId = undefined;
    this.userId = undefined;
    this.items = undefined;

    if (groupId) this.groupId = groupId;

    if (communityId) this.communityId = communityId;

    if (domainId) this.domainId = domainId;

    if (userId) this.userId = userId;

    this._setupHeaderText();
  }

  open(name: string) {
    this.collectionName = name;
  }

  _reset() {
    this.items = undefined;
    this._resetSelectedAndClearCache();
  }

  _resetSelectedAndClearCache() {
    this.selectedItemsCount = 0;
    this.selectedItemsEmpty = true;
    this.selectedItemIdsAndType = [];
    this.selectedItems = [];
    (this.$$("#grid") as GridElement).clearCache();
  }

  _setupHeaderText() {
    if (this.onlyFlaggedItems) {
      this.itemsCountText = this.t("contentItemsFlagged");
    } else {
      this.itemsCountText = this.t("items");
    }
    if (this.groupId) {
      this.headerText = this.t("groupContentModeration");
    } else if (this.communityId) {
      this.headerText = this.t("communityContentModeration");
    } else if (this.domainId) {
      this.headerText = this.t("domainContentModeration");
    } else if (this.userId) {
      this.headerText = this.t("userContentModeration");
    }
  }
}
