/* eslint-disable @typescript-eslint/camelcase */
import i18next from 'i18next';
//TODO: Fix moment
//import moment from 'moment';

import { YpServerApi } from '../@yrpri/YpServerApi.js';
import { YpNavHelpers } from './YpNavHelpers.js';
import { YpCodeBase } from '../@yrpri/YpCodeBase.js';
import { YpRecommendations } from './YpRecommendations.js';
import { YpCache } from './YpCache.js';
import { YpAnalytics } from './YpAnalytics.js';
import { YpThemeManager } from './YpThemeManager.js';

export class YpAppGlobals extends YpCodeBase {
  seenWelcome = false;

  resetSeenWelcome = false;

  disableWelcome = false;

  activityHost = '';

  domain: YpDomain | null = null;

  groupConfigOverrides: Record<number, Record<string, string | boolean>> = {};

  currentAnonymousUser: YpUser | null = null;

  currentGroup: YpGroup | null = null;

  currentAnonymousGroup: YpGroup | null = null;

  currentForceSaml = false;

  disableFacebookLoginForGroup = false;

  currentSamlDeniedMessage: string | null = null;

  currentSamlLoginMessage: string | null = null;

  originalQueryParameters: Record<string, string | number> = {};

  externalGoalTriggerGroupId: number | null = null;

  externalGoalCounter = 0;

  appStartTime: Date;

  autoTranslate = false;

  goalTriggerEvents: Array<string> = [
    'newPost',
    'endorse_up',
    'endorse_down',
    'newPointFor',
    'newPointAgainst',
  ];

  haveLoadedLanguages = false;

  hasTranscriptSupport = false;

  hasVideoUpload = false;

  hasAudioUpload = false;

  // The selected language
  language: string | null = null;

  // Locale seleted from query or loaded
  locale: string | null = null;

  // TODO: Remove any,
  i18nTranslation: any | null = null;

  serverApi: YpServerApi;

  recommendations: YpRecommendations;

  cache: YpCache;

  analytics: YpAnalytics;

  theme: YpThemeManager;

  highlightedLanguages: Array<string>|null = null;

  constructor(serverApi: YpServerApi) {
    super();

    this.appStartTime = new Date();

    this.serverApi = serverApi;
    this.recommendations = new YpRecommendations(serverApi);
    this.cache = new YpCache();
    this.analytics = new YpAnalytics();
    this.theme = new YpThemeManager();

    // Boot
    this.boot();
    this.hasVideoUploadSupport();
    this.hasAudioUploadSupport();

    //TODO: See if this is recieved
    this.fireGlobal('app-ready');
    this.parseQueryString();
    this.addGlobalListener('yp-logged-in', this._userLoggedIn);
  }

  showRecommendationInfoIfNeeded() {
    if (!localStorage.getItem('ypHaveShownRecommendationInfo')) {
      localStorage.setItem('ypHaveShownRecommendationInfo', '1');
      this.fireGlobal('yp-notify-dialog', {
        text: this.t('recommendationToastInfo'),
      });
    }
  }

  showSpeechToTextInfoIfNeeded() {
    if (
      window.appGlobals.hasTranscriptSupport &&
      !localStorage.getItem('haveShownTranscriptInfo')
    ) {
      localStorage.setItem('haveShownTranscriptInfo', '1');
      this.fireGlobal('yp-notify-dialog', { text: this.t('speechToTextInfo') });
    }
  }

  async hasVideoUploadSupport() {
    const response = (await this.serverApi.hasVideoUploadSupport()) as YpHasVideoResponse | void;
    if (response) {
      window.appGlobals.hasVideoUpload = response.hasVideoUploadSupport;
      window.appGlobals.hasTranscriptSupport = response.hasTranscriptSupport;
    }
  }

  sendVideoView(videoId: number) {
    this.serverApi.sendVideoView({ videoId: videoId });
    this.activity('view', 'video', videoId);
  }

  sendLongVideoView(videoId: number) {
    this.serverApi.sendVideoView({ videoId: videoId, longPlaytime: true });
    this.activity('view', 'videoLong', videoId);
  }

  async hasAudioUploadSupport() {
    const response = (await this.serverApi.hasAudioUploadSupport()) as YpHasAudioResponse | void;
    if (response) {
      window.appGlobals.hasAudioUpload = response.hasAudioUploadSupport;
    }
  }

  sendAudioListen(audioId: number) {
    this.serverApi.sendAudioView({ audioId: audioId });
    this.activity('view', 'audio', audioId);
  }

