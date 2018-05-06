import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-ajax/iron-ajax.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-session/yp-session.js';
import '../yp-ajax/yp-ajax.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
    </style>

    <yp-session id="session"></yp-session>

    <yp-ajax id="boot" url="/api/domains" on-response="_bootResponse"></yp-ajax>
    <lite-signal on-lite-signal-logged-in="_userLoggedIn"></lite-signal>
`,

  is: 'yp-app-globals',

  behaviors: [
    ypLanguageBehavior,
    ypGotoBehavior
  ],

  properties: {
    dialogHeading: {
      type: String,
      value: ''
    },

    seenWelcome: {
      type: Boolean,
      value: false,
      notify: true
    },

    activityHost: {
      type: String,
      value: ""
    },

    resetSeenWelcome: {
      type: Boolean,
      value: false
    },

    disableWelcome: {
      type: Boolean,
      value: true
    },

    setupDefaults: {
      type: Boolean,
      value: false
    },

    domain: {
      type: Object,
      value: null,
      observer: '_domainChanged'
    },

    minSplashMs: {
      type: Number,
      value: 1500
    },

    requestInProgress: {
     type: Boolean,
     value: false
    },

    groupConfigOverrides: {
      type: Object,
      value: {}
    },

    currentAnonymousUser: {
      type: Object,
      value: null
    },

    currentAnonymousGroup: {
      type: Object,
      value: null
    },

    pixelTrackerId: {
      type: String,
      value: null
    },

    communityTrackerId: {
      type: String,
      value: null
    },

    communityTrackerIds: {
      type: Object,
      value: {}
    },

    disableFacebookLoginForGroup: {
      type: Boolean,
      value: false
    },

    originalQueryParameters: Object,

    autoTranslateCache: Object,

    externalGoalTriggerUrl: String,

    externalGoalCounter: {
      type: Number,
      value: 0
    },

    goalEvents: {
      type: Array,
      value: ['newPost','endorse_up','endorse_down','newPointFor','newPointAgainst']
    }
  },

  changeLocaleIfNeededAfterWait: function (locale, force) {
    console.log("changeLocaleIfNeeded "+locale);
    if (locale && this.language!=locale) {
      if (force || !localStorage.getItem('yp-user-locale')) {
        i18next.changeLanguage(locale, function(loaded) {
          if (!window.i18nTranslation) {
            window.i18nTranslation = i18next;
          }
          console.log("i18n init loaded "+loaded);
          moment.locale(locale);
          console.log("Changed language to "+locale);
          document.dispatchEvent(
            new CustomEvent("lite-signal", {
              bubbles: true,
              compose: true,
              detail: { name: 'yp-language', data: { type: 'language-loaded', language: locale}  }
            })
          );

        });
      }
    }
  },

  changeLocaleIfNeeded: function (locale, force) {
    if (typeof i18next !== 'undefined') {
      this.changeLocaleIfNeededAfterWait(locale, force)
    } else {
      this.async(function () {
        this.changeLocaleIfNeededAfterWait(locale, force)
      }, 1000);
    }
  },

  parseQueryString: function () {
    var query = (window.location.search || '?').substr(1),
      map   = {};
    query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
      map[key] = value;
    });
    this.originalQueryParameters = map;
  },

  setAnonymousUser: function (user) {
    this.set('currentAnonymousUser', user);
    console.debug("Set anon user "+user);
  },

  setAnonymousGroupStatus: function (group) {
    if (group && group.configuration && group.configuration.allowAnonymousUsers) {
      this.set('currentAnonymousGroup', group);
      console.debug("Have set anonymous group id: "+group.id);
      if (!window.appUser.user && this.currentAnonymousUser) {
        console.debug("Setting anon user from cache");
        window.appUser.setLoggedInUser(this.currentAnonymousUser);
      } else if (window.appUser &&!window.appUser.user && group.configuration.allowAnonymousAutoLogin &&
                 this.originalQueryParameters && this.originalQueryParameters.autoLogin) {
        window.appUser.autoAnonymousLogin();
      }
    } else {
      if (window.appUser && window.appUser.user && window.appUser.user.profile_data && window.appUser.user.profile_data.isAnonymousUser) {
        window.appUser.removeAnonymousUser();
        console.debug("Logout anon user");
      }
      console.debug("Set anon group to null");
      this.set('currentAnonymousGroup', null);
    }
  },

  _domainChanged: function (domain) {
    if (domain) {
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'yp-domain-changed', data: { domain: domain } }
        })
      );
    }
  },

  notifyUserViaToast: function (text) {
    dom(document).querySelector('yp-app').getDialogAsync("masterToast", function (toast) {
      toast.text = text;
      toast.show();
    }.bind(this));
  },

  reBoot: function() {
    if (!this.requestInProgress) {
      this.$.boot.generateRequest();
    }
  },

  _removeSplashNode: function (splash) {
    console.log("Found splash");
    splash.parentNode.removeChild(splash);
    document.body.classList.remove('loading');
  },

  _removeSplash: function () {
    var splash = document.getElementById('splashCore');
    console.log("_removeSplashNode");
    if (splash) {
      this._removeSplashNode(splash);
    } else {
      this.async(function () {
        console.log("_removeSplashNode 2");
        splash = document.getElementById('splashCore');
        if (splash) {
          this._removeSplashNode(splash);
        } else {
          this.async(function () {
            console.log("_removeSplashNode 3");
            splash = document.getElementById('splashCore');
            if (splash) {
              this._removeSplashNode(splash);
            } else {

            }
          }, 1500);
        }
      }, 100);
    }
    console.log("Removing splash");
  },

  setupGoogleAnalytics: function(domain) {
    if (domain.public_api_keys && domain.public_api_keys && domain.public_api_keys.google && domain.public_api_keys.google.analytics_tracking_id) {
      ga('create', domain.public_api_keys.google.analytics_tracking_id, 'auto');
    } else if (domain.google_analytics_code && domain.google_analytics_code!="") {
      ga('create', domain.google_analytics_code, 'auto');
    }
    if (typeof ga == 'function') {
      ga('set', 'anonymizeIp', true);
      ga('send', 'pageview', location.pathname);
      ga('set', 'nonInteraction', true);
      this.async(function () {
        ga('set', 'nonInteraction', false);
      }, 900);
    } else {
      console.error("Can't find Google Analytics object");
    }
  },

  _userLoggedIn: function (event, user) {
    if (user) {
      this.async(function () {
        if (typeof ga == 'function') {
          ga('set', '&uid', user.id);
        }
      }, 250); // Wait a bit to make sure google analytics tracking id has been set up dynamically
    }
  },

  _bootResponse: function (event, detail) {
    this._removeSplash();
    this.set('requestInProgress', false);
    this.set('domain', detail.response.domain);

    this.setupGoogleAnalytics(this.domain);
    if (window.location.pathname=="/") {
      if (detail.response.community) {
        this.redirectTo("/community/"+detail.response.community.id);
      } else {
        this.redirectTo("/domain/" + this.domain.id);
        this.fire("change-header", { headerTitle: this.domain.domain_name,
          headerDescription: this.domain.description});
      }
    }
  },

  setupGroupConfigOverride: function(groupId, configOverride) {
    var configOverrideHash = {};
    configOverride.split(";").forEach(function (configItem) {
      var splitItem = configItem.split("=");
      configOverrideHash[splitItem[0]] = splitItem[1];
    });
    this.groupConfigOverrides[groupId]=configOverrideHash;
    if (configOverrideHash["ln"]) {
      this.changeLocaleIfNeeded(configOverrideHash["ln"], true);
    }
  },

  // Example use http://localhost:4242/group/47/config/hg=1;rn=Your Priorities;ru=https://yrpri.org/
  overrideGroupConfigIfNeeded: function(groupId, configuration) {
    if (!configuration) {
      configuration = {};
    }
    var override = this.groupConfigOverrides[groupId];
    if (!override) {
      return configuration;
    } else {
      if (override["hg"]) {
        configuration["hideGroupHeader"]=Boolean(override["hg"]);
      }
      if (override["ht"]) {
        configuration["hideAllTabs"]=Boolean(override["ht"]);
      }
      if (override["hh"]) {
        configuration["hideHelpIcon"]=Boolean(override["hh"]);
      }
      if (override["rn"]) {
        configuration["fixedReturnUrlName"] = override["rn"];
      }
      if (override["ru"]) {
        configuration["fixedReturnUrl"] = override["ru"];
      }
      return configuration;
    }
  },

  activity: function (type, object, context) {
    var actor;

    if (window.appUser && window.appUser.user) {
      actor = window.appUser.user.id;
    } else {
      actor = "-1";
    }

    var logString = 'activity stream: ' + actor + ' ' + type + ' ' + object;

    console.log(logString);

    if (context)
      logString += ' ' + context;

    if (type=='open') {
      // Wait by sending open so pageview event can be completed before
      this.async(function ()  {
        this.sendToAnalyticsTrackers('send', 'event', object, type);
      }, 25);
    } else {
      this.sendToAnalyticsTrackers('send', 'event', object, type);
    }

    var activityAjax = document.createElement('iron-ajax');
    var date = new Date();
    activityAjax.handleAs = 'json';
    activityAjax.contentType = 'application/x-www-form-urlencoded';
    activityAjax.url = '/api/users/createActivityFromApp';
    activityAjax.method = 'POST';
    activityAjax.body = {
      actor: actor,
      type: type,
      object: object,
      context: context ? context : "",
      path_name: location.pathname,
      event_time: date.toISOString(),
      session_id: this.getSessionFromCookie(),
      user_agent: navigator.userAgent
    };
    activityAjax.generateRequest();

    if (type==='completed' || type==='clicked') {
      this.checkExternalGoalTrigger(object);
    }
  },

  checkExternalGoalTrigger: function (object) {
    if (this.externalGoalTriggerUrl &&
        this.originalQueryParameters &&
        this.originalQueryParameters.goalThreshold &&
        this.goalEvents.indexOf(object) > -1) {
      this.externalGoalCounter += 1;
      if (this.externalGoalCounter==this.originalQueryParameters.goalThreshold) {
        var goalTriggerAjax = document.createElement('iron-ajax');
        goalTriggerAjax.handleAs = 'json';
        goalTriggerAjax.url = this.externalGoalTriggerUrl;
        goalTriggerAjax.params = this.originalQueryParameters;
        goalTriggerAjax.method = 'GET';
        goalTriggerAjax.generateRequest();
      }
    }
  },

  ready: function () {
    window.appStartTime = new Date();
    window.appGlobals = this;
    this.autoTranslateCache = {};

    this.fire('app-ready');
    this.$.boot.generateRequest();
    this.requestInProgress = true;

    window.googleMapsApiKey = null; //'AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0';
    window.instagramAccessToken = '3066250812.cf0499d.4d1d4db0bb8b43b59c057346511161c8';
    window.instagramClientID = 'd2f248ec764d4b208ab668b7561a89cc';

    this.parseQueryString();
  },

  setSeenWelcome: function () {
    this.seenWelcome = true;
    localStorage.setItem('yrpri-welcome-status', true);
  },

  getSessionFromCookie: function () {
    var strCookies = document.cookie;
    var cookiearray = strCookies.split(';');
    var sid = '';
    for (var i = 0; i < cookiearray.length; i++) {
      name = cookiearray[i].split('=')[0];
      var value = cookiearray[i].split('=')[1];
      if (name == ' connect.sid')
        sid = value;
    }
    return sid;
  },

  // Pixel tracking

  facebookPixelTracking: function (event, detailedEvent) {
    if (this.pixelTrackerId && event) {
      var fbEvent;
      if (event==="pageview") {
        fbEvent="PageView"
      } else if (event==="event" && detailedEvent) {
        fbEvent=detailedEvent;
      } else {
        fbEvent=event;
      }
      var image = new Image(1,1);
      image.src = "https://www.facebook.com/tr?id="+this.pixelTrackerId+"&ev="+fbEvent+"&noscript=1";
      console.debug("Have sent to Facebook pixel: "+fbEvent)
    }
  },

  setCommunityPixelTracker: function (trackerId) {
    if (trackerId && trackerId!=='') {
      var oldTrackerId = this.pixelTrackerId;
      this.set('pixelTrackerId', trackerId);
      if (trackerId!==oldTrackerId) {
        this.facebookPixelTracking('pageview');
      }
    } else {
      this.set('pixelTrackerId', null);
    }
  },

  setCommunityAnalyticsTracker: function (trackerId) {
    if (trackerId && trackerId!=='') {
      var oldTrackerId = this.communityTrackerId;
      this.set('communityTrackerId', trackerId);
      if (trackerId!==oldTrackerId) {
        this.sendToAnalyticsTrackers('sendOnlyCommunity', 'pageview', location.pathname);
      }
    } else {
      this.set('communityTrackerId', null);
    }
  },

  sendToAnalyticsTrackers: function (a, b, c, d, e, f) {
    //console.debug("Analytics "+a+" "+b+" "+c+" "+d);
    if (typeof ga == 'function') {
      if (a!='sendOnlyCommunity') {
        ga('send', b, c, d, e, f);
        console.debug("Analytics global: send "+b+" "+c+" "+d);
      }
      if (this.communityTrackerId) {
        var sendName = 'tracker'+this.communityTrackerId.replace(/-/g,'');
        if (!this.communityTrackerIds[this.communityTrackerId]) {
          ga('create', this.communityTrackerId, 'auto', sendName);
          this.communityTrackerIds[this.communityTrackerId] = true;
          console.debug("Created tracker: "+sendName);
        }
        sendName += '.send';
        console.debug("Analytics: "+sendName+": "+b+" "+c+" "+d);
        ga(sendName, b, c, d, e, f);
      }
    } else {
      console.warn("Google analytics message not sent for a:"+a+" b:"+b+" c:"+c+" d:"+d+" e:"+e+" f:"+f);
    }

    if (a!='sendOnlyCommunity') {
      this.facebookPixelTracking(b, c);
    }
  },

  sendLoginAndSignupToAnalytics: function (userId, eventType, authProvider, validationError) {
    if (typeof ga == 'function') {
      if (userId) {
        ga('set', '&uid', userId);
      }

      var fieldsObjects;
      var authProviderText = authProvider;

      switch(eventType) {
        case 'Signup Success':
          fieldsObjects = {
            'dimension1': userId,
            'dimension2': 'Yes',
            'dimension3': authProvider,
            'metric1': '1'
          };
          break;
        case 'Signup Fail':
          fieldsObjects = {
            'dimension3': authProvider,
            'metric2': '1'
          };
          authProviderText += ": "+validationError;
          break;
        case 'Signup Submit':
          fieldsObjects = {
            'dimension3': authProvider,
            'metric3': '1'
          };
          break;
        case 'Login Success':
          fieldsObjects = {
            'dimension1': userId,
            'dimension2': 'Yes',
            'dimension3': authProvider,
            'metric4': '1'
          };
          break;
        case 'Login Fail':
          fieldsObjects = {
            'dimension3': authProvider,
            'metric5': '1'
          };
          authProviderText += ": "+validationError;
          break;
        case 'Login Submit':
          fieldsObjects = {
            'dimension3': authProvider,
            'metric6': '1'
          };
          break;
        case 'Signup/Login Opened':
          fieldsObjects = {
            'metric7': '1'
          };
          break;
      }
      this.sendToAnalyticsTrackers('send','event','Login and Signup', eventType, authProviderText, fieldsObjects);
    }
  },

  computeHeading: function () {
    return this.t('');
  }
});
