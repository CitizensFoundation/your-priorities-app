var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import numberFormatter, { durationFormatter, } from '../../util/number-formatter.js';
import * as api from '../../api.js';
import * as storage from '../../util/storage.js';
import './pl-top-stats.js';
import './pl-line-graph.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';
let PlausibleVisitorsGraph = class PlausibleVisitorsGraph extends PlausibleBaseElementWithState {
    constructor() {
        super();
        // The current-visitors API does not support filtering by custom properties
        // this is a workaround
        this.useTopStatsForCurrentVisitors = false;
    }
    static get styles() {
        return [...super.styles];
    }
    connectedCallback() {
        super.connectedCallback();
        this.metric = storage.getItem(`metric__${this.site.domain}`) || 'visitors';
        this.updateMetric = this.updateMetric.bind(this);
        this.fetchGraphData = this.fetchGraphData.bind(this);
        this.fetchTopStatData = this.fetchTopStatData.bind(this);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.get('query')) {
            this.fetchGraphData();
            this.fetchTopStatData();
            //TODO: move this logic out of the updated call
            const savedMetric = storage.getItem(`metric__${this.site.domain}`);
            const topStatLabels = this.topStatData &&
                this.topStatData.top_stats
                    .map(({ name }) => METRIC_MAPPING[name])
                    .filter(name => name);
            const prevTopStatLabels = changedProperties.get('topStatData') &&
                changedProperties.get('topStatData').top_stats
                    .map(({ name }) => METRIC_MAPPING[name])
                    .filter(name => name);
            if (topStatLabels && `${topStatLabels}` !== `${prevTopStatLabels}`) {
                if (!topStatLabels.includes(savedMetric) && savedMetric !== '') {
                    if (this.query.filters.goal && this.metric !== 'conversions') {
                        this.metric = 'conversions';
                    }
                    else {
                        this.metric = topStatLabels[0];
                    }
                }
                else {
                    this.metric = savedMetric;
                }
            }
        }
        else if (changedProperties.get('metric')) {
            this.fetchGraphData();
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
    updateMetric(newMetric) {
        if (newMetric === this.metric) {
            storage.setItem(`metric__${this.site.domain}`, '');
            //this.metric = '';
            //this.graphData = undefined;
        }
        else {
            storage.setItem(`metric__${this.site.domain}`, newMetric);
            this.metric = newMetric;
        }
    }
    ///api/stats/localhost/sources?period=day&date=2022-08-14&filters=%7B%7D&with_imported=true&show_noref=false
    ///api/stats/localhost/sources?period=day&date=2022-08-14&filters=%7B%7D&with_imported=true&show_noref=false
    fetchGraphData() {
        if (this.metric) {
            api
                .get(this.proxyUrl, `/api/stats/${encodeURIComponent(this.site.domain)}/main-graph`, this.query, { metric: this.metric || 'none' })
                .then(res => {
                this.graphData = res;
            });
        }
    }
    fetchTopStatData() {
        api
            .get(this.proxyUrl, `/api/stats/${encodeURIComponent(this.site.domain)}/top-stats`, this.query)
            .then(res => {
            if (this.useTopStatsForCurrentVisitors &&
                this.query.period == 'realtime') {
                res.top_stats[0] = {
                    name: res.top_stats[0].name,
                    value: res.top_stats[1].value,
                };
            }
            this.topStatData = res;
        });
    }
    renderInner() {
        const theme = document.querySelector('html').classList.contains('dark') || false;
        return html `
      <pl-line-graph
        .graphData="${this.graphData}"
        .topStatData="${this.topStatData}"
        .site="${this.site}"
        .query="${this.query}"
        .darkTheme="${theme}"
        .metric="${this.metric}"
        .updateMetric="${this.updateMetric}"
      ></pl-line-graph>
    `;
    }
    render() {
        return html `
    <div class="graph-inner">
      <div
        class="${this.topStatData && !this.graphData
            ? 'pt-52 sm:pt-56 md:pt-60'
            : this.metric
                ? 'pt-32 sm:pt-36 md:pt-48'
                : 'pt-16 sm:pt-14 md:pt-18 lg:pt-5'} mx-auto ${this.topStatData ? '' : 'loading'}"
      >
        <div></div>
      </div>
    </div>
  ${this.topStatData ? this.renderInner() : nothing}
</div>

`;
    }
};
__decorate([
    property({ type: Object })
], PlausibleVisitorsGraph.prototype, "history", void 0);
__decorate([
    property({ type: String })
], PlausibleVisitorsGraph.prototype, "metric", void 0);
__decorate([
    property({ type: Object })
], PlausibleVisitorsGraph.prototype, "topStatData", void 0);
__decorate([
    property({ type: Object })
], PlausibleVisitorsGraph.prototype, "graphData", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleVisitorsGraph.prototype, "useTopStatsForCurrentVisitors", void 0);
PlausibleVisitorsGraph = __decorate([
    customElement('pl-visitors-graph')
], PlausibleVisitorsGraph);
export { PlausibleVisitorsGraph };
export const METRIC_MAPPING = {
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
export const METRIC_LABELS = {
    visitors: 'Visitors',
    pageviews: 'Pageviews',
    bounce_rate: 'Bounce Rate',
    visit_duration: 'Visit Duration',
    conversions: 'Converted Visitors',
    // 'time': 'Time on Page',
    // 'conversion_rate': 'Conversion Rate',
    // 't_conversions': 'Total Conversions'
};
export const METRIC_FORMATTER = {
    visitors: numberFormatter,
    pageviews: numberFormatter,
    bounce_rate: (number) => `${number}%`,
    visit_duration: durationFormatter,
    conversions: numberFormatter,
    // 'time': durationFormatter,
    // 'conversion_rate': (number) => (`${Math.max(number, 100)}%`),
    // 't_conversions': numberFormatter
};
//const LineGraphWithRouter = withRouter(LineGraph)
//# sourceMappingURL=pl-visitors-graph.js.map