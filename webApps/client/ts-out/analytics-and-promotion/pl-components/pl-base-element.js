var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';
import { PlausibleStyles } from './plausibleStyles';
export class PlausibleBaseElement extends LitElement {
    constructor() {
        super(...arguments);
        this.language = 'en';
        this.rtl = false;
        this.wide = false;
        this.installMediaQueryWatcher = (mediaQuery, layoutChangedCallback) => {
            let mql = window.matchMedia(mediaQuery);
            mql.addListener((e) => layoutChangedCallback(e.matches));
            layoutChangedCallback(mql.matches);
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this.addGlobalListener('language-loaded', this._languageEvent.bind(this));
        if (window.appGlobals &&
            window.appGlobals.i18nTranslation &&
            window.appGlobals.locale) {
            this.language = window.appGlobals.locale;
            this._setupRtl();
        }
        else {
            this.language = 'en';
        }
        this.installMediaQueryWatcher(`(min-width: 900px)`, matches => {
            this.wide = matches;
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener('language-loaded', this._languageEvent.bind(this));
    }
    updated(changedProperties) {
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
        }
        else {
            this.rtl = false;
        }
    }
    static get styles() {
        return [
            PlausibleStyles,
            css `
        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    _languageEvent(event) {
        this.language = event.detail.language;
        window.appGlobals.locale = event.detail.language;
        if (this.rtl !== undefined) {
            this._setupRtl();
        }
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
    getTooltipText(item) {
        if (item.tooltipTextToken) {
            return this.t(item.tooltipTextToken);
        }
        else {
            return undefined;
        }
    }
    renderIcon(item) {
        if (item.icon) {
            return "icon";
        }
        else {
            return undefined;
        }
    }
    $$(id) {
        return this.shadowRoot ? this.shadowRoot.querySelector(id) : null;
    }
}
__decorate([
    property({ type: String })
], PlausibleBaseElement.prototype, "language", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleBaseElement.prototype, "rtl", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleBaseElement.prototype, "wide", void 0);
//# sourceMappingURL=pl-base-element.js.map