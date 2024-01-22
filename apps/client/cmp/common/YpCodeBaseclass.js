import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
export class YpCodeBase {
    constructor() {
        this.wide = false;
        installMediaQueryWatcher(`(min-width: 900px)`, (matches) => {
            this.wide = matches;
        });
        this.addGlobalListener('yp-language-loaded', this._languageEvent.bind(this));
        if (window.appGlobals &&
            window.appGlobals.i18nTranslation &&
            window.appGlobals.locale) {
            this.language = window.appGlobals.locale;
        }
        else {
            this.language = 'en';
        }
    }
    _languageEvent(event) {
        const detail = event.detail;
        this.language = detail.language;
        window.appGlobals.locale = detail.language;
    }
    fire(eventName, data = {}, target) {
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
    addListener(name, callback, target) {
        target.addEventListener(name, callback, false);
    }
    addGlobalListener(name, callback) {
        this.addListener(name, callback, document);
    }
    showToast(text, timeout = 4000) {
        window.appDialogs.getDialogAsync("masterToast", (toast /*Snackbar*/) => {
            toast.labelText = text;
            toast.timeoutMs = timeout;
            toast.open = true;
        });
    }
    removeListener(name, callback, target) {
        target.removeEventListener(name, callback);
    }
    removeGlobalListener(name, callback) {
        this.removeListener(name, callback, document);
    }
    t(...args) {
        const key = args[0];
        if (window.appGlobals.i18nTranslation) {
            let translation = window.appGlobals.i18nTranslation.t(key);
            if (!translation)
                translation = '';
            return translation;
        }
        else {
            return '';
        }
    }
}
//# sourceMappingURL=YpCodeBaseclass.js.map