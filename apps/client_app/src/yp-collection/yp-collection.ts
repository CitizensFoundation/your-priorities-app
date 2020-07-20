import { property, html, css } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-tab-bar';
import '@material/mwc-fab';
import './yp-collection-header.js';
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
  collection: YpCollectionData | undefined;

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Number })
  selectedTab: CollectionTabTypes = CollectionTabTypes.Collection;

  @property({ type: Array})
  collectionItems: Array<YpCommunityData | YpGroupData | YpPostData> | undefined;

  @property({ type: Boolean })
  hideNewsfeed = false;

  @property({ type: Boolean })
  hideMap = false;

  @property({ type: Boolean })
  hideCollection = false;

  @property({ type: String })
  createFabIcon: string | null = null;

  @property({ type: String })
  createFabLabel: string | null = null;

  collectionType: string;
  collectionApiType: string;
  collectionCreateFabIcon: string;
  collectionCreateFabLabel: string;

  constructor(
    collectionType: string,
    collectionApiType: string,
    collectionCreateFabIcon: string,
    collectionCreateFabLabel: string
  ) {
    super();
    this.collectionType = collectionType;
    this.collectionApiType = collectionApiType;
    this.collectionCreateFabIcon = collectionCreateFabIcon;
    this.collectionCreateFabLabel = collectionCreateFabLabel;

    this.addGlobalListener('yp-logged-in', this._getCollection);
  }

  abstract _afterCollectionLoadSpecific(): void;
  abstract _refreshSpecific(): void;
  abstract _openNewCollectionItemDialog(): void;

   // DATA PROCESSING

  _refreshSpecificDomain() {
    const domain = this.collection as YpDomainData;
    if (
      domain &&
      domain.DomainHeaderImages &&
      domain.DomainHeaderImages.length > 0
    ) {
      YpMediaHelpers.setupTopHeaderImage(this, domain.DomainHeaderImages as Array<YpImageData>);
    } else {
      YpMediaHelpers.setupTopHeaderImage(this, null);
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

  refresh(): void {
     if (this.collection) {
      if (this.collection.theme_id) {
        window.appGlobals.theme.setTheme(this.collection.theme_id, this);
      }

      this.fire('yp-set-home-link', {
        type: this.collectionType,
        id: this.collection.id,
        name: this.collection.name,
      });

      this.fire('change-header', {
        headerTitle: null,
        documentTitle: this.collection.name,
        headerDescription: this.collection.description || this.collection.objectives,
      });
    }
   }

  _afterCollectionLoadSpecificDomain() {
    const domain = this.collection as YpDomainData;

    if (domain) {
      window.appGlobals.domain = domain;
      window.appGlobals.analytics.setupGoogleAnalytics(domain);
      this.collectionItems = domain.Communities;
      if (
        !domain.only_admins_can_create_communities ||
        YpAccessHelpers.checkDomainAccess(domain)
      ) {
        this.createFabIcon = this.collectionCreateFabIcon;
        this.createFabLabel = this.collectionCreateFabLabel;
      } else {
        this.createFabIcon = null;
        this.createFabLabel = null;
      }
    }
  }

  _afterCollectionLoad() {
    if (this.collection) {
      if (this.collection.default_locale != null) {
        window.appGlobals.changeLocaleIfNeeded(this.collection.default_locale);
      }
    }

    this._afterCollectionLoadSpecific()
  }

  async _getCollection() {
    if (this.collectionId) {
      this.collection = (await window.serverApi.getCollection(
        this.collectionApiType,
        this.collectionId
      )) as YpCollectionData | undefined;
      this._afterCollectionLoad();
      this.refresh();
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

  get collectionTabLabel(): string {
    return `${this.t(this.collectionType)} (${
      this.collectionItems ? this.collectionItems.length : 0
    })`;
  }

  // UI

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

  renderOtherTab() {
    return nothing;
  }

  renderOtherPage() {
    return nothing as TemplateResult;
  }

  renderHeader() {
    return this.collection && !this.noHeader
      ? html`
          <yp-collection-header
            .collection="${this.collection}"
            .collectionType="${this.collectionType}"
            aria-label="${this.collectionType}"
            role="banner"></yp-collection-header>;
        `
      : nothing;
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
        page = html`
          <yp-collection-items-grid
            .colletionItems="${this.collectionItems}"
            .collectionId="${this.collectionId}"
            @create-collection-item="${this._openNewCollectionItemDialog}"></yp-collection-items-grid>`;
        break;
      case CollectionTabTypes.Newsfeed:
        page = html`
          <ac-activities
            id="domainNews"
            .selectedTab="${this.selectedTab}"
            .collectionType="${this.collectionType}"
            .collectionId="${this.collectionId}"></ac-activities>`;
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

  render() {
    return html`
      ${this.renderHeader()} ${this.renderTabs()} ${this.renderCurrentTabPage()}
      ${this.createFabIcon ? html`<mwc-fab
        ?extended="${this.wide}"
        .label="${this.createFabLabel}"
        .icon="${this.createFabIcon}"
        @click="${this._openNewCollectionItemDialog}"></mwc-fab>` : nothing }
    `;
  }

  // EVENTS

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
      this._getCollection();
      this._getHelpPages();
    }
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail as CollectionTabTypes;
  }

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



  /* TODO: Evaluate if this is still needed
  scrollToCommunityItem() {
    if (
      this.selectedTab === CollectionTabTypes.Newsfeed &&
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
  }*/


  // COMMUNITY

  _openNewCollectionItemDialogCommunity(event: CustomEvent): void {
    if(event.detail.type==="Community") {
      window.appGlobals.activity('open', 'newCommunity');
      window.dialogs.getDialogAsync(
          'communityEdit',
          function (dialog) {
            dialog.setup(null, true, this._getCollection.bind(this));
            dialog.open('new', { domainId: this.domainId });
          }.bind(this)
        );
    } else if (event.detail.type==="CommunityFolder") {
      window.appGlobals.activity('open', 'newCommunityFolder');
      window.dialogs.getDialogAsync(
          'communityEdit',
          function (dialog) {
            dialog.setup(null, true, this._getCollection.bind(this), true);
            dialog.open('new', { domainId: this.domainId });
          }.bind(this)
        );
    }
  }
}
