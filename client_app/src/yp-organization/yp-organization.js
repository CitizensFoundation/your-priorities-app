import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-tabs/paper-tab.js';
import '../../../../@polymer/paper-tabs/paper-tabs.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import '../yp-post/yp-post-map.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-page/yp-page.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import './yp-organization-large-card.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .card-container {
        @apply --layout-horizontal;
        @apply --layout-wrap;
        width: 100%;
      }

      .card {
        padding: 16px;
      }

      yp-ajax {
        background-color: var(--primary-background-color);
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-page id="page" create-fab-icon="group" create-fab-title="[[t('group.add')]]" on-yp-create-fab-tap="_newGroup">

      <yp-organization-large-card id="organizationCard" slot="largeCard" class="largeCard card" organization="[[organization]]" on-update-organization="_refresh"></yp-organization-large-card>

      <paper-tabs id="paper_tabs" slot="tabs" class="tabs" selected="{{selected}}" focused="">
        <paper-tab class="tab"><span>[[t('groups')]]</span> &nbsp; (<span>[[groups.length]]</span>)</paper-tab>
        <paper-tab class="tab">[[t('news')]]</paper-tab>
        <paper-tab class="tab">[[t('posts.map')]]</paper-tab>
      </paper-tabs>

      <iron-pages class="tabPages" slot="tabPages" selected="{{selected}}" entry-animation="fade-in-animation" exit-animation="fade-out-animation">
        <section>
          <div class="layout horizontal center-center wrap">
          </div>
        </section>
        <section>
          <template is="dom-if" if="[[mapActive]]" restamp="">
            <yp-post-map organization-id="[[organization.id]]"></yp-post-map>
          </template>
        </section>
      </iron-pages>
    </yp-page>

    <yp-ajax id="ajax" url="/api/organizations" on-response="_response"></yp-ajax>
`,

  is: 'yp-organization',

  behaviors: [
    ypLanguageBehavior,
    ypThemeBehavior,
    ypGotoBehavior,
    ypImageFormatsBehavior
  ],

  properties: {
    groups: {
      type: Array
    },

    organizationId: {
      type: Number,
      value: null,
      observer: "_organizationIdChanged"
    },

    organization: {
      type: Object
    },

    organizationEmpty: {
      type: Boolean,
      value: false
    },

    hideAdd: {
      type: Boolean,
      value: true
    },

    selected: {
      type: Number,
      value: 0,
      observer: '_selectedChanged'
    },

    tabName: {
      type: String,
      value: null,
      observer: '_tabNameChanged'
    },

    mapActive: {
      type: Boolean,
      value: false
    }
  },

  _tabNameChanged: function (newValue) {
    if (newValue) {
      if (newValue=='groups') {
        this.set('selected', 0);
      } else if (newValue=='news') {
        this.set('selected', 1);
      } else if (newValue=='map') {
        this.set('selected', 2);
      }
    }
  },

  _selectedChanged: function (newValue) {
    if (this.organization) {
      if (newValue == 0) {
        this.redirectTo("/organization/" + this.organization.id + '/groups');
      } else if (newValue == 1) {
        this.redirectTo("/organization/" + this.organization.id + '/news');
      } else if (newValue == 2) {
        this.redirectTo("/organization/" + this.organization.id + '/map');
      }
    }
  },

  _hideEdit: function () {
    if (!this.organization)
      return true;

    if (!window.appUser.loggedIn())
      return true;

    return (window.appUser.user.id!=this.organization.user_id);
  },

  _organizationHeaderUrl: function (organization) {
    return this.getImageFormatUrl(organization.OrganizationHeaderImages, 2);
  },

  _organizationIdChanged: function (newValue, oldValue) {
    if (newValue) {
      this.set("organization", null);
      this.set("groups", null);
      this.$$('#ajax').url = '/api/organizations/' + this.organizationId;
      this.$$('#ajax').generateRequest();
      this.hideAdd = true;
    }
  },

  _newGroup: function () {
    window.appGlobals.activity('open', 'newGroup');
    dom(document).querySelector('yp-app').getDialogAsync("groupEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {organizationId: this.organizationId});
    }.bind(this));
  },

  _response: function (event, detail, sender) {
    this.set('organization', detail.response);
    if (this.organization.OrganizationHeaderImages && this.organization.OrganizationHeaderImages.length>0) {
      this.$.page.setupTopHeaderImage(this.organization.OrganizationHeaderImages);
    }

    var randomTheme = Math.floor(Math.random() * 3) + 1;
    //this.setTheme(randomTheme-1);

    var url = this._organizationHeaderUrl(this.organization);
    //headerPanel.style.background = "#f5f5f5 url('"+url+"') no-repeat center top";
    this.set("groups", this.organization.Groups);
    this.async(function() {
      var organizationCard = this.$$('#organizationCard');
      if (organizationCard) {
        organizationCard.setElevation(5);
        organizationCard.lowerCardLater();
      }
    },20);
    if (detail.response.Groups.length===0)
      this.organizationEmpty = true;
    else
      this.organizationEmpty = false;
    this.fire("change-header", { headerTitle: this.organization.Domain.name,
                                 headerDescription: this.organization.Domain.description,
                                 headerIcon: "group-work",
                                 backPath: "/domain/" + this.organization.domain_id });
    if (this.groups.length>0) {
      this.hideAdd = true;
    } else {
      this.hideAdd = false;
    }
  },

  defaultGroupFirst: function (items) {
    var filtered = [];
    var defaultGroup = null;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.short_name != 'default') {
        filtered.push(item);
      } else {
        defaultGroup = item;
      }
    }
    filtered.unshift(defaultGroup);
    return filtered;
  },

  noTestGroup: function (items) {
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.short_name != 'test' && item.short_name != 'ac-posts' && item.short_name != 'development' && item.short_name.indexOf('2012') == -1 && item.short_name.indexOf('2013') == -1) {
        filtered.push(item);
      }
    }
    return filtered;
  },

  _refresh: function () {
    this.$$('#ajax').generateRequest();
  },

  ready: function () {
  }
});
