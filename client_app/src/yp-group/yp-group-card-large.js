import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/neon-animation/web-animations.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/paper-item/paper-item.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { LargeCardBehaviors } from '../yp-behaviors/yp-large-card-behaviors.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-group-stats.js';
import { GroupBehaviors } from './yp-group-behaviors.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
      }

      .groupAccess {
        padding-bottom: 8px;
      }

      .group-name {
        padding-bottom: 4px;
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      }

      .group-name[admin] {
        padding-right: 16px;
      }

      .objectives {
      }

      .groupCard {
        background-color: #fefefe;
        color: #333;
        height: 243px;
        width: 432px;
        padding: 0 !important;
        margin-top: 0 !important;
      }

      .stats {
        position: absolute;
        bottom: 0px;
        right: 8px;
      }

      .edit {
        color: #FFF;
        position: absolute;
        top: 0;
        left: 384px;
        padding-right: 0;
        margin-right: 0;
      }

      .description-and-stats {
        width: 100%;
      }

      .newCategory {
        color: var( --primary-background-color,#F2F2F2);
        position: absolute;
        top: 64px;
        right: 0;
      }

      iron-image {
        width: 432px;
        height: 243px;
      }

      .description {
        padding: 0;
        margin: 0;
      }

      .groupDescription {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 16px;
        font-size: var(--group-description-font-size, 16px);
      }

      .group-name {
        background-color: var(--primary-color-800, #000);
        color: #fafafa;
        padding-left: 16px;
        padding-top: 16px;
        padding-bottom: 16px;
        padding-right: 32px !important;
        min-height: 28px;
      }

      .textBox {
        margin-left: 32px;
        position: relative;
      }

      @media (max-width: 945px) {
        :host {
          width: 306px;
        }

        .groupCard {
          margin-bottom: 16px;
          width: 306px;
          height: 100%;
        }

        .top-card {
          margin-top: 16px !important;
        }

        .edit {
          left: 265px;
        }

        iron-image {
          width: 306px;
          height: 172px !important;
        }

        .imageCard {
          height: 172px !important;
        }

        .group-name {
          font-size: 20px;
          min-height: 24px;
        }

        .groupDescription {
          padding-top: 6px;
          padding-bottom: 42px;
        }

        .stats {
        }

        .textBox {
          margin-left: 0;
        }
      }

      [hidden] {
        display: none !important;
      }

      a {
        text-decoration: none;
        color: inherit;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout horizontal center-center wrap">
      <paper-material id="cardImage" elevation="3" animated="" class="groupCard imageCard top-card">
        <iron-image class="logo" sizing="cover" preload="" src="[[groupLogoImagePath]]"></iron-image>
      </paper-material>
      <paper-material id="card" elevation="3" animated-shadow="" class="groupCard textBox">
        <div class="layout vertical">
          <div class="layout horizontal wrap">
            <div class="layout vertical description-and-stats">
              <div class="description">
                <div class="group-name" admin\$="[[hasGroupAccess]]">
                  <yp-magic-text id="groupName" text-type="groupName" content-language="[[group.language]]" disable-translation="[[group.configuration.disableNameAutoTranslation]]" text-only="" content="[[groupName]]" content-id="[[group.id]]">
                  </yp-magic-text>
                </div>
                <div hidden="" class="groupAccess">[[groupAccessText]]</div>
                <yp-magic-text id="objectives" class="groupDescription" text-type="groupContent" content-language="[[group.language]]" content="[[group.objectives]]" content-id="[[group.id]]">

                </yp-magic-text>
            </div>
          </div>
          <paper-menu-button class="edit" horizontal-align="[[editMenuAlign]]" hidden\$="[[!showMenuItem]]">
            <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
            <paper-listbox slot="dropdown-content" on-iron-select="_menuSelection">
              <paper-item hidden\$="[[!hasGroupAccess]]" id="editMenuItem">[[t('group.edit')]]</paper-item>
              <paper-item hidden\$="[[!hasGroupAccess]]" id="newCategoryMenuItem">[[t('category.new')]]</paper-item>
              <paper-item hidden\$="[[!hasGroupAccess]]" id="usersMenuItem">[[t('group.users')]]</paper-item>
              <paper-item hidden\$="[[!hasGroupAccess]]" id="adminsMenuItem">[[t('group.admins')]]</paper-item>
              <paper-item hidden\$="[[!hasGroupAccess]]" id="pagesMenuItem">[[t('pages.managePages')]]</paper-item>
              <a hidden\$="[[!hasGroupAccess]]" target="_blank" href="/api/groups/[[group.id]]/export_group"><paper-item id="exportMenuItem">[[t('exportGroup')]]</paper-item></a>
              <paper-item hidden\$="[[!hasGroupAccess]]" id="deleteMenuItem">[[t('group.delete')]]</paper-item>
              <paper-item id="addPostMenuItem">[[t('post.new')]]</paper-item>
            </paper-listbox>
          </paper-menu-button>
        </div>
        <yp-group-stats class="stats" group="[[group]]"></yp-group-stats>
      
    </div>
    <iron-media-query query="(max-width: 800px)" query-matches="{{narrowScreen}}"></iron-media-query>
    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>
  </paper-material></div>
`,

  is: 'yp-group-card-large',

  behaviors: [
    ypLanguageBehavior,
    GroupBehaviors,
    LargeCardBehaviors,
    AccessHelpers,
    ypGotAdminRightsBehavior,
    ypGotoBehavior,
    ypTruncateBehavior,
    ypImageFormatsBehavior
  ],

  properties: {
    group: {
      type: Object,
      observer: '_groupChanged'
    },

    hasGroupAccess: {
      type: Boolean,
      value: false,
      computed: '_hasGroupAccess(group, gotAdminRights)'
    },

    groupAccessText: {
      type: String,
      computed: '_groupAccessText(group, language)'
    },

    showMenuItem: {
      type: Boolean,
      value: false,
      computed: '_showMenuItem(hasGroupAccess, group)'
    }
  },

  _showMenuItem: function (hasGroupAccess, group) {
    return hasGroupAccess || (group && group.configuration && group.configuration.canAddNewPosts===true)
  },

  _hasGroupAccess: function(group, gotAdminRights) {
    if (group && gotAdminRights) {
      return (this.checkGroupAccess(group)!=null);
    } else {
      return false;
    }
  },

  resetGroup: function () {
    this.set('group', null);
  },

  _groupChanged: function (group) {
    if (group && group.objectives && group.objectives.length>220) {
      this.$$("#objectives").style.fontSize = "15px";
    } else {
      this.$$("#objectives").style.fontSize = "16px";
    }
  },

  _groupAccessText: function(group, language) {
    if (group && language) {
      switch (group.access) {
        case 0: // Public
          return this.t("group.public");
          break;
        case 1: // Closed
          return this.t("group.closed");
          break;
        case 2: //Secert
          return this.t("group.secret");
          break;
      }
    } else {
      return "";
    }
  },

  _menuSelection: function (event, detail) {
    if (detail.item.id=="editMenuItem")
      this._openEdit();
    else if (detail.item.id=="newCategoryMenuItem")
      this._openCategoryEdit();
    else if (detail.item.id=="deleteMenuItem")
      this._openDelete();
    else if (detail.item.id=="usersMenuItem")
      this._openUsersDialog();
    else if (detail.item.id=="adminsMenuItem")
      this._openAdminsDialog();
    else if (detail.item.id=="pagesMenuItem")
      this._openPagesDialog();
    else if (detail.item.id=="addPostMenuItem")
      this.fire('yp-post-new');
    this.$$("paper-listbox").select(null);
  },

  _openPagesDialog: function () {
    window.appGlobals.activity('open', 'group.pagesAdmin');
    dom(document).querySelector('yp-app').getDialogAsync("pagesGrid", function (dialog) {
      dialog.setup(this.group.id, null, null, false);
      dialog.open();
    }.bind(this));
  },

  _openUsersDialog: function () {
    window.appGlobals.activity('open', 'group.users');
    dom(document).querySelector('yp-app').getDialogAsync("usersGrid", function (dialog) {
      dialog.setup(this.group.id, null, null, false);
      dialog.open();
    }.bind(this));
  },

  _openAdminsDialog: function () {
    window.appGlobals.activity('open', 'group.admins');
    dom(document).querySelector('yp-app').getDialogAsync("usersGrid", function (dialog) {
      dialog.setup(this.group.id, null, null, true);
      dialog.open();
    }.bind(this));
  },

  _openEdit: function () {
    window.appGlobals.activity('open', 'group.new');
    dom(document).querySelector('yp-app').getDialogAsync("groupEdit", function (dialog) {
      dialog.setup(this.group, false, this._refresh.bind(this));
      dialog.open('edit', {groupId: this.group.id});
    }.bind(this));
  },

  _openDelete: function () {
    window.appGlobals.activity('open', 'group.delete');
    var dialog = dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/groups/' + this.group.id,
        this.t('group.deleteConfirmation'),
        this._onDeleted.bind(this));
      dialog.open();
    }.bind(this));
  },

  _openCategoryEdit: function () {
    window.appGlobals.activity('open', 'category.new');
    dom(document).querySelector('yp-app').getDialogAsync("categoryEdit", function (dialog) {
      dialog.setup(this.group, true, this._refreshCategory.bind(this));
      dialog.open("new", {groupId: this.group.id});
    }.bind(this));
  },

  _refreshCategory: function (category) {
    this.fire("update-group");
  },

  _onDeleted: function () {
    this.dispatchEvent(new CustomEvent('yp-refresh-community', {bubbles: true, composed: true}));
    this.redirectTo("/community/"+this.group.community_id);
  },

  _newCategory: function () {
    this.$$("#newCategory").open('new', { groupId: this.group.id });
  },

  _refresh: function (group) {
    if (group) {
      this.set('group', group);
    }
    this.fire("update-group");
  }
});
