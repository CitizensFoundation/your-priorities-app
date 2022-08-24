import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { PlausibleStyles } from './plausibleStyles.js';
import { PlausibleBaseElement } from './pl-base-element.js';

import './stats/graph/pl-visitors-graph.js';
import './stats/conversions/pl-conversions.js';
import './stats/pages/pl-pages.js';
import './stats/sources/pl-sources-list.js';
import './stats/devices/pl-devices.js';
import './stats/locations/pl-locations.js';

import './pl-date-picker.js';
import './pl-filters.js';

import './stats/pl-current-visitors.js';

import { BrowserHistory } from './util/history.js';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state.js';

@customElement('pl-historical')
export class PlausibleHistorical extends PlausibleBaseElementWithState {
  @property({ type: String })
  currentUserRole!: string;

  @property({ type: Object })
  history!: BrowserHistory;

  @property({ type: Boolean })
  stuck = false;


  static get styles() {
    return [
      ...super.styles,
      css`
        .mb-12 {
          max-width: 1100px;
        }
      `,
    ];
  }

  render() {
    const navClass = this.site.embedded ? 'relative' : 'sticky';
    return html`
      <div class="mb-12">
        <div id="stats-container-top"></div>
        <div
          class=${`${navClass} top-0 sm:py-3 py-2 z-10 ${
            this.stuck && !this.site.embedded
              ? 'fullwidth-shadow bg-gray-50 dark:bg-gray-850'
              : ''
          }`}
        >
          <div class="items-center w-full flex">
            <div class="flex items-center w-full">
              <pl-siteswitcher
                .site="${this.site}"
                .currentUserRole="${this.currentUserRole}"
              ></pl-siteswitcher>
              <pl-current-visitors
                .timer=${this.timer}
                .site=${this.site}
                .query=${this.query}
                .collectionId="${this.collectionId}"
                .collectionType="${this.collectionType}"
              ></pl-current-visitors>
              <pl-filters
                class="flex"
                .site=${this.site}
                .query="${this.query}"
                .history="${this.history}"
              ></pl-filters>
            </div>
            <pl-date-picker
              .site="${this.site}"
              .query="${this.query}"
              .history="${this.history}"
            ></pl-date-picker>
          </div>
        </div>
        <pl-visitors-graph
          .site="${this.site}"
          .query="${this.query}"
          .collectionId="${this.collectionId}"
          .collectionType="${this.collectionType}"
        ></pl-visitors-graph>
        <div class="items-start justify-between block w-full md:flex flex">
          <pl-sources-list
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-sources-list>
          <pl-pages
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-pages>
        </div>
        <div class="items-start justify-between block w-full md:flex flex">
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-devices>
        </div>
        ${this.renderConversions()}
      </div>
    `;
  }

  renderConversions() {
    if (this.site.hasGoals) {
      return html`
        <div class="items-start justify-between block w-full mt-6 md:flex">
          <pl-conversions
            .site=${this.site}
            .query=${this.query}
            .collectionId=${this.collectionId}
            .collectionType=${this.collectionType}
          ></pl-conversions>
        </div>
      `;
    } else {
      return nothing;
    }
  }
}