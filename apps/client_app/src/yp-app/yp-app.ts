/*
import '../ac-notifications/ac-notification-list.js';
import './yp-app-nav-drawer.js';
import '../yp-dialog-container/yp-dialog-container.js';
import '../yp-user/yp-user-image.js';
import '../yp-app-globals/yp-sw-update-toast.js';
*/

import { customElement, property, html, LitElement } from 'lit-element';
import { nothing } from 'lit-html';
import { cache } from 'lit-html/directives/cache.js';

import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
//TODO: Fix moment
//import moment from 'moment';

import { Dialog } from '@material/mwc-dialog';
import '@material/mwc-dialog';

import { Snackbar } from '@material/mwc-snackbar';
import '@material/mwc-snackbar';

import { Drawer } from '@material/mwc-drawer';
import '@material/mwc-drawer';

import '@material/mwc-button';

import '@material/mwc-icon-button';

import '@material/mwc-menu';
import { Menu } from '@material/mwc-menu';

import '@material/mwc-top-app-bar';

import '@material/mwc-list/mwc-list-item';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAppStyles } from './YpAppStyles.js';
import { YpAppGlobals } from './YpAppGlobals.js';
import { YpAppUser } from './YpAppUser.js';
import { YpServerApi } from '../@yrpri/YpServerApi.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { YpAppDialogs } from './yp-app-dialogs.js';

import '../yp-collection/yp-domain.js';
import '../yp-collection/yp-community.js';
import '../yp-collection/yp-group.js';

declare global {
  interface Window {
    appGlobals: YpAppGlobals;
    appUser: YpAppUser;
    appDialogs: YpAppDialogs;
    serverApi: YpServerApi;
    app: YpApp;
  }
}

@customElement('yp-app')
export class YpApp extends YpBaseElement {
  @property({ type: Object })
  homeLink = undefined;

  @property({ type: String })
  page: string | undefined;

  @property({ type: Object })
  user = undefined;

  @property({ type: String })
  backPath: string | undefined;

  @property({ type: Boolean })
  showSearch = false;

  @property({ type: Boolean })
  showBack = false;

  @property({ type: String })
  forwardToPostId: string | undefined;

  @property({ type: String })
  headerTitle: string | null = 'Betri Reykjavík';

  @property({ type: String })
  numberOfUnViewedNotifications: string | undefined;

