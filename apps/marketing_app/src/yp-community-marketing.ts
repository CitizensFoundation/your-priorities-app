import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import 'chart.js';

import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import { YpBaseElementWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import { YpAdminPage } from './yp-admin-page.js';

import './@yrpri/yp-survey/yp-structured-question-edit.js';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-textfield';
import '@material/mwc-textarea';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';

import { YpAdminConfigBase } from './yp-admin-config-base.js';
import { YpNavHelpers } from './@yrpri/common/YpNavHelpers.js';
import { YpFileUpload } from './@yrpri/yp-file-upload/yp-file-upload.js';
import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
import './@yrpri/common/yp-emoji-selector.js';

import './@yrpri/yp-file-upload/yp-file-upload.js';
import './@yrpri/yp-theme/yp-theme-selector.js';
import './@yrpri/yp-app/yp-language-selector.js';
import { TextField } from '@material/mwc-textfield';
import { YpConfirmationDialog } from './@yrpri/yp-dialog-container/yp-confirmation-dialog.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Radio } from '@material/mwc-radio';
import { YpBaseElement } from './@yrpri/common/yp-base-element.js';
import { Chart } from 'chart.js';
import { YpServerApiAdmin } from './@yrpri/common/YpServerApiAdmin.js';

@customElement('yp-community-marketing')
export class YpCommunityMarketing extends YpAdminPage {
  @property({ type: String })
  communityAccess = 'public';

  chart: any;

  constructor() {
    super();
  }

  static get styles() {
    return [super.styles, css``];
  }

  render() {
    return this.collection
      ? html`
          <div class="layout horizontal wrap">
            <div class="layout vertical">
             <h1>NICE CHART</h1>
             <div id="trend-chart"></div>
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
    const response = await new YpServerApiAdmin().getAnalyticsData(this.collectionId as number, "timeseries", "period=6mo");
    this.updateStatsChart(response);
  }

  _collectionIdChanged() {
  }

  updateStatsChart (response: any) {
    if (response) {
      const lineChartElement = this.shadowRoot!.getElementById("trend-chart") as any;
      const chartLabel = this.t('Visitors');

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(lineChartElement, {
        type: 'bar',
        data:  { datasets: [
          {
            label: `${chartLabel}`,
            backgroundColor: "#1c96bd",
            //@ts-ignore
            fill: false,
            response
          }
        ] },
        options: {
          scales: {
              //@ts-ignore
              xAxes: [{
                  type: 'time',
                  time: {
                    unit: "hours"
                }
              }],
              //@ts-ignore
              yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
          }
      }
      });
    } else {
      console.error("Trying to update chart with a response");
    }
  }
}