  sendLongAudioListen(audioId: number) {
    this.serverApi.sendAudioView({ audioId: audioId, longPlaytime: true });
    this.activity('view', 'audioLong', audioId);
  }

  changeLocaleIfNeededAfterWait(locale: string, force: boolean) {
    if (
      window.appGlobals.haveLoadedLanguages === true &&
      locale &&
      this.language != locale
    ) {
      if (force || !localStorage.getItem('yp-user-locale')) {
        i18next.changeLanguage(locale, () => {
          //TODO: Fix moment
          //moment.locale([locale, 'en']);
          this.fireGlobal('yp-language-loaded', { language: locale });
        });
      }
    }
  }

  setHighlightedLanguages (languages: Array<string>) {
    this.highlightedLanguages = languages;
    this.fireGlobal('yp-refresh-language-selection');
  }

  changeLocaleIfNeeded(locale: string, force = false) {
    if (window.appGlobals.haveLoadedLanguages) {
      this.changeLocaleIfNeededAfterWait(locale, force);
    } else {
      setTimeout(() => {
        console.warn(
          'Locales not loaded while trying to load languages, trying again in 500 ms'
        );
        this.changeLocaleIfNeeded(locale, force);
      }, 500);
    }
  }

  //TODO: Test this well
  parseQueryString() {
    const queryString = (window.location.search || '?').substr(1);

    const params: Record<string, string> = {};

    const queries = queryString.split('&');

    queries.forEach((indexQuery: string) => {
      const indexPair = indexQuery.split('=');

      const queryKey = decodeURIComponent(indexPair[0]);
      const queryValue = decodeURIComponent(
        indexPair.length > 1 ? indexPair[1] : ''
      );

      params[queryKey] = queryValue;
    });

    this.originalQueryParameters = params;
  }

  setAnonymousUser(user: YpUser | null) {
    this.currentAnonymousUser = user;
    console.debug('Set anon user ' + user);
  }

  setAnonymousGroupStatus(group: YpGroup) {
    if (
      group &&
      group.configuration &&
      group.configuration.allowAnonymousUsers
    ) {
      this.currentAnonymousGroup = group;
      console.debug('Have set anonymous group id: ' + group.id);
      if (!window.appUser.user && this.currentAnonymousUser) {
        console.debug('Setting anon user from cache');
        window.appUser.setLoggedInUser(this.currentAnonymousUser);
      } else if (
        window.appUser &&
        !window.appUser.user &&
        group.configuration.allowAnonymousAutoLogin &&
        this.originalQueryParameters &&
        this.originalQueryParameters.autoLogin
      ) {
        window.appUser.autoAnonymousLogin();
      }
    } else {
      if (
        window.appUser &&
        window.appUser.user &&
        window.appUser.user.profile_data &&
        window.appUser.user.profile_data.isAnonymousUser
      ) {
        window.appUser.removeAnonymousUser();
        console.debug('Logout anon user');
      }
      console.debug('Set anon group to null');
      this.currentAnonymousGroup = null;
    }
  }

  _domainChanged(domain: YpDomain | null) {
    if (domain) {
      this.fireGlobal('yp-domain-changed', { domain: domain });
    }
  }

  notifyUserViaToast(text: string) {
    this.fireGlobal('yp-open-toast', { text: text });
  }

  reBoot() {
    this.boot();
  }

  _userLoggedIn(event: CustomEvent) {
    const user: YpUser = event.detail;
    if (user) {
      setTimeout(function () {
        if (typeof ga == 'function') {
          ga('set', '&uid', user.id);
        }
      }, 250); // Wait a bit to make sure google analytics tracking id has been set up dynamically
    }
    this.recommendations.reset();
  }

  async boot() {
    const results = (await this.serverApi.boot()) as YpDomainGetResponse | void;
    if (results) {
      this.domain = results.domain;
      this._domainChanged(this.domain);
      this.analytics.setupGoogleAnalytics(this.domain);

      if (window.location.pathname == '/') {
        if (
          results.community &&
          results.community.configuration &&
          results.community.configuration.redirectToGroupId
        ) {
          YpNavHelpers.redirectTo(
            '/group/' + results.community.configuration.redirectToGroupId
          );
        } else if (
          results.community &&
          !results.community.is_community_folder
        ) {
          YpNavHelpers.redirectTo('/community/' + results.community.id);
        } else if (results.community && results.community.is_community_folder) {
          YpNavHelpers.redirectTo('/community_folder/' + results.community.id);
        } else {
          YpNavHelpers.redirectTo('/domain/' + this.domain.id);
          this.fireGlobal('change-header', {
            headerTitle: this.domain.domain_name,
            headerDescription: this.domain.description,
          });
        }
      }
    }
  }

