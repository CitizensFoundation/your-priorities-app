var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { navigateToQuery } from '../../query.js';
import numberFormatter from '../../util/number-formatter.js';
import * as api from '../../api';
import { dateFormatter } from './graph-util.js';
import './pl-top-stats.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
import { formatISO } from '../../util/date.js';
export class PlausibleBaseGraph extends PlausibleBaseElementWithState {
    regenerateChart() { }
    fetchGraphData() { }
    constructor() {
        super();
        this.darkTheme = false;
        this.exported = false;
        this.gradientColorStop1 = 'rgba(101,116,205, 0.2)';
        this.gradientColorStop2 = 'rgba(101,116,205, 0.2)';
        this.prevGradientColorStop1 = 'rgba(101,116,205, 0.075)';
        this.prevGradientColorStop2 = 'rgba(101,116,205, 0)';
        this.borderColor = 'rgba(101,116,205)';
        this.pointBackgroundColor = 'rgba(101,116,205)';
        this.pointHoverBackgroundColor = 'rgba(71, 87, 193)';
        this.prevPointHoverBackgroundColor = 'rgba(166,187,210,0.8)';
        this.prevBorderColor = 'rgba(166,187,210,0.5)';
        this.chartHeigh = 342;
        this.chartWidth = 1054;
        this.metrics = 'visitors';
        this.method = 'timeseries';
        this.repositionTooltip = this.repositionTooltip.bind(this);
    }
    static get styles() {
        return [...super.styles, css `.mainContainer{
      margin-top: 24px;
    }`];
    }
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('mousemove', this.repositionTooltip);
        this.fetchGraphData = this.fetchGraphData.bind(this);
    }
    firstUpdated(_changedProperties) {
        this.fetchGraphData();
        if (this.timer) {
            this.timer.onTick(this.fetchGraphData);
        }
        if (this.graphData) {
            this.chart = this.regenerateChart();
        }
        if (this.timer) {
            this.timer.onTick(this.fetchGraphData);
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.get('query')) {
            this.fetchGraphData();
        }
        const tooltip = this.$$('#chartjs-tooltip');
        if (this.graphData &&
            (changedProperties.has('graphData') || changedProperties.has('darkTheme'))) {
            if (this.chart) {
                this.chart.destroy();
            }
            this.chart = this.regenerateChart();
            this.chart.update();
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        }
        if (!this.graphData) {
            if (this.chart) {
                this.chart.destroy();
            }
            if (tooltip) {
                tooltip.style.display = 'none';
            }
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
    buildDataSet(plot, present_index, ctx, isPrevious = false) {
        var gradient = ctx.createLinearGradient(0, 0, 0, 300);
        var prev_gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, this.gradientColorStop1);
        gradient.addColorStop(1, this.gradientColorStop2);
        prev_gradient.addColorStop(0, this.prevGradientColorStop1);
        prev_gradient.addColorStop(1, this.prevGradientColorStop2);
        if (!isPrevious) {
            if (present_index) {
                var dashedPart = plot.slice(present_index - 1, present_index + 1);
                var dashedPlot = new Array(present_index - 1).concat(dashedPart);
                const _plot = [...plot];
                for (var i = present_index; i < _plot.length; i++) {
                    _plot[i] = undefined;
                }
                return [
                    {
                        label: this.label,
                        data: _plot,
                        borderWidth: 3,
                        borderColor: this.borderColor,
                        pointBackgroundColor: this.pointBackgroundColor,
                        pointHoverBackgroundColor: this.pointHoverBackgroundColor,
                        pointBorderColor: 'transparent',
                        pointHoverRadius: 4,
                        backgroundColor: gradient,
                        fill: true,
                    },
                    {
                        label: this.label,
                        data: dashedPlot,
                        borderWidth: 3,
                        borderDash: [3, 3],
                        borderColor: this.borderColor,
                        pointHoverBackgroundColor: this.pointHoverBackgroundColor,
                        pointBorderColor: 'transparent',
                        pointHoverRadius: 4,
                        backgroundColor: gradient,
                        fill: true,
                    },
                ];
            }
            else {
                return [
                    {
                        label: this.label,
                        data: plot,
                        borderWidth: 3,
                        borderColor: this.borderColor,
                        pointHoverBackgroundColor: this.pointHoverBackgroundColor,
                        pointBorderColor: 'transparent',
                        pointHoverRadius: 4,
                        backgroundColor: gradient,
                        fill: true,
                    },
                ];
            }
        }
        else {
            return [
                {
                    label: this.label,
                    data: plot,
                    borderWidth: 2,
                    // borderDash: [10, 1],
                    borderColor: this.prevBorderColor,
                    pointHoverBackgroundColor: this.prevPointHoverBackgroundColor,
                    pointBorderColor: 'transparent',
                    pointHoverBorderColor: 'transparent',
                    pointHoverRadius: 4,
                    backgroundColor: prev_gradient,
                    fill: true,
                },
            ];
        }
    }
    transformCustomDateForStatsQuery(query) {
        if (query.period == 'custom') {
            query.date = `${formatISO(query.from)},${formatISO(query.to)}`;
            query.from = undefined;
            query.to = undefined;
            return query;
        }
        else {
            return query;
        }
    }
    repositionTooltip(e) {
        const tooltipEl = this.$$('#chartjs-tooltip');
        if (tooltipEl && window.innerWidth >= 768) {
            if (e.clientX > 0.66 * window.innerWidth) {
                tooltipEl.style.right =
                    window.innerWidth - e.clientX + window.pageXOffset + 'px';
                tooltipEl.style.left = '';
            }
            else {
                tooltipEl.style.right = '';
                tooltipEl.style.left = e.clientX + window.pageXOffset + 'px';
            }
            tooltipEl.style.top = e.clientY + window.pageYOffset + 'px';
            tooltipEl.style.opacity = '1';
        }
    }
    /**
     * The current ticks' limits are set to treat iPad (regular/Mini/Pro) as a regular screen.
     * @param {*} chart - The chart instance.
     * @param {*} dimensions - An object containing the new dimensions *of the chart.*
     */
    updateWindowDimensions(chart, dimensions) {
        //@ts-ignore
        chart.options.scales.x.ticks.maxTicksLimit = dimensions.width < 720 ? 5 : 8;
        //@ts-ignore
        chart.options.scales.y.ticks.maxTicksLimit =
            dimensions.height < 233 ? 3 : 8;
    }
    pollExportReady() {
        if (document.cookie.includes('exporting')) {
            setTimeout(this.pollExportReady.bind(this), 1000);
        }
        else {
            this.exported = false;
        }
    }
    downloadSpinner() {
        this.exported = true;
        document.cookie = 'exporting=';
        setTimeout(this.pollExportReady.bind(this), 1000);
    }
    graphTooltip(graphData, mainCanvasElement, tooltipElement) {
        return (context) => {
            const tooltipModel = context.tooltip;
            const offset = mainCanvasElement.getBoundingClientRect();
            // Tooltip Element
            let tooltipEl = tooltipElement;
            // Create element on first render
            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.style.display = 'none';
                tooltipEl.style.opacity = 0;
                document.body.appendChild(tooltipEl);
            }
            if (tooltipEl && offset && window.innerWidth < 768) {
                tooltipEl.style.top =
                    offset.y + offset.height + window.scrollY + 15 + 'px';
                tooltipEl.style.left = offset.x + 'px';
                tooltipEl.style.right = null;
                tooltipEl.style.opacity = 1;
            }
            // Stop if no tooltip showing
            if (tooltipModel.opacity === 0) {
                tooltipEl.style.display = 'none';
                return;
            }
            function getBody(bodyItem) {
                return bodyItem.lines;
            }
            function renderLabel(label, prev_label = undefined) {
                const formattedLabel = dateFormatter(graphData.interval, true)(label);
                const prev_formattedLabel = prev_label && dateFormatter(graphData.interval, true)(prev_label);
                if (graphData.interval === 'month') {
                    return !prev_label ? formattedLabel : prev_formattedLabel;
                }
                if (graphData.interval === 'date') {
                    return !prev_label ? formattedLabel : prev_formattedLabel;
                }
                if (graphData.interval === 'hour') {
                    return !prev_label
                        ? `${dateFormatter('date', true)(label)}, ${formattedLabel}`
                        : `${dateFormatter('date', true)(prev_label)}, ${dateFormatter(graphData.interval, true)(prev_label)}`;
                }
                return !prev_label ? formattedLabel : prev_formattedLabel;
            }
            // function renderComparison(change) {
            //   const formattedComparison = numberFormatter(Math.abs(change))
            //   if (change > 0) {
            //     return `<span class='text-green-500 font-bold'>${formattedComparison}%</span>`
            //   }
            //   if (change < 0) {
            //     return `<span class='text-red-400 font-bold'>${formattedComparison}%</span>`
            //   }
            //   if (change === 0) {
            //     return `<span class='font-bold'>0%</span>`
            //   }
            // }
            // Set Tooltip Body
            if (tooltipModel.body) {
                var bodyLines = tooltipModel.body.map(getBody);
                // Remove duplicated line on overlap between dashed and normal
                if (bodyLines.length === 3) {
                    bodyLines[1] = false;
                }
                const data = tooltipModel.dataPoints[0];
                const label = graphData.labels[data.dataIndex];
                const point = data.raw || 0;
                // const prev_data = tooltipModel.dataPoints.slice(-1)[0]
                // const prev_label = graphData.prev_labels && graphData.prev_labels[prev_data.dataIndex]
                // const prev_point = prev_data.raw || 0
                // const pct_change = point === prev_point ? 0 : prev_point === 0 ? 100 : Math.round(((point - prev_point) / prev_point * 100).toFixed(1))
                let innerHtml = `
        <div class='text-gray-100 flex flex-col'>
          <div class='flex justify-between items-center'>
              <span class='font-bold mr-4 text-lg'>${this.label}</span>
          </div>
          <div class='flex flex-col'>
            <div class='flex flex-row justify-between items-center'>
              <span class='flex items-center mr-4'>
                <div class='w-3 h-3 mr-1 rounded-full' style='background-color: rgba(101,116,205)'></div>
                <span>${renderLabel(label)}</span>
              </span>
              <span>${numberFormatter(point)}</span>
            </div>
          </div>
          <span class='font-bold text-'>${graphData.interval === 'month'
                    ? 'Click to view month'
                    : graphData.interval === 'date'
                        ? 'Click to view day'
                        : ''}</span>
        </div>
        `;
                tooltipEl.innerHTML = innerHtml;
            }
            tooltipEl.style.display = null;
        };
    }
    onClick(e) {
        const element = this.chart.getElementsAtEventForMode(e, 'index', {
            intersect: false,
        }, false)[0];
        const date = this.chart.data.labels[element.index];
        if (this.graphData.interval === 'month') {
            navigateToQuery(this.history, this.query, {
                period: 'month',
                date,
            });
        }
        else if (this.graphData.interval === 'date') {
            navigateToQuery(this.history, this.query, {
                period: 'day',
                date,
            });
        }
    }
    downloadLink() {
        if (this.query.period !== 'realtime') {
            if (this.exported) {
                return html `
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
            }
            else {
                const endpoint = `/${encodeURIComponent(this.site.domain)}/export${api.serializeQuery(this.query)}`;
                //TODO: Get export working
                return html `
          <a
            hidden
            class="w-4 h-4 mx-2"
            href="${endpoint}"
            download
            @click="${this.downloadSpinner.bind(this)}"
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
        else {
            return nothing;
        }
    }
    renderHeader() { }
    render() {
        if (this.graphData) {
            const extraClass = this.graphData && this.graphData.interval === 'hour'
                ? ''
                : 'cursor-pointer';
            return html `
        <div class="mainContainer w-full p-4 bg-white rounded shadow-xl dark:bg-gray-825">
          ${this.renderHeader()}
          <div class="relative px-2">
            <div class="absolute right-4 -top-10 flex">
              ${this.downloadLink()}
            </div>
            <canvas
              id="main-graph-canvas"
              class=${'mt-4 select-none ' + extraClass}
              width="${this.chartWidth}"
              height="${this.chartHeigh}"
            ></canvas>
          </div>
        </div>
      `;
        }
        else {
            return nothing;
        }
    }
}
__decorate([
    property({ type: Object })
], PlausibleBaseGraph.prototype, "graphData", void 0);
__decorate([
    property({ type: Object })
], PlausibleBaseGraph.prototype, "ctx", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleBaseGraph.prototype, "darkTheme", void 0);
__decorate([
    property({ type: Object })
], PlausibleBaseGraph.prototype, "chart", void 0);
__decorate([
    query('canvas')
], PlausibleBaseGraph.prototype, "canvasElement", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleBaseGraph.prototype, "exported", void 0);
__decorate([
    property({ type: Object })
], PlausibleBaseGraph.prototype, "history", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "chartTitle", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "label", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "gradientColorStop1", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "gradientColorStop2", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "prevGradientColorStop1", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "prevGradientColorStop2", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "borderColor", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "pointBackgroundColor", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "pointHoverBackgroundColor", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "prevPointHoverBackgroundColor", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "prevBorderColor", void 0);
__decorate([
    property({ type: Number })
], PlausibleBaseGraph.prototype, "chartHeigh", void 0);
__decorate([
    property({ type: Number })
], PlausibleBaseGraph.prototype, "chartWidth", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "metrics", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseGraph.prototype, "method", void 0);
//# sourceMappingURL=pl-base-graph.js.map