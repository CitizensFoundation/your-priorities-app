import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-tabs/paper-tab.js';
import { CollectionHelpers } from '../yp-behaviors/collection-helpers.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../ac-activities/ac-activities.js';
import '../yp-ajax/yp-ajax.js';
import { GroupCollectionBehaviors } from '../yp-group/yp-group-collection-behaviors.js';
import { CommunityCollectionBehaviors } from '../yp-community/yp-community-collection-behaviors.js';
import './yp-user-large-card.js';
import '../yp-bulk-status-update/yp-bulk-status-display.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpUserLit extends YpBaseElement {
  static get properties() {
    return {
      idRoute: {
        type: Object
      },

      tabRoute: Object,
      statusUpdateRoute: Object,
      idRouteData: Object,
      tabRouteData: Object,
      statusUpdateRouteData: Object,

      userId: {
        type: Number,
        value: null,
        observer: "_userIdChanged"
      },

      url: {
        type: String
      },

      domainEmpty: {
        type: Boolean,
        value: false
      },

      selectedTab: {
        type: String,
        value: null
      },

      user: {
        type: Object
      },

      statusUpdateId: String,

      selected: {
        type: Number,
        value: 0,
        observer: '_selectedChanged'
      },

      userTabName: {
        type: String,
        value: null,
        observer: '_tabNameChanged'
      }
    }
  }

  static get styles() {
    return [
      css`

      ac-activities {

      }

      .card-container {

      }

      @media (max-width: 330px) {
        .card {
          padding-left: 0;
          padding-right: 0;
          padding-bottom: 8px;
          padding-top: 8px;
        }

        .card-container {
          padding: 0;
          margin: 0;
        }
      }

      yp-ajax {
        background-color: var(--primary-background-color);
      }

      .twitterFeed {
        margin-top: 24px;
      }

      .archivedText {
        font-size: 26px;
        color: #333;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <app-route route="${this.idRoute}" .pattern="/:id" .data="${this.idRouteData}" .tail="${this.tabRoute}">
    </app-route>

    <app-route route="${this.tabRoute}" .pattern="/:tabName" .data="${this.tabRouteData}" .tail="${statusUpdateRoute}">
    </app-route>

    <app-route route="${this.statusUpdateRoute}" .pattern="/:statusUpdateId" .data="${this.statusUpdateRouteData}">
    </app-route>

    <yp-user-large-card ?hidden="" id="userCard" .class="largeCard card" .user="${this.user}" @update-domain="${this._refresh}"></yp-user-large-card>

    <paper-tabs ?hidden="" id="paper_tabs" class="tabs" .selected="${this.selected}" focused="">
      <paper-tab class="tab">${this.t('news')}</paper-tab>
      <paper-tab class="tab"><span>${this.t('communities')}</span> &nbsp; (<span>${this.communitiesLength}</span>)</paper-tab>
      <paper-tab class="tab"><span>${this.t('groups')}</span> &nbsp; (<span>${this.groupsLength}</span>)</paper-tab>
      <paper-tab class="tab">
        <div class="layout vertical center-center tabCounterContainer">
          <span>${this.t('posts.posts')}</span><div class="counterInfo" id="tabCount"></div>
        </div>
      </paper-tab>
    </paper-tabs>

    <iron-pages class="tabPages" .selected="${this.selectedTab}" .attrForSelected="name" .entryAnimation="fade-in-animation" .exitAnimation="fade-out-animation">
      <section .name="status_updates">
        <yp-bulk-status-display user-id="${this.userId}" .statusUpdateId="${this.statusUpdateId}"></yp-bulk-status-display>
      </section>
      <section name="status_updates_templates">
        <yp-bulk-status-display .by-template user-id="${this.userId}" .statusUpdateId="${this.statusUpdateId}"></yp-bulk-status-display>
      </section>
      <section>
        <ac-activities .selectedTab="${this.selectedTab}" .userId="${this.user.id}"></ac-activities>
      </section>
      <section>
        <template>
          <div class="layout horizontal center-center">
            <yp-post-list id="postList" .selectedTab="${this.selected}" .status-filter="open" .tabCounterId="tabCount" .searchingFor="${this.searchingFor}" .group="${this.group}" .groupId="${this.groupId}"></yp-post-list>
          </div>

        </template>
      </section>
    </iron-pages>

    <yp-ajax id="ajax" url="${this.url}" @response="${this._response}"></yp-ajax>
    <yp-ajax id="pagesAjax" @response="${this._pagesResponse}"></yp-ajax>
    `
  }

/*
  behaviors: [
    ypThemeBehavior,
    CollectionHelpers,
    CommunityCollectionBehaviors,
    GroupCollectionBehaviors,
    ypGotoBehavior
  ],

  observers: [
    '_routeIdChanged(idRouteData.id)',
    '_routeTabChanged(tabRouteData.tabName)',
    '_routeStatusUpdateChanged(statusUpdateRouteData.statusUpdateId)'
  ],
*/

  _routeIdChanged(newId) {
    if (newId) {
      this.userId = newId;
    }
  }

  _routeTabChanged(newTabName) {
    if (newTabName) {
      this.selectedTab = newTabName;
    } else if (newTabName && this._isNumber(newTabName)) {
      this.scrollToPointId = newTabName;
      this.selectedTab = 'debate';
    }
  }

  _routeStatusUpdateChanged(statusUpdateId) {
    if (statusUpdateId) {
      this.statusUpdateId = statusUpdateId;
    }
  }

  _tabNameChanged(newValue) {
    if (newValue) {
      if (newValue=='communities') {
        this.selected = 0;
      } else if (newValue=='news') {
        this.selected = 1;
      } else if (newValue=='other_social_media') {
        this.selected = 2;
      }
    }
  }

  _selectedChanged(newValue) {
    if (this.user) {
      if (newValue == 0) {
        this.redirectTo("/user/" + this.user.id + '/news');
      } else if (newValue == 1) {
        this.redirectTo("/user/" + this.user.id + '/communities');
      } else if (newValue == 2) {
        this.redirectTo("/user/" + this.user.id + '/groups');
      } else if (newValue == 3) {
        this.redirectTo("/user/" + this.user.id + '/posts');
      }
    }
  }

  _userIdChanged(newValue, oldValue) {
    if (newValue) {
      this.featuredCommunities = null;
      this.activeCommunities = null;
      this.archivedCommunities = null;
      this.featuredGroups = null;
      this.activeGroups = null;
      this.archivedGroups = null;
      this.$$("#ajax").url = '/api/users/' + this.userId;
      this.$$("#ajax").generateRequest();
    }
  }

  _refresh() {
    this.$$("#ajax").generateRequest();
  }

  _response(event, detail, sender) {
    this.user = detail.response;
    if (this.user) {
      if (this.user.theme_id!=null) {
        this.setTheme(this.user.theme_id);
      }

      if (this.user.UserHeaderImages && this.user.UserHeaderImages.length>0) {
        this.$$("#page").setupTopHeaderImage(this.user.UserHeaderImages);
      }
      this.setupCommunities(this.user.CommunityUsers);
      this.setupGroups(this.user.GroupUsers);

      //   this.$.userCard.setElevation(5);
      //   this.$.userCard.lowerCardLater();

      this.fire("change-header", { historyBack: true });
      window.appGlobals.setAnonymousGroupStatus(null);
      window.appGlobals.disableFacebookLoginForGroup = false;
    }
  }
}

window.customElements.define('yp-user-lit', YpUserLit)