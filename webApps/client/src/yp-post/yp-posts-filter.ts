import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";

import "../common/yp-image.js";
import "@material/web/icon/icon.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";

import { Select } from "@material/web/select/internal/select.js";
import { MdOutlinedSelect } from "@material/web/select/outlined-select.js";

@customElement("yp-posts-filter")
export class YpPostsFilter extends YpBaseElement {
  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: String })
  filterName: string | undefined;

  @property({ type: String })
  filter = "newest";

  @property({ type: Number })
  categoryId: number | undefined;

  @property({ type: String })
  categoryName: string | undefined;

  @property({ type: String })
  subTitle = "";

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

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }

        @media (max-width: 600px) {
          #categoriesMenu {
            margin-top: 16px;
          }
        }

        .mainContainer {
          margin-bottom: 24px;
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

        .dropdown-trigger {
          margin-bottom: 16px;
          margin-left: 16px;
        }

        .clear-search-trigger {
          width: 55px;
          height: 55px;
          margin-bottom: 16px;
        }

        md-select-option {
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
          margin-left: 16px;
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

        md-outlined-select {
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
      `,
    ];
  }

  override render() {
    return html`
      <div class="layout horizontal mainContainer wrap">
        ${this.showFilter
          ? html`
              <div>
                <md-outlined-select
                  id="mainListMenu"
                  icon="reorder"
                  outlined
                  index="1"
                  label="${this.t("post.filterMenuLabel")}"
                  @change="${this._changeFilter}"
                >
                  <md-select-option graphic="icon" value="top">
                    <span>${this.t("post.top")}</span>
                  </md-select-option>
                  <md-select-option value="newest" graphic="icon">
                    <span>${this.t("post.newest")}</span>
                  </md-select-option>
                  <md-select-option value="most_debated" graphic="icon">
                    <span>${this.t("post.most_debated")}</span>
                  </md-select-option>
                  <md-select-option value="random" graphic="icon">
                    <span>${this.t("post.random")}</span>
                  </md-select-option>
                </md-outlined-select>
              </div>
            `
          : nothing}
        ${this.categoriesWithCount
          ? html`
              <div class="layout vertical">
                <md-outlined-select
                  id="categoriesMenu"
                  outlined
                  @change="${this._changeCategory}"
                  class="dropdown-content wrap categoriesDropdownMenu"
                  label="${this.t("post.categoryMenuLabel")}"
                >
                  <md-select-option data-category-id="-1" name="-1" selected>
                    <md-icon icon="select-all" class="filterIcon"></md-icon>
                    <span
                      >${this.t("categories.the_all")}
                      (${this.allPostCount})</span
                    >
                  </md-select-option>

                  ${this.categoriesWithCount.map(
                    (category) => html`
                      <md-select-option
                        data-category-id="${category.id}"
                        data-category-name="${category.name}"
                      >
                        <yp-image
                          sizing="cover"
                          class="catImage"
                          height="24"
                          width="24"
                          .alt="${category.name}"
                          .title="${category.name}"
                          src="${this._categoryImageSrc(category)}"
                        ></yp-image>
                        ${category.name} (${category.count})
                      </md-select-option>
                    `
                  )}
                </md-outlined-select>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  _getCategoryCount(id: number, categoryCounts: Array<YpCategoriesCount>) {
    const foundCategory = categoryCounts.find((categoryCount) => {
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
    const trigger = this.$$("#dropDownTrigger");
    if (trigger) {
      trigger.click();
    }
  }

  openFilter() {
    window.appGlobals.activity("open", "filter");
  }

  override _languageEvent(event: CustomEvent) {
    super._languageEvent(event);
    this._updateTitle();
  }

  searchFor(value: string) {
    this.searchingFor = value;
    const newLocation =
      "/group/" +
      this.group.id +
      "/open/" +
      this.group.name +
      "/search/" +
      this.searchingFor;
    window.appGlobals.activity("change", "filter", newLocation);
    YpNavHelpers.redirectTo(newLocation);
    this.fire("refresh-group");
  }

  _updateTitle() {
    if (this.searchingFor) {
      this.subTitle = this.t("post.searchingFor") + this.searchingFor;
    } else if (this.filterName) {
      const translatedFilterName = this.t(this.filterName);
      let translatedCategoryName;
      if (this.categoryName) {
        translatedCategoryName = this.categoryName;
      } else {
        translatedCategoryName = this.t("categories.the_all");
      }
      const inWord = this.t("short_word.in");
      if (this._ifCategories()) {
        this.subTitle = translatedFilterName + " - " + translatedCategoryName;
      } else {
        this.subTitle = translatedFilterName;
      }
    }
  }

  async _changeFilter(event: CustomEvent) {
    switch ((event.target as MdOutlinedSelect).selectedIndex) {
      case 0:
        this.filter = "top";
        break;
      case 1:
        this.filter = "newest";
        break;
      case 2:
        this.filter = "most_debated";
        break;
      case 3:
        this.filter = "random";
        break;
    }

    await this.updateComplete;
    this._updateAfterFiltering();
  }

  _changeCategory(event: CustomEvent) {
    const oldCategoryId = this.categoryId;
    const index = (event.target as MdOutlinedSelect).selectedIndex;

    if (this.categoriesWithCount) {
      const categoryId =
        index == 0 ? -1 : this.categoriesWithCount[index - 1].id;
      if (categoryId != -1) {
        this.categoryId = categoryId;
        this.categoryName = this.categoriesWithCount[index - 1].name;
      } else {
        this.categoryId = undefined;
        this.categoryName = undefined;
        this.resetSelection();
      }
      this.fire(
        "yp-filter-category-change",
        this.categoryId ? this.categoryId : null
      );

      this._updateTitle();
      if (oldCategoryId !== this.categoryId) {
        this._updateAfterFiltering();
      }
    } else {
      console.error("Trying to change category without one");
    }
  }

  buildPostsUrlPath() {
    let newLocation = "/group/" + this.group.id + "/" + this.tabName;
    if (this.filter) {
      newLocation += "/posts/" + this.filter;
    }
    if (this.categoryId) {
      newLocation += "/" + this.categoryId + "/" + this.categoryName;
    }
    return newLocation;
  }

  _updateAfterFiltering() {
    const newLocation = this.buildPostsUrlPath();
    window.appGlobals.activity("change", "filter", newLocation);
    this.fire("refresh-group");
  }

  _ifCategories() {
    if (this.group) {
      return this.group.Categories && this.group.Categories.length > 0;
    } else {
      return false;
    }
  }

  resetSelection(id: string | undefined = undefined) {
    const categoryMenu = this.$$("#categoryMenu");
    if (categoryMenu) {
      (this.$$("#categoryMenu") as Select).value = id ? id : "";
    }
    //this._updateMainListMenuValue('');
  }

  async _setupCategories() {
    this.categoriesWithCount = undefined;
    const categoryCountsInfo = (await window.serverApi.getCategoriesCount(
      this.group.id,
      this.tabName
    )) as YpCategoriesCountInfo | void;
    if (categoryCountsInfo) {
      const categoriesCount = categoryCountsInfo.categoriesCount;
      this.allPostCount = categoryCountsInfo.allPostCount;

      const categoriesWithCount: Array<YpCategoryData> = [];
      categoriesWithCount.push({
        id: -1,
        name: this.t("categories.the_all"),
        count: this.allPostCount,
      });
      this.group.Categories?.forEach((category) => {
        category.count = this._getCategoryCount(category.id, categoriesCount);
        if (category.count > 0) {
          categoriesWithCount.push(category);
        }
      });
      if (categoriesWithCount.length > 1) {
        this.categoriesWithCount = categoriesWithCount;
        setTimeout(() => {
          this.resetSelection(
            this.categoryId ? this.categoryId.toString() : ""
          );
        });
      } else {
        console.error("Unexpected categories count");
      }
    }
  }

  _updateMainListMenuValue() {
    const mainListMenu = this.$$("#mainListMenu");
    if (mainListMenu) {
      setTimeout(() => {
        (this.$$("#mainListMenu") as Select).value = this.filter;
        //(this.$$('#mainListMenu') as Select).layout();
      }, 20);
    } else {
      console.error("Cant find mainListMenu menu");
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("group") && this.group) {
      this.categoriesWithCount = undefined;
      this.allPostCount = 0;
      this._updateTitle();
      if (this.group.Categories && this.group.Categories.length > 0) {
        this._setupCategories();
      }
      this.resetSelection();
    }

    if (changedProperties.has("filter") && this.filter) {
      this.filterName = "post." + this.filter;
      this._updateTitle();
      this._updateMainListMenuValue();
    }

    if (changedProperties.has("categoryId") && this.categoryId) {
      this._updateTitle();
    }

    if (changedProperties.has("filter") && this.filter) {
      this.fire("yp-filter-changed", this.filter);
    }

    if (changedProperties.has("searchingFor")) {
      if (this.searchingFor) {
        this.showFilter = true;
      } else {
        this.showFilter = true;
      }
    }
  }

  chunk(input: Array<any>, size: number) {
    return input.reduce((arr, item, idx) => {
      return idx % size === 0
        ? [...arr, [item]]
        : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
    }, []);
  }

  _categoryItems() {
    if (this.group.Categories) return this.chunk(this.group.Categories, 7);
    else return [];
  }

  _categoryImageSrc(category: YpCategoryData) {
    return YpMediaHelpers.getImageFormatUrl(category.CategoryIconImages, 0);
  }
}
