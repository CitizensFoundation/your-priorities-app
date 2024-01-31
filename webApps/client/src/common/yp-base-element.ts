import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';
import { Layouts } from '../flexbox-literals/classes.js';

export class YpBaseElement extends LitElement {
  @property({ type: String })
  language = 'en';

  @property({ type: Boolean })
  wide = false;

  @property({ type: Boolean })
  rtl = false;

  @property({ type: Boolean })
  largeFont = false;

  @property({ type: String })
  themeColor = '#002255';

  @property({ type: Boolean })
  themeDarkMode: boolean | undefined;

  static override get styles() {
    return [
      Layouts,
      css`
        [hidden] {
          display: none !important;
        }
      `,
    ] as any;
  }

  get isAppleDevice() {
    return /Macintosh|iPhone|iPad/.test(navigator.userAgent);
  }

  installMediaQueryWatcher = (mediaQuery: string, layoutChangedCallback: (mediaQueryMatches: boolean) => void) => {
    let mql = window.matchMedia(mediaQuery);
    mql.addListener((e) => layoutChangedCallback(e.matches));
    layoutChangedCallback(mql.matches);
  };

  override connectedCallback() {
    super.connectedCallback();

    this.addGlobalListener(
      'yp-language-loaded',
      this._languageEvent.bind(this)
    );

    //TODO: Do the large font thing with css custom properties
    this.addGlobalListener('yp-large-font', this._largeFont.bind(this));

    this.addGlobalListener('yp-theme-color', this._changeThemeColor.bind(this));

    this.addGlobalListener(
      'yp-theme-dark-mode',
      this._changeThemeDarkMode.bind(this)
    );

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

    this.installMediaQueryWatcher(`(min-width: 900px)`, matches => {
      this.wide = matches;
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      'yp-language-loaded',
      this._languageEvent.bind(this)
    );

    this.removeGlobalListener('yp-large-font', this._largeFont.bind(this));

    this.removeGlobalListener(
      'yp-theme-color',
      this._changeThemeColor.bind(this)
    );

    this.removeGlobalListener(
      'yp-theme-dark-mode',
      this._changeThemeDarkMode.bind(this)
    );
  }

  _changeThemeColor(event: CustomEvent) {
    this.themeColor = event.detail;
  }

  _changeThemeDarkMode(event: CustomEvent) {
    this.themeDarkMode = event.detail;
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
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

  get isSafari() {
    const userAgent = navigator.userAgent;

    // Safari detection, ensuring not Chrome or Edge
    return (
      userAgent.includes("Safari") &&
      userAgent.includes("Version") &&
      !userAgent.includes("Chrome") &&
      !userAgent.includes("Edg")
    );
  }

  _setupRtl() {
    if (YpBaseElement.rtlLanguages.indexOf(this.language) > -1) {
      this.rtl = true;
    } else {
      this.rtl = false;
    }
  }

  scrimDisableAction(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  _largeFont(event: CustomEvent) {
    this.largeFont = event.detail;
  }

  _languageEvent(event: CustomEvent) {
    this.language = event.detail.language;
    window.appGlobals.locale = event.detail.language;
    if (this.rtl !== undefined) {
      this._setupRtl();
    }
    //this.requestUpdate();
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
