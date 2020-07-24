import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import { YpCollection } from './yp-collection.js';
import { YpCollectionItemsGrid } from './yp-collection-items-grid.js';
import { customElement, html, property } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';

@customElement('yp-group')
export class YpGroup extends YpCollection {
  @property({ type: String })
  searchingFor: string | undefined;

  @property({ type: Boolean })
  hasNonOpenPosts = false;

  @property({ type: Boolean })
  disableNewPosts = false;

  haveGotTabCountInfoCount = 0;
  tabCounters = {};

  constructor() {
    super('group', 'post', 'light-bulb', 'post.create');
  }

  async _getCollection() {
    window.appGlobals.retryMethodAfter401Login = this._getCollection.bind(this);
    if (
      this.collectionId &&
      window.appGlobals.cache.groupItemsCache[this.collectionId]
    ) {
      this.collection =
        window.appGlobals.cache.groupItemsCache[this.collectionId];
      this.refresh();
    } else {
      super._getCollection();
    }
    window.appGlobals.retryMethodAfter401Login = undefined;
  }

  renderGroupTabs() {
    if (this.collection && !this.tabsHidden) {
      return html`
        <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
          <mwc-tab
            .label="${this.collectionTabLabel}"
            icon="people"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.noOpenPosts}"
            .label="${this.openPostsLabel}"
            icon="people"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.noOpenPosts}"
            .label="${this.inProgressPostsLabel}"
            icon="people"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.noOpenPosts}"
            .label="${this.successsfulPostsLabel}"
            icon="people"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.noOpenPosts}"
            .label="${this.failedPostsLabel}"
            icon="people"
            stacked></mwc-tab>
          ${this.renderNewsAndMapTabs()}
        </mwc-tab-bar>
      `;
    } else {
      return nothing;
    }
  }

  renderPostList(type: string): TemplateResult {
    return html``;
  }

  renderCurrentGroupTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch ((this.selectedTab as unknown) as GroupTabTypes) {
      case GroupTabTypes.Open:
        page = this.renderPostList('open');
        break;
      case GroupTabTypes.InProgress:
        page = this.renderPostList('inProgress');
        break;
      case GroupTabTypes.Successful:
        page = this.renderPostList('successful');
        break;
      case GroupTabTypes.Failed:
        page = this.renderPostList('failed');
        break;
      case GroupTabTypes.Newsfeed:
        page = html` <ac-activities
          id="collectionActivities"
          .selectedTab="${this.selectedTab}"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId}"></ac-activities>`;
        break;
      case GroupTabTypes.Map:
        page = html``;
        break;
    }

