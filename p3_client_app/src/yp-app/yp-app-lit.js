import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-pages/iron-pages.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-badge/paper-badge.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '../yp-behaviors/yp-lodash-behavior.js';
import '../yp-app-globals/yp-app-globals.js';
import '../yp-app-globals/yp-app-user.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypTranslatedPagesBehavior } from '../yp-behaviors/yp-translated-pages-behavior.js';
import '../ac-notifications/ac-notification-list.js';
import './yp-app-nav-drawer.js';
import '../yp-dialog-container/yp-dialog-container.js';
import '../yp-user/yp-user-image.js';
import { ypAppSwipeBehavior } from './yp-app-swipe-behavior.js';
import '../yp-app-globals/yp-sw-update-toast.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
//import i18next from 'i18next/dist/es/i18next.js'
//import { XHR } from 'i18next-xhr-backend/dist/es';
//import moment from 'moment-es6';

import i18next, { t as translate } from 'i18next'
import backend from 'i18next-xhr-backend'
import { format, formatDistance } from 'date-fns';
//import {
//  ca,da,de,dev,en,en_CA,en_GB,es,fa,fr,hr,hu,is,it,kl,nl,no,pl,pt,pt_BR,ru,sl,sr,sr_latin,tr,zh_TW
//} from 'date-fns/locale';

/*import 'moment/locale/is.js';
import 'moment/locale/nb.js';
import 'moment/locale/nl.js';
import 'moment/locale/hu.js';
import 'moment/locale/zh-tw.js';
import 'moment/locale/sr.js';
import 'moment/locale/hr.js';
import 'moment/locale/tr.js';
import 'moment/locale/sl.js';
import 'moment/locale/pt.js';
import 'moment/locale/pl.js';
import 'moment/locale/de.js';
import 'moment/locale/fr.js';
import 'moment/locale/da.js';
*/

