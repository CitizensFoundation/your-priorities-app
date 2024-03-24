import { LitElement, TemplateResult, css, html, nothing, render } from "lit";
import { property, customElement, query } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import "@vaadin/vaadin-grid/vaadin-grid.js";
import { GridElement } from "@vaadin/vaadin-grid/vaadin-grid.js";
import "@material/web/dialog/dialog.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/button/filled-button.js";
import "@material/web/menu/menu.js";

import "@material/web/menu/menu-item.js";

import "@material/web/iconbutton/icon-button.js";

import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/radio/radio.js";
import "@vaadin/grid/vaadin-grid.js";
import "@vaadin/grid/vaadin-grid-selection-column.js";
import "@vaadin/grid/vaadin-grid-filter-column.js";
import "@vaadin/grid/vaadin-grid-sort-column.js";
import { MdDialog } from "@material/web/dialog/dialog.js";

import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog.js";
//import { ItemCache } from '@vaadin/vaadin-grid/src/vaadin-grid-data-provider-mixin';
import { GridColumn } from "@vaadin/vaadin-grid/src/vaadin-grid-column";
import { Corner, MdMenu } from "@material/web/menu/menu.js";

interface RowData {
  item: YpUserData;
}

@customElement("yp-users-grid")
export class YpUsersGrid extends YpBaseElement {
  @query("#addAdminEmail")
  addAdminEmail: HTMLInputElement | undefined;

  @query("#inviteUserEmail")
  inviteUserEmail: HTMLInputElement | undefined;

  @property({ type: String })
  headerText: string | undefined;

  @property({ type: Array })
  users: Array<YpUserData> | undefined;

