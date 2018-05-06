import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../@polymer/iron-selector/iron-selector.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-item/paper-item.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-ajax/yp-ajax.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
      }

      paper-menu-button {
        padding: 0;
        margin: 0;
      }

      .filterIcon {
        padding-right: 8px;
      }

      .filterIconTransform {
        -moz-transform: scaleY(-1);
        -o-transform: scaleY(-1);
        -webkit-transform: scaleY(-1);
        transform: scaleY(-1);
        filter: FlipV;
        -ms-filter: "FlipV";
      }

      .dropdown-trigger  {
        margin-bottom: 16px;
        margin-left: 16px;
      }

      .clear-search-trigger {
        width: 55px;
        height: 55px;
        margin-bottom: 16px;
      }

      paper-item {
        min-height: 32px;
      }

      .subTitle {
        font-size: 22px;
        margin-top: 10px;
        margin-right: 8px;
      }

      #filterDropdown {
        padding-left: 0;
        margin-left: 0;
      }

      @media (max-width: 600px) {
        .subTitle {
          font-size: 17px;
          padding-top: 0;
          margin-top: 16px;
        }

        .dropdown-trigger {
          padding-left: 0;
          margin-left: 0;
          margin-bottom: 0;
          margin-top: 0;
        }

        .clear-search-trigger {
          width: 50px;
          height: 50px;
          margin-top: 5px;
          margin-bottom: 0;
          margin-top: 0;
        }
      }

      paper-dropdown-menu {
        padding-left: 8px;
        padding-right: 8px;
        background-color: var(--primary-background-color);
      }

      .filterHeader {
        margin-top: 16px;
        padding-bottom: 0;
        margin-bottom: 0;
        font-weight: bold;
        font-size: 18px;
      }

      .categoriesDropdownMenu {
        padding-left: 16px;
        parring-right: 16px;
      }

      #dropDownTrigger {
        background-color: var(--accent-color);
        margin-left: 16px;
        color: #FFF;

      }

      .dropdownIcon {
        color: #FFF;
        margin-right: 8px;
        margin-left: 8px;
      }

      .catImage {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <template is="dom-if" if="[[group]]">
      <div class="layout horizontal center-center mainContainer wrap">
        <template is="dom-if" if="[[showFilter]]">
          <paper-menu-button id="filterDropdown" class="selected-items" icon="sort" vertical-align="auto" horizontal-align="right">
            <paper-button raised="" title\$="[[t('filterIdeas')]]" id="dropDownTrigger" icon="sort" slot="dropdown-trigger">
              <iron-icon icon="sort" class="dropdownIcon"></iron-icon>
              {{t('filterIdeas')}}
            </paper-button>

            <div slot="dropdown-content" class="layout vertical">
              <div>
                <div class="filterHeader layout horizontal center-center">
                  [[t('filterIdeas')]]
                </div>
                <template is="dom-if" if="[[categoriesWithCount]]" restamp="">
                  <div class="layout vertical">
                    <paper-dropdown-menu class="dropdown-content wrap categoriesDropdownMenu">
                      <paper-listbox slot="dropdown-content" id="categoryMenu" attr-for-selected="data-category-id" on-iron-select="_changeCategory">
                        <paper-item data-category-id="-1" name="-1">
                          <iron-icon icon="select-all" class="filterIcon"></iron-icon>
                          <span>[[t('categories.the_all')]] ([[allPostCount]])</span>
                        </paper-item>
                        <template is="dom-repeat" items="[[categoriesWithCount]]" as="category">
                          <paper-item data-category-id\$="[[category.id]]" data-category-name\$="[[category.name]]">
                            <iron-image sizing="cover" class="catImage" height="24" width="24" src="[[_categoryImageSrc(category)]]"></iron-image>
                            [[category.name]] ([[category.count]])
                          </paper-item>
                        </template>
                      </paper-listbox>
                    </paper-dropdown-menu>
                  </div>
                </template>
                <div class="layout horizontal center-center">
                  <yp-ajax id="categoriesWithCountAjax" on-response="_categoriesCountResponse"></yp-ajax>
                </div>
                <paper-listbox slot="dropdown-content" id="mainListMenu" on-iron-select="_changeFilter">
                  <paper-item data-filter="top">
                    <iron-icon icon="trending-up" class="filterIcon"></iron-icon>
                    <span>[[t('post.top')]]</span>
                  </paper-item>
                  <paper-item data-filter="newest">
                    <iron-icon icon="new-releases" class="filterIcon"></iron-icon>
                    <span>[[t('post.newest')]]</span>
                  </paper-item>
                  <paper-item data-filter="most_debated">
                    <iron-icon icon="chat-bubble-outline" class="filterIcon"></iron-icon>
                    <span>[[t('post.most_debated')]]</span>
                  </paper-item>
                  <paper-item data-filter="random">
                    <iron-icon icon="cached" class="filterIcon"></iron-icon>
                    <span>[[t('post.random')]]</span>
                  </paper-item>
                </paper-listbox>
              </div>
            </div>
          </paper-menu-button>
        </template>
        <template is="dom-if" if="[[searchingFor]]">
          <paper-icon-button icon="clear" on-tap="_clearSearch" class="clear-search-trigger"></paper-icon-button>
        </template>
      </div>
    </template>
`,

  is: 'yp-posts-filter',

  behaviors: [
    ypLanguageBehavior,
    ypGotoBehavior,
    ypImageFormatsBehavior
  ],

  properties: {

    filter: {
      type: String,
      value: "newest",
      notify: true,
      observer: "_filterChanged"
    },

    filterName: {
      type: String
    },

    categoryId: {
      type: String,
      notify: true,
      observer: "_categoryIdChanged"
    },

    categoryName: {
      type: String
    },

    group: {
      type: Object,
      observer: "_groupChanged"
    },

    subTitle: {
      type: String,
      value: '',
      notify: true
    },

    searchingFor: {
      type: String,
      value: null,
      notify: true,
      observer: "_searchingForChanged"
    },

    showFilter: {
      type: Boolean,
      value: true
    },

    postsCount: {
      type: Number,
      notify: true
    },

    tabName: {
      type: String,
      observer: '_tabNameChanged'
    },

    categoriesWithCount: {
      type: Array,
      value: null
    },

    allPostCount: {
      type: Number,
      value: 0
    }
  },

  observers: [
    '_listLanguageChanged(language)'
  ],

  _getCategoryCount: function (id, categoryCounts) {
    var foundCategory = __.find(categoryCounts, function (categoryCount) {
      return (categoryCount.category_id==id);
    });
    if (foundCategory) {
      return foundCategory.count;
    } else {
      return 0;
    }
  },

  _oldCategory: function (category) {
    if (!category || category.id<804) {
      return true;
    } else {
      return false;
    }
  },

  _categoriesCountResponse: function (event, detail) {
    var categoryCounts = detail.response.categoriesCount;
    this.set('allPostCount', detail.response.allPostCount);
    var categoriesWithCount = [];
    //categoriesWithCount.push({id: "all", name: this.t('categories.the_all'), count: detail.response.allPostCount});
    __.each(this.group.Categories, function (category) {
      category.count = this._getCategoryCount(category.id, categoryCounts);
      if (category.count > 0) {
        categoriesWithCount.push(category);
      }
    }.bind(this));
    if (categoriesWithCount.length>1) {
      this.set('categoriesWithCount', categoriesWithCount);
      this.async(function () {
        var categoryMenu = this.$$("#categoryMenu");
        if (categoryMenu) {
          categoryMenu.selected = "-1";
        } else {
          console.error("Cant set category menu");
        }
      });
    } else {
      console.error("Unexpected categories count");
    }
  },

  _openDropDown: function () {
    var trigger = this.$$("#dropDownTrigger");
    if (trigger) {
      trigger.click();
    }
  },

  _searchingForChanged: function (newValue, oldValue) {
    if (newValue) {
      this.showFilter = true;
    } else {
      this.showFilter = true;
    }
  },

  _clearSearch: function () {
    this.set('searchingFor', null);
    this.set('filter', 'newest');
    this._updateAfterFiltering();
  },

  openFilter: function () {
    window.appGlobals.activity('open', 'filter');
  },

  _filterChanged: function (newValue, oldValue) {
    if (newValue) {
      this.filterName = 'post.' + this.filter;
      this._updateTitle();
    }
  },

  _categoryIdChanged: function (newValue, oldValue) {
    if (newValue) {
      this._updateTitle();
    }
  },

  _listLanguageChanged: function (language) {
    if (language && this.t) {
      this._updateTitle();
    }
  },

  searchFor: function (value) {
    this.set('searchingFor', value);
    var newLocation = '/group/' + this.group.id + '/open/' + this.group.name + '/search/' + this.searchingFor;
    window.appGlobals.activity('change', 'filter', newLocation);
    this.redirectTo(newLocation);
    this.fire("refresh-group");
  },

  _updateTitle: function () {
    if (this.searchingFor) {
      this.set('subTitle', this.t('post.searchingFor') + this.searchingFor);
    } else {
      var translatedFilterName = this.t(this.filterName);
      var translatedCategoryName;
      if (this.categoryName) {
        translatedCategoryName = this.categoryName;
      } else {
        translatedCategoryName = this.t('categories.the_all');
      }
      var inWord = this.t('short_word.in');
      if (this._ifCategories()) {
        this.set('subTitle', translatedFilterName + ' - ' + translatedCategoryName);
      } else {
        this.set('subTitle', translatedFilterName);
      }
    }
  },

  _changeFilter: function (e, detail) {
    this.set('filter',detail.item.dataset.filter);
    this._updateAfterFiltering();
  },

  _changeCategory: function (e, detail) {
    var oldCategoryId = this.categoryId;
    var categoryId = detail.item.dataset.categoryId;
    if (categoryId != '-1') {
      this.set('categoryId',categoryId);
      this.categoryName = detail.item.dataset.categoryName;
    } else {
      this.set('categoryId',null);
      this.categoryName = null;
      this.$$("#categoryMenu").selected = null;
    }
    this._updateTitle();
    if (oldCategoryId!==this.categoryId) {
      this._updateAfterFiltering();
    }
  },

  buildPostsUrlPath: function () {
    var newLocation = '/group/' + this.group.id + '/' + this.tabName;
    if (this.filter) {
      newLocation += '/posts/' + this.filter;
    }
    if (this.categoryId) {
      newLocation += '/' + this.categoryId + '/' + this.categoryName;
    }
    return newLocation;
  },

  _updateAfterFiltering: function () {
    if (!this.filter)
      this.set('filter','newest');
    var newLocation = this.buildPostsUrlPath();
    window.appGlobals.activity('change', 'filter', newLocation);
 //   this.redirectTo(newLocation);
    this.fire("refresh-group");
  },

  _ifCategories: function () {
    if (this.group) {
      return this.group.Categories && this.group.Categories.length > 0;
    } else {
      return false;
    }
  },

  resetSelection: function () {
    this.async(function () {
      var categoryMenu = this.$$("#categoryMenu");
      if (categoryMenu) {
        this.$$("#categoryMenu").selected = null;
      }
      var mainListMenu = this.$$("#mainListMenu");
      if (mainListMenu) {
        this.$$("#mainListMenu").selected = null;
      } else {
        console.error("Cant find mainListMenu menu");
      }
    }, 100);
  },

  _tabNameChanged: function (tabName) {
    if (false && tabName && this.group && this.group.Categories && this.group.Categories.length>0) {
      this._setupCategories(this.group, tabName);
    }
  },

  _setupCategories: function (group, tabName) {
    this.set('categoriesWithCount', null);
    this.async(function () {
      var categoriesWithCountAjax = this.$$("#categoriesWithCountAjax");
      if (categoriesWithCountAjax) {
        categoriesWithCountAjax.url = "/api/groups/" + group.id + "/categories_count/"+tabName;
        categoriesWithCountAjax.generateRequest();
      } else {
        console.error("Can't find categories ajax.");
      }
    }, 100);
  },

  _groupChanged: function (group) {
    this.set('categoriesWithCount', null);
    this.set('allPostCount', 0);
    this.set('categoryId',null);
    if (group) {
      this._updateTitle();
      if (group.Categories && group.Categories.length>0) {
        this._setupCategories(group, this.tabName);
      }
      this.resetSelection();
    }
  },

  _categoryItems: function () {
    if (this.group.Categories)
      return this.splitArray(this.group.Categories, 7);
    else
      return [];
  },

  _categoryImageSrc: function (category) {
    return this.getImageFormatUrl(category.CategoryIconImages, 0);
  },

  splitArray: function (a, n) {
    return a.chunk(n);
  }
});