setPassiveTouchGestures(true);
class YpAppLit extends YpBaseElement {
  static get properties() {
    return {
      domainSubRoute: Object,
      communitySubRoute: Object,
      communityFolderSubRoute: Object,
      groupSubRoute: Object,
      postSubRoute: Object,
      userSubRoute: Object,

      userDrawerOpened: {
        type: Boolean,
        observer: '_userDrawerOpened'
      },

      navDrawOpened:  {
        type: Boolean,
        observer: '_navDrawOpened'
      },

      userDrawerOpenedDelayed: Boolean,
      navDrawOpenedDelayed: Boolean,

      homeLink: {
        type: Object
      },

      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },

      route: {
        type: Object,
        observer: '_routeChanged'
      },

      routeData: {
        type: Object,
        observer: '_routePageChanged',
        value: null
      },

      subRoute: Object,

      appTitle: {
        type: String,
        value: "Your Priorities"
      },

      user: {
        type: Object,
        value: null
      },

      previousSearches: {
        type: Array,
        value: []
      },

      showSearch: {
        type: Boolean,
        value: false
      },

      showBack: {
        type: Boolean,
        value: false
      },

      backPath: {
        type: String
      },

      forwardToPostId: {
        type: String,
        value: null
      },

      storedBackPath: String,

      backListPostItem: {
        type: Number,
        value: null
      },

      backListGroupItemId: {
        type: Number,
        value: null
      },

      backListCommuntiyItemId: {
        type: Number,
        value: null
      },

      storedLastDocumentTitle: String,

      headerTitle: {
        type: String
      },

      headerDescription: {
        type: String
      },

      params: {
        type: Object
      },

      narrow: {
        type: Boolean
      },

      keepOpenForPost: {
        type: String,
        value: null
      },

      closePostHeader: {
        type: Boolean,
        computed: '_closePostHeader(page, keepOpenForPost)',
        value: null
      },

      numberOfUnViewedNotifications: {
        type: String,
        value: null
      },

      // Use window.location when clicking back link
      useHardBack: {
        type: Boolean,
        value: false
      },

      hideHelpIcon: {
        type: Boolean,
        value: false
      },

      wide: Boolean,

      _scrollPositionMap: {
        type: Object,
        value: function() {
          return {};
        }
      },

      autoTranslate: {
        type: Boolean,
        value: false
      },

      languageName: String,

      goBackToPostId: {
        type: Number,
        value: null
      },

      currentPostId: {
        type: Number,
        value: null
      },

      goForwardToPostId: {
        type: Number,
        value: null
      },

      showBackToPost: {
        type: Boolean,
        value: false
      },

      goForwardPostName:{
        type: String,
        value: null
      },

      goForwardCount:{
        type: String,
        value: 0
      }
    }
  }

  static get styles() {
    return [
      css`

      :host {
        --main-stats-color-on-white: #878787;

        --paper-dialog-button-color: var(--accent-color);
        --paper-tabs-selection-bar-color: var(--accent-color);
        --paper-input-container-focus-color: var(--accent-color);

        --paper-dropdown-menu: {
          background-color: #FFF;
        };

        --icon-general-color: '#fff';
        --master-point-up-color: rgba(0,127,0,0.62);
        --master-point-down-color: rgba(127,0,0,0.62);
      }

      :host  {
        --paper-dropdown-menu: {
          background-color: #FFF;
        };

        --light-primary-color: #FFCC80;
        --text-primary-color: #fff;
        --dark-primary-color: #F57C00;
        --primary-text-color: #212121;
        --secondary-text-color: #727272;
        --disabled-text-color: #bdbdbd;
        --divider-color: #FF5722;

        --paper-tabs: {
          font-size: 18px;
          text-transform: uppercase;
        };

        --paper-fab-mini: {
          background: var(--primary-background-color);
          color: #555 !important;
        };

        /* Components */

        --paper-tabs-selection-bar: {
          border-bottom: 4px solid !important;
          border-bottom-color: var(--accent-color, #000) !important;
        };

        /* paper-drawer-panel */
        --drawer-menu-color: #ffffff;
        --drawer-border-color: 1px solid #ccc;
        /* paper-menu */
        --paper-menu-background-color: var(--primary-background-color);
        --menu-link-color: #111111;
      }

      :host {
        background-color: var(--primary-background-color);
      }

      app-header {
        color: #fff;
        background-color: var(--primary-background-color);
      }

      app-toolbar {
        color: #FFF;
      }

      iron-pages {
        background-color: var(--primary-background-color);
      }

      [condensed-title] {
        /*        background-size: 76px; */
        /* The difference in font size is used to calculate the scale of the title in the transition. */
        font-size: 16px;
      }

      [title] {
        /* The difference in font size is used to calculate the scale of the title in the transition. */
        padding-top: 8px;
        padding-left: 8px;
        padding-bottom: 8px;
      }

      .backIcon {
        width: 32px !important;
        height: 32px !important;
        margin-right: 12px;
        margin-left: 12px;
        padding: 0;
        margin-top: 4px;
      }

      .backIcon[hide] {
        display: none;
      }

      .masterActionIcon {
        width: 52px;
        height: 52px;
      }

      .main-header {
        border-bottom: 1px solid var(--primary-color-800);
        background-color: var(--primary-color-800);
        color: #333;
        height: 64px;
      }

      .dropdown-content {
        width: 200px;
      }

      #paperToggleNavMenu {
        min-width: 40px;
      }

      #translationButton {
        color: #FFF;
        background-color: var(--accent-color);
        padding: 6px;
        min-width: 0 !important;
        margin-left: 8px;
        margin-right: 8px;
      }

      .stopIcon {
        margin-left: 6px;
      }

      .helpButton {
        margin-right: 8px;
      }

      .forwardPostName {
        margin-left: 4px;
        margin-top: 14px;
        color: #C5C5C5;
      }

      @media (max-width: 480px) {
        #forwardPostName {
          display: none !important;
        }

        .stopIcon {
          display: none;
        }

        .forwardPostName {
          margin-left: 4px;
          margin-top: 14px;
          font-size: 15px;
        }

        #translationButton {
          width: 40px !important;
          max-width: 40px !important;
          margin-left: 8px;
        }

        div[title] {
          font-size: 17px;
          white-space: normal !important;
          padding-left: 0;
        }

        .backIcon {
          min-width: 28px !important;
          min-height: 28px !important;
        }

        .masterActionIcon {
          width: 48px;
          height: 48px;
        }

        .loginButton {
          font-size: 15px;
          padding: 4px;
        }

        paper-menu-button {
          padding: 0;
        }

        mwc-button {
          padding:0;
          margin: 0;
        }

        #translationIcon {
          width: 30px;
          height: 30px;
          padding: 6px;
        }
      }

      @media (max-width: 340px) {
        div[title] {
          font-size: 17px;
          white-space: normal !important;
          padding-left: 0;
        }

        .backIcon {
          min-width: 26px !important;
          min-height: 26px !important;
        }

        .loginButton {
          font-size: 12px;
          padding: 0;
        }
      }

      .userImageNotificationContainer {
        cursor: pointer;
        margin-right: 8px;
        display:inline-block;
      }

      .activeBadge {
        --paper-badge-background: var(--accent-color);
      }

      .helpButton[hide] {
        display: none;
      }

      .navContainer[hide] {
        display: none;
      }

      [hidden] {
        display: none !important;
      }

      #headerTitle {
        padding-right: 0 !important;
      }

      app-toolbar {
        padding-left: 8px;
        padding-right: 16px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    ${this.app ? html`
    <iron-media-query query="(min-width: 600px)" query-matches="${this.wide}"></iron-media-query>

    <yp-app-globals id="appGlobals" setup-defaults @change-header="${this.onChangeHeader}"></yp-app-globals>

    <app-drawer-layout .drawerWidth="360px" .responsiveWidth="16000px" fullbleed>

      <app-drawer id="drawer" slot="drawer" .align="end" .position="right" .opened="${this.userDrawerOpened}" swipe-open>
        <div style="height: 100%; overflow-x: hidden; max-width: 255px !important; width: 255px;">
          <ac-notification-list id="acNotificationsList" .user="${this.user}" .opened="${this.userDrawerOpened}" .route="${this.route}"></ac-notification-list>
        </div>
      </app-drawer>

      <app-drawer id="navDrawer" slot="drawer" .align="start" position="left" swipe-open="" opened="${this.navDrawOpened}">
        <div style="height: 100%; overflow-x: hidden; max-width: 255px !important;">
          <yp-app-nav-drawer id="ypNavDrawer" .home-link="${this.homeLink}" @yp-toggle-nav-drawer="${this._toggleNavDrawer}" .user="${this.user}" .route="${this.route}"></yp-app-nav-drawer>
        </div>
      </app-drawer>

      <app-header-layout id="mainArea" fullbleed>

        <app-header slot="header" id="appHeader" effects="waterfall" reveals="" class="main-header">
          <app-toolbar>
            <div class="layout horizontal navContainer" ?hidden="${this.closePostHeader}">
              <paper-icon-button .ariaLabel="${this.t('goBack')}" title="${this.t('goBack')}" icon="arrow-upward" @tap="${this.goBack}" class="masterActionIcon" ?hidden="${!this.showBack}"></paper-icon-button>
            </div>
            <div .hide="${this.closePostHeader}" ?hidden="${this.goForwardToPostId}" id="headerTitle" title="" class="layout vertical navContainer">${this.headerTitle}</div>

            ${this.closePostHeader ? html`
              <paper-icon-button ariaLabel="${this.t('close')}" id="closePostButton" class="masterActionIcon" .icon="arrow-back" @tap="${this._closePost}"></paper-icon-button>
            `: html``}

            ${this.goForwardToPostId ? html`
              <div class="layout horizontal">
                <paper-icon-button .ariaLabel="${this.t('forwardToPost')}" title="${this.t('forwardToPost')}" id="goPostForward" class="masterActionIcon" .icon="fast-forward" @tap="${this._goToNextPost}"></paper-icon-button>
                <div id="forwardPostName" class="forwardPostName">
                  ${this.goForwardPostName}
                </div>
              </div>
            `: html``}

            <span class="flex"></span>
            <div ?hidden="${!this.autoTranslate}" class="layout horizontal">
              <mwc-button raised id="translationButton" 
                          @click="${this._stopTranslation}" icon="translate" .label="${this.t('stopAutoTranslate')}">
                <iron-icon class="stopIcon" icon="do-not-disturb"></iron-icon>
              </mwc-button>
            </div>
            <paper-icon-button .ariaLabel="${this.t('openMainMenu')}" id="paperToggleNavMenu" .icon="menu" @tap="${this._toggleNavDrawer}"></paper-icon-button>
            <paper-menu-button horizontal-align="right" hide="${this.hideHelpIcon}" class="helpButton">
              <paper-icon-button .ariaLabel="${this.t('menu.help')}" icon="help-outline" .slot="dropdown-trigger"></paper-icon-button>

              <paper-listbox .slot="dropdown-content">

              ${ this.translatedPages.map(page => html`
                <paper-item data-args="${this.index}" @tap="${this._openPageFromMenu}">${this._getLocalizePageTitle(page)}</paper-item>
              `)}

              </paper-listbox>
            </paper-menu-button>

            ${ this.user ? html`
              <div class="userImageNotificationContainer layout horizontal" @tap="${this._toggleUserDrawer}">
                <yp-user-image id="userImage" .small="" .user="${this.user}"></yp-user-image>
                <paper-badge id="notificationBadge" class="activeBadge" .label="${this.numberOfUnViewedNotifications}" ?hidden="${!this.numberOfUnViewedNotifications}"></paper-badge>
              </div>
            ` : html`
              <mwc-button class="loginButton" @click="${this._login}" .label="${this.t('user.login')}"></mwc-button>
            `}

          </app-toolbar>
        </app-header>

        <iron-pages selected="${this.page}" .style="height:auto;" .attrForSelected="name" fullbleed="">
          <yp-domain id="domainPage" name="domain" id-route="${this.domainSubRoute}" @change-header="${this.onChangeHeader}"></yp-domain>
          <yp-community id="communityPage" name="community" id-route="${this.communitySubRoute}" @change-header="${this.onChangeHeader}"></yp-community>
          <yp-community-folder id="communityFolderPage" name="community_folder" id-route="${this.communityFolderSubRoute}" @change-header="${this.onChangeHeader}"></yp-community-folder>
          <yp-group id="groupPage" name="group" id-route="${this.groupSubRoute}" @change-header="${this.onChangeHeader}"></yp-group>
          <yp-post id="postPage" name="post" id-route="${this.postSubRoute}" @change-header="${this.onChangeHeader}"></yp-post>
          <yp-user id="userPage" name="user" id-route="${this.userSubRoute}" @change-header="${this.onChangeHeader}"></yp-user>
          <yp-view-404 name="view-404"></yp-view-404>
        </iron-pages>

      </app-header-layout>
    </app-drawer-layout>
    
    <lite-signal @lite-signal-yp-auto-translate="${this._autoTranslateEvent}"></lite-signal>

    <app-location .route="${this.route}"></app-location>

    <app-route .route="${this.route}" .pattern="/:page" data="${this.routeData}" tail="${this.subRoute}"></app-route>

    <yp-dialog-container id="dialogContainer"></yp-dialog-container>
    <yp-app-user id="appUser" @user-changed="${this.onUserChanged}"></yp-app-user>
    <yp-sw-update-toast .buttonLabel="${this.t('reload')}" .message="${this.t('newVersionAvailable')}"></yp-sw-update-toast>
` : html``}
`
  }

/*
  behaviors: [
    ypThemeBehavior,
    ypGotoBehavior,
    ypTranslatedPagesBehavior,
    ypAppSwipeBehavior
  ],

  listeners: {
    'yp-set-pages': '_setPages',
    'yp-set-next-post': '_setNextPost',
    'yp-set-home-link': '_setHomeLink',
    'yp-redirect-to': '_redirectTo',
    'yp-set-number-of-un-viewed-notifications': '_setNumberOfUnViewedNotifications',
    'yp-close-right-drawer': '_closeRightDrawer',
    'yp-refresh-group': '_refreshGroup',
    'yp-refresh-community': '_refreshCommunity',
    'yp-refresh-domain': '_refreshDomain',
    'yp-language-name': '_setLanguageName',
    'yp-dialog-closed': '_dialogClosed',
    'yp-open-page': '_openPageFromEvent',
    'yp-open-login': '_login',
    'yp-reset-keep-open-for-page': '_resetKeepOpenForPage'
  },
*/

  _userDrawerOpened(value) {
    this.async(function() {
      this.set('userDrawerOpenedDelayed', value);
    }, 500);
  }

  _navDrawOpened(value) {
    this.async(function() {
      this.set('navDrawOpenedDelayed', value);
    }, 500);
  }

  _goToNextPost() {
    if (this.currentPostId) {
      this.set('goBackToPostId', this.currentPostId);
    } else {
      console.error("No currentPostId on next");
    }

    if (this.goForwardToPostId) {
      this.goToPost(this.goForwardToPostId, null, null, null, true);
      window.appGlobals.activity('recommendations', 'goForward', this.goForwardToPostId);
      this.goForwardCount += 1;
      this.set('showBackToPost', true);
    } else {
      console.error("No goForwardToPostId");
    }
  }

  _goToPreviousPost() {
    if (this.goForwardCount>0) {
      window.history.back();
      window.appGlobals.activity('recommendations', 'goBack');
    } else {
      this.set('showBackToPost', false);
    }
    this.goForwardCount -= 1;
  }

  _setNextPost(event, detail) {
    if (detail.goForwardToPostId) {
      this.set('goForwardToPostId', detail.goForwardToPostId);
      this.set('goForwardPostName', detail.goForwardPostName);
    } else {
      this._clearNextPost();
    }
    this.set('currentPostId', detail.currentPostId);
  }

  _clearNextPost() {
    this.set('goForwardToPostId', null);
    this.set('goForwardPostName', null);
    this.goForwardCount=0;
    this.set('showBackToPost', false);
  }

  _setupSamlCallback() {
    const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    const eventer = window[eventMethod];
    const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    console.log("Have created event listener for samlLogin");

    eventer(messageEvent,function(e) {
      if (e.data=='samlLogin' && window.appUser) {
        window.appUser.loginFromSaml();
        console.log("Have contacted app user 2");
      }
    },false);
  }

  _setupTranslationSystem() {
    console.log("Have started _setupTranslationSystem");
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
      let localeByTld = {
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

    let language;
    const storedLocale = localStorage.getItem('yp-user-locale');
    if (storedLocale) {
      defaultLocale = storedLocale;
    }

    let localeFromUrl;

    if (window.appGlobals.originalQueryParameters &&
        window.appGlobals.originalQueryParameters["locale"]) {
      localeFromUrl = window.appGlobals.originalQueryParameters["locale"];
    }

    if (window.appGlobals.originalQueryParameters &&
      window.appGlobals.originalQueryParameters["startAutoTranslate"]) {
      this.async(function () {
        this._startTranslation();
      }, 2500);
    }

    if (localeFromUrl && localeFromUrl.length == 2) {
      defaultLocale = localeFromUrl;
      localStorage.setItem('yp-user-locale', localeFromUrl);
    }

    console.info("Have started loading i18n for "+defaultLocale);
    i18next.use(backend).init(
      {
        lng: defaultLocale,
        fallbackLng: 'en',
        backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' }
        }, function(loaded) {
      console.info("Have loaded languages for "+defaultLocale);
      window.locale = defaultLocale;
      window.i18nTranslation = i18next;
      window.haveLoadedLanguages = true;
//      moment.locale([defaultLocale, 'en']);

      console.log("Changed language to "+defaultLocale);

      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'yp-language', data: { type: 'language-loaded', language: defaultLocale }  }
        })
      );
    }.bind(this));
  }

  _openPageFromEvent(event, detail) {
    if (detail.pageId) {
      this.openPageFromId(detail.pageId);
    }
  }

  _startTranslation() {
    window.autoTranslate = true;
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-auto-translate', data: true }
      })
    );

    if (this.supportedLanguages) {
      this.fire('yp-language-name', this.supportedLanguages[this.language]);
    }

    dom(document).querySelector('yp-app').getDialogAsync("masterToast", function (toast) {
      toast.text = this.t('autoTranslationStarted');
      toast.show();
    }.bind(this));
  }

  _stopTranslation() {
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-auto-translate', data: false }
      })
    );
    window.autoTranslate = false;
    dom(document).querySelector('yp-app').getDialogAsync("masterToast", function (toast) {
      toast.text = this.t('autoTranslationStopped');
      toast.show();
    }.bind(this));
    sessionStorage.setItem("dontPromptForAutoTranslation", true);
  }

  _setLanguageName(event, detail) {
    this.set('languageName', detail);
  }

  _autoTranslateEvent(event, detail) {
    this.set('autoTranslate', detail);
  }

  _refreshGroup() {
    this._refreshByName("#groupPage");
  }

  _refreshCommunity() {
    this._refreshByName("#communityPage");
  }

  _refreshDomain() {
    this._refreshByName("#domainPage");
  }

  _refreshByName(id) {
    const el = this.$$(id);
    if (el) {
      el._refreshAjax();
    }
  }

  _closeRightDrawer() {
    this.async(function () {
      this.$$("#drawer").close();
    }, 100);
  }

  _setNumberOfUnViewedNotifications(event, detail) {
    if (detail.count) {
      if (detail.count<10) {
        this.set('numberOfUnViewedNotifications', detail.count);
      } else {
        this.set('numberOfUnViewedNotifications', '9+');
      }
    } else {
      this.set('numberOfUnViewedNotifications', '');
    }
    this.async(function () {
      this.$$("#notificationBadge").fire("iron-resize");
    });
  }

  _redirectTo(event, detail) {
    if (detail.path) {
      this.set('route.path', detail.path);
    }
  }

  _routeChanged(route) {
    // Support older pre version 6.1 links
    if (window.location.href.indexOf("/#!/") > -1) {
      window.location = window.location.href.replace("/#!/", "/");
    }

    this.async(function () {
      if (route.path.indexOf('domain') > -1) {
        this.set('domainSubRoute', this.subRoute);
        if (this.$$("#domainPage") && typeof this.$$("#domainPage").refresh !== "undefined") {
          this.$$("#domainPage").refresh();
        }
      } else if (route.path.indexOf('community_folder') > -1) {
        this.set('communityFolderSubRoute', this.subRoute);
        if (this.$$("#communityFolderPage") && typeof this.$$("#communityFolderPage").refresh !== "undefined") {
          this.$$("#communityFolderPage").refresh();
        }
      } else if (route.path.indexOf('community') > -1) {
        this.set('communitySubRoute', this.subRoute);
        if (this.$$("#communityPage") && typeof this.$$("#communityPage").refresh !== "undefined") {
          this.$$("#communityPage").refresh();
        }
      } else if (route.path.indexOf('group') > -1) {
        this.set('groupSubRoute', this.subRoute);
        if (this.$$("#groupPage") && typeof this.$$("#groupPage").refresh !== "undefined") {
          this.$$("#groupPage").refresh();
        }
      } else if (route.path.indexOf('post') > -1) {
        this.set('postSubRoute', this.subRoute);
        if (this.$$("#postPage") && typeof this.$$("#postPage").refresh !== "undefined") {
          this.$$("#postPage").refresh();
        }
      } else if (route.path.indexOf('user') > -1) {
        this.set('userSubRoute', this.subRoute);
        if (this.$$("#userPage") && typeof this.$$("#userPage").refresh !== "undefined") {
          this.$$("#userPage").refresh();
        }
      }
    });
  }

  _routePageChanged(pageData, oldPageData) {
    if (pageData) {
      const params = this.route.path.split('/');

      if (this.route.path.indexOf('/user/reset_password') > -1 ||
        this.route.path.indexOf('/user/open_notification_settings') > -1 ||
        this.route.path.indexOf('/user/accept/invite') > -1 ||
        this.route.path.indexOf('/user/info_page') > -1) {

        if (this.route.path.indexOf('/user/reset_password') > -1) {
          this.openResetPasswordDialog(params[params.length-1]);
        } else if (pageData && pageData.page==="user" && this.route.path.indexOf('/user/accept/invite') > -1) {
          this.openAcceptInvitationDialog(params[params.length-1]);
        } else if (this.route.path.indexOf('/user/open_notification_settings') > -1) {
          this.openUserNotificationsDialog();
        } else if (this.route.path.indexOf('/user/info_page') > -1) {
          this.openUserInfoPage(params[params.length-1]);
          window.history.pushState({}, null, "/");
          window.dispatchEvent(new CustomEvent('location-changed'));
        }
      } else {

        const map = this._scrollPositionMap;

        if (oldPageData != null && oldPageData.page != null) {
          map[oldPageData.page] = window.pageYOffset;
          console.info("Saving scroll position for "+oldPageData.page+" to "+window.pageYOffset);
        }

        let delayUntilScrollToPost = null;

        if (this.wide) {
          delayUntilScrollToPost = 2;
        }

        this.async(function () {
          const skipMasterScroll = false;

          if (oldPageData && oldPageData.page && pageData) {
            // Post -> Group
            if (oldPageData.page==="post" && pageData.page==="group") {
              if (this.$$("#groupPage") && typeof this.$$("#groupPage").goToPostOrNewsItem !== "undefined") {
                this.$$("#groupPage").goToPostOrNewsItem();
                skipMasterScroll = true;
              } else {
                console.warn("Can't find scroll groupPage for goToPostOrNewsItem, trying again");
                this.async(function () {
                  if (this.$$("#groupPage") && typeof this.$$("#groupPage").goToPostOrNewsItem !== "undefined") {
                    this.$$("#groupPage").goToPostOrNewsItem();
                  } else {
                    console.warn("Can't find scroll groupPage for goToPostOrNewsItem final");
                  }
                }, 200);
              }
            }

            // Group -> Community
            else if ((oldPageData.page==="group" || oldPageData.page==="post") && pageData.page==="community") {
              if (this.$$("#communityPage") && typeof this.$$("#communityPage").scrollToGroupItem !== "undefined") {
                this.$$("#communityPage").scrollToGroupItem();
                skipMasterScroll = true;
              } else {
                console.warn("Can't find scroll communityPage for goToPostOrNewsItem, trying again");
                this.async(function () {
                  if (this.$$("#communityPage") && typeof this.$$("#communityPage").scrollToGroupItem !== "undefined") {
                    this.$$("#communityPage").scrollToGroupItem();
                  } else {
                    console.error("Can't find scroll communityPage for goToPostOrNewsItem");
                  }
                }, 200);
              }
            }

            // Community/CommunityFolder -> Domain
            else if ((oldPageData.page==="community_folder" || oldPageData.page==="community" || oldPageData.page==="post") && pageData.page==="domain") {
              if (this.$$("#domainPage") && typeof this.$$("#domainPage").scrollToCommunityItem !== "undefined") {
                this.$$("#domainPage").scrollToCommunityItem();
                skipMasterScroll = true;
              } else {
                console.warn("Can't find scroll domainPage for scrollToCommunityItem, trying again");
                this.async(function () {
                  if (this.$$("#domainPage") && typeof this.$$("#domainPage").scrollToGroupItem !== "undefined") {
                    this.$$("#domainPage").scrollToCommunityItem();
                  } else {
                    console.error("Can't find scroll domainPage for scrollToCommunityItem");
                  }
                }, 200);
              }
            }

            // Community/CommunityFolder  -> Community
            else if ((oldPageData.page==="community" || oldPageData.page==="community_folder") &&
                 pageData.page==="community_folder") {
              if (this.$$("#communityFolderPage") && typeof this.$$("#communityFolderPage").scrollToGroupItem !== "undefined") {
                this.$$("#communityFolderPage").scrollToGroupItem();
                skipMasterScroll = true;
              } else {
                console.warn("Can't find scroll communityFolderPage for goToPostOrNewsItem, trying again");
                this.async(function () {
                  if (this.$$("#communityFolderPage") && typeof this.$$("#communityFolderPage").scrollToGroupItem !== "undefined") {
                    this.$$("#communityFolderPage").scrollToGroupItem();
                  } else {
                    console.error("Can't find scroll communityFolderPage for goToPostOrNewsItem");
                  }
                }, 200);
              }
            }
          }

          if(pageData.page!=='post') {
            this._clearNextPost();
          }

          if (oldPageData && pageData && oldPageData.page===pageData.page) {
            let testRoute = this.subRoute.path;
            testRoute = testRoute.replace("/","");
            if (isNaN(testRoute)) {
              skipMasterScroll = true;
            }
          }

          if (map[pageData.page] != null && pageData.page!=='post' &&
             !(oldPageData && oldPageData.page==="community" && pageData.page==="group")) {
            if (!skipMasterScroll) {
              window.scrollTo(0, map[pageData.page]);
              console.info("Main window scroll " + pageData.page + " to " + map[pageData.page]);
            } else {
              console.info("Skipping master scroller for " + pageData.page);
            }
          } else if (this.isAttached && !skipMasterScroll) {
            console.info("AppLayout scroll to top");
            this.async(function () {
              window.scrollTo(0, 0);
            });
          }
        }, delayUntilScrollToPost);

        if (pageData) {
          this.page = pageData.page;
        } else {
          console.error("No page data, current page: "+this.page);
        }
      }
    }
  }

  _pageChanged(page, oldPage) {
    console.log("Page changed to "+page);
    if (page) {
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
    }

    if (page) {
      window.appGlobals.sendToAnalyticsTrackers('send', 'pageview', location.pathname);
    }
  }

  openResetPasswordDialog(resetPasswordToken) {
    this.getDialogAsync("resetPassword", function (dialog) {
      dialog.open(resetPasswordToken);
    }.bind(this));
  }

  openUserNotificationsDialog() {
    if (window.appUser && window.appUser.loggedIn()===true) {
      window.appUser.openNotificationSettings();
    } else {
      window.appUser.loginForNotificationSettings();
    }
  }

  openAcceptInvitationDialog(inviteToken) {
    debugger;
    this.getDialogAsync("acceptInvite", function (dialog) {
      dialog.open(inviteToken);
    }.bind(this));
  }

  _showPage404() {
    this.page = 'view-404';
  }

  _setHomeLink(event, homeLink) {
    if (!this.homeLink) {
      this.set('homeLink', homeLink);
    }
  }

  setKeepOpenForPostsOn(goBackToPage) {
    this.set('keepOpenForPost', goBackToPage);
    this.set('storedBackPath', this.backPath);
    this.set('storedLastDocumentTitle', document.title);
  }

  _resetKeepOpenForPage() {
    this.set('keepOpenForPost', null);
    this.set('storedBackPath', null);
    this.set('storedLastDocumentTitle', null);
  }

  _closePost() {
    if (this.keepOpenForPost)
      this.redirectTo(this.keepOpenForPost);

    if (this.storedBackPath)
      this.set('backPath', this.storedBackPath);

    if (this.storedLastDocumentTitle) {
      document.title = this.storedLastDocumentTitle;
      this.set('storedLastDocumentTitle', null);
    }

    this.set('this.keepOpenForPost', null);
    document.dispatchEvent(new CustomEvent("lite-signal", {bubbles: true, compose: true, detail: { name: 'yp-pause-media-playback',data:{}}}));
  }

  _closePostHeader(page, keepOpenForPost) {
    if (page=="post" && keepOpenForPost)
      return true;
    else
      return false;
  }

  _isGroupOpen(params, keepOpenForPost) {
    if (params.groupId || (params.postId && keepOpenForPost))
      return true;
    else
      return false;
  }

  _isCommunityOpen(params, keepOpenForPost) {
    if (params.communityId || (params.postId && keepOpenForPost))
      return true;
    else
      return false;
  }

  _isDomainOpen(params, keepOpenForPost) {
    if (params.domainId || (params.postId && keepOpenForPost))
      return true;
    else
      return false;
  }

  _toggleNavDrawer() {
    this.$$("#navDrawer").toggle();
  }

  connectedCallback() {
    super.connectedCallback()
      console.info("yp-app is ready");
      window.app = this;
      this._setupTranslationSystem();
      this.setTheme(16);
      this._setupSamlCallback();
  }

  getDialogAsync(idName, callback) {
    this.$$("#dialogContainer").getDialogAsync(idName, callback);
  }

  getUsersGridAsync(callback) {
    this.$$("#dialogContainer").getUsersGridAsync(callback);
  }

  getMediaRecorderAsync(callback) {
    this.$$("#dialogContainer").getMediaRecorderAsync(callback);
  }

  getContentModerationAsync(callback) {
    this.$$("#dialogContainer").getContentModerationAsync(callback);
  }

  openPixelCookieConfirm(trackerId) {
    this.$$("#dialogContainer").openPixelCookieConfirm(trackerId);
  }

  closeDialog(idName) {
    this.$$("#dialogContainer").closeDialog(idName);
  }

  _dialogClosed(event, detail) {
    this.$$("#dialogContainer").dialogClosed(detail);
  }

  scrollPageToTop() {
    const mainArea = document.getElementById('#mainArea');
    if (mainArea) {
      mainArea.scroller.scrollTop = 0;
    }
  }

  _toggleUserDrawer() {
    this.$$("#drawer").toggle();
  }

  _login() {
    if (window.appUser) {
      window.appUser.openUserlogin();
    }
  }

  onChangeHeader(event, header) {
    console.info(header);
    this.set('headerTitle', document.title = header.headerTitle);

    this.async(function () {
      const headerTitle = this.$$("#headerTitle");
      if (headerTitle) {
        const length = headerTitle.innerHTML.length;
        if (this.wide) {
          headerTitle.style.fontSize = "20px";
        } else {
          if (length < 20) {
            headerTitle.style.fontSize = "17px";
          } else if (length < 25) {
            headerTitle.style.fontSize = "14px";
          } else if (length < 30) {
            headerTitle.style.fontSize = "13px";
          } else {
            headerTitle.style.fontSize = "12px";
          }
        }
      }
    });

    if (header.documentTitle) {
      document.title = header.documentTitle;
    }
    this.set('headerDescription', header.headerDescription);

    //if (header.headerIcon)
    //app.headerIcon = header.headerIcon;
    if (header.enableSearch)
      this.showSearch = true;
    else
      this.showSearch = false;

    if (header.useHardBack===true) {
      this.set('useHardBack', true);
    } else {
      this.set('useHardBack', false);
    }

    if (header.backPath) {
      this.set('showBack', true);
      this.set('backPath', header.backPath);
    } else {
      this.set('showBack', false);
      this.set('backPath', null);
    }

    if (header.backListPostItem) {
      this.set('backListPostItem', header.backListPostItem);
    } else {
      this.set('backListPostItem', null);
    }

    if (header.hideHelpIcon) {
      this.set('hideHelpIcon', true);
    } else {
      this.set('hideHelpIcon', false);
    }

    if (this.showBack && header.disableDomainUpLink===true) {
      this.set('showBack', false);
      this.set('headerTitle', '');
    }
  }

  goBack(event, detail) {
    if (this.backPath) {
      if (this.useHardBack) {
        document.dispatchEvent(new CustomEvent("lite-signal", {bubbles: true, compose: true, detail: { name: 'yp-pause-media-playback',data:{}}}));
        window.location = this.backPath;
      } else {
        this.redirectTo(this.backPath);
      }
    }
  }

  _onSearch(e) {
    this.toggleSearch();
    this.unshift('previousSearches', e.detail.value);
    const postsFilter = document.querySelector('#postsFilter');
    if (postsFilter) {
      postsFilter.searchFor(e.detail.value);
    }
  }

  onUserChanged(event, detail) {
    if (detail && detail.id) {
      this.set('user', detail);
    } else {
      this.set('user', null);
    }
  }

  toggleSearch() {
    this.$$("#search").toggle();
  }

  __equal(a, b) {
    return a === b;
  }
}

window.customElements.define('yp-app-lit', YpAppLit)
