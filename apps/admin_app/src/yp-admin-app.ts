import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { classMap } from 'lit/directives/class-map.js';
import { YpBaseElement } from './@yrpri/common/yp-base-element.js';
import { ShadowStyles } from './@yrpri/common/ShadowStyles.js';

import '@material/mwc-button';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-drawer';
import '@material/mwc-icon';
import '@material/mwc-dialog';
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-textarea';
import { YpAppGlobals } from './@yrpri/yp-app/YpAppGlobals.js';
import { YpAppUser } from './@yrpri/yp-app/YpAppUser.js';
import { YpAppDialogs } from './@yrpri/yp-dialog-container/yp-app-dialogs.js';
import { YpServerApi } from './@yrpri/common/YpServerApi.js';
import { AnchorableElement } from '@material/mwc-menu/mwc-menu-surface-base';
import { Dialog } from '@material/mwc-dialog';
import { YpServerApiAdmin } from './@yrpri/common/YpServerApiAdmin.js';

import './@yrpri/yp-dialog-container/yp-app-dialogs.js';

import './yp-admin-translations.js';
import './yp-admin-config-domain.js';
import './yp-admin-config-community.js';
import { YpAccessHelpers } from './@yrpri/common/YpAccessHelpers.js';

declare global {
  interface Window {
    appGlobals: YpAppGlobals;
    appUser: YpAppUser;
    appDialogs: YpAppDialogs;
    serverApi: YpServerApi;
    adminServerApi: YpServerApiAdmin;
    PasswordCredential?: any;
    FederatedCredential?: any;
  }
}

@customElement('yp-admin-app')
export class YpAdminApp extends YpBaseElement {
  @property({ type: String })
  collectionType: string;

  @property({ type: Number })
  collectionId: number | string;

  @property({ type: String })
  collectionAction: string;