  setupGroupConfigOverride(groupId: number, configOverride: string) {
    const configOverrideHash: Record<string, string> = {};
    configOverride.split(';').forEach(function (configItem) {
      const splitItem = configItem.split('=');
      configOverrideHash[splitItem[0]] = splitItem[1];
    });
    this.groupConfigOverrides[groupId] = configOverrideHash;
    if (configOverrideHash['ln']) {
      this.changeLocaleIfNeeded(configOverrideHash['ln'], true);
    }
  }

  // Example use http://localhost:4242/group/47/config/hg=1;rn=Your Priorities;ru=https://yrpri.org/
  overrideGroupConfigIfNeeded(
    groupId: number,
    configuration: YpGroupConfiguration
  ) {
    if (!configuration) {
      configuration = {};
    }
    const override = this.groupConfigOverrides[groupId];
    if (!override) {
      return configuration;
    } else {
      if (override['hg']) {
        configuration['hideGroupHeader'] = Boolean(override['hg']);
      }
      if (override['ht']) {
        configuration['hideAllTabs'] = Boolean(override['ht']);
      }
      if (override['hh']) {
        configuration['hideHelpIcon'] = Boolean(override['hh']);
      }
      if (override['rn']) {
        configuration['customBackName'] = override['rn'] as string;
      }
      if (override['ru']) {
        configuration['customBackURL'] = override['ru'] as string;
      }
      return configuration;
    }
  }

  postLoadGroupProcessing(group: YpGroup) {
    if (this.originalQueryParameters['yu']) {
      this.serverApi.marketingTrackingOpen(
        group.id,
        this.originalQueryParameters
      );
      this.externalGoalTriggerGroupId = group.id;
      this.goalTriggerEvents = ['newPost', 'newPointFor', 'newPointAgainst'];
      this.originalQueryParameters['goalThreshold'] = 1;
    }
  }

  checkExternalGoalTrigger(type: string) {
    if (
      this.externalGoalTriggerGroupId &&
      this.originalQueryParameters &&
      this.originalQueryParameters.goalThreshold &&
      this.goalTriggerEvents.indexOf(type) > -1
    ) {
      this.externalGoalCounter += 1;
      if (
        this.externalGoalCounter == this.originalQueryParameters.goalThreshold
      ) {
        this.serverApi.triggerTrackingGoal(
          this.externalGoalTriggerGroupId,
          this.originalQueryParameters
        );
      }
    }
  }

  activity(
    type: string,
    object: object | string,
    context: string | object | number | null = null,
    target: string | object | null = null
  ) {
    let actor;

    if (window.appUser && window.appUser.user) {
      actor = window.appUser.user.id;
    } else {
      actor = '-1';
    }

    let logString = 'activity stream: ' + actor + ' ' + type + ' ' + object;

    console.log(logString);

    if (context) logString += ' ' + context;

    if (type == 'open') {
      // Wait by sending open so pageview event can be completed before
      setTimeout(() => {
        this.analytics.sendToAnalyticsTrackers('send', 'event', object, type);
      }, 25);
    } else {
      this.analytics.sendToAnalyticsTrackers('send', 'event', object, type);
    }

    this.serverApi.createActivityFromApp({
      actor: actor,
      type: type,
      object: object,
      target: JSON.stringify(target),
      context: context ? context : '',
      path_name: location.pathname,
      event_time: new Date().toISOString(),
      session_id: this.getSessionFromCookie(),
      user_agent: navigator.userAgent,
    });

    if (type === 'completed' || type === 'clicked') {
      this.checkExternalGoalTrigger(object as string);
    }
  }

  setSeenWelcome() {
    this.seenWelcome = true;
    localStorage.setItem('yrpri-welcome-status', '1');
  }

  getSessionFromCookie() {
    const strCookies = document.cookie;
    const cookiearray = strCookies.split(';');
    let sid = '';
    for (let i = 0; i < cookiearray.length; i++) {
      const name = cookiearray[i].split('=')[0];
      const value = cookiearray[i].split('=')[1];
      if (name == ' connect.sid') sid = value;
    }
    return sid;
  }
}
