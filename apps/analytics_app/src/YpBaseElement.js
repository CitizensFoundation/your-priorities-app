// Locale implementation inspired by https://github.com/PolymerElements/app-localize-behavior

import { IntlMessageFormat } from "intl-messageformat";
import { LitElement, css } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import enLocaleData from './locales/en/enTranslations.js';

window.IntlMessageFormat = IntlMessageFormat;
window.localeResources = {};
window.localeResources.en = enLocaleData;
window.__localizationCache = {
  messages: {},
};

export class YpBaseElement extends LitElement {

  static get properties() {
    return {
      wide: {
        type: Boolean,
        value: false
      },
      language: { type: String }
    };
  }

  constructor() {
    super();
    this.language = 'en';
  }

  static get styles() {
    return [Layouts,
      css`
        [hidden] {
          display: none !important;
        }
      `];
  }

  activity(type, object) {
    this.sendToGoogleAnalytics('send', 'event', object, type);
  }

  handleNetworkErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  sendToGoogleAnalytics(type, parameterA, parameterB, parameterC) {
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

  formatNumber(value, currencyIcon) {
    if (!currencyIcon)
      currencyIcon="";
    if (value) {
      return currencyIcon+value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return currencyIcon+"0";
    }
  }

  localize(token) {
    return this.t(token);
  }


  t() {
    const key = arguments[0];
    if (!key || !window.localeResources || !this.language)
      return key;

    let usingLocale = this.languagee;

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

    const args = {};
    for (var i = 1; i < arguments.length; i += 2) {
      args[arguments[i]] = arguments[i + 1];
    }

    return translatedMessage.format(args);
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('language')) {
      //this.requestUpdate();
    }
  }

  firstUpdated() {
    super.firstUpdated();
    installMediaQueryWatcher(`(min-width: 1024px)`,
    (matches) => {
      this.wide = matches;
    });
  }

  $$(id) {
    return this.shadowRoot.querySelector(id);
  }

  fire(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data, bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
}
