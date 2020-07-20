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
  default_locale: null;

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

    this.addGlobalListener('yp-logged-in', this._refreshCollection);
  }

  static get propsfeerties() {
    return {
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

  async _refreshCollection() {
    if (this.collectionId) {
      this.collection = (await window.serverApi.getCollection(
        this.collectionApiType,
        this.collectionId
      )) as YpCollection | undefined;
    } else {
      console.error('Collection id setup for refresh');
    }
  }

  async _getHelpPages() {
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
            @refresh-collection="${this._refreshCollection}"
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

_setSelectedTabFromRoute(routeTabName: string): void {
  let tabNumber;

  switch(routeTabName) {
    case "community":
    case "group":
    case "domain":
      tabNumber = 0;
      break;
    case "news":
      tabNumber = 1;
      break;
    case "map":
      tabNumber = 2;
      break;
  }

  if (tabNumber) {
    this.selectedTab = tabNumber;
    window.appGlobals.activity('open', 'domain_tab_' + routeTabName);
  }
}

updated(changedProperties: Map<string | number | symbol, unknown>) {
  super.updated(changedProperties);

  if (changedProperties.has("subRoute") && this.subRoute!=null) {
    const splitSubRoute = this.subRoute.split("/");
    this.collectionId = splitSubRoute[0] as unknown as number;
    if (splitSubRoute.length>1) {
      this._setSelectedTabFromRoute(splitSubRoute[1])
    }
  }

  if (changedProperties.has("collectionId") && this.collectionId) {
    this._refreshCollection();
    this._getHelpPages();
  }
}


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

  abstract _openNewCollectionDialog(): void;

  _newCommunity() {
    window.appGlobals.activity('open', 'newCommunity');
    window.dialogs.getDialogAsync(
        'communityEdit',
        function (dialog) {
          dialog.setup(null, true, this._refreshCollection.bind(this));
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

  protected _setCommonConfig() {
    if (this.collection && this.collection.configuration) {
      if (this.collection.default_locale != null) {
        window.appGlobals.changeLocaleIfNeeded(this.domain.default_locale);
      }
    }
  }

  refresh() {
    if (this.domain) {

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
