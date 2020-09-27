import { html, css, customElement, property } from 'lit-element';
import { nothing } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { YpBaseElement } from './@yrpri/common/yp-base-element.js';
import { ShadowStyles } from './@yrpri/common/ShadowStyles.js';

import '@material/mwc-button';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-icon';
import '@material/mwc-dialog';
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-textarea';
import { YpAppGlobals } from './@yrpri/yp-app/YpAppGlobals.js';
import { YpAppUser } from './@yrpri/yp-app/YpAppUser.js';
import { YpAppDialogs } from './@yrpri/yp-dialog-container/yp-app-dialogs.js';
import { YpServerApi } from './@yrpri/common/YpServerApi.js';

declare global {
  interface Window {
    appGlobals: YpAppGlobals;
    appUser: YpAppUser;
    appDialogs: YpAppDialogs;
    serverApi: YpServerApi;
    PasswordCredential?: any;
    FederatedCredential?: any;
  }
}

@customElement('admin-app')
export class AdminApp extends YpBaseElement {
  @property({ type: String })
  collectionType: string | undefined;

  @property({ type: Number })
  collectionId: number | undefined;

  @property({ type: Number })
  page: number | undefined;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Number })
  totalNumberOfPosts: number | undefined;

  @property({ type: String })
  currentError: string | undefined;

  originalCollectionType: string | undefined;

  collectionURL: string | undefined;

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
          margin-top: 24px;
          max-width: 1024px;
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
          padding-top: 2px;
        }

        mwc-top-app-bar,
        .exitButton {
          --mdc-theme-on-primary: white;
        }

        .headerContainer {
          padding-top: 8px;
        }
      `,
    ];
  }

  static _camelCase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor() {
    super();
    window.serverApi = new YpServerApi();
    window.appGlobals = new YpAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    window.appGlobals.setupTranslationSystem();

    this.page = 0;
    let pathname = window.location.pathname;
    if (pathname.endsWith('/'))
      pathname = pathname.substring(0, pathname.length - 1);
    const split = pathname.split('/');
    this.collectionType = split[split.length - 2];

    this.originalCollectionType = this.collectionType;

    if (this.collectionType === 'community')
      this.collectionType = 'communities';
    if (this.collectionType === 'domain') this.collectionType = 'domains';
    if (this.collectionType === 'group') this.collectionType = 'groups';

    this.collectionId = parseInt(split[split.length - 1]);
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();
    this.collectionURL =
      '/api/' + this.collectionType + '/' + this.collectionId;

    fetch(this.collectionURL, { credentials: 'same-origin' })
      .then(res => this.handleNetworkErrors(res))
      .then(res => res.json())
      .then(response => {
        if (response.group) {
          this.collection = response.group;
        } else {
          this.collection = response;
        }
      })
      .catch(error => {
        this.fire('app-error', error);
      });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  render() {
    return html`
      <mwc-dialog id="errorDialog" .heading="${this.t('error')}">
        <div>${this.currentError}</div>
        <mwc-button dialogAction="cancel" slot="secondaryAction">
          ${this.t('ok')}
        </mwc-button>
      </mwc-dialog>
      <mwc-top-app-bar>
        <mwc-icon-button
          class="exitButton"
          .label="${this.t('exitToMainApp')}"
          slot="navigationIcon"
          @click="${this.exitToMainApp}"
          icon="exit_to_app"
        ></mwc-icon-button>
        <div slot="title">
          <div class="layout horizontal headerContainer">
            <div>
              <img
                height="35"
                alt="Your Priorities Logo"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/YpLogos/YourPriorites-Trans-Wide.png"
              />
            </div>
            <div class="analyticsText">
              ${this.t('contentAdminFor')} ${this.originalCollectionType}:
              ${this.collection ? this.collection.name : ''}
            </div>
          </div>
        </div>
        <div>
          <div class="layout vertical center-center">
            <header>
              <mwc-tab-bar @MDCTabBar:activated="${this._tabSelected}">
                <mwc-tab
                  .label="${this.t('editTranslations')}"
                  icon="g_translate"
                  stacked
                ></mwc-tab>
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
        </div>
      </mwc-top-app-bar>
    `;
  }

  exitToMainApp() {
    window.location.href = `/${this.originalCollectionType}/${this.collectionId}`;
  }

  _setupEventListeners() {
    this.addListener('set-total-posts', this._setTotalPosts);
    this.addListener('app-error', this._appError);
  }

  _removeEventListeners() {
    this.removeListener('set-total-posts', this._setTotalPosts);
    this.removeListener('app-error', this._appError);
  }

  _appError(event: CustomEvent) {
    console.error(event.detail.message);
    this.currentError = event.detail.message;
    this.$$('#errorDialog').open = true;
  }

  _setTotalPosts(event: CustomEvent) {
    this.totalNumberOfPosts = event.detail;
  }

  _tabSelected(event: CustomEvent) {
    this.page = event.detail.index.toString();
    this.requestUpdate();
  }

  _renderPage() {
    switch (this.page) {
      case 0:
        return html`
          ${this.collection
            ? html`<page-edit-translations
                .collectionType="${this.collectionType}"
                .collection="${this.collection}"
                .collectionId="${this.collectionId}"
              >
              </page-edit-translations>`
            : nothing}
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
