import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import { customElement, property } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';
import { html, nothing } from 'lit';

import '../../pl-fade-in.js';
import '../../pl-more-link.js';
import '../pl-bar.js';
import '../../components/lazy-loader.js';
import numberFormatter from '../../util/number-formatter.js';

@customElement('pl-list-report')
export class PlausableListReport extends PlausibleBaseElement {
  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  prevQuery!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: String })
  tabKey!: string;

  @property({ type: String })
  valueKey!: string;

  @property({ type: String })
  color: string | undefined;

  @property({ type: String })
  valueLabel: string | undefined;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  @property({ type: String })
  storedTab: string | undefined;

  @property({ type: Object })
  timer!: any;

  @property({ type: Object })
  externalLinkDest: Function | undefined;

  @property({ type: Boolean })
  showConversionRate: boolean | undefined;

  @property({ type: String })
  detailsLink: string | undefined;

  constructor() {
    super();
    this.updateState({ loading: true, list: undefined });
    if (this.timer) this.timer.onTick(this.fetchData);
    this.valueKey = this.valueKey || 'visitors';
    this.showConversionRate = !!this.query.filters!.goal;
  }

  getExternalLink(item: string) {
    if (this.externalLinkDest) {
      const dest = this.externalLinkDest(item);
      return html`
        <a
          target="_blank"
          rel="noreferrer"
          href=${dest}
          class="hidden group-hover:block"
        >
          <svg
            class="inline w-4 h-4 ml-1 -mt-1 text-gray-600 dark:text-gray-400"
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
    } else {
      return nothing;
    }
  }

  protected firstUpdated(
    _changedProperties: Map<string | number | symbol, unknown>
  ): void {
    this.fetchData();
  }

  fetchData() {
    if (this.prevQuery !== this.query) {
      this.prevQuery = this.query;
      this.updateState({ loading: true, list: null });
      fetchData().then((res: any) =>
        this.updateState({ loading: false, list: res })
      );
    }
  }

  get label() {
    if (this.query.period === 'realtime') {
      return 'Current visitors';
    }

    if (this.showConversionRate) {
      return 'Conversions';
    }

    return this.valueLabel || 'Visitors';
  }

  renderListItem(listItem: PlausibleListItemData) {
    const query = new URLSearchParams(window.location.search);

    Object.entries(this.filter).forEach(([key, valueKey]) => {
      query.set(key, listItem[valueKey]);
    });

    const maxWidthDeduction = this.showConversionRate ? '10rem' : '5rem';
    const lightBackground = this.color || 'bg-green-50';
    const noop = () => {};

    return html`
      <div
        class="flex items-center justify-between my-1 text-sm"
        key="{listItem.name}"
      >
        <pl-bar
          count=${listItem[this.valueKey]}
          .all=${this.state.list}
          .bg=${`${lightBackground} dark:bg-gray-500 dark:bg-opacity-15`}
          maxWidthDeduction="${maxWidthDeduction}"
          .plot="${this.valueKey}"
        >
          <span
            class="flex px-2 py-1.5 group dark:text-gray-300 relative z-9 break-all"
            tooltip=${this.tooltipText && this.tooltipText(listItem)}
          >
            <pl-link
              @click="${this.onClick || noop}"
              class="md:truncate block hover:underline"
              to=${{ search: query.toString() }}
            >
              ${this.renderIcon && props.renderIcon(listItem)} ${this.renderIcon
              && ' '} ${listItem.name}
            </pl-link>
            <pl-external-link
              .item="${listItem}"
              .externalLinkDest="${this.externalLinkDest}"
            ></pl-external-link>
          </span>
        </pl-bar>
        <span
          class="font-medium dark:text-gray-200 w-20 text-right"
          tooltip=${listItem[this.valueKey]}
        >
          ${numberFormatter(listItem[this.valueKey])} { listItem.percentage >= 0
          ?
          <span class="inline-block w-8 pl-1 text-xs text-right"
            >(${listItem.percentage}%)</span
          >
          : null }
        </span>
        ${this.showConversionRate
          ? html`<span class="font-medium dark:text-gray-200 w-20 text-right"
              >${listItem.conversion_rate}%</span
            >`
          : nothing}
      </div>
    `;
  }

  renderList() {
    if (this.state.list && this.state.list.length > 0) {
      return html`
        <div
          class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
        >
          <span>${ this.keyLabel }</span>
          <span class="text-right">
            <span class="inline-block w-30">${this.label}</span>
            ${this.showConversionRate
              ? html`<span class="inline-block w-20">CR</span>`
              : nothing}
          </span>
        </div>
        ${this.state.list ? this.state.list.map(this.renderListItem) : nothing}
      `;
    }
  }

  render() {
    return html`
      <div class="flex flex-col flex-grow">
        ${this.state.loading
          ? html`<div class="mx-auto loading mt-44"><div></div></div>`
          : nothing}
        <div class="flex-grow">${this.renderList()}</div>
        ${this.detailsLink && !this.state.loading
          ? html`<pl-more-link
              .url=${this.detailsLink}
              .list=${this.state.list}
            ></pl-more-link>`
          : nothing}
      </div>
    `;
  }
}
