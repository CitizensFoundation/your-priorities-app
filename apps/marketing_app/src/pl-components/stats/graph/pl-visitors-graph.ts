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
import { YpBaseElementWithLogin } from '../../../@yrpri/common/yp-base-element-with-login';
import tailwind from 'lit-tailwindcss';
import { PlausibleStyles } from '../../plausibleStyles';

@customElement('pl-visitors-graph')
export class PlausibleVisitorsGraph extends YpBaseElementWithLogin {
  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: Object })
  history!: any;

  @property({ type: Object })
  timer: any;

  @property({ type: Object })
  state!: PlausibleStateData;

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
    this.state = {
      ...this.state,
      loading: 2,
      metric: 'visitors',
    };
  }

  static get styles() {
    return [
      super.styles,
      tailwind,
      PlausibleStyles
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.state = {
      ...this.state,
      loading: 2,
      metric: storage.getItem(`metric__${this.site.domain}`) || 'visitors',
    };
    this.updateMetric = this.updateMetric.bind(this);
    this.fetchGraphData = this.fetchGraphData.bind(this);
    this.fetchTopStatData = this.fetchTopStatData.bind(this);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.get('query')) {
      this.state = {
        ...this.state,
        loading: 3,
        graphData: null,
        topStatData: undefined,
      };
      this.fetchGraphData();
      this.fetchTopStatData();
    }

    if (changedProperties.get('metric')) {
      this.state = {
        ...this.state,
        loading: 1,
        graphData: null,
      };
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
          this.state = {
            ...this.state,
            metric: 'conversions',
          };
        } else {
          this.state = {
            ...this.state,
            metric: topStatLabels[0],
          };
        }
      } else {
        this.state = {
          ...this.state,
          metric: savedMetric,
        };
      }
    }
  }

  firstUpdated() {
    //this.fetchGraphData();
    //this.fetchTopStatData();
    if (this.timer) {
      this.timer.onTick(this.fetchGraphData);
      this.timer.onTick(this.fetchTopStatData);
    }
  }

  updateMetric(newMetric: string) {
    if (newMetric === this.state.metric) {
      storage.setItem(`metric__${this.site.domain}`, '');
      this.state = {
        ...this.state,
        metric: '',
      };
    } else {
      storage.setItem(`metric__${this.site.domain}`, newMetric);
      this.state = {
        ...this.state,
        metric: newMetric,
      };
    }
  }

  ///api/stats/localhost/sources?period=day&date=2022-08-14&filters=%7B%7D&with_imported=true&show_noref=false
  ///api/stats/localhost/sources?period=day&date=2022-08-14&filters=%7B%7D&with_imported=true&show_noref=false

  fetchGraphData() {
    if (this.state.metric) {
      api
        .get(
          "communities",
          this.collectionId,
          `/api/stats/${encodeURIComponent(this.site!.domain!)}/main-graph`,
          this.query,
          { metric: this.state.metric || 'none' }
        )
        .then(res => {
          this.state = {
            ...this.state,
            loading: this.state.loading! - 2,
            graphData: res,
          };
          return res;
        });
    } else {
      this.state = {
        ...this.state,
        loading: this.state.loading! - 2, graphData: null };
    }
  }

  fetchTopStatData() {
    api
      .get(
        "communities",
        this.collectionId,
        `/api/stats/${encodeURIComponent(this.site!.domain!)}/top-stats`,
        this.query
      )
      .then(res => {
        this.state = {
          ...this.state,
          loading: this.state!.loading! - 1,
          topStatData: res,
        };
        return res;
      });
  }

  renderInner() {
    const { graphData, metric, topStatData, loading } = this.state;

    const theme =
      document.querySelector('html')!.classList.contains('dark') || false;

    if (
      (loading && loading <= 1 && topStatData) ||
      (topStatData && graphData)
    ) {
      return html`
        <pl-line-graph
          .graphData="${graphData}"
          .topStatData="${topStatData}"
          .site="${this.site}"
          .query="${this.query}"
          .darkTheme="${theme}"
          .metric="${metric!}"
          .updateMetric="${this.updateMetric}"
        ></pl-line-graph>
      `;
    } else {
      return nothing;
    }
  }

  render() {
    const { metric, topStatData, graphData } = this.state;
    return html`${this.state!.loading! < 1
      ? html`
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
