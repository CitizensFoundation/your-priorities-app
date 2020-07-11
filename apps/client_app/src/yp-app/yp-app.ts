import '../yp-behaviors/yp-lodash-behavior.js';
import '../yp-app-globals/yp-app-globals.js';
import '../yp-app-globals/yp-app-user.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypTranslatedPagesBehavior } from '../yp-behaviors/yp-translated-pages-behavior.js';
import { ypAppSwipeBehavior } from './yp-app-swipe-behavior.js';

import '../ac-notifications/ac-notification-list.js';
import './yp-app-nav-drawer.js';
import '../yp-dialog-container/yp-dialog-container.js';
import '../yp-user/yp-user-image.js';
import '../yp-app-globals/yp-sw-update-toast.js';

import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
//import i18next from 'i18next/dist/es/i18next.js'
//import { XHR } from 'i18next-xhr-backend/dist/es';
//import moment from 'moment-es6';
import { customElement, property, internalProperty, css, html } from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined';

import i18next, { t as translate } from 'i18next'
import backend from 'i18next-xhr-backend'
import { format, formatDistance } from 'date-fns';

import { YpBaseElement} from '../@yrpri/yp-base-element.js';
import { YpAppStyles } from './YpAppStyles.js';
import { YpAppGlobals } from './YpAppGlobals.js'

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

declare global {
  interface Window { appGlobals: YpAppGlobals; appUser: object }
}

@customElement('yp-app')
export class YpApp extends YpBaseElement {

  @property({type: Object})
  homeLink = null

  @property({type: String})
  page: string|null = null

  @property({type: Object})
  user = null

  @property({type: String})
  backPath: string|null = null

  @property({type: Boolean})
  showSearch = false

  @property({type: Boolean})
  showBack = false

  @property({type: String})
  forwardToPostId: string|null = null

  @property({type: String})
  headerTitle: string|null = null

  @property({type: String})
  numberOfUnViewedNotifications: string|null = null

  @property({type: Boolean})
  hideHelpIcon = false

  @property({type: Boolean})
  autoTranslate = false

  @property({type: String})
  languageName: string|null = null

  @property({type: Number})
  goForwardToPostId: number|null = null

  @property({type: Boolean})
  showBackToPost = false

  @property({type: String})
  goForwardPostName: string|null = null

  @property({type: Array})
  pages: Array<YpHelpPage> = []

  @property({type: String})
  headerDescription: string|null = null

  @property({type: String})
  notifyDialogHeading: string|null = null

  @property({type: String})
  notifyDialogText: string|null = null

  anchor: HTMLElement|null = null;

  previousSearches: Array<string> = []

  storedBackPath: string|null = null

  storedLastDocumentTitle: string|null = null

  keepOpenForPost: string|null = null

  useHardBack = false

  _scrollPositionMap = {}

  goBackToPostId: number|null = null

  currentPostId: number|null = null

  goForwardCount = 0

  communityBackOverride: Record<string, Record<string,string>>|null = null

  static get styles() {
    return [
      super.styles,
      YpAppStyles
    ];
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
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
            <div .hide="${this.closePostHeader}" ?hidden="${this.goForwardToPostId!=null}" id="headerTitle" title="" class="layout vertical navContainer">${this.headerTitle}</div>

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
                <paper-item data-args="${this.index}" @tap="${this._openPageFromMenu}">${this._getLocalizePageTitle(this.page)}</paper-item>
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

        <iron-pages selected="${ifDefined(this.page===null ? undefined : this.page)}" style="height:auto;" attrForSelected="name" fullbleed="">
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

    <paper-dialog id="dialog">
      <div class="dialogText">${this.notifyDialogText}</div>
      <div class="buttons">
        <mwc-button dialog-confirm autofocus @tap="${this._resetNotifyDialogText}" .label="OK"></mwc-button>
      </div>
    </paper-dialog>


` : html``}
`
  }

/*
  behaviors: [
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
    'yp-open-notify-dialog': '_openNotifyDialog',
    'yp-open-page': '_openPageFromEvent',
    'yp-open-login': '_login',
    'yp-reset-keep-open-for-page': '_resetKeepOpenForPage',
    'yp-add-back-community-override': '_addBackCommunityOverride'
  },
*/

