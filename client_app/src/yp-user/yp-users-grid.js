import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-list/iron-list.js';
import '../../../../@polymer/paper-fab/paper-fab.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import '../../../../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../yp-ajax/yp-ajax.js';
import './yp-user-image.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      #dialog {
        width: 800px;
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
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="selectOrganizationDialog" modal="">
      <h2>[[t('users.selectOrganization')]]</h2>
      <paper-dialog-scrollable>
        <paper-listbox>
          <template is="dom-repeat" items="[[availableOrganizations]]">
            <paper-item on-tap="_selectOrganization" id="[[item.id]]">[[item.name]]</paper-item>
          </template>
        </paper-listbox>
      </paper-dialog-scrollable>

      <div class="buttons">
        <paper-button dialog-dismiss="">[[t('Close')]]</paper-button>
      </div>
    </paper-dialog>

    <paper-dialog id="dialog">
      <h2>[[headerText]]</h2>
      <paper-dialog-scrollable>
        <iron-list items="[[users]]" as="user">
          <template>
            <div class="layout horizontal">
              <div class="userItem id">
                [[user.id]]
              </div>
              <div class="userItem name">
                [[user.name]]
              </div>
              <div class="userItem email">
                [[user.email]]
              </div>
              <template is="dom-if" if="[[!_userOrganizationName(user)]]">
                <div class="organization">
                  <paper-button data-args\$="[[user.id]]" on-tap="_addToOrganization">[[t('users.addToOrganization')]]</paper-button>
                </div>
              </template>
              <div class="organization" hidden\$="[[!_userOrganizationName(user)]]">
                <div class="organizationName">
                  [[_userOrganizationName(user)]]
                </div>
                <paper-button data-args\$="[[user.id]]" data-args-org\$="[[_userOrganizationId(user)]]" on-tap="_removeFromOrganization">[[t('users.removeFromOrganization')]]</paper-button>
              </div>
              <div hidden\$="[[!adminUsers]]" class="addRemoveButtons">
                <paper-button data-args\$="[[user.id]]" on-tap="_removeAdmin">[[t('users.removeAdmin')]]</paper-button>
              </div>
              <div hidden\$="[[adminUsers]]">
                <paper-button data-args\$="[[user.id]]" on-tap="_removeUser">[[t('users.removeUser')]]</paper-button>
              </div>
            </div>
          </template>
        </iron-list>
      </paper-dialog-scrollable>
      <div hidden\$="[[!adminUsers]]" class="layout horizontal">
        <paper-input label="[[t('users.email')]]" value="{{addAdminEmail}}"></paper-input>
        <paper-button on-tap="_addAdmin">[[t('users.addAdmin')]]</paper-button>
      </div>
      <div hidden\$="[[adminUsers]]" class="layout horizontal">
        <paper-input label="[[t('users.email')]]" value="{{inviteUserEmail}}"></paper-input>
        <paper-button on-tap="_inviteUser">[[t('users.inviteUser')]]</paper-button>
      </div>

      <div class="buttons">
        <paper-button dialog-dismiss="">[[t('close')]]</paper-button>
      </div>
    </paper-dialog>

    <div class="layout horizontal center-center">
      <yp-ajax id="ajax" on-response="_usersResponse"></yp-ajax>
      <yp-ajax method="DELETE" id="removeAdminAjax" on-response="_removeAdminResponse"></yp-ajax>
      <yp-ajax method="DELETE" id="removeUserAjax" on-response="_removeUserResponse"></yp-ajax>
      <yp-ajax method="DELETE" id="removeOrganizationAjax" on-response="_removeOrganizationResponse"></yp-ajax>
      <yp-ajax method="POST" id="inviteUserAjax" on-response="_inviteUserResponse"></yp-ajax>
      <yp-ajax method="POST" id="addAdminAjax" on-response="_addAdminResponse"></yp-ajax>
      <yp-ajax method="POST" id="addOrganizationAjax" on-response="_addOrganizationResponse"></yp-ajax>
    </div>
