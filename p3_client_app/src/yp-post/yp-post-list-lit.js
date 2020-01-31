import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-list/iron-list.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypIronListBehavior } from '../yp-behaviors/yp-iron-list-behavior.js';
import '../yp-ajax/yp-ajax.js';
import './yp-post-card.js';
import '../yp-posts-filter/yp-posts-filter.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpPostListLit extends YpBaseElements {
  static get properties() {
    return {

      wide: Boolean,
  
      categories: {
        type: Array
      },
  
      subTitle: {
        type: String,
        notify: true
      },
  
      defaultCategories: {
        type: Boolean,
        value: false
      },
  
      posts: {
        type: Array,
        value: null,
        notify: true
      },
  
      groupId: {
        type: Number,
        observer: "_groupIdChanged"
      },
  
      userId: {
        type: Number
      },
  
      group: {
        type: Object,
        notify: true,
        observer: "_groupChanged"
      },
  
      filter: {
        type: String,
        value: "newest",
        observer: "_filterChanged"
      },
  
      statusFilter: {
        type: String,
        value: "open",
        notify: true
      },
  
      categoryId: {
        type: String,
        observer: "_categoryIdChanged"
      },
  
      postsCount: {
        type: Number,
        notify: true
      },
  
      searchTarget: {
        type: Object,
        computed: '_searchTarget(noPosts)'
      },
  
      categoryName: {
        type: String
      },
  
      searchingFor: {
        type: String,
        value: null,
        observer: "_searchingForChanged"
      },
  
      selectedCategoryName: {
        type: String
      },
  
      selectedTab: {
        type: String,
        observer: '_selectedTabChanged'
      },
  
      tabCounterId: {
        type: String
      },
  
      oldestPostAt: {
        type: Date
      },
  
      noPosts: {
        type: Boolean,
        value: false
  
      },
  
      wideListOffset: {
        type: Number,
        value: 610
      },
  
      listOffset: {
        type: String,
        value: "500px"
      },
  
      showSearchIcon: {
        type: Boolean,
        value: false
      },
  
      randomSeed: {
        type: Number,
        value: null
      },
  
      scrollOffset: {
        type: Number,
        computed: '_scrollOffset(wide, group, selectedTab)'
      },
    }
  }

static get styles() {
  return [
    css`

      .container {

      }

      .postsFilter {
        padding-left: 16px;
        height: 36px;
      }

      .objectives {
        padding-bottom: 40px;
        max-width: 432px;
      }

      .description {
        padding: 12px;
      }


      yp-post-card {
        padding-bottom: 52px;
      }

      #outerRegion {

      }

      #scrollableRegion {
      }

      iron-list {
        height: 100vh;
      }

      yp-ajax {
        padding-top: 48px;
      }


      yp-posts-filter {
        margin-bottom: 8px;
        margin-left: 8px;
        margin-top: 16px;
      }

      #ironList {
      }

      .searchButton {
        padding: 8px;
        margin: 8px;
      }

      .searchContainer {
        margin-top: 8px;
      }

      yp-posts-filter {
        padding-right: 16px;
      }

      .half {
        width: 50%
      }

      .searchBox {
        --paper-input-container-label: {
          font-size: 23px;
          color: #555;
        };
        margin-bottom: 22px;
        margin-right: 8px;
      }

      @media (max-width: 800px) {

        .searchBox {
          --paper-input-container-label: {
            font-size: 18px;
          };
          margin-bottom: 8px;
        }

        .searchBox {
          margin-top: 8px;
        }

        .half {
          width: 100%;
        }

        .searchContainer {
          margin-top: 0;
        }

        .postsFilter {
          padding-left: 16px;
          width: 215px !important;
        }

      }

      .noIdeas {
        background-color: #FFF;
        max-width: 200px;
        padding: 16px;
        margin: 16px;
        margin-top: 32px;
      }

      .noIdeasText {
        font-weight: bold;
      }

      .card {
        padding: 0;
        padding-top: 8px;
      }

      .card[wide-padding] {
        padding: 16px !important;
      }

      #searchInput {
        margin-left: 8px;
      }

      [hidden] {
        display: none !important;
      }

      :focus {
        outline: none;
      }

      .largeAjax {
        position: absolute;
        bottom: 32px;
      }
    `, YpFlexLayout]  
  }
 
  render() {
    return html`
      ${this.post ? html`

    <iron-a11y-keys id="a11y" .target="${this.searchTarget}" .keys="enter" on-keys-pressed="_search"></iron-a11y-keys>

    <div class="layout vertical center-center">
      <div class="searchContainer layout horizontal center-center wrap" ?hidden="${this.group.configuration.hidePostFilterAndSearch}">
        <div class="layout horizontal center-center">
          <yp-posts-filter @tap="${this._tapOnFilter}" .sub-title="${this.subTitle}" class="filter" id="postsFilter" .tabName="${this.statusFilter}" @refresh-group="${this._refreshGroupFromFilter}" .group="${this.group}" .filter="${this.filter}" .searchingFor="${this.searchingFor}" .categoryId="${this.categoryId}" .categoryName="${this.categoryName}" .postsCount="${this.postsCount}">
          </yp-posts-filter>
        </div>
        <div class="layout horizontal center-center">
          <paper-input id="searchInput" .label="${this.t('searchFor')}" .value="${this.searchingFor}" class="searchBox">
          </paper-input>
          <paper-icon-button .ariaLabel="${this.t('startSearch')}" .icon="search" @tap="${this._search}" ?hidden="${!this.showSearchIcon}"></paper-icon-button>
        </div>
      </div>

      ${ this.noPosts ? html`
        <div class="layout horiztonal center-center">
          <paper-material class="noIdeas layout horizontal center-center" .elevation="2">
            <div class="noIdeasText">${this.t('noIdeasHere')}</div>
          </paper-material>
        </div>
      `: html``}
      <div class="layout horizontal center-center">
        <iron-list id="ironList" .scroll-offset="${this.scrollOffset}" .items="${this.posts}" as="post" .scroll-target="document" grid="${this.wide}">
          <template>
            <div .tabindex="${this.tabIndex}" widePadding="${this.wide}" class="card layout vertical center-center">
              <yp-post-card class="card" .post="${this.post}" .on-mouseover="cardMouseOver" .on-mouseout="cardMouseOut"></yp-post-card>
            </div>
          </template>
        </iron-list>
      </div>

      <div class="layout horizontal center-center largeAjax">
        <yp-ajax id="ajax" .large-spinner @response="${this._postsResponse}"></yp-ajax>
      </div>
    </div>
` : html``}
`
  }

