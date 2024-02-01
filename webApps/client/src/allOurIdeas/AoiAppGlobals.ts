import { YpAppGlobals } from '../yp-app/YpAppGlobals.js';
import { AoiServerApi } from './survey/AoiServerApi.js';

export class AoiAppGlobals extends YpAppGlobals {
  override originalQueryParameters: any;
  originalReferrer: string;
  questionId!: number;
  earlId!: number;
  promptId!: number;
  disableParentConstruction = true;
  exernalGoalParamsWhiteList: string | undefined;
  externalGoalTriggerUrl: string | undefined;

  constructor(serverApi: AoiServerApi) {
    super(serverApi, true);
    this.parseQueryString();
    this.originalReferrer = document.referrer;
    document.addEventListener('set-ids' as any, this.setIds.bind(this));
  }


  setIds = (e: CustomEvent): void => {
    this.questionId = e.detail.questionId;
    this.earlId = e.detail.earlId;
    this.promptId = e.detail.promptId;
  };

  override parseQueryString = (): void => {
    const query = (window.location.search || '?').substr(1);
    let map: { [key: string]: string } = {};

    const re = /([^&=]+)=?([^&]*)(?:&+|$)/g;
    let match;
    while ((match = re.exec(query))) {
      const key = match[1];
      const value = match[2];
      map[key] = value;
    }

    this.originalQueryParameters = map;
  };

  override getSessionFromCookie = (): string => {
    const strCookies = document.cookie;
    const cookiearray = strCookies.split(';');
    let sid = '';
    for (let i = 0; i < cookiearray.length; i++) {
      let name = cookiearray[i].split('=')[0];
      let value = cookiearray[i].split('=')[1];
      if (name.trim() === '_all_our_ideas_session') {
        sid = value;
      }
    }
    return sid;
  };

  getOriginalQueryString() {
    if (this.originalQueryParameters) {
      return new URLSearchParams(this.originalQueryParameters).toString();
    } else {
      return null;
    }
  }

  override activity = (type: string, object: any | undefined = undefined): void => {
    let actor: string;

    if (window.appUser && window.appUser.user) {
      actor = window.appUser.user.id.toString();
    } else {
      actor = '-1';
    }

    const date = new Date();
    const body = {
      actor: actor,
      type: type,
      object: object,
      path_name: location.pathname,
      event_time: date.toISOString(),
      session_id: this.getSessionFromCookie(),
      originalQueryString: this.getOriginalQueryString(),
      originalReferrer: this.originalReferrer,
      questionId: this.questionId,
      earlId: this.earlId,
      promptId: this.promptId,
      userLocale: window.locale,
      userAutoTranslate: window.autoTranslate,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      url: location.href,
      screen_width: window.innerWidth,
    };

    try {
      fetch('/api/users/createActivityFromApp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then(response => {
          if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
          } else {
            if (
              type === 'Voting - left' ||
              type === 'Voting - right' ||
              type === 'New Idea - added'
            ) {
              this.checkExternalGoalTrigger(type);
            }
          }
        })
        .catch(error => {
          console.error(
            'There has been a problem with your fetch operation:',
            error
          );
        });
    } catch (error) {
      console.error(error);
    }
  };
}
