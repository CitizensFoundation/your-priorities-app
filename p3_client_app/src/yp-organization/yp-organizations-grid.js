import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-list/iron-list.js';
import '../../../../@polymer/paper-fab/paper-fab.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import '../../../../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-ajax/yp-ajax.js';
import { WordWrap } from '../yp-behaviors/word-wrap.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      #dialog {
        width: 90%;
        max-height: 90%;
        background-color: #FFF;
      }

      iron-list {
        color: #000;
        height: 500px;
        width: 100%;
      }

      .pageItem {
        padding-right: 16px;
      }

      .id {
        width: 60px;
      }

      .title {
        width: 200px;
      }

      .email {
        width: 240px;
      }

      #editPageLocale {
        width: 80%;
        max-height: 80%;
        background-color: #FFF;
      }

      .locale {
        width: 30px;
        cursor: pointer;
      }

      paper-textarea {
        height: 60%;
      }

      .localeInput {
        width: 26px;
      }

      .pageItem {
        padding-top: 8px;
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
        <iron-list items="[[availableOrganizations]]" as="organization">
          <template>
            <div class="layout horizontal">
              <div class="pageItem id">
                [[organization.name]]
              </div>
              <div class="pageItem title">
                [[_organizationImageUrl(organization)]]
              </div>
              <paper-button data-args\$="[[organization]]" on-tap="_editOrganization">[[t('update')]]</paper-button>
            </div>
          </template>
        </iron-list>

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
            </div>
          </template>
        </iron-list>
      </paper-dialog-scrollable>

      <div class="buttons">
        <paper-button dialog-dismiss="">[[t('close')]]</paper-button>
      </div>
    </paper-dialog>

    <div class="layout horizontal center-center">
      <yp-ajax method="DELETE" id="removeOrganizationAjax" on-response="_removeOrganizationResponse"></yp-ajax>
      <yp-ajax method="POST" id="addOrganizationAjax" on-response="_addOrganizationResponse"></yp-ajax>
    </div>
`,

  is: 'yp-organizations-grid',

  behaviors: [
    ypLanguageBehavior,
    WordWrap,
    ypMediaFormatsBehavior
  ],

  properties: {
    organizations: {
      type: Array,
      notify: true
    },

    availableOrganizations: {
      type: Array
    },

    headerText: {
      type: String
    },

    selected: {
      type: Object
    }

  },

  _newOrganization: function () {
    dom(document).querySelector('yp-app').getDialogAsync("organizationEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {});
    }.bind(this));
  },

  _editOrganization: function (event) {
    var organization = JSON.parse(event.target.getAttribute('data-args'));
    dom(document).querySelector('yp-app').getDialogAsync("organizationEdit", function (dialog) {
      dialog._clear();
      dialog.setup(organization, false, null);
      dialog.open('edit', {organizationId: organization.id});
    }.bind(this));
  },

  _organizationImageUrl: function (organization) {
    if (organization.OrganizationLogoImages) {
      return this.getImageFormatUrl(organization.OrganizationLogoImages, 2);
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

  _addOrganizationResponse: function (event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('users.organizationUserAdded')+' '+ detail.response.email);
    this.$.ajax.generateRequest();
  },

  _removeOrganizationResponse: function (event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('users.organizationUserRemoved')+' '+ detail.response.email);
    this.$.ajax.generateRequest();
  },

  open: function () {
    this.set('availableOrganizations', this._availableOrganizations());
    this.$.dialog.open();
  }
});
