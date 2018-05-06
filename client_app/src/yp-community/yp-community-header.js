import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { LargeCardBehaviors } from '../yp-behaviors/yp-large-card-behaviors.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import { CommunityBehaviors } from './yp-community-behaviors.js';
import './yp-community-stats.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
      }

      .communityAccess {
        padding-bottom: 8px;
      }

      .description {
        line-height: var(--description-line-height, 1.3);
        background-color: rgba(250,250,250,0.0);
        color: #111;
        font-size: 18px;
        text-align: center;
        max-width: 750px;
        padding-left: 16px;
        padding-right: 16px;
      }

      .stats {
        background-color: rgba(250,250,250,0.0);
        --main-stats-color-on-white: #000;
      }


      iron-image {
        width: 432px;
        height: 243px;
      }

      .large-card {
        background-color: #fefefe;
        color: #333;
        height: 243px;
        width: 432px;
        padding: 0 !important;
        margin-top: 0 !important;
      }

      .image {
        width: 100px;
        height: 100px;
        margin-top: 8px;
      }

      .edit {
        color: #FFF;
        padding-right: 0;
        margin-right: 0;
      }

      .contentContainer {
        @apply --layout-horizontal;
      }

      .textBox {
        margin-right: 32px;
      }

      .community-name {
        background-color: rgba(250,250,250,0.0);
        color: #222;
        font-weight: bold;
        font-size: 58px;
        padding-top: 8px;
        padding-left: 16px;
        padding-right: 16px;
      }

      .nameBorder {
        border-bottom: 2px solid;
        margin-bottom: 8px;
        margin-top: 8px;
        margin-left: 180px;
        margin-right: 180px;
      }

      @media (max-width: 945px) {
        :host {
          width: 306px;
        }

        .large-card {
          width: 306px;
          height: 100%;
        }

        .top-card {
          margin-bottom: 16px;
        }

        .edit {
        }

        .community-name {
          font-size: 28px;
          text-align: center;
          padding-top: 4px;
          padding-bottom: 4px;
        }

        .description {
          font-size: 17px;
        }

        .communityDescription {
          padding-top: 6px;
          padding-bottom: 4px;
        }

        .stats {
        }

        .textBox {
          margin-right: 0;
        }
      }

      .rounded-even-more {
        -webkit-border-radius: 90px;
        -moz-border-radius: 90px;
        border-radius: 90px;
        display: block;
        vertical-align: top;
        align: center;
        -webkit-transform-style: preserve-3d;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <template is="dom-if" if="[[community]]">
        <div class="layout vertical center-center">
          <iron-image class="image rounded-even-more" sizing="cover" src\$="[[communityLogoImagePath]]"></iron-image>
          <div class="community-name rounded-even-more">
            [[communityNameFull]]
          </div>
          <div class="layout horizontal center-center">
            <yp-community-stats class="stats" community="[[community]]"></yp-community-stats>
          </div>
          <div class="description layout horizontal center-center rounded-even-more ">
            <div id="description" class="communityDescription">
            </div>
            <div>
              <paper-menu-button class="edit" vertical-align="top" horizontal-align="[[editMenuAlign]]" hidden\$="[[!hasCommunityAccess]]">
                <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
                <paper-listbox slot="dropdown-content" on-iron-select="_menuSelection" selected="{{selectedMenuItem}}">
                  <paper-item id="editMenuItem">[[t('community.edit')]]</paper-item>
                  <paper-item id="usersMenuItem">[[t('community.users')]]</paper-item>
                  <paper-item id="adminsMenuItem">[[t('community.admins')]]</paper-item>
                  <paper-item id="deleteMenuItem">[[t('community.delete')]]</paper-item>
                  <paper-item id="pagesMenuItem">[[t('pages.managePages')]]</paper-item>
                  <paper-item id="bulkStatusUpdateMenuItem">[[t('bulkStatusUpdate')]]</paper-item>
                </paper-listbox>
              </paper-menu-button>
            </div>
          </div>
        </div>
    </template>
    <iron-media-query query="(max-width: 800px)" query-matches="{{narrowScreen}}"></iron-media-query>
    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>
`,

  is: 'yp-community-header',

  behaviors: [
    ypLanguageBehavior,
    CommunityBehaviors,
    LargeCardBehaviors,
    AccessHelpers,
    ypGotAdminRightsBehavior,
    ypGotoBehavior,
    ypTruncateBehavior,
    ypImageFormatsBehavior
  ],

  properties: {
    community: {
      type: Object,
      observer: '_communityChanged'
    },

    hasCommunityAccess: {
      type: Boolean,
      value: false,
      computed: '_hasCommunityAccess(community, gotAdminRights)'
    }
  },

  _communityChanged: function (community) {
  },

  _hasCommunityAccess: function(community, gotAdminRights) {
    if (community && gotAdminRights) {
      if (this.checkCommunityAccess(community)!=null) {
        return true
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  _communityAccessText: function(access) {
    switch (access) {
      case 0:
        return this.t("community.public");
        break;
      case 1:
        return this.t("community.closed");
        break;
      case 2:
        return this.t("community.secret");
        break;
    }
  },

  _menuSelection: function (event, detail) {
    if (detail.item.id=="editMenuItem")
      this._openEdit();
    else if (detail.item.id=="deleteMenuItem")
      this._openDelete();
    else if (detail.item.id=="usersMenuItem")
      this._openUsersDialog();
    else if (detail.item.id=="adminsMenuItem")
      this._openAdminsDialog();
    else if (detail.item.id=="pagesMenuItem")
      this._openPagesDialog();
    else if (detail.item.id="bulkStatusUpdateMenuItem")
      this._openBulkStatusUpdates();
    this.set('selectedMenuItem', null);
  },

  _openBulkStatusUpdates: function () {
    window.appGlobals.activity('open', 'community.bulkStatusUpdates');
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'open-bulk-status-updates', data: null }
      })
    );

    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateGrid", function (dialog) {
      dialog.open(this.community.id);
    }.bind(this));
  },

  _openUsersDialog: function () {
    window.appGlobals.activity('open', 'community.users');
    dom(document).querySelector('yp-app').getDialogAsync("usersGrid", function (dialog) {
      dialog.setup(null, this.community.id, null, false);
      dialog.open();
    }.bind(this));
  },

  _openAdminsDialog: function () {
    window.appGlobals.activity('open', 'community.admins');
    dom(document).querySelector('yp-app').getDialogAsync("usersGrid", function (dialog) {
      dialog.setup(null, this.community.id, null, true);
      dialog.open();
    }.bind(this));
  },

  _openPagesDialog: function () {
    window.appGlobals.activity('open', 'community.pagesAdmin');
    dom(document).querySelector('yp-app').getDialogAsync("pagesGrid", function (dialog) {
      dialog.setup(null, this.community.id, null, false);
      dialog.open();
    }.bind(this));
  },

  _openDelete: function () {
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/communities/' + this.community.id,
        this.t('community.deleteConfirmation'),
        this._onDeleted.bind(this));
      dialog.open();
    }.bind(this));
  },

  _openEdit: function () {
    dom(document).querySelector('yp-app').getDialogAsync("communityEdit", function (dialog) {
      dialog.setup(this.community, false, this._refresh.bind(this));
      dialog.open('edit', {communityId: this.community.id});
    }.bind(this));
  },

  _onDeleted: function () {
    this.redirectTo("/domain/"+this.community.domain_id);
  },

  _refresh: function (community) {
    if (community) {
      this.set('community', community);
    }
    this.fire("update-community");
  }
});
