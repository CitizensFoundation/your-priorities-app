import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@material/mwc-button';
import '../yp-app-globals/yp-language-selector.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpAutoTranslateDialogLit extends YpBaseElement {
  static get properties() {
    return {

    }
  }

  static get styles() {
    return [
      css`

      paper-dialog {
        background-color: #FFF;
        max-width: 400px;
      }

      iron-icon {
        color: var(--accent-color);
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }

      .infoText {
        font-size: 18px;
        margin-bottom: 8px;
      }
    `, YpFlexLayout]
  }
  
  render() {
    return html`
    <yp-language-selector ?hidden="" id="languageSelector"></yp-language-selector>

    <paper-dialog id="dialog">
      <div class="layout vertical center-center">
        <div><iron-icon .icon="translate"></iron-icon></div>
        <div class="infoText">${this.t('shouldAutoTranslateInfo')}</div>
      </div>
      <div class="buttons">
        <mwc-button @click="${this._dontAskAgain}" dialog-dismiss .label="${this.t('never')}"></mwc-button>
        <mwc-button dialog-dismiss @click="_no" .label="${this.t('no')}"></mwc-button>
        <mwc-button dialog-confirm @click="_startAutoTranslate".label="${this.t('yes')}"></mwc-button>
        <mwc-button dialog-confirm @click="${this._startAutoTranslateAndDoSoAlways}".label="${this.t('always')}"></mwc-button>
      </div>
    </paper-dialog>
`
  }

  _no() {
    sessionStorage.setItem("dontPromptForAutoTranslation", true);
  }

  _dontAskAgain() {
    localStorage.setItem("dontPromptForAutoTranslation", true);
  }

  _startAutoTranslateAndDoSoAlways() {
    this._startAutoTranslate();
    localStorage.setItem("alwaysStartAutoTranslation", true);
  }

  _startAutoTranslate() {
    this.$$("#languageSelector")._startTranslation();
  }

  openLaterIfAutoTranslationEnabled() {
    this.async(function () {
      if (this.$$("#dialog").opened===false) {
        if (this.$$("#languageSelector").canUseAutoTranslate === true &&
          window.autoTranslate !== true) {
          if (localStorage.getItem("alwaysStartAutoTranslation")!=null) {
            this._startAutoTranslate();
          } else {
            this.$$("#dialog").open();
          }
        }
      }
    }, 750);
  }
}

window.customElements.define('yp-autotranslate-dialog-lit', YpAutoTranslateDialogLit)
