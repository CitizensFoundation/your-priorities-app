import { html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { YpIronListHelpers } from "../common/YpIronListHelpers.js";
import { LitVirtualizer } from "@lit-labs/virtualizer";
import { flow, FlowLayout } from "@lit-labs/virtualizer/layouts/flow.js";
import { grid, GridLayout } from "@lit-labs/virtualizer/layouts/grid.js";

import "@material/web/iconbutton/icon-button.js";
import "@material/web/textfield/outlined-text-field.js";

import "./yp-posts-filter.js";
import "./yp-post-card.js";

import { nothing, TemplateResult } from "lit";
import { YpPostsList } from "./yp-posts-list.js";

@customElement("yp-posts-grid")
export class YpPostsGrid extends YpPostsList {
  static override get styles() {
    return [
      super.styles,
      css`
      `,
    ];
  }

  override render() {
    return html`
      <div class="layout vertical center-center topMost">
        ${this.noPosts
          ? html`
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
              ? html`
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
          ? html`
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
}
