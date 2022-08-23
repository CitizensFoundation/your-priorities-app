import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import 'chart.js';

import { YpAdminPage } from './yp-admin-page.js';

import { Chart, registerables } from 'chart.js';

import './yp-visitors-chart.js';
import './yp-pages-chart.js';
import './yp-bounce-rate-chart.js';
import './pl-components/pl-dashboard.js';

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
        pl-dashboard {
          height: 100vw;
          background-color: #fff;
        }

        .header {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .nextHeader {
          margin-top: 32px;
        }
      `,
    ];
  }

  renderTwo() {
    return this.collection
      ? html`
          <div class="layout horizontal wrap">
            <div class="layout vertical">
              ${this.collection
                ? html`
                    <div class="header">Visitors "day" Chart</div>
                    <yp-visitors-chart
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                    ></yp-visitors-chart>

                    <div class="header nextHeader">Pages "day" Chart</div>
                    <yp-pages-chart
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                    ></yp-pages-chart>

                    <div class="header nextHeader">Bounce rate Chart</div>
                    <yp-bounce-rate-chart
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                    ></yp-bounce-rate-chart>
                  `
                : nothing}
            </div>
          </div>
        `
      : nothing;
  }

  render() {
    return this.collection
      ? html`
          <pl-dashboard
            .collectionId="${this.collection.id}"
            .collectionType="${this.collectionType}"
            .collection="${this.collection}"
          ></pl-dashboard>
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

  async _communityChanged() {}

  _collectionIdChanged() {}
}
