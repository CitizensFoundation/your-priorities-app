var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { YpCollection, CollectionTabTypes } from "./yp-collection.js";
import { customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { html } from "lit";
let YpDomain = class YpDomain extends YpCollection {
    constructor() {
        super("domain", "community", "edit", "community.add");
    }
    refresh() {
        super.refresh();
        const domain = this.collection;
        if (domain) {
            window.appGlobals.domain = domain;
            window.appGlobals.analytics.setupGoogleAnalytics(domain);
            this.collectionItems = domain.Communities;
            this.setFabIconIfAccess(domain.only_admins_can_create_communities, YpAccessHelpers.checkDomainAccess(domain));
            if (domain.DomainHeaderImages && domain.DomainHeaderImages.length > 0) {
                YpMediaHelpers.setupTopHeaderImage(this, domain.DomainHeaderImages);
            }
            else {
                YpMediaHelpers.setupTopHeaderImage(this, null);
            }
            window.appGlobals.theme.setTheme(domain.theme_id, domain.configuration);
        }
        if (domain.configuration && domain.configuration.hideAllTabs) {
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
    render() {
        if (!this.loggedInUser &&
            this.collection &&
            this.collection.configuration
                .welcomeHTMLforNotLoggedInUsers) {
            return html `${unsafeHTML(this.collection.configuration
                .welcomeHTMLforNotLoggedInUsers)}`;
        }
        else {
            return super.render();
        }
    }
};
YpDomain = __decorate([
    customElement("yp-domain")
], YpDomain);
export { YpDomain };
//# sourceMappingURL=yp-domain.js.map