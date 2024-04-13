import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";

import { YpCollection, CollectionTabTypes } from "./yp-collection.js";
import { YpCollectionItemsGrid } from "./yp-collection-items-grid.js";
import { customElement, property } from "lit/decorators.js";
import { AcActivities } from "../ac-activities/ac-activities.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { html, nothing } from "lit";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";

@customElement("yp-domain")
export class YpDomain extends YpCollection {
  @property({ type: String })
  customWelcomeHtml: string | undefined = undefined;

  constructor() {
    super("domain", "community", "edit", "community.add");
  }

  override async refresh() {
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

      if (domain.DomainHeaderImages && domain.DomainHeaderImages.length > 0) {
        YpMediaHelpers.setupTopHeaderImage(
          this,
          domain.DomainHeaderImages as Array<YpImageData>
        );
      } else {
        YpMediaHelpers.setupTopHeaderImage(this, null);
      }

      window.appGlobals.theme.setTheme(domain.theme_id, domain.configuration);
    }

    if (domain && domain.configuration && domain.configuration.hideAllTabs) {
      this.tabsHidden = true;
    }

    window.appGlobals.setAnonymousGroupStatus(undefined);
    window.appGlobals.setRegistrationQuestionGroup(undefined);
    window.appGlobals.disableFacebookLoginForGroup = false;
    window.appGlobals.externalGoalTriggerGroupId = undefined;
    window.appGlobals.currentForceSaml = false;
    window.appGlobals.currentSamlDeniedMessage = undefined;
    window.appGlobals.currentSamlLoginMessage = undefined;
    window.appGlobals.currentGroup = undefined;
    window.appGlobals.signupTermsPageId = undefined;
    window.appGlobals.setHighlightedLanguages(undefined);

    setTimeout(async () => {
      if (domain && domain.configuration) {
        if (domain.configuration.welcomeHtmlInsteadOfCommunitiesList) {
          let finalHtml =
            domain.configuration.welcomeHtmlInsteadOfCommunitiesList;
          const aoiStatsHtmlTag = "<AOI_SITE_STATS>";
          if (
            domain.configuration.welcomeHtmlInsteadOfCommunitiesList.includes(
              aoiStatsHtmlTag
            )
          ) {
            const stats = (await window.serverApi.getAoiTotalStats(
              domain.id
            )) as AoiSiteStats;
            if (stats) {
              const statsString = `<div class="layout horizontal center-center aoiSiteStats wrap">
              <span class="aoiSiteStatItem">${YpFormattingHelpers.number(
                stats.total_questions
              )}</span> <span class="aoiSiteStatType">wiki surveys</span> created with <span class="aoiSiteStatItem">${YpFormattingHelpers.number(
                stats.choices_count
              )} </span> <span class="aoiSiteStatType">answers</span> and <span class="aoiSiteStatItem">${YpFormattingHelpers.number(
                stats.votes_count
              )} </span>  <span class="aoiSiteStatType">votes</span> since 2010
              </div>`;

              finalHtml = finalHtml.replace(aoiStatsHtmlTag, statsString);
            }
          }
          this.customWelcomeHtml = finalHtml;
        }
      }
    });
  }

  scrollToCommunityItem() {
    if (
      this.selectedTab === CollectionTabTypes.Newsfeed &&
      window.appGlobals.cache.cachedActivityItem
    ) {
      const list = this.$$("#collectionActivities") as AcActivities;
      if (list) {
        list.scrollToItem(window.appGlobals.cache.cachedActivityItem);
        window.appGlobals.cache.cachedActivityItem = undefined;
      } else {
        console.warn("No domain activities for scroll to item");
      }
    } else if (
      this.selectedTab === CollectionTabTypes.Collection &&
      this.collection
    ) {
      if (
        window.appGlobals.cache.backToDomainCommunityItems &&
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
      ) {
        (this.$$("#collectionItems") as YpCollectionItemsGrid).scrollToItem(
          window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
        );
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id] =
          undefined;
      }
    }
  }

  scrollToCollectionItemSubClass() {
    if (
      this.collection &&
      window.appGlobals.cache.backToDomainCommunityItems &&
      window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
    ) {
      (this.$$("#collectionItems") as YpCollectionItemsGrid).scrollToItem(
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
      );
      window.appGlobals.cache.backToDomainCommunityItems[this.collection.id] =
        undefined;
    }
  }

  override render() {
    if (
      this.collection &&
      (this.collection.configuration as YpDomainConfiguration)
        .welcomeHtmlInsteadOfCommunitiesList
    ) {
      if (this.customWelcomeHtml) {
        return html`
          <yp-magic-text
            id="domainWelcomeHtml"
            .contentId="${this.collection.id}"
            unsafeHtml
            .content="${this.customWelcomeHtml}"
            .contentLanguage="${this.collection.language}"
            textType="domainWelcomeHtml"
          ></yp-magic-text>

          <div
            class="layout vertical center-center"
            ?hidden="${!YpAccessHelpers.checkDomainAccess(
              this.collection as YpDomainData
            )}"
          >
            <md-icon-button
              id="menuButton"
              @click="${this._openAdmin}"
              title="${this.t("domain.edit")}"
              ><md-icon>settings</md-icon>
            </md-icon-button>
          </div>
        `;
      } else {
        return html``;
      }
    } else {
      return super.render();
    }
  }
}
