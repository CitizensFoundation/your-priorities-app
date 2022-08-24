//import { withRouter } from 'react-router-dom';
import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';

import './pl-realtime.js';
import './pl-historical.js';

import { parseQuery } from './query';
import * as api from './api';

//import { withComparisonProvider } from './comparison-provider-hoc';

import { BrowserHistory, createBrowserHistory } from './util/history.js';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state.js';

const THIRTY_SECONDS = 15000;

class Timer {
  listeners: Array<any> = [];
  intervalId: NodeJS.Timeout | undefined;

  constructor() {
    this.intervalId = setInterval(this.dispatchTick.bind(this), THIRTY_SECONDS);
  }

  onTick(listener: any) {
    this.listeners.push(listener);
  }

  dispatchTick() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

@customElement('pl-dashboard')
export class PlausibleDashboard extends PlausibleBaseElementWithState {
  @property({ type: Object })
  history!: BrowserHistory;

  @property({ type: String })
  metric = 'visitors'

  @property({ type: Object })
  collection!: YpCollectionData;

  @property({ type: String })
  plausibleSiteName: string | undefined


  /*private routes = new Routes(this, [
    { path: '/', render: () => html`<h1>Home</h1>` },
    { path: '/projects', render: () => html`<h1>Projects</h1>` },
    { path: '/about', render: () => html`<h1>About</h1>` },
  ]);*/

  constructor() {
    super();
  }

  resetState() {
    //this.timer = new Timer();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.timer = new Timer();
    try {
      fetch('/api/users/has/PlausibleSiteName', {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((response) => response.json())
      .then((data) => {
        this.plausibleSiteName = data.plausibleSiteName;
        this.setupSite();
      });
    } catch (error) {
      console.error(error);
    }
  }

  setupSite() {
    this.site = {
      domain: this.plausibleSiteName!,
      hasGoals: true,
      embedded: false,
      offset: 1,
      statsBegin: this.collection.created_at!,
      isDbip: false,
      flags: {
        custom_dimension_filter: false
      }
    }
    this.resetState();

    this.history = createBrowserHistory();
    this.query = parseQuery(location.search, this.site);
    window.addEventListener('popstate',  () => {
      this.query = parseQuery(location.search, this.site);
    });
  }

  static get styles() {
    return [
      ...super.styles,
    ];
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('query')) {
      api.cancelAll();
      this.resetState();
    }
  }

  render() {
    if (this.site && this.query && this.plausibleSiteName) {
      if (this.query!.period === 'realtime') {
        return html`
          <pl-realtime
            .timer="${this.timer}"
            .site="${this.site}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .history="${this.history}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-realtime>
        `;
      } else {
        return html`
          <pl-historical
            .timer="${this.timer}"
            .site="${this.site}"
            .history="${this.history}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-historical>
        `;
      }
    } else {
      return nothing;
    }
  }
}
