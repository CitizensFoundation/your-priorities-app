import {  html, css } from 'lit-element';
import { YpBaseElement } from './YpBaseElement.js';
import './YpMarketingList.js';

import '@material/mwc-tab';
import '@material/mwc-tab-bar';

export class YpMarketingApp extends YpBaseElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          max-width: 960px;
          width: 100%;
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
    `];
  }

  connectedCallback() {
    super.connectedCallback();
    this.collectionType = "community";
    this.collectionId = 974;
    this.page = 'lists';
  }

  static getPathVariable(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  constructor () {
    super();
    const language = YpMarketingApp.getPathVariable('locale');
    if (language) {
      this.language = language;
      localStorage.setItem("languageOverride", language);
    } else {
      if (localStorage.getItem("languageOverride")) {
        this.language = localStorage.getItem("languageOverride");
      } else {
        this.language = "en";
      }
    }
  }

  render() {
    return html`
        <div class="layout horizontal">
          <div><img height="32" src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/YpLogos/YourPriorites-Trans-Wide.png"/></div>
          <div class="flex"></div>
          <div class="analyticsText">Marketing</div>
        </div>
        <mwc-tab-bar @MDCTabBar:activated="${this._tabSelected}">
          <mwc-tab label="${this.t('list')}" icon="list" stacked></mwc-tab>
          <mwc-tab label="${this.t('campaigns')}" icon="backup" stacked></mwc-tab>
        </mwc-tab-bar>

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
      case '0':
        return html`
          <yp-marketing-list .language="${this.language}" .collectionType="${this.collectionType}" .collectionId="${this.collectionId}"></yp-marketing-list>
      `;
      case '1':
        return html`
          <yp-marketing-marketings .language="${this.language}" .collectionType="${this.collectionType}" .collectionId="${this.collectionId}"></yp-marketing-marketings>
        `;
      default:
      return html`
        <p>Page not found try going to <a href="#main">Main</a></p>
      `;
    }
  }
}

