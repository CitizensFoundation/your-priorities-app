import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpBulkStatusUpdateEditLit extends YpBaseElement {
  static get properties() {
    return {
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
    }
  }
  
  static get styles() {
    return [
      css`
      .additionalSettings {
        padding-top: 16px;
      }

      .half {
        width: 50%;
      }
    `, YpFLexLayout]
  }

  render() {
    return html`
    <yp-edit-dialog id="editDialog" double-width="" .icon="language" .action="${this.action}" .method="${this.method}" .title="${this.editHeaderText}" .params="${this.params}" .saveText="${this.saveText}" .toastText="${this.toastText}">
      <div class="layout vertical">
        <paper-input id="name" .name="name" .type="text" .label="${this.t('name')}" .value="${this.bulkStatusUpdate.name}" .maxlength="60" char-counter class="mainInput">
        </paper-input>

        <paper-textarea id="emailHeader" .name="emailHeader" .value="${this.bulkStatusUpdate.config.emailHeader}" .alwaysFloatLabel="${this.bulkStatusUpdate.config.emailHeader}" .label="${this.t('emailHeader')}" char-counter .rows="4" .max-rows="5" .maxlength="30000" class="mainInput">
        </paper-textarea>

        <paper-textarea id="emailFooter" .name="emailFooter" .value="${this.bulkStatusUpdate.config.emailFooter}" .alwaysFloatLabel="${this.bulkStatusUpdate.config.emailFooter}" .label="${this.t('emailFooter')}" char-counter .rows="4" .max-rows="5" .maxlength="30000" class="mainInput">
        </paper-textarea>

      </div>

   </yp-edit-dialog>
` 
  }

/*
  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    ypGotoBehavior
  ],
*/
  
  _customRedirect(bulkStatusUpdate) {
    if (bulkStatusUpdate) {
     // this.redirectTo("/bulkStatusUpdate/"+bulkStatusUpdate.id);
    } else {
      console.warn('No bulkStatusUpdate found on custom redirect');
    }
  }

  _bulkStatusUpdateChanged(newValue, oldValue) {
  }

  _clear() {
    this.set('bulkStatusUpdate', { name: '', description: '', access: 0 });
  }

  setup(bulkStatusUpdate, newNotEdit, refreshFunction) {
    if (!bulkStatusUpdate) {
      this.set('bulkStatusUpdate', { name: '', emailHeader: '', emailFooter: '' });
    } else {
      this.set('bulkStatusUpdate', bulkStatusUpdate);
    }
    this.set('new', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
  }

  _setupTranslation() {
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
}

window.customElements.define('yp-bulk-status-update-config-lit', YpBulkStatusUpdateEditLit)
