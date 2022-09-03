import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '../pl-components/pl-dashboard.js';

import './yp-realtime.js';
import './yp-historical.js';

import { PlausibleDashboard } from '../pl-components/pl-dashboard.js';

@customElement('yp-marketing-dashboard')
export class YpMarketingDashboard extends PlausibleDashboard {
  @property({ type: String })
  plausibleSiteName: string | undefined;

  @property({ type: Object })
  collection!: YpCollectionData;

  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number | string;

  connectedCallback(): void {
    try {
      fetch('/api/users/has/PlausibleSiteName', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          this.plausibleSiteName = data.plausibleSiteName;
          this.site = {
            domain: this.plausibleSiteName!,
            hasGoals: true,
            embedded: false,
            offset: 1,
            statsBegin: this.collection!.created_at!,
            isDbip: false,
            flags: {
              custom_dimension_filter: false,
            },
          };
          super.connectedCallback();
        });
    } catch (error) {
      console.error(error);
    }
  }

  static get styles() {
    return [css``];
  }

  render() {
    if (this.site && this.query) {
      if (this.query!.period === 'realtime') {
        return html`
          <yp-realtime
            .timer="${this.timer}"
            .site="${this.site}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .history="${this.history}"
            .proxyUrl="${`/api/${this.collectionType}/${this.collectionId}/plausibleStatsProxy`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
          ></yp-realtime>
        `;
      } else {
        return html`
          <yp-historical
            .timer="${this.timer}"
            .site="${this.site}"
            .history="${this.history}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .proxyUrl="${`/api/${this.collectionType}/${this.collectionId}/plausibleStatsProxy`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
          ></yp-historical>
        `;
      }
    } else {
      return nothing;
    }
  }
}
