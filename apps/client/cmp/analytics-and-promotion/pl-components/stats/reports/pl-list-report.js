var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from 'lit/decorators.js';
import { css, html, nothing } from 'lit';
import '../../pl-more-link.js';
import '../pl-bar.js';
import numberFormatter from '../../util/number-formatter.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
let PlausableListReport = class PlausableListReport extends PlausibleBaseElementWithState {
    constructor() {
        super(...arguments);
        this.filter = undefined;
        this.loading = false;
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.timer)
            this.timer.onTick(this.fetchData.bind(this));
        this.valueKey = this.valueKey || 'visitors';
        this.showConversionRate = !!this.query.filters.goal;
    }
    static get styles() {
        return [
            ...super.styles,
            css `
        .externalLinkSvg {
          margin-top: 8px;
          margin-left: 6px;
        }
      `,
        ];
    }
    getExternalLink(item) {
        if (this.externalLinkDest) {
            const dest = this.externalLinkDest(item);
            return html `
        <a
          target="_blank"
          rel="noreferrer"
          href=${dest}
          class="group-hover:block"
        >
          <svg
            class="inline w-4 h-4 ml-1 -mt-1 text-gray-600 dark:text-gray-400 externalLinkSvg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
            ></path>
            <path
              d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
            ></path>
          </svg>
        </a>
      `;
        }
        else {
            return nothing;
        }
    }
    firstUpdated(_changedProperties) {
        this.fetchData();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.get('query')) {
            this.fetchData();
        }
    }
    fetchData() {
        if (this.prevQuery !== this.query) {
            this.prevQuery = this.query;
            this.loading = true;
            this.list = undefined;
            try {
                this.fetchDataFunction().then((res) => {
                    this.loading = false;
                    this.list = res;
                });
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    get label() {
        if (this.query.period === 'realtime') {
            return this.t('Current visitors');
        }
        if (this.showConversionRate) {
            return this.t('Conversions');
        }
        return this.valueLabel || this.t('Visitors');
    }
    renderListItem(listItem) {
        const query = new URLSearchParams(window.location.search);
        Object.entries(this.filter).forEach(([key, valueKey]) => {
            // @ts-ignore
            query.set(key, listItem[valueKey]);
        });
        const maxWidthDeduction = this.showConversionRate ? '10rem' : '5rem';
        const lightBackground = this.color || 'bg-green-50';
        const noop = () => { };
        return html `
      <div
        class="flex items-center justify-between my-1 text-sm"
        key="${listItem.name}"
      >
        <pl-bar
          .count=${
        // @ts-ignore
        listItem[this.valueKey]}
          .all=${this.list}
          .bg=${`${lightBackground} dark:bg-gray-500 dark:bg-opacity-15`}
          maxWidthDeduction="${maxWidthDeduction}"
          .plot="${this.valueKey}"
        >
          <span
            class="flex px-2 py-1.5 group dark:text-gray-300 relative z-2 break-all"
            tooltip=${this.getTooltipText(listItem)}
          >
            <pl-link
              @click="${this.onClick || noop}"
              class="md:truncate block hover:underline"
              .to=${{ search: query.toString() }}
            >
              ${this.renderIcon(listItem)} ${listItem.name}
            </pl-link>
            ${this.getExternalLink(listItem)}
          </span>
        </pl-bar>
        <span
          class="font-medium dark:text-gray-200 w-20 text-right"
          tooltip=${
        // @ts-ignore
        listItem[this.valueKey]}
        >
          ${
        // @ts-ignore
        numberFormatter(listItem[this.valueKey])}
          ${listItem.percentage >= 0
            ? html `<span class="inline-block w-8 pl-1 text-xs text-right"
                >(${listItem.percentage}%)</span
              >`
            : nothing}
        </span>
        ${this.showConversionRate
            ? html `<span class="font-medium dark:text-gray-200 w-20 text-right"
              >${listItem.conversion_rate}%</span
            >`
            : nothing}
      </div>
    `;
    }
    renderList() {
        if (this.list && this.list.length > 0) {
            return html `
        <div
          class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
        >
          <span>${this.keyLabel}</span>
          <span class="text-right">
            <span class="inline-block w-30">${this.label}</span>
            ${this.showConversionRate
                ? html `<span class="inline-block w-20">CR</span>`
                : nothing}
          </span>
        </div>
        ${this.list.map((i) => this.renderListItem(i))}
      `;
        }
        else {
            return nothing;
        }
    }
    render() {
        return html `
      <div class="flex flex-col flex-grow">
        ${this.loading
            ? html `<div class="mx-auto loading mt-44"><div></div></div>`
            : nothing}
        <div class="flex-grow">${this.renderList()}</div>
        ${this.detailsLink && this.list
            ? html `<pl-more-link
              .url=${this.detailsLink}
              .list=${this.list}
            ></pl-more-link>`
            : nothing}
      </div>
    `;
    }
};
__decorate([
    property({ type: Object })
], PlausableListReport.prototype, "prevQuery", void 0);
__decorate([
    property({ type: String })
], PlausableListReport.prototype, "tabKey", void 0);
__decorate([
    property({ type: String })
], PlausableListReport.prototype, "valueKey", void 0);
__decorate([
    property({ type: String })
], PlausableListReport.prototype, "keyLabel", void 0);
__decorate([
    property({ type: String })
], PlausableListReport.prototype, "color", void 0);
__decorate([
    property({ type: String })
], PlausableListReport.prototype, "valueLabel", void 0);
__decorate([
    property({ type: String })
], PlausableListReport.prototype, "storedTab", void 0);
__decorate([
    property({ type: Object })
], PlausableListReport.prototype, "externalLinkDest", void 0);
__decorate([
    property({ type: Boolean })
], PlausableListReport.prototype, "showConversionRate", void 0);
__decorate([
    property({ type: String })
], PlausableListReport.prototype, "detailsLink", void 0);
__decorate([
    property({ type: Object })
], PlausableListReport.prototype, "onClick", void 0);
__decorate([
    property({ type: Object })
], PlausableListReport.prototype, "fetchDataFunction", void 0);
__decorate([
    property({ type: Object })
], PlausableListReport.prototype, "filter", void 0);
__decorate([
    property({ type: Array })
], PlausableListReport.prototype, "list", void 0);
__decorate([
    property({ type: Boolean })
], PlausableListReport.prototype, "loading", void 0);
PlausableListReport = __decorate([
    customElement('pl-list-report')
], PlausableListReport);
export { PlausableListReport };
//# sourceMappingURL=pl-list-report.js.map