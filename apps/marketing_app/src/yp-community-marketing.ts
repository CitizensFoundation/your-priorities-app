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
import { Chart, registerables } from 'chart.js';
import { YpServerApiAdmin } from './@yrpri/common/YpServerApiAdmin.js';

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
    return [super.styles, css`
    .chart {
      height: 400px;
      width: 800px;
    }
    `];
  }

  render() {
    return this.collection
      ? html`
          <div class="layout horizontal wrap">
            <div class="layout vertical">
              <h1>A Plausible "day" Chart</h1>
              <canvas class="chart" id="trend-chart"></canvas>
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
    const response = await new YpServerApiAdmin().getAnalyticsData(
      this.collectionId as number,
      'timeseries',
      'period=day'
    );
    this.updateStatsChart(response.results);
  }

  _collectionIdChanged() {}

  updateStatsChart(response: any) {
    if (response) {
      const lineChartElement = this.shadowRoot!.getElementById(
        'trend-chart'
      ) as any;
      const chartLabel = this.t('Visitors');

      if (this.chart) {
        this.chart.destroy();
      }

      const chartData = [];
      for (const item of response) {
        chartData.push({x: item.date, y: item.visitors});
      }

      this.chart = new Chart(lineChartElement, {
        type: 'bar',
        data: {
          datasets: [
            {
              label: `${chartLabel}`,
              backgroundColor: '#1c96bd',
              //@ts-ignore
              //fill: false,
              data: chartData,
            },
          ],
        },
        options: {
          scales: {
            //@ts-ignore
            xAxes: [
              {
                type: 'date',
                time: {
                  unit: 'hours',
                },
              },
            ],
            //@ts-ignore
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  stepSize: 1,
                },
              },
            ],
          },
        },
      });
    } else {
      console.error('Trying to update chart with a response');
    }
  }
}
