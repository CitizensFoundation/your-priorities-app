import { PropertyValueMap, css, html, nothing, render } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/secondary-tab.js";

import "@vaadin/vaadin-grid/vaadin-grid.js";
import type {
  GridElement,
  GridItemModel,
} from "@vaadin/vaadin-grid/vaadin-grid.js";
import "@vaadin/grid/vaadin-grid.js";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/grid/vaadin-grid-sort-column.js";

import { MdTabs } from "@material/web/tabs/tabs.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog.js";

interface FraudRowData {
  item: YpFraudManagementItem;
}

@customElement("yp-fraud-management")
export class YpFraudManagement extends YpBaseElement {
  @property({ type: Boolean })
  multiSortEnabled = false;

  @property({ type: Boolean })
  showReload = false;

  @property({ type: Boolean })
  selectedItemsEmpty = true;

  @property({ type: Boolean })
  inProgress = false;

  @property({ type: Boolean })
  indeterminateProgress = false;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Number })
  jobId: number | undefined;

  @property({ type: Number })
  progress = 0;

  @property({ type: Number })
  selectedItemsCount = 0;

  @property({ type: String })
  selectedMethod: YpFraudManagementMethod = "byIpFingerprintPostId";

  @property({ type: String })
  selectedCollectionType: YpFraudManagementCollectionType = "endorsements";

  @property({ type: String })
  collectionName: string | undefined;

  @property({ type: String })
  headerText: string | undefined;

  @property({ type: String })
  itemsCountText: string | undefined;

  @property({ type: String })
  errorMessage: string | undefined;

  @property({ type: Array })
  items: YpFraudManagementItem[] = [];

  @property({ type: Array })
  selectedItems: YpFraudManagementItem[] = [];

  @property({ type: Array })
  selectedItemIds: number[] = [];

  @property({ type: Object })
  activeItem: YpFraudManagementItem | undefined;

  @property({ type: Object })
  resizeTimeout: number | undefined;

  selectedItemId: number | undefined;
  currentType: "get-items" | "delete-one-item" | "delete-items" | undefined;
  pollTimeout: number | undefined;
  private requestToken = 0;
  private activeRequestToken: number | undefined;
  private activeRequestCommunityId: number | undefined;
  private activeRequestJobId: number | undefined;
  private readonly resizeHandler = this._resizeThrottler.bind(this);

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ) {
    super.updated(changedProperties);

    if (changedProperties.has("communityId")) {
      this._cancelCurrentRequest();
      this._setupHeaderText();
      if (this.communityId) {
        this._reload();
      }
    }

    if (changedProperties.has("activeItem")) {
      this._activeItemChanged(
        this.activeItem,
        changedProperties.get("activeItem") as YpFraudManagementItem | undefined
      );
    }
  }

  protected override firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this._setupHeaderText();
    this._setGridSize();
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.resizeHandler, false);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._cancelCurrentRequest();
    window.removeEventListener("resize", this.resizeHandler, false);
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
        }

        .headerBox {
          background-color: var(--md-sys-primary-container);
          color: var(--md-sys-on-primary-container);
          padding: 12px 0 10px;
          gap: 8px;
        }

        .headerText {
          padding: 0;
        }

        .collectionName {
          font-size: 22px;
          margin: 4px 0 1px;
        }

        .innerHeader {
          font-size: 17px;
        }

        .toolbar {
          gap: 12px;
          padding: 12px 16px;
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
          align-items: center;
        }

        .collectionSelect {
          height: 40px;
          min-width: 170px;
          border: 1px solid var(--md-sys-color-outline);
          border-radius: 4px;
          padding: 0 12px;
          color: var(--md-sys-color-on-surface);
          background: var(--md-sys-color-surface);
        }

        md-tabs {
          max-width: 100%;
          background-color: var(--md-sys-color-surface);
        }

        md-linear-progress {
          width: 220px;
        }

        vaadin-grid {
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          font-size: 12px;
          max-width: 100%;
        }

        vaadin-grid::part(header-cell) {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface-variant);
          font-size: 12px;
          font-weight: var(--md-sys-typescale-title-small-font-weight);
        }

        vaadin-grid::part(body-cell) {
          background-color: var(--md-sys-color-surface-container-lowest);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        vaadin-grid::part(row):hover {
          background-color: var(--md-sys-color-surface-container-highest);
        }

        vaadin-grid-cell-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 8px 6px;
        }

        .details {
          padding: 16px;
          gap: 20px;
          max-width: 100%;
          overflow-wrap: anywhere;
        }

        .detailAreas {
          gap: 4px;
          max-width: 460px;
        }

        .keyCell {
          min-height: 24px;
          padding: 4px;
          text-align: center;
          border-radius: 4px;
          color: #000;
          box-sizing: border-box;
        }

        .errorText {
          color: var(--md-sys-color-error);
          padding: 8px 16px;
        }

        @media (max-width: 900px) {
          .toolbar {
            align-items: flex-start;
          }

          .collectionSelect {
            width: 100%;
          }
        }
      `,
    ];
  }

  get totalItemsCount() {
    return this.items ? YpFormattingHelpers.number(this.items.length) : null;
  }

  get availableMethods() {
    const commonMethods: Array<{
      value: YpFraudManagementMethod;
      label: string;
    }> = [
      { value: "byIpFingerprint", label: "IP & FINGERPRINT" },
      { value: "byMissingBrowserFingerprint", label: "NO FINGERPRINT" },
      { value: "byIpAddress", label: "IP ADDRESS" },
    ];

    if (this.selectedCollectionType === "pointQualities") {
      return [
        {
          value: "byIpFingerprintPointId" as const,
          label: "IP & FINGERPRINT & POINT",
        },
        {
          value: "byIpUserAgentPointId" as const,
          label: "IP & USER AGENT & POINT",
        },
        ...commonMethods,
      ];
    } else if (this.selectedCollectionType === "posts") {
      return commonMethods;
    } else {
      return [
        {
          value: "byIpFingerprintPostId" as const,
          label: "IP & FINGERPRINT & POST",
        },
        {
          value: "byIpUserAgentPostId" as const,
          label: "IP & USER AGENT & POST",
        },
        ...commonMethods,
      ];
    }
  }

  get activeMethodIndex() {
    const index = this.availableMethods.findIndex(
      (method) => method.value === this.selectedMethod
    );
    return index > -1 ? index : 0;
  }

  get hidePost() {
    return !(
      this.selectedCollectionType === "endorsements" ||
      this.selectedCollectionType === "ratings" ||
      this.selectedCollectionType === "points"
    );
  }

  get hidePoint() {
    return this.selectedCollectionType !== "pointQualities";
  }

  get hideValue() {
    return ["posts", "points"].includes(this.selectedCollectionType);
  }

  get postsCollectionActive() {
    return this.selectedCollectionType === "posts";
  }

  private _onActiveItemChanged(
    event: CustomEvent<GridItemModel<YpFraudManagementItem>>
  ) {
    //@ts-ignore - Vaadin event detail value is not exposed correctly in this version.
    this.activeItem = event.detail.value;
  }

  private _selectedItemsChanged(event?: CustomEvent) {
    if (event?.detail?.value) {
      this.selectedItems = event.detail.value as YpFraudManagementItem[];
    }

    if (this.selectedItems.length > 0) {
      this.selectedItemsEmpty = false;
      this.selectedItemsCount = this.selectedItems.length;
      this.selectedItemIds = this.selectedItems.map((item) => item.id);
    } else {
      this.selectedItemsEmpty = true;
      this.selectedItemsCount = 0;
      this.selectedItemIds = [];
    }
  }

  renderKey(root: HTMLElement, _column: unknown, rowData: FraudRowData) {
    const item = rowData.item;
    root.innerHTML = "";
    const div = document.createElement("div");
    div.className = "keyCell";
    div.textContent = `${item.key ?? ""}`;
    div.style.backgroundColor = `${item.backgroundColor || "transparent"}`;
    root.appendChild(div);
  }

  renderItemDetail(root: HTMLElement, _column: unknown, rowData: FraudRowData) {
    const item = rowData.item;
    return render(
      html`
        <div class="details layout vertical">
          <div class="layout horizontal wrap">
            <div class="layout vertical detailAreas">
              <div><b>Group:</b> ${item.key ?? ""}</div>
              <div><b>Count:</b> ${item.groupCount ?? ""}</div>
              <div><b>IP Address:</b> ${item.ip_address ?? ""}</div>
              <div><b>Browser Id:</b> ${item.data?.browserId ?? ""}</div>
              <div>
                <b>Fingerprint:</b> ${item.data?.browserFingerprint ?? ""}
              </div>
            </div>
            <div class="layout vertical detailAreas">
              <div><b>User Id:</b> ${item.User?.id ?? ""}</div>
              <div><b>Email:</b> ${item.User?.email ?? ""}</div>
              <div ?hidden="${this.hidePost}">
                <b>Post Id:</b> ${item.Post?.id ?? ""}
              </div>
              <div ?hidden="${this.hidePost}">
                <b>Post Name:</b> ${item.Post?.name ?? ""}
              </div>
              <div ?hidden="${this.hidePoint}">
                <b>Point Id:</b> ${item.Point?.id ?? ""}
              </div>
              <div ?hidden="${this.hidePoint}">
                <b>Post Id:</b> ${item.Point?.Post?.id ?? ""}
              </div>
              <div ?hidden="${this.hidePoint}">
                <b>Post Name:</b> ${item.Point?.Post?.name ?? ""}
              </div>
              <div ?hidden="${!this.postsCollectionActive}">
                <b>Post Name:</b> ${item.name ?? ""}
              </div>
              <div><b>Confidence:</b> ${item.confidenceScore ?? ""}</div>
            </div>
          </div>
          <div class="layout vertical detailAreas">
            <div><b>User Agent:</b> ${item.user_agent ?? ""}</div>
          </div>
        </div>
      `,
      root
    );
  }

  renderSelectedActionHeader(root: HTMLElement) {
    return render(
      html`
        <md-icon-button
          .ariaLabel="${this.t("deleteSelectedContent")}"
          ?disabled="${this.selectedItemsEmpty || this.inProgress}"
          @click="${this._deleteSelected.bind(this)}"
          ><md-icon>delete</md-icon></md-icon-button
        >
      `,
      root
    );
  }

  renderAction(root: HTMLElement, _column: unknown, rowData: FraudRowData) {
    const item = rowData.item;
    return render(
      html`
        <md-icon-button
          .ariaLabel="${this.t("deleteContent")}"
          data-args="${item.id}"
          ?disabled="${this.inProgress}"
          @click="${this._delete.bind(this)}"
          ><md-icon>delete</md-icon></md-icon-button
        >
      `,
      root
    );
  }

  override render() {
    return html`
      <div class="layout horizontal headerBox wrap">
        <div class="headerText layout vertical">
          <div class="layout horizontal">
            <div class="collectionName">${this.collectionName || ""}</div>
          </div>
          <div class="innerHeader">
            ${this.headerText}
            <span ?hidden="${!this.totalItemsCount}"
              >(${this.totalItemsCount} ${this.itemsCountText})</span
            >
          </div>
        </div>
        <div class="flex"></div>
        <div class="layout horizontal center-center" ?hidden="${!this.inProgress}">
          <md-linear-progress
            ?indeterminate="${this.indeterminateProgress}"
            .value="${this.progress / 100}"
          ></md-linear-progress>
        </div>
        <label class="layout horizontal center-center">
          <md-checkbox
            ?checked="${this.multiSortEnabled}"
            @change="${(event: Event) => {
              this.multiSortEnabled = (event.target as HTMLInputElement).checked;
            }}"
          ></md-checkbox>
          ${this.t("multiSortEnabled")}
        </label>
        <md-icon-button
          .ariaLabel="${this.t("reload")}"
          ?disabled="${this.inProgress}"
          @click="${this._reload.bind(this)}"
          ><md-icon>autorenew</md-icon></md-icon-button
        >
      </div>

      <div class="toolbar layout horizontal wrap">
        <select
          class="collectionSelect"
          ?disabled="${this.inProgress}"
          @change="${this._collectionTypeChanged.bind(this)}"
        >
          <option
            value="endorsements"
            ?selected="${this.selectedCollectionType === "endorsements"}"
            >Endorsements</option
          >
          <option
            value="ratings"
            ?selected="${this.selectedCollectionType === "ratings"}"
            >Ratings</option
          >
          <option
            value="pointQualities"
            ?selected="${this.selectedCollectionType === "pointQualities"}"
            >Point qualities</option
          >
          <option
            value="points"
            ?selected="${this.selectedCollectionType === "points"}"
            >Points</option
          >
          <option
            value="posts"
            ?selected="${this.selectedCollectionType === "posts"}"
            >Posts</option
          >
        </select>
        <md-outlined-button
          ?disabled="${this.inProgress}"
          @click="${this._reload.bind(this)}"
          >${this.t("reload")}</md-outlined-button
        >
        ${this.selectedItemsCount > 0
          ? html`
              <md-filled-button
                ?disabled="${this.inProgress}"
                @click="${this._deleteSelected.bind(this)}"
                >${this.t("deleteAllButOne")}
                ${this.selectedItemsCount}</md-filled-button
              >
            `
          : nothing}
      </div>

      <md-tabs
        @change="${this._methodTabChanged.bind(this)}"
        .activeTabIndex="${this.activeMethodIndex}"
      >
        ${this.availableMethods.map(
          (method) => html`
            <md-secondary-tab ?disabled="${this.inProgress}"
              >${method.label}</md-secondary-tab
            >
          `
        )}
      </md-tabs>

      ${this.errorMessage
        ? html`<div class="errorText">${this.errorMessage}</div>`
        : nothing}

      <vaadin-grid
        id="grid"
        theme="row-dividers"
        column-reordering-allowed
        .multiSort="${this.multiSortEnabled}"
        .activeItem="${this.activeItem}"
        .rowDetailsRenderer="${this.renderItemDetail.bind(this)}"
        .items="${this.items}"
        .selectedItems="${this.selectedItems as Array<unknown>}"
        @active-item-changed="${this._onActiveItemChanged.bind(this)}"
        @selected-items-changed="${this._selectedItemsChanged.bind(this)}"
      >
        <vaadin-grid-selection-column></vaadin-grid-selection-column>

        <vaadin-grid-sort-column
          id="keyCol"
          width="80px"
          flexGrow="0"
          path="key"
          .renderer="${this.renderKey.bind(this)}"
          header="<G>"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="75px"
          flexGrow="0"
          path="groupCount"
          header="#"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="140px"
          flexGrow="0"
          path="ip_address"
          header="IP Address"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="100px"
          flexGrow="0"
          path="confidenceScoreSort"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: FraudRowData
          ) => {
            root.textContent = rowData.item.confidenceScore ?? "";
          }}"
          header="%"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="150px"
          flexGrow="0"
          path="createAtValue"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: FraudRowData
          ) => {
            root.textContent = rowData.item.created_at ?? "";
          }}"
          .header="${this.t("date")}"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="120px"
          flexGrow="0"
          path="data.browserId"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: FraudRowData
          ) => {
            root.textContent = rowData.item.data?.browserId ?? "";
          }}"
          header="BrowserId"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="120px"
          flexGrow="0"
          path="data.browserFingerprint"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: FraudRowData
          ) => {
            root.textContent = rowData.item.data?.browserFingerprint ?? "";
          }}"
          header="Fingerprint"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="100px"
          flexGrow="0"
          path="User.id"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: FraudRowData
          ) => {
            root.textContent = rowData.item.User?.id?.toString() ?? "";
          }}"
          header="UserId"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="210px"
          flexGrow="0"
          path="User.email"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: FraudRowData
          ) => {
            root.textContent = rowData.item.User?.email?.toString() ?? "";
          }}"
          .header="${this.t("email")}"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          ?hidden="${this.hidePost}"
          width="100px"
          flexGrow="0"
          path="Post.id"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: FraudRowData
          ) => {
            root.textContent = rowData.item.Post?.id?.toString() ?? "";
          }}"
          header="PostId"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          ?hidden="${this.hidePoint}"
          width="100px"
          flexGrow="0"
          path="Point.id"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: FraudRowData
          ) => {
            root.textContent = rowData.item.Point?.id?.toString() ?? "";
          }}"
          header="Point"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          ?hidden="${this.hideValue}"
          width="80px"
          flexGrow="0"
          path="value"
          header="Val"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          width="150px"
          flexGrow="1"
          path="user_agent"
          header="User Agent"
        ></vaadin-grid-sort-column>

        <vaadin-grid-column
          width="58px"
          flexGrow="0"
          .headerRenderer="${this.renderSelectedActionHeader.bind(this)}"
          .renderer="${this.renderAction.bind(this)}"
        ></vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  private _collectionTypeChanged(event: Event) {
    this.selectedCollectionType = (event.target as HTMLSelectElement)
      .value as YpFraudManagementCollectionType;
    this.selectedMethod = this.defaultMethodForCollection(
      this.selectedCollectionType
    );
    this._reload();
  }

  private _methodTabChanged(event: Event) {
    const tabs = event.target as MdTabs;
    const method = this.availableMethods[tabs.activeTabIndex];
    if (method && method.value !== this.selectedMethod) {
      this.selectedMethod = method.value;
      this._reload();
    }
  }

  private defaultMethodForCollection(
    collectionType: YpFraudManagementCollectionType
  ): YpFraudManagementMethod {
    if (collectionType === "pointQualities") {
      return "byIpFingerprintPointId";
    } else if (collectionType === "posts") {
      return "byIpFingerprint";
    } else {
      return "byIpFingerprintPostId";
    }
  }

  private async _reload() {
    if (!this.communityId || this.inProgress) return;
    this._reset();
    await this._masterRequest("get-items");
  }

  private _cancelCurrentRequest() {
    this.requestToken += 1;
    if (this.pollTimeout) {
      window.clearTimeout(this.pollTimeout);
      this.pollTimeout = undefined;
    }

    this.jobId = undefined;
    this.activeRequestToken = undefined;
    this.activeRequestCommunityId = undefined;
    this.activeRequestJobId = undefined;
    this.inProgress = false;
    this.indeterminateProgress = false;
    this.progress = 0;
    this.currentType = undefined;
  }

  private _isCurrentRequest(
    requestToken: number | undefined,
    communityId: number | undefined,
    jobId: number | undefined = this.activeRequestJobId
  ) {
    return (
      requestToken !== undefined &&
      communityId !== undefined &&
      requestToken === this.activeRequestToken &&
      communityId === this.activeRequestCommunityId &&
      jobId === this.activeRequestJobId
    );
  }

  private async _masterRequest(
    type: "get-items" | "delete-one-item" | "delete-items",
    itemIds: number[] | undefined = undefined
  ) {
    const communityId = this.communityId;
    if (!communityId) {
      console.error("No community id for fraud management");
      return;
    }

    const idsToDelete =
      itemIds && itemIds.length > 0
        ? itemIds
        : this.selectedItemId
        ? [this.selectedItemId]
        : undefined;

    if ((type === "delete-one-item" || type === "delete-items") && !idsToDelete) {
      console.error("No item ids to process");
      return;
    }

    const requestToken = ++this.requestToken;
    this.currentType = type;
    this.jobId = undefined;
    this.activeRequestToken = requestToken;
    this.activeRequestCommunityId = communityId;
    this.activeRequestJobId = undefined;
    this.progress = 0;
    this.errorMessage = undefined;
    this.inProgress = true;
    this.indeterminateProgress = type === "get-items";

    const url = `/api/communities/${communityId}/${type}/${this.selectedMethod}/${this.selectedCollectionType}/start_endorsement_fraud_action`;
    try {
      const response = (await window.adminServerApi.adminMethod(url, "PUT", {
        idsToDelete,
      })) as YpFraudManagementJobResponse;
      if (!this._isCurrentRequest(requestToken, communityId, undefined)) {
        return;
      }
      this.jobId = response.jobId;
      this.activeRequestJobId = response.jobId;
      this.progress = 25;
      this._pollLaterForProgress(requestToken, communityId, response.jobId);
    } catch (error) {
      if (this._isCurrentRequest(requestToken, communityId, undefined)) {
        this._ajaxError(error);
      }
    }
  }

  private _pollLaterForProgress(
    requestToken = this.activeRequestToken,
    communityId = this.activeRequestCommunityId,
    jobId = this.activeRequestJobId
  ) {
    if (!communityId || !jobId) return;
    if (!this._isCurrentRequest(requestToken, communityId, jobId)) return;
    if (this.pollTimeout) {
      window.clearTimeout(this.pollTimeout);
    }

    this.pollTimeout = window.setTimeout(async () => {
      if (!this._isCurrentRequest(requestToken, communityId, jobId)) return;
      try {
        const response = (await window.adminServerApi.adminMethod(
          `/api/communities/${communityId}/${jobId}/endorsement_fraud_action_status`,
          "GET"
        )) as YpFraudManagementJobResponse;
        this._progressResponse(response, requestToken, communityId, jobId);
      } catch (error) {
        if (this._isCurrentRequest(requestToken, communityId, jobId)) {
          this._ajaxError(error);
        }
      }
    }, 1000);
  }

  private _progressResponse(
    response: YpFraudManagementJobResponse,
    requestToken = this.activeRequestToken,
    communityId = this.activeRequestCommunityId,
    jobId = this.activeRequestJobId
  ) {
    if (!this._isCurrentRequest(requestToken, communityId, jobId)) return;

    if (response.error) {
      this.inProgress = false;
      this.errorMessage = this.t(response.error) || response.error;
      return;
    }

    this.progress = response.progress ?? this.progress;

    if (this.jobId && this.progress < 100) {
      this._pollLaterForProgress(requestToken, communityId, jobId);
      return;
    }

    if (this.progress === 100) {
      this.inProgress = false;
      this.showReload = true;
      if (this.currentType === "delete-one-item" || this.currentType === "delete-items") {
        this._reset();
        this._masterRequest("get-items");
      } else {
        this.items = this._uncompressItems(response.data);
        this._resetSelectedAndClearCache();
      }
    }
  }

  private _ajaxError(error: unknown) {
    console.error(error);
    this.inProgress = false;
    this.errorMessage = this.t("error") || "An error has occured";
  }

  private _uncompressItems(
    itemData: YpCompressedFraudManagementData | undefined
  ) {
    if (!itemData?.items) return [];

    return itemData.items.map((item) => {
      const next: YpFraudManagementItem = {
        ...item,
        data: { ...item.data },
        User: item.User ? { ...item.User } : undefined,
        Post: item.Post ? { ...item.Post } : undefined,
        Point: item.Point
          ? {
              ...item.Point,
              Post: item.Point.Post ? { ...item.Point.Post } : undefined,
            }
          : undefined,
      };

      next.backgroundColor =
        itemData.cBackgroundColors[Number(next.backgroundColor)] ??
        next.backgroundColor;
      next.ip_address =
        itemData.cIpAddresses[Number(next.ip_address)] ?? next.ip_address;
      next.user_agent =
        itemData.cUserAgents[Number(next.user_agent)] ?? next.user_agent;

      if (next.User) {
        next.User.email =
          itemData.cEmails[Number(next.User.email)] ?? next.User.email;
        next.User.name =
          itemData.cNames[Number(next.User.name)] ??
          itemData.cEmails[Number(next.User.name)] ??
          next.User.name;
      }

      if (
        (this.selectedCollectionType === "endorsements" ||
          this.selectedCollectionType === "ratings" ||
          this.selectedCollectionType === "points") &&
        next.Post
      ) {
        next.Post.name =
          itemData.cPostNames[Number(next.Post.name)] ?? next.Post.name;
      }

      if (this.selectedCollectionType === "pointQualities" && next.Point?.Post) {
        next.Point.Post.name =
          itemData.cPostNames[Number(next.Point.Post.name)] ??
          next.Point.Post.name;
      }

      if (this.selectedCollectionType === "posts") {
        next.name = itemData.cPostNames[Number(next.name)] ?? next.name;
      }

      return next;
    });
  }

  private _activeItemChanged(
    item: YpFraudManagementItem | undefined,
    oldItem: YpFraudManagementItem | undefined
  ) {
    const grid = this.$$("#grid") as GridElement | undefined;
    if (!grid) return;
    if (item) grid.openItemDetails(item);
    if (oldItem) grid.closeItemDetails(oldItem);
    this._refreshGridAsync();
  }

  private _refreshGridAsync() {
    window.setTimeout(() => {
      (this.$$("#grid") as GridElement | undefined)?.notifyResize();
    }, 10);
  }

  private _resizeThrottler() {
    if (!this.resizeTimeout) {
      this.resizeTimeout = window.setTimeout(() => {
        this.resizeTimeout = undefined;
        this._setGridSize();
      }, 66);
    }
  }

  private _setGridSize() {
    const grid = this.$$("#grid") as HTMLElement | undefined;
    if (!grid) return;
    const sidebarWidth = this.wide ? 332 : 0;
    const availableWidth = window.innerWidth - sidebarWidth - 48;
    grid.style.width = Math.max(availableWidth, 400).toFixed() + "px";
    grid.style.height = (window.innerHeight - 220).toFixed() + "px";
  }

  private _deleteSelected() {
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

  private _delete(event: Event) {
    const itemId = (event.currentTarget as HTMLElement).getAttribute("data-args");
    if (itemId) {
      this.selectedItemId = parseInt(itemId);
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
  }

  private async _reallyDeleteSelected() {
    await this._masterRequest("delete-items", this.selectedItemIds);
  }

  private async _reallyDelete() {
    await this._masterRequest("delete-one-item");
  }

  private _reset() {
    this.items = [];
    this._resetSelectedAndClearCache();
  }

  private _resetSelectedAndClearCache() {
    this.selectedItemsCount = 0;
    this.selectedItemsEmpty = true;
    this.selectedItemIds = [];
    this.selectedItems = [];
    this.activeItem = undefined;
    (this.$$("#grid") as GridElement | undefined)?.clearCache();
  }

  private _setupHeaderText() {
    this.headerText = this.t("communityFraudManagement");
    this.itemsCountText = this.t("items");
  }
}
