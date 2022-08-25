import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '../pl-components/pl-dashboard.js';
import { PlausibleDashboard } from '../pl-components/pl-dashboard.js';

@customElement('yp-dashboard')
export class YpDashboard extends PlausibleDashboard {
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
    return this.collection && this.site
      ? html`
          <pl-dashboard
            .proxyUrl="${`/api/${this.collectionType}/${this.collectionId}/plausibleStatsProxy`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
            .site="${this.site}"
          ></pl-dashboard>
        `
      : nothing;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {}
}
