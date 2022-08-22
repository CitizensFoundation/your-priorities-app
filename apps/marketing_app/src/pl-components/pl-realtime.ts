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
import { BrowserHistory } from './util/history.js';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state.js';

@customElement('pl-realtime')
export class PlausibleRealtime extends PlausibleBaseElementWithState {
  @property({ type: String })
  currentUserRole!: string;

  @property({ type: Object })
  history!: BrowserHistory;

  @property({ type: Boolean })
  stuck = false;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
  }

  static get styles() {
    return [
      ...super.styles,
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
              <pl-filters
                class="flex"
                .site="${this.site}"
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
          .collectionId="${this.collectionId}"
          .collectionType="${this.collectionType}"
        ></pl-visitors-graph>
        <div class="items-start justify-between block w-full md:flex flex">
          <pl-sources-list
            class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-sources-list>
          <pl-pages
             class="flex-col"
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-pages>
        </div>
        <div class="items-start justify-between block w-full md:flex">
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-devices>
        </div>
        ${ this.renderConversions() }
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
            .title="${this.t('goalConversionsLast30Min')}"
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

/*import Datepicker from './datepicker'
import SiteSwitcher from './site-switcher'
import Filters from './filters'
import VisitorGraph from './stats/graph/visitor-graph'
import Sources from './stats/sources'
import Pages from './stats/pages'
import Locations from './stats/locations'
import Devices from './stats/devices'
import Conversions from './stats/conversions'
import { withPinnedHeader } from './pinned-header-hoc';
*/

//export default withPinnedHeader(Realtime, '#stats-container-top');