  _openNotifyDialog(event: CustomEvent) {
    this.notifyDialogText = event.detail;
    this.$$("#dialog")!.open();
  }

  _resetNotifyDialogText() {
    this.notifyDialogText=null;
  }

  // Translated Pages
  translatedPages(pages: Array<YpHelpPage>) {
    if (pages) {
      return JSON.parse(JSON.stringify(pages));
    } else {
      return [];
    }
  }

  openPageFromId(pageId: number) {
    if (this.pages) {
      this.pages.forEach((page) => {
        if (page.id==pageId) {
          this._openPage(page)
        }
      });
    } else {
      console.warn("Trying to open a page when not loaded");
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
    this.getDialogAsync("pageDialog", function (dialog) {
      let pageLocale = 'en';
      if (page.title[window.appGlobals.locale]) {
        pageLocale = window.appGlobals.locale;
      }
      dialog.open(page.title[pageLocale], page.content[pageLocale]);
    }.bind(this));
  }

  _getLocalizePageTitle(page: YpHelpPage) {
    let pageLocale = 'en';
    if (page.title[window.appGlobals.locale]) {
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
      backName: detail.backName
    };
  }

  _goToNextPost() {
    if (this.currentPostId) {
      this.goBackToPostId=this.currentPostId;
    } else {
      console.error("No currentPostId on next");
    }

    if (this.goForwardToPostId) {
      this.goToPost(this.goForwardToPostId, null, null, null, true);
      window.appGlobals.activity('recommendations', 'goForward', this.goForwardToPostId);
      this.goForwardCount += 1;
      this.showBackToPost=true;
    } else {
      console.error("No goForwardToPostId");
    }
  }

  _goToPreviousPost() {
    if (this.goForwardCount>0) {
      window.history.back();
      window.appGlobals.activity('recommendations', 'goBack');
    } else {
      this.showBackToPost=false;
    }
    this.goForwardCount -= 1;
  }

  _setNextPost(event: CustomEvent) {
    const detail = event.detail;
    if (detail.goForwardToPostId) {
      this.goForwardToPostId=detail.goForwardToPostId;
      this.goForwardPostName=detail.goForwardPostName;
    } else {
      this._clearNextPost();
    }
    this.currentPostId=detail.currentPostId;
  }

  _clearNextPost() {
    this.goForwardToPostId=null;
    this.goForwardPostName=null;
    this.goForwardCount=0;
    this.showBackToPost=false;
  }

  _setupSamlCallback() {
    console.log("Have created event listener for samlLogin");

    window.addEventListener("message",(e) => {
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
      const localeByTld: Record<string,string> = {
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

    let localeFromUrl;

    if (window.appGlobals.originalQueryParameters &&
        window.appGlobals.originalQueryParameters["locale"]) {
      localeFromUrl = window.appGlobals.originalQueryParameters["locale"];
    }

    if (window.appGlobals.originalQueryParameters &&
      window.appGlobals.originalQueryParameters["startAutoTranslate"]) {
      setTimeout(() => {
        this._startTranslation();
      }, 2500);
    }

    if (localeFromUrl && (localeFromUrl.length>1)) {
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
      window.appGlobals.locale = defaultLocale;
      window.appGlobals.i18nTranslation = i18next;
      window.appGlobals.haveLoadedLanguages = true;
//      moment.locale([defaultLocale, 'en']);

      console.log("Changed language to "+defaultLocale);

      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          detail: { name: 'yp-language', data: { type: 'language-loaded', language: defaultLocale }  }
        })
      );
    }.bind(this));
  }

  _openPageFromEvent(event: CustomEvent) {
    if (detail.pageId) {
      this.openPageFromId(event.detail.pageId);
    }
  }

