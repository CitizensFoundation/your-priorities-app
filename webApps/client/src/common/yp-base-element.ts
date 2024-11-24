import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { Layouts } from "../flexbox-literals/classes.js";
import { styles as typescaleStyles } from "@material/web/typography/md-typescale-styles.js";

import "@material/web/iconbutton/outlined-icon-button.js";

export class YpBaseElement extends LitElement {
  @property({ type: String })
  language = "en";

  @property({ type: Boolean })
  wide = false;

  @property({ type: Boolean })
  rtl = false;

  @property({ type: Boolean })
  hasLlm = false;

  @property({ type: Boolean })
  largeFont = false;

  @property({ type: String })
  themeColor = "#002255";

  @property({ type: Boolean })
  themeDarkMode: boolean | undefined;

  @property({ type: Boolean })
  themeHighContrast: boolean | undefined;

  @property({ type: Boolean })
  hasStaticTheme = false;

  @property({ type: Boolean })
  languageLoaded = false;

  static darkModeLocalStorageKey = "md3-yp-dark-mode";
  static highContrastLocalStorageKey = "md3-yp-high-contrast-mode";

  static override get styles() {
    return [
      Layouts,
      css`
        [hidden] {
          display: none !important;
        }

        .lightDarkContainer {
          padding-left: 8px;
          padding-right: 8px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .themeToggleText {
          margin-top: 8px;
        }
      `,
      typescaleStyles,
    ] as any;
  }

  get isAppleDevice() {
    return /Macintosh|iPhone|iPad/.test(navigator.userAgent);
  }

  installMediaQueryWatcher = (
    mediaQuery: string,
    layoutChangedCallback: (mediaQueryMatches: boolean) => void
  ) => {
    let mql = window.matchMedia(mediaQuery);
    mql.addListener((e) => layoutChangedCallback(e.matches));
    layoutChangedCallback(mql.matches);
  };

  override connectedCallback() {
    super.connectedCallback();

    this.hasLlm = window.appGlobals.hasLlm;

    this.setStaticThemeFromConfig();

    this.addGlobalListener(
      "yp-language-loaded",
      this._languageEvent.bind(this)
    );

    //TODO: Do the large font thing with css custom properties
    this.addGlobalListener("yp-large-font", this._largeFont.bind(this));

    this.addGlobalListener("yp-theme-color", this._changeThemeColor.bind(this));

    this.addGlobalListener("yp-theme-applied", this.setStaticThemeFromConfig.bind(this));

    this.addGlobalListener(
      "yp-theme-dark-mode",
      this._changeThemeDarkMode.bind(this)
    );

    if (
      window.appGlobals &&
      window.appGlobals.i18nTranslation &&
      window.appGlobals.locale
    ) {
      this.language = window.appGlobals.locale;
      this.languageLoaded = true;
      this._setupRtl();
    } else {
      this.language = "";
    }

    this.installMediaQueryWatcher(`(min-width: 900px)`, (matches) => {
      this.wide = matches;
    });

    this.setupThemeSettings();
  }

  setStaticThemeFromConfig() {
    //console.error(`hasStaticTheme is ${window.appGlobals.theme.hasStaticTheme}`);
    this.hasStaticTheme = window.appGlobals.theme.hasStaticTheme;
  }

  hasBooted() {
    this.hasLlm = window.appGlobals.hasLlm;
  }

  setupBootListener() {
    this.addGlobalListener("yp-boot-from-server", this.hasBooted.bind(this));
  }

