var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import numberFormatter, { durationFormatter, } from '../../util/number-formatter.js';
import { METRIC_MAPPING, METRIC_LABELS } from './pl-visitors-graph.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';
let PlausibleTopStats = class PlausibleTopStats extends PlausibleBaseElement {
    constructor() {
        super(...arguments);
        this.disabled = false;
    }
    static get styles() {
        return [
            ...super.styles,
        ];
    }
    renderComparison(name, comparison) {
        const formattedComparison = numberFormatter(Math.abs(comparison));
        if (comparison > 0) {
            const color = name === 'Bounce rate' ? 'text-red-400' : 'text-green-500';
            return html `<span class="text-xs dark:text-gray-100"
        ><span class="${color + ' font-bold'}">&uarr;</span
        >${formattedComparison}%</span
      >`;
        }
        else if (comparison < 0) {
            const color = name === 'Bounce rate' ? 'text-green-500' : 'text-red-400';
            return html `<span class="text-xs dark:text-gray-100"
        ><span class="${color + ' font-bold'}">&darr;</span>
        ${formattedComparison}%</span
      >`;
        }
        else if (comparison === 0) {
            return html `<span class="text-xs text-gray-700 dark:text-gray-300"
        >&#12336; N/A</span
      >`;
        }
        else {
            return nothing;
        }
    }
    topStatNumberShort(stat) {
        if (['visit duration', 'time on page'].includes(stat.name.toLowerCase())) {
            return durationFormatter(stat.value);
        }
        else if (['bounce rate', 'conversion rate'].includes(stat.name.toLowerCase())) {
            return stat.value + '%';
        }
        else {
            return numberFormatter(stat.value);
        }
    }
    topStatTooltip(stat) {
        if ([
            'visit duration',
            'time on page',
            'bounce rate',
            'conversion rate',
        ].includes(stat.name.toLowerCase())) {
            return null;
        }
        else {
            let name = stat.name.toLowerCase();
            name = stat.value === 1 ? name.slice(0, -1) : name;
            return stat.value.toLocaleString() + ' ' + name;
        }
    }
    titleFor(stat) {
        if (this.metric === METRIC_MAPPING[stat.name]) {
            return `Hide ${METRIC_LABELS[METRIC_MAPPING[stat.name]].toLowerCase()} from graph`;
        }
        else {
            return `Show ${METRIC_LABELS[METRIC_MAPPING[stat.name]].toLowerCase()} on graph`;
        }
    }
    renderStat(stat) {
        return html ` <div
      class="flex items-center justify-between my-1 whitespace-nowrap"
    >
      <b
        class="mr-4 text-xl md:text-2xl dark:text-gray-100"
        tooltip="${ifDefined(this.topStatTooltip(stat) === null
            ? undefined
            : this.topStatTooltip(stat))}"
        >${this.topStatNumberShort(stat)}</b
      >
      ${this.renderComparison(stat.name, stat.change)}
    </div>`;
    }
    render() {
        const stats = this.topStatData &&
            this.topStatData.top_stats.map((stat, index) => {
                let border = index > 0 ? 'lg:border-l border-gray-300' : '';
                border = index % 2 === 0 ? border + ' border-r lg:border-r-0' : border;
                const isClickable = Object.keys(METRIC_MAPPING).includes(stat.name) &&
                    !(this.query.filters.goal && stat.name === 'Unique visitors');
                const isSelected = this.metric === METRIC_MAPPING[stat.name];
                const [statDisplayName, statExtraName] = stat.name.split(/(\(.+\))/g);
                const translatedName = this.t(statDisplayName);
                return html `
          ${isClickable
                    ? html `
                <div
                  class="${`px-4 md:px-6 w-1/2 my-4 lg:w-auto group cursor-pointer select-none ${border}`}"
                  @click="${() => {
                        this.updateMetric(METRIC_MAPPING[stat.name]);
                    }}"
                  tabindex="0"
                  .title="${this.titleFor(stat)}"
                >
                  <div
                    class="${`text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap flex w-content
                  ${isSelected
                        ? `text-indigo-700 dark:text-indigo-500
                        border-indigo-700 dark:border-indigo-500`
                        : `group-hover:text-indigo-700
                        dark:group-hover:text-indigo-500`}`}"
                  >
                    ${translatedName}
                  </div>
                  <span class="hidden sm:inline-block ml-1"
                    >${statExtraName}</span
                  >
                  ${this.renderStat(stat)}
                </div>
              `
                    : html `
                <div class=${`px-4 md:px-6 w-1/2 my-4 lg:w-auto ${border}`}>
                  <div
                    class="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400 whitespace-nowrap flex"
                  >
                    ${stat.name}
                  </div>
                  ${this.renderStat(stat)}
                </div>
              `}
        `;
            });
        if (this.query && this.query.period === 'realtime') {
            stats.push(html `<div
          key="dot"
          class="block pulsating-circle"
          .style=${{ left: '125px', top: '52px' }}
        ></div>`);
        }
        return stats;
    }
};
__decorate([
    property({ type: Boolean })
], PlausibleTopStats.prototype, "disabled", void 0);
__decorate([
    property({ type: Object })
], PlausibleTopStats.prototype, "query", void 0);
__decorate([
    property({ type: Object })
], PlausibleTopStats.prototype, "updateMetric", void 0);
__decorate([
    property({ type: Object })
], PlausibleTopStats.prototype, "history", void 0);
__decorate([
    property({ type: String })
], PlausibleTopStats.prototype, "classsName", void 0);
__decorate([
    property({ type: Object })
], PlausibleTopStats.prototype, "to", void 0);
__decorate([
    property({ type: String })
], PlausibleTopStats.prototype, "metric", void 0);
__decorate([
    property({ type: Object })
], PlausibleTopStats.prototype, "topStatData", void 0);
PlausibleTopStats = __decorate([
    customElement('pl-top-stats')
], PlausibleTopStats);
export { PlausibleTopStats };
//# sourceMappingURL=pl-top-stats.js.map