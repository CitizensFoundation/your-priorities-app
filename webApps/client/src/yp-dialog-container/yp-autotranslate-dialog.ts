import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';


import { YpBaseElement } from '../common/yp-base-element.js';

import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';

import '../yp-app/yp-language-selector.js';
import { YpLanguageSelector } from '../yp-app/yp-language-selector.js';
import { Dialog } from '@material/web/dialog/internal/dialog.js';

@customElement('yp-autotranslate-dialog')
export class YpAutoTranslateDialog extends YpBaseElement {
  @property({ type: String })
  confirmationText: string | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
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

  override render() {
    return html`
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
    (this.$$('#languageSelector') as YpLanguageSelector).startTranslation();
  }

  openLaterIfAutoTranslationEnabled() {
    setTimeout(() => {
      if ((this.$$('#dialog') as Dialog).open === false) {
        if (
          (this.$$('#languageSelector') as YpLanguageSelector)
            .canUseAutoTranslate === true &&
          window.appGlobals.autoTranslate !== true
        ) {
          if (localStorage.getItem('alwaysStartAutoTranslation') != null) {
            this._startAutoTranslate();
          } else {
            (this.$$('#dialog') as Dialog).open = true;
          }
        }
      }
    }, 750);
  }
}
