import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import { YpCollection } from './yp-collection.js';
import { YpCollectionItemsGrid } from './yp-collection-items-grid.js';
import { customElement } from 'lit-element';

@customElement('yp-domain')
export class YpDomain extends YpCollection {
  constructor() {
    super("domain","community","edit",'community.create');
  }

  refresh() {
    super.refresh();

    const domain = this.collection as YpDomainData;

    if (domain) {
      window.appGlobals.domain = domain;
      window.appGlobals.analytics.setupGoogleAnalytics(domain);
      this.collectionItems = domain.Communities;
      this.setFabIconIfAccess(
        domain.only_admins_can_create_communities,
        YpAccessHelpers.checkDomainAccess(domain)
      );

      if (
        domain.DomainHeaderImages &&
        domain.DomainHeaderImages.length > 0
      ) {
        YpMediaHelpers.setupTopHeaderImage(
          this,
          domain.DomainHeaderImages as Array<YpImageData>
        );
      } else {
        YpMediaHelpers.setupTopHeaderImage(this, null);
      }
    }

    window.appGlobals.setAnonymousGroupStatus(undefined);
    window.appGlobals.disableFacebookLoginForGroup = false;
    window.appGlobals.externalGoalTriggerGroupId = undefined;
    window.appGlobals.currentForceSaml = false;
    window.appGlobals.currentSamlDeniedMessage = undefined;
    window.appGlobals.currentSamlLoginMessage = undefined;
    window.appGlobals.currentGroup = undefined;
    window.appGlobals.signupTermsPageId = undefined;
    window.appGlobals.setHighlightedLanguages(undefined);
  }

  scrollToCollectionItemSubClass() {
    if (
      this.collection &&
      window.appGlobals.cache.backToDomainCommunityItems &&
      window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
    ) {
      (this.$$('#collectionItems') as YpCollectionItemsGrid).scrollToItem(
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
      );
      window.appGlobals.cache.backToDomainCommunityItems[
        this.collection.id
      ] = undefined;
    }
  }
}
