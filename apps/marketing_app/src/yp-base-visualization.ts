import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import 'chart.js';

import { YpBaseElement } from './@yrpri/common/yp-base-element.js';
import { Chart, registerables } from 'chart.js';
import { YpServerApiAdmin } from './@yrpri/common/YpServerApiAdmin.js';

export class YpBaseVisualization extends YpBaseElement {
  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Number })
  collectionId!: number | string;

  @property({ type: Number })
  type!: string;

  @property({ type: Number })
  params!: string;

  @property({ type: String })
  chartLabel!: string;

  @property({ type: String })
  chartType!: string;

  chart: any;

  constructor() {
    super();
    Chart.register(...registerables);
  }

  static get styles() {
    return [
      super.styles,
      css`
        .chart {
          height: 400px;
          width: 800px;
        }
      `,
    ];
  }

  render() {
    return html` <canvas class="chart" id="chart"></canvas> `;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('collection') && this.collection) {
      this._communityChanged();
    }
  }

  async _communityChanged() {
    const response = await new YpServerApiAdmin().getAnalyticsData(
      this.collectionId as number,
      this.type, //'timeseries',
      this.params //'period=day'
    );
    this.updateStatsChart(response.results);
  }

  _collectionIdChanged() {}

  updateStatsChart(response: any) {
    if (response) {
      const lineChartElement = this.shadowRoot!.getElementById(
        'chart'
      ) as any;

      if (this.chart) {
        this.chart.destroy();
      }

      const chartData = [];
      for (const item of response) {
        chartData.push({ x: item.date, y: item.visitors });
      }

      this.chart = new Chart(lineChartElement, {
        type: this.chartType as any,
        data: {
          datasets: [
            {
              label: `${this.chartLabel}`,
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