  @property({ type: String })
  page: string | undefined;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Number })
  totalNumberOfPosts: number | undefined;

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: Boolean })
  adminConfirmed = false

  @property({ type: Boolean })
  haveChekedAdminRights = false

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

        mwc-drawer {
          --mdc-drawer-width: 120px;
        }

        .railMenuItem {
          font-size: 14px;
          text-transform: uppercase;
        }
      `,
    ];
  }

  static _camelCase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor() {
    super();
    debugger;
    window.serverApi = new YpServerApi();
    window.adminServerApi = new YpServerApiAdmin();
    window.appGlobals = new YpAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    window.appGlobals.setupTranslationSystem();

    this.page = 'editTranslations';

    let pathname = window.location.pathname;

    pathname = pathname.replace('/admin', '');

    if (pathname.endsWith('/'))
      pathname = pathname.substring(0, pathname.length - 1);
    if (pathname.startsWith('/'))
      pathname = pathname.substring(1, pathname.length);

    const splitPath = pathname.split('/');

    this.collectionType = splitPath[0];

    if (splitPath[1] == 'new') {
      this.collectionId = 'new';
    } else {
      this.collectionId = parseInt(splitPath[1]);
    }

    if (splitPath.length > 2) {
      this.collectionAction = splitPath[2];
    } else {
      this.collectionAction = 'config';
    }


  }

  connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();
    this._getCollection();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  _appDialogsReady(event: CustomEvent) {
    if (event.detail) {
      window.appDialogs = event.detail;
    }
  }

  async _getCollection() {
    this.collection = await window.serverApi.getCollection(
      this.collectionType,
      this.collectionId as number
    );
    this._setAdminConfirmed();
  }

  render() {
    return html`
      <yp-app-dialogs id="dialogContainer"></yp-app-dialogs>

      <mwc-dialog id="errorDialog" .heading="${this.t('error')}">
        <div>${this.currentError}</div>
        <mwc-button dialogAction="cancel" slot="secondaryAction">
          ${this.t('ok')}
        </mwc-button>
      </mwc-dialog>

      <mwc-drawer hasHeader>
        <div slot="title" class="layout vertical center-center">
          <div>
            <img
              height="35"
              alt="Your Priorities Logo"
              src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/YpLogos/YourPriorites-Trans-Wide.png"
            />
          </div>
          <mwc-icon-button
            class="exitButton"
            .label="${this.t('exitToMainApp')}"
            slot="navigationIcon"
            @click="${this.exitToMainApp}"
            icon="close"
          ></mwc-icon-button>
        </div>
        <div class="layout vertical center-center">
          <mwc-icon-button
            icon="gesture"
            .label="${this.t('config')}"
          ></mwc-icon-button>
          <div class="railMenuItem">
            ${this.t('config')}
          </div>
          <mwc-icon-button
            icon="gavel"
            .label="${this.t('translation')}"
          ></mwc-icon-button>
          <div class="railMenuItem">
            ${this.t('translation')}
          </div>
        </div>
        <div slot="appContent">
          <mwc-top-app-bar>
            <div slot="title">
              <div class="layout horizontal headerContainer">
                <div class="analyticsText">
                  ${this.t('contentAdminFor')} ${this.originalCollectionType}:
                  ${this.collection ? this.collection.name : ''}
                </div>
              </div>
            </div>
            <main>
              <div class="layout vertical center-center">
                <div class="mainPageContainer">
                  ${this._renderPage()}
                </div>
              </div>
            </main>
          </mwc-top-app-bar>
        </div>
      </mwc-drawer>
    `;
  }

  exitToMainApp() {
    window.location.href = `/${this.collectionType}/${this.collectionId}`;
  }

  _setupEventListeners() {
    this.addListener('set-total-posts', this._setTotalPosts);
    this.addListener('app-error', this._appError);
    this.addGlobalListener('yp-network-error', this._appError.bind(this));
    this.addListener('yp-app-dialogs-ready', this._appDialogsReady.bind(this));
    this.addGlobalListener('yp-have-checked-admin-rights', this._gotAdminRights.bind(this));
  }

  _removeEventListeners() {
    this.removeListener('set-total-posts', this._setTotalPosts);
    this.removeGlobalListener('yp-network-error', this._appError.bind(this));
    this.removeListener(
      'yp-app-dialogs-ready',
      this._appDialogsReady.bind(this)
    );
    this.removeGlobalListener('yp-have-checked-admin-rights', this._gotAdminRights.bind(this));
  }

  _gotAdminRights(event: CustomEvent) {
    this.haveChekedAdminRights = true
    this._setAdminConfirmed();
  }

  _setAdminConfirmed() {
    if (this.collection) {
      switch(this.collectionType) {
        case 'domain':
          this.adminConfirmed = YpAccessHelpers.checkDomainAccess(this.collection as YpDomainData);
          break
        case 'community':
          this.adminConfirmed = YpAccessHelpers.checkCommunityAccess(this.collection as YpCommunityData);
          break
        }
    }

    if (this.collection && this.haveChekedAdminRights && !this.adminConfirmed) {
        this.fire('yp-network-error', { message: this.t('unauthorized')})
    }
  }

  _appError(event: CustomEvent) {
    console.error(event.detail.message);
    this.currentError = event.detail.message;
    (this.$$('#errorDialog') as Dialog).open = true;
  }

  _setTotalPosts(event: CustomEvent) {
    this.totalNumberOfPosts = event.detail;
  }

  _tabSelected(event: CustomEvent) {
    this.page = event.detail.index.toString();
    this.requestUpdate();
  }

  _renderPage() {
    if (this.adminConfirmed) {
      switch (this.collectionAction) {
        case 'translations':
          return html`
            ${this.collection
              ? html`<yp-admin-translations
                  .collectionType="${this.collectionType}"
                  .collection="${this.collection}"
                  .collectionId="${this.collectionId}"
                >
                </yp-admin-translations>`
              : nothing}
          `;
        case 'config':
          switch (this.collectionType) {
            case 'domain':
              return html`
                ${this.collection
                  ? html`<yp-admin-config-domain
                      .collectionType="${this.collectionType}"
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                    >
                    </yp-admin-config-domain>`
                  : nothing}
              `;
            case 'community':
              return html`
                ${this.collection
                  ? html`<yp-admin-config-community
                      .collectionType="${this.collectionType}"
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                    >
                    </yp-admin-config-community>`
                  : nothing}
              `;
          }
        default:
          return html`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `;
      }
    } else {
      return nothing
    }
  }

  __onNavClicked(ev: CustomEvent) {
    ev.preventDefault();
    this.page = (ev.target as HTMLAnchorElement).hash.substring(1);
  }

  __navClass(page: string) {
    return classMap({ active: this.page === page });
  }
}
