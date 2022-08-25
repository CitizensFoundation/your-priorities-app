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
    if (this.site && this.query) {
      if (this.query!.period === 'realtime') {
        return html`
          <md-navigation-bar>
            <md-navigation-tab @click=${() => this.history.push('/')} label="Home"></md-navigation-tab>
            <md-navigation-tab @click=${() => this.history.push('/')} label="Home"></md-navigation-tab>
            <md-navigation-tab @click=${() => this.history.push('/')} label="Home"></md-navigation-tab>
            <md-navigation-tab @click=${() => this.history.push('/')} label="Home"></md-navigation-tab>
          </md-navigation-bar>

          <md-fab extened label="HELLO"></md-fab>

          <md-elevated-button @click=${() => this.history.push('/')} label="Home"></md-elevated-button>
          <md-tonal-link-button @click=${() => this.history.push('/')} label="Home"></md-tonal-link-button>

          <md-chip label="hello"></md-chip>
          <md-chip label="323"></md-chip>
          <md-chip label="433"></md-chip>
          <md-chip label="433"></md-chip>
          <md-chip label="4343"></md-chip>

          <md-outlined-text-field label="Search"></md-outlined-text-field>
          <md-filled-text-field label="Search"></md-filled-text-field>
          <pl-realtime
            .timer="${this.timer}"
            .site="${this.site}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .history="${this.history}"
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
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
            .proxyUrl="${this.proxyUrl}"
            .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          ></pl-historical>
        `;
      }
    } else {
      return nothing;
    }
  }
}
