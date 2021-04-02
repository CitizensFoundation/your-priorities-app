import {  html, css } from 'lit-element';
import { YpBaseElement } from './YpBaseElement.js';
import './YpMarketingList.js';
import './YpMarketingCampaigns.js';
import './YpEditMarketingCampaign.js';

import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-top-app-bar-fixed';
import '@material/mwc-icon-button';

export class YpMarketingApp extends YpBaseElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String }
    };
  }

  // Yp colors are #103b68 & #1ea7d1 #1c96bd

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          max-width: 960px;
          width: 100%;
          --mdc-theme-primary: #1c96bd;
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

        .ypHeader {
          margin-right: auto;
          margin-top: 4px;
          margin-left: 48px;
          margin-bottom: 2px;
          width: 400px;
        }

        .headerText {
          margin-top: 20px;
          font-size: 24px;
        }

        mwc-tab-bar {
          text-align: center;
          margin-bottom: -7px;
        }
    `];
  }

  connectedCallback() {
    super.connectedCallback();
    this.collectionType = "community";
    this.collectionId = 974;
    this.page = '1';
    this.addEventListener("open-new-campaign", this._openNewCampaign);
  }

  _openNewCampaign() {
    this.$$("#campaignEdit").open(true);
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

    fetch('/api/users/loggedInUser/isLoggedIn')
    .then(response => response.json())
    .then(data => {
      console.error(data);
      debugger;
    }).catch(error=>{
      debugger;
    });
  }

  render() {
    return html`
      <yp-edit-marketing-campaign id="campaignEdit"></yp-edit-marketing-campaign>

      <mwc-top-app-bar-fixed fixed>
        <div slot="title">
          Marketing for Kyrgyz Survey 03/06/2020
        </div>
        <mwc-icon-button icon="more_vert" slot="actionItems"></mwc-icon-button>
        <div class="layout vertical center-center">
          <mwc-tab-bar @MDCTabBar:activated="${this._tabSelected}">
            <mwc-tab label="${this.t('list')}" icon="list" stacked></mwc-tab>
            <mwc-tab label="${this.t('campaigns')}" icon="backup" stacked></mwc-tab>
          </mwc-tab-bar>
          <main>
            ${this._renderPage()}
          </main>
        </div>
      </mwc-top-app-bar-fixed>
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
          <yp-marketing-campaigns .language="${this.language}" .collectionType="${this.collectionType}" .collectionId="${this.collectionId}"></yp-marketing-campaigns>
        `;
      default:
      return html`
        <p>Page not found try going to <a href="#main">Main</a></p>
      `;
    }
  }
}

