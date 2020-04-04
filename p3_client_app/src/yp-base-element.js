import { LitElement } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';

export class YpBaseElement extends LitElement {

  static get properties() {
    return {
      wide: {
        type: Boolean,
        value: false
      },
      language: { type: String }
    }
  }

  constructor() {
    super();
  }

  activity(type, object) {
    this.sendToGoogleAnalytics('send', 'event', object, type);
  }

  formatNumber(value) {
    if (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "0";
    }
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

  t(txt) {
    return window.i18nTranslation.t(txt);
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('language')) {
      //this.requestUpdate();
    }
  }

  $$(id) {
    return this.shadowRoot.querySelector(id);
  }

  fire(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data, bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
}
