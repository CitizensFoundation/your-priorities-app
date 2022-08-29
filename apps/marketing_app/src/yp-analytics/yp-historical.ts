import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { PlausibleHistorical } from '../pl-components/pl-historical.js';
import { BrowserHistory } from '../pl-components/util/history.js';

import '../pl-components/stats/graph/pl-goal-graph.js';

@customElement('yp-historical')
export class YpHistorical extends PlausibleHistorical {
  static get styles() {
    return [
      ...super.styles,
      css`
        .mb-12 {
          max-width: 100%;
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
              <pl-current-visitors
                .timer=${this.timer}
                .site=${this.site}
                .query=${this.query}
                class="w-full"
                .proxyUrl="${this.proxyUrl}"
              ></pl-current-visitors>
              <div class="flex w-full"></div>
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
          .proxyUrl="${this.proxyUrl}"
        ></pl-visitors-graph>
        <pl-goal-graph
          .events="${[
            "newPost - completed",
          ]}"
          .chartTitle="${this.t('Users who added ideas')}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .site="${this.site}"
          chartHeigh="200">
        </pl-goal-graph>
        <pl-goal-graph
          .events="${[
            "newPointAgainst - completed",
            "newPointFor - completed"
          ]}"
          .chartTitle="${this.t('sers who added points')}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .site="${this.site}"
          chartHeigh="200">
        </pl-goal-graph>

        <pl-goal-graph
          .events="${[
           "endorse_up - completed",
           "endorse_down - completed",
           "pointHelpful - completed",
           "pointNotHelpful - completed"
          ]}"
          .chartTitle="${this.t('Users who added ideas')}"
          .query="${this.query}"
          .proxyUrl="${this.proxyUrl}"
          .site="${this.site}"
          chartHeigh="200">
        </pl-goal-graph>

        <div class="items-start justify-between block w-full md:flex flex">
          <pl-sources-list
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-sources-list>
          <pl-pages
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-pages>
        </div>
        <div class="items-start justify-between block w-full md:flex flex">
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .proxyUrl="${this.proxyUrl}"
          ></pl-devices>
        </div>
        ${this.renderConversions()}
      </div>
    `;
  }
}
