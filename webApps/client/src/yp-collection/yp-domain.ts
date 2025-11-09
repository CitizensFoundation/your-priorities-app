import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";

import { YpCollection, CollectionTabTypes } from "./yp-collection.js";
import { YpCollectionItemsList } from "./yp-collection-items-list.js";
import { customElement, property } from "lit/decorators.js";
import { AcActivities } from "../ac-activities/ac-activities.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { css, html, nothing } from "lit";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";

import "./yp-domain-header.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";

@customElement("yp-domain")
export class YpDomain extends YpCollection {
  @property({ type: String })
  customWelcomeHtml: string | undefined = undefined;

  @property({ type: Boolean })
  override useEvenOddItemLayout = true;

  constructor() {
    super("domain", "community", "edit", "community.add");
  }

  static override get styles() {
    return [
      super.styles,
      css`
        yp-domain-header {
          width: 100%;
        }

        .outerContainer {
          width: 1080px;
          max-width: 1080px;
          background-color: var(--md-sys-color-surface);
        }

        .outerContainer[is-login-active] {
          width: 100%;
          max-width: 100%;
        }

        .loginSurface {
          max-width: 410px;
          background-color: var(--md-sys-color-surface);
          padding: 32px;
          border-radius: 4px;
          padding-bottom: 640px;
        }

        @media (max-width: 420px) {
          .outerContainer {
            width: 100%;
            max-width: 100%;
          }

          .loginSurface {
            width: 100%;
            max-width: 100%;
          }

          .loginSurface {
            padding: 16px;
          }
        }
      `,
    ];
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
        this.headerImageUrl = YpMediaHelpers.getImageFormatUrl(
          domain.DomainHeaderImages as Array<YpImageData>,
          0
        );
      }

      window.appGlobals.theme.setTheme(domain.theme_id, domain.configuration);

      window.appGlobals.setCurrentDomain(domain);
    }

    if (domain && domain.configuration && domain.configuration.hideAllTabs) {
      this.tabsHidden = true;
    }

    if (domain && domain.configuration) {
      if (domain.configuration.hideDomainNews === true) {
        this.hideNewsfeed = true;
      } else {
        this.hideNewsfeed = false;
      }
    }

    window.appGlobals.setAnonymousGroupStatus(undefined);
    window.appGlobals.setRegistrationQuestionGroup(undefined);
    window.appGlobals.disableFacebookLoginForGroup = false;
    window.appGlobals.externalGoalTriggerGroupId = undefined;
    window.appGlobals.currentForceSaml =
      domain && domain.configuration && domain.configuration.forceElectronicIds
        ? true
        : false;
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
    this.requestUpdate();
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
        (this.$$("#collectionItems") as YpCollectionItemsList).scrollToItem(
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
      (this.$$("#collectionItems") as YpCollectionItemsList).scrollToItem(
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
      );
      window.appGlobals.cache.backToDomainCommunityItems[this.collection.id] =
        undefined;
    }
  }

  _forgotPassword() {
    window.appDialogs.getDialogAsync("forgotPassword", (dialog: Dialog) => {
      dialog.open = true;
    });
  }

  override renderHeader() {
    return this.collection && !this.noHeader
      ? html`
          <div class="layout vertical center-center header">
            <yp-domain-header
              .collection="${this.collection}"
              .collectionType="${this.collectionType}"
              aria-label="${this.collection?.name || this.collectionType}"
              role="banner"
            ></yp-domain-header>
          </div>
        `
      : nothing;
  }

  override renderAssistantTab() {
    return html`<md-secondary-tab
      ?has-static-theme="${this.hasStaticTheme}"
      >${this.t("assistant")}<md-icon slot="icon">smart_toy</md-icon></md-secondary-tab
    >`;
  }

  renderDomainLogin() {
    return html`
      <div class="layout vertical center-center">
        <div
          ?is-login-active="${this.collection &&
          (this.collection.configuration as YpDomainConfiguration)
            .useLoginOnDomainIfNotLoggedIn}"
          class="layout vertical center-center outerContainer"
        >
          <yp-login
            id="userLogin"
            class="loginSurface"
            fullWithLoginButton
            @yp-forgot-password="${this._forgotPassword}"
          ></yp-login>
        </div>
      </div>
    `;
  }

  override render() {
    if (
      this.collection &&
      !this.loggedInUser &&
      (this.collection.configuration as YpDomainConfiguration)
        .useLoginOnDomainIfNotLoggedIn
    ) {
      return this.renderDomainLogin();
    } else if (
      this.collection &&
      !this.loggedInUser &&
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
