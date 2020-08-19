import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-fab/paper-fab.js';
import '@material/mwc-button';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../yp-ajax/yp-ajax.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import './yp-user-image.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpUsersGridLit extends YpBaseElement {
  static get properties() {
    return {
      addAdminEmail: {
        type: String
      },

      inviteUserEmail: {
        type: String
      },

      users: {
        type: Array,
        notify: true,
        value: null
      },

      headerText: {
        type: String
      },

      groupId: {
        type: Number,
        observer: '_groupIdChanged'
      },

      domainId: {
        type: Number,
        observer: '_domainIdChanged'
      },

      communityId: {
        type: Number,
        observer: '_communityIdChanged'
      },

      adminUsers: {
        type: Boolean,
        value: false
      },

      selected: {
        type: Object
      },

      modelType: {
        type: String
      },

      opened: {
        type: Boolean,
        value: false
      },

      availableOrganizations: {
        type: Array
      },

      userIdForSelectingOrganization: Number,

      selectedUsers: {
        type: Array,
        notify: true
      },

      selectedUsersCount: {
        type: Number,
        value: 0
      },

      selectedUsersEmpty: {
        type: Boolean,
        value: true
      },

      selectedUserIds: {
        type: Array
      },

      selectedUserId: {
        type: String
      },

      totalUserCount: {
        type: String,
        computed: '_totalUserCount(users)'
      },

      collectionName: String,

      usersCountText: String,

      showReload: {
        type: Boolean,
        value: false
      },

      forceSpinner: {
        type: Boolean,
        value: false
      },

      spinnerActive: {
        type: Boolean,
        computed: '_spinnerActive(totalUserCount, forceSpinner)'
      },

      inviteType: {
        type: String,
        value: 'sendInviteByEmail'
      }
    }
  }

  static get styles() {
    return [
      css`
        #dialog {
          width: 90%;
          max-width: 1024px;
          background-color: #FFF;
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
          background-color: #FFF;

        }

        [hidden] {
          display: none !important;
        }

        paper-listbox {
          margin-right: 8px !important;
        }

        .headerBox {
          background-color: var(--accent-color);
          color: #FFF;
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
          background-color: #FFF;
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
          color: #F5F5F5;
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
          --paper-spinner-layer-1-color: #FFF;
          --paper-spinner-layer-2-color: #FFF;
          --paper-spinner-layer-3-color: #FFF;
          --paper-spinner-layer-4-color: #FFF;
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
    `, YpFlexLayout];
  }

  render() {
    return html`
    <paper-dialog id="selectOrganizationDialog" modal="">
      <h2>${this.t('users.selectOrganization')}</h2>
      <paper-dialog-scrollable>
        <paper-listbox>

          ${ this.availableOrganizations.map(item => html`
          <paper-item @tap="${this._selectOrganization}" id="${this.item.id}">${this.item.name}</paper-item>

          `)}

        </paper-listbox>
      </paper-dialog-scrollable>

      <div class="buttons">
        <mwc-button .label="${this.t('Close')}" dialog-dismiss></mwc-button>
      </div>
    </paper-dialog>

    <paper-dialog id="dialog" modal>
      <div class="layout horizontal headerBox wrap">

        <div>
          <paper-icon-button ariaLabel="${this.t('close')}" id="dismissBtn" icon="close" class="closeButton" dialog-dismiss></paper-icon-button>
        </div>

        <div class="headerText layout vertical">
          <div class="layout horizontal">
            <div class="collectionName">${this.collectionName}</div>
          </div>
          <div class="innerHeader">${this.headerText}
            <span ?hidden="${!this.totalUserCount}">(${this.totalUserCount})</span>
          </div>
        </div>
        <div ?hidden="${!this.spinnerActive}"><paper-spinner active=""></paper-spinner></div>

        <div class="flex"></div>
        <div ?hidden="${!this.showReload}">
          <paper-icon-button .ariaLabel="${this.t('reload')}" icon="autorenew" class="closeButton" @tap="${this._reload}"></paper-icon-button>
        </div>
        <div ?hidden="${this.domainId}">
          <paper-material ?hidden="${this.adminUsers}" class="layout horizontal wrap inputBox">
            <paper-input label="${this.t('email')}" class="emailClass" value="${this.inviteUserEmail}"></paper-input>
            <paper-radio-group id="typeOfInvite" name="typeOfInvite" class="typeOfInvite layout vertical" selected="${this.inviteType}">
              <paper-radio-button name="sendInviteByEmail">${this.t('sendInviteByEmail')}</paper-radio-button>
              <paper-radio-button name="addUserDirectly">${this.t('addUserDirectlyIfExist')}</paper-radio-button>
            </paper-radio-group>
            <mwc-button class="inviteButton" .label="${this.t('users.inviteUser')}" @click="${this._inviteUser}"></mwc-button>
          </paper-material>
        </div>

        <paper-material ?hidden="${!this.adminUsers}" class="layout horizontal wrap inputBox">
          <paper-input .label="${this.t('email')}" class="emailClass" value="${this.addAdminEmail}"></paper-input>
          <mwc-button class="inviteButton" .label="${this.t('users.addAdmin')}" @click="${this._addAdmin}"></mwc-button>
        </paper-material>
      </div>

      <vaadin-grid id="grid" .ariaLabel="${this.headerText}" .items="${this.users}" selectedItems="${this.selectedUsers}">
        <vaadin-grid-selection-column auto-select="">
        </vaadin-grid-selection-column>

        <vaadin-grid-column width="60px" .flexGrow="0">
          <template class="header">#</template>
          <template>${this.item.id}</template>
        </vaadin-grid-column>

        <vaadin-grid-filter-column .flexGrow="2" width="140px" .path="name" .header="${this.t('name')}">
          <template>${this.item.name}</template>
        </vaadin-grid-filter-column>

        <vaadin-grid-filter-column .path="email" .flexGrow="1" width="150px" .header="${this.t('email')}">
          <template>${this.item.email}</template>
        </vaadin-grid-filter-column>

        <vaadin-grid-column .flexGrow="1" width="150px">
          <template class="header">${this.t('organization')}</template>
          <template>
            <div class="organization" ?hidden="${!this._userOrganizationName(item)}">
              <div class="organizationName">
                ${this._userOrganizationName(item)}
              </div>
            </div>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column width="70px" .flexGrow="0">
          <template class="header">
            <paper-menu-button horizontal-align="right" class="helpButton" ?disabled="${this.selectedUsersEmpty}">
              <paper-icon-button .ariaLabel="${this.t('openSelectedItemsMenu')}" .icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
              <paper-listbox slot="dropdown-content" @iron-select="${this._menuSelection}">

                ${ !this.selectedUsersEmpty ? html`
                <paper-item data-args="${this.item.id}" ?hidden="${this.adminUsers}" @tap="${this._removeAndDeleteContentSelectedUsers}">
                    ${this.t('removeSelectedAndDeleteContent')} ${this.selectedUsersCount}
                  </paper-item>
                  <paper-item data-args="${this.item.id}" ?hidden="${this.adminUsers}" @tap="${this._removeSelectedUsersFromCollection}">
                    <div ?hidden="${!this.groupId}">
                      ${this.t('removeSelectedFromGroup')} ${this.selectedUsersCount}
                    </div>
                    <div ?hidden="${!thiscommunityId}">
                      ${this.t('removeSelectedFromCommunity')} ${this.selectedUsersCount}
                    </div>
                    <div ?hidden="${!this.domainId}">
                      ${this.t('removeSelectedFromDomain')} ${this.selectedUsersCount}
                    </div>
                  </paper-item>
                  <paper-item data-args="${this.item.id}" ?hidden="${!this.adminUsers}" @tap="${this._removeSelectedAdmins}">${this.t('removeSelectedAdmins')} ${this.selectedUsersCount}</paper-item>
                ` : html``}

              </paper-listbox>
            </paper-menu-button>
          </template>
          <template>
            <paper-menu-button horizontal-align="right" class="helpButton">
              <paper-icon-button .ariaLabel="${this.t('openOneItemMenu')}" .icon="more-vert" data-args="${this.item.id}" @tap="${this._setSelected}" slot="dropdown-trigger"></paper-icon-button>
              <paper-listbox slot="dropdown-content" @iron-select="${this._menuSelection}">
                <paper-item data-args="${this.item.i}" ?hidden="${this.adminUsers}" @tap="${_removeUserFromCollection}">
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
                <paper-item data-args="${this.item.id}" ?hidden="${this.adminUsers}" @tap="${this._removeAndDeleteUserContent}">
                  <div ?hidden="${!this.groupId}">
                    ${t('removeFromGroupDeleteContent')}
                  </div>
                  <div ?hidden="${!this.communityId}">
                    ${this.t('removeFromCommunityDeleteContent')}
                  </div>
                  <div ?hidden="${!this.domainId}">
                    ${this.t('removeFromDomainDeleteContent')}
                  </div>
                </paper-item>
                <paper-item data-args="${this.item.id}" ?hidden="${!this.adminUsers}" @tap="${this._removeAdmin}">${this.t('users.removeAdmin')}</paper-item>

                <paper-item data-args="${this.item.id}" ?hidden="${this._userOrganizationName(item)}" @tap="${this._addToOrganization}">${this('users.addToOrganization')}</paper-item>
                <paper-item data-args="${this.item.id}" ?hidden="${!this._userOrganizationName(item)}" data-args-org="${this._userOrganizationId(item)}" @tap="${_removeFromOrganization}">${this.t('users.removeFromOrganization')}</paper-item>
              </paper-listbox>
            </paper-menu-button>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
   </paper-dialog>

    <div class="layout horizontal center-center">
      <yp-ajax id="ajax" @response="${this._usersResponse}"></yp-ajax>
      <yp-ajax method="DELETE" @error="${this._ajaxError}" id="removeAdminAjax" @response="${this._removeAdminResponse}"></yp-ajax>
      <yp-ajax method="DELETE" @error="${this._ajaxError}" id="removeManyAdminAjax" @response="${this._removeManyAdminResponse}"></yp-ajax>
      <yp-ajax method="DELETE" @error="${this._ajaxError}" id="removeUserAjax" @response="${this._removeUserResponse}"></yp-ajax>
      <yp-ajax method="DELETE" @error="${this._ajaxError}" id="removeManyUsersAjax" @response="${this._removeManyUsersResponse}"></yp-ajax>
      <yp-ajax method="DELETE" @error="${this._ajaxError}" id="removeOrganizationAjax" @response="${this._removeOrganizationResponse}"></yp-ajax>
      <yp-ajax method="DELETE" @error="${this._ajaxError}" id="removeAndDeleteAjax" @response="${this._removeAndDeleteCompleted}"></yp-ajax>
      <yp-ajax method="DELETE" @error="${this._ajaxError}" id="removeAndDeleteManyAjax" @response="${this._removeAndDeleteManyCompleted}"></yp-ajax>
      <yp-ajax method="POST" @error="${this._ajaxError}" id="inviteUserAjax" @response="${this._inviteUserResponse}"></yp-ajax>
      <yp-ajax method="POST" @error="${this._ajaxError}" id="addAdminAjax" @response="${this._addAdminResponse}"></yp-ajax>
      <yp-ajax method="POST" @error="${this._ajaxError}" id="addOrganizationAjax" @response="${this._addOrganizationResponse}"></yp-ajax>
    </div>
    `
  }

