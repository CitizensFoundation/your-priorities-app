import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypOfficialStatusOptions } from '../yp-behaviors/yp-official-status-options.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      .additionalSettings {
        padding-top: 16px;
      }

      paper-textarea {
        padding-top: 16px;
      }
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog id="editDialog" title="[[editHeaderText]]" double-width="" icon="language" confirmation-text="[[t('post.statusChangeConfirmText')]]" action="[[action]]" method="[[method]]" params="[[params]]" save-text="[[saveText]]" toast-text="[[toastText]]">
      <div class="layout horizontal center-center">
        <paper-dropdown-menu label="[[t('post.statusChangeSelectNewStatus')]]">
          <paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{officialStatus}}">
            <template is="dom-repeat" items="[[officialStatusOptions]]" as="statusOption">
              <paper-item name="[[statusOption.official_value]]">[[statusOption.translatedName]]</paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
        <input type="hidden" name="official_status" value="[[officialStatus]]">
      </div>

      <div class="layout vertical">
        <paper-textarea id="content" name="content" value="{{postStatusChange.content}}" always-float-label="[[postStatusChange.content]]" label="[[t('post.statusChangeContent')]]" char-counter="" rows="10" max-rows="10" maxlength="100000" class="mainInput">
        </paper-textarea>
      </div>
    </yp-edit-dialog>
`,

  is: 'yp-post-status-change-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    ypOfficialStatusOptions
  ],

  properties: {

    action: {
      type: String,
      value: "/api/posts"
    },

    post: {
      type: Object,
      observer: "_postChanged"
    },

    params: {
      type: String
    },

    method: {
      type: String
    },

    officialStatus: Number,

    postStatusChange: Object
  },

  _postChanged: function (newValue, oldValue) {
    if (newValue) {
      this.set('officialStatus', this.post.official_status);
    }
  },

  _clear: function () {
    this.set('postStatusChange', { content: '' });
    this.set('post', null);
  },

  setup: function (post, postStatusChange, refreshFunction) {
    this.set('post', post);
    if (!postStatusChange) {
      this.set('postStatusChange', { content: ''});
    } else {
      this.set('postStatusChange', postStatusChange);
    }
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
  },

  _setupTranslation: function () {
    this.set('editHeaderText', this.t('post.statusChange'));
    this.set('toastText', this.t('post.statusChangeSent'));
    this.set('saveText', this.t('post.statusChange'));
  }
});
