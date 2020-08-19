import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-fab/paper-fab.js';
import '@material/mwc-button';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPageDialogLit extends YpBaseElement {
  static get properties() {
    return {
      title: {
        type: String
      },
      page: Object,
      pageTitle: {
        type: String,
        computed: '_pageTitle(page, language)'
      }
    }
  }

  static get styles() {
    return [
      css`

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

      paper-dialog[rtl] {
        direction: rtl;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
   <paper-dialog id="dialog" ?rtl="${this.rtl}">
      <div ?hidden="${!this.pageTitle}">
        <h2>${this.pageTitle}</h2>
      </div>
      <paper-dialog-scrollable>
        <div id="content"></div>
      </paper-dialog-scrollable>
      <div class="buttons">
        <mwc-button @click="${this._close}" .dialogDismiss .label="${this.t('close')}"></mwc-button>
      </div>
    </paper-dialog>
`
  }

  _pageTitle(page, language) {
    if (page) {
      return page.title;
    } else {
      return "";
    }
  }

  open(title, content) {
    this.title = title;
    this.$$("#content").innerHTML = content;
    this.$$("#dialog").fit();
    this.$$("#dialog").notifyResize();
    this.$$("#dialog").open();
  }

  _close() {
    this.title = null;
    this.$$("#content").innerHTML = '';
  }
}

window.customElements.define('yp-page-dialog-lit', YpPageDialogLit)
