import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/paper-material/paper-material.js';
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
import '../yp-magic-text/yp-magic-text.js';
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
      }

      .stats {
        position: absolute;
        bottom: 0;
        right: 8px;
      }

      .community-name {
        padding: 0;
        padding-bottom: 4px;
        padding-right: 1px;
        margin: 0;
        font-size: 24px;
        font-weight: 700;

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
        width: 432px;
        height: 243px;
      }

      .description-and-stats {
        width: 100%;
      }

      .edit {
        color: #FFF;
        position: absolute;
        top: 0px;
        left: 390px;
        padding-right: 0;
        margin-right: 0;
      }

      .contentContainer {
        @apply --layout-horizontal;
      }

      .description-and-stats {
        padding-bottom: 32px;
      }


      .description {
        padding: 0;
        margin: 0;
      }

      .communityDescription {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 16px;
      }

      .community-name {
        background-color: var(--primary-color-800, #000);
        color: #fafafa;
        padding-left: 16px;
        padding-top: 16px;
        padding-bottom: 16px;
        min-height: 31px;
      }

      .textBox {
        margin-left: 32px;
        position: relative;
      }

      #welcomeHTML {
        width: 432px;
        max-width: 432px;
        overflow: hidden;
      }

      .k2017Image {
        height: 72px;
      }

      .k2017FeaturedImage {
        height: 85px;
      }

      .k2017extraMargin {
        margin-right: 68px;
        margin-left: 45px;
      }

      .k2017topPadding {
        padding: 8px;
      }

      .k2017topPadding a:link { color: #333 }
      .k2017topPadding a:visited { color: #333 }

      .k2017showOnlyMobile {
        display: none;
      }

      @media (max-width: 945px) {
        :host {
          width: 306px;
        }

        .k2017Image {
          height: 42px;
        }

        .k2017FeaturedImage {
          height: 55px;
        }

        .k2017extraMargin {
          margin-right: 52px;
          margin-left: 32px;
        }

        .k2017topPadding {
          padding-top: 4px;
        }

        .k2017hiddenMobile  {
          display: none;
        }

        .k2017showOnlyMobile {
          display: inline;
        }

        #welcomeHTML {
          width: 306px;
          max-width: 306px;
        }

        .large-card {
          width: 306px;
          height: 100%;
        }

        .top-card {
          margin-bottom: 16px;
        }

        .edit {
          left: 265px;
        }

        iron-image {
          width: 306px;
          height: 172px !important;
        }

        .image {
          width: 306px;
          height: 172px !important;
        }

        .imageCard {
          height: 172px !important;
        }

        .community-name {
          font-size: 20px;
          min-height: 26px;
        }

        .communityDescription {
          padding-top: 6px;
          padding-bottom: 4px;
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
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout horizontal wrap">
      <paper-material id="cardImage" elevation="3" animated="" class="large-card imageCard top-card">
        <div id="welcomeHTML" hidden\$="[[!community.configuration.welcomeHTML]]" class="layout vertical center-center">
        </div>
        <div hidden\$="[[community.configuration.welcomeHTML]]">
          <iron-image class="image" sizing="cover" src\$="[[communityLogoImagePath]]"></iron-image>
        </div>
      </paper-material>
      <paper-material id="card" elevation="3" animated="" class="large-card textBox">
        <div class="layout vertical">
          <div class="layout horizontal wrap">
            <div class="layout vertical description-and-stats">
              <div class="description">
                <div class="community-name">
                  <yp-magic-text text-type="communityName" content-language="[[community.language]]" disable-translation="[[community.configuration.disableNameAutoTranslation]]" text-only="" content="[[communityNameFull]]" content-id="[[community.id]]">
                  </yp-magic-text>
                </div>
                <div hidden="" class="communityAccess">[[_communityAccessText(community.access)]]</div>
                <yp-magic-text id="description" class="communityDescription" text-type="communityContent" content-language="[[community.language]]" content="[[community.description]]" content-id="[[community.id]]">
                </yp-magic-text>
              </div>
            </div>
          </div>
          <paper-menu-button class="edit" vertical-align="top" horizontal-align="[[editMenuAlign]]" hidden\$="[[!showMenuItem]]">
            <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
            <paper-listbox slot="dropdown-content" on-iron-select="_menuSelection">
              <paper-item hidden\$="[[!hasCommunityAccess]]" id="editMenuItem">[[t('community.edit')]]</paper-item>
              <paper-item hidden\$="[[!hasCommunityAccess]]" id="usersMenuItem">[[t('community.users')]]</paper-item>
              <paper-item hidden\$="[[!hasCommunityAccess]]" id="adminsMenuItem">[[t('community.admins')]]</paper-item>
              <paper-item hidden\$="[[!hasCommunityAccess]]" id="deleteMenuItem">[[t('community.delete')]]</paper-item>
              <paper-item hidden\$="[[!hasCommunityAccess]]" id="pagesMenuItem">[[t('pages.managePages')]]</paper-item>
              <paper-item hidden\$="[[!hasCommunityAccess]]" id="bulkStatusUpdateMenuItem">[[t('bulkStatusUpdate')]]</paper-item>
              <paper-item id="addGroupMenuItem">[[t('group.new')]]</paper-item>
            </paper-listbox>
          </paper-menu-button>
        </div>
        <yp-community-stats class="stats" community="[[community]]"></yp-community-stats>
      </paper-material>
    </div>
    <iron-media-query query="(max-width: 800px)" query-matches="{{narrowScreen}}"></iron-media-query>
    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>
`,

  is: 'yp-community-large-card',

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
    },

    showMenuItem: {
      type: Boolean,
      value: false,
      computed: '_showMenuItem(hasCommunityAccess, community)'
    }
  },

  _showMenuItem: function (hasCommunityAccess, community) {
    return hasCommunityAccess || (community && !community.only_admins_can_create_groups)
  },

  _communityChanged: function (community) {
    if (community && community.description) {
      this.async(function () {
        if (community.configuration && community.configuration.welcomeHTML &&
          community.configuration.welcomeHTML !== "" &&
          this.$$("#welcomeHTML")) {
            var div = document.createElement('div');
            div.innerHTML = community.configuration.welcomeHTML;
            this.$$("#welcomeHTML").innerHTML = "";
            dom(this.$$("#welcomeHTML")).appendChild(div);
        } else if (this.$$("#welcomeHTML")) {
         this.$$("#welcomeHTML").innerHTML = "";
        }
      });
      if (community.description.length>220 && community.name && community.name.length>30) {
        this.$$("#description").style.fontSize = "15px";
      } else {
        this.$$("#description").style.fontSize = "16px";
      }
    }
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
    else if (detail.item.id=="bulkStatusUpdateMenuItem")
      this._openBulkStatusUpdates();
    else if (detail.item.id=="addGroupMenuItem")
      this.fire('yp-new-group');
    this.$$("paper-listbox").select(null);
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

    this.async(function () {
      dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateGrid", function (dialog) {
        dialog.open(this.community.id);
      }.bind(this));
    });
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
    this.dispatchEvent(new CustomEvent('yp-refresh-domain', {bubbles: true, composed: true}));
  },

  _refresh: function (community) {
    if (community) {
      this.set('community', community);
    }
    this.fire("update-community");
  }
});
