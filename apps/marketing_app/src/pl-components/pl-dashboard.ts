//import { withRouter } from 'react-router-dom';
import tailwind from 'lit-tailwindcss';
import { LitElement, css, html } from 'lit';
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
  @property({ type: String })
  query!: string;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: String })
  currentUserRole!: string;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

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
      offset: 1
    }

    this.setState();
  }

  static get styles() {
    return [
      ...super.styles,
    ];
  }

  setState() {
    this.updateState({
      query: parseQuery(this.query, this.site),
      timer: new Timer(),
      metric: 'visitors'
    } as PlausibleStateData);

    this.state.query = {...this.state.query, period: 'day'};
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('query')) {
      api.cancelAll();
      this.setState();
    }
  }

  render() {
    if (this.state && this.state.query) {
      if (this.state!.query!.period === 'day') {
        return html`
          <pl-realtime
            .timer="${this.state.timer}"
            .site="${this.site}"
            .currentRole="${this.currentUserRole}"
            .query="${this.state.query}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-realtime>
        `;
      } else {
        return html`
          <pl-historical
            .timer="${this.state.timer}"
            .site="${this.site}"
            .currentRole="${this.currentUserRole}"
            .query="${this.state.query}"
            .collectionId="${this.collectionId}"
            .collectionType="${this.collectionType}"
          ></pl-historical>
        `;
      }
    }
  }
}
