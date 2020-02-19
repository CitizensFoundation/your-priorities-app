import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';

import '../../page-trends/page-trends.js';
import '../../list-of-grievances/list-of-grievances.js';
import '../../list-of-grievances/one-grievance.js';
import '../../page-force-graph/page-force-graph.js'

import '@material/mwc-button';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-icon';

export class AnalyticsApp extends LitElement {
  static get properties() {
    return {
      currentGrievance: { type: Object }
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
      }

      header {
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #ccc;
      }

      header ul {
        display: flex;
        justify-content: space-around;
        min-width: 400px;
        margin: 0 auto;
        padding: 0;
      }

      header ul li {
        display: flex;
      }

      header ul li a {
        color: #5a5c5e;
        text-decoration: none;
        font-size: 18px;
        line-height: 36px;
      }

      header ul li a:hover,
      header ul li a.active {
        color: blue;
      }

      main {
        flex-grow: 1;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }

      [hidden] {
        display: none !important;
      }

      mwc-tab {
        color: #000;
      }

      .paceImage {
        margin-right: auto;
        margin-top: 26px;
        margin-left: 64px;
        margin-bottom: 16px;
      }
    `;
  }

  constructor() {
    super();
    this.page = '0';
    this.addEventListener("open-grievance", this._openGrievance);
    this.addEventListener("close-grievance", this._closeGrievance);
  }

  _openGrievance(event) {
    this.currentGrievance = event.detail;
    this.page="grievance";
  }

  _closeGrievance() {
    this.currentGrievance = null;
    this.page="0";
  }

  render() {
    return html`
        <div class="paceImage">
          <img width="151" height="95" src="https://popandce.files.wordpress.com/2019/07/cropped-pace_logo-24.png"/>
        </div>
      <header ?hidden="${this.currentGrievance}">
        <mwc-tab-bar @MDCTabBar:activated="${this._tabSelected}">
          <mwc-tab label="List of grievances" icon="accessibility" stacked></mwc-tab>
          <mwc-tab label="Trends" icon="bar_chart" stacked></mwc-tab>
          <mwc-tab label="Connections" icon="blur_on" stacked></mwc-tab>
        </mwc-tab-bar>
      </header>

      <main>
        ${this._renderPage()}
      </main>

      <p class="app-footer">

      </p>
    `;
  }

  _tabSelected(event) {
    this.page = event.detail.index.toString();
    this.requestUpdate();
  }

  _renderPage() {
    switch (this.page) {
      case 'grievance':
        return html`
          <one-grievance ?fullView="${true}" .grievanceData="${this.currentGrievance}"></one-grievance>
        `;
      case '0':
        return html`
          <list-of-grievances></list-of-grievances>
        `;
      case '1':
        return html`
        <page-trends></page-trends>
      `;
      case '2':
          return html`
            <page-force-graph></page-force-graph>
          `;
        default:
        return html`
          <p>Page not found try going to <a href="#main">Main</a></p>
        `;
    }
  }

  __onNavClicked(ev) {
    ev.preventDefault();
    this.page = ev.target.hash.substring(1);
  }

  __navClass(page) {
    return classMap({ active: this.page === page });
  }
}