  @property({ type: Number })
  groupId: number | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Number })
  domainId: number | undefined;

  @property({ type: Boolean })
  adminUsers = false;

  @property({ type: Object })
  selected: YpUserData | undefined;

  @property({ type: String })
  modelType: string | undefined;

  @property({ type: Array })
  availableOrganizations: Array<YpOrganizationData> | undefined;

  @property({ type: Number })
  userIdForSelectingOrganization: number | undefined;

  @property({ type: Array })
  selectedUsers: Array<YpUserData> | undefined;

  @property({ type: Number })
  selectedUsersCount = 0;

  @property({ type: Boolean })
  selectedUsersEmpty = true;

  @property({ type: Array })
  selectedUserIds: Array<number> | undefined;

  @property({ type: Number })
  selectedUserId: number | undefined;

  @property({ type: String })
  collectionName: string;

  @property({ type: String })
  usersCountText: string | undefined;

  @property({ type: Boolean })
  showReload = false;

  @property({ type: Boolean })
  forceSpinner = false;

  @property({ type: Number })
  lastFethedId: number | undefined;

  @query("#grid") private gridElement?: HTMLElement;

  @property({ type: String })
  inviteType = "sendInviteByEmail";

  resizeTimeout: any | undefined;

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("groupId")) {
      this._groupIdChanged();
    }
    if (changedProperties.has("communityId")) {
      this._communityIdChanged();
    }
    if (changedProperties.has("domainId")) {
      this._domainIdChanged();
    }

    if (changedProperties.has("adminUsers") && this.users) {
      this.showReload = false;
      this._reload();
    }

    this._setupHeaderText();
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .userItem {
          padding-right: 16px;
        }

        .id {
          width: 40px;
        }

        .name {
          width: 200px;
        }

        md-circular-progress {
          margin-top: 8px;
          margin-left: 16px;
        }

        .email {
          width: 190px;
          overflow-wrap: break-word;
        }

        .organization {
          width: 150px;
        }

        .addRemoveButtons {
          width: 150px;
        }

        md-menu-item {
          z-index: 500;
        }

        vaadin-grid {
          --lumo-base-color: var(--md-sys-color-surface);
          --lumo-body-text-color: var(--md-sys-color-on-surface);
          --lumo-primary-color: var(--md-sys-color-primary);
          --lumo-primary-color-10pct: var(--md-sys-color-surface-variant);
          --lumo-primary-color-50pct: var(--md-sys-color-primary);
          --lumo-primary-contrast-color: var(--md-sys-color-on-tertiary);
          --lumo-tint: var(--md-sys-color-on-surface);
          --lumo-tint-10pct: var(--md-sys-color-on-surface);
          --lumo-tint-20pct: var(--md-sys-color-on-surface);
          --lumo-tint-30pct: var(--md-sys-color-on-surface);
          --lumo-tint-40pct: var(--md-sys-color-on-surface);
          --lumo-tint-50pct: var(--md-sys-color-on-surface);
          --lumo-tint-60pct: var(--md-sys-color-on-surface);
          --lumo-tint-70pct: var(--md-sys-color-on-surface);
          --lumo-tint-80pct: var(--md-sys-color-on-surface);
          --lumo-tint-90pct: var(--md-sys-color-on-surface);
          --lumo-header-text-color: var(--md-sys-color-on-surface);
          --lumo-body-text-color: var(--md-sys-color-on-surface);
          --lumo-secondary-text-color: var(--md-sys-color-on-surface);
          --lumo-tertiary-text-color: var(--md-sys-color-on-surface);
          --lumo-disabled-text-color: var(--md-sys-color-on-surface);
          --lumo-primary-text-color: var(--md-sys-color-on-surface);
          --lumo-error-text-color: var(--md-sys-color-error);
          --lumo-success-text-color: var(--md-sys-color-on-surface);
          --lumo-link-color: var(--md-sys-color-on-surface);
        }

        #selectOrganizationDialog {
        }

        [hidden] {
          display: none !important;
        }

        paper-listbox {
          margin-right: 8px !important;
        }

        .headerBox {
          background-color: var(--md-sys-primary-container);
          color: var(--md-sys-on-primary-container);
          margin: 0;
          padding: 0 0;
          padding-top: 12px;
          padding-bottom: 10px;
        }

        paper-button {
          margin-left: 24px;
        }

        .inputBox {
          margin-left: 16px;
          padding-left: 8px;
          padding-right: 8px;
          padding-bottom: 4px;
          margin-bottom: 4px;
          align-self: flex-start;
          margin-top: 2px;
          margin-right: 12px;
        }

        #grid {
          margin-top: 0;
          margin-bottom: 0;
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

        vaadin-grid {
          width: 100%;
          max-width: 1024px;
        }

        .topContainer {
          width: 100%;
          max-width: 1024px;
        }

        md-radio {
          margin-right: 8px;
          margin-bottom: 8px;
        }

        @media (max-width: 600px) {
          .closeButton {
            width: 45px;
            height: 45px;
          }

          .inputBox {
            margin-top: 6px;
          }

          paper-listbox {
            margin-right: 8px;
          }

          #dialog {
            width: 100%;
            height: 100%;
            margin: 0;
          }

          .headerText {
            font-size: 20px;
            line-height: 1.2em;
            text-align: center;
          }
        }

        paper-spinner {
          margin-left: 16px;
          margin-top: 8px;
        }

        .inviteButton {
          margin: 16px;
        }

        #inviteUserEmail {
          margin-right: 16px;
        }

        @media (max-width: 600px) {
          .inviteButton {
            margin-top: 4px;
            margin-bottom: 12px;
            height: 48px;
            margin-right: 8px;
          }
        }

        .typeOfInvite {
          margin-left: 4px;
          margin-top: 6px;
          margin-bottom: 6px;
        }

        .emailClass {
          margin-left: 6px;
          margin-right: 6px;
        }
      `,
    ];
  }

  renderSelectionHeader(root: HTMLElement, column?: GridColumn | undefined) {
    render(
      html`
        <div style="position: relative;">
          <md-icon-button
            id="user-all-anchor"
            .ariaLabel="${this.t("openSelectedItemsMenu")}"
            @click="${this._openAllMenu.bind(this)}"
            ><md-icon>more_vert</md-icon></md-icon-button
          >
          <md-menu
            .menuCorner="${Corner.START_END}"
            class="helpButton"
            id="allUsersMenu"
            positioning="popover"
            anchor="user-all-anchor"
            @selected="${this._menuSelection}"
            ?disabled="${this.selectedUsersEmpty}"
          >
            ${!this.selectedUsersEmpty
              ? html`
                  <md-menu-item
                    ?hidden="${this.adminUsers}"
                    @click="${this._removeAndDeleteContentSelectedUsers.bind(
                      this
                    )}"
                  >
                    ${this.t("removeSelectedAndDeleteContent")}
                    ${this.selectedUsersCount}
                  </md-menu-item>
                  <md-menu-item
                    ?hidden="${this.adminUsers}"
                    @click="${this._removeSelectedUsersFromCollection.bind(
                      this
                    )}"
                  >
                    <div ?hidden="${!this.groupId}">
                      ${this.t("removeSelectedFromGroup")}
                      ${this.selectedUsersCount}
                    </div>
                    <div ?hidden="${!this.communityId}">
                      ${this.t("removeSelectedFromCommunity")}
                      ${this.selectedUsersCount}
                    </div>
                    <div ?hidden="${!this.domainId}">
                      ${this.t("removeSelectedFromDomain")}
                      ${this.selectedUsersCount}
                    </div>
                  </md-menu-item>
                  <md-menu-item
                    ?hidden="${!this.adminUsers}"
                    @click="${this._removeSelectedAdmins.bind(this)}"
                  >
                    ${this.t("removeSelectedAdmins")} ${this.selectedUsersCount}
                  </md-menu-item>
                `
              : html``}
          </md-menu>
        </div>
      `,
      root
    );
  }

  selectionRenderer(root: HTMLElement, column: any, rowData: any) {
    render(
      html`
        <div style="position: relative;">
          <md-icon-button
            .ariaLabel="${this.t("openOneItemMenu")}"
            data-args="${rowData.item.id}"
            id="user-item-${rowData.item.id}-anchor"
            @click="${this._setSelected.bind(this)}"
            ><md-icon>more_vert</md-icon></md-icon-button
          >
        </div>
        <md-menu
          .menuCorner="${Corner.START_END}"
          positioning="popover"
          id="userItemMenu${rowData.item.id}"
          anchor="user-item-${rowData.item.id}-anchor"
          class="helpButton"
        >
          <md-menu-item
            data-args="${rowData.item.id}"
            ?hidden="${this.adminUsers}"
            @click="${this._removeUserFromCollection.bind(this)}"
          >
            <div ?hidden="${!this.groupId}">${this.t("removeFromGroup")}</div>
            <div ?hidden="${!this.communityId}">
              ${this.t("removeFromCommunity")}
            </div>
            <div ?hidden="${!this.domainId}">${this.t("removeFromDomain")}</div>
          </md-menu-item>
          <md-menu-item
            data-args="${rowData.item.id}"
            ?hidden="${this.adminUsers}"
            @click="${this._removeAndDeleteUserContent.bind(this)}"
          >
            <div ?hidden="${!this.groupId}">
              ${this.t("removeFromGroupDeleteContent")}
            </div>
            <div ?hidden="${!this.communityId}">
              ${this.t("removeFromCommunityDeleteContent")}
            </div>
            <div ?hidden="${!this.domainId}">
              ${this.t("removeFromDomainDeleteContent")}
            </div>
          </md-menu-item>
          <md-menu-item
            data-args="${rowData.item.id}"
            ?hidden="${!this.adminUsers}"
            @click="${this._removeAdmin.bind(this)}"
          >
            ${this.t("users.removeAdmin")}
          </md-menu-item>

          <md-menu-item
            data-args="${rowData.item.id}"
            ?hidden="${this._userOrganizationName(rowData.item)}"
            @click="${this._addToOrganization.bind(this)}"
          >
            ${this.t("users.addToOrganization")}
          </md-menu-item>
          <md-menu-item
            data-args="${rowData.item.id}"
            ?hidden="${!this._userOrganizationName(rowData.item)}"
            data-args-org="${this._userOrganizationId(rowData.item)}"
            @click="${this._removeFromOrganization.bind(this)}"
          >
            ${this.t("users.removeFromOrganization")}
          </md-menu-item>
        </md-menu>
      `,
      root
    );
  }

  _reloadFromButton() {
    this.showReload = false;
    this._reload();
  }

  override render() {
    return html`
      <div class="layout horizontal topContainer">
        <div class="headerText layout vertical">
          <div class="layout horizontal">
            <div class="collectionName">${this.collectionName}</div>
          </div>
          <div class="innerHeader">
            ${this.headerText}
            <span ?hidden="${!this.totalUserCount}"
              >(${this.totalUserCount})</span
            >
          </div>
        </div>
        <div ?hidden="${!this.spinnerActive}">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>

        <div class="flex"></div>
        <div ?hidden="${!this.showReload}">
          <md-icon-button
            aria-label="${this.t("reload")}"
            class="closeButton"
            @click="${this._reloadFromButton}"
            ><md-icon>autorenew</md-icon></md-icon-button
          >
        </div>
        <div ?hidden="${this.domainId != null}">
          <div
            ?hidden="${this.adminUsers}"
            class="layout horizontal wrap inputBox"
          >
            <md-outlined-text-field
              id="inviteUserEmail"
              label="${this.t("email")}"
              class="emailClass"
              .value="${""}"
            ></md-outlined-text-field>
            <div
              id="typeOfInvite"
              name="typeOfInvite"
              class="typeOfInvite layout vertical"
              selected="${this.inviteType}"
            >
              <label>
                <md-radio
                  id="sendInviteByEmail"
                  name="inviteSelection"
                  @click="${() => (this.inviteType = "sendInviteByEmail")}"
                  checked
                ></md-radio>
                ${this.t("sendInviteByEmail")}</label
              ><label>
                <md-radio
                  id="addUserDirectly"
                  name="inviteSelection"
                  @click="${() => (this.inviteType = "addUserDirectly")}"
                ></md-radio
                >${this.t("addUserDirectlyIfExist")}</label
              >
            </div>
            <md-filled-button class="inviteButton" @click="${this._inviteUser}"
              >${this.t("users.inviteUser")}</md-filled-button
            >
          </div>
        </div>

        <div
          ?hidden="${!this.adminUsers}"
          class="layout horizontal wrap inputBox"
        >
          <md-outlined-text-field
            label="${this.t("email")}"
            class="emailClass"
            id="addAdminEmail"
          ></md-outlined-text-field>
          <md-filled-button class="inviteButton" @click="${this._addAdmin}"
            >${this.t("users.addAdmin")}</md-filled-button
          >
        </div>
      </div>

      <vaadin-grid
        id="grid"
        aria-label="${this.headerText}"
        .items="${this.users}"
        .selectedItems="${this.selectedUsers as Array<unknown>}"
        @selected-items-changed="${this._selectedUsersChanged.bind(this)}"
        multi-sort
        multi-sort-priority="append"
      >
        <vaadin-grid-selection-column
          auto-select
        ></vaadin-grid-selection-column>
        <vaadin-grid-sort-column path="id"></vaadin-grid-sort-column>
        <vaadin-grid-filter-column
          flex-grow="2"
          width="140px"
          path="name"
          header="${this.t("name")}"
        ></vaadin-grid-filter-column>
        <vaadin-grid-filter-column
          path="email"
          flex-grow="1"
          width="150px"
          header="${this.t("email")}"
        ></vaadin-grid-filter-column>
        <vaadin-grid-column
          flex-grow="1"
          width="150px"
          header="${this.t("organization")}"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            root.innerHTML = `
              <div
                class="organization"
                ?hidden="${!this._userOrganizationName(rowData.item)}"
              >
                <div class="organizationName">
                  ${this._userOrganizationName(rowData.item) || ""}
                </div>
              </div>
            `;
          }}"
        ></vaadin-grid-column>
        <vaadin-grid-column
          width="70px"
          .renderer=${this.selectionRenderer.bind(this)}
          flex-grow="1"
          .headerRenderer=${this.renderSelectionHeader.bind(this)}
        ></vaadin-grid-column>
      </vaadin-grid>

      <md-dialog id="selectOrganizationDialog">
        <div slot="headline">${this.t("users.selectOrganization")}</div>
        ${this.availableOrganizations
          ? html`
              <div slot="content">
                <md-list>
                  ${this.availableOrganizations.map(
                    (item) => html`
                      <md-list-item
                        interactive
                        @click="${this._selectOrganization.bind(this)}"
                        id="${item.id}"
                        >${item.name}</md-list-item
                      >
                    `
                  )}
                </md-list>
              </div>
            `
          : nothing}
        <div slot="actions">
          <md-filled-button @click="${this.closeOrganizationDialog}"
            >${this.t("Close")}</md-filled-button
          >
        </div>
      </md-dialog>
    `;
  }

  get spinnerActive() {
    return !this.totalUserCount || this.forceSpinner;
  }

  async _generateRequest(id: number | undefined = undefined) {
    if (!id) {
      id = this.lastFethedId;
    } else {
      this.lastFethedId = id;
    }
    const adminsOrUsers = this.adminUsers ? "admin_users" : "users";
    const response = await window.adminServerApi.adminMethod(
      `/api/${this.modelType}/${id}/${adminsOrUsers}`,
      "GET"
    );
    this._usersResponse({ detail: response } as CustomEvent);
  }

  private async _ajaxError(error: any | undefined = undefined) {
    this.forceSpinner = false;

    //TODO: Generate error
  }

  constructor(collectionName: string) {
    super();
    this.collectionName = collectionName;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._setGridSize();
    window.addEventListener("resize", this._resizeThrottler.bind(this), false);
  }

  private async _reload() {
    try {
      await this._generateRequest();
      this.forceSpinner = true;
    } catch (error) {
      this._ajaxError();
    } finally {
      this.forceSpinner = false;
    }
  }

  private _resizeThrottler(): void {
    if (!this.resizeTimeout) {
      this.resizeTimeout = window.setTimeout(() => {
        this.resizeTimeout = undefined;
        this._setGridSize();
      }, 66);
    }
  }

  private _setGridSize(): void {
    if (this.gridElement) {
      if (window.innerWidth <= 600) {
        this.gridElement.style.height = `${window.innerHeight}px`;
      } else {
        this.gridElement.style.height = `${window.innerHeight * 0.8}px`;
      }
    }
  }

  private _menuSelection(event: CustomEvent): void {
    const allMenus = this.shadowRoot?.querySelectorAll("md-menu");
    allMenus?.forEach((item) => {
      (item as any).select(""); // Replace with the correct method if md-menu has one
    });
  }

  get totalUserCount(): string | null {
    return this.users ? YpFormattingHelpers.number(this.users.length) : null;
  }

  private _selectedUsersChanged(event: CustomEvent): void {
    if (event.detail && event.detail.value) {
      this.selectedUsers = event.detail.value as Array<YpUserData>;
    }
    if (this.selectedUsers && this.selectedUsers.length > 0) {
      this.selectedUsersEmpty = false;
      this.selectedUsersCount = this.selectedUsers.length;
      this.selectedUserIds = this.selectedUsers.map((user) => user.id);
    } else {
      this.selectedUsersEmpty = true;
      this.selectedUsersCount = 0;
      this.selectedUserIds = [];
    }
  }

  private _userOrganizationId(user: YpUserData): number | null {
    return user && user.OrganizationUsers && user.OrganizationUsers.length > 0
      ? user.OrganizationUsers[0].id
      : null;
  }

  private _userOrganizationName(user: YpUserData): string | null {
    return user && user.OrganizationUsers && user.OrganizationUsers.length > 0
      ? user.OrganizationUsers[0].name
      : null;
  }

  private _availableOrganizations(): YpOrganizationData[] {
    return window.appUser.adminRights?.OrganizationAdmins || [];
  }

  private async _addToOrganization(event: CustomEvent) {
    this.userIdForSelectingOrganization = parseInt(
      (event.target as HTMLElement).getAttribute("data-args")!
    );
    this.availableOrganizations = this._availableOrganizations();
    (
      this.shadowRoot!.getElementById("selectOrganizationDialog") as MdDialog
    ).show();
  }

  closeOrganizationDialog() {
    (
      this.shadowRoot!.getElementById("selectOrganizationDialog") as MdDialog
    ).close();
  }

  private async _removeFromOrganization(event: CustomEvent) {
    const target = event.target as HTMLElement;
    const userId = target.getAttribute("data-args");
    const organizationId = target.getAttribute("data-args-org");
    try {
      await window.adminServerApi.removeUserFromOrganization(
        parseInt(organizationId!),
        parseInt(userId!)
      );
      this._reload();
    } catch (error) {
      this._ajaxError(error);
    }
  }

  private async _selectOrganization(event: CustomEvent) {
    const organizationId = (event.target as HTMLElement).id;
    try {
      await window.adminServerApi.addUserToOrganization(
        parseInt(organizationId!),
        this.userIdForSelectingOrganization!
      );
      (
        this.shadowRoot!.getElementById("selectOrganizationDialog") as MdDialog
      ).close();
      this._reload();
    } catch (error) {
      this._ajaxError(error);
    }
  }

  private async _removeAdmin(event: CustomEvent) {
    const userId = parseInt(
      (event.target as HTMLElement).getAttribute("data-args")!
    );
    try {
      if (this.modelType === "groups" && this.groupId) {
        await window.adminServerApi.removeAdmin("groups", this.groupId, userId);
      } else if (this.modelType === "communities" && this.communityId) {
        await window.adminServerApi.removeAdmin(
          "communities",
          this.communityId,
          userId
        );
      } else if (this.modelType === "domains" && this.domainId) {
        await window.adminServerApi.removeAdmin(
          "domains",
          this.domainId,
          userId
        );
      } else {
        console.warn("Can't find model type or ids");
      }
      this._reload();
    } catch (error) {
      this._ajaxError(error);
    }
  }

  _removeSelectedAdmins(event: CustomEvent) {
    this._setupUserIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureYouWantToRemoveAdmins"),
          this._reallyRemoveSelectedAdmins.bind(this),
          true,
          false
        );
      }
    );
  }

  _removeAndDeleteContentSelectedUsers(event: CustomEvent) {
    this._setupUserIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureRemoveAndDeleteSelectedUserContent"),
          this._reallyRemoveAndDeleteContentSelectedUsers.bind(this),
          true,
          true
        );
      }
    );
  }

  _removeSelectedUsersFromCollection(event: CustomEvent) {
    this._setupUserIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureRemoveSelectedUsers"),
          this._reallyRemoveSelectedUsersFromCollection.bind(this),
          true,
          true
        );
      }
    );
  }

  _removeUserFromCollection(event: CustomEvent) {
    this._setupUserIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureRemoveUser"),
          this._reallyRemoveUserFromCollection.bind(this),
          true,
          false
        );
      }
    );
  }

  _removeAndDeleteUserContent(event: CustomEvent) {
    this._setupUserIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureRemoveAndDeleteUser"),
          this._reallyRemoveAndDeleteUserContent.bind(this),
          true,
          true
        );
      }
    );
  }

  private async _removeMaster(
    type: string,
    userIds: Array<number> | undefined = undefined
  ) {
    let url: string;
    let collectionId: number | undefined;

    if (this.modelType === "groups" && this.groupId) {
      collectionId = this.groupId;
    } else if (this.modelType === "communities" && this.communityId) {
      collectionId = this.communityId;
    } else if (this.modelType === "domains" && this.domainId) {
      collectionId = this.domainId;
    } else {
      console.error("Can't find model type or ids");
      return;
    }

    if (userIds && userIds.length > 0) {
      url = `/api/${this.modelType}/${collectionId}/${type}`;
    } else if (this.selectedUserId) {
      url = `/api/${this.modelType}/${collectionId}/${this.selectedUserId}/${type}`;
    } else {
      console.error("No user ids to remove");
      return;
    }

    const body = userIds ? { userIds: userIds } : {};

    try {
      this.forceSpinner = true;
      await window.adminServerApi.adminMethod(url, "DELETE", body);
      this._manyItemsResponse(true);
    } catch (error) {
      console.error(error);
      this._ajaxError(error);
    } finally {
      this.forceSpinner = false;
    }

    if (this.selectedUserId) {
      const user = this._findUserFromId(this.selectedUserId);
      if (user && this.gridElement instanceof GridElement) {
        this.gridElement.deselectItem(user);
      }
    }
  }

  private async _reallyRemoveSelectedAdmins() {
    await this._removeMaster("remove_many_admins", this.selectedUserIds);
  }

  private async _reallyRemoveAndDeleteContentSelectedUsers() {
    await this._removeMaster(
      "remove_many_users_and_delete_content",
      this.selectedUserIds
    );
  }

  private async _reallyRemoveSelectedUsersFromCollection() {
    await this._removeMaster("remove_many_users", this.selectedUserIds);
  }

  private async _reallyRemoveUserFromCollection() {
    await this._removeMaster("remove_user");
  }

  private async _reallyRemoveAndDeleteUserContent() {
    await this._removeMaster("remove_and_delete_user_content");
  }

  _setupUserIdFromEvent(event: CustomEvent) {
    const target = event.target as HTMLElement;
    let userId = target!.parentElement!.getAttribute("data-args");
    if (!userId) userId = target.getAttribute("data-args");
    if (userId) this.selectedUserId = parseInt(userId);
  }

  _openAllMenu(event: CustomEvent) {
    (this.$$(`#allUsersMenu`) as MdMenu).open = true;
  }

  _setSelected(event: CustomEvent) {
    const userId = (event.target as HTMLElement).getAttribute("data-args");
    if (userId) {
      const user = this._findUserFromId(parseInt(userId));
      if (user) (this.$$("#grid") as GridElement).selectItem(user);
    }
    setTimeout(() => {
      (this.$$(`#userItemMenu${userId}`) as MdMenu).open = true;
    });
  }

  _findUserFromId(id: Number) {
    let foundUser;
    this.users!.forEach((user) => {
      if (user.id == id) {
        foundUser = user;
      }
    });
    return foundUser;
  }

  async _addAdmin(event: CustomEvent) {
    try {
      let response;
      if (this.modelType === "groups" && this.groupId && this.addAdminEmail) {
        response = await window.adminServerApi.addAdmin(
          "groups",
          this.groupId,
          this.addAdminEmail.value
        );
      } else if (
        this.modelType === "communities" &&
        this.communityId &&
        this.addAdminEmail &&
        this.addAdminEmail.value
      ) {
        response = await window.adminServerApi.addAdmin(
          "communities",
          this.communityId,
          this.addAdminEmail.value
        );
      } else if (
        this.modelType === "domains" &&
        this.domainId &&
        this.addAdminEmail &&
        this.addAdminEmail.value
      ) {
        response = await window.adminServerApi.addAdmin(
          "domains",
          this.domainId,
          this.addAdminEmail.value
        );
      } else {
        console.warn("Can't find model type or ids");
        return;
      }
      this._addAdminResponse();
    } catch (error) {
      this._ajaxError(error);
    }
  }

  async _inviteUser(event: CustomEvent) {
    try {
      let response;
      if (
        this.modelType === "groups" &&
        this.groupId &&
        this.inviteUserEmail &&
        this.inviteUserEmail!.value
      ) {
        response = await window.adminServerApi.inviteUser(
          "groups",
          this.groupId,
          this.inviteUserEmail.value,
          this.inviteType
        );
      } else if (
        this.modelType === "communities" &&
        this.communityId &&
        this.inviteUserEmail!.value
      ) {
        response = await window.adminServerApi.inviteUser(
          "communities",
          this.communityId,
          this.inviteUserEmail!.value,
          this.inviteType
        );
      } else {
        console.warn("Can't find model type or ids");
        return;
      }
      this._inviteUserResponse();
    } catch (error) {
      this._ajaxError(error);
    }
  }

  _manyItemsResponse(showToast = false) {
    this.forceSpinner = false;
    this.showReload = true;
    if (showToast)
      window.appGlobals.notifyUserViaToast(
        this.t("operationInProgressTryReloading")
      );

    setTimeout(() => {
      this._reload();
    }, 500);
  }

  _removeAdminResponse() {
    window.appGlobals.notifyUserViaToast(this.t("adminRemoved"));
    this._reload();
  }

  _removeManyAdminResponse() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(this.t("removalsInProgress"), undefined, true, false, true);
      }
    );
    this._manyItemsResponse();
  }

  _removeManyUsersResponse() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(this.t("removalsInProgress"), undefined, true, false, true);
      }
    );
    this._manyItemsResponse();
  }

  _removeAndDeleteCompleted() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("removalAndDeletionInProgress"),
          undefined,
          true,
          false,
          true
        );
      }
    );
    this._removeUserResponse();
  }

  _removeAndDeleteManyCompleted() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("removalsAndDeletionsInProgress"),
          undefined,
          true,
          false,
          true
        );
      }
    );
    this._manyItemsResponse();
  }

  _removeUserResponse() {
    window.appGlobals.notifyUserViaToast(this.t("userRemoved"));
    this._reload();
  }

  _addAdminResponse() {
    window.appGlobals.notifyUserViaToast(
      this.t("adminAdded") + " " + this.addAdminEmail!.value
    );
    this.addAdminEmail!.value = "";
    this._reload();
  }

  _addOrganizationResponse(event: CustomEvent) {
    window.appGlobals.notifyUserViaToast(
      this.t("organizationUserAdded") + " " + event.detail.response.email
    );
    this._reload();
  }

  _removeOrganizationResponse(event: CustomEvent) {
    window.appGlobals.notifyUserViaToast(
      this.t("organizationUserRemoved") + " " + event.detail.response.email
    );
    this._reload();
  }

  _inviteUserResponse() {
    window.appGlobals.notifyUserViaToast(
      this.t("users.userInvited") + " " + this.inviteUserEmail!.value
    );
    (this.$$("#inviteUserEmail") as HTMLInputElement).value = "";
    this._reload();
  }

  _domainIdChanged() {
    if (this.domainId) {
      this._reset();
      this.modelType = "domains";
      this._generateRequest(this.domainId);
    }
  }

  _groupIdChanged() {
    if (this.groupId) {
      this._reset();
      this.modelType = "groups";
      this._generateRequest(this.groupId);
    }
  }

  _communityIdChanged() {
    if (this.communityId) {
      this._reset();
      this.modelType = "communities";
      this._generateRequest(this.communityId);
    }
  }

  _usersResponse(event: CustomEvent) {
    this.forceSpinner = false;
    this.users = event.detail as Array<YpUserData>;
    this._resetSelectedAndClearCache();
  }

  setup(
    groupId: number | undefined,
    communityId: number | undefined,
    domainId: number | undefined,
    adminUsers: boolean
  ) {
    this.groupId = undefined;
    this.communityId = undefined;
    this.domainId = undefined;
    this.users = undefined;
    this.adminUsers = adminUsers;

    if (groupId) this.groupId = groupId;

    if (communityId) this.communityId = communityId;

    if (domainId) this.domainId = domainId;

    this._setupHeaderText();
  }

  _reset() {
    this.users = undefined;
    this._resetSelectedAndClearCache();
  }

  _resetSelectedAndClearCache() {
    this.selectedUsers = [];
    this.selectedUsersCount = 0;
    this.selectedUsersEmpty = true;
    (this.$$("#grid") as GridElement).clearCache();
  }

  _setupHeaderText() {
    if (this.adminUsers) {
      this.usersCountText = this.t("adminsCount");
    } else {
      this.usersCountText = this.t("usersCount");
    }
    if (this.groupId) {
      if (this.adminUsers) {
        this.headerText = this.t("group.admins");
      } else {
        this.headerText = this.t("group.users");
      }
    } else if (this.communityId) {
      if (this.adminUsers) {
        this.headerText = this.t("community.admins");
      } else {
        this.headerText = this.t("community.users");
      }
    } else if (this.domainId) {
      if (this.adminUsers) {
        this.headerText = this.t("domainAdmins");
      } else {
        this.headerText = this.t("domainUsers");
      }
    }
  }
}
