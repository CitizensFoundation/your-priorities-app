import { LitElement, css, property, html, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import { YpBaseElement } from '../@yrpri/common/yp-base-element';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers';
import { YpConfirmationDialog } from '../@yrpri/yp-dialog-container/yp-confirmation-dialog';
import '../@yrpri/yp-magic-text/yp-magic-text.js';
import '../@yrpri/yp-point/yp-point.js';
import '../@yrpri/yp-post/yp-post.js';

import '@vaadin/vaadin-grid/vaadin-grid.js';
import type { GridElement } from '@vaadin/vaadin-grid/vaadin-grid.js';

import '@polymer/iron-ajax';
import { IronAjaxElement } from '@polymer/iron-ajax';

import '@polymer/paper-listbox';
import { PaperListboxElement } from '@polymer/paper-listbox';

interface RowData {
  item: YpModerationItem;
}

@customElement('yp-content-moderation')
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
  items: Array<YpDatabaseItem> | undefined;

  @property({ type: Array })
  selectedItems: Array<YpDatabaseItem> | undefined;

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
  selectedItemIdsAndType: Array<Record<number, string>> | undefined;

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
  typeOfModeration = '/flagged_content';

  @property({ type: Object })
  activeItem: YpDatabaseItem | undefined;

  allowGridEventsAfterMenuOpen = false;

  static get propertsies() {
    return {
      groupId: {
        type: Number,
        observer: '_groupIdChanged',
      },

      domainId: {
        type: Number,
        observer: '_domainIdChanged',
      },

      communityId: {
        type: Number,
        observer: '_communityIdChanged',
      },

      userId: {
        type: Number,
        observer: '_userIdChanged',
      },

      activeItem: {
        type: Object,
        observer: '_activeItemChanged',
      },
    };
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('groupId')) {
      this._groupIdChanged();
    }
    if (changedProperties.has('communityId')) {
      this._communityIdChanged();
    }
    if (changedProperties.has('domainId')) {
      this._domainIdChanged();
    }
    if (changedProperties.has('userId')) {
      this._userIdChanged();
    }
    if (changedProperties.has('activeItem')) {
      this._activeItemChanged(
        this.activeItem,
        changedProperties.get('activeItem') as YpDatabaseItem | undefined
      );
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100%;
          height: 100%;
          margin: 0;
          top: unset !important;
          left: unset !important;
          background-color: #fff;
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

        paper-listbox {
          margin-right: 8px !important;
        }

        .headerBox {
          background-color: var(--accent-color);
          color: #fff;
          margin: 0;
          padding: 0 0;
          padding-top: 12px;
          padding-bottom: 10px;
        }

        mwc-button {
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
          color: #f5f5f5;
        }

        .closeButton {
          width: 50px;
          height: 50px;
          margin-left: 4px;
          margin-right: 4px;
        }

        paper-checkbox {
          color: #fff !important;
          margin-top: 16px;
          margin-right: 24px;
          --primary-color: #fff;
          --primary-text-color: #fff;
          --paper-checkbox-checked-ink-color: #fff;
          --paper-checkbox-unchecked-ink-color: #fff;
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
        }

        yp-point {
          min-height: 100px;
          max-width: 500px;
          margin-bottom: 8px;
        }

        yp-post-header {
          margin-bottom: 8px;
        }

        mwc-button {
          font-size: 18px;
          margin-top: 16px;
        }

        .analysis {
          margin-top: 12px;
          color: #656565;
        }

        .leftColumn {
          padding-right: 16px;
        }

        .mainScore {
          color: #000;
        }

        paper-spinner {
          margin-left: 20px;
          margin-top: 8px;
          --paper-spinner-layer-1-color: #fff;
          --paper-spinner-layer-2-color: #fff;
          --paper-spinner-layer-3-color: #fff;
          --paper-spinner-layer-4-color: #fff;
        }

        .linkIcon {
          color: #000;
        }

        vaadin-grid {
          font-size: 14px;
        }
      `,
    ];
  }

  renderContent(root: HTMLElement, column: any, rowData: RowData) {
    const item = rowData.item;
    return html`
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
    `;
  }

  renderItemDetail(root: HTMLElement, column: any, rowData: RowData) {
    const item = rowData.item;
    return html`
      <div class="details layout vertical center-center detailArea">
        <div class="layout horizontal">
          ${item.is_post
            ? html`
                <div class="layout vertical center-center">
                  <yp-post-header
                    hideActions
                    .post="${(item as unknown) as YpPostData}"
                    .postName="${item.name}"
                    headerMode
                  ></yp-post-header>
                  <a href="/post/${item.id}" target="_blank"
                    ><paper-icon-button
                      .ariaLabel="${this.t('linkToContentItem')}"
                      class="linkIcon"
                      icon="link"
                    ></paper-icon-button
                  ></a>
                </div>
              `
            : nothing}
          ${item.is_point
            ? html`
                <div class="layout vertical center-center">
                  <yp-point
                    hideActions
                    .point="${(item as unknown) as YpPointData}"
                  ></yp-point>
                  <a
                    ?hidden="${!item.post_id}"
                    href="/post/[[item.post_id]]/${item.id}"
                    target="_blank"
                    ><paper-icon-button
                      .ariaLabel="${this.t('linkToContentItem')}"
                      class="linkIcon"
                      icon="link"
                    ></paper-icon-button
                  ></a>
                </div>
              `
            : nothing}
        </div>

        ${item.moderation_data
          ? html`
              <div class="layout horizontal analysis">
                <div
                  class="layout vertical leftColumn"
                  ?hidden="${this.userId != undefined}"
                >
                  <div
                    class="mainScore"
                    ?hidden="${!item.moderation_data.moderation.toxicityScore}"
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
                    ?hidden="${!item.moderation_data.moderation.profanityScore}"
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
    `;
  }

  renderActionHeader(root: HTMLElement, column: any, rowData: RowData) {
    const item = rowData.item;
    return html`
      <paper-menu-button
        horizontalAlign="right"
        @opened-changed="${this._refreshGridAsyncDelay}"
        class="helpButton"
        ?disabled="${this.selectedItemsEmpty}"
      >
        <paper-icon-button
          .ariaLabel="${this.t('openSelectedItemsMenu')}"
          icon="more-vert"
          slot="dropdown-trigger"
          @click="${this._menuOpened}"
        ></paper-icon-button>
        <paper-listbox
          slot="dropdown-content"
          @iron-select="${this._menuSelection}"
        >
          ${!this.selectedItemsEmpty
            ? html`
                <paper-item
                  data-args="${item.id}"
                  ?hidden="${this.userId != undefined}"
                  @tap="${this._approveSelected}"
                >
                  ${this.t('approveSelectedContent')} ${this.selectedItemsCount}
                </paper-item>
                <paper-item
                  data-args="${item.id}"
                  ?hidden="${!this.onlyFlaggedItems}"
                  @tap="${this._clearSelectedFlags}"
                >
                  ${this.t('clearSelectedFlags')} ${this.selectedItemsCount}
                </paper-item>
                <paper-item
                  data-args="${item.id}"
                  ?hidden="${this.userId != undefined}"
                  @tap="${this._blockSelected}"
                >
                  ${this.t('blockSelectedContent')} ${this.selectedItemsCount}
                </paper-item>
                <paper-item
                  data-args="${item.id}"
                  ?hidden="${!this.userId}"
                  @tap="${this._anonymizeSelected}"
                >
                  ${this.t('anonymizeSelectedContent')}
                  ${this.selectedItemsCount}
                </paper-item>
                <paper-item
                  data-args="${item.id}"
                  @tap="${this._deleteSelected}"
                >
                  ${this.t('deleteSelectedContent')} ${this.selectedItemsCount}
                </paper-item>
              `
            : html``}
        </paper-listbox>
      </paper-menu-button>
    `;
  }

  renderAction(root: HTMLElement, column: any, rowData: RowData) {
    const item = rowData.item;
    return html`
      <paper-menu-button
        horizontal-align="right"
        class="helpButton"
        @opened-changed="${this._refreshGridAsyncDelay}"
      >
        <paper-icon-button
          .ariaLabel="${this.t('openOneItemMenu')}"
          icon="more-vert"
          data-args="${item.id}"
          @tap="${this._setSelected}"
          slot="dropdown-trigger"
        ></paper-icon-button>
        <paper-listbox
          slot="dropdown-content"
          @iron-select="${this._menuSelection}"
        >
          <paper-item
            data-args="${item.id}"
            data-model-class="${item.type}"
            ?hidden="${this.userId != undefined}"
            @tap="${this._approve}"
          >
            ${this.t('approveContent')}
          </paper-item>
          <paper-item
            data-args="${item.id}"
            data-model-class="${item.type}"
            ?hidden="${!this.onlyFlaggedItems}"
            @tap="${this._clearFlags}"
          >
            ${this.t('clearFlags')}
          </paper-item>
          <paper-item
            data-args="${item.id}"
            data-model-class="${item.type}"
            ?hidden="${this.userId != undefined}"
            @tap="${this._block}"
          >
            ${this.t('blockContent')}
          </paper-item>
          <paper-item
            data-args="${item.id}"
            data-model-class="${item.type}"
            ?hidden="${!this.userId}"
            @tap="${this._anonymize}"
          >
            ${this.t('anonymizeContent')}
          </paper-item>
          <paper-item
            data-args="${item.id}"
            data-model-class="${item.type}"
            @tap="${this._delete}"
          >
            ${this.t('deleteContent')}
          </paper-item>
        </paper-listbox>
      </paper-menu-button>
    `;
  }

  render() {
    return html`
      <div class="layout horizontal headerBox wrap">
        <div>
          <paper-icon-button
            .ariaLabel="${this.t('close')}"
            id="dismissBtn"
            icon="close"
            class="closeButton"
            dialogDismiss
          ></paper-icon-button>
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
          <paper-spinner active></paper-spinner>
        </div>
        <div class="flex"></div>
        <div class="checkBox" ?hidden="${!this.wide}">
          <paper-checkbox ?checked="${this.multiSortEnabled}"
            >${this.t('multiSortEnabled')}</paper-checkbox
          >
        </div>
        <div ?hidden="${!this.showReload}">
          <paper-icon-button
            .ariaLabel="${this.t('reload')}"
            icon="autorenew"
            class="closeButton"
            @click="${this._reload}"
          ></paper-icon-button>
        </div>
      </div>

      <vaadin-grid
        id="grid"
        .multiSort="${this.multiSortEnabled}"
        .activeItem="${this.activeItem}"
        .ariaLabel="${this.headerText}"
        .rowDetailsRenderer="${this.renderItemDetail}"
        .items="${this.items}"
        .selectedItems="${this.selectedItems}"
      >
        <vaadin-grid-selection-column> </vaadin-grid-selection-column>

        <vaadin-grid-sort-column
          width="130px"
          flexGrow="0"
          path="firstReportedDateFormatted"
          .header="${this.t('firstReported')}"
          ?hidden="${this.onlyFlaggedItems}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="130px"
          flexGrow="0"
          path="lastReportedAtDateFormatted"
          .header="${this.t('lastReported')}"
          ?hidden="${this.userId != undefined}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="100px"
          textAlign="start"
          flexGrow="0"
          path="type"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return this._getType(rowData.item.type);
          }}"
          .header="${this.t('type')}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="100px"
          textAlign="start"
          flexGrow="0"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return rowData.item.status;
          }}"
          path="status"
          .header="${this.t('publishStatus')}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="100px"
          textAlign="center"
          flexGrow="0"
          path="counter_flags"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return rowData.item.counter_flags;
          }}"
          .header="${this.t('flags')}"
          ?hidden="${this.userId != undefined}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="130px"
          textAlign="start"
          flexGrow="0"
          path="source"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return rowData.item.source;
          }}"
          .header="${this.t('source')}"
          ?hidden="${!this.onlyFlaggedItems}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="105px"
          textAlign="center"
          flexGrow="0"
          path="toxicityScoreRaw"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return rowData.item.toxicityScore;
          }}"
          .header="${this.t('toxicityScore')}?"
          ?hidden="${this.userId != undefined}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="150px"
          textAlign="start"
          flexGrow="1"
          path="groupName"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return rowData.item.groupName;
          }}"
          .header="${this.t('groupName')}"
          ?hidden="${!this.userId}"
        >
        </vaadin-grid-sort-column>

        <vaadin-grid-filter-column
          width="200px"
          flexGrow="4"
          path="content"
          .renderer="${this.renderContent}"
          .header="${this.t('content')}"
          ?hidden="${!this.wide}"
        >
        </vaadin-grid-filter-column>

        <vaadin-grid-filter-column
          flexGrow="1"
          path="user_email"
          width="150px"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return rowData.item.user_email;
          }}"
          .header="${this.t('creator')}"
          ?hidden="${this.userId != undefined}"
        >
        </vaadin-grid-filter-column>

        <vaadin-grid-filter-column
          flexGrow="0"
          path="lastReportedByEmail"
          width="150px"
          .header="${this.t('flaggedBy')}"
          ?hidden="${!this.onlyFlaggedItems}"
        >
        </vaadin-grid-filter-column>

        <vaadin-grid-column
          width="70px"
          flexGrow="0"
          .headerRenderer="${this.renderActionHeader}"
          .renderer="${this.renderAction}"
        >
        </vaadin-grid-column>
      </vaadin-grid>

      <div class="layout horizontal center-center">
        <iron-ajax
          id="ajax"
          @response="${this._itemsResponse}"
          @error="${this._ajaxError}"
        ></iron-ajax>
        <iron-ajax
          method="DELETE"
          id="singleItemAjax"
          @error="${this._ajaxError}"
          @response="${this._singleItemResponse}"
        ></iron-ajax>
        <iron-ajax
          method="DELETE"
          id="manyItemsAjax"
          @error="${this._ajaxError}"
          @response="${this._manyItemsResponse}"
        ></iron-ajax>
      </div>
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

  _ajaxError() {
    this.forceSpinner = false;
  }

  _reload() {
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
    this.forceSpinner = true;
  }

  get onlyFlaggedItems() {
    return this.typeOfModeration === '/flagged_content';
  }

  _manyItemsResponse() {
    this.forceSpinner = false;
    this.showReload = true;
    window.appGlobals.notifyUserViaToast(
      this.t('operationInProgressTryReloading')
    );
  }

  _singleItemResponse() {
    this._reload();
  }

  _getType(type: string) {
    if (type === 'post') return this.t('posts.post');
    else if (type === 'point') return this.t('point.point');
  }

  _activeItemChanged(
    item: YpDatabaseItem | undefined,
    oldItem: YpDatabaseItem | undefined
  ) {
    if (item) {
      (this.$$('#grid') as GridElement).openItemDetails(item);
    }

    if (oldItem) {
      (this.$$('#grid') as GridElement).closeItemDetails(oldItem);
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
      (this.$$('#grid') as GridElement).fire('iron-resize');
      (this.$$('#grid') as GridElement).notifyResize();
    }, ms);
  }

  _menuSelection() {
    const allMenus = ((this.$$('#grid') as GridElement).querySelectorAll(
      'paper-listbox'
    ) as unknown) as Array<PaperListboxElement>;
    allMenus.forEach(item => {
      item.select('');
    });
    this._refreshGridAsync();
  }

  connectedCallback() {
    super.connectedCallback();
    this._setGridSize();
    window.addEventListener('resize', this._resizeThrottler.bind(this), false);
  }

  _toPercent(number: number | undefined) {
    if (number) {
      return Math.round(number * 100) + '%';
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
    if (window.innerWidth <= 600) {
      (this.$$('#grid') as HTMLElement).style.width =
        window.innerWidth.toFixed() + 'px';
      (this.$$('#grid') as HTMLElement).style.height =
        window.innerHeight.toFixed() + 'px';
    } else {
      (this.$$('#grid') as HTMLElement).style.width =
        (window.innerWidth - 16).toFixed() + 'px';
      (this.$$('#grid') as HTMLElement).style.height =
        window.innerHeight.toFixed() + 'px';
    }
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
    this.selectedItemIdsAndType = this.selectedItems!.map(item => {
      return { id: item.id, modelType: item.type };
    });
    this._refreshGridAsyncDelay();
  }

  _setupItemIdFromEvent(event: CustomEvent) {
    const target = event.target as HTMLElement;
    if (target != null) {
      let itemId = target.parentElement!.getAttribute('data-args') as string;
      if (!itemId) itemId = target.getAttribute('data-args') as string;
      if (itemId) this.selectedItemId = parseInt(itemId);
      let modelClass = target.parentElement!.getAttribute('data-model-class');
      if (!modelClass) modelClass = target.getAttribute('data-model-class');
      this.selectedModelClass = modelClass;
      this._refreshGridAsync();
    }
  }

  _deleteSelected(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('areYouSureDeleteSelectedContent'),
          this._reallyDeleteSelected.bind(this),
          true,
          true
        );
      }
    );
  }

  _reallyDeleteSelected() {
    this._masterRequest(
      this.$$('#manyItemsAjax') as IronAjaxElement,
      'delete',
      this.selectedItemIdsAndType
    );
  }

  _delete(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('areYouSureDeleteContent'),
          this._reallyDelete.bind(this),
          true,
          false
        );
      }
    );
  }

  _reallyDelete() {
    this._masterRequest(
      this.$$('#singleItemAjax') as IronAjaxElement,
      'delete'
    );
  }

  _anonymizeSelected(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('areYouSureAnonymizeSelectedContent'),
          this._reallyAnonymizeSelected.bind(this),
          true,
          true
        );
      }
    );
  }

  _reallyAnonymizeSelected() {
    this._masterRequest(
      this.$$('#manyItemsAjax') as IronAjaxElement,
      'anonymize',
      this.selectedItemIdsAndType
    );
  }

  _anonymize(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('areYouSureAnonymizeContent'),
          this._reallyAnonymize.bind(this),
          true,
          false
        );
      }
    );
  }

  _reallyAnonymize() {
    this._masterRequest(
      this.$$('#singleItemAjax') as IronAjaxElement,
      'anonymize'
    );
  }

  _approve(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    this._masterRequest(
      this.$$('#singleItemAjax') as IronAjaxElement,
      'approve'
    );
  }

  _approveSelected(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    this._masterRequest(
      this.$$('#manyItemsAjax') as IronAjaxElement,
      'approve',
      this.selectedItemIdsAndType
    );
  }

  _block(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    this._masterRequest(this.$$('#singleItemAjax') as IronAjaxElement, 'block');
  }

  _blockSelected(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    this._masterRequest(
      this.$$('#manyItemsAjax') as IronAjaxElement,
      'block',
      this.selectedItemIdsAndType
    );
  }

  _clearFlags(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    this._masterRequest(
      this.$$('#singleItemAjax') as IronAjaxElement,
      'clearFlags'
    );
  }

  _clearSelectedFlags(event: CustomEvent) {
    this._setupItemIdFromEvent(event);
    this._masterRequest(
      this.$$('#manyItemsAjax') as IronAjaxElement,
      'clearFlags',
      this.selectedItemIdsAndType
    );
  }

  _masterRequest(
    ajax: IronAjaxElement,
    action: string,
    itemIdsAndType: Array<Record<number, string>> | undefined = undefined
  ) {
    let url, collectionId;
    if (this.modelType === 'groups' && this.groupId) {
      collectionId = this.groupId;
    } else if (this.modelType === 'communities' && this.communityId) {
      collectionId = this.communityId;
    } else if (this.modelType === 'domains' && this.domainId) {
      collectionId = this.domainId;
    } else if (this.modelType === 'users' && this.userId) {
      collectionId = this.userId;
    } else {
      console.error("Can't find model type or ids");
      return;
    }
    if (itemIdsAndType && itemIdsAndType.length > 0) {
      url =
        '/api/' +
        this.modelType +
        '/' +
        collectionId +
        '/' +
        action +
        '/process_many_moderation_item';
      ajax.body = { items: itemIdsAndType };
    } else if (this.selectedItemId) {
      url =
        '/api/' +
        this.modelType +
        '/' +
        collectionId +
        '/' +
        this.selectedItemId +
        '/' +
        this.selectedModelClass +
        '/' +
        action +
        '/process_one_moderation_item';
      ajax.body = {};
    } else {
      console.error('No item ids to process');
      return;
    }
    ajax.url = url;
    ajax.generateRequest();
    this.forceSpinner = true;

    if (this.selectedItemId) {
      const item = this._findItemFromId(this.selectedItemId);
      if (item) (this.$$('#grid') as GridElement).deselectItem(item);
      this.selectedItemId = undefined;
      this.selectedModelClass = undefined;
    }
  }

  _menuOpened() {
    this.allowGridEventsAfterMenuOpen = true;
  }

  _setSelected(event: CustomEvent) {
    const itemFromEvent = (event.target as HTMLInputElement).getAttribute(
      'data-args'
    );
    if (itemFromEvent) {
      const item = this._findItemFromId(parseInt(itemFromEvent));
      if (item) {
        (this.$$('#grid') as GridElement).selectItem(item);
      }
      this.allowGridEventsAfterMenuOpen = true;
      this._refreshGridAsync();
    }
  }

  _findItemFromId(id: number) {
    let foundItem;
    if (this.items) {
      this.items.forEach(item => {
        if (item.id == id) {
          foundItem = item;
        }
      });
    } else {
      console.warn('No item for _findItemFromId');
    }
    return foundItem;
  }

  _domainIdChanged() {
    if (this.domainId) {
      this._reset();
      this.modelType = 'domains';
      this._generateRequest(this.domainId);
    }
  }

  _groupIdChanged() {
    if (this.groupId) {
      this._reset();
      this.modelType = 'groups';
      this._generateRequest(this.groupId);
    }
  }

  _communityIdChanged() {
    if (this.communityId) {
      this._reset();
      this.modelType = 'communities';
      this._generateRequest(this.communityId);
    }
  }

  _userIdChanged() {
    if (this.userId) {
      this._reset();
      this.modelType = 'users';
      this._generateRequest(this.userId);
    }
  }

  _generateRequest(id: number) {
    (this.$$('#ajax') as IronAjaxElement).url =
      '/api/' + this.modelType + '/' + id + this.typeOfModeration;
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
  }

  _itemsResponse(event: CustomEvent) {
    this.forceSpinner = false;
    this.items = event.detail.response;
    this._resetSelectedAndClearCache();
  }

  setup(
    groupId: number | undefined,
    communityId: number | undefined,
    domainId: number | undefined,
    typeOfModeration: string | undefined,
    userId: number | undefined
  ) {
    if (typeOfModeration) {
      this.typeOfModeration = typeOfModeration;
    } else {
      this.typeOfModeration = '/flagged_content';
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
    (this.$$('#grid') as GridElement).clearCache();
  }

  _setupHeaderText() {
    if (this.onlyFlaggedItems) {
      this.itemsCountText = this.t('contentItemsFlagged');
    } else {
      this.itemsCountText = this.t('items');
    }
    if (this.groupId) {
      this.headerText = this.t('groupContentModeration');
    } else if (this.communityId) {
      this.headerText = this.t('communityContentModeration');
    } else if (this.domainId) {
      this.headerText = this.t('domainContentModeration');
    } else if (this.userId) {
      this.headerText = this.t('userContentModeration');
    }
  }
}
