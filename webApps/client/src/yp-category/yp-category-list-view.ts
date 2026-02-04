import { html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";

import "../common/yp-image.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";

import { TextField } from "@material/web/textfield/internal/text-field.js";
import { MdOutlinedSelect } from "@material/web/select/outlined-select.js";

@customElement("yp-category-list-view")
export class YpCategoryListView extends YpBaseElement {
  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: String })
  statusFilter = "open";

  @property({ type: String })
  filter = "newest";

  @property({ type: Boolean })
  hideFilterAndSearch = false;

  @state()
  categoriesWithCount: Array<YpCategoryData> = [];

  @state()
  allPostCount = 0;

  @state()
  loading = false;

  @state()
  searchingFor: string | undefined;

  @state()
  showSearchIcon = true;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
        }

        .controls {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 8px 0 20px;
          padding: 0 8px;
        }

        .searchBox {
          min-width: 240px;
          flex: 1 1 320px;
        }

        .filterBox {
          min-width: 220px;
          flex: 0 1 240px;
        }

        md-outlined-select {
          width: 100%;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          width: 100%;
          padding: 0 8px 24px;
        }

        .categoryCard {
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          background: var(--md-sys-color-surface);
          border: 1px solid var(--md-sys-color-outline-variant);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .categoryCard:focus-visible {
          outline: 2px solid var(--md-sys-color-primary);
          outline-offset: 2px;
        }

        .categoryCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
        }

        .imageWrap {
          position: relative;
          background: linear-gradient(135deg, #e8e8e8, #f4f4f4);
          aspect-ratio: 16 / 9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        yp-image,
        .imageFallback {
          width: 100%;
          height: 100%;
        }

        yp-image {
          --yp-image-object-fit: cover;
        }

        .imageFallback {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          background: linear-gradient(135deg, #f2f2f2, #d9d9d9);
        }

        .countBadge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 13px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
        }

        .cardBody {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .categoryName {
          font-size: 18px;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
        }

        .emptyText {
          font-size: 13px;
          color: var(--md-sys-color-outline);
        }

        @media (max-width: 600px) {
          .controls {
            padding: 0;
            gap: 8px;
          }

          .searchBox,
          .filterBox {
            min-width: 100%;
          }

          .grid {
            padding: 0 0 20px;
            gap: 14px;
          }

          .categoryName {
            font-size: 17px;
          }
        }
      `,
    ];
  }

  override render() {
    return html`
      <div class="layout vertical center-center">
        ${this.hideFilterAndSearch
          ? nothing
          : html`
              <div class="controls">
                <md-outlined-text-field
                  id="searchInput"
                  hasTrailingIcon
                  @keydown="${this._searchKey}"
                  .label="${this.t("searchFor")}"
                  .value="${this.searchingFor ? this.searchingFor : ""}"
                  class="searchBox"
                >
                  ${this.searchingFor
                    ? html`
                        <md-icon-button
                          slot="trailing-icon"
                          aria-label="${this.t("clearSearchInput")}"
                          @click="${this._clearSearch}"
                          class="clear-search-trigger"
                          ><md-icon>clear</md-icon></md-icon-button
                        >
                      `
                    : html`
                        <md-icon-button
                          slot="trailing-icon"
                          .label="${this.t("startSearch")}"
                          aria-label="${this.t("startSearch")}"
                          @click="${this._search}"
                          ?hidden="${!this.showSearchIcon}"
                          ><md-icon>search</md-icon></md-icon-button
                        >
                      `}
                </md-outlined-text-field>
                <md-outlined-select
                  id="filterMenu"
                  class="filterBox"
                  icon="reorder"
                  outlined
                  .value="${this.filter}"
                  label="${this.t("post.filterMenuLabel")}"
                  @change="${this._changeFilter}"
                >
                  <md-select-option value="top">
                    <span>${this.t("post.top")}</span>
                  </md-select-option>
                  <md-select-option value="newest">
                    <span>${this.t("post.newest")}</span>
                  </md-select-option>
                  <md-select-option value="most_debated">
                    <span>${this.t("post.most_debated")}</span>
                  </md-select-option>
                  <md-select-option value="random">
                    <span>${this.t("post.random")}</span>
                  </md-select-option>
                </md-outlined-select>
              </div>
            `}
        <div class="grid">
          ${this.categoriesWithCount.length > 0
            ? this.categoriesWithCount.map((category) =>
                this._renderCategory(category)
              )
            : nothing}
        </div>
      </div>
    `;
  }

  _searchKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this._search();
    }
    this.showSearchIcon = true;
  }

  _search() {
    window.appGlobals.activity("click", "search");
    this.searchingFor = (this.$$("#searchInput") as TextField).value;
    if (this.searchingFor && this.searchingFor.trim() !== "") {
      window.appGlobals.originalQueryParameters["searchingFor"] =
        this.searchingFor;
      window.appGlobals.originalQueryParameters["categoryId"] = undefined;
      this._navigateToPosts();
    }
  }

  _clearSearch() {
    this.searchingFor = undefined;
    const input = this.$$("#searchInput") as TextField | null;
    if (input) {
      input.value = "";
    }
  }

  _changeFilter(event: CustomEvent) {
    const selected = (event.target as MdOutlinedSelect).value;
    if (selected) {
      this.filter = selected;
    }
  }

  _navigateToPosts(category?: YpCategoryData) {
    if (!this.group) return;
    const path = this._buildPostsUrlPath(category);
    window.appGlobals.activity("change", "filter", path);
    YpNavHelpers.redirectTo(path);
  }

  _buildPostsUrlPath(category?: YpCategoryData) {
    let newLocation = `/group/${this.group.id}/${this.statusFilter}/posts/${this.filter}`;
    if (category) {
      window.appGlobals.originalQueryParameters["categoryId"] = category.id;
      window.appGlobals.originalQueryParameters["searchingFor"] = undefined;
      const safeCategoryName = encodeURIComponent(category.name || "");
      newLocation += `/${category.id}/${safeCategoryName}`;
    }
    return newLocation;
  }

  _renderCategory(category: YpCategoryData) {
    const count = category.count || 0;
    const imageSrc = this._categoryImageSrc(category);
    const initial = (category.name || "?").trim().charAt(0).toUpperCase();
    return html`
      <div
        class="categoryCard"
        role="button"
        tabindex="0"
        @click="${() => this._navigateToPosts(category)}"
        @keypress="${(event: KeyboardEvent) => {
          if (event.key === "Enter") {
            this._navigateToPosts(category);
          }
        }}"
      >
        <div class="imageWrap">
          ${imageSrc
            ? html`
                <yp-image
                  sizing="cover"
                  .alt="${category.name}"
                  .title="${category.name}"
                  src="${imageSrc}"
                ></yp-image>
              `
            : html`<div class="imageFallback">${initial}</div>`}
          <div class="countBadge">${count}</div>
        </div>
        <div class="cardBody">
          <div class="categoryName">${category.name}</div>
          ${count === 0
            ? html`<div class="emptyText">${this.t("noIdeasHere")}</div>`
            : nothing}
        </div>
      </div>
    `;
  }

  _categoryImageSrc(category: YpCategoryData) {
    return YpMediaHelpers.getImageFormatUrl(category.CategoryIconImages, 0);
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

  _setDefaultFilter() {
    const allowedForceByValues = [
      "oldest",
      "newest",
      "top",
      "most_debated",
      "random",
      "alphabetical",
    ];

    if (
      this.group?.configuration?.forcePostSortMethodAs &&
      allowedForceByValues.indexOf(
        this.group.configuration.forcePostSortMethodAs
      ) > -1
    ) {
      this.filter = this.group.configuration.forcePostSortMethodAs;
    } else if (this.group?.configuration?.canAddNewPosts != undefined) {
      if (this.group.configuration.canAddNewPosts === true) {
        this.filter = "newest";
      } else if (
        this.group.configuration.canAddNewPosts === false &&
        this.group.configuration.canVote === false
      ) {
        this.filter = "top";
      } else {
        this.filter = "random";
      }
    } else if (!this.filter) {
      this.filter = "newest";
    }
  }

  async _setupCategories() {
    if (!this.group) {
      this.categoriesWithCount = [];
      return;
    }

    this.loading = true;
    let categoriesCount: Array<YpCategoriesCount> = [];
    let allPostCount = 0;

    const categoryCountsInfo = (await window.serverApi.getCategoriesCount(
      this.group.id,
      this.statusFilter
    )) as YpCategoriesCountInfo | void;

    if (categoryCountsInfo) {
      categoriesCount = categoryCountsInfo.categoriesCount || [];
      allPostCount = categoryCountsInfo.allPostCount || 0;
    }

    this.allPostCount = allPostCount;

    const categories = this.group.Categories || [];
    this.categoriesWithCount = categories.map((category) => {
      return {
        ...category,
        count: this._getCategoryCount(category.id, categoriesCount),
      };
    });

    this.loading = false;
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ) {
    super.updated(changedProperties);

    if (changedProperties.has("group") || changedProperties.has("statusFilter")) {
      this._setDefaultFilter();
      this._setupCategories();
    }
  }
}
