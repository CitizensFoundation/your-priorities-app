import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-list/iron-list.js';
import '../../../../@polymer/paper-fab/paper-fab.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import '../../../../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-ajax/yp-ajax.js';
import { WordWrap } from '../yp-behaviors/word-wrap.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
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
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="editTemplateLocale" modal="" class="layout vertical">
      <h2>[[t('editTemplate')]]</h2>

      <paper-dialog-scrollable>
        <paper-input id="title" name="title" type="text" label="[[t('title')]]" value="{{currentlyEditingTitle}}" maxlength="60" char-counter="" class="mainInput">
        </paper-input>

        <paper-textarea id="content" name="content" value="{{currentlyEditingContent}}" always-float-label="[[currentlyEditingContent]]" label="[[t('templateContent')]]" rows="7" max-rows="10">
        </paper-textarea>
      </paper-dialog-scrollable>


      <div class="buttons">
        <paper-button on-tap="_clearTemplateEdit" dialog-dismiss="">[[t('close')]]</paper-button>
        <paper-button on-tap="_updateTemplate" dialog-dismiss="">[[t('save')]]</paper-button>
      </div>
    </paper-dialog>

    <paper-dialog id="dialog" modal="">
      <h2>[[t('editTemplates')]]</h2>
      <paper-dialog-scrollable>
        <iron-list items="[[templates]]" as="template">
          <template>
            <div class="layout horizontal">
              <div class="templateItem title">
                [[template.title]]
              </div>
              <paper-button data-args\$="[[index]]" on-tap="_editTemplate">[[t('editTemplate')]]</paper-button>
              <paper-button data-args\$="[[template.title]]" on-tap="_deleteTemplate">[[t('deleteTemplate')]]</paper-button>
            </div>
          </template>
        </iron-list>
      </paper-dialog-scrollable>
      <div class="layout horizontal">
        <paper-button id="addTemplateButton" on-tap="_addTemplate">[[t('addTemplate')]]</paper-button>
      </div>

      <div class="buttons">
        <paper-button dialog-dismiss="">[[t('close')]]</paper-button>
      </div>
    </paper-dialog>
`,

  is: 'yp-bulk-status-update-templates',

  behaviors: [
    ypLanguageBehavior,
    WordWrap
  ],

  properties: {
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
  },

  _templatesChanged: function (templates) {
    if (templates) {
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: {name: 'bulk-status-updates-templates', data: this.templates }
        })
      );
    }
  },

  _editTemplate: function (event) {
    this.set('currentlyEditingTemplate', JSON.parse(event.target.getAttribute('data-args')));
    this.set('currentlyEditingContent',this.wordwrap(120)(this.templates[this.currentlyEditingTemplate]["content"]));
    this.set('currentlyEditingTitle',this.templates[this.currentlyEditingTemplate]["title"]);
    this.$.editTemplateLocale.open();
  },

  _clearTemplateEdit: function () {
    this.set('currentlyEditingTemplate', null);
    this.set('currentlyEditingContent', null);
    this.set('currentlyEditingTitle', null);
  },

  _updateTemplate: function () {
    var templatesCopy = JSON.parse(JSON.stringify(this.templates));
    this.templates.forEach(function (template, index) {
      if (index == this.currentlyEditingTemplate) {
        templatesCopy[index] = { title: this.currentlyEditingTitle, content: this.currentlyEditingContent };
      }
    }.bind(this));
    this.set('templates', templatesCopy);
    this._clearTemplateEdit();
  },

  _deleteTemplate: function () {
    var templateTitle = event.target.getAttribute('data-args');
    var templatesCopy = this.templates;
    this.templates.forEach(function (template, index) {
      if (template.title == templateTitle) {
        templatesCopy.splice(index,1);
      }
    }.bind(this));
    this.set('templates', templatesCopy);
  },

  _addTemplate: function (event) {
    if (!this.templates) {
      this.set('templates', []);
    }
    this.push('templates', { title: '', content: ''});
  },

  open: function (templates) {
    this.set('templates', templates);
    this.$.dialog.open();
  },

  _setupHeaderText: function () {
    this.set('headerText', this.t('bulkStatusUpdatesTemplates'));
  }
});
