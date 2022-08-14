import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';
import { Layouts } from 'lit-flexbox-literals';

export class PlausibleBaseElement extends LitElement {
  @property({ type: String })
  language = 'en';

  @property({ type: Object })
  state: PlausibleStateData;

  @property({ type: Boolean })
  rtl = false;

  constructor() {
    super();
    this.state = {};
  }

  connectedCallback() {
    super.connectedCallback();

    this.addGlobalListener('language-loaded', this._languageEvent.bind(this));

    if (
      window.appGlobals &&
      window.appGlobals.i18nTranslation &&
      window.appGlobals.locale
    ) {
      this.language = window.appGlobals.locale;
      this._setupRtl();
    } else {
      this.language = 'en';
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      'language-loaded',
      this._languageEvent.bind(this)
    );
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('language')) {
      this.languageChanged();
    }
  }

  static get rtlLanguages() {
    return ['fa', 'ar', 'ar_EG'];
  }

  languageChanged() {
    // Do nothing, override if needed
  }

  _setupRtl() {
    if (PlausibleBaseElement.rtlLanguages.indexOf(this.language) > -1) {
      this.rtl = true;
    } else {
      this.rtl = false;
    }
  }

  static get styles() {
    return [
      Layouts,
      css`
        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  _languageEvent(event: CustomEvent) {
    this.language = event.detail.language;
    window.appGlobals.locale = event.detail.language;
    if (this.rtl !== undefined) {
      this._setupRtl();
    }
  }

  fire(
    eventName: string,
    data: object | string | boolean | number | null = {},
    target: LitElement | Document = this
  ) {
    const event = new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      composed: true,
    });
    target.dispatchEvent(event);
  }

  fireGlobal(
    eventName: string,
    data: object | string | boolean | number | null = {}
  ) {
    this.fire(eventName, data, document);
  }

  addListener(
    name: string,
    callback: Function,
    target: LitElement | Document = this
  ) {
    target.addEventListener(name, callback as EventListener, false);
  }

  addGlobalListener(name: string, callback: Function) {
    this.addListener(name, callback, document);
  }

  removeListener(
    name: string,
    callback: Function,
    target: LitElement | Document = this
  ) {
    target.removeEventListener(name, callback as EventListener);
  }

  removeGlobalListener(name: string, callback: Function) {
    this.removeListener(name, callback, document);
  }

  t(...args: Array<string>): string {
    const key = args[0];
    if (window.appGlobals && window.appGlobals.i18nTranslation) {
      let translation = window.appGlobals.i18nTranslation.t(key);
      if (!translation) translation = '';
      return translation;
    } else {
      return key;
    }
  }

  $$(id: string): HTMLElement | null {
    return this.shadowRoot ? this.shadowRoot.querySelector(id) : null;
  }
}