  @property({ type: Boolean })
  hideHelpIcon = false;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: String })
  languageName: string | undefined;

  @property({ type: Number })
  goForwardToPostId: number | undefined;

  @property({ type: Boolean })
  showBackToPost = false;

  @property({ type: String })
  goForwardPostName: string | undefined;

  @property({ type: Array })
  pages: Array<YpHelpPage> = [];

  @property({ type: String })
  headerDescription: string | undefined;

  @property({ type: String })
  notifyDialogHeading: string | undefined;

  @property({ type: String })
  notifyDialogText: string | undefined;

  @property({ type: String })
  route = '';

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Object })
  routeData: Record<string, string> = {};

  anchor: HTMLElement | null = null;

  previousSearches: Array<string> = [];

  storedBackPath: string | undefined;

  storedLastDocumentTitle: string | undefined;

  keepOpenForPost: string | undefined;

  useHardBack = false;

  _scrollPositionMap = {};

  goBackToPostId: number | undefined;

  currentPostId: number | undefined;

  goForwardCount = 0;

  communityBackOverride: Record<string, Record<string, string>> | undefined;

  touchXDown: number | undefined;
  touchYDown: number | undefined;
  touchXUp: number | undefined;
  touchYUp: number | undefined;

  userDrawerOpenedDelayed = false;
  navDrawOpenedDelayed = false;
  userDrawerOpened = false;

  constructor() {
    super();
    window.app = this;
    window.serverApi = new YpServerApi();
    window.appGlobals = new YpAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    this._setupTranslationSystem();
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();
    console.info('yp-app is ready');
    window.appGlobals.theme.setTheme(16, this);
    this._setupSamlCallback();
    this.updateLocation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  _netWorkError(event: CustomEvent) {
    const detail = event.detail;
    let errorText = this.t('errorCantConnect')
      ? this.t('errorCantConnect')
      : "Can't connect to server, try again later";
    let statusCode = -1;
    if (detail.response && detail.response.status === 404)
      errorText = this.t('errorNotAuthorized');
    else if (detail.response && detail.response.status === 401)
      errorText = this.t('errorNotAuthorized');

    if (detail.response && detail.response.status)
      statusCode = detail.response.status;

    this.notifyDialogText = errorText;
    (this.$$('#dialog') as Dialog).open = true;

    console.error(`Can't connect to server. ${statusCode} ${detail.jsonError}`);
  }

  _setupEventListeners() {
    this.addGlobalListener(
      'yp-auto-translate',
      this._autoTranslateEvent.bind(this)
    );
    this.addGlobalListener('yp-change-header', this._onChangeHeader.bind(this));
    this.addGlobalListener('yp-user-changed', this._onUserChanged.bind(this));
    this.addGlobalListener('yp-network-error', this._netWorkError.bind(this));

    this.addListener(
      'yp-add-back-community-override',
      this._addBackCommunityOverride,
      this
    );
    this.addListener(
      'yp-reset-keep-open-for-page',
      this._resetKeepOpenForPage,
      this
    );
    this.addListener('yp-open-login', this._login, this);
    this.addListener('yp-open-page', this._openPageFromEvent, this);
    this.addListener('yp-open-toast', this._openToast, this);
    this.addListener('yp-open-notify-dialog', this._openNotifyDialog, this);
    this.addListener('yp-dialog-closed', this._dialogClosed, this);
    this.addListener('yp-language-name', this._setLanguageName, this);
    this.addListener('yp-refresh-domain', this._refreshDomain, this);
    this.addListener('yp-refresh-community', this._refreshCommunity, this);
    this.addListener('yp-refresh-group', this._refreshGroup, this);
    this.addListener('yp-close-right-drawer', this._closeRightDrawer, this);
    this.addListener(
      'yp-set-number-of-un-viewed-notifications',
      this._setNumberOfUnViewedNotifications,
      this
    );
    this.addListener('yp-redirect-to', this._redirectTo, this);
    this.addListener('yp-set-home-link', this._setHomeLink, this);
    this.addListener('yp-set-next-post', this._setNextPost, this);
    this.addListener('yp-set-pages', this._setPages, this);

    window.addEventListener('locationchange', this.updateLocation.bind(this));
    window.addEventListener('location-changed', this.updateLocation.bind(this));
    window.addEventListener('onpopstate', this.updateLocation.bind(this));
    this._setupTouchEvents();
  }

  _removeEventListeners() {
    this.removeGlobalListener('yp-auto-translate', this._autoTranslateEvent);
    this.removeGlobalListener('yp-change-header', this._onChangeHeader);
    this.removeGlobalListener('yp-user-changed', this._onUserChanged);
    this.removeGlobalListener('yp-network-error', this._netWorkError);

    this.removeListener(
      'yp-add-back-community-override',
      this._addBackCommunityOverride,
      this
    );
    this.removeListener(
      'yp-reset-keep-open-for-page',
      this._resetKeepOpenForPage,
      this
    );
    this.removeListener('yp-open-login', this._login, this);
    this.removeListener('yp-open-page', this._openPageFromEvent, this);
    this.removeListener('yp-open-toast', this._openToast, this);
    this.removeListener('yp-open-notify-dialog', this._openNotifyDialog, this);
    this.removeListener('yp-dialog-closed', this._dialogClosed, this);
    this.removeListener('yp-language-name', this._setLanguageName, this);
    this.removeListener('yp-refresh-domain', this._refreshDomain, this);
    this.removeListener('yp-refresh-community', this._refreshCommunity, this);
    this.removeListener('yp-refresh-group', this._refreshGroup, this);
    this.removeListener('yp-close-right-drawer', this._closeRightDrawer, this);
    this.removeListener(
      'yp-set-number-of-un-viewed-notifications',
      this._setNumberOfUnViewedNotifications,
      this
    );
    this.removeListener('yp-redirect-to', this._redirectTo, this);
    this.removeListener('yp-set-home-link', this._setHomeLink, this);
    this.removeListener('yp-set-next-post', this._setNextPost, this);
    this.removeListener('yp-set-pages', this._setPages, this);
    window.removeEventListener('locationchange', this.updateLocation);
    window.removeEventListener('location-changed', this.updateLocation);
    window.removeEventListener('onpopstate', this.updateLocation);
    this._removeTouchEvents();
  }

  static get styles() {
    return [super.styles, YpAppStyles];
  }

  updateLocation() {
    const path = window.location.pathname;

    const pattern = '/:page';

    const remainingPieces = path.split('/');
    const patternPieces = pattern.split('/');

    const matched = [];
    const namedMatches: Record<string, string> = {};

    const oldRouteData = { ...this.routeData };

    for (let i = 0; i < patternPieces.length; i++) {
      const patternPiece = patternPieces[i];
      if (!patternPiece && patternPiece !== '') {
        break;
      }
      const pathPiece = remainingPieces.shift();

      // We don't match this path.
      if (!pathPiece && pathPiece !== '') {
        return;
      }
      matched.push(pathPiece);

      if (patternPiece.charAt(0) == ':') {
        namedMatches[patternPiece.slice(1)] = pathPiece;
      } else if (patternPiece !== pathPiece) {
        return;
      }
    }

    let tailPath = remainingPieces.join('/');
    if (remainingPieces.length > 0) {
      tailPath = '/' + tailPath;
    }

    this.subRoute = tailPath;

    this.routeData = namedMatches;
    this._routeChanged();
    this._routePageChanged(oldRouteData);
  }

  renderNavigationIcon() {
    let icons;

    if (this.closePostHeader)
      icons = html`<mwc-icon-button
        title="${this.t('close')}"
        icon="menu"
        @click="${this._closePost}"></mwc-icon-button>`;
    else
      icons = html` <mwc-icon-button
          icon="menu"
          title="${this.t('openMainMenu')}"
          slot="actionItems"
          @click="${this._toggleNavDrawer}">
        </mwc-icon-button>

        <mwc-icon-button icon="arrow_upward" hidden title="${this.t('goBack')}">
        </mwc-icon-button>`;

    return html`${icons}
    ${this.goForwardToPostId
      ? html`
          <mwc-icon-button
            icon="menu"
            title="${this.t('forwardToPost')}"
            title=""
            @click="${this._goToNextPost}"></mwc-icon-button>
        `
      : nothing}`;
  }

  _openHelpMenu() {
    (this.$$('helpMenu') as Menu).open = true;
  }

  renderActionItems() {
    return html`
      <mwc-icon-button
        id="translationButton"
        slot="actionItems"
        ?hidden="${!this.autoTranslate}"
        @click="${this._stopTranslation}"
        icon="translate"
        .label="${this.t('stopAutoTranslate')}">
      </mwc-icon-button>

      <div
        style="position: relative;"
        ?hidden="${this.hideHelpIcon}"
        slot="actionItems">
        <mwc-icon-button
          id="helpIconButton"
          icon="help_outline"
          @click="${this._openHelpMenu}"
          title="${this.t('menu.help')}">
        </mwc-icon-button>
        <mwc-menu id="helpMenu">
          <mwc-list-item>Item 0</mwc-list-item>
          <mwc-list-item>Item 1</mwc-list-item>
          ${this.translatedPages(this.pages).map(
            (page: YpHelpPage, index) => html`
              <mwc-list-item
                data-args="${index}"
                @click="${this._openPageFromMenu}">
                ${this._getLocalizePageTitle(page)}
              </mwc-list-item>
            `
          )}
        </mwc-menu>
      </div>

      ${this.user
        ? html`
            <div
              class="userImageNotificationContainer layout horizontal"
              @click="${this._toggleUserDrawer}"
              slot="actionItems">
              <yp-user-image id="userImage" small .user="${this.user}">
              </yp-user-image>
              <paper-badge
                id="notificationBadge"
                class="activeBadge"
                .label="${this.numberOfUnViewedNotifications}"
                ?hidden="${!this.numberOfUnViewedNotifications}">
              </paper-badge>
            </div>
          `
        : html`
            <mwc-icon-button
              icon="login"
              slot="actionItems"
              @click="${this._login}"
              title="${this.t('user.login')}">
            </mwc-icon-button>
          `}
    `;
  }

  renderAppBar() {
    return html`
      <mwc-top-app-bar>
        <div slot="navigationIcon">${this.renderNavigationIcon()}</div>
        <div slot="title">
          ${this.goForwardToPostId
            ? this.goForwardPostName
            : this.headerTitle}
        </div>
        ${this.renderActionItems()}
        <div>
          ${this.renderPage()}
        </div>
      </mwc-top-app-bar>
    `;
  }

  renderPage() {
    let pageHtml;
    if (this.page) {
      switch (this.page) {
        case 'domain':
          pageHtml = cache(html`
            <yp-domain
              id="domainPage"
              role="main"
              aria-label="${this.t('communities')}"
              .subRoute="${this.subRoute}"></yp-domain>
          `);
          break;
        case 'community':
          pageHtml = cache(html`
            <yp-community id="communityPage" .subRoute="${this.subRoute}">
            </yp-community>
          `);
          break;
        case 'community_folder':
          pageHtml = cache(html`
            <yp-community-folder
              id="communityFolderPage"
              .subRoute="${this.subRoute}">
            </yp-community-folder>
          `);
          break;
        case 'group':
          pageHtml = cache(html`
            <yp-group id="groupPage" .subRoute="${this.subRoute}"></yp-group>
          `);
          break;
        case 'post':
          pageHtml = cache(html`
            <yp-post id="postPage" .subRoute="${this.subRoute}"></yp-post>
          `);
          break;
        default:
          pageHtml = cache(html` <yp-view-404 name="view-404"></yp-view-404> `);
          break;
      }
    } else {
      pageHtml = nothing;
    }

    return pageHtml;
  }

  render() {
    return html`
      ${this.renderAppBar()}

      <yp-dialog-container id="dialogContainer"></yp-dialog-container>

      <yp-sw-update-toast
        .buttonLabel="${this.t('reload')}"
        .message="${this.t('newVersionAvailable')}">
      </yp-sw-update-toast>

      <mwc-dialog id="dialog">
        <div>${this.notifyDialogText}</div>
        <mwc-button
          slot="primaryAction"
          @click="${this._resetNotifyDialogText}"
          dialogAction="discard">
          ${this.t('ok')}
        </mwc-button>
      </mwc-dialog>

      <mwc-snackbar id="toast">
        <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
      </mwc-snackbar>
    `;
  }

  _openNotifyDialog(event: CustomEvent) {
    this.notifyDialogText = event.detail;
    (this.$$('#dialog') as Dialog).open = true;
  }

  _openToast(event: CustomEvent) {
    (this.$$('#dialog') as Snackbar).labelText = event.detail;
    (this.$$('#dialog') as Snackbar).open = true;
  }

  _resetNotifyDialogText() {
    this.notifyDialogText = undefined;
  }

  // Translated Pages
  translatedPages(pages: Array<YpHelpPage>): Array<YpHelpPage> {
    if (pages) {
      return JSON.parse(JSON.stringify(pages)) as Array<YpHelpPage>;
    } else {
      return [] as Array<YpHelpPage>;
    }
  }

  openPageFromId(pageId: number) {
    if (this.pages) {
      this.pages.forEach(page => {
        if (page.id == pageId) {
          this._openPage(page);
        }
      });
    } else {
      console.warn('Trying to open a page when not loaded');
    }
  }

  _openPageFromMenu(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.getAttribute('data-args');
    if (value) {
      const index = JSON.parse(value);
      const page = this.pages[index];
      this._openPage(page);
      //TODO: Make sure to reset menu here
      //this.$$("paper-listbox")?.select(null);
    }
  }

  _openPage(page: YpHelpPage) {
    window.appGlobals.activity('open', 'pages', page.id);
    // TODO: Remove any
    this.getDialogAsync(
      'pageDialog',
      function (dialog: any) {
        let pageLocale = 'en';
        if (window.appGlobals.locale && page.title[window.appGlobals.locale]) {
          pageLocale = window.appGlobals.locale;
        }
        dialog.open(page.title[pageLocale], page.content[pageLocale]);
      }.bind(this)
    );
  }

  _getLocalizePageTitle(page: YpHelpPage) {
    let pageLocale = 'en';
    if (window.appGlobals.locale && page.title[window.appGlobals.locale]) {
      pageLocale = window.appGlobals.locale;
    }
    return page.title[pageLocale];
  }

  _setPages(event: CustomEvent) {
    this.pages = event.detail;
  }

  _addBackCommunityOverride(event: CustomEvent) {
    const detail = event.detail;

    if (!this.communityBackOverride) {
      this.communityBackOverride = {};
    }

    this.communityBackOverride[detail.fromCommunityId] = {
      backPath: detail.backPath,
      backName: detail.backName,
    };
  }

  _goToNextPost() {
    if (this.currentPostId) {
      this.goBackToPostId = this.currentPostId;
    } else {
      console.error('No currentPostId on next');
    }

    if (this.goForwardToPostId) {
      YpNavHelpers.goToPost(this.goForwardToPostId, undefined, undefined, undefined, true);
      window.appGlobals.activity(
        'recommendations',
        'goForward',
        this.goForwardToPostId
      );
      this.goForwardCount += 1;
      this.showBackToPost = true;
    } else {
      console.error('No goForwardToPostId');
    }
  }

  _goToPreviousPost() {
    if (this.goForwardCount > 0) {
      window.history.back();
      window.appGlobals.activity('recommendations', 'goBack');
    } else {
      this.showBackToPost = false;
    }
    this.goForwardCount -= 1;
  }

  _setNextPost(event: CustomEvent) {
    const detail = event.detail;
    if (detail.goForwardToPostId) {
      this.goForwardToPostId = detail.goForwardToPostId;
      this.goForwardPostName = detail.goForwardPostName;
    } else {
      this._clearNextPost();
    }
    this.currentPostId = detail.currentPostId;
  }

  _clearNextPost() {
    this.goForwardToPostId = undefined;
    this.goForwardPostName = undefined;
    this.goForwardCount = 0;
    this.showBackToPost = false;
  }

  _setupSamlCallback() {
    console.log('Have created event listener for samlLogin');

    window.addEventListener(
      'message',
      e => {
        if (e.data == 'samlLogin' && window.appUser) {
          window.appUser.loginFromSaml();
          console.log('Have contacted app user 2');
        }
      },
      false
    );
  }

  _setupTranslationSystem() {
    console.log('Have started _setupTranslationSystem');
    const hostname = window.location.hostname;
    let defaultLocale = 'en';
    if (hostname.indexOf('betrireykjavik') > -1) {
      defaultLocale = 'is';
    } else if (hostname.indexOf('betraisland') > -1) {
      defaultLocale = 'is';
    } else if (hostname.indexOf('forbrukerradet') > -1) {
      defaultLocale = 'no';
    } else {
      const tld = hostname.substring(hostname.lastIndexOf('.'));
      const localeByTld: Record<string, string> = {
        '.fr': 'fr',
        '.hr': 'hr',
        '.hu': 'hu',
        '.is': 'is',
        '.nl': 'nl',
        '.no': 'no',
        '.pl': 'pl',
        '.tw': 'zh_TW',
      };
      defaultLocale = localeByTld[tld] || 'en';
    }

    const storedLocale = localStorage.getItem('yp-user-locale');
    if (storedLocale) {
      defaultLocale = storedLocale;
    }

    let localeFromUrl: string | undefined;

    if (
      window.appGlobals.originalQueryParameters &&
      window.appGlobals.originalQueryParameters['locale']
    ) {
      localeFromUrl = window.appGlobals.originalQueryParameters[
        'locale'
      ] as string;
    }

    if (
      window.appGlobals.originalQueryParameters &&
      window.appGlobals.originalQueryParameters['startAutoTranslate']
    ) {
      setTimeout(() => {
        this._startTranslation();
      }, 2500);
    }

    if (localeFromUrl && localeFromUrl.length > 1) {
      defaultLocale = localeFromUrl;
      localStorage.setItem('yp-user-locale', localeFromUrl);
    }

    i18next.use(HttpApi).init(
      {
        lng: defaultLocale,
        fallbackLng: 'en',
        backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
      },
      () => {
        window.appGlobals.locale = defaultLocale;
        window.appGlobals.i18nTranslation = i18next;
        window.appGlobals.haveLoadedLanguages = true;
        //TODO: Fix moment
        //moment.locale([defaultLocale, 'en']);
        this.fireGlobal('yp-language-loaded', { language: defaultLocale });
      }
    );
  }

  _openPageFromEvent(event: CustomEvent) {
    if (event.detail.pageId) {
      this.openPageFromId(event.detail.pageId);
    }
  }

  openUserInfoPage(pageId: number) {
    if (this.pages && this.pages.length > 0) {
      this._openPage(this.pages[pageId]);
    } else {
      setTimeout(() => {
        if (this.pages && this.pages.length > 0) {
          this._openPage(this.pages[pageId]);
        } else {
          setTimeout(() => {
            if (this.pages && this.pages.length > 0) {
              this._openPage(this.pages[pageId]);
            } else {
              setTimeout(() => {
                if (this.pages && this.pages.length > 0) {
                  this._openPage(this.pages[pageId]);
                }
              }, 1250);
            }
          }, 1250);
        }
      }, 1250);
    }
  }

  _startTranslation() {
    window.appGlobals.autoTranslate = true;
    this.fireGlobal('yp-auto-translate', true);
    this.getDialogAsync('masterToast', (toast: Snackbar) => {
      toast.labelText = this.t('autoTranslationStarted');
      toast.open = true;
    });
  }

  _stopTranslation() {
    window.appGlobals.autoTranslate = false;
    this.fireGlobal('yp-auto-translate', false);
    this.getDialogAsync('masterToast', (toast: Snackbar) => {
      toast.labelText = this.t('autoTranslationStopped');
      toast.open = true;
    });
    sessionStorage.setItem('dontPromptForAutoTranslation', '1');
  }

  _setLanguageName(event: CustomEvent) {
    this.languageName = event.detail;
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
  }

  _refreshGroup() {
    this._refreshByName('#groupPage');
  }

  _refreshCommunity() {
    this._refreshByName('#communityPage');
  }

  _refreshDomain() {
    this._refreshByName('#domainPage');
  }

  _refreshByName(id: string) {
    const el = this.$$(id);
    // TODO: Get refresh to work
    if (el) {
      //el._refreshAjax();
    }
  }

  _closeRightDrawer() {
    setTimeout(() => {
      // TODO: Fix
      // this.$$("#drawer")?.close();
    }, 100);
  }

  _setNumberOfUnViewedNotifications(event: CustomEvent) {
    if (event.detail.count) {
      if (event.detail.count < 10) {
        this.numberOfUnViewedNotifications = event.detail.count;
      } else {
        this.numberOfUnViewedNotifications = '9+';
      }
    } else {
      this.numberOfUnViewedNotifications = '';
    }
  }

  _redirectTo(event: CustomEvent) {
    if (event.detail.path) {
      YpNavHelpers.redirectTo(event.detail.path);
    }
  }

  _routeChanged() {
    const route = this.route;
    // Support older pre version 6.1 links
    if (window.location.href.indexOf('/#!/') > -1) {
      window.location.href = window.location.href.replace('/#!/', '/');
    }

    /* TODO: Add back in
    setTimeout(() => {
      if (route.indexOf('domain') > -1) {
        if (this.$$("#domainPage") && typeof this.$$("#domainPage").refresh !== "undefined") {
          this.$$("#domainPage").refresh();
        }
      } else if (route.indexOf('community_folder') > -1) {
        if (this.$$("#communityFolderPage") && typeof this.$$("#communityFolderPage").refresh !== "undefined") {
          this.$$("#communityFolderPage").refresh();
        }
      } else if (route.indexOf('community') > -1) {
        if (this.$$("#communityPage") && typeof this.$$("#communityPage").refresh !== "undefined") {
          this.$$("#communityPage").refresh();
        }
      } else if (route.indexOf('group') > -1) {
        if (this.$$("#groupPage") && typeof this.$$("#groupPage").refresh !== "undefined") {
          this.$$("#groupPage").refresh();
        }
      } else if (route.indexOf('post') > -1) {
        if (this.$$("#postPage") && typeof this.$$("#postPage").refresh !== "undefined") {
          this.$$("#postPage").refresh();
        }
      } else if (route.indexOf('user') > -1) {
        if (this.$$("#userPage") && typeof this.$$("#userPage").refresh !== "undefined") {
          this.$$("#userPage").refresh();
        }
      }
    });
    */
  }

  _routePageChanged(oldRouteData: Record<string, string>) {
    if (this.routeData) {
      const params = this.route.split('/');

      if (
        this.route.indexOf('/user/reset_password') > -1 ||
        this.route.indexOf('/user/open_notification_settings') > -1 ||
        this.route.indexOf('/user/accept/invite') > -1 ||
        this.route.indexOf('/user/info_page') > -1
      ) {
        if (this.route.indexOf('/user/reset_password') > -1) {
          this.openResetPasswordDialog(params[params.length - 1]);
        } else if (
          this.routeData &&
          this.routeData.page === 'user' &&
          this.route.indexOf('/user/accept/invite') > -1
        ) {
          this.openAcceptInvitationDialog(params[params.length - 1]);
        } else if (
          this.route.indexOf('/user/open_notification_settings') > -1
        ) {
          this.openUserNotificationsDialog();
        } else if (this.route.indexOf('/user/info_page') > -1) {
          this.openUserInfoPage(parseInt(params[params.length - 1]));
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new CustomEvent('location-changed'));
        }
      } else {
        const map: Record<string, number> = this._scrollPositionMap;

        if (oldRouteData && oldRouteData.page != undefined) {
          map[oldRouteData.page] = window.pageYOffset;
          console.info(
            'Saving scroll position for ' +
              oldRouteData.page +
              ' to ' +
              window.pageYOffset
          );
        }

        let delayUntilScrollToPost = 0;

        if (this.wide) {
          delayUntilScrollToPost = 2;
        }

        /*

        setTimeout(() => {
          let skipMasterScroll = false;

          if (oldRouteData && oldRouteData.page && this.routeData) {
            // Post -> Group
            if (oldRouteData.page==="post" && this.routeData.page==="group") {
              if (this.$$("#groupPage") && typeof this.$$("#groupPage").goToPostOrNewsItem !== "undefined") {
                this.$$("#groupPage")?.goToPostOrNewsItem();
                skipMasterScroll = true;
              } else {
                console.warn("Can't find scroll groupPage for goToPostOrNewsItem, trying again");
                setTimeout(() => {
                  if (this.$$("#groupPage") && typeof this.$$("#groupPage").goToPostOrNewsItem !== "undefined") {
                    this.$$("#groupPage")?.goToPostOrNewsItem();
                  } else {
                    console.warn("Can't find scroll groupPage for goToPostOrNewsItem final");
                  }
                }, 200);
              }
            }

            // Group -> Community
            else if ((oldRouteData.page==="group" || oldRouteData.page==="post") && this.routeData.page==="community") {
              if (this.$$("#communityPage") && typeof this.$$("#communityPage")?.scrollToGroupItem !== "undefined") {
                this.$$("#communityPage")?.scrollToGroupItem();
                skipMasterScroll = true;
              } else {
                console.warn("Can't find scroll communityPage for goToPostOrNewsItem, trying again");
                setTimeout(() => {
                  if (this.$$("#communityPage") && typeof this.$$("#communityPage")?.scrollToGroupItem !== "undefined") {
                    this.$$("#communityPage")?.scrollToGroupItem();
                  } else {
                    console.error("Can't find scroll communityPage for goToPostOrNewsItem");
                  }
                }, 200);
              }
            }

            // Community/CommunityFolder -> Domain
            else if ((oldRouteData.page==="community_folder" || oldRouteData.page==="community" || oldRouteData.page==="post")
                  && this.routeData.page==="domain") {
              if (this.$$("#domainPage") && typeof this.$$("#domainPage").scrollToCommunityItem !== "undefined") {
                this.$$("#domainPage").scrollToCommunityItem();
                skipMasterScroll = true;
              } else {
                console.warn("Can't find scroll domainPage for scrollToCommunityItem, trying again");
                setTimeout(function () {
                  if (this.$$("#domainPage") && typeof this.$$("#domainPage").scrollToGroupItem !== "undefined") {
                    this.$$("#domainPage").scrollToCommunityItem();
                  } else {
                    console.error("Can't find scroll domainPage for scrollToCommunityItem");
                  }
                }, 200);
              }
            }

            // Community/CommunityFolder  -> Community
            else if ((oldRouteData.page==="community" || oldRouteData.page==="community_folder") &&
              this.routeData.page==="community_folder") {
              if (this.$$("#communityFolderPage") && typeof this.$$("#communityFolderPage").scrollToGroupItem !== "undefined") {
                this.$$("#communityFolderPage").scrollToGroupItem();
                skipMasterScroll = true;
              } else {
                console.warn("Can't find scroll communityFolderPage for goToPostOrNewsItem, trying again");
                setTimeout(function () {
                  if (this.$$("#communityFolderPage") && typeof this.$$("#communityFolderPage").scrollToGroupItem !== "undefined") {
                    this.$$("#communityFolderPage").scrollToGroupItem();
                  } else {
                    console.error("Can't find scroll communityFolderPage for goToPostOrNewsItem");
                  }
                }, 200);
              }
            }
          }

          if(this.routeData.page!=='post') {
            this._clearNextPost();
          }

          if (oldRouteData && this.subRoute && this.routeData && oldRouteData.page===this.routeData.page) {
            let testRoute = this.subRoute;
            testRoute = testRoute.replace("/","");
            if (isNaN(parseInt(testRoute))) {
              skipMasterScroll = true;
            }
          }

          if (map[this.routeData.page] != null && this.routeData.page!=='post' &&
             !(oldRouteData && oldRouteData.page==="community" && this.routeData.page==="group")) {
            if (!skipMasterScroll) {
              window.scrollTo(0, map[this.routeData.page]);
              console.info("Main window scroll " + this.routeData.page + " to " + map[this.routeData.page]);
            } else {
              console.info("Skipping master scroller for " + this.routeData.page);
            }
          } else if (!skipMasterScroll) {
            console.info("AppLayout scroll to top");
            setTimeout(() => {
              window.scrollTo(0, 0);
            });
          }
        }, delayUntilScrollToPost);
        */

        if (this.routeData) {
          this.page = this.routeData.page;
          this._pageChanged();
        } else {
          console.error('No page data, current page: ' + this.page);
        }
      }
    }
  }

  _pageChanged() {
    const page = this.page;
    console.log('Page changed to ' + page);

    //TODO: Get bundling working
    /*if (page) {
      let resolvedPageUrl;
      if (page=="view-404") {
        resolvedPageUrl = this.resolveUrl("yp-view-404.html");
      } else if (page==='community_folder') {
        resolvedPageUrl = this.resolveUrl('../yp-community/yp-community-folder.js?v=@version@');
      } else {
        resolvedPageUrl = this.resolveUrl('/src/yp-' + page + '/' + 'yp-' + page + ".js?v=@version@");
      }
      console.log("Trying to load "+resolvedPageUrl);
      import(resolvedPageUrl).then(null, this._showPage404.bind(this));
    }*/

    if (page) {
      window.appGlobals.analytics.sendToAnalyticsTrackers(
        'send',
        'pageview',
        location.pathname
      );
    }
  }

  openResetPasswordDialog(resetPasswordToken: string) {
    // TODO: Remove any
    this.getDialogAsync('resetPassword', (dialog: any) => {
      dialog.open(resetPasswordToken);
    });
  }

  openUserNotificationsDialog() {
    if (window.appUser && window.appUser.loggedIn() === true) {
      window.appUser.openNotificationSettings();
    } else {
      window.appUser.loginForNotificationSettings();
    }
  }

  openAcceptInvitationDialog(inviteToken: string) {
    // TODO: Remove any
    this.getDialogAsync('acceptInvite', (dialog: any) => {
      dialog.open(inviteToken);
    });
  }

  _showPage404() {
    this.page = 'view-404';
  }

  _setHomeLink(event: CustomEvent) {
    if (!this.homeLink) {
      this.homeLink = event.detail;
    }
  }

  setKeepOpenForPostsOn(goBackToPage: string) {
    this.keepOpenForPost = goBackToPage;
    this.storedBackPath = this.backPath;
    this.storedLastDocumentTitle = document.title;
  }

  _resetKeepOpenForPage() {
    this.keepOpenForPost = undefined;
    this.storedBackPath = undefined;
    this.storedLastDocumentTitle = undefined;
  }

  _closePost() {
    if (this.keepOpenForPost) YpNavHelpers.redirectTo(this.keepOpenForPost);

    if (this.storedBackPath) this.backPath = this.storedBackPath;

    if (this.storedLastDocumentTitle) {
      document.title = this.storedLastDocumentTitle;
      this.storedLastDocumentTitle = undefined;
    }

    this.keepOpenForPost = undefined;
    document.dispatchEvent(
      new CustomEvent('lite-signal', {
        bubbles: true,
        detail: { name: 'yp-pause-media-playback', data: {} },
      })
    );
  }

  // Computed

  get closePostHeader() {
    if (this.page == 'post' && this.keepOpenForPost) return true;
    else return false;
  }

  _isGroupOpen(
    params: { groupId?: number; postId?: number },
    keepOpenForPost = false
  ) {
    if (params.groupId || (params.postId && keepOpenForPost)) return true;
    else return false;
  }

  _isCommunityOpen(
    params: { communityId?: number; postId?: number },
    keepOpenForPost = false
  ) {
    if (params.communityId || (params.postId && keepOpenForPost)) return true;
    else return false;
  }

  _isDomainOpen(
    params: { domainId?: number; postId?: number },
    keepOpenForPost = false
  ) {
    if (params.domainId || (params.postId && keepOpenForPost)) return true;
    else return false;
  }

  _toggleNavDrawer() {
    (this.$$('mwc-drawer') as Drawer).open = true;
  }

  getDialogAsync(idName: string, callback: Function) {
    // Todo: Get Working
    //(this.$$("#dialogContainer") as YpAppDialog).getDialogAsync(idName, callback);
  }

  /*
  getRatingsDialogAsync(callback) {
    this.$$("#dialogContainer")!.getRatingsDialogAsync(callback);
  }

  getUsersGridAsync(callback) {
    this.$$("#dialogContainer")!.getUsersGridAsync(callback);
  }

  getMediaRecorderAsync(callback) {
    this.$$("#dialogContainer")!.getMediaRecorderAsync(callback);
  }

  getContentModerationAsync(callback) {
    this.$$("#dialogContainer")!.getContentModerationAsync(callback);
  }

  getCreateReportAsync(callback) {
    this.$$("#dialogContainer")!.getCreateReportAsync(callback);
  }

  getDuplicateCollectionAsyncAsync(callback) {
    this.$$("#dialogContainer")!.getDuplicateCollectionAsyncAsync(callback);
  }

  openPixelCookieConfirm(trackerId) {
    this.$$("#dialogContainer")!.openPixelCookieConfirm(trackerId);
  }
  */

  closeDialog(idName: string) {
    // TODO: Get working
    //this.$$("#dialogContainer")!.closeDialog(idName);
  }

  _dialogClosed(event: CustomEvent) {
    // TODO: Get working
    //this.$$("#dialogContainer")!.dialogClosed(event.detail);
  }

  scrollPageToTop() {
    const mainArea = document.getElementById('#mainArea');
    if (mainArea) {
      mainArea.scrollTop = 0;
    }
  }

  _toggleUserDrawer() {
    // TODO: Get working
    //this.$$("#drawer")!.toggle();
  }

  _login() {
    if (window.appUser) {
      window.appUser.openUserlogin();
    }
  }

  _onChangeHeader(event: CustomEvent) {
    const header = event.detail;
    this.headerTitle = document.title = header.headerTitle;

    setTimeout(() => {
      const headerTitle = this.$$('#headerTitle') as HTMLElement | void;
      if (headerTitle) {
        const length = headerTitle.innerHTML.length;
        if (this.wide) {
          headerTitle.style.fontSize = '20px';
        } else {
          if (length < 20) {
            headerTitle.style.fontSize = '17px';
          } else if (length < 25) {
            headerTitle.style.fontSize = '14px';
          } else if (length < 30) {
            headerTitle.style.fontSize = '13px';
          } else {
            headerTitle.style.fontSize = '12px';
          }
        }
      }
    });

    if (header.documentTitle) {
      document.title = header.documentTitle;
    }
    this.headerDescription = header.headerDescription;

    //if (header.headerIcon)
    //app.headerIcon = header.headerIcon;
    if (header.enableSearch) this.showSearch = true;
    else this.showSearch = false;

    if (header.useHardBack === true) {
      this.useHardBack = true;
    } else {
      this.useHardBack = false;
    }

    if (header.backPath) {
      this.showBack = true;
      this.backPath = header.backPath;
    } else {
      this.showBack = false;
      this.backPath = undefined;
    }

    if (header.hideHelpIcon) {
      this.hideHelpIcon = true;
    } else {
      this.hideHelpIcon = false;
    }

    if (
      this.communityBackOverride &&
      this.backPath &&
      window.location.pathname.indexOf('/community/') > -1
    ) {
      const communityId = (window.location.pathname.split(
        '/community/'
      )[1] as unknown) as number;
      if (communityId && this.communityBackOverride[communityId]) {
        this.backPath = this.communityBackOverride[communityId].backPath;
        this.headerTitle = this.communityBackOverride[communityId].backName;
        this.useHardBack = false;
      }
    }

    if (this.showBack && header.disableDomainUpLink === true) {
      this.showBack = false;
      this.headerTitle = '';
    }
  }

  goBack() {
    if (this.backPath) {
      if (this.useHardBack) {
        document.dispatchEvent(
          new CustomEvent('lite-signal', {
            bubbles: true,
            composed: true,
            detail: { name: 'yp-pause-media-playback', data: {} },
          })
        );
        window.location.href = this.backPath;
      } else {
        YpNavHelpers.redirectTo(this.backPath);
      }
    }
  }

  _onSearch(e: CustomEvent) {
    this.toggleSearch();
    this.previousSearches.unshift(e.detail.value);
    const postsFilter = document.querySelector('#postsFilter') as LitElement;
    if (postsFilter) {
      //TODO: When we have postFilter live
      //postsFilter.searchFor(e.detail.value);
    }
  }

  _onUserChanged(event: CustomEvent) {
    if (event.detail && event.detail.id) {
      this.user = event.detail;
    } else {
      this.user = undefined;
    }
  }

  toggleSearch() {
    //TODO: When we have postFilter live
    //this.$$("#search")?.toggle();
  }

  _setupTouchEvents() {
    document.addEventListener('touchstart', this._handleTouchStart.bind(this), {
      passive: true,
    });
    document.addEventListener('touchmove', this._handleTouchMove.bind(this), {
      passive: true,
    });
    document.addEventListener('touchend', this._handleTouchEnd.bind(this), {
      passive: true,
    });
  }

  _removeTouchEvents() {
    document.removeEventListener(
      'touchstart',
      this._handleTouchStart.bind(this)
    );
    document.removeEventListener('touchmove', this._handleTouchMove.bind(this));
    document.removeEventListener('touchend', this._handleTouchEnd.bind(this));
  }

  _handleTouchStart(event: any) {
    if (this.page === 'post' && this.goForwardToPostId) {
      const touches = event.touches || event.originalEvent.touches;
      const firstTouch = touches[0];

      if (
        firstTouch.clientX > 32 &&
        firstTouch.clientX < window.innerWidth - 32
      ) {
        this.touchXDown = firstTouch.clientX;
        this.touchYDown = firstTouch.clientY;
        this.touchXUp = undefined;
        this.touchYUp = undefined;
      }
    }
  }

  _handleTouchMove(event: any) {
    if (this.page === 'post' && this.touchXDown && this.goForwardToPostId) {
      const touches = event.touches || event.originalEvent.touches;
      this.touchXUp = touches[0].clientX;
      this.touchYUp = touches[0].clientY;
    }
  }

  _handleTouchEnd() {
    if (
      this.page === 'post' &&
      this.touchXDown &&
      this.touchYDown &&
      this.touchYUp &&
      this.touchXUp &&
      this.goForwardToPostId
    ) {
      const xDiff = this.touchXDown - this.touchXUp;
      const yDiff = this.touchYDown - this.touchYUp;
      //console.error("xDiff: "+xDiff+" yDiff: "+yDiff);

      if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(yDiff) < 120) {
        let factor = 3;

        if (window.innerWidth > 500) factor = 4;

        if (window.innerWidth > 1023) factor = 5;

        if (window.innerWidth > 1400) factor = 6;

        const minScrollFactorPx = Math.round(window.innerWidth / factor);

        console.log(
          'Recommendation swipe minScrollFactorPx: ' + minScrollFactorPx
        );

        if (!this.userDrawerOpenedDelayed && !this.navDrawOpenedDelayed) {
          if (xDiff > 0 && xDiff > minScrollFactorPx) {
            window.scrollTo(0, 0);
            window.appGlobals.activity('swipe', 'postForward');
            this.$$('#goPostForward')?.dispatchEvent(new Event('tap'));
          } else if (xDiff < 0 && xDiff < -Math.abs(minScrollFactorPx)) {
            if (this.showBackToPost === true) {
              window.scrollTo(0, 0);
              this._goToPreviousPost();
              window.appGlobals.activity('swipe', 'postBackward');
            }
          }
        } else {
          console.log('Recommendation swipe not active with open drawers');
        }

        this.touchXDown = undefined;
        this.touchXUp = undefined;
        this.touchYDown = undefined;
        this.touchYUp = undefined;
      }
    }
  }
}
