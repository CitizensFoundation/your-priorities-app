var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { YpCollection, CollectionTabTypes } from "./yp-collection.js";
import { customElement, property } from "lit/decorators.js";
import { css, html, nothing } from "lit";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import "./yp-domain-header.js";
let YpDomain = class YpDomain extends YpCollection {
    constructor() {
        super("domain", "community", "edit", "community.add");
        this.customWelcomeHtml = undefined;
        this.useEvenOddItemLayout = true;
    }
    static get styles() {
        return [
            super.styles,
            css `
        yp-domain-header {
          width: 100%;
        }

        .outerContainer {
          width: 1080px;
          max-width: 1080px;
          background-color: var(--md-sys-color-surface);
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
    async refresh() {
        super.refresh();
        const domain = this.collection;
        if (domain) {
            window.appGlobals.domain = domain;
            window.appGlobals.analytics.setupGoogleAnalytics(domain);
            this.collectionItems = domain.Communities;
            this.setFabIconIfAccess(domain.only_admins_can_create_communities, YpAccessHelpers.checkDomainAccess(domain));
            if (domain.DomainHeaderImages && domain.DomainHeaderImages.length > 0) {
                this.headerImageUrl = YpMediaHelpers.getImageFormatUrl(domain.DomainHeaderImages, 0);
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
                    let finalHtml = domain.configuration.welcomeHtmlInsteadOfCommunitiesList;
                    const aoiStatsHtmlTag = "<AOI_SITE_STATS>";
                    if (domain.configuration.welcomeHtmlInsteadOfCommunitiesList.includes(aoiStatsHtmlTag)) {
                        const stats = (await window.serverApi.getAoiTotalStats(domain.id));
                        if (stats) {
                            const statsString = `<div class="layout horizontal center-center aoiSiteStats wrap">
              <span class="aoiSiteStatItem">${YpFormattingHelpers.number(stats.total_questions)}</span> <span class="aoiSiteStatType">wiki surveys</span> created with <span class="aoiSiteStatItem">${YpFormattingHelpers.number(stats.choices_count)} </span> <span class="aoiSiteStatType">answers</span> and <span class="aoiSiteStatItem">${YpFormattingHelpers.number(stats.votes_count)} </span>  <span class="aoiSiteStatType">votes</span> since 2010
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
        if (this.selectedTab === CollectionTabTypes.Newsfeed &&
            window.appGlobals.cache.cachedActivityItem) {
            const list = this.$$("#collectionActivities");
            if (list) {
                list.scrollToItem(window.appGlobals.cache.cachedActivityItem);
                window.appGlobals.cache.cachedActivityItem = undefined;
            }
            else {
                console.warn("No domain activities for scroll to item");
            }
        }
        else if (this.selectedTab === CollectionTabTypes.Collection &&
            this.collection) {
            if (window.appGlobals.cache.backToDomainCommunityItems &&
                window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]) {
                this.$$("#collectionItems").scrollToItem(window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]);
                window.appGlobals.cache.backToDomainCommunityItems[this.collection.id] =
                    undefined;
            }
        }
    }
    scrollToCollectionItemSubClass() {
        if (this.collection &&
            window.appGlobals.cache.backToDomainCommunityItems &&
            window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]) {
            this.$$("#collectionItems").scrollToItem(window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]);
            window.appGlobals.cache.backToDomainCommunityItems[this.collection.id] =
                undefined;
        }
    }
    _forgotPassword() {
        window.appDialogs.getDialogAsync("forgotPassword", (dialog) => {
            dialog.open = true;
        });
    }
    renderHeader() {
        return this.collection && !this.noHeader
            ? html `
          <div class="layout vertical center-center header">
            <yp-domain-header
              .collection="${this.collection}"
              .collectionType="${this.collectionType}"
              aria-label="${this.collectionType}"
              role="banner"
            ></yp-domain-header>
          </div>
        `
            : nothing;
    }
    renderDomainLogin() {
        return html `
      <div class="layout vertical center-center">
        <div class="layout vertical center-center outerContainer">
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
    render() {
        if (this.collection &&
            !this.loggedInUser &&
            this.collection.configuration
                .useLoginOnDomainIfNotLoggedIn) {
            return this.renderDomainLogin();
        }
        else if (this.collection &&
            !this.loggedInUser &&
            this.collection.configuration
                .welcomeHtmlInsteadOfCommunitiesList) {
            if (this.customWelcomeHtml) {
                return html `
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
            ?hidden="${!YpAccessHelpers.checkDomainAccess(this.collection)}"
          >
            <md-icon-button
              id="menuButton"
              @click="${this._openAdmin}"
              title="${this.t("domain.edit")}"
              ><md-icon>settings</md-icon>
            </md-icon-button>
          </div>
        `;
            }
            else {
                return html ``;
            }
        }
        else {
            return super.render();
        }
    }
};
__decorate([
    property({ type: String })
], YpDomain.prototype, "customWelcomeHtml", void 0);
__decorate([
    property({ type: Boolean })
], YpDomain.prototype, "useEvenOddItemLayout", void 0);
YpDomain = __decorate([
    customElement("yp-domain")
], YpDomain);
export { YpDomain };
//# sourceMappingURL=yp-domain.js.map