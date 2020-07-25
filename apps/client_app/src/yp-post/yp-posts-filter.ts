import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { find, chunk } from 'lodash-es';

import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-icon';
import { Select } from '@material/mwc-select';

@customElement('yp-posts-filter')
export class YpPostsFilter extends YpBaseElement {
  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: String })
  filterName: string | undefined;

  @property({ type: String })
  filter = 'newest';

  @property({ type: Number })
  categoryId: number | undefined;

  @property({ type: String })
  categoryName: string | undefined;

  @property({ type: String })
  subTitle = '';

  @property({ type: String })
  searchingFor: string | undefined;

  @property({ type: Boolean })
  showFilter = true;

  @property({ type: Number })
  postsCount: number | undefined;

  //TODO: Clarify difference from above
  @property({ type: Number })
  allPostCount = 0;

  @property({ type: String })
  tabName: string | undefined;

  @property({ type: Object })
  category: YpCategoryData | undefined;

  @property({ type: Array })
  categoriesWithCount: Array<YpCategoryData> | undefined;

  static get styles() {
    return [
      super.styles,
      css`
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
          -ms-filter: 'FlipV';
        }

        .dropdown-trigger {
          margin-bottom: 16px;
          margin-left: 16px;
        }

        .clear-search-trigger {
          width: 55px;
          height: 55px;
          margin-bottom: 16px;
        }

        mwc-list-item {
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

        #dropDownTrigger {
          background-color: #fff;
          margin-left: 16px;
          color: #111;
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

          #dropDownTrigger {
            margin-left: 0;
            margin-right: 0;
          }
        }

        paper-dropdown-menu {
          padding-left: 8px;
          padding-right: 8px;
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
          padding-right: 16px;
        }

        .dropdownIcon {
          color: #000;
          margin-right: 8px;
          margin-left: 8px;
        }

        .catImage {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }

        .filterText {
          margin-right: 8px;
        }

        .dropDownContent,
        #mainListMenu,
        .categoriesDropdownMenu,
        .catDropDown {
          background-color: #fff !important;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="layout horizontal center-center mainContainer wrap">
        ${this.showFilter
          ? html`
              <div
                slot="dropdown-content"
                class="layout vertical dropDownContent">
                <div>
                  <div class="filterHeader layout horizontal center-center">
                    ${this.t('filterIdeas')}
                  </div>

                  <mwc-select
                    slot="dropdown-content"
                    id="mainListMenu"
                    @iron-select="${this._changeFilter}">
                    <mwc-list-item
                      data-filter="top"
                      ?hidden="${this.group.configuration.customRatings !=
                      undefined}">
                      <mwc-icon
                        icon="trending-up"
                        class="filterIcon"></mwc-icon>
                      <span>${this.t('post.top')}</span>
                    </mwc-list-item>
                    <mwc-list-item data-filter="newest">
                      <mwc-icon
                        icon="new-releases"
                        class="filterIcon"></mwc-icon>
                      <span>${this.t('post.newest')}</span>
                    </mwc-list-item>
                    <mwc-list-item data-filter="most_debated">
                      <mwc-icon
                        icon="chat-bubble-outline"
                        class="filterIcon"></mwc-icon>
                      <span>${this.t('post.most_debated')}</span>
                    </mwc-list-item>
                    <mwc-list-item data-filter="random">
                      <mwc-icon icon="cached" class="filterIcon"></mwc-icon>
                      <span>${this.t('post.random')}</span>
                    </mwc-list-item>
                  </mwc-select>
                </div>
              </div>
            `
          : nothing}
        ${this.categoriesWithCount
          ? html`
              <div class="layout vertical">
                <mwc-select
                  id="categoriesMenu"
                  @iron-select="${this._changeCategory}"
                  class="dropdown-content wrap categoriesDropdownMenu">
                  <mwc-list-item data-category-id="-1" name="-1">
                    <mwc-icon icon="select-all" class="filterIcon"></mwc-icon>
                    <span
                      >${this.t('categories.the_all')}
                      (${this.allPostCount})</span
                    >
                  </mwc-list-item>

                  ${this.categoriesWithCount.map(
                    category => html`
                      <mwc-list-item
                        data-category-id="${category.id}"
                        data-category-name="${category.name}">
                        <iron-image
                          sizing="cover"
                          class="catImage"
                          height="24"
                          width="24"
                          src="${this._categoryImageSrc(
                            category
                          )}"></iron-image>
                        ${category.name} (${category.count})
                      </mwc-list-item>
                    `
                  )}
                </mwc-select>
              </div>
            `
          : nothing}
        ${this.searchingFor
          ? html`
              <mwc-icon-button
                aria-label="${this.t('clearSearchInput')}"
                icon="clear"
                @click="${this._clearSearch}"
                class="clear-search-trigger"></mwc-icon-button>
            `
          : nothing}
      </div>
    `;
  }

  _getCategoryCount(id: number, categoryCounts: Array<YpCategoriesCount>) {
    const foundCategory = find(categoryCounts, function (categoryCount) {
      return categoryCount.category_id == id;
    });
    if (foundCategory) {
      return foundCategory.count;
    } else {
      return 0;
    }
  }

  _oldCategory(category: YpCategoryData) {
    if (!category || category.id < 804) {
      return true;
    } else {
      return false;
    }
  }

  _openDropDown() {
    const trigger = this.$$('#dropDownTrigger');
    if (trigger) {
      trigger.click();
    }
  }

  _clearSearch() {
    this.searchingFor = undefined;
    this.filter = 'newest';
    this._updateAfterFiltering();
  }

  openFilter() {
    window.appGlobals.activity('open', 'filter');
  }

  _languageEvent(event: CustomEvent) {
    super._languageEvent(event);
    this._updateTitle();
  }

  searchFor(value: string) {
    this.searchingFor = value;
    const newLocation =
      '/group/' +
      this.group.id +
      '/open/' +
      this.group.name +
      '/search/' +
      this.searchingFor;
    window.appGlobals.activity('change', 'filter', newLocation);
    YpNavHelpers.redirectTo(newLocation);
    this.fire('refresh-group');
  }

  _updateTitle() {
    if (this.searchingFor) {
      this.subTitle = this.t('post.searchingFor') + this.searchingFor;
    } else if (this.filterName) {
      const translatedFilterName = this.t(this.filterName);
      let translatedCategoryName;
      if (this.categoryName) {
        translatedCategoryName = this.categoryName;
      } else {
        translatedCategoryName = this.t('categories.the_all');
      }
      const inWord = this.t('short_word.in');
      if (this._ifCategories()) {
        this.subTitle = translatedFilterName + ' - ' + translatedCategoryName;
      } else {
        this.subTitle = translatedFilterName;
      }
    }
  }

  _changeFilter(event: CustomEvent) {
    this.filter = event.detail.item.dataset.filter;
    this._updateAfterFiltering();
  }

  _changeCategory(event: CustomEvent) {
    const oldCategoryId = this.categoryId;
    const categoryId = event.detail.item.dataset.categoryId;
    if (categoryId != '-1') {
      this.categoryId = categoryId;
      this.categoryName = event.detail.item.dataset.categoryName;
    } else {
      this.categoryId = undefined;
      this.categoryName = undefined;
      (this.$$('#categoryMenu') as Select).value = '';
    }
    this._updateTitle();
    if (oldCategoryId !== this.categoryId) {
      this._updateAfterFiltering();
    }
  }

  buildPostsUrlPath() {
    let newLocation = '/group/' + this.group.id + '/' + this.tabName;
    if (this.filter) {
      newLocation += '/posts/' + this.filter;
    }
    if (this.categoryId) {
      newLocation += '/' + this.categoryId + '/' + this.categoryName;
    }
    return newLocation;
  }

  _updateAfterFiltering() {
    if (!this.filter) this.filter = 'newes';
    const newLocation = this.buildPostsUrlPath();
    window.appGlobals.activity('change', 'filter', newLocation);
    //   this.redirectTo(newLocation);
    this.fire('refresh-group');
  }

  _ifCategories() {
    if (this.group) {
      return this.group.Categories && this.group.Categories.length > 0;
    } else {
      return false;
    }
  }

  resetSelection() {
    setTimeout(() => {
      const categoryMenu = this.$$('#categoryMenu');
      if (categoryMenu) {
        (this.$$('#categoryMenu') as Select).value = '';
      }
      const mainListMenu = this.$$('#mainListMenu');
      if (mainListMenu) {
        (this.$$('#mainListMenu') as Select).value = '';
      } else {
        console.error('Cant find mainListMenu menu');
      }
    }, 100);
  }

  async _setupCategories() {
    this.categoriesWithCount = undefined;
    const categoryCountsInfo = (await window.serverApi.getCategoriesCount(
      this.group.id,
      this.tabName
    )) as YpCategoriesCountInfo | void;
    if (categoryCountsInfo) {
      const categoryCounts = categoryCountsInfo.categoryCounts;
      this.allPostCount = categoryCountsInfo.allPostCount;

      const categoriesWithCount: Array<YpCategoryData> = [];
      //categoriesWithCount.push({id: "all", name: this.t('categories.the_all'), count: detail.response.allPostCount});
      this.group.Categories?.forEach(category => {
        category.count = this._getCategoryCount(category.id, categoryCounts);
        if (category.count > 0) {
          categoriesWithCount.push(category);
        }
      });
      if (categoriesWithCount.length > 1) {
        this.categoriesWithCount = categoriesWithCount;
        setTimeout(() => {
          (this.$$('#categoryMenu') as Select).value = '';
        });
      } else {
        console.error('Unexpected categories count');
      }
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('group') && this.group) {
      this.categoriesWithCount = undefined;
      this.allPostCount = 0;
      this.categoryId = undefined;
      this._updateTitle();
      if (this.group.Categories && this.group.Categories.length > 0) {
        this._setupCategories();
      }
      this.resetSelection();
    }

    if (changedProperties.has('filter') && this.filter) {
      this.filterName = 'post.' + this.filter;
      this._updateTitle();
    }

    if (changedProperties.has('categoryId') && this.categoryId) {
      this._updateTitle();
    }

    if (changedProperties.has('searchingFor')) {
      if (this.searchingFor) {
        this.showFilter = true;
      } else {
        this.showFilter = true;
      }
    }
  }

  _categoryItems() {
    if (this.group.Categories) return chunk(this.group.Categories, 7);
    else return [];
  }

  _categoryImageSrc(category: YpCategoryData) {
    return YpMediaHelpers.getImageFormatUrl(category.CategoryIconImages, 0);
  }
}