  _startTranslation() {
    window.appGlobals.autoTranslate = true;
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        detail: { name: 'yp-auto-translate', data: true }
      })
    );

    if (this.supportedLanguages) {
      this.fire('yp-language-name', this.supportedLanguages[this.language]);
    }

    this.getDialogAsync("masterToast", (toast) => {
      toast.text = this.t('autoTranslationStarted');
      toast.show();
    });
  }

  _stopTranslation() {
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        detail: { name: 'yp-auto-translate', data: false }
      })
    );
    window.appGlobals.autoTranslate = false;
    this.getDialogAsync("masterToast", (toast) => {
      toast.text = this.t('autoTranslationStopped');
      toast.show();
    });
    sessionStorage.setItem("dontPromptForAutoTranslation", "1");
  }

  _setLanguageName(event: CustomEvent) {
    this.languageName=event.detail;
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate=event.detail;
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
    setTimeout(() => {
      this.$$("#drawer").close();
    }, 100);
  }

  _setNumberOfUnViewedNotifications(event: CustomEvent) {
    if (event.detail.count) {
      if (event.detail.count<10) {
        this.numberOfUnViewedNotifications=event.detail.count;
      } else {
        this.numberOfUnViewedNotifications='9+';
      }
    } else {
      this.numberOfUnViewedNotifications='';
    }
    //TODO: This is not needed
    setTimeout(() => {
      this.$$("#notificationBadge")?.fire("iron-resize");
    });
  }

  _redirectTo(event: CustomEvent) {
    if (event.detail.path) {
      this.route.path=event.detail.path;
    }
  }

  _routeChanged(route) {
    // Support older pre version 6.1 links
    if (window.location.href.indexOf("/#!/") > -1) {
      window.location.href = window.location.href.replace("/#!/", "/");
    }

    setTimeout(() => {
      if (route.path.indexOf('domain') > -1) {
        this.domainSubRoute=this.subRoute;
        if (this.$$("#domainPage") && typeof this.$$("#domainPage").refresh !== "undefined") {
          this.$$("#domainPage").refresh();
        }
      } else if (route.path.indexOf('community_folder') > -1) {
        this.communityFolderSubRoute=this.subRoute;
        if (this.$$("#communityFolderPage") && typeof this.$$("#communityFolderPage").refresh !== "undefined") {
          this.$$("#communityFolderPage").refresh();
        }
      } else if (route.path.indexOf('community') > -1) {
        this.communitySubRoute=this.subRoute;
        if (this.$$("#communityPage") && typeof this.$$("#communityPage").refresh !== "undefined") {
          this.$$("#communityPage").refresh();
        }
      } else if (route.path.indexOf('group') > -1) {
        this.groupSubRoute=this.subRoute;
        if (this.$$("#groupPage") && typeof this.$$("#groupPage").refresh !== "undefined") {
          this.$$("#groupPage").refresh();
        }
      } else if (route.path.indexOf('post') > -1) {
        this.postSubRoute=this.subRoute;
        if (this.$$("#postPage") && typeof this.$$("#postPage").refresh !== "undefined") {
          this.$$("#postPage").refresh();
        }
      } else if (route.path.indexOf('user') > -1) {
        this.userSubRoute=this.subRoute;
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
          window.history.pushState({}, "", "/");
          window.dispatchEvent(new CustomEvent('location-changed'));
        }
      } else {

        const map: Record<string,number> = this._scrollPositionMap;

        if (oldPageData != null && oldPageData.page != null) {
          map[oldPageData.page] = window.pageYOffset;
          console.info("Saving scroll position for "+oldPageData.page+" to "+window.pageYOffset);
        }

        let delayUntilScrollToPost = 0;

        if (this.wide) {
          delayUntilScrollToPost = 2;
        }

        setTimeout(() => {
          let skipMasterScroll = false;

          if (oldPageData && oldPageData.page && pageData) {
            // Post -> Group
            if (oldPageData.page==="post" && pageData.page==="group") {
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
            else if ((oldPageData.page==="group" || oldPageData.page==="post") && pageData.page==="community") {
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
            else if ((oldPageData.page==="community_folder" || oldPageData.page==="community" || oldPageData.page==="post") && pageData.page==="domain") {
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
            else if ((oldPageData.page==="community" || oldPageData.page==="community_folder") &&
                 pageData.page==="community_folder") {
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
            setTimeout(() => {
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

  openResetPasswordDialog(resetPasswordToken: string) {
    this.getDialogAsync("resetPassword", (dialog) => {
      dialog.open(resetPasswordToken);
    });
  }

  openUserNotificationsDialog() {
    if (window.appUser && window.appUser.loggedIn()===true) {
      window.appUser.openNotificationSettings();
    } else {
      window.appUser.loginForNotificationSettings();
    }
  }

  openAcceptInvitationDialog(inviteToken: string) {
    this.getDialogAsync("acceptInvite", (dialog) => {
      dialog.open(inviteToken);
    });
  }

  _showPage404() {
    this.page = 'view-404';
  }

  _setHomeLink(event: CustomEvent) {
    if (!this.homeLink) {
      this.homeLink=event.detail;
    }
  }

  setKeepOpenForPostsOn(goBackToPage: string) {
    this.keepOpenForPost = goBackToPage;
    this.storedBackPath=this.backPath;
    this.storedLastDocumentTitle=document.title;
  }

  _resetKeepOpenForPage() {
    this.keepOpenForPost=null;
    this.storedBackPath=null;
    this.storedLastDocumentTitle=null;
  }

  _closePost() {
    if (this.keepOpenForPost)
      this.redirectTo(this.keepOpenForPost);

    if (this.storedBackPath)
      this.backPath=this.storedBackPath;

    if (this.storedLastDocumentTitle) {
      document.title = this.storedLastDocumentTitle;
      this.storedLastDocumentTitle=null;
    }

    this.keepOpenForPost=null;
    document.dispatchEvent(new CustomEvent("lite-signal", {bubbles: true, detail: { name: 'yp-pause-media-playback',data:{}}}));
  }

  // Computed

  get closePostHeader() {
    if (this.page=="post" && this.keepOpenForPost)
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
    this.$$("#navDrawer")?.toggle();
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
    this.$$("#dialogContainer")!.getDialogAsync(idName, callback);
  }

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

  closeDialog(idName) {
    this.$$("#dialogContainer")!.closeDialog(idName);
  }

  _dialogClosed(event, detail) {
    this.$$("#dialogContainer")!.dialogClosed(detail);
  }

  scrollPageToTop() {
    const mainArea = document.getElementById('#mainArea');
    if (mainArea) {
      mainArea.scroller.scrollTop = 0;
    }
  }

  _toggleUserDrawer() {
    this.$$("#drawer")!.toggle();
  }

  _login() {
    if (window.appUser) {
      window.appUser.openUserlogin();
    }
  }

  onChangeHeader(event: CustomEvent) {
    const header = event.detail;
    this.headerTitle=document.title = header.headerTitle;

    setTimeout(() => {
      const headerTitle = this.$$("#headerTitle") as HTMLElement;
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
    this.headerDescription=header.headerDescription;

    //if (header.headerIcon)
    //app.headerIcon = header.headerIcon;
    if (header.enableSearch)
      this.showSearch = true;
    else
      this.showSearch = false;

    if (header.useHardBack===true) {
      this.useHardBack = true;
    } else {
      this.useHardBack = false;
    }

    if (header.backPath) {
      this.showBack=true;
      this.backPath=header.backPath;
    } else {
      this.showBack=false;
      this.backPath=null;
    }


    if (header.hideHelpIcon) {
      this.hideHelpIcon=true;
    } else {
      this.hideHelpIcon=false;
    }

    if (this.communityBackOverride && this.backPath && window.location.pathname.indexOf("/community/") > -1) {
      const communityId =  window.location.pathname.split("/community/")[1];
      if (communityId && !isNaN(communityId) && this.communityBackOverride[communityId]) {
        this.backPath=this.communityBackOverride[communityId].backPath;
        this.headerTitle=this.communityBackOverride[communityId].backName;
        this.useHardBack=false;
      }
    }

    if (this.showBack && header.disableDomainUpLink===true) {
      this.showBack=false;
      this.headerTitle='';
    }
  }

  goBack(event, detail) {
    if (this.backPath) {
      if (this.useHardBack) {
        document.dispatchEvent(new CustomEvent("lite-signal", {bubbles: true, composed: true, detail: { name: 'yp-pause-media-playback',data:{}}}));
        window.location.href = this.backPath;
      } else {
        this.redirectTo(this.backPath);
      }
    }
  }

  _onSearch(e: CustomEvent) {
    this.toggleSearch();
    this.previousSearches.unshift(e.detail.value);
    const postsFilter = document.querySelector('#postsFilter');
    if (postsFilter) {
      postsFilter.searchFor(e.detail.value);
    }
  }

  onUserChanged(event: CustomEvent) {
    if (event.detail && event.detail.id) {
      this.user = event.detail;
    } else {
      this.user = null;
    }
  }

  toggleSearch() {
    this.$$("#search")?.toggle();
  }
}

