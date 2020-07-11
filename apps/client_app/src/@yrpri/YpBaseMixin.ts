import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const YpBaseMixin = dedupeMixin(
  superclass =>
    class YpBaseMixin extends superclass {

      constructor() {
        super();
        document.addEventListener('language-loaded', this._languageEvent as EventListener, false);
      }

      _languageEvent(event: CustomEvent) {
        const detail = event.detail;
        this.language = detail.language;
        window.appGlobals.locale = detail.language;
        if (this.rtl!==undefined) {
          this._setupRtl();
        }
      }

      fire(eventName: string, data: object|string = {}, target: any = this) {
        const event = new CustomEvent(eventName, { detail: data, bubbles: true, composed: true });
        target.dispatchEvent(event);
      }

      fireGlobal(eventName: string, data: object|string = {}) {
        this.fire(eventName, data, document);
      }

      addListener(name: string, callback: Function, target: any = this) {
        target.addEventListener(name, callback as EventListener, false);
      }

      addGlobalListener(name: string, callback: Function) {
        this.addListener(name, callback, document);
      }

      removeListener(name: string, callback: Function, target: any = this) {
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
    }
);