import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../yp-behaviors/yp-language-behavior.js';
import { html as html$0 } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom as dom$0 } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import twemoji from 'twemoji';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';
import { constants } from 'buffer';

class YpMagicTextBoxDialog extends YpBaseElement {
  static get properties() {
    return {

    }
  }

  static get styles() {
    return [
      css`

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
      `, YpFlexLayout]
  }

  render() {
    return html`

    <paper-dialog id="dialog">
      <h2>${this.pageTitle}</h2>
      <paper-dialog-scrollable>
        <div ?hidden="${!this.finalContent}" inner-h-t-m-l="${this.finalContent}"></div>
        <div ?hidden="${this.finalContent}">${this.content}</div>
      </paper-dialog-scrollable>
      <div class="buttons">
        <mwc-button raised dialog-dismiss .label="${this.closeDialogText}"></mwc-button>
      </div>
    </paper-dialog>
    <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>
    <lite-signal @lite-signal-yp-auto-translate="${this._autoTranslateEvent}"></lite-signal>

    <iron-ajax id="getTranslationAjax" on-response="_getTranslationResponse"></iron-ajax>
`
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
    this.$$("#dialog").open();
  }
}