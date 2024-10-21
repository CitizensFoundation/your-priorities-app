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
import { YpNavHelpers } from "../common/YpNavHelpers.js";
let YpCommunity = class YpCommunity extends YpCollection {
    constructor() {
        super("community", "group", "edit", "group.new");
    }
    setupTheme() {
        const community = this.collection;
        try {
            if (community.configuration && community.configuration.theme) {
                window.appGlobals.theme.setTheme(undefined, community.configuration);
            }
            else if (community.configuration && community.configuration.themeOverrideColorPrimary) {
                window.appGlobals.theme.setTheme(community.theme_id, community.configuration);
            }
            else if (community.configuration && community.theme_id) {
                window.appGlobals.theme.setTheme(community.theme_id, community.configuration);
            }
            else if (community.Domain && community.Domain.configuration.theme) {
                window.appGlobals.theme.setTheme(undefined, community.Domain.configuration);
            }
            else if (community.Domain && community.Domain.configuration.themeOverrideColorPrimary) {
                window.appGlobals.theme.setTheme(community.Domain.theme_id, community.Domain.configuration);
            }
            else {
                window.appGlobals.theme.setTheme(community.theme_id || community.Domain?.theme_id || 1);
            }
        }
        catch (error) {
            console.error("Error setting community theme", error);
        }
    }
    refresh() {
        if (!this.collection)
            return;
        super.refresh();
        const isAdmin = YpAccessHelpers.checkCommunityAccess(this.collection);
        const community = this.collection;
        if (this.collection &&
            this.collection.configuration &&
            this.collection.configuration
                .redirectToGroupId &&
            !isAdmin) {
            YpNavHelpers.redirectTo("/group/" +
                this.collection.configuration
                    .redirectToGroupId);
        }
        else if (community) {
            this.collectionItems = community.Groups;
            this.setFabIconIfAccess(community.only_admins_can_create_groups, YpAccessHelpers.checkCommunityAccess(community));
            if (community.CommunityHeaderImages &&
                community.CommunityHeaderImages.length > 0) {
                this.headerImageUrl = YpMediaHelpers.getImageFormatUrl(community.CommunityHeaderImages, 0);
            }
            this.setupTheme();
            window.appGlobals.analytics.setCommunityAnalyticsTracker(community.google_analytics_code);
            window.appGlobals.analytics.setCommunityPixelTracker(community.configuration.facebookPixelId);
            if (this.collectionItems && this.collectionItems.length > 0) {
                window.appGlobals.setAnonymousGroupStatus(this.collectionItems[0]);
                window.appGlobals.setRegistrationQuestionGroup(this.collectionItems[0]);
            }
            this._hideMapIfNotUsedByGroups();
            this._openHelpPageIfNeededOnce();
            this._setupCommunityBackPath(community);
            this._setupCommunitySaml(community);
            if (community.configuration.signupTermsPageId &&
                community.configuration.signupTermsPageId != -1) {
                window.appGlobals.signupTermsPageId =
                    community.configuration.signupTermsPageId;
            }
            else {
                window.appGlobals.signupTermsPageId = undefined;
            }
            if (community.configuration &&
                community.configuration.highlightedLanguages) {
                window.appGlobals.setHighlightedLanguages(community.configuration.highlightedLanguages);
            }
            else {
                window.appGlobals.setHighlightedLanguages(undefined);
            }
        }
        window.appGlobals.disableFacebookLoginForGroup = false;
        window.appGlobals.externalGoalTriggerGroupId = undefined;
        window.appGlobals.currentGroup = undefined;
        this.requestUpdate();
    }
    _setupCommunitySaml(community) {
        if (community.configuration &&
            community.configuration.forceSecureSamlLogin &&
            !YpAccessHelpers.checkCommunityAccess(community)) {
            window.appGlobals.currentForceSaml = true;
        }
        else {
            window.appGlobals.currentForceSaml = false;
        }
        if (community.configuration &&
            community.configuration.customSamlDeniedMessage) {
            window.appGlobals.currentSamlDeniedMessage =
                community.configuration.customSamlDeniedMessage;
        }
        else {
            window.appGlobals.currentSamlDeniedMessage = undefined;
        }
        if (community.configuration &&
            community.configuration.customSamlLoginMessage) {
            window.appGlobals.currentSamlLoginMessage =
                community.configuration.customSamlLoginMessage;
        }
        else {
            window.appGlobals.currentSamlLoginMessage = undefined;
        }
    }
    scrollToGroupItem() {
        if (this.selectedTab === CollectionTabTypes.News &&
            window.appGlobals.cache.cachedActivityItem) {
            const list = this.$$("#collectionActivities");
            if (list) {
                list.scrollToItem(window.appGlobals.cache.cachedActivityItem);
                window.appGlobals.cache.cachedActivityItem = undefined;
            }
            else {
                console.warn("No community activities for scroll to item");
            }
        }
        else if (this.selectedTab === CollectionTabTypes.Collection &&
            this.collection) {
            if (window.appGlobals.cache.backToCommunityGroupItems &&
                window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]) {
                this.$$("#collectionItems").scrollToItem(window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]);
                window.appGlobals.cache.backToCommunityGroupItems[this.collection.id] =
                    undefined;
            }
        }
    }
    _setupCommunityBackPath(community) {
        if (community && window.location.href.indexOf("/community") > -1) {
            let backPath, headerTitle, headerDescription;
            if (community.CommunityFolder) {
                backPath = "/community_folder/" + community.CommunityFolder.id;
                headerTitle = community.CommunityFolder.name;
                headerDescription = community.CommunityFolder.description;
            }
            else {
                backPath = "/domain/" + community.domain_id;
                if (community.Domain) {
                    headerTitle = community.Domain.name;
                    headerDescription = community.Domain.description;
                }
            }
            this.fire("yp-change-header", {
                headerTitle: community.configuration && community.configuration.customBackName
                    ? community.configuration.customBackName
                    : headerTitle,
                headerDescription: headerDescription,
                headerIcon: "group-work",
                useHardBack: this._useHardBack(community.configuration),
                disableCollectionUpLink: community.configuration &&
                    community.configuration.disableCollectionUpLink === true,
                documentTitle: community.name,
                backPath: community.configuration && community.configuration.customBackURL
                    ? community.configuration.customBackURL
                    : backPath,
            });
        }
    }
    scrollToCollectionItemSubClass() {
        if (this.collection &&
            window.appGlobals.cache.backToCommunityGroupItems &&
            window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]) {
            this.$$("#collectionItems").scrollToItem(window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]);
            window.appGlobals.cache.backToCommunityGroupItems[this.collection.id] =
                undefined;
        }
    }
    async getCollection() {
        await super.getCollection();
        if (this.collection && this.collection.Domain) {
            window.appGlobals.setCurrentDomain(this.collection.Domain);
        }
    }
    _openHelpPageIfNeededOnce() {
        if (this.collection &&
            !sessionStorage.getItem("yp-welcome-for-community-" + this.collection.id)) {
            setTimeout(() => {
                if (this.collection &&
                    this.collection.configuration &&
                    this.collection.configuration.welcomePageId) {
                    this.fire("yp-open-page", {
                        pageId: this.collection.configuration.welcomePageId,
                    });
                    sessionStorage.setItem("yp-welcome-for-community-" + this.collection.id, "true");
                }
            }, 1200);
        }
    }
    _hideMapIfNotUsedByGroups() {
        let locationHidden = true;
        this.collectionItems?.forEach((group) => {
            if (group.configuration && group.configuration.locationHidden) {
                if (group.configuration.locationHidden != true) {
                    locationHidden = false;
                }
            }
            else {
                locationHidden = false;
            }
        });
        this.locationHidden = locationHidden;
    }
};
YpCommunity = __decorate([
    customElement("yp-community")
], YpCommunity);
export { YpCommunity };
//# sourceMappingURL=yp-community.js.map