`,

  is: 'yp-users-grid',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {

    addAdminEmail: {
      type: String
    },

    inviteUserEmail: {
      type: String
    },

    users: {
      type: Array,
      notify: true
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

    userIdForSelectingOrganization: Number
  },

  _userOrganizationId: function (user) {
    if (user && user.OrganizationUsers && user.OrganizationUsers.length>0) {
      return user.OrganizationUsers[0].id;
    } else {
      return null;
    }
  },

  _userOrganizationName: function (user) {
    if (user && user.OrganizationUsers && user.OrganizationUsers.length>0) {
      return user.OrganizationUsers[0].name;
    } else {
      return null;
    }
  },

  _availableOrganizations: function () {
    if (window.appUser.adminRights && window.appUser.adminRights.OrganizationAdmins) {
      return  window.appUser.adminRights.OrganizationAdmins;
    } else {
      return [];
    }
  },

  _addToOrganization: function (event) {
    this.set('userIdForSelectingOrganization', event.target.getAttribute('data-args'));
    this.set('availableOrganizations', this._availableOrganizations());
    this.$.selectOrganizationDialog.open();
  },

  _removeFromOrganization: function (event) {
    var userId = event.target.getAttribute('data-args');
    var organizationId = event.target.getAttribute('data-args-org');
    this.$.removeOrganizationAjax.body = {};
    this.$.removeOrganizationAjax.url = "/api/organizations/" + organizationId + "/" + userId + "/remove_user";
    this.$.removeOrganizationAjax.generateRequest();
  },

  _selectOrganization: function (event, detail) {
    this.$.addOrganizationAjax.body = {};
    this.$.addOrganizationAjax.url = "/api/organizations/" + event.target.id + "/" + this.userIdForSelectingOrganization + "/add_user";
    this.$.addOrganizationAjax.generateRequest();
    this.$.selectOrganizationDialog.close();
  },

  _removeAdmin: function (event) {
    var userId = event.target.getAttribute('data-args');
    this.$.removeAdminAjax.body = {};
    if (this.modelType=="groups" && this.groupId) {
      this.$.removeAdminAjax.url = "/api/" + this.modelType + "/" + this.groupId + "/" + userId + "/remove_admin";
      this.$.removeAdminAjax.generateRequest();
    } else if (this.modelType=="communities" && this.communityId) {
      this.$.removeAdminAjax.url = "/api/" + this.modelType + "/" + this.communityId + "/" + userId + "/remove_admin";
      this.$.removeAdminAjax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  },

  _removeUser: function (event) {
    var userId = event.target.getAttribute('data-args');
    this.$.removeUserAjax.body = {};
    if (this.modelType=="groups" && this.groupId) {
      this.$.removeUserAjax.url = "/api/" + this.modelType + "/" + this.groupId + "/" + userId + "/remove_user";
      this.$.removeUserAjax.generateRequest();
    } else if (this.modelType=="communities" && this.communityId) {
      this.$.removeUserAjax.url = "/api/" + this.modelType + "/" + this.communityId + "/" + userId + "/remove_user";
      this.$.removeUserAjax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  },

  _addAdmin: function (event) {
    this.$.addAdminAjax.body = {};
    if (this.modelType=="groups" && this.groupId) {
      this.$.addAdminAjax.url = "/api/" + this.modelType + "/" + this.groupId + "/" + this.addAdminEmail + "/add_admin";
      this.$.addAdminAjax.generateRequest();
    } else if (this.modelType=="communities" && this.communityId) {
      this.$.addAdminAjax.url = "/api/" + this.modelType + "/" + this.communityId + "/" + this.addAdminEmail + "/add_admin";
      this.$.addAdminAjax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  },

  _inviteUser: function (event) {
    this.$.inviteUserAjax.body = {};
    if (this.modelType=="groups" && this.groupId) {
      this.$.inviteUserAjax.url = "/api/" + this.modelType + "/" + this.groupId + "/" + this.inviteUserEmail + "/invite_user";
      this.$.inviteUserAjax.generateRequest();
    } else if (this.modelType=="communities" && this.communityId) {
      this.$.inviteUserAjax.url = "/api/" + this.modelType + "/" + this.communityId + "/" + this.inviteUserEmail + "/invite_user";
      this.$.inviteUserAjax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  },

  _removeAdminResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('users.adminRemoved'));
    this.$.ajax.generateRequest();
  },

  _removeUserResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('users.userRemoved'));
    this.$.ajax.generateRequest();
  },

  _addAdminResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('users.adminAdded')+' '+this.addAdminEmail);
    this.set('addAdminEmail', null);
    this.$.ajax.generateRequest();
  },

  _addOrganizationResponse: function (event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('users.organizationUserAdded')+' '+ detail.response.email);
    this.$.ajax.generateRequest();
  },

  _removeOrganizationResponse: function (event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('users.organizationUserRemoved')+' '+ detail.response.email);
    this.$.ajax.generateRequest();
  },

  _inviteUserResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('users.userInvited')+' '+this.inviteUserEmail);
    this.set('inviteUserEmail', null);
    this.$.ajax.generateRequest();
  },

  _domainIdChanged: function (newGroupId) {
    if (newGroupId) {
      this.set('modelType', 'domains');
      this._generateRequest(newGroupId);
    }
  },

  _groupIdChanged: function (newGroupId) {
    if (newGroupId) {
      this.set('modelType', 'groups');
      this._generateRequest(newGroupId);
    }
  },

  _communityIdChanged: function (newCommunityId) {
    if (newCommunityId) {
      this.set('modelType', 'communities');
      this._generateRequest(newCommunityId);
    }
  },

  _generateRequest: function (id) {
    var adminsOrUsers = this.adminUsers ? "admin_users" : "users";
    this.$.ajax.url = "/api/"+this.modelType+"/"+id+"/"+adminsOrUsers;
    this.$.ajax.generateRequest();
  },

  _usersResponse: function (event, detail) {
    this.set('users', detail.response);
  },

  setup: function (groupId, communityId, domainId, adminUsers) {
    this.set('groupId', null);
    this.set('communityId', null);
    this.set('domainId', null);
    this.set('users', null);
    this.set('adminUsers', adminUsers);

    if (groupId)
      this.set('groupId', groupId);

    if (communityId)
      this.set('communityId', communityId);

    if (domainId)
      this.set('domainId', domainId);

    this._setupHeaderText();
  },

  open: function () {
    this.set('opened', true);
    this.$.dialog.open();
  },

  _setupHeaderText: function () {
    if (this.groupId) {
      if (this.adminUsers) {
        this.set('headerText', this.t('group.admins'));
      } else {
        this.set('headerText', this.t('group.users'));
      }
    } else if (this.communityId) {
      if (this.adminUsers) {
        this.set('headerText', this.t('community.admins'));
      } else {
        this.set('headerText', this.t('community.users'));
      }
    } else if (this.domainId) {
      if (this.adminUsers) {
        this.set('headerText', this.t('domain.admins'));
      } else {
        this.set('headerText', this.t('domain.users'));
      }
    }
  },

  ready2: function () {
    /*
    this.$.grid.columns[5].renderer = this._adminActionRenderer;

    var filterElement = document.createElement('input');
    filterElement.setAttribute('type', 'search');
    filterElement.setAttribute('placeholder', 'Filter...');
    filterElement.style.width = '100%';

    var timer = 0;

    function filter() {
      clearTimeout(timer);
      timer = setTimeout(grid.refreshItems.bind(grid), 500);
    }

    filterElement.addEventListener('keyup', filter);
    filterElement.addEventListener('click', filter);

    this.$.grid.items = function(params, callback) {
      var filterValue = filterElement.value.toLowerCase();
      var data = this.users.filter(function(val) {
        return (val.toString().toLowerCase()).indexOf(filterValue) != -1;
      });
      var slice = data.slice(params.index, params.index + params.count);
      callback(slice, data.length);
    };

    this.$.grid.then(function() {
      this.$.grid.header.getCell(1, 0).content = filterElement;
    }.bind(this));
    */
  },

  _adminActionRenderer: function(cell) {
    cell.element.innerHTML = '';
    var child = document.createElement('progress');
    child.setAttribute('value', cell.data);
    cell.element.appendChild(child);
  },

  _onSelect: function() {
    if (this.$.grid.selection.selected().length === 0) {
      this.selected = null;
    } else {
      this.selected = this.users[this.$.grid.selection.selected()];
    }
  }
});
