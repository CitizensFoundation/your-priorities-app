var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '../yp-app/yp-language-selector.js';
let YpAutoTranslateDialog = class YpAutoTranslateDialog extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
        md-dialog {
          max-width: 400px;
        }

        md-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
        }

        .infoText {
          font-size: 18px;
          margin-bottom: 8px;
        }
      `,
        ];
    }
    render() {
        return html `
      <yp-language-selector hidden id="languageSelector"></yp-language-selector>

      <md-dialog id="dialog">
        <div class="layout vertical center-center" slot="headline">
          <div><md-icon>translate</md-icon></div>
          <div class="infoText">${this.t('shouldAutoTranslateInfo')}</div>
        </div>
        <div class="buttons" slot="actions">
          <md-text-button
            @click="${this._dontAskAgain}"
            slot="secondaryAction"
            .label="${this.t('never')}"></md-text-button>
          <md-text-button
            slot="secondaryAction"
            @click="${this._no}"
            .label="${this.t('no')}"></md-text-button>
          <md-text-button
            slot="primaryAction"
            @click="${this._startAutoTranslate}"
            .label="${this.t('yes')}"></md-text-button>
          <md-text-button
            slot="primaryAction"
            @click="${this._startAutoTranslateAndDoSoAlways}"
            .label="${this.t('always')}"></md-text-button>
        </div>
      </md-dialog>
    `;
    }
    _no() {
        sessionStorage.setItem('dontPromptForAutoTranslation', 'true');
    }
    _dontAskAgain() {
        localStorage.setItem('dontPromptForAutoTranslation', 'true');
    }
    _startAutoTranslateAndDoSoAlways() {
        this._startAutoTranslate();
        localStorage.setItem('alwaysStartAutoTranslation', 'true');
    }
    _startAutoTranslate() {
        this.$$('#languageSelector').startTranslation();
    }
    openLaterIfAutoTranslationEnabled() {
        setTimeout(() => {
            if (this.$$('#dialog').open === false) {
                if (this.$$('#languageSelector')
                    .canUseAutoTranslate === true &&
                    window.appGlobals.autoTranslate !== true) {
                    if (localStorage.getItem('alwaysStartAutoTranslation') != null) {
                        this._startAutoTranslate();
                    }
                    else {
                        this.$$('#dialog').open = true;
                    }
                }
            }
        }, 750);
    }
};
__decorate([
    property({ type: String })
], YpAutoTranslateDialog.prototype, "confirmationText", void 0);
YpAutoTranslateDialog = __decorate([
    customElement('yp-autotranslate-dialog')
], YpAutoTranslateDialog);
export { YpAutoTranslateDialog };
//# sourceMappingURL=yp-autotranslate-dialog.js.map