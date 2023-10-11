import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-fab/paper-fab.js';
import '@material/mwc-button';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../yp-ajax/yp-ajax.js';
import { WordWrap } from '../yp-behaviors/word-wrap.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpBulkStatusTemplatesLit extends YpBaseElement {
  static get properties() {
    return {
      templates: {
        type: Array,
        notify: true,
        observer: '_templatesChanged'
      },

      headerText: {
        type: String
      },

      selected: {
        type: Object
      },

      currentlyEditingTemplate: {
        type: Object
      },

      currentlyEditingTitle: {
        type: String
      },

      currentlyEditingContent: {
        type: String
      }
    }
  }

  static get styles() {
    return [
      css`

      #dialog {
        width: 90%;
        max-height: 90%;
        background-color: #FFF;
      }

      iron-list {
        color: #000;
        height: 500px;
        width: 100%;
      }

      .templateItem {
        padding-right: 16px;
      }

      .id {
        width: 60px;
      }

      .title {
        width: 200px;
      }

      .email {
        width: 240px;
      }

      #editTemplateLocale {
        width: 80%;
        max-height: 80%;
        background-color: #FFF;
      }

      .locale {
        width: 30px;
        cursor: pointer;
      }

      paper-textarea {
        height: 60%;
      }

      .localeInput {
        width: 26px;
      }

      .templateItem {
        padding-top: 8px;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-dialog id="editTemplateLocale" modal class="layout vertical">
      <h2>${this.t('editTemplate')}</h2>

      <paper-dialog-scrollable>
        <paper-input id="title" .name="title" .type="text" .label="${this.t('title')}" .value="${this.currentlyEditingTitle}" .maxlength="60" char-counter class="mainInput">
        </paper-input>

        <paper-textarea id="content" .name="content" .value="${this.currentlyEditingContent}" alwaysFloatLabel="${this.currentlyEditingContent}" .label="${this.t('templateContent')}" .rows="7" .max-rows="10">
        </paper-textarea>
      </paper-dialog-scrollable>


      <div class="buttons">
        <mwc-button @click="${this._clearTemplateEdit}" dialog-dismiss>${this.t('close')}</mwc-button>
        <mwc-button @click="${this._updateTemplate}" dialog-dismiss>${this.t('save')}</mwc-button>
      </div>
    </paper-dialog>

    <paper-dialog id="dialog" modal>
      <h2>${this.t('editTemplates')}</h2>
      <paper-dialog-scrollable>
        <iron-list .items="${this.templates}" as="template">
          <template>
            <div class="layout horizontal">
              <div class="templateItem title">
                ${this.template.title}
              </div>
              <mwc-button data-args="${this.index}" @click="${this._editTemplate}">${this.t('editTemplate')}</mwc-button>
              <mwc-button data-args="${this.template.title}" @click="${this._deleteTemplate}">${this.t('deleteTemplate')}</mwc-button>
            </div>
          </template>
        </iron-list>
      </paper-dialog-scrollable>
      <div class="layout horizontal">
        <mwc-button id="addTemplateButton" @click="${this._addTemplate}">${this.t('addTemplate')}</mwc-button>
      </div>

      <div class="buttons">
        <mwc-button dialog-dismiss>${this.t('close')}</mwc-button>
      </div>
    </paper-dialog>
`
  }


/*
  behaviors: [
    WordWrap
  ],
*/

  _templatesChanged(templates) {
    if (templates) {
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: {name: 'bulk-status-updates-templates', data: this.templates }
        })
      );
    }
  }

  _editTemplate(event) {
    this.currentlyEditingTemplate = JSON.parse(event.target.getAttribute('data-args'));
    this.currentlyEditingContent = this.wordwrap(120)(this.templates[this.currentlyEditingTemplate]["content"]);
    this.currentlyEditingTitle = this.templates[this.currentlyEditingTemplate]["title"];
    this.$$("#editTemplateLocale").open();
  }

  _clearTemplateEdit() {
    this.currentlyEditingTemplate = null;
    this.currentlyEditingContent = null;
    this.currentlyEditingTitle = null;
  }

  _updateTemplate() {
    const templatesCopy = JSON.parse(JSON.stringify(this.templates));
    this.templates.forEach(function (template, index) {
      if (index == this.currentlyEditingTemplate) {
        templatesCopy[index] = { title: this.currentlyEditingTitle, content: this.currentlyEditingContent };
      }
    }.bind(this));
    this.templates = templatesCopy;
    this._clearTemplateEdit();
  }

  _deleteTemplate() {
    const templateTitle = event.target.getAttribute('data-args');
    const templatesCopy = this.templates;
    this.templates.forEach(function (template, index) {
      if (template.title == templateTitle) {
        templatesCopy.splice(index,1);
      }
    }.bind(this));
    this.templates = templatesCopy;
  }

  _addTemplate(event) {
    if (!this.templates) {
      this.templates = [];
    }
    this.push('templates', { title: '', content: ''});
  }

  open(templates) {
    this.templates = templates;
    this.$$("#dialog").open();
  }

  _setupHeaderText() {
    this.headerText = this.t('bulkStatusUpdatesTemplates');
  }
}

window.customElements.define('yp-bulk-status-update-templates-lit', YpBulkStatusTemplatesLit)
