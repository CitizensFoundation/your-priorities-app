// Locale implementation inspired by https://github.com/PolymerElements/app-localize-behavior

import { IntlMessageFormat } from "intl-messageformat";
import { LitElement, css, property } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import enLocaleData from './locales/en/enTranslations.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';

window.IntlMessageFormat = IntlMessageFormat;
window.localeResources = {};
window.localeResources.en = enLocaleData;
window.__localizationCache = {
  messages: {},
};

export class YpBaseElement extends LitElement {

  @property({type: String})
  language = 'en';

  @property({type: Boolean})
  wide = false;

  constructor() {
    super();
    this.language = 'en';
    setPassiveTouchGestures(true);
  }

  static get styles() {
    return [Layouts,
      css`
        [hidden] {
          display: none !important;
        }
      `];
  }

  activity(type: string, object: object) {
    this.sendToGoogleAnalytics('send', 'event', object, type);
  }

  handleNetworkErrors(response: Response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  sendToGoogleAnalytics(type: string, parameterA: string, parameterB: object, parameterC: string) {
    if (typeof ga == 'function') {
      if (parameterB && parameterC) {
        ga(type,parameterA,parameterB,parameterC);
      } else {
        ga(type, parameterA);
      }
    } else {
      console.warn("Google analytics message not sent for type:"+type+" parameterA:"+parameterA+" parameterB:"+parameterB+" parameterC:"+parameterC);
    }
  }

  formatNumber(value: string|number, currencyIcon: string) {
    if (!currencyIcon)
      currencyIcon=""

    if (value) {
      return currencyIcon+value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return currencyIcon+"0";
    }
  }

  t(...args: string[]) {
    const key = args[0];
    if (!key || !window.localeResources || !this.language)
      return key;

    let usingLocale = this.language;

    if (!window.localeResources[usingLocale]) {
      usingLocale = 'en';
    }

    const translatedValue = window.localeResources[usingLocale][key];

    if (!translatedValue) {
      return key;
    }

    const messageKey = key + translatedValue;
    let translatedMessage = window.__localizationCache.messages[messageKey];

    if (!translatedMessage) {
      translatedMessage =
          new IntlMessageFormat(translatedValue, this.language, {});
      window.__localizationCache.messages[messageKey] = translatedMessage;
    }

    const translateArgs: Record<string, string> = {};
    for (let i = 1; i < args.length; i += 2) {
      translateArgs[args[i]] = args[i + 1];
    }

    return translatedMessage.format(translateArgs);
  }

  updated(changedProps: Map<string | number | symbol, unknown>) {
    super.updated(changedProps);
    if (changedProps.has('language')) {
      //this.requestUpdate();
    }
  }

  firstUpdated(changedProps: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProps);
    installMediaQueryWatcher(`(min-width: 1024px)`,
    (matches: boolean) => {
      this.wide = matches;
    });
  }

  $$(id: string) {
    return this.shadowRoot ? this.shadowRoot.querySelector(id) : null;
  }

  fire(eventName: string, data: object) {
    const event = new CustomEvent(eventName, { detail: data, bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
}

