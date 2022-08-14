import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../@yrpri/common/yp-base-element-with-login';

import './stats/graph/pl-visitors-graph.js';

@customElement('pl-realtime')
export class PlausibleRealtime extends YpBaseElementWithLogin {
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

  constructor() {
    super();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
  }

  render() {
    const navClass = this.site.embedded ? 'relative' : 'sticky';
    return html`
      <div className="mb-12">
        <div id="stats-container-top"></div>
        <div
          className=${`${navClass} top-0 sm:py-3 py-2 z-10 ${
            this.stuck && !this.site.embedded
              ? 'fullwidth-shadow bg-gray-50 dark:bg-gray-850'
              : ''
          }`}
        >
          <div className="items-center w-full flex">
            <div className="flex items-center w-full">
              <pl-siteswitcher
                .site="${this.site}"
                .currentUserRole="${this.currentUserRole}"
              ></pl-siteswitcher>
              <pl-filters
                className="flex"
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
        ></pl-visitors-graph>
        <div className="items-start justify-between block w-full md:flex">
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
        <div className="items-start justify-between block w-full md:flex">
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
        <div className="items-start justify-between block w-full mt-6 md:flex">
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
