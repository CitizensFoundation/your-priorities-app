import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import type { GridElement } from '@vaadin/vaadin-grid/vaadin-grid.js';

import '@polymer/iron-ajax';
import { IronAjaxElement } from '@polymer/iron-ajax';

import '@polymer/paper-listbox';
import { PaperListboxElement } from '@polymer/paper-listbox';

import '@polymer/paper-dialog';
import { PaperDialogElement } from '@polymer/paper-dialog';
import { YpConfirmationDialog } from '../@yrpri/yp-dialog-container/yp-confirmation-dialog';
import { ItemCache } from '@vaadin/vaadin-grid/src/vaadin-grid-data-provider-mixin';
import { GridColumnElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column';

interface RowData {
  item: YpUserData;
}

@customElement('yp-users-grid')
export class YpUsersGrid extends YpBaseElement {
  @property({ type: String })
  addAdminEmail: string | undefined;

  @property({ type: String })
  inviteUserEmail: string | undefined;

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

  @property({ type: String })
  inviteType = 'sendInviteByEmail';

  resizeTimeout: any | undefined;

  static get propertisses() {
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
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        #dialog {
          width: 90%;
          max-width: 1024px;
          background-color: #fff;
        }

        iron-list {
          color: #000;
          height: 500px;
          width: 100%;
        }

        .userItem {
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

        .organization {
          width: 150px;
        }

        .addRemoveButtons {
          width: 150px;
        }

        #selectOrganizationDialog {
          background-color: #fff;
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
          background-color: #fff;
          color: #000;
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
          color: #f5f5f5;
        }

        .closeButton {
          width: 50px;
          height: 50px;
          margin-left: 4px;
          margin-right: 4px;
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
          --paper-spinner-layer-1-color: #fff;
          --paper-spinner-layer-2-color: #fff;
          --paper-spinner-layer-3-color: #fff;
          --paper-spinner-layer-4-color: #fff;
        }

        .inviteButton {
          margin-top: 24px;
          height: 48px;
          margin-right: 8px;
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

  renderSelectionHeader(root: HTMLElement, column?: GridColumnElement | undefined) {
    return html`
      <paper-menu-button
        horizontal-align="right"
        class="helpButton"
        ?disabled="${this.selectedUsersEmpty}"
      >
        <paper-icon-button
          .ariaLabel="${this.t('openSelectedItemsMenu')}"
          icon="more-vert"
          slot="dropdown-trigger"
        ></paper-icon-button>
        <paper-listbox
          slot="dropdown-content"
          @iron-select="${this._menuSelection}"
        >
          ${!this.selectedUsersEmpty
            ? html`
                <paper-item
                  ?hidden="${this.adminUsers}"
                  @tap="${this._removeAndDeleteContentSelectedUsers}"
                >
                  ${this.t('removeSelectedAndDeleteContent')}
                  ${this.selectedUsersCount}
                </paper-item>
                <paper-item
                  ?hidden="${this.adminUsers}"
                  @tap="${this._removeSelectedUsersFromCollection}"
                >
                  <div ?hidden="${!this.groupId}">
                    ${this.t('removeSelectedFromGroup')}
                    ${this.selectedUsersCount}
                  </div>
                  <div ?hidden="${!this.communityId}">
                    ${this.t('removeSelectedFromCommunity')}
                    ${this.selectedUsersCount}
                  </div>
                  <div ?hidden="${!this.domainId}">
                    ${this.t('removeSelectedFromDomain')}
                    ${this.selectedUsersCount}
                  </div>
                </paper-item>
                <paper-item
                  ?hidden="${!this.adminUsers}"
                  @tap="${this._removeSelectedAdmins}"
                  >${this.t('removeSelectedAdmins')}
                  ${this.selectedUsersCount}</paper-item
                >
              `
            : html``}
        </paper-listbox>
      </paper-menu-button>
    `;
  }

  selectionRenderer(root: HTMLElement, column: any, rowData: RowData) {
    return html`
      <paper-menu-button horizontal-align="right" class="helpButton">
        <paper-icon-button
          .ariaLabel="${this.t('openOneItemMenu')}"
          icon="more-vert"
          data-args="${rowData.item.id}"
          @tap="${this._setSelected}"
          slot="dropdown-trigger"
        ></paper-icon-button>
        <paper-listbox
          slot="dropdown-content"
          @iron-select="${this._menuSelection}"
        >
          <paper-item
            data-args="${rowData.item.id}"
            ?hidden="${this.adminUsers}"
            @tap="${this._removeUserFromCollection}"
          >
            <div ?hidden="${!this.groupId}">
              ${this.t('removeFromGroup')}
            </div>
            <div ?hidden="${!this.communityId}">
              ${this.t('removeFromCommunity')}
            </div>
            <div ?hidden="${!this.domainId}">
              ${this.t('removeFromDomain')}
            </div>
          </paper-item>
          <paper-item
            data-args="${rowData.item.id}"
            ?hidden="${this.adminUsers}"
            @tap="${this._removeAndDeleteUserContent}"
          >
            <div ?hidden="${!this.groupId}">
              ${this.t('removeFromGroupDeleteContent')}
            </div>
            <div ?hidden="${!this.communityId}">
              ${this.t('removeFromCommunityDeleteContent')}
            </div>
            <div ?hidden="${!this.domainId}">
              ${this.t('removeFromDomainDeleteContent')}
            </div>
          </paper-item>
          <paper-item
            data-args="${rowData.item.id}"
            ?hidden="${!this.adminUsers}"
            @tap="${this._removeAdmin}"
            >${this.t('users.removeAdmin')}</paper-item
          >

          <paper-item
            data-args="${rowData.item.id}"
            ?hidden="${this._userOrganizationName(rowData.item)}"
            @tap="${this._addToOrganization}"
            >${this.t('users.addToOrganization')}</paper-item
          >
          <paper-item
            data-args="${rowData.item.id}"
            ?hidden="${!this._userOrganizationName(rowData.item)}"
            data-args-org="${this._userOrganizationId(rowData.item)}"
            @tap="${this._removeFromOrganization}"
            >${this.t('users.removeFromOrganization')}</paper-item
          >
        </paper-listbox>
      </paper-menu-button>
    `;
  }

  render() {
    return html`
      <paper-dialog id="selectOrganizationDialog" modal>
        <h2>${this.t('users.selectOrganization')}</h2>
        ${this.availableOrganizations
          ? html`
              <paper-dialog-scrollable>
                <paper-listbox>
                  ${this.availableOrganizations.map(
                    item => html`
                      <paper-item
                        @tap="${this._selectOrganization}"
                        id="${item.id}"
                        >${item.name}</paper-item
                      >
                    `
                  )}
                </paper-listbox>
              </paper-dialog-scrollable>
            `
          : nothing}
        <div class="buttons">
          <mwc-button .label="${this.t('Close')}" dialog-dismiss></mwc-button>
        </div>
      </paper-dialog>

      <div class="layout horizontal headerBox wrap">
        <div>
          <paper-icon-button
            ariaLabel="${this.t('close')}"
            id="dismissBtn"
            icon="close"
            class="closeButton"
            dialog-dismiss
          ></paper-icon-button>
        </div>

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
          <paper-spinner active=""></paper-spinner>
        </div>

        <div class="flex"></div>
        <div ?hidden="${!this.showReload}">
          <paper-icon-button
            .ariaLabel="${this.t('reload')}"
            icon="autorenew"
            class="closeButton"
            @tap="${this._reload}"
          ></paper-icon-button>
        </div>
        <div ?hidden="${this.domainId != null}">
          <paper-material
            ?hidden="${this.adminUsers}"
            class="layout horizontal wrap inputBox"
          >
            <paper-input
              label="${this.t('email')}"
              class="emailClass"
              .value="${this.inviteUserEmail}"
            ></paper-input>
            <paper-radio-group
              id="typeOfInvite"
              name="typeOfInvite"
              class="typeOfInvite layout vertical"
              selected="${this.inviteType}"
            >
              <paper-radio-button name="sendInviteByEmail"
                >${this.t('sendInviteByEmail')}</paper-radio-button
              >
              <paper-radio-button name="addUserDirectly"
                >${this.t('addUserDirectlyIfExist')}</paper-radio-button
              >
            </paper-radio-group>
            <mwc-button
              class="inviteButton"
              .label="${this.t('users.inviteUser')}"
              @click="${this._inviteUser}"
            ></mwc-button>
          </paper-material>
        </div>

        <paper-material
          ?hidden="${!this.adminUsers}"
          class="layout horizontal wrap inputBox"
        >
          <paper-input
            .label="${this.t('email')}"
            class="emailClass"
            .value="${this.addAdminEmail}"
          ></paper-input>
          <mwc-button
            class="inviteButton"
            .label="${this.t('users.addAdmin')}"
            @click="${this._addAdmin}"
          ></mwc-button>
        </paper-material>
      </div>

      <vaadin-grid
        id="grid"
        .ariaLabel="${this.headerText}"
        .items="${this.users}"
        .selectedItems="${this.selectedUsers as Array<unknown>}"
      >
        <vaadin-grid-selection-column auto-select="">
        </vaadin-grid-selection-column>

        <vaadin-grid-column
          width="60px"
          flexGrow="0"
          header="#"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return rowData.item.id;
          }}"
        >
        </vaadin-grid-column>

        <vaadin-grid-filter-column
          flexGrow="2"
          width="140px"
          path="name"
          .header="${this.t('name')}"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return rowData.item.name;
          }}"
        >
        </vaadin-grid-filter-column>

        <vaadin-grid-filter-column
          path="email"
          flexGrow="1"
          width="150px"
          .header="${this.t('email')}"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return rowData.item.email;
          }}"
        >
        </vaadin-grid-filter-column>

        <vaadin-grid-column
          flexGrow="1"
          width="150px"
          .header="${this.t('name')}"
          .renderer="${(root: HTMLElement, column: any, rowData: RowData) => {
            return html`
              <div
                class="organization"
                ?hidden="${!this._userOrganizationName(rowData.item)}"
              >
                <div class="organizationName">
                  ${this._userOrganizationName(rowData.item)}
                </div>
              </div>
            `;
          }}"
        >
        </vaadin-grid-column>

        <vaadin-grid-column
          width="70px"
          flexGrow="0"
          .headerRenderer="${this.renderSelectionHeader}"
          .renderer="${this.selectionRenderer}"
        >
        </vaadin-grid-column>
      </vaadin-grid>

      <div class="layout horizontal center-center">
        <iron-ajax id="ajax" @response="${this._usersResponse}"></iron-ajax>
        <iron-ajax
          method="DELETE"
          @error="${this._ajaxError}"
          id="removeAdminAjax"
          @response="${this._removeAdminResponse}"
        ></iron-ajax>
        <iron-ajax
          method="DELETE"
          @error="${this._ajaxError}"
          id="removeManyAdminAjax"
          @response="${this._removeManyAdminResponse}"
        ></iron-ajax>
        <iron-ajax
          method="DELETE"
          @error="${this._ajaxError}"
          id="removeUserAjax"
          @response="${this._removeUserResponse}"
        ></iron-ajax>
        <iron-ajax
          method="DELETE"
          @error="${this._ajaxError}"
          id="removeManyUsersAjax"
          @response="${this._removeManyUsersResponse}"
        ></iron-ajax>
        <iron-ajax
          method="DELETE"
          @error="${this._ajaxError}"
          id="removeOrganizationAjax"
          @response="${this._removeOrganizationResponse}"
        ></iron-ajax>
        <iron-ajax
          method="DELETE"
          @error="${this._ajaxError}"
          id="removeAndDeleteAjax"
          @response="${this._removeAndDeleteCompleted}"
        ></iron-ajax>
        <iron-ajax
          method="DELETE"
          @error="${this._ajaxError}"
          id="removeAndDeleteManyAjax"
          @response="${this._removeAndDeleteManyCompleted}"
        ></iron-ajax>
        <iron-ajax
          method="POST"
          @error="${this._ajaxError}"
          id="inviteUserAjax"
          @response="${this._inviteUserResponse}"
        ></iron-ajax>
        <iron-ajax
          method="POST"
          @error="${this._ajaxError}"
          id="addAdminAjax"
          @response="${this._addAdminResponse}"
        ></iron-ajax>
        <iron-ajax
          method="POST"
          @error="${this._ajaxError}"
          id="addOrganizationAjax"
          @response="${this._addOrganizationResponse}"
        ></iron-ajax>
      </div>
    `;
  }

  /*
  observers: [
    '_selectedUsersChanged(selectedUsers.splices)'
  ],
*/
  get spinnerActive() {
    return !this.totalUserCount || this.forceSpinner;
  }

  _ajaxError() {
    this.forceSpinner = false;
  }

  constructor(collectionName: string) {
    super();
    this.collectionName = collectionName;
  }

  connectedCallback() {
    super.connectedCallback();
    this._setGridSize();
    window.addEventListener('resize', this._resizeThrottler.bind(this), false);
  }

  _reload() {
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
    this.forceSpinner = true;
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
      (this.$$('#grid') as GridElement).style.height =
        window.innerHeight.toFixed() + 'px';
    } else {
      (this.$$('#grid') as GridElement).style.height =
        (window.innerHeight * 0.8).toFixed() + 'px';
    }
  }

  _menuSelection(event: CustomEvent) {
    const allMenus = (this.$$('#grid') as GridElement).querySelectorAll(
      'paper-listbox'
    );
    allMenus.forEach(item => {
      item.select('');
    });
  }

  get totalUserCount() {
    if (this.users) {
      return YpFormattingHelpers.number(this.users.length);
    } else {
      return null;
    }
  }

  _selectedUsersChanged() {
    if (this.selectedUsers && this.selectedUsers.length > 0) {
      this.selectedUsersEmpty = false;
      this.selectedUsersCount = this.selectedUsers.length;
      this.selectedUserIds = this.selectedUsers.map(user => {
        return user.id;
      });
    } else {
      this.selectedUsersEmpty = true;
      this.selectedUsersCount = 0;
      this.selectedUserIds = [];
    }
  }

  _userOrganizationId(user: YpUserData) {
    if (user && user.OrganizationUsers && user.OrganizationUsers.length > 0) {
      return user.OrganizationUsers[0].id;
    } else {
      return null;
    }
  }

  _userOrganizationName(user: YpUserData) {
    if (user && user.OrganizationUsers && user.OrganizationUsers.length > 0) {
      return user.OrganizationUsers[0].name;
    } else {
      return null;
    }
  }

  _availableOrganizations() {
    if (
      window.appUser.adminRights &&
      window.appUser.adminRights.OrganizationAdmins
    ) {
      return window.appUser.adminRights.OrganizationAdmins;
    } else {
      return [];
    }
  }

  _addToOrganization(event: CustomEvent) {
    this.userIdForSelectingOrganization = parseInt(
      (event.target as HTMLElement).getAttribute('data-args')!
    );
    this.availableOrganizations = this._availableOrganizations();
    (this.$$('#selectOrganizationDialog') as PaperDialogElement).open();
  }

  _removeFromOrganization(event: CustomEvent) {
    const target = event.target as HTMLElement;
    const userId = target.getAttribute('data-args');
    const organizationId = target.getAttribute('data-args-org');
    (this.$$('#removeOrganizationAjax') as IronAjaxElement).body = {};
    (this.$$('#removeOrganizationAjax') as IronAjaxElement).url =
      '/api/organizations/' + organizationId + '/' + userId + '/remove_user';
    (this.$$('#removeOrganizationAjax') as IronAjaxElement).generateRequest();
  }

  _selectOrganization(event: CustomEvent) {
    const addOrganizationAjax = this.$$(
      '#addOrganizationAjax'
    ) as IronAjaxElement;
    addOrganizationAjax.body = {};
    addOrganizationAjax.url =
      '/api/organizations/' +
      (event.target as HTMLElement).id +
      '/' +
      this.userIdForSelectingOrganization +
      '/add_user';
    addOrganizationAjax.generateRequest();
    (this.$$('#selectOrganizationDialog') as PaperDialogElement).close();
  }

  _removeAdmin(event: CustomEvent) {
    const userId = (event.target as HTMLElement).getAttribute('data-args');
    const removeAdminAjax = this.$$('#removeAdminAjax') as IronAjaxElement;
    removeAdminAjax.body = {};
    if (this.modelType == 'groups' && this.groupId) {
      removeAdminAjax.url =
        '/api/' +
        this.modelType +
        '/' +
        this.groupId +
        '/' +
        userId +
        '/remove_admin';
      removeAdminAjax.generateRequest();
    } else if (this.modelType == 'communities' && this.communityId) {
      removeAdminAjax.url =
        '/api/' +
        this.modelType +
        '/' +
        this.communityId +
        '/' +
        userId +
        '/remove_admin';
      removeAdminAjax.generateRequest();
    } else if (this.modelType == 'domains' && this.domainId) {
      removeAdminAjax.url =
        '/api/' +
        this.modelType +
        '/' +
        this.domainId +
        '/' +
        userId +
        '/remove_admin';
      removeAdminAjax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  }

  _removeSelectedAdmins(event: CustomEvent) {
    this._setupUserIdFromEvent(event);
    window.appDialogs.getDialogAsync(
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('areYouSureYouWantToRemoveAdmins'),
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
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('areYouSureRemoveAndDeleteSelectedUserContent'),
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
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('areYouSureRemoveSelectedUsers'),
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
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('areYouSureRemoveUser'),
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
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('areYouSureRemoveAndDeleteUser'),
          this._reallyRemoveAndDeleteUserContent.bind(this),
          true,
          true
        );
      }
    );
  }

  _reallyRemoveSelectedAdmins() {
    this._removeMaster(
      this.$$('#removeManyAdminAjax') as IronAjaxElement,
      'remove_many_admins',
      this.selectedUserIds
    );
  }

  _reallyRemoveAndDeleteContentSelectedUsers() {
    this._removeMaster(
      this.$$('#removeAndDeleteManyAjax') as IronAjaxElement,
      'remove_many_users_and_delete_content',
      this.selectedUserIds
    );
  }

  _reallyRemoveSelectedUsersFromCollection() {
    this._removeMaster(
      this.$$('removeManyUsersAjax') as IronAjaxElement,
      'remove_many_users',
      this.selectedUserIds
    );
  }

  _reallyRemoveUserFromCollection() {
    this._removeMaster(
      this.$$('#removeUserAjax') as IronAjaxElement,
      'remove_user'
    );
  }

  _reallyRemoveAndDeleteUserContent() {
    this._removeMaster(
      this.$$('#removeAndDeleteAjax') as IronAjaxElement,
      'remove_and_delete_user_content'
    );
  }

  _setupUserIdFromEvent(event: CustomEvent) {
    const target = event.target as HTMLElement;
    let userId = target!.parentElement!.getAttribute('data-args');
    if (!userId) userId = target.getAttribute('data-args');
    if (userId) this.selectedUserId = parseInt(userId);
  }

  _removeMaster(
    ajax: IronAjaxElement,
    type: string,
    userIds: Array<number> | undefined = undefined
  ) {
    let url, collectionId;
    if (this.modelType === 'groups' && this.groupId) {
      collectionId = this.groupId;
    } else if (this.modelType === 'communities' && this.communityId) {
      collectionId = this.communityId;
    } else if (this.modelType === 'domains' && this.domainId) {
      collectionId = this.domainId;
    } else {
      console.error("Can't find model type or ids");
      return;
    }
    if (userIds && userIds.length > 0) {
      url = '/api/' + this.modelType + '/' + collectionId + '/' + type;
      ajax.body = { userIds: userIds };
    } else if (this.selectedUserId) {
      url =
        '/api/' +
        this.modelType +
        '/' +
        collectionId +
        '/' +
        this.selectedUserId +
        '/' +
        type;
      ajax.body = {};
    } else {
      console.error('No user ids to remove');
      return;
    }
    if (this.modelType === 'groups' && this.groupId) {
      ajax.url = url;
      ajax.generateRequest();
      this.forceSpinner = true;
    } else if (this.modelType === 'communities' && this.communityId) {
      ajax.url = url;
      ajax.generateRequest();
      this.forceSpinner = true;
    } else if (this.modelType === 'domains' && this.domainId) {
      ajax.url = url;
      ajax.generateRequest();
      this.forceSpinner = true;
    } else {
      console.warn("Can't find model type or ids");
    }
    if (this.selectedUserId) {
      const user = this._findUserFromId(this.selectedUserId);
      if (user) (this.$$('#grid') as GridElement).deselectItem(user);
    }
  }

  _setSelected(event: CustomEvent) {
    const userId = (event.target as HTMLElement).getAttribute('data-args');
    if (userId) {
      const user = this._findUserFromId(parseInt(userId));
      if (user) (this.$$('#grid') as GridElement).selectItem(user);
    }
  }

  _findUserFromId(id: Number) {
    let foundUser;
    this.users!.forEach(user => {
      if (user.id == id) {
        foundUser = user;
      }
    });
    return foundUser;
  }

  _addAdmin(event: CustomEvent) {
    const adminAjax = this.$$('#addAdminAjax') as IronAjaxElement;
    adminAjax.body = {};
    if (this.modelType === 'groups' && this.groupId) {
      adminAjax.url =
        '/api/' +
        this.modelType +
        '/' +
        this.groupId +
        '/' +
        this.addAdminEmail +
        '/add_admin';
      adminAjax.generateRequest();
    } else if (this.modelType === 'communities' && this.communityId) {
      adminAjax.url =
        '/api/' +
        this.modelType +
        '/' +
        this.communityId +
        '/' +
        this.addAdminEmail +
        '/add_admin';
      adminAjax.generateRequest();
    } else if (this.modelType === 'domains' && this.domainId) {
      adminAjax.url =
        '/api/' +
        this.modelType +
        '/' +
        this.domainId +
        '/' +
        this.addAdminEmail +
        '/add_admin';
      adminAjax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  }

  _inviteUser(event: CustomEvent) {
    const inviteUserAjax = this.$$('#inviteUserAjax') as IronAjaxElement;

    inviteUserAjax.body = {};
    if (this.modelType === 'groups' && this.groupId) {
      inviteUserAjax.url =
        '/api/' +
        this.modelType +
        '/' +
        this.groupId +
        '/' +
        this.inviteUserEmail +
        '/invite_user' +
        (this.inviteType === 'addUserDirectly' ? '?addToGroupDirectly=1' : '');
      inviteUserAjax.generateRequest();
    } else if (this.modelType === 'communities' && this.communityId) {
      inviteUserAjax.url =
        '/api/' +
        this.modelType +
        '/' +
        this.communityId +
        '/' +
        this.inviteUserEmail +
        '/invite_user' +
        (this.inviteType === 'addUserDirectly'
          ? '?addToCommunityDirectly=1'
          : '');
      inviteUserAjax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  }

  _manyItemsResponse(showToast = false) {
    this.forceSpinner = false;
    this.showReload = true;
    if (showToast)
      window.appGlobals.notifyUserViaToast(
        this.t('operationInProgressTryReloading')
      );
  }

  _removeAdminResponse() {
    window.appGlobals.notifyUserViaToast(this.t('adminRemoved'));
    this._reload();
  }

  _removeManyAdminResponse() {
    window.appDialogs.getDialogAsync(
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(this.t('removalsInProgress'), undefined, true, false, true);
      }
    );
    this._manyItemsResponse();
  }

  _removeManyUsersResponse() {
    window.appDialogs.getDialogAsync(
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(this.t('removalsInProgress'), undefined, true, false, true);
      }
    );
    this._manyItemsResponse();
  }

  _removeAndDeleteCompleted() {
    window.appDialogs.getDialogAsync(
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('removalAndDeletionInProgress'),
          undefined,
          true,
          false,
          true
        );
      }
    );
    this._manyItemsResponse();
  }

  _removeAndDeleteManyCompleted() {
    window.appDialogs.getDialogAsync(
      'confirmationDialog',
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t('removalsAndDeletionsInProgress'),
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
    window.appGlobals.notifyUserViaToast(this.t('userRemoved'));
    this._reload();
  }

  _addAdminResponse() {
    window.appGlobals.notifyUserViaToast(
      this.t('adminAdded') + ' ' + this.addAdminEmail
    );
    this.addAdminEmail = undefined;
    this._reload();
  }

  _addOrganizationResponse(event: CustomEvent) {
    window.appGlobals.notifyUserViaToast(
      this.t('organizationUserAdded') + ' ' + event.detail.response.email
    );
    this._reload();
  }

  _removeOrganizationResponse(event: CustomEvent) {
    window.appGlobals.notifyUserViaToast(
      this.t('organizationUserRemoved') + ' ' + event.detail.response.email
    );
    this._reload();
  }

  _inviteUserResponse() {
    window.appGlobals.notifyUserViaToast(
      this.t('users.userInvited') + ' ' + this.inviteUserEmail
    );
    this.inviteUserEmail = undefined;
    this._reload();
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

  _generateRequest(id: Number) {
    const adminsOrUsers = this.adminUsers ? 'admin_users' : 'users';
    (this.$$('#ajax') as IronAjaxElement).url =
      '/api/' + this.modelType + '/' + id + '/' + adminsOrUsers;
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
  }

  _usersResponse(event: CustomEvent) {
    this.forceSpinner = false;
    this.users = event.detail.response as Array<YpUserData>;
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
    (this.$$('#grid') as GridElement).clearCache();
  }

  _setupHeaderText() {
    if (this.adminUsers) {
      this.usersCountText = this.t('adminsCount');
    } else {
      this.usersCountText = this.t('usersCount');
    }
    if (this.groupId) {
      if (this.adminUsers) {
        this.headerText = this.t('group.admins');
      } else {
        this.headerText = this.t('group.users');
      }
    } else if (this.communityId) {
      if (this.adminUsers) {
        this.headerText = this.t('community.admins');
      } else {
        this.headerText = this.t('community.users');
      }
    } else if (this.domainId) {
      if (this.adminUsers) {
        this.headerText = this.t('domainAdmins');
      } else {
        this.headerText = this.t('domainUsers');
      }
    }
  }
}
