import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import { YpCollection } from './yp-collection.js';
import { YpCollectionItemsGrid } from './yp-collection-items-grid.js';
import { customElement } from 'lit-element';

@customElement('yp-community')
export class YpCommunity extends YpCollection {
  constructor() {
    super("community","group","edit",'group.create');
  }

  _afterCollectionLoadSubClass() {
    const community = this.collection as YpCommunityData;

    if (community) {
      this.collectionItems = community.Groups;
      this.setFabIconIfAccess(
        community.only_admins_can_create_groups,
        YpAccessHelpers.checkCommunityAccess(community)
      );
    }
  }

  _refreshSubclass() {
    const community = this.collection as YpCommunityData;
    if (
      community &&
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

    this._hideMapIfNotUsedByGroups();

    if (this.collectionItems && this.collectionItems.length>0) {
      window.appGlobals.setAnonymousGroupStatus(this.collectionItems[0] as YpGroupData);
    }

    this._openHelpPageIfNeeded();

    if (!community.theme_id && community.Domain?.theme_id) {
      window.appGlobals.theme.setTheme(community.Domain.theme_id, this);
    }

    window.appGlobals.analytics.setCommunityAnalyticsTracker(community.google_analytics_code);
    window.appGlobals.analytics.setCommunityPixelTracker(community.configuration.facebookPixelId);

    this._setupCommunityBackPath(community);
    this._setupCommunitySaml(community);

    window.appGlobals.disableFacebookLoginForGroup = false;
    window.appGlobals.externalGoalTriggerGroupId = undefined;
    window.appGlobals.currentGroup = undefined;

    if (community.configuration.signupTermsPageId &&
        community.configuration.signupTermsPageId!=-1) {
      window.appGlobals.signupTermsPageId = community.configuration.signupTermsPageId;
    } else {
      window.appGlobals.signupTermsPageId = undefined;
    }

    if (community.configuration.highlightedLanguages) {
      window.appGlobals.setHighlightedLanguages(community.configuration.highlightedLanguages);
    } else {
      window.appGlobals.setHighlightedLanguages(undefined);
    }
  }

  _setupCommunitySaml(community: YpCommunityData) {
    if (community.configuration &&
      community.configuration.forceSecureSamlLogin &&
      !YpAccessHelpers.checkCommunityAccess(community)) {
      window.appGlobals.currentForceSaml = true;
    } else {
      window.appGlobals.currentForceSaml = false;
    }

    if (community.configuration && community.configuration.customSamlDeniedMessage) {
      window.appGlobals.currentSamlDeniedMessage = community.configuration.customSamlDeniedMessage;
    } else {
      window.appGlobals.currentSamlDeniedMessage = undefined;
    }

    if (community.configuration && community.configuration.customSamlLoginMessage) {
      window.appGlobals.currentSamlLoginMessage = community.configuration.customSamlLoginMessage;
    } else {
      window.appGlobals.currentSamlLoginMessage = undefined;
    }
  }

  _setupCommunityBackPath(community: YpCommunityData) {
    if (this.collection && window.location.href.indexOf("/community") >-1) {
      let backPath, headerTitle, headerDescription;
      if (community.CommunityFolder) {
        backPath = "/community_folder/" + community.CommunityFolder.id;
        headerTitle = community.CommunityFolder.name;
        headerDescription = community.CommunityFolder.description;
      } else {
        backPath = "/domain/" + community.domain_id;
        headerTitle = community.Domain.name;
        headerDescription = community.Domain.description;
      }
      this.fire("change-header", {
        headerTitle: this.collection.configuration && this.collection.configuration.customBackName ?
          this.collection.configuration.customBackName :
          headerTitle,
        headerDescription: headerDescription,
        headerIcon: "group-work",
        useHardBack: this._useHardBack(community.configuration),
        disableDomainUpLink: (this.collection.configuration &&
          community.configuration.disableDomainUpLink === true),
        documentTitle: this.collection.name,
        backPath: this.collection.configuration && this.collection.configuration.customBackURL ?
          this.collection.configuration.customBackURL : backPath
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

  _openHelpPageIfNeeded () {
    if (this.collection && !sessionStorage.getItem("yp-welcome-for-community-"+this.collection.id)) {
      setTimeout(() => {
        if (this.collection && this.collection.configuration && this.collection.configuration.welcomePageId) {
          this.fire('yp-open-page', { pageId: this.collection.configuration.welcomePageId });
          sessionStorage.setItem("yp-welcome-for-community-"+this.collection.id, "true");
        }
      }, 1200);
    }
  }

  _hideMapIfNotUsedByGroups() {
    let locationHidden = true;
    this.collectionItems?.forEach(group  => {
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
