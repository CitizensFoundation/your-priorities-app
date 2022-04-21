import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import 'chart.js';

import { YpAdminPage } from './yp-admin-page.js';

import { Chart, registerables } from 'chart.js';

import './yp-visitors-chart.js';

@customElement('yp-community-marketing')
export class YpCommunityMarketing extends YpAdminPage {
  @property({ type: String })
  communityAccess = 'public';

  chart: any;

  constructor() {
    super();
    Chart.register(...registerables);
  }

  static get styles() {
    return [
      super.styles,
      css`
      `,
    ];
  }

  render() {
    return this.collection
      ? html`
          <div class="layout horizontal wrap">
            <div class="layout vertical">
              <h1>A Plausible "day" Chart</h1>
              ${this.collection
                ? html`
                    <yp-visitors-chart
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                    ></yp-visitors-chart>
                  `
                : nothing}
            </div>
          </div>
        `
      : nothing;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('collection') && this.collection) {
      this._communityChanged();
    }

    if (changedProperties.has('collectionId') && this.collectionId) {
      this._collectionIdChanged();
    }
  }

  async _communityChanged() {
  }

  _collectionIdChanged() {}
}
