var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { flow } from "@lit-labs/virtualizer/layouts/flow.js";
import { grid } from "@lit-labs/virtualizer/layouts/grid.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "./yp-posts-filter.js";
import "./yp-post-card.js";
import { nothing } from "lit";
import { YpPostsList } from "./yp-posts-list.js";
let YpPostsGrid = class YpPostsGrid extends YpPostsList {
    static get styles() {
        return [
            super.styles,
            css `
      `,
        ];
    }
    render() {
        return html `
      <div class="layout vertical center-center topMost">
        ${this.noPosts
            ? html `
              <div class="layout horiztonal center-center">
                <div
                  class="noIdeas layout horizontal center-center shadow-elevation-6dp shadow-transition"
                  ?hidden="${this.group.configuration.allPostsBlockedByDefault}"
                >
                  <div class="noIdeasText">${this.t("noIdeasHere")}</div>
                </div>
              </div>
            `
            : nothing}
        <div
          class="searchContainer layout horizontal center-center wrap"
          ?hidden="${this.group.configuration.hidePostFilterAndSearch ||
            this.noPosts}"
        >
          <div class="layout horizontal center-center">
            <yp-posts-filter
              @click="${this._tapOnFilter}"
              .subTitle="${this.subTitle ? this.subTitle : ""}"
              class="filter"
              id="postsFilter"
              .tabName="${this.statusFilter}"
              @refresh-group="${this.refreshGroupFromFilter}"
              .group="${this.group}"
              .filter="${this.filter}"
              .statusFilter="${this.statusFilter}"
              .searchingFor="${this.searchingFor}"
              .categoryId="${this.categoryId}"
              .postsCount="${this.postsCount}"
            >
            </yp-posts-filter>
          </div>
          <div class="layout horizontal center-center">
            <md-outlined-text-field
              id="searchInput"
              @keydown="${this._searchKey}"
              .label="${this.t("searchFor")}"
              .value="${this.searchingFor ? this.searchingFor : ""}"
              class="searchBox"
            >
            </md-outlined-text-field>

            ${this.searchingFor
            ? html `
                  <md-icon-button
                    aria-label="${this.t("clearSearchInput")}"
                    @click="${this._clearSearch}"
                    class="clear-search-trigger"
                    ><md-icon>clear</md-icon></md-icon-button
                  >
                `
            : nothing}

            <md-icon-button
              .label="${this.t("startSearch")}"
              @click="${this._search}"
              ?hiddsen="${!this.showSearchIcon}"
              ><md-icon>search</md-icon></md-icon-button
            >
          </div>
        </div>
        ${this.posts
            ? html `
              <lit-virtualizer
                id="list"
                .items=${this.posts}
                .layout="${this.grid
                ? grid({
                    itemSize: { width: "420px", height: "442px" },
                    gap: "64px 32px",
                    justify: "center",
                    padding: "0",
                })
                : flow()}"
                .scrollTarget="${window}"
                .renderItem=${this.renderPostItem.bind(this)}
                @rangeChanged=${this.scrollEvent}
              ></lit-virtualizer>
            `
            : nothing}
      </div>
    `;
    }
};
YpPostsGrid = __decorate([
    customElement("yp-posts-grid")
], YpPostsGrid);
export { YpPostsGrid };
//# sourceMappingURL=yp-posts-grid.js.map