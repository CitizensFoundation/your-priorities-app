import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-list/iron-list.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypIronListBehavior } from '../yp-behaviors/yp-iron-list-behavior.js';
import '../yp-ajax/yp-ajax.js';
import './yp-post-card.js';
import '../yp-posts-filter/yp-posts-filter.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">

      :host {
      }

      .container {
        @apply --layout-horizontal;
        @apply --layout-wrap;
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
        position: relative;
        @apply --layout-vertical;

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
          font-size: 22px;
          color: #555;
        };
        margin-bottom: 22px;
        margin-right: 8px;
      }

      @media (max-width: 800px) {

        .searchBox {
          --paper-input-container-label: {
            font-size: 17px;
          };
          margin-bottom: 8px;
        }

        .half {
          width: 100%;
        }

        .searchContainer {
          @apply --layout-center-center;
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
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <iron-media-query query="(min-width: 600px)" query-matches="{{wide}}"></iron-media-query>

    <iron-a11y-keys id="a11y" target="[[searchTarget]]" keys="enter" on-keys-pressed="_search"></iron-a11y-keys>

    <div class="layout vertical center-center">
      <div class="searchContainer layout horizontal wrap">
        <div class="layout horizontal center-center">
          <yp-posts-filter on-tap="_tapOnFilter" sub-title="{{subTitle}}" class="filter" id="postsFilter" tab-name="[[statusFilter]]" on-refresh-group="_refreshGroupFromFilter" group="[[group]]" filter="{{filter}}" searching-for="{{searchingFor}}" category-id="{{categoryId}}" category-name="{{categoryName}}" posts-count="{{postsCount}}">
          </yp-posts-filter>
        </div>
        <div class="layout horizontal center-center">
          <paper-input id="searchInput" label\$="[[t('searchFor')]]" value="{{searchingFor}}" class="searchBox">
          </paper-input>
          <paper-icon-button icon="search" on-tap="_search" hidsden\$="[[!showSearchIcon]]"></paper-icon-button>
        </div>
      </div>

      <template is="dom-if" if="[[noPosts]]" restamp="">
        <div class="layout horiztonal center-center">
          <paper-material class="noIdeas layout horizontal center-center" elevation="2">
            <div class="noIdeasText">[[t('noIdeasHere')]]</div>
          </paper-material>
        </div>
      </template>

      <div class="layout horizontal center-center">
        <iron-list id="ironList" scroll-offset="550" items="[[posts]]" as="post" scroll-target="document" grid="">
          <template>
            <div tabindex\$="[[tabIndex]]" wide-padding\$="[[wide]]" class="card layout vertical center-center">
              <yp-post-card class="card" post="[[post]]" on-mouseover="cardMouseOver" on-mouseout="cardMouseOut"></yp-post-card>
            </div>
          </template>
        </iron-list>
      </div>

      <div class="layout horizontal center-center largeAjax">
        <yp-ajax id="ajax" large-spinner="" on-response="_postsResponse"></yp-ajax>
      </div>
    </div>
`,

  is: 'yp-post-list',

  behaviors: [
    ypLanguageBehavior,
    ypIronListBehavior
  ],

  properties: {

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
    }
  },

  _tapOnFilter: function () {
    window.appGlobals.activity('click', 'filter');
  },

  _searchTarget: function (noPosts) {
    if (!noPosts) {
      this.async(function () {
        return this.$$("#searchInput");
      });
    }
  },

  _selectedTabChanged: function (selectedTab) {
    if (this.statusFilter==selectedTab) {
      //this._loadMoreData();
    }
  },

  _search: function () {
    window.appGlobals.activity('click', 'search');
    if (this.searchingFor && this.searchingFor!='') {
      this._refreshGroupFromFilter();
    }
  },

  cardMouseOver: function (event) {
    event.currentTarget.elevation = 4;
  },

  cardMouseOut: function (event) {
    event.currentTarget.elevation = 1;
  },

  buildPostsUrlPath: function () {
    return this.$.postsFilter.buildPostsUrlPath();
  },

  _searchingForChanged: function (newValue, oldValue) {
    this.set('moreToLoad', true);
    if (newValue && newValue!='') {
      this.set('showSearchIcon', true);
    } else {
      this.set('showSearchIcon', false);
    }
  },

  _filterChanged: function (newValue, oldValue) {
    this.set('moreToLoad', true);
  },

  _categoryIdChanged: function (newValue, oldValue) {
    this.set('moreToLoad', true);
  },

  ready: function () {

  },

  _groupIdChanged: function (newValue, oldValue) {

  },

  _groupChanged: function (group) {
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
  },

  _refreshGroupFromFilter: function () {
    this.set("posts", null);
    this.set('moreToLoad', true);
    this._loadMoreData();
  },

  _loadMoreData: function () {
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
  },

  _postsResponse: function (event, detail, sender) {
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
  },

  _processCategories: function () {
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
});
