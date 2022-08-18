//import { withRouter } from 'react-router-dom';
import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';

import './pl-realtime.js';
//import './pl-historical.js';

import { parseQuery } from './query';
import * as api from './api';

//import { withComparisonProvider } from './comparison-provider-hoc';

import { PlausibleStyles } from './plausibleStyles.js';
import { PlausibleBaseElement } from './pl-base-element.js';
import { BrowserHistory, createBrowserHistory } from './util/history.js';
//import '@lit-labs/router';
//import { Routes } from '@lit-labs/router';

const THIRTY_SECONDS = 30000;

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
export class PlausibleDashboard extends PlausibleBaseElement {
  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: String })
  currentUserRole!: string;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  @property({ type: Object })
  history!: BrowserHistory;

  /*private routes = new Routes(this, [
    { path: '/', render: () => html`<h1>Home</h1>` },
    { path: '/projects', render: () => html`<h1>Projects</h1>` },
    { path: '/about', render: () => html`<h1>About</h1>` },
  ]);*/

  constructor() {
    super();
    this.site = {
      domain: "localhost",
      hasGoals: true,
      embedded: false,
      offset: 1,
      statsBegin: "2022-05-05"
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setState();
    this.history = createBrowserHistory();
    this.query = parseQuery(location.search, this.site);
    window.addEventListener('popstate',  () => {
      this.query = parseQuery(location.search, this.site);
      //update model accordingly
    });
  }

  static get styles() {
    return [
      ...super.styles,
    ];
  }

  setState() {
    this.updateState({
      timer: new Timer(),
      metric: 'visitors'
    } as PlausibleStateData);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('query')) {
      api.cancelAll();
      this.setState();
    }
  }

  render() {
    if (this.site && this.state && this.query) {
      if (true || this.state!.query!.period === 'day') {
        return html`
          <pl-realtime
            .timer="${this.state.timer}"
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
            .timer="${this.state.timer}"
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
