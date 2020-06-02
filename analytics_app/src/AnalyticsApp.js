import { html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { YpBaseElement } from './YpBaseElement';
import { ShadowStyles } from './ShadowStyles';

import '@material/mwc-button';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-icon';
import '@material/mwc-dialog';

import './PageConnections';
import './PageTrends';
import './PageTopics';

export class AnalyticsApp extends YpBaseElement {
  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      collection: { type: Object },
      totalNumberOfPost: { type: Number },
      currentError: { type: String },
      similaritiesData: { type: Array }
    };
  }

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
      :host {
        color: #1a2b42;
        --mdc-theme-primary: #1c96bd;
      }

      header {
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #ccc;
      }
      margin-bottom: 8px;

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
        font-size: 16px;
      }

      header ul li a:hover,
      header ul li a.active {
        color: blue;
      }

      .mainPageContainer {
        margin-top: 24px;
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

      .mainImage {
        margin-right: auto;
        margin-top: 4px;
        margin-left: 48px;
        margin-bottom: 2px;
      }

      .analyticsText {
        margin-left: 8px;
        margin-bottom: 4px;
        font-size: 18px;
        color: #333;
      }

      header {
        max-width: 1024px;
        padding-top: 8px;
      }
    `];
  }

  _camelCase (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor() {
    super();
    this.page = '0';
    let pathname = window.location.pathname;
    if (pathname.endsWith('/'))
      pathname = pathname.substring(0,pathname.length-1);
    const split = pathname.split('/');
    this.collectionType = split[split.length-2];

    this.originalCollectionType = this.collectionType;

    if (this.collectionType==='community')
      this.collectionType = 'communities';
    if (this.collectionType==='domain')
      this.collectionType = 'domains';
    if (this.collectionType==='group')
      this.collectionType = 'groups';

    this.collectionId = split[split.length-1];
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();
    this.collectionURL ="/api/"+this.collectionType+"/"+this.collectionId;

    fetch(this.collectionURL, { credentials: 'same-origin' })
    .then(res => this.handleNetworkErrors(res))
    .then(res => res.json())
    .then(response => {
      this.collection = response;
    })
    .catch(error => {
        console.error('Error:', error);
        this.fire('app-error', error);
      }
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  render() {
    return html`
        <mwc-dialog id="errorDialog" .heading="${this.t('error')}">
          <div>${this.currentError}</div>

          <mwc-button
              dialogAction="cancel"
              slot="secondaryAction">
              ${this.t('ok')}
          </mwc-button>
        </mwc-dialog>
        <div class="layout vertical center-center">
          <header>
            <div class="mainImageHeader layout horizontal center-center">
              <div><img height="32" src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/YpLogos/YourPriorites-Trans-Wide.png"/></div>
              <div class="analyticsText">${this._camelCase(this.originalCollectionType)}: ${this.collection ? this.collection.name : ''}</div>
            </div>
            <mwc-tab-bar @MDCTabBar:activated="${this._tabSelected}">
              <mwc-tab label="Trends" icon="bar_chart" stacked></mwc-tab>
              <mwc-tab label="Topics" icon="blur_on" stacked></mwc-tab>
              <mwc-tab label="Connections" icon="3d_rotation" stacked></mwc-tab>
            </mwc-tab-bar>
          </header>
        </div>
      <main>
        <div class="layout vertical center-center">
          <div class="mainPageContainer">
          ${this._renderPage()}
          </div>
        </div>
      </main>

      <p class="app-footer">
      </p>
    `;
  }

  _setupEventListeners() {
    this.addEventListener('set-total-posts', this._setTotalPosts);
    this.addEventListener('set-similarities-data', this._setSimilaritiesData);
    this.addEventListener('app-error', this._appError);
  }

  _removeEventListeners() {
    this.removeEventListener('set-total-posts', this._setTotalPosts);
    this.removeEventListener('set-similarities-data', this._setSimilaritiesData);
    this.removeEventListener('app-error', this._appError);
  }

  _appError(event) {
    console.error(event.detail.message);
    this.currentError = event.detail.message;
    this.$$("#errorDialog").open = true;
  }

  _setTotalPosts(event) {
    this.totalNumberOfPost = event.detail;
  }

  _setSimilaritiesData(event) {
    this.similaritiesData = event.detail;
  }

  _tabSelected(event) {
    this.page = event.detail.index.toString();
    this.requestUpdate();
  }

  _renderPage() {
    switch (this.page) {
      case '0':
        return html`
          <page-trends .collectionType="${this.collectionType}" .collectionId="${this.collectionId}"></page-trends>
      `;
      case '1':
        return html`
          <page-topics .similaritiesData="${this.similaritiesData}" .totalNumberOfPosts="${this.totalNumberOfPost}" .collectionType="${this.collectionType}" .collectionId="${this.collectionId}"></page-topics>
        `;
      case '2':
        return html`
          <page-connections .similaritiesData="${this.similaritiesData}" .totalNumberOfPosts="${this.totalNumberOfPost}"  .collectionType="${this.collectionType}" .collectionId="${this.collectionId}"></page-connections>
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
