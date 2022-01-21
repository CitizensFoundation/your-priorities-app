import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/app-route/app-route.js';
import { CollectionHelpers } from '../yp-behaviors/collection-helpers.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { ypDetectOldiOs } from '../yp-behaviors/yp-detect-old-ios.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import '../ac-activities/ac-activities.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-page/yp-page.js';
import { CommunityCollectionBehaviors } from './yp-community-collection-behaviors.js';
import './yp-community-grid.js';
import './yp-community-header.js';
import './yp-community-large-card.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpCommunityFolderLit extends YpBaseElement {
  static get properties() {
    return {
      idRoute: Object,
      tabRoute: Object,
      idRouteData: Object,
      tabRouteData: Object,
      createFabIcon: {
        type: String,
        value: null,
        notify: true
      },

      communityFolderId: {
        type: Number,
        value: null,
        observer: "_communityFolderIdChanged"
      },

      communityFolder: {
        type: Object
      },

      mapActive: {
        type: Boolean,
        value: false
      },

      locationHidden: {
        type: Boolean,
        value: false
      },

      useAlternativeHeader: {
        type: Boolean,
        value: false
      },

      isOldiOs: {
        type: Boolean,
        computed: '_isOldiOs(communityFolderId)'
      },

      useNormalHeader: {
        type: Boolean,
        value: true
      }
    }
  }

  static get styles() {
    return [
      css`

    .card {
        padding: 16px;
    }

      yp-ajax {
        background-color: var(--primary-background-color) !important;
      }

      .archivedText {
        font-size: 26px;
        color: #333;
      }

      .minHeightSection {
        min-height: 450px;
      }

      #paper_tabs[apple] {
        margin-top: 42px;
        margin-bottom: 8px;
      }

      [hidden] {
        display: none !important;
      }

      `, YpFlexLayout]
    }

  render() {
    return html`
    <yp-page id="page" .createFabIcon="${this.createFabIcon}" .hideAllTabs="" .createFabTitle="${t(this.group.add)}" @yp-create-fab-tap="${this._newGroup}">

      <yp-community-large-card id="communityCard" slot="largeCard" class="largeCard card" .community="${this.communityFolder}" @update-community="${this._refreshAjax}"></yp-community-large-card>

      <div class="layout horizontal center-center wrap" slot="tabPages">
        <yp-community-grid .featuredCommunities="${this.featuredCommunities}" .activeCommunities="${this.activeCommunities}" .archivedCommunities="${this.archivedCommunities}" .hideAdd="${!this.createFabIcon}" @add-new-community="${this._newCommunity}">
        </yp-community-grid>
      </div>
    </yp-page>

    <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>
    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>
    <lite-signal @lite-signal-got-admin-rights="${this._gotAdminRights}"></lite-signal>

    <app-route .route="${this.idRoute}" .pattern="/:id" .data="${this.idRouteData}" .tail="${this.tabRoute}">
    </app-route>

    <app-route .route="${this.tabRoute}" .pattern="/:tabName" .data="${this.tabRouteData}">
    </app-route>

    <yp-ajax id="ajax" url="/api/domains" @response="${this._response}"></yp-ajax>
    <yp-ajax id="pagesAjax" @response="${this._pagesResponse}"></yp-ajax>
`
}

