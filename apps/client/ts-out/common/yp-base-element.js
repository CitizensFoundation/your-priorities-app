var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from '../flexbox-literals/classes.js';
export class YpBaseElement extends LitElement {
    constructor() {
        super(...arguments);
        this.language = 'en';
        this.wide = false;
        this.rtl = false;
        this.largeFont = false;
        this.themeColor = '#002255';
    }
    static get styles() {
        return [
            Layouts,
            css `
        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    get isAppleDevice() {
        return /Macintosh|iPhone|iPad/.test(navigator.userAgent);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addGlobalListener('yp-language-loaded', this._languageEvent.bind(this));
        //TODO: Do the large font thing with css custom properties
        this.addGlobalListener('yp-large-font', this._largeFont.bind(this));
        this.addGlobalListener('yp-theme-color', this._changeThemeColor.bind(this));
        this.addGlobalListener('yp-theme-dark-mode', this._changeThemeDarkMode.bind(this));
        if (window.appGlobals &&
            window.appGlobals.i18nTranslation &&
            window.appGlobals.locale) {
            this.language = window.appGlobals.locale;
            this._setupRtl();
        }
        else {
            this.language = 'en';
        }
        installMediaQueryWatcher(`(min-width: 900px)`, matches => {
            this.wide = matches;
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener('yp-language-loaded', this._languageEvent.bind(this));
        this.removeGlobalListener('yp-large-font', this._largeFont.bind(this));
        this.removeGlobalListener('yp-theme-color', this._changeThemeColor.bind(this));
        this.removeGlobalListener('yp-theme-dark-mode', this._changeThemeDarkMode.bind(this));
    }
    _changeThemeColor(event) {
        this.themeColor = event.detail;
    }
    _changeThemeDarkMode(event) {
        this.themeDarkMode = event.detail;
    }
    updated(changedProperties) {
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
        return (userAgent.includes("Safari") &&
            userAgent.includes("Version") &&
            !userAgent.includes("Chrome") &&
            !userAgent.includes("Edg"));
    }
    _setupRtl() {
        if (YpBaseElement.rtlLanguages.indexOf(this.language) > -1) {
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
                translation = '';
            return translation;
        }
        else {
            return key;
        }
    }
    $$(id) {
        return this.shadowRoot ? this.shadowRoot.querySelector(id) : null;
    }
}
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
], YpBaseElement.prototype, "largeFont", void 0);
__decorate([
    property({ type: String })
], YpBaseElement.prototype, "themeColor", void 0);
__decorate([
    property({ type: Boolean })
], YpBaseElement.prototype, "themeDarkMode", void 0);
//# sourceMappingURL=yp-base-element.js.map