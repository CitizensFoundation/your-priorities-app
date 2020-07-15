import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-tabs/paper-tab.js';
import { CollectionHelpers } from '../yp-behaviors/collection-helpers.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { YpNewsTabSelected } from '../yp-behaviors/yp-news-tab-selected.js';
import { ypDetectOldiOs } from '../yp-behaviors/yp-detect-old-ios.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { CommunityCollectionBehaviors } from '../yp-community/yp-community-collection-behaviors.js';
import '../ac-activities/ac-activities.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-page/yp-page.js';
import '../yp-community/yp-community-grid.js';
import './yp-domain-large-card.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpDomainLit extends YpBaseElement {
  static get properties() {
    return {
      idRoute: Object,
      tabRoute: Object,
      idRouteData: Object,
      tabRouteData: Object,

      createFabIcon: {
        type: String,
        value: null,
        notify: true
      },

      domainId: {
        type: Number,
        value: null,
        observer: "_domainIdChanged"
      },

      url: {
        type: String
      },

      domainEmpty: {
        type: Boolean,
        value: false
      },

      domain: {
        type: Object
      },

      selectedTab: {
        type: String,
        value: 'communities',
        observer: '_selectedTabChanged'
      },

      otherSocialMediaActive: {
        type: Boolean,
        value: false
      },

      isOldiOs: {
        type: Boolean,
        computed: '_isOldiOs(domainId)'
      },

      disableRefreshOnce: {
        type: Boolean,
        value: false
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

      .card {
        padding: 16px;
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

      .ypBottomContainer {

      }

      :host {
        display: block;
      }

      .minHeightSection {
        min-height: 450px;
      }

      #paper_tabs[apple] {
        margin-top: 42px;
        margin-bottom: 8px;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFLexLayout]
  }

  render() {
    return html`
      ${this.group ? html`
        <yp-page id="page" .createFabIcon="${this.createFabIcon}" createFabTitle="${this.t('community.add')}" @yp-create-fab-tap="${this._newCommunity}">

          <yp-domain-large-card id="domainCard" slot="largeCard" class="largeCard card" .domain="${this.domain}" @update-domain="${this._refreshAjax}"></yp-domain-large-card>

          <paper-tabs id="paper_tabs" .apple="${this.isOldiOs}" slot="tabs" class="tabs" .selected="${this.selectedTab}" attr-for-selected="name" .focused>
            <paper-tab .name="communities" class="tab"><span>${this.t('communities')}</span> &nbsp; (<span>${this.communitiesLength}</span>)</paper-tab>
            <paper-tab .name="news" class="tab" ?hidden="${this.domain.configuration.hideDomainNews}">${this.t('news')}</paper-tab>
          </paper-tabs>

          <iron-pages class="tabPages" fullbleed slot="tabPages" .selected="${this.selectedTab}" .attrForSelected="name" .entryAnimation="fade-in-animation" .exitAnimation="fade-out-animation">
            <section .name="communities" class="layout vertical">
              <div class="card-container layout center-center wrap layout-horizontal ">
                <yp-community-grid id="communityGrid" featured-communities="${this.featuredCommunities}" active-communities="${this.activeCommunities}" .archivedCommunities="${this.archivedCommunities}" .hideAdd="${!this.createFabIcon}" @add-new-community="${this._newCommunity}">
                </yp-community-grid>
              </div>
            </section>
            <section .name="news" class="minHeightSection">

              ${ this.newsTabSelected ? html`
                <ac-activities id="domainNews" .selectedTab="${this.selectedTab}" .domainId="${this.domain.id}"></ac-activities>
              ` : html``}
            </section>
          </iron-pages>
        </yp-page>

    <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>
    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>

    <app-route .route="${this.idRoute}" .pattern="/:id" data="${this.idRouteData}" .tail="${this.tabRoute}">
    </app-route>

    <app-route .route="${this.tabRoute}" .pattern="/:tabName" data="${this.tabRouteData}">
    </app-route>

    <div class="ypBottomContainer layout-horizontal layout-center-center">
      <yp-ajax id="ajax" url="${this.url}" @response="${this._response}"></yp-ajax>
      <yp-ajax id="pagesAjax"1 @response="${this._pagesResponse}"></yp-ajax>
    </div>
  ` : html``}
  `
  }

/*
  behaviors: [
    ypThemeBehavior,
    CommunityCollectionBehaviors,
    CollectionHelpers,
    AccessHelpers,
    YpNewsTabSelected,
    ypLoggedInUserBehavior,
    ypDetectOldiOs,
    ypGotoBehavior
  ],



  observers: [
    '_routeIdChanged(idRouteData.id)',
    '_routeTabChanged(tabRouteData.tabName)'
  ],

  listeners: {
    'yp-new-community': '_newCommunity',
    'yp-new-community-folder': '_newCommunityFolder'
  },
*/

  scrollToCommunityItem() {
    if (this.selectedTab==="news" && window.appGlobals.cachedActivityItem!==null) {
      const list = this.$$("#domainNews");
      if (list) {
        list.scrollToItem(window.appGlobals.cachedActivityItem);
        window.appGlobals.cachedActivityItem = null;
      } else {
        console.warn("No domain activities for scroll to item");
      }
    } else if (this.selectedTab==="communities") {
      if (window.appGlobals.backToDomainCommunityItems &&
        window.appGlobals.backToDomainCommunityItems[this.domain.id]) {
        this.$$("#communityGrid").scrollToItem(window.appGlobals.backToDomainCommunityItems[this.domain.id]);
        window.appGlobals.backToDomainCommunityItems[this.domain.id] = null;
      }
    }
  }

  _userLoggedIn(user) {
    if (user) {
      if (this.domain && window.location.href.indexOf("/domain/") > -1) {
        this.$$("#ajax").generateRequest();
      }
    }
  }

  _routeIdChanged(newId) {
    if (newId) {
      this.set('domainId', newId);
    }
  }

  _routeTabChanged(newTabName) {
    if (newTabName) {
      this.set('selectedTab', newTabName);
    }
  }

  _selectedTabChanged(tabName) {
    if (tabName=='other_social_media') {
      this.set('otherSocialMediaActive', true);
    } else {
      this.set('otherSocialMediaActive', false);
    }

    if (this.domain) {
      this.redirectTo("/domain/" + this.domain.id + '/' + tabName);
    }

    if (tabName && window.appGlobals) {
      window.appGlobals.activity('open', 'domain_tab_'+tabName);
    }

    this.async(function () {
      const news = this.$$("#domainNews");
      if (news) {
        news.fireResize();
      }
    }, 300);
  }

  _domainIdChanged(newValue, oldValue) {
    if (newValue) {
      this.set("featuredCommunities",null);
      this.set("activeCommunities",null);
      this.set("archivedCommunities",null);
      this.$$("#ajax").url = '/api/domains/' + this.domainId;
      this.$$("#ajax").generateRequest();
    }
  }

  _refreshAjax() {
    this.async(function () {
      this.$$("#ajax").generateRequest();
    }, 100);
  }

  _refreshAjaxLimited() {
    this.set('disableRefreshOnce', true);
    this._refreshAjax();
  }

  _newCommunity() {
    window.appGlobals.activity('open', 'newCommunity');
    dom(document).querySelector('yp-app').getDialogAsync("communityEdit", function (dialog) {
      dialog.setup(null, true, this._refreshAjaxLimited.bind(this));
      dialog.open('new', {domainId: this.domainId} );
    }.bind(this));
  }

  _newCommunityFolder() {
    window.appGlobals.activity('open', 'newCommunityFolder');
    dom(document).querySelector('yp-app').getDialogAsync("communityEdit", function (dialog) {
      dialog.setup(null, true, this._refreshAjaxLimited.bind(this), true);
      dialog.open('new', {domainId: this.domainId} );
    }.bind(this));
  }

  _pagesResponse(event, detail) {
    this.fire('yp-set-pages', detail.response);
  }

  _response(event, detail, sender) {
    console.log("Got domain response: "+detail.response.id);

    this.set('domain', detail.response);

    window.appGlobals.domain = this.domain;

    if (this.disableRefreshOnce) {
      this.set('disableRefreshOnce', false);
    } else {
      this.refresh();
    }

    if (!this.domain.only_admins_can_create_communities || this.checkDomainAccess(this.domain)) {
      this.set('createFabIcon', 'add');
    }

    window.appGlobals.setupGoogleAnalytics(this.domain);

    if (this.domain.Communities) {
      this.setupCommunities(__.dropRight(this.domain.Communities, this.domain.Communities.length-500));
    }

    this.$$("#domainCard").setElevation(5);
    this.$$("#domainCard").lowerCardLater();
  }

  refresh() {
    if (this.domain) {
      if (this.domain.default_locale!=null) {
        window.appGlobals.changeLocaleIfNeeded(this.domain.default_locale);
      }

      if (this.domain.theme_id!=null) {
        this.setTheme(this.domain.theme_id);
      }
      this.fire('yp-set-home-link', { type: 'domain', id: this.domain.id, name: this.domain.name });
      this.fire("change-header", { headerTitle: null, documentTitle: this.domain.name,
                                   headerDescription: this.domain.description});
      if (this.domain.DomainHeaderImages && this.domain.DomainHeaderImages.length>0) {
        this.$$("#page").setupTopHeaderImage(this.domain.DomainHeaderImages);
      } else {
        this.$$("#page").setupTopHeaderImage(null);
      }

      this.$$("#pagesAjax").url = "/api/domains/"+this.domain.id+"/pages";
      this.$$("#pagesAjax").generateRequest();
    }
    window.appGlobals.setAnonymousGroupStatus(null);
    window.appGlobals.disableFacebookLoginForGroup = false;
    window.appGlobals.externalGoalTriggerGroupId = null;
    window.appGlobals.currentForceSaml = false;
    window.appGlobals.currentSamlDeniedMessage = null;
    window.appGlobals.currentSamlLoginMessage = null;
    window.appGlobals.currentGroup = null;

    window.appGlobals.setHighlightedLanguages(null);
  }
}

window.customElements.define('yp-domain-lit', YpDomainLit);