var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import './stats/graph/pl-visitors-graph.js';
import './stats/conversions/pl-conversions.js';
import './stats/pages/pl-pages.js';
import './stats/sources/pl-sources-list.js';
import './stats/devices/pl-devices.js';
import './stats/locations/pl-locations.js';
import './pl-date-picker.js';
import './pl-filters.js';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state.js';
let PlausibleRealtime = class PlausibleRealtime extends PlausibleBaseElementWithState {
    constructor() {
        super(...arguments);
        this.stuck = false;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
    }
    static get styles() {
        return [
            ...super.styles,
            css `
        @media (max-width: 768px) {
          .mb-12 {
            max-width: calc(100vw - 32px);
          }
        }
      `,
        ];
    }
    render() {
        const navClass = this.site.embedded ? 'relative' : 'sticky';
        return html `
      <div class="mb-12">
        <div id="stats-container-top"></div>
        <div
          class=${`${navClass} top-0 sm:py-3 py-2 z-10 ${this.stuck && !this.site.embedded
            ? 'fullwidth-shadow bg-gray-50 dark:bg-gray-850'
            : ''}`}
        >
          <div class="items-center w-full flex">
            <div class="flex items-center w-full">
              <pl-siteswitcher
                .site="${this.site}"
                .currentUserRole="${this.currentUserRole}"
              ></pl-siteswitcher>
              <div class="flex w-full"></div>
              <pl-filters
                class="flex flex-grow"
                style="text-align: right;display: inline;"
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
          .timer="${this.timer}"
          .proxyUrl="${this.proxyUrl}"
          useTopStatsForCurrentVisitors
        ></pl-visitors-graph>
        <div class="items-start justify-between block w-full md:flex flex">
          <pl-sources-list
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-sources-list>
          <pl-pages
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-pages>
        </div>
        <div class="items-start justify-between block w-full md:flex flex flex-wrap">
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-devices>
        </div>
        ${this.renderConversions()}
      </div>
    `;
    }
    renderConversions() {
        if (this.site.hasGoals) {
            return html `
        <div class="items-start justify-between block w-full mt-6 md:flex flex-wrap">
          <pl-conversions
            .site=${this.site}
            .query=${this.query}
            .timer=${this.timer}
            .title="${this.t('goalConversionsLast30Min')}"
            .proxyUrl=${this.proxyUrl}
            .highlightedGoals=${this.highlightedGoals}
          ></pl-conversions>
        </div>
      `;
        }
        else {
            return nothing;
        }
    }
};
__decorate([
    property({ type: Object })
], PlausibleRealtime.prototype, "history", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleRealtime.prototype, "stuck", void 0);
__decorate([
    property({ type: Array })
], PlausibleRealtime.prototype, "highlightedGoals", void 0);
PlausibleRealtime = __decorate([
    customElement('pl-realtime')
], PlausibleRealtime);
export { PlausibleRealtime };
//# sourceMappingURL=pl-realtime.js.map