/*
  behaviors: [
    ypLanguageBehavior,
    ypIronListBehavior
  ],
*/
 

  _scrollOffset(wide, group) {
    var list = this.$$("iron-list");
    if (list) {
      var offset = list.offsetTop;
      offset -= 75;
      if (list.offsetTop>0 && offset>0) {
        console.info("Post list scroll offset: "+offset);
        return offset;
      } else {
        if (wide)
          offset = 550;
        else
          offset = 700;

        if (group && group.configuration) {
          if (group.configuration.hideAllTabs)
            offset -= 60;
          if (group.configuration.hideNewPost)
            offset -= 100;
          if (group.configuration.hidePostFilterAndSearch)
            offset -= 100;
        }

        console.info("Post list (manual) scroll offset: "+offset);
        return offset;
      }
    } else {
      console.warn("No list for scroll offset");
      return null;
    }
  }

  _tapOnFilter() {
    window.appGlobals.activity('click', 'filter');
  }

  _searchTarget(noPosts) {
    if (!noPosts) {
      this.async(function () {
        return this.$$("#searchInput");
      });
    }
  }

  _selectedTabChanged(selectedTab) {
    if (this.statusFilter==selectedTab) {
      //this._loadMoreData();
    }
  }

  _search() {
    window.appGlobals.activity('click', 'search');
    if (this.searchingFor && this.searchingFor!='') {
      this._refreshGroupFromFilter();
    }
  }

  cardMouseOver(event) {
    event.currentTarget.elevation = 4;
  }

  cardMouseOut(event) {
    event.currentTarget.elevation = 1;
  }

  buildPostsUrlPath() {
    return this.$.postsFilter.buildPostsUrlPath();
  }

  _searchingForChanged(newValue, oldValue) {
    this.set('moreToLoad', true);
    if (newValue && newValue!='') {
      this.set('showSearchIcon', true);
    } else {
      this.set('showSearchIcon', false);
    }
  }

  _filterChanged(newValue, oldValue) {
    this.set('moreToLoad', true);
  }

  _categoryIdChanged(newValue, oldValue) {
    this.set('moreToLoad', true);
  }

  scrollToPost(post) {
    if (post && this.posts) {
      console.info("Scrolling to post: "+post.id);
      this.$.ironList.scrollToItem(post);
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'yp-refresh-activities-scroll-threshold', data: {} }
        })
      );
    } else {
      console.error("No post id on goToPostId");
    }
  }

  _groupIdChanged(newValue, oldValue) {
  }

  _groupChanged(group) {
    this.set("posts", null);
    this.set('noPosts', false);
    this.set('randomSeed', Math.random());
    if (group) {
      this.set('moreToLoad', true);
      if (group.configuration && group.configuration.canAddNewPosts!=undefined) {
        if (group.configuration.canAddNewPosts===true) {
          this.set('filter','newest');
        } else if (group.configuration.canAddNewPosts===false && group.configuration.canVote===false) {
          this.set('filter','top');
        } else {
          this.set('filter','random');
        }
      } else if (!this.filter) {
        this.set('filter','newest');
      }
      this._loadMoreData();
    }
  }

  _refreshGroupFromFilter() {
    this.set("posts", null);
    this.set('moreToLoad', true);
    this._loadMoreData();
  }

  _loadMoreData() {
    if (this.moreToLoad && this.group) {
      console.info("_loadMoreData for groupId: "+this.groupId+" statusFilter: "+this.statusFilter);

      this.set('moreToLoad', false);
      this.set('noPosts', false);
      var objectId, objectType;

      if (this.userId) {
        objectId = this.userId + '/posts';
        objectType = 'users';
      } else {
        objectId = this.groupId;
        objectType = 'groups';
      }

      if (this.searchingFor) {
        this.$$('#ajax').url = '/api/' + objectType + '/' + objectId+ '/search/' + this.searchingFor;
      } else {
        this.$$('#ajax').url = '/api/' + objectType + '/' + objectId + '/posts/' + this.filter;
        if (this.categoryId) {
          this.$$('#ajax').url += '/' + this.categoryId;
        } else {
          this.$$('#ajax').url += '/null';
        }
        this.$$('#ajax').url += '/'+this.statusFilter;
      }
      this.$$('#ajax').url += "?offset="+(this.posts!=null ? this.posts.length : 0);
      if (this.randomSeed) {
        this.$$('#ajax').url += "&randomSeed="+this.randomSeed;
      }
      this.$$('#ajax').generateRequest();
    }
  }

  _postsResponse(event, detail, sender) {
    var posts = detail.response.posts;
    this.set('postsCount', detail.response.totalPostsCount);
    this.fire('yp-post-count', {
      tabCounterId: this.tabCounterId,
      count: this.postsCount
    } );

    if (!this.posts) {
      this.set('posts', posts);
    } else {
      for (var i = 0; i < posts.length; i++) {
        this.push('posts', posts[i]);
      }
    }

    if (posts.length==0 && (this.posts==null || this.posts.length==0)) {
      this.set('noPosts', true);
    }

    if (posts.length>0) {
      this.set('noPosts', false);
    } else {
      if (this.searchingFor && this.searchingFor!="") {
        this.set('noPosts', false);
      }
    }

    this.async(function () {
      var postFilter = this.$$("#postsFilter");
      if (postFilter) {
        postFilter._updateTitle();
      }
    }, 20);

    this.async(function () {
      this.$$("#ironList").fire('iron-resize');
    });

    if (posts.length>0 && posts.length!=this.postsCount) {
      this.set('moreToLoad', true);
    }

    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-refresh-activities-scroll-threshold', data: {} }
      })
    );

    this._processCategories();
    this._checkForMultipleLanguages(posts);
    window.appGlobals.addPostsToCacheLater(posts);
  }

  _checkForMultipleLanguages(posts) {
    if (!localStorage.getItem("dontPromptForAutoTranslation") &&
        !sessionStorage.getItem("dontPromptForAutoTranslation")) {
      var firstLanguage=null;
      var firstContent=null;
      var multipleLanguages = false;
      posts.forEach(function (post) {
        if (post.language && !multipleLanguages) {
          if (!firstLanguage && post.language!=='??') {
            firstLanguage = post.language;
            firstContent = post.description;
          } else if (firstLanguage && firstLanguage!==post.language && post.language!=='??') {
            multipleLanguages = true;
            console.info("Multiple post languages: "+firstLanguage+" and "+post.language);
            console.info("A: "+firstContent+" B: "+post.description);
          }
        }
      });

      if (multipleLanguages) {
        dom(document).querySelector('yp-app').getDialogAsync("autoTranslateDialog", function (dialog) {
          dialog.openLaterIfAutoTranslationEnabled();
        }.bind(this));
      }
    }
  }

  _processCategories() {
    if (this.categoryId && this.group) {
      for (var i = 0; i < this.group.Categories.length; i++) {
        if (this.group.Categories[i].id == this.categoryId) {
          this.selectedCategoryName = this.group.Categories[i].name;
          //this.$.layout.updateFilter();
        }
      }
    } else {
      this.selectedCategoryName = 'categories.all';
      //this.$.layout.updateFilter();
    }
  }
}

window.customElements.define('yp-post-list-lit', YpPostListLit)