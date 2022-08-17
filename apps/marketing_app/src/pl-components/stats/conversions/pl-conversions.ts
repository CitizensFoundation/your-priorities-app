import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import numberFormatter from '../../util/number-formatter';
import * as api from '../../api.js';
import * as url from '../../util/url.js';
import { suppressDeprecationWarnings } from 'moment';

import '../../pl-link.js';
import '../pl-bar.js';
import './pl-prop-breakdown.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';

const MOBILE_UPPER_WIDTH = 767;
const DEFAULT_WIDTH = 1080;

@customElement('pl-conversions')
export class PlausibleConversions extends PlausibleBaseElement {
  @property({ type: Object })
  onClickFunction!: any;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  constructor() {
    super();

    this.updateState({
      loading: true,
      viewport: DEFAULT_WIDTH,
    });

    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.handleResize, false);
    this.handleResize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleResize, false);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.get('query')) {
      const height = this.offsetHeight;
      this.updateState({ loading: true, goals: undefined, prevHeight: height });
      this.fetchConversions();
    }
  }

  static get styles() {
    return [
      ...super.styles,
    ];
  }

  handleResize() {
    this.updateState({ viewport: window.innerWidth });
  }

  firstUpdated() {
    this.fetchConversions();
  }

  getBarMaxWidth() {
    const { viewport } = this.state;
    return viewport! > MOBILE_UPPER_WIDTH ? '16rem' : '10rem';
  }

  fetchConversions() {
    api
      .getWithProxy(
        'communities',
        this.collectionId,
        `/api/stats/${encodeURIComponent(this.site.domain!)}/conversions`,
        this.query
      )
      .then(res =>
        this.updateState({ loading: false, goals: res, prevHeight: undefined })
      );
  }

  renderGoal(goal: PlausibleGoalData) {
    const { viewport } = this.state;
    const renderProps =
      this.query.filters!['goal'] == goal.name && goal.prop_names;

    return html`
      <div class="my-2 text-sm" key=${goal.name}>
        <div class="flex items-center justify-between my-2">
          <pl-bar
            .count="${goal.unique_conversions}"
            .all="${this.state.goals!}"
            bg="bg-red-50 dark:bg-gray-500 dark:bg-opacity-15"
            .maxWidthDeduction="${this.getBarMaxWidth()}"
            plot="unique_conversions"
          >
            <pl-link
              .to="${{search: url.setQuery('goal', goal.name)}}"
              class="block px-2 py-1.5 hover:underline relative z-9 break-all lg:truncate dark:text-gray-200"
              >${goal.name}</pl-link
            >
          </pl-bar>
          <div class="dark:text-gray-200">
            <span class="inline-block w-20 font-medium text-right"
              >${numberFormatter(goal.unique_conversions)}</span
            >
            ${viewport && viewport > MOBILE_UPPER_WIDTH
              ? html`<span class="inline-block w-20 font-medium text-right"
                  >${numberFormatter(goal.total_conversions)}</span
                >`
              : nothing}
            <span class="inline-block w-20 font-medium text-right"
              >${goal.conversion_rate}%</span
            >
          </div>
        </div>
        ${renderProps
          ? html`<pl-prop-breakdown
              .site=${this.site}
              .query=${this.query}
              .goal=${goal}
              .collectionId=${this.collectionId}
              .collectionType=${this.collectionType}
            ></pl-prop-breakdown>`
          : nothing}
      </div>
    `;
  }

  renderInner() {
    const { viewport } = this.state;
    if (this.state.loading) {
      return html`<div class="mx-auto my-2 loading"><div></div></div>`;
    } else if (this.state.goals) {
      return html`
        <h3 class="font-bold dark:text-gray-100">
          ${this.title || "Goal Conversions"}
        </h3>
        <div
          class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
        >
          <span>Goal</span>
          <div class="text-right">
            <span class="inline-block w-20">Uniques</span>
            ${viewport && viewport > MOBILE_UPPER_WIDTH
              ? html`<span class="inline-block w-20">Total</span>`
              : nothing}
            <span class="inline-block w-20">CR</span>
          </div>
        </div>

        ${this.state.goals.map(this.renderGoal.bind(this))}
      `;
    }
  }

  render() {
    return html`
      <div
        class="w-full p-4 bg-white rounded shadow-xl dark:bg-gray-825"
        .style="${{
          minHeight: '132px',
          height: this.state.prevHeight ?? 'auto',
        }}"
        .ref=${this}
      >
        ${this.renderInner()}
      </div>
    `;
  }
}
