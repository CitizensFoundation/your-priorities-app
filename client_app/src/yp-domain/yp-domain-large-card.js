import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/neon-animation/web-animations.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/neon-animation/web-animations.js';
import '../../../../@polymer/paper-material/paper-material.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { LargeCardBehaviors } from '../yp-behaviors/yp-large-card-behaviors.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-domain-stats.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
      }

      .description {
      }

      .stats {
        position: absolute;
        bottom: 0;
        right: 8px;
      }

      yp-domain-stats {
        color :#fff;
      }

      .domain-name {
        padding: 0;
        padding-bottom: 4px;
        padding-right: 1px;
        margin: 0;
        min-height: 54px;
        font-size: 42px;
        font-weight: bold;
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
        top: 0;
        left: 384px;
        padding-right: 0;
        margin-right: 0;
      }

      h1 {
        font-size: 42px;
      }

      .textBox {
        margin-left: 32px;
        position: relative;
      }

      .description {
        padding: 0;
        margin: 0;
      }

      .domainDescription {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 16px;
      }

      .domain-name {
        background-color: var(--primary-color-800, #000);
        color: #fafafa;
        padding: 12px;
        padding-right: 16px;
        padding-left: 16px;
        vertical-align: middle;
        display: table-cell !important;
        margin: 0;
        width: 432px;
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
          left: 265px;
        }

        iron-image {
          width: 306px;
          height: 172px !important;
        }

        .imageCard {
          height: 172px !important;
        }

        .domain-name {
          font-size: 22px;
          padding-bottom: 12px;
          min-height: 28px;
        }

        .description {
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
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout horizontal wrap">
      <paper-material id="cardImage" elevation="3" animated="" class="large-card imageCard top-card">
        <div class="layout horizontal wrap">
          <iron-image class="image" hidden\$="[[hideImage]]" sizing="cover" src\$="[[_domainLogoImagePath(domain)]]"></iron-image>
        </div>
      </paper-material>
      <paper-material id="card" elevation="4" animated="" class="large-card textBox">
        <div class="layout vertical">
          <div class="layout horizontal wrap">
            <div class="layout vertical description-and-stats">
              <div class="descriptionContainer">
                <div class="domain-name">
                  <yp-magic-text text-type="domainName" content-language="[[domain.language]]" disable-translation="[[domain.configuration.disableNameAutoTranslation]]" text-only="" content="[[domain.name]]" content-id="[[domain.id]]">
                  </yp-magic-text>
                </div>
                <template is="dom-if" if="[[domain.id]]">
                  <yp-magic-text id="description" class="description domainDescription" text-type="domainContent" content-language="[[domain.language]]" content="[[domain.description]]" content-id="[[domain.id]]">
                  </yp-magic-text>
                </template>
              </div>
            </div>
          </div>
          <paper-menu-button vertical-align="top" horizontal-align="[[editMenuAlign]]" class="edit" hidden\$="[[!showMenuItem]]">
            <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
            <paper-listbox slot="dropdown-content" on-iron-select="_menuSelection">
              <paper-item hidden\$="[[!hasDomainAccess]]" id="editMenuItem">[[t('domain.edit')]]</paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="createOrganizationMenuItem">[[t('domain.createOrganization')]]</paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="pagesMenuItem">[[t('pages.managePages')]]</paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="organizationsGridMenuItem">[[t('organizationsAdmin')]]</paper-item>
              <paper-item id="addCommunityMenuItem">[[t('community.add')]]</paper-item>
            </paper-listbox>
          </paper-menu-button>
        </div>
        <yp-domain-stats class="stats" domain="[[domain]]"></yp-domain-stats>
      </paper-material>
    </div>

    <iron-media-query query="(max-width: 945px)" query-matches="{{narrowScreen}}"></iron-media-query>
    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>
`,

  is: 'yp-domain-large-card',

  behaviors: [
    ypLanguageBehavior,
    LargeCardBehaviors,
    AccessHelpers,
    ypGotAdminRightsBehavior,
    ypImageFormatsBehavior,
    ypTruncateBehavior
  ],

  properties: {

    domain: {
      type: Object,
      notify: true,
      value: null
    },

    elevation: {
      type: Number
    },

    hideImage: {
      type: Boolean,
      value: false
    },

    hasDomainAccess: {
      type: Boolean,
      value: false,
      computed: '_hasDomainAccess(domain, gotAdminRights)'
    },

    showMenuItem: {
      type: Boolean,
      value: false,
      computed: '_showMenuItem(hasDomainAccess, domain)'
    }
  },

  _showMenuItem: function (hasDomainAccess, domain) {
    return hasDomainAccess || (domain && !domain.only_admins_can_create_communities)
  },

  _hasDomainAccess: function(domain, gotAdminRights) {
    if (domain && gotAdminRights) {
      if (this.checkDomainAccess(domain)!=null) {
        return true
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  _menuSelection: function (event, detail) {
    if (detail.item.id=="editMenuItem")
      this._openEdit();
    else if (detail.item.id=="createOrganizationMenuItem")
      this._newOrganization();
    else if (detail.item.id=="pagesMenuItem")
      this._openPagesDialog();
    else if (detail.item.id=="organizationsGridMenuItem")
      this._openOrganizationsGrid();
    else if (detail.item.id=="addCommunityMenuItem")
      this.fire('yp-new-community');
    this.$$("paper-listbox").select(null);
  },

  _openOrganizationsGrid: function () {
    window.appGlobals.activity('open', 'domain.organizationsGrid');
    dom(document).querySelector('yp-app').getDialogAsync("organizationsGrid", function (dialog) {
      dialog.open();
    }.bind(this));
  },

  _openPagesDialog: function () {
    window.appGlobals.activity('open', 'domain.pagesAdmin');
    dom(document).querySelector('yp-app').getDialogAsync("pagesGrid", function (dialog) {
      dialog.setup(null, null, this.domain.id, false);
      dialog.open();
    }.bind(this));
  },

  _openEdit: function () {
    window.appGlobals.activity('open', 'domainEdit');
    dom(document).querySelector('yp-app').getDialogAsync("domainEdit", function (dialog) {
      dialog.setup(this.domain, false, this._refresh.bind(this));
      dialog.open('edit', {domainId: this.domain.id});
    }.bind(this));
  },

  _newOrganization: function () {
    window.appGlobals.activity('open', 'organizationEdit');
    dom(document).querySelector('yp-app').getDialogAsync("organizationEdit", function (dialog) {
      dialog.setup(null, true, this._refresh.bind(this));
      dialog.open('new', {domainId: this.domain.id});
    }.bind(this));
  },

  _refresh: function (domain) {
    if (domain) {
      this.set('domain', domain);
    }
    this.fire("update-domain");
  },

  _domainName: function (domain) {
    if (domain && domain.name) {
      return this.truncate(this.trim(domain.name), 200);
    } else if (domain) {
      return domain.short_name;
    }
  },

  _domainLogoImagePath: function (domain) {
    if (domain) {
      return this.getImageFormatUrl(domain.DomainLogoImages, 0);
    }
  },

  _domainHeaderImagePath: function (domain) {
    if (domain) {
      return this.getImageFormatUrl(domain.DomainHeaderImages, 0);
    }
  }
});
