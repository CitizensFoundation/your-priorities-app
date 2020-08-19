import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { ypOfficialStatusOptions } from '../yp-behaviors/yp-official-status-options.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPostStatusChangeEditLit extends YpBaseElement {
  static get properties() {
    return {
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

    }
  }

  static get styles() {
    return [
      css`

      .additionalSettings {
        padding-top: 16px;
      }

      paper-textarea {
        padding-top: 16px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`

    <yp-edit-dialog id="editDialog" title="${this.editHeaderText}" ?doubleWidth .icon="language" .confirmationText="${this.t('post.statusChangeConfirmText')}" .action="${this.action}" method="${this.method}" params="${this.params}" .saveText="${this.saveText}" .toastText="${this.toastText}">
      <div class="layout horizontal center-center">
        <paper-dropdown-menu .label="${this.t('post.statusChangeSelectNewStatus')}">
          <paper-listbox slot="dropdown-content" attrForSelected="name" .selected="${this.officialStatus}">

            ${ this.officialStatusOptions.map(statusOption =>  html`
              <paper-item name="${this.statusOption.official_value}">${this.statusOption.translatedName}</paper-item>
            `)}

          </paper-listbox>
        </paper-dropdown-menu>
        <input type="hidden" .name="official_status" .value="${this.officialStatus}">
      </div>

      <div class="layout vertical">
        <paper-textarea id="content" .name="content" .value="${this.postStatusChange.content}" .alwaysFloatLabel="${this.postStatusChange.content}" .label="${this.t('post.statusChangeContent')}" char-counter .rows="10" .maxRows="10" .maxlength="100000" class="mainInput">
        </paper-textarea>
      </div>
    </yp-edit-dialog>
    `
  }

/*
  behaviors: [
    ypEditDialogBehavior,
    ypOfficialStatusOptions
  ],
*/

  _postChanged(newValue, oldValue) {
    if (newValue) {
      this.officialStatus = this.post.official_status;
    }
  }

  _clear() {
    this.postStatusChange = { content: '' };
    this.post = null;
  }

  setup(post, postStatusChange, refreshFunction) {
    this.post = post;
    if (!postStatusChange) {
      this.postStatusChange = { content: ''};
    } else {
      this.postStatusChange = postStatusChange;
    }
    this.refreshFunction = refreshFunction;
    this._setupTranslation();
  }

  _setupTranslation() {
    this.editHeaderText = this.t('post.statusChange');
    this.toastText = this.t('post.statusChangeSent');
    this.saveText = this.t('post.statusChange');
  }
}

window.customElements.define('yp-post-status-change-edit-lit', YpPostStatusChangeEditLit)
