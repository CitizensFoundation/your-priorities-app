var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { Layouts } from "../flexbox-literals/classes.js";
import { styles as typescaleStyles } from "@material/web/typography/md-typescale-styles.js";
import "@material/web/iconbutton/outlined-icon-button.js";
export class YpBaseElement extends LitElement {
    constructor() {
        super(...arguments);
        this.language = "en";
        this.wide = false;
        this.rtl = false;
        this.hasLlm = false;
        this.largeFont = false;
        this.themeColor = "#002255";
        this.hasStaticTheme = false;
        this.installMediaQueryWatcher = (mediaQuery, layoutChangedCallback) => {
            let mql = window.matchMedia(mediaQuery);
            mql.addListener((e) => layoutChangedCallback(e.matches));
            layoutChangedCallback(mql.matches);
        };
    }
    static get styles() {
        return [
            Layouts,
            css `
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
        ];
    }
    get isAppleDevice() {
        return /Macintosh|iPhone|iPad/.test(navigator.userAgent);
    }
    connectedCallback() {
        super.connectedCallback();
        this.hasLlm = window.appGlobals.hasLlm;
        this.setStaticThemeFromConfig();
        this.addGlobalListener("yp-language-loaded", this._languageEvent.bind(this));
        //TODO: Do the large font thing with css custom properties
        this.addGlobalListener("yp-large-font", this._largeFont.bind(this));
        this.addGlobalListener("yp-theme-color", this._changeThemeColor.bind(this));
        this.addGlobalListener("yp-theme-applied", this.setStaticThemeFromConfig.bind(this));
        this.addGlobalListener("yp-theme-dark-mode", this._changeThemeDarkMode.bind(this));
        if (window.appGlobals &&
            window.appGlobals.i18nTranslation &&
            window.appGlobals.locale) {
            this.language = window.appGlobals.locale;
            this._setupRtl();
        }
        else {
            this.language = "";
        }
        this.installMediaQueryWatcher(`(min-width: 900px)`, (matches) => {
            this.wide = matches;
        });
        this.setupThemeSettings();
    }
    setStaticThemeFromConfig() {
        console.error(`hasStaticTheme is ${window.appGlobals.theme.hasStaticTheme}`);
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
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener("yp-language-loaded", this._languageEvent.bind(this));
        this.removeGlobalListener("yp-large-font", this._largeFont.bind(this));
        this.removeGlobalListener("yp-theme-color", this._changeThemeColor.bind(this));
        this.removeGlobalListener("yp-theme-dark-mode", this._changeThemeDarkMode.bind(this));
        this.removeGlobalListener("yp-boot-from-server", this.hasBooted.bind(this));
        this.removeGlobalListener("yp-theme-applied", this.setStaticThemeFromConfig.bind(this));
    }
    _changeThemeColor(event) {
        this.themeColor = event.detail;
    }
    _changeThemeDarkMode(event) {
        this.themeDarkMode = event.detail;
    }
    updated(changedProperties) {
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
        return (userAgent.includes("Safari") &&
            userAgent.includes("Version") &&
            !userAgent.includes("Chrome") &&
            !userAgent.includes("Edg"));
    }
    _setupRtl() {
        const twoFirstCharsOfLanguage = this.language.substring(0, 2).toLowerCase();
        if (YpBaseElement.rtlLanguages.indexOf(twoFirstCharsOfLanguage) > -1) {
            this.rtl = true;
        }
        else {
            this.rtl = false;
        }
    }
    scrimDisableAction(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    _largeFont(event) {
        this.largeFont = event.detail;
    }
    _languageEvent(event) {
        this.language = event.detail.language;
        window.appGlobals.locale = event.detail.language;
        if (this.rtl !== undefined) {
            this._setupRtl();
        }
        //this.requestUpdate();
    }
    fire(eventName, data = {}, target = this) {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true,
            composed: true,
        });
        target.dispatchEvent(event);
    }
    fireGlobal(eventName, data = {}) {
        this.fire(eventName, data, document);
    }
    addListener(name, callback, target = this) {
        target.addEventListener(name, callback, false);
    }
    addGlobalListener(name, callback) {
        this.addListener(name, callback, document);
    }
    removeListener(name, callback, target = this) {
        target.removeEventListener(name, callback);
    }
    removeGlobalListener(name, callback) {
        this.removeListener(name, callback, document);
    }
    t(...args) {
        const key = args[0];
        if (window.appGlobals && window.appGlobals.i18nTranslation) {
            let translation = window.appGlobals.i18nTranslation.t(key);
            if (!translation)
                translation = "";
            return translation;
        }
        else {
            return key;
        }
    }
    $$(id) {
        return this.shadowRoot ? this.shadowRoot.querySelector(id) : null;
    }
    toggleHighContrast() {
        this.themeHighContrast = !this.themeHighContrast;
        window.appGlobals.theme.themeHighContrast =
            !window.appGlobals.theme.themeHighContrast;
        if (window.appGlobals.theme.themeHighContrast) {
            window.appGlobals.activity("Settings - high contrast mode");
            localStorage.setItem(YpBaseElement.highContrastLocalStorageKey, "true");
        }
        else {
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
        }
        else {
            window.appGlobals.activity("Settings - light mode");
            localStorage.removeItem(YpBaseElement.darkModeLocalStorageKey);
        }
        window.appGlobals.theme.themeChanged();
    }
    renderThemeToggle(hideText = false) {
        return html `<div class="layout vertical center-center lightDarkContainer">
        ${!this.themeDarkMode
            ? html `
              <md-outlined-icon-button
                class="darkModeButton"
                @click="${this.toggleDarkMode}"
                ><md-icon>dark_mode</md-icon></md-outlined-icon-button
              >
            `
            : html `
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
            ? html `
            <md-outlined-icon-button
              class="darkModeButton"
              @click="${this.toggleHighContrast}"
              ><md-icon>contrast</md-icon></md-outlined-icon-button
            >
          </div> `
            : html `
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
YpBaseElement.darkModeLocalStorageKey = "md3-yp-dark-mode";
YpBaseElement.highContrastLocalStorageKey = "md3-yp-high-contrast-mode";
__decorate([
    property({ type: String })
], YpBaseElement.prototype, "language", void 0);
__decorate([
    property({ type: Boolean })
], YpBaseElement.prototype, "wide", void 0);
__decorate([
    property({ type: Boolean })
], YpBaseElement.prototype, "rtl", void 0);
__decorate([
    property({ type: Boolean })
], YpBaseElement.prototype, "hasLlm", void 0);
__decorate([
    property({ type: Boolean })
], YpBaseElement.prototype, "largeFont", void 0);
__decorate([
    property({ type: String })
], YpBaseElement.prototype, "themeColor", void 0);
__decorate([
    property({ type: Boolean })
], YpBaseElement.prototype, "themeDarkMode", void 0);
__decorate([
    property({ type: Boolean })
], YpBaseElement.prototype, "themeHighContrast", void 0);
__decorate([
    property({ type: Boolean })
], YpBaseElement.prototype, "hasStaticTheme", void 0);
//# sourceMappingURL=yp-base-element.js.map