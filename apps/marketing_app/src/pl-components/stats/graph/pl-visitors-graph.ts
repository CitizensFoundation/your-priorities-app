import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import Chart from 'chart.js/auto';
import { navigateToQuery } from '../../query';
import numberFormatter, {
  durationFormatter,
} from '../../util/number-formatter.js';
import * as api from '../../api.js';
import * as storage from '../../util/storage.js';
import { GraphTooltip, buildDataSet, dateFormatter } from './graph-util.js';
import * as url from '../../util/url.js';
import './pl-top-stats.js';
import './pl-line-graph.js';
import { PlausibleStyles } from '../../plausibleStyles';
import { PlausibleBaseElement } from '../../pl-base-element';

@customElement('pl-visitors-graph')
export class PlausibleVisitorsGraph extends PlausibleBaseElement {
  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: Object })
  history!: any;

  @property({ type: Object })
  timer: any;

  @property({ type: String })
  metric!: string;

  @property({ type: Object })
  topStatData: PlausibleTopStatsData | undefined | null;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  constructor() {
    super();
  }

  static get styles() {
    return [
      ...super.styles,
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.updateState({
      loadingStage: 2,
      metric: storage.getItem(`metric__${this.site.domain}`) || 'visitors',
    });

    this.updateMetric = this.updateMetric.bind(this);
    this.fetchGraphData = this.fetchGraphData.bind(this);
    this.fetchTopStatData = this.fetchTopStatData.bind(this);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.get('query')) {
      debugger;

      this.updateState({
        loadingStage: 3,
//        graphData: null,
//        topStatData: undefined,
      });
      this.fetchGraphData();
      this.fetchTopStatData();
    }

    if (changedProperties.get('metric')) {
      this.updateState({
        loadingStage: 1,
//        graphData: null,
      });
      this.fetchGraphData();
    }

    const savedMetric = storage.getItem(`metric__${this.site.domain}`);
    const topStatLabels =
      this.topStatData &&
      this.topStatData.top_stats
        .map(({ name }) => METRIC_MAPPING[name])
        .filter(name => name);
    const prevTopStatLabels =
      changedProperties.get('topStatData') &&
      (changedProperties.get('topStatData') as PlausibleTopStatsData).top_stats
        .map(({ name }) => METRIC_MAPPING[name])
        .filter(name => name);
    if (topStatLabels && `${topStatLabels}` !== `${prevTopStatLabels}`) {
      if (!topStatLabels.includes(savedMetric) && savedMetric !== '') {
        if (this.query!.filters!.goal && this.metric !== 'conversions') {
          this.updateState({
            metric: 'conversions',
          });
        } else {
          this.updateState({
            metric: topStatLabels[0],
          });
        }
      } else {
        this.updateState({
          metric: savedMetric,
        });
      }
    }
  }

  firstUpdated() {
    this.fetchGraphData();
    this.fetchTopStatData();
    if (this.timer) {
      this.timer.onTick(this.fetchGraphData);
      this.timer.onTick(this.fetchTopStatData);
    }
  }

  updateMetric(newMetric: string) {
    if (newMetric === this.state.metric) {
      storage.setItem(`metric__${this.site.domain}`, '');
      this.updateState({
        metric: '',
      });
    } else {
      storage.setItem(`metric__${this.site.domain}`, newMetric);
      this.updateState({
        metric: newMetric,
      });
    }
  }

  ///api/stats/localhost/sources?period=day&date=2022-08-14&filters=%7B%7D&with_imported=true&show_noref=false
  ///api/stats/localhost/sources?period=day&date=2022-08-14&filters=%7B%7D&with_imported=true&show_noref=false

  fetchGraphData() {
    if (this.state.metric) {
      api
        .getWithProxy(
          "communities",
          this.collectionId,
          `/api/stats/${encodeURIComponent(this.site!.domain!)}/main-graph`,
          this.query,
          { metric: this.state.metric || 'none' }
        )
        .then(res => {
          this.updateState({
            loadingStage: this.state.loadingStage! - 2,
            graphData: res,
          });
          debugger;
          this.requestUpdate();
          return res;
        });
    } else {
      this.updateState({
        loadingStage: this.state.loadingStage! - 2, graphData: null
      });
    }
  }

  fetchTopStatData() {
    api
      .getWithProxy(
        "communities",
        this.collectionId,
        `/api/stats/${encodeURIComponent(this.site!.domain!)}/top-stats`,
        this.query
      )
      .then(res => {
        this.updateState({
          loadingStage: this.state.loadingStage! - 1,
          topStatData: res,
        });
        this.requestUpdate();
        return res;
      });
  }

  renderInner() {
    const theme =
      document.querySelector('html')!.classList.contains('dark') || false;

    if (
      (this.state.topStatData && this.state.graphData)
    ) {
      return html`
        <pl-line-graph
          .graphData="${this.state.graphData}"
          .topStatData="${this.state.topStatData}"
          .site="${this.site}"
          .query="${this.query}"
          .darkTheme="${theme}"
          .metric="${this.state.metric!}"
          .updateMetric="${this.updateMetric}"
        ></pl-line-graph>
      `;
    } else {
      return nothing;
    }
  }

  render() {
    const { metric, topStatData, graphData } = this.state;
    return html`${(this.state.graphData && this.state.topStatData) ? html`
              <div class="graph-inner">
                <div
                  class="${
                    topStatData && !graphData
                      ? 'pt-52 sm:pt-56 md:pt-60'
                      : metric
                      ? 'pt-32 sm:pt-36 md:pt-48'
                      : 'pt-16 sm:pt-14 md:pt-18 lg:pt-5'
                  } mx-auto loading"
                >
                  <div></div>
                </div>
              </div>
            ${this.renderInner()}
          </div>

    `
      : nothing}`;
  }
}

export const METRIC_MAPPING: Record<string, string> = {
  'Unique visitors (last 30 min)': 'visitors',
  'Pageviews (last 30 min)': 'pageviews',
  'Unique visitors': 'visitors',
  'Visit duration': 'visit_duration',
  'Total pageviews': 'pageviews',
  'Bounce rate': 'bounce_rate',
  'Unique conversions': 'conversions',
  // 'Time on Page': 'time',
  // 'Conversion rate': 'conversion_rate',
  // 'Total conversions': 't_conversions',
};

export const METRIC_LABELS: Record<string, string> = {
  visitors: 'Visitors',
  pageviews: 'Pageviews',
  bounce_rate: 'Bounce Rate',
  visit_duration: 'Visit Duration',
  conversions: 'Converted Visitors',
  // 'time': 'Time on Page',
  // 'conversion_rate': 'Conversion Rate',
  // 't_conversions': 'Total Conversions'
};

export const METRIC_FORMATTER: Record<string, any> = {
  visitors: numberFormatter,
  pageviews: numberFormatter,
  bounce_rate: (number: number) => `${number}%`,
  visit_duration: durationFormatter,
  conversions: numberFormatter,
  // 'time': durationFormatter,
  // 'conversion_rate': (number) => (`${Math.max(number, 100)}%`),
  // 't_conversions': numberFormatter
};

//const LineGraphWithRouter = withRouter(LineGraph)
