import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-pages/iron-pages.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-badge/paper-badge.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '../../../../@polymer/app-layout/app-drawer/app-drawer.js';
import '../../../../@polymer/app-layout/app-header-layout/app-header-layout.js';
import '../../../../@polymer/app-layout/app-header/app-header.js';
import '../../../../@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '../../../../@polymer/app-layout/app-toolbar/app-toolbar.js';
import '../../../../@polymer/app-route/app-location.js';
import '../../../../@polymer/app-route/app-route.js';
import '../yp-behaviors/yp-lodash-behavior.js';
import '../yp-behaviors/yp-moment-behavior.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-app-globals/yp-app-globals.js';
import '../yp-app-globals/yp-app-user.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../ac-notifications/ac-notification-list.js';
import './yp-app-nav-drawer.js';
import '../yp-dialog-container/yp-dialog-container.js';
import '../yp-user/yp-user-image.js';
import '../yp-app-globals/yp-sw-update-toast.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
import { scroll } from '../../../../@polymer/app-layout/helpers/helpers.js';
import { setPassiveTouchGestures } from '../../../../@polymer/polymer/lib/utils/settings.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
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

      .closePostIcon {
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
        margin-left: 4px;
        padding: 6px;
        min-width: 0 !important;
      }

      .stopIcon {
        margin-left: 6px;
      }

      @media (max-width: 480px) {
        .stopIcon {
          display: none;
        }

        #translationButton {
          width: 40px !important;
          max-width: 40px !important;
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

        .closePostIcon {
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

        paper-button {
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
    </style>

    <iron-media-query query="(min-width: 600px)" query-matches="{{wide}}"></iron-media-query>

    <yp-app-globals id="appGlobals" setup-defaults="" on-change-header="onChangeHeader"></yp-app-globals>

    <app-drawer-layout drawer-width="360px" responsive-width="16000px" fullbleed="">

      <app-drawer id="drawer" slot="drawer" align="end" position="right" opened="{{userDrawerOpened}}" swipe-open="">
        <div style="height: 100%; overflow: auto;">
          <ac-notification-list id="acNotificationsList" user="[[user]]" opened="[[userDrawerOpened]]" route="[[route]]"></ac-notification-list>
        </div>
      </app-drawer>

      <app-drawer id="navDrawer" slot="drawer" align="start" position="left" swipe-open="" opened="{{navDrawOpened}}">
        <div style="height: 100%; overflow: auto;">
          <yp-app-nav-drawer id="ypNavDrawer" home-link="[[homeLink]]" on-yp-toggle-nav-drawer="_toggleNavDrawer" user="[[user]]" route="[[route]]"></yp-app-nav-drawer>
        </div>
      </app-drawer>

      <app-header-layout id="mainArea" fullbleed="">

        <app-header slot="header" id="appHeader" effects="waterfall" reveals="" class="main-header">
          <app-toolbar>
            <div hide\$="[[closePostHeader]]" class="layout horizontal navContainer">
              <paper-icon-button id="paperToggleNavMenu" icon="menu" on-tap="_toggleNavDrawer"></paper-icon-button>
              <div class="layout horizontal" style="height: 100%; vertical-align: center;">
                <div id="headerTitle" title="" class="layout vertical">[[headerTitle]]</div>
                <paper-icon-button icon="arrow-upward" on-tap="goBack" class="backIcon" hide\$="[[!showBack]]"></paper-icon-button>
              </div>
            </div>
            <template is="dom-if" if="[[closePostHeader]]">
              <paper-icon-button id="closePostButton" class="closePostIcon" icon="arrow-back" on-tap="_closePost"></paper-icon-button>
            </template>

            <div hidden\$="[[!autoTranslate]]" class="layout horizontal">
              <paper-button raised="" id="translationButton" on-tap="_stopTranslation" title="{{t('stopAutoTranslate')}}">
                <iron-icon icon="translate"></iron-icon>
                <iron-icon class="stopIcon" icon="do-not-disturb"></iron-icon>
              </paper-button>
            </div>
            <span class="flex"></span>

            <paper-menu-button horizontal-align="right" hide\$="[[hideHelpIcon]]" class="helpButton">
              <paper-icon-button icon="help-outline" slot="dropdown-trigger"></paper-icon-button>

              <paper-listbox slot="dropdown-content">
                <template is="dom-repeat" items="[[translatedPages]]" as="page">
                  <paper-item data-args\$="[[index]]" on-tap="_openPageFromMenu">[[_getLocalizePageTitle(page)]]</paper-item>
                </template>
              </paper-listbox>
            </paper-menu-button>

            <template is="dom-if" if="[[user]]">
              <div class="userImageNotificationContainer layout horizontal" on-tap="_toggleUserDrawer">
                <yp-user-image id="userImage" small="" user="[[user]]"></yp-user-image>
                <paper-badge class="activeBadge" label="[[numberOfUnViewedNotifications]]" hidden\$="[[!numberOfUnViewedNotifications]]"></paper-badge>
              </div>
            </template>

            <template is="dom-if" if="[[!user]]">
              <paper-button class="loginButton" on-tap="_login">[[t('user.login')]]</paper-button>
            </template>
          </app-toolbar>
        </app-header>

        <iron-pages selected="{{page}}" style="height:auto;" attr-for-selected="name" fullbleed="">
          <yp-domain id="domainPage" name="domain" id-route\$="[[domainSubRoute]]" on-change-header="onChangeHeader"></yp-domain>
          <yp-community id="communityPage" name="community" id-route\$="[[communitySubRoute]]" on-change-header="onChangeHeader"></yp-community>
          <yp-group id="groupPage" name="group" id-route\$="[[groupSubRoute]]" on-change-header="onChangeHeader"></yp-group>
          <yp-post id="postPage" name="post" id-route\$="[[postSubRoute]]" on-change-header="onChangeHeader"></yp-post>
          <yp-user id="userPage" name="user" id-route\$="[[userSubRoute]]" on-change-header="onChangeHeader"></yp-user>
          <yp-view-404 name="view-404"></yp-view-404>
        </iron-pages>

      </app-header-layout>
    </app-drawer-layout>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-auto-translate="_autoTranslateEvent"></lite-signal>

    <app-location route="{{route}}"></app-location>

    <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subRoute}}"></app-route>

    <yp-dialog-container id="dialogContainer"></yp-dialog-container>
    <yp-app-user id="appUser" on-user-changed="onUserChanged"></yp-app-user>
    <yp-sw-update-toast button-label="[[t('reload')]]" message="[[t('newVersionAvailable')]]"></yp-sw-update-toast>
`,

  is: 'yp-app',

  behaviors: [
    ypLanguageBehavior,
    ypThemeBehavior,
    ypGotoBehavior
  ],

  properties: {

    domainSubRoute: Object,
    communitySubRoute: Object,
    groupSubRoute: Object,
    postSubRoute: Object,
    userSubRoute: Object,

    userDrawerOpened: Boolean,
    navDrawOpened: Boolean,

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
      observer: '_routePageChanged'
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

    storedBackPath: String,

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

    pages: {
      type: Array
    },

    translatedPages: {
      type: Array,
      computed: '_translatedPages(pages, language)'
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
      value: ""
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

    languageName: String
  },

  listeners: {
    'yp-set-pages': '_setPages',
    'yp-set-home-link': '_setHomeLink',
    'yp-redirect-to': '_redirectTo',
    'yp-set-number-of-un-viewed-notifications': '_setNumberOfUnViewedNotifications',
    'yp-close-right-drawer': '_closeRightDrawer',
    'yp-refresh-group': '_refreshGroup',
    'yp-refresh-community': '_refreshCommunity',
    'yp-refresh-domain': '_refreshDomain',
    'yp-language-name': '_setLanguageName',
    'yp-dialog-closed': '_dialogClosed'
  },

  _stopTranslation: function () {
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
  },

  _setLanguageName: function (event, detail) {
    this.set('languageName', detail);
  },

  _autoTranslateEvent(event, detail) {
    this.set('autoTranslate', detail);
  },

  _refreshGroup: function () {
    this._refreshByName("#groupPage");
  },

  _refreshCommunity: function () {
    this._refreshByName("#communityPage");
  },

  _refreshDomain: function () {
    this._refreshByName("#domainPage");
  },

  _refreshByName: function(id) {
    var el = this.$$(id);
    if (el) {
      el._refreshAjax();
    }
  },

  _closeRightDrawer: function () {
    this.async(function () {
      this.$$("#drawer").close();
    }, 100);
  },

  _translatedPages: function (pages, language) {
    if (pages) {
      return JSON.parse(JSON.stringify(pages));
    } else {
      return [];
    }
  },

  _setNumberOfUnViewedNotifications: function (event, detail) {
    if (detail.count) {
      if (detail.count<10) {
        this.set('numberOfUnViewedNotifications', detail.count);
      } else {
        this.set('numberOfUnViewedNotifications', '9+');
      }
    } else {
      this.set('numberOfUnViewedNotifications', '');
    }
  },

  _redirectTo: function (event, detail) {
    if (detail.path) {
      this.set('route.path', detail.path);
    }
  },

  _routeChanged: function (route) {
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
  },

  _routePageChanged: function(pageData, oldPageData) {
    var params = this.route.path.split('/');

    if (this.route.path.indexOf('/user/reset_password') > -1 ||
      this.route.path.indexOf('/user/open_notification_settings') > -1 ||
      this.route.path.indexOf('/user/accept/invite') > -1 ||
      this.route.path.indexOf('/user/info_page') > -1) {

      if (this.route.path.indexOf('/user/reset_password') > -1) {
        this.openResetPasswordDialog(params[params.length-1]);
      } else if (this.route.path.indexOf('/user/accept/invite') > -1) {
        this.openAcceptInvitationDialog(params[params.length-1]);
      } else if (this.route.path.indexOf('/user/open_notification_settings') > -1) {
        this.openUserNotificationsDialog();
      } else if (this.route.path.indexOf('/user/info_page') > -1) {
        this.openUserInfoPage(params[params.length-1]);
        window.history.pushState({}, null, "/");
        window.dispatchEvent(new CustomEvent('location-changed'));
      }
    } else {

      var map = this._scrollPositionMap;

      if (oldPageData != null && oldPageData.page != null) {
        map[oldPageData.page] = window.pageYOffset;
      }

      this.page = pageData.page;

      if (map[pageData.page] != null) {
        scroll({ top: map[pageData.page], behavior: 'silent' });
      } else if (this.isAttached) {
        scroll({ top: 0, behavior: 'silent' });
      }
    }
  },

  _pageChanged: function(page, oldPage) {
    console.log("Page changed to "+page);
    if (page) {
      var resolvedPageUrl;
      if (page=="view-404") {
        resolvedPageUrl = this.resolveUrl("yp-view-404.html");
      } else {
        resolvedPageUrl = this.resolveUrl('../yp-' + page + '/' + 'yp-' + page + ".html?v=@version@");
      }
      console.log("Trying to load "+resolvedPageUrl);
      this.importHref(resolvedPageUrl, null, this._showPage404, true);
    }

    if (page) {
      window.appGlobals.sendToAnalyticsTrackers('send', 'pageview', location.pathname);
    }
  },

  openResetPasswordDialog: function (resetPasswordToken) {
    this.getDialogAsync("resetPassword", function (dialog) {
      dialog.open(resetPasswordToken);
    }.bind(this));
  },

  openUserNotificationsDialog: function () {
    if (window.appUser && window.appUser.loggedIn()===true) {
      window.appUser.openNotificationSettings();
    } else {
      window.appUser.loginForNotificationSettings();
    }
  },

  openUserInfoPage: function (pageId) {
    if (this.pages && this.pages.length>0) {
      this._openPage(this.pages[pageId]);
    } else {
      this.async(function () {
        this._openPage(this.pages[pageId]);
      }, 1000);
    }
  },

  openAcceptInvitationDialog: function (inviteToken) {
    this.getDialogAsync("acceptInvite", function (dialog) {
      dialog.open(inviteToken);
    }.bind(this));
  },

  _showPage404: function() {
    this.page = 'view-404';
  },

  _setHomeLink: function (event, homeLink) {
    if (!this.homeLink) {
      this.set('homeLink', homeLink);
    }
  },

  setKeepOpenForPostsOn: function (goBackToPage) {
    this.set('keepOpenForPost', goBackToPage);
    this.set('storedBackPath', this.backPath);
    this.set('storedLastDocumentTitle', document.title);
  },

  _closePost: function () {
    if (this.keepOpenForPost)
      this.redirectTo(this.keepOpenForPost);

    if (this.storedBackPath)
      this.set('backPath', this.storedBackPath);

    if (this.storedLastDocumentTitle) {
      document.title = this.storedLastDocumentTitle;
      this.set('storedLastDocumentTitle', null);
    }

    this.set('this.keepOpenForPost', null);
  },

  _closePostHeader: function (page, keepOpenForPost) {
    if (page=="post" && keepOpenForPost)
      return true;
    else
      return false;
  },

  _isGroupOpen: function (params, keepOpenForPost) {
    if (params.groupId || (params.postId && keepOpenForPost))
      return true;
    else
      return false;
  },

  _isCommunityOpen: function (params, keepOpenForPost) {
    if (params.communityId || (params.postId && keepOpenForPost))
      return true;
    else
      return false;
  },

  _isDomainOpen: function (params, keepOpenForPost) {
    if (params.domainId || (params.postId && keepOpenForPost))
      return true;
    else
      return false;
  },

  _toggleNavDrawer: function () {
    this.$$("#navDrawer").toggle();
  },

  _setPages: function (event, pages) {
    this.set('pages', pages);
  },

  _openPageFromMenu: function (event) {
    var index = JSON.parse(event.currentTarget.getAttribute('data-args'));
    var page = this.pages[index];
    this._openPage(page);
    this.$$("paper-listbox").select(null);
  },

  _openPage: function (page) {
    window.appGlobals.activity('open', 'pages', page.id);
    this.getDialogAsync("pageDialog", function (dialog) {
      var pageLocale = 'en';
      if (page.title[window.locale]) {
        pageLocale = window.locale;
      }
      dialog.open(page.title[pageLocale], page.content[pageLocale]);
    }.bind(this));
  },

  _getLocalizePageTitle: function (page) {
    var pageLocale = 'en';
    if (page.title[window.locale]) {
      pageLocale = window.locale;
    }
    return page.title[pageLocale];
  },

  ready: function () {
    setPassiveTouchGestures(true);
    window.app = this;
    this.setTheme(16);
  },

  getDialogAsync: function (idName, callback) {
    this.$$("#dialogContainer").getDialogAsync(idName, callback);
  },

  closeDialog: function (idName) {
    this.$$("#dialogContainer").closeDialog(idName);
  },

  _dialogClosed: function (event, detail) {
    this.$$("#dialogContainer").dialogClosed(detail);
  },

  scrollPageToTop: function() {
    var mainArea = document.getElementById('#mainArea');
    if (mainArea) {
      mainArea.scroller.scrollTop = 0;
    }
  },

  _toggleUserDrawer: function () {
    this.$$("#drawer").toggle();
  },

  _login: function () {
    if (window.appUser) {
      window.appUser.openUserlogin();
    }
  },

  onChangeHeader: function (event, header) {
    this.set('headerTitle', document.title = header.headerTitle);

    this.async(function () {
      var headerTitle = this.$$("#headerTitle");
      if (headerTitle) {
        var length = headerTitle.innerHTML.length;
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

    if (header.hideHelpIcon) {
      this.set('hideHelpIcon', true);
    } else {
      this.set('hideHelpIcon', false);
    }

    if (this.showBack && header.disableDomainUpLink===true) {
      this.set('showBack', false);
      this.set('headerTitle', '');
    }
  },

  goBack: function (event, detail) {
    if (this.backPath) {
      if (this.useHardBack) {
        window.location = this.backPath;
      } else {
        this.redirectTo(this.backPath);
      }
    }
  },

  _onSearch: function (e) {
    this.toggleSearch();
    this.unshift('previousSearches', e.detail.value);
    var postsFilter = document.querySelector('#postsFilter');
    if (postsFilter) {
      postsFilter.searchFor(e.detail.value);
    }
  },

  onUserChanged: function (event, detail) {
    if (detail && detail.id) {
      this.set('user', detail);
    } else {
      this.set('user', null);
    }
  },

  toggleSearch: function () {
    this.$$("#search").toggle();
  },

  __equal: function (a, b) {
    return a === b;
  }
});
