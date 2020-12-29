/* eslint-disable @typescript-eslint/camelcase */

import { YpServerApi } from '../YpServerApi.js';
import { YpAppGlobals } from '../../yp-app/YpAppGlobals.js';
import { YpAppUser } from '../../yp-app/YpAppUser.js';
import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import { html } from 'lit-html';
import fetchMock from 'fetch-mock/esm/client';

export class YpTestHelpers {
  static async setupApp() {
    window.serverApi = new YpServerApi();
    window.appGlobals = new YpAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    await i18next.use(HttpApi).init({
      lng: 'en',
      fallbackLng: 'en',
      backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    });

    window.appGlobals.locale = 'en';
    window.appGlobals.i18nTranslation = i18next;
    window.appGlobals.haveLoadedLanguages = true;
  }

  static get fetchMockConfig() {
    return { headers: {
      'Content-Type': 'application/json',
  }};
  }

  static getFetchMock() {

    const domain = {
      id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      configuration: {

      },
      Communities: [
        {
          id: 1,
          name: 'BEE',
          description: '',
          counter_posts: 10,
          counter_points: 11,
          counter_users: 12,
          configuration: {

          }
        } as YpCommunityData
      ]
    } as YpDomainData;

    return fetchMock.get('/api/domains', { domain: domain }, YpTestHelpers.fetchMockConfig).
      get('/api/videos/hasVideoUploadSupport', { hasTranscriptSupport: true, hasVideoUploadSupport: true }, YpTestHelpers.fetchMockConfig).
      get('/api/audios/hasAudioUploadSupport', { hasAudioUploadSupport: true }, YpTestHelpers.fetchMockConfig).
      get('/api/users/loggedInUser/isloggedin', { notLoggedIn: true }, YpTestHelpers.fetchMockConfig).
      get('/api/users/loggedInUser/memberships', { GroupUsers: [], CommunityUsers: [], DomainUsers: []}, YpTestHelpers.fetchMockConfig).
      get('/api/users/has/AutoTranslation', { hasAutoTranslation: true }, YpTestHelpers.fetchMockConfig).
      get('/api/users/loggedInUser/adminRights', 0, YpTestHelpers.fetchMockConfig)
  }

  static renderCommonHeader() {
    return html`
      <link
        href="https://fonts.googleapis.com/css?family=Material+Icons&display=block"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        rel="stylesheet"
      />

      <base href="/" />

      <style>
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
          background-color: #ededed;
        }
      </style>
    `;
  }
}
