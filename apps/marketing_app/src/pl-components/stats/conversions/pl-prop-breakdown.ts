
import * as storage from '../../util/storage.js';
import Bar from '../plbar'
import '../pl-bar.js';
import numberFormatter from '../../util/number-formatter'
import * as api from '../../api'


import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { PlausibleStyles } from './plausibleStyles.js';
import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';

import numberFormatter from '../../util/number-formatter';
import * as api from '../../api.js';
import * as url from '../../util/url.js';
import { suppressDeprecationWarnings } from 'moment';

import '../../pl-link.js';
import '../pl-bar.js';
import '../pl-prop-breakdown.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';

const MOBILE_UPPER_WIDTH = 767;
const DEFAULT_WIDTH = 1080;

// https://stackoverflow.com/a/43467144
function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}


@customElement('pl-prop-breakdown')
export class PlausiblePropBreakdown extends PlausibleBaseElement {
  @property({ type: Object })
  onClickFunction!: any;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  goal!: PlausibleGoalData;

  @property({ type: String })
  propKey!: string;

  @property({ type: String })
  storageKey: string;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  constructor() {
    super();
    let propKey = this.goal.prop_names[0];
    this.storageKey = 'goalPropTab__' + this.site.domain + this.goal.name
    const storedKey = storage.getItem(this.storageKey)
    if (this.goal.prop_names.includes(storedKey)) {
      propKey = storedKey
    }
    if (this.query.filters!['props']) {
      propKey = Object.keys(this.query.filters!['props'])[0]
    }

    this.updateState({
      loading: true,
      propKey: propKey,
      viewport: DEFAULT_WIDTH,
      breakdown: [],
      page: 1,
      moreResultsAvailable: false
    });

    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('resize', this.handleResize, false);

    this.handleResize();
    this.fetchPropBreakdown()
  }

  disconnectedCallback(): void {
    window.removeEventListener('resize', this.handleResize, false);
  }

  handleResize() {
    this.updateState({ viewport: window.innerWidth });
  }

  getBarMaxWidth() {
    const { viewport } = this.state;
    return viewport! > MOBILE_UPPER_WIDTH ? "16rem" : "10rem";
  }

  fetchPropBreakdown() {
    if (this.query.filters!['goal']) {
      api.getWithProxy(
        'communities',
        this.collectionId,
        `/api/stats/${encodeURIComponent(this.site.domain!)}/property/${encodeURIComponent(this.state.propKey!)}`, this.props.query, {limit: 100, page: this.state.page})
        .then((res) => this.updateState({
          loading: false,
          breakdown: this.state.breakdown!.concat(res),
          moreResultsAvailable: res.length === 100
        }))
    }
  }

  loadMore() {
    this.updateState({loading: true, page: this.state.page! + 1})
    this.fetchPropBreakdown();
  }

  renderUrl(value: PlausiblePropValueData) {
    if (isValidHttpUrl(value.name)) {
      return html`
        <a target="_blank" href={value.name} rel="noreferrer" class="hidden group-hover:block">
          <svg class="inline h-4 w-4 ml-1 -mt-1 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
        </a>
      `;
    } else {
      return nothing;
    }
  }

  renderPropContent(value: PlausiblePropValueData, query: URLSearchParams) {
    return html`
      <span class="flex px-2 py-1.5 group dark:text-gray-300 relative z-9 break-all">
        <pl-link
          .to=${{pathname: window.location.pathname, search: query.toString()}}
          class="md:truncate hover:underline block"
        >
          ${ value.name }
        </pl-link>
        ${ this.renderUrl(value) }
      </span>
    `;
  }

  renderPropValue(value: PlausiblePropValueData) {
    const query = new URLSearchParams(window.location.search)
    query.set('props', JSON.stringify({[this.state.propKey!]: value.name}))
    const { viewport } = this.state;

    return html`
      <div class="flex items-center justify-between my-2" key={value.name}>
        <pl-bar
          count={value.unique_conversions}
          plot="unique_conversions"
          all={this.state.breakdown}
          bg="bg-red-50 dark:bg-gray-500 dark:bg-opacity-15"
          maxWidthDeduction={this.getBarMaxWidth()}
        >
          ${this.renderPropContent(value, query)}
        </pl-bar>
        <div class="dark:text-gray-200">
          <span class="font-medium inline-block w-20 text-right">${numberFormatter(value.unique_conversions)}</span>
          ${
            (viewport && viewport > MOBILE_UPPER_WIDTH) ?
            html`              <span
            class="font-medium inline-block w-20 text-right"
          >${numberFormatter(value.total_conversions)}
          </span>
`
            : null
          }
          <span class="font-medium inline-block w-20 text-right">{numberFormatter(value.conversion_rate)}%</span>
        </div>
      </div>
    `;
  }

  changePropKey(newKey) {
    storage.setItem(this.storageKey, newKey)
    this.setState({propKey: newKey, loading: true, breakdown: [], page: 1, moreResultsAvailable: false}, this.fetchPropBreakdown)
  }

  renderLoading() {
    if (this.state.loading) {
      return <div class="px-4 py-2"><div class="loading sm mx-auto"><div></div></div></div>
    } else if (this.state.moreResultsAvailable) {
      return (
        <div class="w-full text-center my-4">
          <button onClick={this.loadMore.bind(this)} type="button" class="button">
            Load more
          </button>
        </div>
      )
    }
  }

  renderBody() {
    return this.state.breakdown.map((propValue) => this.renderPropValue(propValue))
  }

  renderPill(key) {
    const isActive = this.state.propKey === key

    if (isActive) {
      return <li key={key} class="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold mr-2 active-prop-heading">{key}</li>
    } else {
      return <li key={key} class="hover:text-indigo-600 cursor-pointer mr-2" onClick={this.changePropKey.bind(this, key)}>{key}</li>
    }
  }

  render() {
    return (
      <div class="w-full pl-3 sm:pl-6 mt-4">
        <div class="flex-col sm:flex-row flex items-center pb-1">
          <span class="text-xs font-bold text-gray-600 dark:text-gray-300 self-start sm:self-auto mb-1 sm:mb-0">Breakdown by:</span>
          <ul class="flex flex-wrap font-medium text-xs text-gray-500 dark:text-gray-400 leading-5 pl-1 sm:pl-2">
            { this.props.goal.prop_names.map(this.renderPill.bind(this)) }
          </ul>
        </div>
        { this.renderBody() }
        { this.renderLoading()}
      </div>
    )
  }
}

