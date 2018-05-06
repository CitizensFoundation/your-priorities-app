import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-input/paper-input.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .additionalSettings {
        padding-top: 16px;
      }

      .half {
        width: 50%;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog id="editDialog" double-width="" icon="language" action="[[action]]" method="[[method]]" title="[[editHeaderText]]" params="[[params]]" save-text="[[saveText]]" toast-text="[[toastText]]">
      <div class="layout vertical">
        <paper-input id="name" name="name" type="text" label="[[t('name')]]" value="{{bulkStatusUpdate.name}}" maxlength="60" char-counter="" class="mainInput">
        </paper-input>

        <paper-textarea id="emailHeader" name="emailHeader" value="{{bulkStatusUpdate.config.emailHeader}}" always-float-label="[[bulkStatusUpdate.config.emailHeader]]" label="[[t('emailHeader')]]" char-counter="" rows="4" max-rows="5" maxlength="30000" class="mainInput">
        </paper-textarea>

        <paper-textarea id="emailFooter" name="emailFooter" value="{{bulkStatusUpdate.config.emailFooter}}" always-float-label="[[bulkStatusUpdate.config.emailFooter]]" label="[[t('emailFooter')]]" char-counter="" rows="4" max-rows="5" maxlength="30000" class="mainInput">
        </paper-textarea>

      </div>

   </yp-edit-dialog>
`,

  is: 'yp-bulk-status-update-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    ypGotoBehavior
  ],

  properties: {

    action: {
      type: String,
      value: "/api/bulk_status_updates"
    },

    bulkStatusUpdate: {
      type: Object,
      observer: "_bulkStatusUpdateChanged"
    },

    params: {
      type: String
    },

    method: {
      type: String
    }
  },

  _customRedirect: function (bulkStatusUpdate) {
    if (bulkStatusUpdate) {
     // this.redirectTo("/bulkStatusUpdate/"+bulkStatusUpdate.id);
    } else {
      console.warn('No bulkStatusUpdate found on custom redirect');
    }
  },

  _bulkStatusUpdateChanged: function (newValue, oldValue) {
  },

  _clear: function () {
    this.set('bulkStatusUpdate', { name: '', description: '', access: 0 });
  },

  setup: function (bulkStatusUpdate, newNotEdit, refreshFunction) {
    if (!bulkStatusUpdate) {
      this.set('bulkStatusUpdate', { name: '', emailHeader: '', emailFooter: '' });
    } else {
      this.set('bulkStatusUpdate', bulkStatusUpdate);
    }
    this.set('new', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
  },

  _setupTranslation: function () {
    if (this.new) {
      this.set('editHeaderText', this.t('newBulkStatusUpdate'));
      this.set('toastText', this.t('bulkStatusUpdate.toast.created'));
      this.set('saveText', this.t('create'));
    } else {
      this.set('editHeaderText', this.t('editBulkStatusUpdate'));
      this.set('toastText', this.t('bulkStatusUpdate.toast.updated'));
      this.set('saveText', this.t('update'));
    }
  }
});
