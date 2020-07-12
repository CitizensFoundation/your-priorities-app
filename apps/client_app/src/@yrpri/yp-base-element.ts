import { LitElement, css, property } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import { YpBaseMixin } from './YpBaseMixin.js'

export class YpBaseElement extends YpBaseMixin(LitElement) {

  @property({type: String})
  language = 'en';

  @property({type: Boolean})
  wide = false;

  @property({type: Boolean})
  rtl = false;

  constructor() {
    super();
    this.language = 'en';
    if (window.appGlobals && window.appGlobals.i18nTranslation && window.appGlobals.locale) {
      this.language = window.appGlobals.locale;

      if (this.rtl!==undefined) {
        this._setupRtl();
      }
    }
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

  $$(id: string) {
    this.shadowRoot.querySelector(id);
  }
}

