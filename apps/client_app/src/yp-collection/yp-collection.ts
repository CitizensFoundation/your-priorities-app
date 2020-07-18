import { CollectionHelpers } from '../yp-behaviors/collection-helpers.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { YpNewsTabSelected } from '../yp-behaviors/yp-news-tab-selected.js';
import { ypDetectOldiOs } from '../yp-behaviors/yp-detect-old-ios.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { CommunityCollectionBehaviors } from '../yp-community/yp-community-collection-behaviors.js';

import '../ac-activities/ac-activities.js';
import '../yp-page/yp-page.js';
import '../yp-community/yp-community-grid.js';
import './yp-domain-large-card.js';

import { property, html, css } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import '@material/mwc-tab-bar';
import '@material/mwc-fab';
import './yp-collection-items-grid.js';

export abstract class YpCollection extends YpBaseElement {
  @property({ type: Boolean })
  noHeader = false;

  @property({ type: Boolean })
  noTabs = false;

  @property({ type: Number })
  collectionId: number | undefined;

  @property({ type: String })
  collectionName: string | undefined;

  @property({ type: Object })
  collection: YpCollection | undefined;

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Number })
  selectedTab: CollectionTabTypes = CollectionTabTypes.Collection;

  @property({ type: Boolean })
  hideNewsfeed = false;

  @property({ type: Boolean })
  hideMap = false;

  @property({ type: Boolean })
  hideCollection = false;

  @property({ type: Array })
  collectionItems = [];

  collectionTypeName: string;
  collectionApiType: string;
  collectionCreateFabIcon: string;
  collectionCreateFabLabel: string;

  constructor(
    collectionTypeName: string,
    collectionApiType: string,
    collectionCreateFabIcon: string,
    collectionCreateFabLabel: string
  ) {
    super();
    this.collectionTypeName = collectionTypeName;
    this.collectionApiType = collectionApiType;
    this.collectionCreateFabIcon = collectionCreateFabIcon;
    this.collectionCreateFabLabel = collectionCreateFabLabel;

    this.addGlobalListener('yp-logged-in', this.refreshCollection);
  }

  static get propsfeerties() {
    return {
      idRoute: Object,
      tabRoute: Object,
      idRouteData: Object,
      tabRouteData: Object,


      isOldiOs: {
        type: Boolean,
        computed: '_isOldiOs(domainId)',
      },

    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        mwc-fab {
          position: absolute;
          bottom: 16px;
          right: 16px;
        }
      `,
    ];
  }

  async refreshCollection() {
    if (this.collectionId) {
      this.collection = (await window.serverApi.getCollection(
        this.collectionApiType,
        this.collectionId
      )) as YpCollection | undefined;
    } else {
      console.error('Collection id setup for refresh');
    }
  }

  async getHelpPages() {
    if (this.collectionId) {
      const helpPages = (await window.serverApi.getHelpPages(
        this.collectionApiType,
        this.collectionId
      )) as Array<YpHelpPage> | undefined;
      this.fire("yp-set-pages", helpPages);
    } else {
      console.error('Collection id setup for get help pages');
    }
  }

  renderHeader() {
    return this.collection && !this.noHeader
      ? html`
          <yp-collection-header
            .collection="${this.collection}"
            aria-label="${this.collectionTypeName}"
            @refresh-collection="${this.refreshCollection}"
            role="banner"></yp-collection-header
          >;
        `
      : nothing;
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail as CollectionTabTypes;
  }

  renderOtherTab() {
    return nothing;
  }

  renderOtherPage() {
    return nothing as TemplateResult;
  }

  get collectionTabLabel(): string {
    return `${this.t(this.collectionTypeName)} (${
      this.collectionItems.length
    })`;
  }

  renderTabs() {
    if (this.collection && !this.noTabs) {
      return html`
        <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
          <mwc-tab
            ?hidden="${this.hideCollection}"
            .label="${this.collectionTabLabel}"
            icon="people"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.hideNewsfeed}"
            .label="${this.t('newsfeed')}"
            icon="rss_feed"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.hideMap}"
            .label="${this.t('map')}"
            icon="map"
            stacked></mwc-tab>
          ${this.renderOtherTab()}
        </mwc-tab-bar>
      `;
    } else {
      return nothing;
    }
  }

  renderCurrentTabPage(): TemplateResult | null {
    let page: TemplateResult | null = null;

    switch (this.selectedTab) {
      case CollectionTabTypes.Collection:
        page = html` <yp-collection-items-grid
          .collectionId="${this.collectionId}"></yp-collection-items-grid>`;
        break;
      case CollectionTabTypes.Newsfeed:
        page = html``;
        break;
      case CollectionTabTypes.Map:
        page = html``;
        break;
      case CollectionTabTypes.Other:
        page = this.renderOtherPage();
        break;
    }

    return page;
  }

  abstract createCollectionItem(event: CustomEvent): void;

  render() {
    return html`
      ${this.renderHeader()} ${this.renderTabs()} ${this.renderCurrentTabPage()}
      <mwc-fab
        ?extended="${this.wide}"
        .label="${this.collectionCreateFabLabel}"
        icon="${this.collectionCreateFabIcon}"
        @click="${this.createCollectionItem}"></mwc-fab>

      ${this.group
        ? html`
                    <yp-community-grid
                      id="communityGrid"
                      featured-communities="${this.featuredCommunities}"
                      active-communities="${this.activeCommunities}"
                      .archivedCommunities="${this.archivedCommunities}"
                      .hideAdd="${!this.createFabIcon}"
                      @add-new-community="${this._newCommunity}">
                    </yp-community-grid>
                  </div>
                </section>
                <section .name="news" class="minHeightSection">
                  ${
                    this.newsTabSelected
                      ? html`
                          <ac-activities
                            id="domainNews"
                            .selectedTab="${this.selectedTab}"
                            .domainId="${this.domain.id}"></ac-activities>
                        `
                      : html``
                  }
                </section>
              </iron-pages>
            </yp-page>

            <app-route
              .route="${this.idRoute}"
              .pattern="/:id"
              data="${this.idRouteData}"
              .tail="${this.tabRoute}">
            </app-route>

            <app-route
              .route="${this.tabRoute}"
              .pattern="/:tabName"
              data="${this.tabRouteData}">
            </app-route>

            <div
              class="ypBottomContainer layout-horizontal layout-center-center">
              <yp-ajax
                id="ajax"
                url="${this.url}"
                @response="${this._response}"></yp-ajax>
              <yp-ajax
                id="pagesAjax"
                1
                @response="${this._pagesResponse}"></yp-ajax>
            </div>
          `
        : html``}
    `;
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
    if (
      this.selectedTab === 'news' &&
      window.appGlobals.cachedActivityItem !== null
    ) {
      const list = this.$$('#domainNews');
      if (list) {
        list.scrollToItem(window.appGlobals.cachedActivityItem);
        window.appGlobals.cachedActivityItem = null;
      } else {
        console.warn('No domain activities for scroll to item');
      }
    } else if (this.selectedTab === 'communities') {
      if (
        window.appGlobals.backToDomainCommunityItems &&
        window.appGlobals.backToDomainCommunityItems[this.domain.id]
      ) {
        this.$$('#communityGrid').scrollToItem(
          window.appGlobals.backToDomainCommunityItems[this.domain.id]
        );
        window.appGlobals.backToDomainCommunityItems[this.domain.id] = null;
      }
    }
  }

  _userLoggedIn(user) {
    if (user) {
      if (this.domain && window.location.href.indexOf('/domain/') > -1) {
        this.$$('#ajax').generateRequest();
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
    if (tabName == 'other_social_media') {
      this.set('otherSocialMediaActive', true);
    } else {
      this.set('otherSocialMediaActive', false);
    }

    if (this.domain) {
      this.redirectTo('/domain/' + this.domain.id + '/' + tabName);
    }

    if (tabName && window.appGlobals) {
      window.appGlobals.activity('open', 'domain_tab_' + tabName);
    }

    this.async(function () {
      const news = this.$$('#domainNews');
      if (news) {
        news.fireResize();
      }
    }, 300);
  }

  _domainIdChanged(newValue, oldValue) {
    if (newValue) {
      this.set('featuredCommunities', null);
      this.set('activeCommunities', null);
      this.set('archivedCommunities', null);
      this.$$('#ajax').url = '/api/domains/' + this.domainId;
      this.$$('#ajax').generateRequest();
    }
  }

  _refreshAjax() {
    this.async(function () {
      this.$$('#ajax').generateRequest();
    }, 100);
  }

  _refreshAjaxLimited() {
    this.set('disableRefreshOnce', true);
    this._refreshAjax();
  }

  _newCommunity() {
    window.appGlobals.activity('open', 'newCommunity');
    dom(document)
      .querySelector('yp-app')
      .getDialogAsync(
        'communityEdit',
        function (dialog) {
          dialog.setup(null, true, this._refreshAjaxLimited.bind(this));
          dialog.open('new', { domainId: this.domainId });
        }.bind(this)
      );
  }

  _newCommunityFolder() {
    window.appGlobals.activity('open', 'newCommunityFolder');
    dom(document)
      .querySelector('yp-app')
      .getDialogAsync(
        'communityEdit',
        function (dialog) {
          dialog.setup(null, true, this._refreshAjaxLimited.bind(this), true);
          dialog.open('new', { domainId: this.domainId });
        }.bind(this)
      );
  }

  _response(event, detail, sender) {
    console.log('Got domain response: ' + detail.response.id);

    this.set('domain', detail.response);

    window.appGlobals.domain = this.domain;

    if (this.disableRefreshOnce) {
      this.set('disableRefreshOnce', false);
    } else {
      this.refresh();
    }

    if (
      !this.domain.only_admins_can_create_communities ||
      this.checkDomainAccess(this.domain)
    ) {
      this.set('createFabIcon', 'add');
    }

    window.appGlobals.setupGoogleAnalytics(this.domain);

    if (this.domain.Communities) {
      this.setupCommunities(
        __.dropRight(
          this.domain.Communities,
          this.domain.Communities.length - 500
        )
      );
    }

    this.$$('#domainCard').setElevation(5);
    this.$$('#domainCard').lowerCardLater();
  }

  refresh() {
    if (this.domain) {
      if (this.domain.default_locale != null) {
        window.appGlobals.changeLocaleIfNeeded(this.domain.default_locale);
      }

      if (this.domain.theme_id != null) {
        this.setTheme(this.domain.theme_id);
      }
      this.fire('yp-set-home-link', {
        type: 'domain',
        id: this.domain.id,
        name: this.domain.name,
      });
      this.fire('change-header', {
        headerTitle: null,
        documentTitle: this.domain.name,
        headerDescription: this.domain.description,
      });
      if (
        this.domain.DomainHeaderImages &&
        this.domain.DomainHeaderImages.length > 0
      ) {
        this.$$('#page').setupTopHeaderImage(this.domain.DomainHeaderImages);
      } else {
        this.$$('#page').setupTopHeaderImage(null);
      }

      this.$$('#pagesAjax').url = '/api/domains/' + this.domain.id + '/pages';
      this.$$('#pagesAjax').generateRequest();
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
