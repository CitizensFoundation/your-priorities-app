import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import { YpCollection } from './yp-collection.js';
import { YpCollectionItemsGrid } from './yp-collection-items-grid.js';
import { customElement, html, property, LitElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';

import '@material/mwc-tab';
import '@material/mwc-tab-bar';

import '../yp-post/yp-posts-list.js';
import '../yp-post/yp-post-card-add.js';
import { YpPostsList } from '../yp-post/yp-posts-list.js';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';

// TODO: Remove
interface AcActivity extends LitElement {
  scrollToItem(item: YpDatabaseItem): () => void;
  loadNewData(): () => void;
}

export const GroupTabTypes: Record<string, number> = {
  Open: 0,
  InProgress: 1,
  Successful: 2,
  Failed: 3,
  Newsfeed: 4,
  Map: 5,
};

@customElement('yp-post')
export class YpPost extends YpBaseElement {
  @property({ type: String })
  searchingFor: string | undefined;

  static get psroperties() {
    return {
      idRoute: Object,
      tabRoute: Object,
      idRouteData: Object,
      tabRouteData: Object,

      isAdmin: {
        type: Boolean,
        value: false
      },

      postId: {
        type: Number,
        value: null,
        observer: "_postIdChanged"
      },

      host: String,

      post: {
        type: Object,
        value: null,
        notify: true,
        observer: "_postChanged"
      },

      selectedTab: {
        type: String,
        value: 'debate',
        observer: '_selectedTabChanged'
      },

      small: {
        type: Boolean
      },

      method: {
        type: String
      },

      mapActive: {
        type: Boolean,
        value: false
      },

      wideWidth: {
        type: Boolean,
        value: false
      },

      createFabIcon: {
        type: String,
        value: "lightbulb-outline"
      },

      disableNewPosts: {
        type: Boolean,
        value: false
      },

      scrollToPointId: {
        type: String,
        value: null
      },

      locationHidden: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`

      .container {
        padding-top: 0;
        margin-top: -70px;
        height: 100%;
      }

      .topContainer {
        margin-top: 28px;
      }

      .flex {

      }

      .centerContainer {

      }

      .postHeader {
        padding: 16px;
        background-color: #fefefe;
        width: 940px;
      }

      .statusHeader {
        padding: 16px;
        background-color: #fefefe;
        width: 940px;
        margin-top: 16px;
        height: 48px;
      }

      .description {
        width: 510px;
        padding-left: 24px;
      }

      ac-activities {
        padding-top: 8px;
      }

      .statusColumn {
        width: 670px;
        padding-bottom: 16px;
      }

      .mainPage {
        background-color: #FFF;
      }

      yp-post-user-images {
        padding-top: 32px;
      }

      @media (max-width: 961px) {
        .postHeader {
          width: 600px;
        }
      }

      @media (max-width: 600px) {
        .postHeader {
          width: 400px;
        }

        .topContainer {
          margin-top: 16px;
        }
      }

      .createFab {
        position: fixed;
        bottom: 24px;
        right: 28px;
        background-color: var(--accent-color);
        color: #FFF;

        --paper-fab-iron-icon: {
          color: var(--icon-general-color, #FFF);
          height: 40px;
          width: 40px;
        }
      }

      .createFab[wide-layout] {
        width: 72px;
        height: 72px;
        --paper-fab-iron-icon: {
          color: var(--icon-general-color, #FFF);
          width: 50px;
          height: 50px;
        }
      }

      @media (max-width: 360px) {

        .centerContainer {

        }

        .postHeader {
          height: 100%;
          width: 360px;
          padding: 0;
        }

        .tabsMaterial {
          width: 360px;
        }

        .statusHeader {
          width: 360px;
          height: 120px;
          padding: 0px;
          padding-left: 20px;
        }

        .statusColumn {
          height: 60px;
          padding: 0px;
        }

        .description {
          width: 320px;
          padding: 8px;
          padding-left: 20px;
          padding-bottom: 16px;
        }

        .statusColumn {
          width: 320px;
        }
      }

      yp-ajax {
        background-color: var(--primary-background-color);
      }

      .mapContainer {
        margin: 24px;
        width: 960px;
        height: 500px;
      }

      .counterInfo {
        font-size: 11px;
      }

      .tabs {
        margin-top: 24px;
      }

      @media (max-width: 934px) {
        .mapContainer {
          margin: 16px;
          width: 800px;
          height: 400px;
        }
      }

      @media (max-width: 832px) {
        .mapContainer {
          margin: 8px;
          width: 600px;
          height: 340px;
        }
      }

      @media (max-width: 632px) {
        .mapContainer {
          margin: 8px;
          width: 400px;
          height: 300px;
        }
      }

      @media (max-width: 420px) {
        .mapContainer {
          margin: 8px;
          width: 330px;
          height: 250px;
        }
      }

      @media (max-width: 360px) {
        .mapContainer {
          margin: 8px;
          width: 280px;
          height: 200px;
        }
      }


      .tabs {
        width: 1100px;
        padding-top: 8px;
        padding-bottom: 8px;
      }

      .tab {
        width: 250px;
      }


      @media (max-width: 900px) {
        .tabs {
          max-width: 100%;
          font-size: 14px !important;
          word-wrap: break-word !important;
          margin-top: 8px;
          width: 100%;
          margin-bottom: 8px;
        }

        .tabs .tab {
          width: 100%;
          word-wrap: break-word !important;
          margin-left: 8px;
          margin-right: 8px;
        }

        .topArea {
          height: 300px;
        }

        .topArea[is-post] {
          min-height: 470px;
        }
      }

      @media (max-width: 380px) {
        .tabs {
          font-size: 12px !important;
        }

        .topArea[is-post] {
          min-height: 530px;
        }

        ac-activities {
          min-height: 600px !important;
        }
      }

      @media (max-width: 360px) {
        .tabs {
          font-size: 10px !important;
        }
      }

      .minHeightSection {
        min-height: 450px;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <div class="topContainer layout vertical center-center" is-post .createFabTitle="${this.t('point.add')}" @yp-create-fab-tap="${this._newPoint}">

      <yp-post-header id="postCard" class="largeCard" .post="${this.post}" @refresh="${this._refreshAjax}" .headermode></yp-post-header>

      <div class="layout horizontal center-center" ?hidden="${this.post.Group.configuration.hideAllTabs}">
        <paper-tabs id="paper_tabs" class="tabs" .selected="${this.selectedTab}" .attrForSelected="name" .focused="">
          <paper-tab .name="debate">
            <div class="layout vertical center-center tabCounterContainer">
              <span>${this.t('post.tabs.debate')} (<span id="tabCountDebate"></span>)</span>
            </div>
          </paper-tab>
          <paper-tab .name="news">${this.t('post.tabs.news')}</paper-tab>
          <paper-tab .name="location" ?hidden="${this.locationHidden}">${this.t('post.tabs.location')}</paper-tab>
          <paper-tab .name="photos">
            <div class="layout vertical center-center tabCounterContainer">
              <span>${this.t('post.tabs.photos')} (<span id="tabCountPhotos"></span>)</span>
            </div>
          </paper-tab>
        </paper-tabs>
      </div>

      <iron-pages id="pages" class="tabPages" .selected="${this.selectedTab}" attr-for-selected="name" entry-animation="fade-in-animation" exit-animation="fade-out-animation">
        <div .name="debate" class="layout horizontal center-center">
          <yp-post-points .host="${this.host}" id="pointsSection" ?isAdmin="${this.isAdmin}" .post="${this.post}" .scrollToId="${this.scrollToPointId}"></yp-post-points>
        </div>
        <section .name="news" class="minHeightSection">

          ${ this.newsTabSelected ? html`
          <ac-activities id="postNews" .selectedTab="${this.selectedTab}" .disableNewPosts="${this.disableNewPosts}" .postGroupId="${this.post.group_id}" .postId="${this.post.id}"></ac-activities>
          `: html``}

        </section>
        <section .name="location" class="minHeightSection">
          <div class="layout horizontal center-center">

            ${ this.post.location ? html`
              ${ this.mapActive ? html`
                <paper-material class="mapContainer" .elevation="3">
                  <google-map .additionalMapOptions="{'keyboardShortcuts':false}" .apiKey="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0" id="map" .libraries="places" class="map" .mapType="${this.post.location.mapType}" .zoom="${this.post.location.map_zoom}" ,fitToMarkers="">
                    <google-map-marker slot="markers" latitude="${this.post.location.latitude}" longitude="${this.post.location.longitude}" id="marker"></google-map-marker>
                  </google-map>
                </paper-material>
              `: html``}
            `: html``}

            ${ this.post ? html`
              ${ !this.post.location ? html`
                <h1 style="padding-top: 16px">${this.t('post.noLocation')}</h1>
              `: html``}
            `: html``}

          </div>
        </section>
        <section .name="photos" class="minHeightSection">
          <div class="layout vertical flex">
            <div class="layout horizontal center-center">
              <yp-post-user-images .post="${this.post}"></yp-post-user-images>
            </div>
          </div>
        </section>
      </iron-pages>
    </div>

    <app-route .route="${this.idRoute}" .pattern="/:id" .data="${this.idRouteData}" .tail="${this.tabRoute}">
    </app-route>

    <app-route .route="${this.tabRoute}" .pattern="/:tabName" .data="${this.tabRouteData}">
    </app-route>

    <iron-media-query .query="(min-width: 1024px)" queryMatches="${this.wideWidth}"></iron-media-query>

    <div class="create-fab-wrapper layout horizontal end-justified createFabContainer" ?hidden="${this.post.Group.configuration.hideNewPostOnPostPage}">

      ${ !this.disableNewPosts ? html`
        <paper-fab class="createFab" .icon="${this.createFabIcon}" .elevation="5" .wideLayout="${this.wideWidth}" title="${this.t('post.new')}" @tap="${this._newPost}"></paper-fab>
      `: html``}
    </div>

    <div class="layout horizontal center-center">
      <yp-ajax id="ajax" @response="${this._handleIncomingPostResponse}"></yp-ajax>
      <yp-ajax id="pagesAjax" @response="${this._pagesResponse}"></yp-ajax>
    </div>
    `
  }


/*
  behaviors: [
    ypThemeBehavior,
    YpNewsTabSelected,
    ypGotoBehavior,
    ypMediaFormatsBehavior,
    ypNumberFormatBehavior,
    ypTruncateBehavior
  ],


  observers: [
    '_routeIdChanged(idRouteData.id)',
    '_routeTabChanged(tabRouteData.tabName)'
  ],
*/

  _routeIdChanged(newId) {
    if (newId) {
      this.postId = newId;
    }
  }

  _routeTabChanged(newTabName) {
    if (newTabName && !this._isNumber(newTabName)) {
      this.selectedTab = newTabName;
    } else if (newTabName && this._isNumber(newTabName)) {
      this.scrollToPointId = newTabName;
      this.selectedTab = 'debate';
    }
  }

  _isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  _selectedTabChanged(tabName) {
    if (this.post) {
      this.redirectTo("/post/" + this.post.id + '/' + tabName);
    }

    if (tabName == "location") {
      this.mapActive = true;
    } else {
      this.mapActive = false;
    }

    if (tabName && window.appGlobals) {
      window.appGlobals.activity('open', 'post_tab_' + tabName, '', { id: this.postId, modelType: "post" });
    }

    this.async(function () {
      const news = this.$$("#postNews");
      if (news) {
        news.fireResize();
      }
    }, 300);
  }

  _newPost() {
    window.appGlobals.activity('open', 'newPost');
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {groupId: this.post.Group.id, group: this.post.Group});
    }.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-debate-info', this._updateDebateInfo);
    this.addListener('yp-post-image-count', this._updatePostImageCount);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-debate-info', this._updateDebateInfo);
    this.removeListener('yp-post-image-count', this._updatePostImageCount);
  }


  _updatePostImageCount(event, imageCount) {
    const tabCounter = this.$$('#tabCountPhotos');
    if (tabCounter) {
      tabCounter.innerHTML = this.formatNumber(imageCount);
    }
  }

  _updateDebateInfo(event, detail) {
    const tabCounter = this.$$('#tabCountDebate');
    if (tabCounter) {
      tabCounter.innerHTML = this.formatNumber(detail.count);
    }
    if (detail.firstPoint) {
      this.$$("#postCard").updateDescriptionIfEmpty(detail.firstPoint.content);
    }
  }

  _mainContainerClasses(small) {
    if (small) {
      return "layout horizontal wrap";
    } else {
      return "layout horizontal center-center";
    }
  }

  _headerClasses(small) {
    if (small) {
      return "layout vertical postHeader wrap";
    } else {
      return "layout horizontal postHeader";
    }
  }

  postName(post) {
    if (post && post.name) {
      return this.truncate(this.trim(post.name), 200);
    } else if (post) {
      return post.short_name;
    }
  }

  postDescription(post) {
    if (post && post.description) {
      return this.truncate(this.trim(post.description), 10000, '...');
    } else {
      return "";
    }
  }

  _refreshAjax() {
    this.$$("#ajax").generateRequest();
  }

  _postChanged(newValue, oldValue) {
    if (post) {
      this.isAdmin = this.checkPostAdminOnlyAccess(post);
    } else {
      this.isAdmin = false;
    }
  }

  _postIdChanged(postId) {
    const cachedItem = window.appGlobals.cachedPostItem;
    if (cachedItem && cachedItem.id==postId) {
      this._setupAjaxUrl();
      this._handleIncomingPostResponse(null, { response: cachedItem });
      console.log("Got post from item cache");
    } else if (window.appGlobals.getPostFromCache(postId)) {
      this._setupAjaxUrl();
      this._handleIncomingPostResponse(null, { response: window.appGlobals.getPostFromCache(postId), fromCache: true });
      console.log("Got post from cache possibly from recommendations");
    } else {
      console.log("Got post from server not cache");
      this.post =null;
      if (postId) {
        this._getPost();
        this.selectedTab = 'debate';
      }
    }
  }

  _setupAjaxUrl() {
    if (this.host) {
      this.$$("#ajax").url = this.host+'/api/posts/' + this.postId;
    } else {
      this.$$("#ajax").url = '/api/posts/' + this.postId;
    }
  }

  _pagesResponse(event, detail) {
    this.fire('yp-set-pages', detail.response);
  }

  _getPost() {
    this._setupAjaxUrl();
    this.$$('#ajax').retryMethodAfter401Login = this._getPost.bind(this);
    this.$$("#ajax").generateRequest();
  }

  _handleIncomingPostResponse(event, detail) {
    this.post = detail.response;

    this.refresh();

    if (this.post.Group.configuration && this.post.Group.configuration.canAddNewPosts!=undefined) {
      if (this.post.Group.configuration.canAddNewPosts===true) {
        this.disableNewPosts = false;
      } else {
        this.disableNewPosts = true;
      }
    } else {
      this.disableNewPosts = false;
    }

    if (!detail.fromCache)
      window.appGlobals.addPostsToCacheLater([this.post]);
    window.appGlobals.getNextRecommendationForGroup(this.post.group_id, this.post.id, this._processRecommendation.bind(this));
  }

  _processRecommendation(recommendedPost) {
     if (recommendedPost && this.post) {
       const postName = recommendedPost.name;
       if (this.wideWidth) {
         postName = this.truncate(postName, 60);
       } else {
         postName = this.truncate(postName, 30);
       }

       this.fire("yp-set-next-post", {
         currentPostId: this.post.id,
         goForwardToPostId: recommendedPost.id,
         goForwardPostName: postName
       });
     } else {
       this.fire("yp-set-next-post", {
         currentPostId: this.post.id,
         goForwardToPostId: null,
         goForwardPostName: null
       });
       console.log("Not recommended post");
     }
  }

  refresh() {
    if (this.post) {
      if (this.post.Group.theme_id!=null ||
        (this.post.Group.configuration && this.post.Group.configuration.themeOverrideColorPrimary!=null)) {
        this.setTheme(this.post.Group.theme_id, this.post.Group.configuration);
      } else if (this.post.Group.Community &&
                (this.post.Group.Community.theme_id!=null ||
                  (this.post.Group.Community.configuration && this.post.Group.Community.configuration.themeOverrideColorPrimary))) {
        this.setTheme(this.post.Group.Community.theme_id, this.post.Group.Community.configuration);
      } else {
        this.setTheme(1);
      }


      if (!this.post.Group.Community) {
        console.error("No community!");
        debugger;
      }

      if (window.appGlobals) {
        window.appGlobals.setCommunityAnalyticsTracker(this.post.Group.Community.google_analytics_code);

        if (this.post.Group.Community.configuration) {
          window.appGlobals.setCommunityPixelTracker(this.post.Group.Community.configuration.facebookPixelId);
        }
        window.appGlobals.setAnonymousGroupStatus(this.post.Group);
      }

      if (this.post.Group.configuration && this.post.Group.configuration.defaultLocale!=null) {
        window.appGlobals.changeLocaleIfNeeded(this.post.Group.configuration.defaultLocale);
      }

      if (this.post.Group.configuration && this.post.Group.configuration.locationHidden!=undefined) {
        this.locationHidden = this.post.Group.configuration.locationHidden;
      } else {
        this.locationHidden = false;
      }

      /*
      if (this.post.Group.GroupHeaderImages && this.post.Group.GroupHeaderImages.length>0) {
        this.setupTopHeaderImage(this.post.Group.GroupHeaderImages);
      } else  if (this.post.Group.Community.CommunityHeaderImages && this.post.Group.Community.CommunityHeaderImages.length>0) {
        this.setupTopHeaderImage(this.post.Group.Community.CommunityHeaderImage);
      }
      */
      this.fire("change-header", { headerTitle: this.truncate(this.post.Group.name,80),
        documentTitle: this.post.name,
        headerDescription: '',//this.truncate(this.post.Group.objectives,45),
        backPath: "/group/" + this.post.group_id,
        backListItem: this.post,
        hideHelpIcon: (this.post.Group.configuration && this.post.Group.configuration.hideHelpIcon) ? true : null,
      });

      this.$$("#pagesAjax").url = "/api/groups/"+this.post.Group.id+"/pages";
      this.$$("#pagesAjax").generateRequest();

      if (this.post.Group.configuration && this.post.Group.configuration.disableFacebookLoginForGroup===true) {
        window.appGlobals.disableFacebookLoginForGroup = true;
      } else {
        window.appGlobals.disableFacebookLoginForGroup = false;
      }
      this.fire('yp-set-home-link', {
        type: 'group',
        id: this.post.Group.id,
        name: this.post.Group.name
      });

      if (this.post.Group && this.post.Group.Community && this.post.Group.Community.configuration &&
        this.post.Group.Community.configuration.signupTermsPageId &&
        this.post.Group.Community.configuration.signupTermsPageId!=-1) {
        window.appGlobals.signupTermsPageId = this.post.Group.Community.configuration.signupTermsPageId;
      } else {
        window.appGlobals.signupTermsPageId = null;
      }

      window.appGlobals.currentGroup = this.post.Group;

      if ((this.post.Group.configuration &&
        this.post.Group.configuration.forceSecureSamlLogin &&
        !this.checkGroupAccess(this.post.Group)) ||
        (this.post.Group.Community &&
          this.post.Group.Community.configuration &&
          this.post.Group.Community.configuration.forceSecureSamlLogin &&
          !this.checkCommunityAccess(this.post.Group.Community))) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }

      if ((this.post.Group.configuration && this.post.Group.configuration.forceSecureSamlLogin) ||
        (this.post.Group.Community && this.post.Group.Community.configuration && this.post.Group.Community.configuration.forceSecureSamlLogin)) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }

      if (this.post.Group.Community && this.post.Group.Community.configuration && this.post.Group.Community.configuration.customSamlDeniedMessage) {
        window.appGlobals.currentSamlDeniedMessage = this.post.Group.Community.configuration.customSamlDeniedMessage;
      } else {
        window.appGlobals.currentSamlDeniedMessage = null;
      }

      if (this.post.Group.Community.configuration && this.post.Group.Community.configuration.customSamlLoginMessage) {
        window.appGlobals.currentSamlLoginMessage = this.post.Group.Community.configuration.customSamlLoginMessage;
      } else {
        window.appGlobals.currentSamlLoginMessage = null;
      }
    }
  }

  setupTopHeaderImage(image) {
    const url = 'url(' + this.getImageFormatUrl(image, 0) + ')';
    this.updateStyles({ '--top-area-background-image': url });
  }

  computeUrl(post_id) {
    return '/api/posts/' + post_id;
  }
}

window.customELements.define('yp-post-lit', YpPostLit)