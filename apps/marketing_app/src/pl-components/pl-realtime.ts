import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import tailwind from 'lit-tailwindcss';

import './stats/graph/pl-visitors-graph.js';
import { PlausibleStyles } from './plausibleStyles.js';
import { PlausibleBaseElement } from './pl-base-element.js';

@customElement('pl-realtime')
export class PlausibleRealtime extends PlausibleBaseElement {
  @property({ type: Object })
  state!: PlausibleStateData;

  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: String })
  currentUserRole!: string;

  @property({ type: Object })
  history!: any;

  @property({ type: Boolean })
  stuck = false;

  @property({ type: Object })
  timer: any;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  constructor() {
    super();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
  }

  static get styles() {
    return [
      super.styles,
      tailwind,
      PlausibleStyles,
      css`
        pl-realtime {
          height: 100%;
          background-color: #FFF;
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
              <pl-filters
                class="flex"
                .site="${this.site}"
                .query="${this.query}"
                .history="${this.history}"
              ></pl-filters>
            </div>
            <pl-datepicker
              .site="${this.site}"
              .query="${this.query}"
            ></pl-datepicker>
          </div>
        </div>
        <pl-visitors-graph
          .site="${this.site}"
          .query="${this.query}"
          .timer="${this.timer}"
          .collectionId="${this.collectionId}"
          .collectionType="${this.collectionType}"
        ></pl-visitors-graph>
        <div class="items-start justify-between block w-full md:flex">
          <pl-sources
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
          ></pl-sources>
          <pl-pages
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
          ></pl-pages>
        </div>
        <div class="items-start justify-between block w-full md:flex">
          <pl-locations
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
          ></pl-locations>
          <pl-devices
            .site="${this.site}"
            .query="${this.query}"
            .timer="${this.timer}"
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
