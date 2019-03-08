import '../../../../@polymer/polymer/polymer-element.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import '../../../../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import './yp-magic-text.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

class YpMagicTextBoxDialog extends YpMagicTextBox {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }

      #dialog {
        background-color: #FFF;
        max-width: 50%;
      }

      @media (max-width: 1100px) {
        #dialog {
          max-width: 80%;
        }
      }

      @media (max-width: 600px) {
        #dialog {
          max-width: 100%;
        }

        paper-dialog {
          padding: 0;
          margin: 0;
        }
      }

      .buttons {
        color: var(--accent-color);
      }
    </style>

    <paper-dialog id="dialog">
      <h2>[[pageTitle]]</h2>
      <paper-dialog-scrollable>
        <div hidden\$="[[!finalContent]]" inner-h-t-m-l="[[finalContent]]"></div>
        <div hidden\$="[[finalContent]]">[[content]]</div>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button raised="" dialog-dismiss="">[[closeDialogText]]</paper-button>
      </div>
    </paper-dialog>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-auto-translate="_autoTranslateEvent"></lite-signal>

    <iron-ajax id="getTranslationAjax" on-response="_getTranslationResponse"></iron-ajax>
`;
  }

  static get is() {
    return 'yp-magic-text-dialog';
  }

  subClassProcessing() {
    this.processedContent = this.processedContent.replace(/\n/g, "<br />");
  }

  open(content, contentId, extraId, textType, contentLanguage, closeDialogText, structuredQuestionsConfig) {
    this.contentId = contentId;
    this.extraId = extraId;
    this.textType = textType;
    this.contentLanguage = contentLanguage;
    this.structuredQuestionsConfig = structuredQuestionsConfig;
    this.set('content', content);
    this.set('closeDialogText', closeDialogText);
    this.$.dialog.open();
  }
}

customElements.define(YpMagicTextBoxDialog.is, YpMagicTextBoxDialog);