/*
  behaviors: [
    ypNumberFormatBehavior
  ],

  observers: [
    '_selectedUsersChanged(selectedUsers.splices)'
  ],
*/
  _spinnerActive(count, force) {
    return !count || force
  }

  _ajaxError() {
    this.forceSpinner = false;
  }

  connectedCallback() {
    super.connectedCallback()
      this._setGridSize();
      window.addEventListener("resize", this._resizeThrottler.bind(this), false);
  }

  _reload() {
    this.$$("#ajax").generateRequest();
    this.forceSpinner = true;
  }

  _resizeThrottler() {
    if ( !this.resizeTimeout ) {
      this.resizeTimeout = setTimeout(function() {
        this.resizeTimeout = null;
        this._setGridSize();
      }.bind(this), 66);
    }
  }

  _setGridSize() {
    if (window.innerWidth<=600) {
      this.$$("#grid").style.height = (window.innerHeight).toFixed()+'px';
    } else {
      this.$$("#grid").style.height = (window.innerHeight*0.8).toFixed()+'px';
    }
  }

  _menuSelection(event, detail) {
    const allMenus = this.$$("#grid").querySelectorAll("paper-listbox");
    allMenus.forEach(function (item) {
      item.select(null);
    });
  }

  _totalUserCount(users) {
    if (users) {
      return this.formatNumber(users.length);
    } else {
      return null;
    }
  }

  _selectedUsersChanged() {
    if (this.selectedUsers && this.selectedUsers.length>0) {
      this.selectedUsersEmpty = false;
      this.selectedUsersCount = this.selectedUsers.length;
    } else {
      this.selectedUsersEmpty = true;
      this.selectedUsersCount = 0;
    }
    this.selectedUserIds = this.selectedUsers.map(function (user) { return user.id });
  }

  _userOrganizationId(user) {
    if (user && user.OrganizationUsers && user.OrganizationUsers.length>0) {
      return user.OrganizationUsers[0].id;
    } else {
      return null;
    }
  }

  _userOrganizationName(user) {
    if (user && user.OrganizationUsers && user.OrganizationUsers.length>0) {
      return user.OrganizationUsers[0].name;
    } else {
      return null;
    }
  }

  _availableOrganizations() {
    if (window.appUser.adminRights && window.appUser.adminRights.OrganizationAdmins) {
      return  window.appUser.adminRights.OrganizationAdmins;
    } else {
      return [];
    }
  }

  _addToOrganization(event) {
    this.userIdForSelectingOrganization = event.target.getAttribute('data-args');
    this.availableOrganizations = this._availableOrganizations();
    this.$$("#selectOrganizationDialog").open();
  }

  _removeFromOrganization(event) {
    const userId = event.target.getAttribute('data-args');
    const organizationId = event.target.getAttribute('data-args-org');
    this.$$("#removeOrganizationAjax").body = {};
    this.$$("#removeOrganizationAjax").url = "/api/organizations/" + organizationId + "/" + userId + "/remove_user";
    this.$$("#removeOrganizationAjax").generateRequest();
  }

  _selectOrganization(event, detail) {
    this.$$("#addOrganizationAjax").body = {};
    this.$$("#addOrganizationAjax").url = "/api/organizations/" + event.target.id + "/" + this.userIdForSelectingOrganization + "/add_user";
    this.$$("#addOrganizationAjax").generateRequest();
    this.$$("#selectOrganizationDialog").close();
  }

  _removeAdmin(event) {
    const userId = event.target.getAttribute('data-args');
    this .$.removeAdminAjax.body = {};
    if (this.modelType=="groups" && this.groupId) {
      this.$$("#removeAdminAjax").url = "/api/" + this.modelType + "/" + this.groupId + "/" + userId + "/remove_admin";
      this.$$("#removeAdminAjax").generateRequest();
    } else if (this.modelType=="communities" && this.communityId) {
      this.$$("#removeAdminAjax").url = "/api/" + this.modelType + "/" + this.communityId + "/" + userId + "/remove_admin";
      this.$$("#removeAdminAjax").generateRequest();
    } else if (this.modelType=="domains" && this.domainId) {
      this.$$("#removeAdminAjax").url = "/api/" + this.modelType + "/" + this.domainId + "/" + userId + "/remove_admin";
      this.$$("#removeAdminAjax").generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  }

  _removeSelectedAdmins(event) {
    this._setupUserIdFromEvent(event);
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureYouWantToRemoveAdmins'), this._reallyRemoveSelectedAdmins.bind(this), true, false);
    }.bind(this));
  }

  _removeAndDeleteContentSelectedUsers(event) {
    this._setupUserIdFromEvent(event);
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureRemoveAndDeleteSelectedUserContent'), this._reallyRemoveAndDeleteContentSelectedUsers.bind(this), true, true);
    }.bind(this));
  }

  _removeSelectedUsersFromCollection(event) {
    this._setupUserIdFromEvent(event);
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureRemoveSelectedUsers'), this._reallyRemoveSelectedUsersFromCollection.bind(this), true, true);
    }.bind(this));
  }

  _removeUserFromCollection(event) {
    this._setupUserIdFromEvent(event);
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureRemoveUser'), this._reallyRemoveUserFromCollection.bind(this), true, false);
    }.bind(this));
  }

  _removeAndDeleteUserContent(event) {
    this._setupUserIdFromEvent(event);
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureRemoveAndDeleteUser'), this._reallyRemoveAndDeleteUserContent.bind(this), true, true);
    }.bind(this));
  }

  _reallyRemoveSelectedAdmins() {
    this._removeMaster(this.$$("#removeManyAdminAjax"), 'remove_many_admins', this.selectedUserIds);
  }

  _reallyRemoveAndDeleteContentSelectedUsers() {
    this._removeMaster(this.$$("#removeAndDeleteManyAjax"), 'remove_many_users_and_delete_content', this.selectedUserIds);
  }

  _reallyRemoveSelectedUsersFromCollection() {
    this._removeMaster(this.$$("removeManyUsersAjax"), 'remove_many_users', this.selectedUserIds);
  }

  _reallyRemoveUserFromCollection() {
    this._removeMaster(this.$$("#removeUserAjax"), 'remove_user');
  }

  _reallyRemoveAndDeleteUserContent() {
    this._removeMaster(this.$$("#removeAndDeleteAjax"), 'remove_and_delete_user_content');
  }

  _setupUserIdFromEvent(event) {
    const userId = event.target.parentElement.getAttribute('data-args');
    if (!userId)
      userId = event.target.getAttribute('data-args');
    this.selectedUserId = userId;
  }

  _removeMaster(ajax, type, userIds) {
    let url, collectionId;
    if (this.modelType==="groups" && this.groupId) {
      collectionId = this.groupId;
    } else if (this.modelType==="communities" && this.communityId) {
      collectionId = this.communityId;
    } else if (this.modelType==="domains" && this.domainId) {
      collectionId = this.domainId;
    } else {
      console.error("Can't find model type or ids");
      return;
    }
    if (userIds && userIds.length>0) {
      url = "/api/" + this.modelType + "/" + collectionId + "/" +type;
      ajax.body = { userIds: userIds };
    } else if (this.selectedUserId) {
      url = "/api/" + this.modelType + "/" + collectionId + "/" + this.selectedUserId + "/"+type;
      ajax.body = {};
    } else {
      console.error("No user ids to remove");
      return;
    }
    if (this.modelType==="groups" && this.groupId) {
      ajax.url = url;
      ajax.generateRequest();
      this.forceSpinner = true;
    } else if (this.modelType==="communities" && this.communityId) {
      ajax.url = url;
      ajax.generateRequest();
      this.forceSpinner = true;
    } else if (this.modelType==="domains" && this.domainId) {
      ajax.url = url;
      ajax.generateRequest();
      this.forceSpinner = true;
    } else {
      console.warn("Can't find model type or ids");
    }
    if (this.selectedUserId) {
      const user = this._findUserFromId(this.selectedUserId);
      if (user)
        this.$$("#grid").deselectItem(user);
    }
  }

  _setSelected(event) {
    const user = this._findUserFromId(event.target.getAttribute('data-args'));
    if (user)
      this.$$("#grid").selectItem(user);
  }

  _findUserFromId(id) {
    let foundUser;
    this.users.forEach(function (user) {
      if (user.id==id) {
        foundUser = user;
      }
    }.bind(this));
    return foundUser;
  }

  _addAdmin(event) {
    this.$$("#addAdminAjax").body = {};
    if (this.modelType==="groups" && this.groupId) {
      this.$$("#addAdminAjax").url = "/api/" + this.modelType + "/" + this.groupId + "/" + this.addAdminEmail + "/add_admin";
      this.$$("#addAdminAjax").generateRequest();
    } else if (this.modelType==="communities" && this.communityId) {
      this.$$("#addAdminAjax").url = "/api/" + this.modelType + "/" + this.communityId + "/" + this.addAdminEmail + "/add_admin";
      this.$$("#addAdminAjax").generateRequest();
    } else if (this.modelType==="domains" && this.domainId) {
      this.$$("#addAdminAjax").url = "/api/" + this.modelType + "/" + this.domainId + "/" + this.addAdminEmail + "/add_admin";
      this.$$("#addAdminAjax").generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  }

  _inviteUser(event) {
    this.$.inviteUserAjax.body = {};
    if (this.modelType==="groups" && this.groupId) {
      this.$.inviteUserAjax.url = "/api/" + this.modelType + "/" + this.groupId + "/" + this.inviteUserEmail + "/invite_user"+(this.inviteType==='addUserDirectly' ? '?addToGroupDirectly=1' : '');
      this.$.inviteUserAjax.generateRequest();
    } else if (this.modelType==="communities" && this.communityId) {
      this.$.inviteUserAjax.url = "/api/" + this.modelType + "/" + this.communityId + "/" + this.inviteUserEmail + "/invite_user"+(this.inviteType==='addUserDirectly' ? '?addToCommunityDirectly=1' : '');
      this.$.inviteUserAjax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  }

  _manyItemsResponse(showToast) {
    this.forceSpinner = false;
    this.showReload = true;
    if (showToast)
      window.appGlobals.notifyUserViaToast(this.t('operationInProgressTryReloading'));
  }

  _removeAdminResponse() {
    window.appGlobals.notifyUserViaToast(this.t('adminRemoved'));
    this._reload();
  }

  _removeManyAdminResponse() {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('removalsInProgress'), null, true, false, true);
    }.bind(this));
    this._manyItemsResponse();
  }

  _removeManyUsersResponse() {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('removalsInProgress'), null, true, false, true);
    }.bind(this));
    this._manyItemsResponse();
  }

  _removeAndDeleteCompleted() {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('removalAndDeletionInProgress'), null, true, false, true);
    }.bind(this));
    this._manyItemsResponse();
  }

  _removeAndDeleteManyCompleted() {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('removalsAndDeletionsInProgress'), null, true, false, true);
    }.bind(this));
    this._manyItemsResponse();
  }

  _removeUserResponse() {
    window.appGlobals.notifyUserViaToast(this.t('userRemoved'));
    this._reload();
  }

  _addAdminResponse() {
    window.appGlobals.notifyUserViaToast(this.t('adminAdded')+' '+this.addAdminEmail);
    this.addAdminEmail = null;
    this._reload();
  }

  _addOrganizationResponse(event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('organizationUserAdded')+' '+ detail.response.email);
    this._reload();
  }

  _removeOrganizationResponse(event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('organizationUserRemoved')+' '+ detail.response.email);
    this._reload();
  }

  _inviteUserResponse() {
    window.appGlobals.notifyUserViaToast(this.t('users.userInvited')+' '+this.inviteUserEmail);
    this.inviteUserEmail = null;
    this._reload();
  }

  _domainIdChanged(newGroupId) {
    if (newGroupId) {
      this._reset();
      this.modelType = 'domains';
      this._generateRequest(newGroupId);
    }
  }

  _groupIdChanged(newGroupId) {
    if (newGroupId) {
      this._reset();
      this.modelType = 'groups';
      this._generateRequest(newGroupId);
    }
  }

  _communityIdChanged(newCommunityId) {
    if (newCommunityId) {
      this._reset();
      this.modelType = 'communities';
      this._generateRequest(newCommunityId);
    }
  }

  _generateRequest(id) {
    const adminsOrUsers = this.adminUsers ? "admin_users" : "users";
    this.$$("#ajax").url = "/api/"+this.modelType+"/"+id+"/"+adminsOrUsers;
    this.$$("#ajax").generateRequest();
  }

  _usersResponse(event, detail) {
    this.forceSpinner = false;
    this.users = detail.response;
    this._resetSelectedAndClearCache();
  }

  setup(groupId, communityId, domainId, adminUsers) {
    this.groupId = null; 
    this.communityId = null;
    this.domainId = null;
    this.users = null;
    this.adminUsers = adminUsers;

    if (groupId)
      this.groupId = groupId;

    if (communityId)
      this.communityId = communityId;

    if (domainId)
      this.domainId = domainId;

    this._setupHeaderText();
  }

  open(name) {
    this.opened = true;
    this.collectionName = name)
    this.$$("#dialog").open();
  }

  _reset() {
    this.users = null)
    this._resetSelectedAndClearCache();
  }

  _resetSelectedAndClearCache() {
    this.selectedUsers = [];
    this.selectedUsersCount = 0;
    this.selectedUsersEmpty = true;
    this.$$("#grid").clearCache();
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

window.customElements.define('yp-users-grid-lit', YpUsersGridLit)