  //TODO: See if we can do this without this arbitrary delay
  async setupThemeSettings() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.themeDarkMode = window.appGlobals.theme.themeDarkMode;
    this.themeHighContrast = window.appGlobals.theme.themeHighContrast;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      "yp-language-loaded",
      this._languageEvent.bind(this)
    );

    this.removeGlobalListener("yp-large-font", this._largeFont.bind(this));

    this.removeGlobalListener(
      "yp-theme-color",
      this._changeThemeColor.bind(this)
    );

    this.removeGlobalListener(
      "yp-theme-dark-mode",
      this._changeThemeDarkMode.bind(this)
    );

    this.removeGlobalListener("yp-boot-from-server", this.hasBooted.bind(this));

    this.removeGlobalListener("yp-theme-applied", this.setStaticThemeFromConfig.bind(this));
  }

  _changeThemeColor(event: CustomEvent) {
    this.themeColor = event.detail;
  }

  _changeThemeDarkMode(event: CustomEvent) {
    this.themeDarkMode = event.detail;
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);

    if (changedProperties.has("language")) {
      this.languageChanged();
    }
  }

  static get rtlLanguages() {
    return ["fa", "ar", "he", "ur", "ps", "ku", "sd", "dv", "ug", "yi"];
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
    const twoFirstCharsOfLanguage = this.language.substring(0, 2).toLowerCase();
    if (YpBaseElement.rtlLanguages.indexOf(twoFirstCharsOfLanguage) > -1) {
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
    this.languageLoaded = true;
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
      if (!translation) translation = "";
      return translation;
    } else {
      return key;
    }
  }

  $$(id: string): HTMLElement | null {
    return this.shadowRoot ? this.shadowRoot.querySelector(id) : null;
  }

  toggleHighContrast() {
    this.themeHighContrast = !this.themeHighContrast;
    window.appGlobals.theme.themeHighContrast =
      !window.appGlobals.theme.themeHighContrast;
    if (window.appGlobals.theme.themeHighContrast) {
      window.appGlobals.activity("Settings - high contrast mode");
      localStorage.setItem(YpBaseElement.highContrastLocalStorageKey, "true");
    } else {
      window.appGlobals.activity("Settings - non high contrast mode");
      localStorage.removeItem(YpBaseElement.highContrastLocalStorageKey);
    }
    window.appGlobals.theme.themeChanged();
  }

  toggleDarkMode() {
    this.themeDarkMode = !this.themeDarkMode;
    window.appGlobals.theme.themeDarkMode =
      !window.appGlobals.theme.themeDarkMode;
    if (window.appGlobals.theme.themeDarkMode) {
      window.appGlobals.activity("Settings - dark mode");
      localStorage.setItem(YpBaseElement.darkModeLocalStorageKey, "true");
    } else {
      window.appGlobals.activity("Settings - light mode");
      localStorage.removeItem(YpBaseElement.darkModeLocalStorageKey);
    }
    window.appGlobals.theme.themeChanged();
  }

  renderThemeToggle(hideText = false) {
    return html`<div class="layout vertical center-center lightDarkContainer">
        ${!this.themeDarkMode
          ? html`
              <md-outlined-icon-button
                class="darkModeButton"
                @click="${this.toggleDarkMode}"
                ><md-icon>dark_mode</md-icon></md-outlined-icon-button
              >
            `
          : html`
              <md-outlined-icon-button
                class="darkModeButton"
                @click="${this.toggleDarkMode}"
                ><md-icon>light_mode</md-icon></md-outlined-icon-button
              >
            `}
        <div class="themeToggleText" ?hidden="${hideText}">${this.t("Light/Dark")}</div>
      </div>

      <div
        class="layout vertical center-center lightDarkContainer"
        ?hidden="${this.isAppleDevice}"
      >
        ${!this.themeHighContrast
          ? html`
            <md-outlined-icon-button
              class="darkModeButton"
              @click="${this.toggleHighContrast}"
              ><md-icon>contrast</md-icon></md-outlined-icon-button
            >
          </div> `
          : html`
              <md-outlined-icon-button
                class="darkModeButton"
                @click="${this.toggleHighContrast}"
                ><md-icon>contrast_rtl_off</md-icon></md-outlined-icon-button
              >
            `}
        <div class="themeToggleText" ?hidden="${hideText}">${this.t("Contrast")}</div>
      </div>`;
  }
}
