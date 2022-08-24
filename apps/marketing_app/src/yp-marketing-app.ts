import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

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

import './yp-community-marketing.js';
import { YpAccessHelpers } from './@yrpri/common/YpAccessHelpers.js';
import { classMap } from 'lit/directives/class-map.js';

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

@customElement('yp-marketing-app')
export class YpMarketingApp extends YpBaseElement {
  @property({ type: String })
  collectionType: string;

  @property({ type: Number })
  collectionId: number | string;

  @property({ type: String })
  collectionAction: string = 'config';

  @property({ type: String })
  page: string | undefined;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Number })
  totalNumberOfPosts: number | undefined;

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: Boolean })
  adminConfirmed = false;

  @property({ type: Boolean })
  haveChekedAdminRights = false;

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

    window.serverApi = new YpServerApi();
    window.adminServerApi = new YpServerApiAdmin();
    window.appGlobals = new YpAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    window.appGlobals.setupTranslationSystem();

    this.page = 'editTranslations';

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
    if (this.collectionType === 'post') this.collectionType = 'posts';

    this.collectionId = split[split.length - 1];
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
    const collection = (await window.serverApi.getCollection(
      this.collectionType,
      this.collectionId as number
    )) as YpCollectionData | YpGroupResults;
    if (this.collectionType == 'groups') {
      this.collection = (collection as YpGroupResults).group;
    } else {
      this.collection = collection as YpCollectionData;
    }
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
          <div class="railMenuItem">${this.t('analytics')}</div>
          <mwc-icon-button
            icon="gavel"
            .label="${this.t('translation')}"
          ></mwc-icon-button>
          <div class="railMenuItem">${this.t('marketing')}</div>
        </div>
        <div slot="appContent">
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
                <div class="analyticsText">
                  ${this.t('analyticsFor')} ${this.originalCollectionType}:
                  ${this.collection ? this.collection.name : ''}
                </div>
              </div>
            </div>
            <main>
              <div class="layout vertical center-center">
                <div class="mainPageContainer">${this._renderPage()}</div>
              </div>
            </main>
          </mwc-top-app-bar>
        </div>
      </mwc-drawer>
    `;
  }

  exitToMainApp() {
    window.location.href = `/${this.originalCollectionType}/${this.collectionId}`;
  }

  _setupEventListeners() {
    this.addListener('set-total-posts', this._setTotalPosts);
    this.addListener('app-error', this._appError);
    this.addGlobalListener('yp-network-error', this._appError.bind(this));
    this.addListener('yp-app-dialogs-ready', this._appDialogsReady.bind(this));
    this.addGlobalListener(
      'yp-have-checked-admin-rights',
      this._gotAdminRights.bind(this)
    );
  }

  _removeEventListeners() {
    this.removeListener('set-total-posts', this._setTotalPosts);
    this.removeGlobalListener('yp-network-error', this._appError.bind(this));
    this.removeListener(
      'yp-app-dialogs-ready',
      this._appDialogsReady.bind(this)
    );
    this.removeGlobalListener(
      'yp-have-checked-admin-rights',
      this._gotAdminRights.bind(this)
    );
  }

  _gotAdminRights(event: CustomEvent) {
    this.haveChekedAdminRights = true;
    this._setAdminConfirmed();
  }

  _setAdminConfirmed() {
    if (this.collection) {
      switch (this.collectionType) {
        case 'domains':
          this.adminConfirmed = YpAccessHelpers.checkDomainAccess(
            this.collection as YpDomainData
          );
          break;
        case 'communities':
          this.adminConfirmed = YpAccessHelpers.checkCommunityAccess(
            this.collection as YpCommunityData
          );
          break;
        case 'groups':
          this.adminConfirmed = YpAccessHelpers.checkGroupAccess(
            this.collection as YpGroupData
          );
          break;
        case 'posts':
          this.adminConfirmed = YpAccessHelpers.checkPostAccess(
            this.collection as unknown as YpPostData
          );
          break;
      }
    }

    if (this.collection && this.haveChekedAdminRights && !this.adminConfirmed) {
      this.fire('yp-network-error', { message: this.t('unauthorized') });
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
            case 'domains':
            case 'communities':
            case 'groups':
            case 'posts':
              return html`
                ${this.collection
                  ? html`<yp-community-marketing
                      .collectionType="${this.collectionType}"
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                    >
                    </yp-community-marketing>`
                  : nothing}
              `;
            case 'somethingelse':
              return html`
                ${this.collection
                  ? html`<yp-community-marketing
                      .collectionType="${this.collectionType}"
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                    >
                    </yp-community-marketing>`
                  : nothing}
              `;
          }
        default:
          return html`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `;
      }
    } else {
      return nothing;
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
