var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//import { withRouter } from 'react-router-dom';
import { html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import './pl-realtime.js';
import './pl-historical.js';
import { parseQuery } from './query';
import * as api from './api';
//import { withComparisonProvider } from './comparison-provider-hoc';
import { createBrowserHistory } from './util/history.js';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state.js';
const THIRTY_SECONDS = 30000;
class Timer {
    constructor() {
        this.listeners = [];
        this.intervalId = setInterval(this.dispatchTick.bind(this), THIRTY_SECONDS);
    }
    onTick(listener) {
        this.listeners.push(listener);
    }
    dispatchTick() {
        for (const listener of this.listeners) {
            listener();
        }
    }
}
let PlausibleDashboard = class PlausibleDashboard extends PlausibleBaseElementWithState {
    /*private routes = new Routes(this, [
      { path: '/', render: () => html`<h1>Home</h1>` },
      { path: '/communities', render: () => html`<h1>Communities</h1>` },
      { path: '/about', render: () => html`<h1>About</h1>` },
    ]);*/
    constructor() {
        super();
        this.metric = 'visitors';
    }
    resetState() {
        //this.timer = new Timer();
    }
    connectedCallback() {
        super.connectedCallback();
        this.timer = new Timer();
        this.history = createBrowserHistory();
        this.query = parseQuery(location.search, this.site);
        window.addEventListener('popstate', () => {
            this.query = parseQuery(location.search, this.site);
        });
    }
    static get styles() {
        return [
            ...super.styles,
        ];
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('query')) {
            api.cancelAll();
            this.resetState();
        }
    }
    render() {
        if (this.site && this.query) {
            if (this.query.period === 'realtime') {
                return html `
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
            }
            else {
                return html `
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
        }
        else {
            return nothing;
        }
    }
};
__decorate([
    property({ type: Object })
], PlausibleDashboard.prototype, "history", void 0);
__decorate([
    property({ type: String })
], PlausibleDashboard.prototype, "metric", void 0);
PlausibleDashboard = __decorate([
    customElement('pl-dashboard')
], PlausibleDashboard);
export { PlausibleDashboard };
//# sourceMappingURL=pl-dashboard.js.map