/*
behaviors: [
  CommunityCollectionBehaviors,
  ypThemeBehavior,
  CollectionHelpers,
  AccessHelpers,
  ypLoggedInUserBehavior,
  ypDetectOldiOs,
  ypGotoBehavior,
  ypMediaFormatsBehavior
],
*/

  _userLoggedIn(user) {
    if (user) {
      if (this.communityFolder && window.location.href.indexOf("/community_folder/") > -1) {
        this.$$('#ajax').generateRequest();
      }
    }
  }

  _routeIdChanged(newId) {
    if (newId) {
      this.communityFolderId = newId;
    }
  }

  _hideEdit() {
    if (!this.communityFolder)
      return true;

    if (!window.appUser.loggedIn())
      return true;

    return (window.appUser.user.id!=this.communityFolder.user_id);
  }

  _communityHeaderUrl(communityFolder) {
    return this.getImageFormatUrl(communityFolder.CommunityHeaderImages, 2);
  }

  _communityFolderIdChanged(newValue, oldValue) {
    if (newValue) {
      this.communityFolder = null;
      this.featuredCommunities =null;
      this.activeCommuntities =null;
      this.archivedCommunities = null;
      this._getCommunityFolder();
    }
  }

  _getCommunityFolder() {
    this.$$('#ajax').url = '/api/communities/' + this.communityFolderId + '/communityFolders';
    this.$$('#ajax').retryMethodAfter401Login = this._getCommunityFolder.bind(this);
    this.$$('#ajax').generateRequest();
  }

  _refreshAjax() {
    this.async(function () {
      this.$$('#ajax').generateRequest();
    }, 100);
  }

  _newCommunity() {
    window.appGlobals.activity('open', 'newCommunity');
    dom(document).querySelector('yp-app').getDialogAsync("communityEdit", function (dialog) {
      dialog.setup(null, true, this._refreshAjax.bind(this));
      dialog.open('new', {domainId: this.domainId, communityFolderId: this.communityFolderId } );
    }.bind(this));
  }

  _pagesResponse(event, detail) {
    this.fire('yp-set-pages', detail.response);
  }

  _response(event, detail, sender) {
    this.communityFolder = detail.response;

    if (!this.communityFolder.is_community_folder) {
      this.redirectTo("/community/"+this.community.id);
    } else {
      this.refresh();

      this.createFabIcon = null;

      /*if (false && !this.communityFolder.Domain.only_admins_can_create_communities || this.checkDomainAccess(this.communityFolder.Domain)) {
        this.createFabIcon', 'group-work');
      } else {
      }*/

      const url = this._communityHeaderUrl(this.communityFolder);

      this.setupCommunities(this.communityFolder.Communities);
    }
  }

  _gotAdminRights(event, detail) {
    if (detail && detail>0) {
      if (this.checkCommunityAccess(this.communityFolder)) {
        this.createFabIcon = 'add';
      }
    }
  }

  refresh() {
    if (this.communityFolder) {
      this.fire('yp-set-home-link', { type: 'communityFolder', id: this.communityFolder.id, name: this.communityFolder.name });

      if (this.communityFolder.theme_id!=null || (this.communityFolder.configuration && this.communityFolder.configuration.themeOverrideColorPrimary!=null)) {
        this.setTheme(this.communityFolder.theme_id, this.communityFolder.configuration);
      } else if (this.communityFolder.Domain.theme_id!=null) {
        this.setTheme(this.communityFolder.Domain.theme_id);
      }

      if (this.communityFolder.default_locale!=null) {
        window.appGlobals.changeLocaleIfNeeded(this.communityFolder.default_locale);
      }

      if (this.communityFolder.CommunityHeaderImages && this.communityFolder.CommunityHeaderImages.length>0) {
        this.$$("#page").setupTopHeaderImage(this.communityFolder.CommunityHeaderImages);
      } else {
        this.$$("#page").setupTopHeaderImage(null);
      }

      if (window.location.href.indexOf("/community_folder") > -1) {
        let backPath, headerTitle, headerDescription;
        if (this.communityFolder.CommunityFolder) {
          backPath = "/community_folder/" + this.communityFolder.CommunityFolder.id;
          headerTitle = this.communityFolder.CommunityFolder.name;
          headerDescription = this.communityFolder.CommunityFolder.description;
        } else {
          backPath = "/domain/" + this.communityFolder.domain_id;
          headerTitle = this.communityFolder.Domain.name;
          headerDescription = this.communityFolder.Domain.description;
        }
        this.fire("change-header", {
          headerTitle: headerTitle,
          headerDescription: headerDescription,
          headerIcon: "group-work",
          disableDomainUpLink: false,
          documentTitle: this.communityFolder.name,
          backPath: backPath
        });
      }
      this.$$("#pagesAjax").url = "/api/domains/"+this.communityFolder.Domain.id+"/pages";
      this.$$("#pagesAjax").generateRequest();
      window.appGlobals.disableFacebookLoginForGroup = false;
      window.appGlobals.externalGoalTriggerGroupId = null;
      window.appGlobals.currentGroup = null;

      if (this.communityFolder.configuration &&
        this.communityFolder.configuration.forceSecureSamlLogin &&
        !this.checkCommunityAccess(this.community)) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }

      if (this.communityFolder.configuration && this.communityFolder.configuration.customSamlDeniedMessage) {
        window.appGlobals.currentSamlDeniedMessage = this.communityFolder.configuration.customSamlDeniedMessage;
      } else {
        window.appGlobals.currentSamlDeniedMessage = null;
      }

      if (this.communityFolder.configuration && this.communityFolder.configuration.customSamlLoginMessage) {
        window.appGlobals.currentSamlLoginMessage = this.communityFolder.configuration.customSamlLoginMessage;
      } else {
        window.appGlobals.currentSamlLoginMessage = null;
      }


      if (this.communityFolder.configuration && this.communityFolder.configuration.signupTermsPageId &&
        this.communityFolder.configuration.signupTermsPageId!=-1) {
        window.appGlobals.signupTermsPageId = this.communityFolder.configuration.signupTermsPageId;
      } else {
        window.appGlobals.signupTermsPageId = null;
      }

      if (this.communityFolder.configuration.highlightedLanguages) {
        window.appGlobals.setHighlightedLanguages(this.communityFolder.configuration.highlightedLanguages);
      } else {
        window.appGlobals.setHighlightedLanguages(null);
      }
    }
  }
}

window.customElements.define('yp-community-folder-lit', YpCommunityFolderLit)