    return page;
  }

  render() {
    return html`
      ${this.renderHeader()}
      ${this.collection &&
      !(this.collection.configuration as YpGroupConfiguration).hideNewPost
        ? html`
            <div
              class="largeAddButton layout horizontal center-center"
              ?hidden="${(this.collection.configuration as YpGroupConfiguration)
                .hideNewPost}">
              <yp-post-card-add
                .group="${this.collection}"
                .disabled="${this.disableNewPosts}"
                @new-post="${this._openNewPost}"></yp-post-card-add>
            </div>`
        : nothing}
      ${this.renderGroupTabs()} ${this.renderCurrentGroupTabPage()}
      ${!this.disableNewPosts && this.collection &&
      !(this.collection.configuration as YpGroupConfiguration).hideNewPost
        ? html` <mwc-fab
            ?extended="${this.wide}"
            .label="${this.t('post.create')}"
            icon="light_bulb"
            @click="${this._openNewPost}"></mwc-fab>`
        : nothing}
    `;
  }

  refresh() {
    super.refresh();
    const community = this.collection as YpCommunityData;
    if (community) {
      this.collectionItems = community.Groups;
      this.setFabIconIfAccess(
        community.only_admins_can_create_groups,
        YpAccessHelpers.checkCommunityAccess(community)
      );
      if (
        community.CommunityHeaderImages &&
        community.CommunityHeaderImages.length > 0
      ) {
        YpMediaHelpers.setupTopHeaderImage(
          this,
          community.CommunityHeaderImages as Array<YpImageData>
        );
      } else {
        YpMediaHelpers.setupTopHeaderImage(this, null);
      }

      if (!community.theme_id && community.Domain?.theme_id) {
        window.appGlobals.theme.setTheme(community.Domain.theme_id, this);
      }

      window.appGlobals.analytics.setCommunityAnalyticsTracker(
        community.google_analytics_code
      );
      window.appGlobals.analytics.setCommunityPixelTracker(
        community.configuration.facebookPixelId
      );

      if (this.collectionItems && this.collectionItems.length > 0) {
        window.appGlobals.setAnonymousGroupStatus(
          this.collectionItems[0] as YpGroupData
        );
      }

      this._hideMapIfNotUsedByGroups();
      this._openHelpPageIfNeededOnce();

      this._setupCommunityBackPath(community);
      this._setupCommunitySaml(community);

      if (
        community.configuration.signupTermsPageId &&
        community.configuration.signupTermsPageId != -1
      ) {
        window.appGlobals.signupTermsPageId =
          community.configuration.signupTermsPageId;
      } else {
        window.appGlobals.signupTermsPageId = undefined;
      }

      if (community.configuration.highlightedLanguages) {
        window.appGlobals.setHighlightedLanguages(
          community.configuration.highlightedLanguages
        );
      } else {
        window.appGlobals.setHighlightedLanguages(undefined);
      }
    }

    window.appGlobals.disableFacebookLoginForGroup = false;
    window.appGlobals.externalGoalTriggerGroupId = undefined;
    window.appGlobals.currentGroup = undefined;
  }

  _setupCommunitySaml(community: YpCommunityData) {
    if (
      community.configuration &&
      community.configuration.forceSecureSamlLogin &&
      !YpAccessHelpers.checkCommunityAccess(community)
    ) {
      window.appGlobals.currentForceSaml = true;
    } else {
      window.appGlobals.currentForceSaml = false;
    }

    if (
      community.configuration &&
      community.configuration.customSamlDeniedMessage
    ) {
      window.appGlobals.currentSamlDeniedMessage =
        community.configuration.customSamlDeniedMessage;
    } else {
      window.appGlobals.currentSamlDeniedMessage = undefined;
    }

    if (
      community.configuration &&
      community.configuration.customSamlLoginMessage
    ) {
      window.appGlobals.currentSamlLoginMessage =
        community.configuration.customSamlLoginMessage;
    } else {
      window.appGlobals.currentSamlLoginMessage = undefined;
    }
  }

  _setupCommunityBackPath(community: YpCommunityData) {
    if (community && window.location.href.indexOf('/community') > -1) {
      let backPath, headerTitle, headerDescription;
      if (community.CommunityFolder) {
        backPath = '/community_folder/' + community.CommunityFolder.id;
        headerTitle = community.CommunityFolder.name;
        headerDescription = community.CommunityFolder.description;
      } else {
        backPath = '/domain/' + community.domain_id;
        headerTitle = community.Domain.name;
        headerDescription = community.Domain.description;
      }
      this.fire('change-header', {
        headerTitle:
          community.configuration && community.configuration.customBackName
            ? community.configuration.customBackName
            : headerTitle,
        headerDescription: headerDescription,
        headerIcon: 'group-work',
        useHardBack: this._useHardBack(community.configuration),
        disableDomainUpLink:
          community.configuration &&
          community.configuration.disableDomainUpLink === true,
        documentTitle: community.name,
        backPath:
          community.configuration && community.configuration.customBackURL
            ? community.configuration.customBackURL
            : backPath,
      });
    }
  }

  scrollToCollectionItemSubClass() {
    if (
      this.collection &&
      window.appGlobals.cache.backToCommunityGroupItems &&
      window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]
    ) {
      (this.$$('#collectionItems') as YpCollectionItemsGrid).scrollToItem(
        window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]
      );
      window.appGlobals.cache.backToCommunityGroupItems[
        this.collection.id
      ] = undefined;
    }
  }

  _openHelpPageIfNeededOnce() {
    if (
      this.collection &&
      !sessionStorage.getItem('yp-welcome-for-community-' + this.collection.id)
    ) {
      setTimeout(() => {
        if (
          this.collection &&
          this.collection.configuration &&
          this.collection.configuration.welcomePageId
        ) {
          this.fire('yp-open-page', {
            pageId: this.collection.configuration.welcomePageId,
          });
          sessionStorage.setItem(
            'yp-welcome-for-community-' + this.collection.id,
            'true'
          );
        }
      }, 1200);
    }
  }

  _hideMapIfNotUsedByGroups() {
    let locationHidden = true;
    this.collectionItems?.forEach(group => {
      if (group.configuration && group.configuration.locationHidden) {
        if (group.configuration.locationHidden != true) {
          locationHidden = false;
        }
      } else {
        locationHidden = false;
      }
    });
    this.hideMap = locationHidden;
  }
}
