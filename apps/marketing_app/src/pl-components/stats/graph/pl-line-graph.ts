import { LitElement, css, html, nothing } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import Chart from 'chart.js/auto';
import { navigateToQuery } from '../../query.js';
import numberFormatter, {
  durationFormatter,
} from '../../util/number-formatter.js';
import * as api from '../../api';
import * as storage from '../../util/storage.js';
//import LazyLoader from '../../components/lazy-loader'
import { GraphTooltip, buildDataSet, dateFormatter } from './graph-util.js';
import './pl-top-stats.js';
import * as url from '../../util/url.js';
import { YpBaseElementWithLogin } from '../../../@yrpri/common/yp-base-element-with-login';
import CanvasEntry from 'wavesurfer.js/src/drawer.canvasentry.js';
import tailwind from 'lit-tailwindcss';

import {
  METRIC_MAPPING,
  METRIC_FORMATTER,
  METRIC_LABELS,
} from './pl-visitors-graph.js';
import { PlausibleStyles } from '../../plausibleStyles.js';

@customElement('pl-line-graph')
export class PlausibleLineGraph extends YpBaseElementWithLogin {
  @property({ type: Object })
  state!: PlausibleStateData;

  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: Object })
  timer: any;

  @property({ type: Object })
  graphData: any;

  @property({ type: String })
  metric!: string;

  @property({ type: Object })
  ctx!: CanvasRenderingContext2D | null;

  @property({ type: Boolean })
  darkTheme = false;

  @property({ type: Object })
  chart: Chart | undefined;

  @property({ type: Object })
  updateMetric: Function | undefined;

  @property({ type: Object })
  history!: any;

  @property({ type: Object })
  topStatData: PlausibleTopStatsData | undefined;

  @query('canvas')
  canvasElement!: HTMLCanvasElement;

  constructor() {
    super();
    this.state = {
      ...this.state,
      exported: false,
    };

    this.repositionTooltip = this.repositionTooltip.bind(this);
  }

  static get styles() {
    return [
      super.styles,
      tailwind,
      PlausibleStyles
    ];
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    const tooltip = this.$$('#chartjs-tooltip');

    if (
      this.metric &&
      this.graphData &&
      (changedProperties.get('graphData') || changedProperties.get('darkTheme'))
    ) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = this.regenerateChart();
      this.chart.update();

      if (tooltip) {
        tooltip.style.display = 'none';
      }
    }

    if (!this.graphData || !this.metric) {
      if (this.chart) {
        this.chart.destroy();
      }

      if (tooltip) {
        tooltip.style.display = 'none';
      }
    }
  }

  regenerateChart() {
    let graphEl = this.$$('canvas') as HTMLCanvasElement;
    if (!graphEl) {
      graphEl = this.canvasElement as HTMLCanvasElement;
    }
    this.ctx = graphEl!.getContext('2d');
    const dataSet = buildDataSet(
      this.graphData.plot,
      this.graphData.present_index,
      this.ctx,
      METRIC_LABELS[this.metric]
    );
    // const prev_dataSet = graphData.prev_plot && buildDataSet(graphData.prev_plot, false, this.ctx, METRIC_LABELS[this.metric], true)
    // const combinedDataSets = comparison.enabled && prev_dataSet ? [...dataSet, ...prev_dataSet] : dataSet;

    return new Chart(this.ctx!, {
      type: 'line',
      data: {
        labels: this.graphData.labels,
        datasets: dataSet,
      },
      options: {
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            mode: 'index',
            intersect: false,
            position: 'average',
            external: GraphTooltip(this.graphData, this.metric, graphEl, this.$$('#chartjs-tooltip')),
          },
        },
        responsive: true,
        onResize: this.updateWindowDimensions,
        elements: { line: { tension: 0 }, point: { radius: 0 } },
        //@ts-ignore
        onClick: this.onClick.bind(this),
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: METRIC_FORMATTER[this.metric],
              maxTicksLimit: 8,
              color: this.darkTheme ? 'rgb(243, 244, 246)' : undefined,
            },
            grid: {
              //@ts-ignore
              zeroLineColor: 'transparent',
              drawBorder: false,
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              maxTicksLimit: 8,
              callback: (val, _index, _ticks) => {
                return dateFormatter(this.graphData.interval)(
                  this.getLabelForValue(val as number)
                );
              },
              color: this.darkTheme ? 'rgb(243, 244, 246)' : undefined,
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
      },
    });
  }

  getLabelForValue(val: number) {
    return `getLabelForValue ${val}`;
  }

  repositionTooltip(e: MouseEvent) {
    const tooltipEl = this.$$('#chartjs-tooltip');
    if (tooltipEl && window.innerWidth >= 768) {
      if (e.clientX > 0.66 * window.innerWidth) {
        tooltipEl.style.right =
          window.innerWidth - e.clientX + window.pageXOffset + 'px';
        tooltipEl.style.left = '';
      } else {
        tooltipEl.style.right = '';
        tooltipEl.style.left = e.clientX + window.pageXOffset + 'px';
      }
      tooltipEl.style.top = e.clientY + window.pageYOffset + 'px';
      tooltipEl.style.opacity = '1';
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('mousemove', this.repositionTooltip);
  }

  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (this.metric && this.graphData) {
      this.chart = this.regenerateChart();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Ensure that the tooltip doesn't hang around when we are loading more data
    const tooltip = document.getElementById('chartjs-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.display = 'none';
    }
    window.removeEventListener('mousemove', this.repositionTooltip);
  }

  /**
   * The current ticks' limits are set to treat iPad (regular/Mini/Pro) as a regular screen.
   * @param {*} chart - The chart instance.
   * @param {*} dimensions - An object containing the new dimensions *of the chart.*
   */
  updateWindowDimensions(chart: Chart, dimensions: any) {
    //@ts-ignore
    chart.options.scales.x.ticks.maxTicksLimit = dimensions.width < 720 ? 5 : 8;
    //@ts-ignore
    chart.options.scales.y.ticks.maxTicksLimit =
      dimensions.height < 233 ? 3 : 8;
  }

  onClick(e: CustomEvent) {
    const element = this.chart!.getElementsAtEventForMode(
      e,
      'index',
      {
        intersect: false,
      },
      false
    )[0];
    const date = this.chart!.data!.labels![element.index] as Date;

    if (this.graphData.interval === 'month') {
      navigateToQuery(this.history, this.query, {
        period: 'month',
        date,
      });
    } else if (this.graphData.interval === 'date') {
      navigateToQuery(this.history, this.query, {
        period: 'day',
        date,
      });
    }
  }

  pollExportReady() {
    if (document.cookie.includes('exporting')) {
      setTimeout(this.pollExportReady.bind(this), 1000);
    } else {
      this.state = {
        ...this.state,
        exported: false,
      };
    }
  }

  downloadSpinner() {
    this.state = {
      ...this.state,
      exported: true,
    };
    document.cookie = 'exporting=';
    setTimeout(this.pollExportReady.bind(this), 1000);
  }

  downloadLink() {
    if (this.query.period !== 'realtime') {
      if (this.state.exported) {
        return html`
          <div class="w-4 h-4 mx-2">
            <svg
              class="animate-spin h-4 w-4 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        `;
      } else {
        const endpoint = `/${encodeURIComponent(
          this.site.domain!
        )}/export${api.serializeQuery(this.query)}`;

        return html`
          <a
            class="w-4 h-4 mx-2"
            href="{endpoint}"
            download
            onClick="{this.downloadSpinner.bind(this)}"
          >
            <svg
              style="max-width: 50px;max-height: 50px;"
              class="absolute text-gray-700 feather dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        `;
      }
    }
  }

  samplingNotice() {
    const samplePercent = this.topStatData && this.topStatData.sample_percent;

    if (samplePercent && samplePercent < 100) {
      return html`
        <div
          tooltip=${`Stats based on a ${samplePercent}% sample of all visitors`}
          class="cursor-pointer w-4 h-4 mx-2"
        >
          <svg
            class="absolute w-4 h-4 dark:text-gray-300 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      `;
    }
  }

  importedNotice() {
    const source = this.topStatData!.imported_source;

    if (source) {
      const withImported = this.topStatData!.with_imported;
      const strike = withImported ? '' : ' line-through';
      const target = url.setQuery('with_imported', !withImported);
      const tip = withImported ? '' : 'do not ';

      return html`
        <pl-link .to=${target} class="w-4 h-4 mx-2">
          <div
            tooltip=${`Stats ${tip}include data imported from ${source}.`}
            class="cursor-pointer w-4 h-4"
          >
            <svg
              class="absolute dark:text-gray-300 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <text
                x="4"
                y="18"
                fontSize="24"
                fill="currentColor"
                class={'text-gray-700 dark:text-gray-300' + strike}
              >
                ${source[0].toUpperCase()}
              </text>
            </svg>
          </div>
    </pl-link>
      `;
    }
  }

  render() {
    const extraClass =
      this.graphData && this.graphData.interval === 'hour'
        ? ''
        : 'cursor-pointer';

    return html`
      <div class="graph-inner">
        <div class="flex flex-wrap">
          <pl-top-stats
            .query=${this.query}
            .metric=${this.metric}
            .updateMetric=${this.updateMetric!}
            .topStatData=${this.topStatData}
          ></pl-top-stats>
        </div>
        <div class="relative px-2">
          <div class="absolute right-4 -top-10 flex">
            ${this.downloadLink()}
            ${this.samplingNotice()}
            ${this.importedNotice()}
          </div>
          <canvas
            id="main-graph-canvas"
            class={'mt-4 select-none ' + extraClass}
            width="1054"
            height="342"
          ></canvas>
        </div>
      </div>

    `;
  }
}

//import { withRouter, Link } from 'react-router-dom'

//const LineGraphWithRouter = withRouter(LineGraph)
