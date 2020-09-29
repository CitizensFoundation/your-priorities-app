/* eslint-disable @typescript-eslint/camelcase */

import { YpServerApi } from '../YpServerApi.js';
import { YpAppGlobals } from '../../yp-app/YpAppGlobals.js';
import { YpAppUser } from '../../yp-app/YpAppUser.js';
import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';

export class YpTestHelpers {
  static async setupApp() {
    window.serverApi = new YpServerApi();
    window.appGlobals = new YpAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    await i18next.use(HttpApi).init(
      {
        lng: "en",
        fallbackLng: 'en',
        backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
      }
    );

    window.appGlobals.locale = "en";
    window.appGlobals.i18nTranslation = i18next;
    window.appGlobals.haveLoadedLanguages = true;
  }
}

