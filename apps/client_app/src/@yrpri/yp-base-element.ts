import { LitElement, css, property } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';

export class YpBaseElement extends LitElement {

  @property({type: String})
  language = 'en';

  @property({type: Boolean})
  wide = false;

  @property({type: Boolean})
  rtl = false;

  constructor() {
    super();
    this.language = 'en';
    this.addGlobalListener('language-loaded', this._languageEvent);
    if (window.appGlobals && window.appGlobals.i18nTranslation && window.appGlobals.locale) {
      this.language = window.appGlobals.locale;

      if (this.rtl!==undefined) {
        this._setupRtl();
      }
    }
    installMediaQueryWatcher(`(min-width: 900px)`, (matches) => {
      this.wide = matches;
    });
  }

  static get rtlLanguages() {
    return ['fa','ar','ar_EG']
  }

  _setupRtl () {
    if (YpBaseElement.rtlLanguages.indexOf(this.language) >-1 ) {
      this.rtl = true;
    } else {
      this.rtl = false;
    }
  }

  static get styles() {
    return [Layouts,
      css`
        [hidden] {
          display: none !important;
        }
      `];
  }

  _languageEvent(event: CustomEvent) {
    const detail = event.detail;
    this.language = detail.language;
    window.appGlobals.locale = detail.language;
    if (this.rtl!==undefined) {
      this._setupRtl();
    }
  }

  fire(eventName: string, data: object|string = {}, target: LitElement|Document = this) {
    const event = new CustomEvent(eventName, { detail: data, bubbles: true, composed: true });
    target.dispatchEvent(event);
  }

  fireGlobal(eventName: string, data: object|string = {}) {
    this.fire(eventName, data, document);
  }

  addListener(name: string, callback: Function, target: LitElement|Document = this) {
    target.addEventListener(name, callback as EventListener, false);
  }

  addGlobalListener(name: string, callback: Function) {
    this.addListener(name, callback, document);
  }

  removeListener(name: string, callback: Function, target: LitElement|Document = this) {
    target.removeEventListener(name, callback as EventListener);
  }

  removeGlobalListener(name: string, callback: Function) {
    this.removeListener(name, callback, document);
  }

  t(...args: Array<string>) {
    return function() {
      const key = args[0];
      if (window.appGlobals.i18nTranslation) {
        let translation = window.appGlobals.i18nTranslation.t(key);
        if (translation=='')
          translation = key;
        return translation;
      } else {
        return key;
        //console.warn("Translation system i18n not initialized for "+key);
      }
    };
  }

  $$(id: string) {
    this.shadowRoot!.querySelector(id);
  }
}

