import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '../yp-file-upload/yp-file-upload.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpOrganizationEditLit extends YpBaseElement {
  static get properties() {
    return {
      action: {
        type: String,
        value: "/api/organizations"
      },

      organization: {
        type: Object,
        observer: "_organizationChanged"
      },

      organizationAccess: {
        type: String,
        value: "public"
      },

      params: {
        type: String
      },

      method: {
        type: String
      },

      uploadedLogoImageId: {
        type: String
      },

      uploadedHeaderImageId: {
        type: String
      }
    }
  }

  static get properties() {
    return [
      css`

      .access {
      }

      .accessHeader {
        color: var(--primary-color,#777);
        font-weight: normal;
        margin-bottom: 0;
      }

      paper-radio-button {
        display: block;
      }

      .additionalSettings {
        padding-top: 16px;
      }

      .half {
        width: 50%;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <yp-edit-dialog id="editDialog" .title="${this.editHeaderText}" .icon="business-center" .action="${this.action}" .method="${this.method}" .params="${this.params}" .saveText="${this.saveText}" .toastText="${this.toastText}">
      <h2 .slot="h2">${this.editHeaderText}</h2>

      <div class="layout vertical">
        <paper-input id="name" .name="name" .type="text" .label="${this.t('name')}" .value="${this.organization.name}" .maxlength="60" char-counter class="mainInput">
        </paper-input>

        <paper-textarea id="description" .name="description" .value="${this.organization.description}" .alwaysFloatLabel="${this.organization.description}" .label="${this.t('description')}" char-counter .rows="2" .maxRows="5" .maxlength="300" class="mainInput">
        </paper-textarea>

        <paper-input id="website" .name="website" .type="text" .label="${this.t('website')}" value="${this.organization.website}" .maxlength="256" char-counter class="mainInput">
        </paper-input>
      </div>

      <div class="layout horizontal">
        <div class="layout vertical additionalSettings half">
          <yp-file-upload id="logoImageUpload" raised multi="false" .target="/api/images?itemType=organization-logo" .method="POST" @success="${this._logoImageUploaded}">
            <iron-icon class="icon" .icon="photo-camera"></iron-icon>
            <span>${this.t('image.logo.upload')}</span>
          </yp-file-upload>
        </div>

        <div class="layout vertical additionalSettings half">
          <yp-file-upload id="headerImageUpload" raised multi="false" .target="/api/images?itemType=organization-header" .method="POST" @success="${this_headerImageUploaded}">
            <iron-icon class="icon" .icon="photo-camera"></iron-icon>
            <span>${this.t('image.header.upload')}</span>
          </yp-file-upload>
        </div>
      </div>

      <input .type="hidden" .name="uploadedLogoImageId" .value="${this.uploadedLogoImageId}">
      <input .type="hidden" .name="uploadedHeaderImageId" .value="${this.uploadedHeaderImageId}">

      <h3 class="accessHeader">${this.t('Access')}</h3>
      <paper-radio-group id="access" .name="access" class="access" .selected="${this.organizationAccess}">
        <paper-radio-button .name="public">${this.t('public')}</paper-radio-button>
        <paper-radio-button .name="closed">${this.t('closed')}</paper-radio-button>
        <paper-radio-button .name="secret">${this.t('secret')}</paper-radio-button>
      </paper-radio-group>

    </yp-edit-dialog>
`
  }
/*
  behaviors: [
    ypEditDialogBehavior,
    ypGotoBehavior
  ],
*/

  _customRedirect(organization) {
    if (organization) {
     // this.redirectTo("/organization/"+organization.id);
    } else {
      console.warn('No organization found on custom redirect');
    }
  }

  _organizationChanged(newValue, oldValue) {
    if (this.organization.access===0) {
      this.organizationAccess = "public"
    } else if (this.organization.access===1) {
      this.organizationAccess = "closed"
    } else if (this.organization.access===2) {
      this.organizationAccess = "secret"
    }
  }

  _clear() {
    this.organization = { name: '', description: '', access: 0 };
    this.uploadedLogoImageId = null;
    this.uploadedHeaderImageId = null;
    this.$("#headerImageUpload").clear();
    this.$("#logoImageUpload").clear();
  }

  setup(organization, newNotEdit, refreshFunction) {
    if (!organization) {
      this.organization = { name: '', description: '', access: 0 };
    } else {
      this.organization = organization;
    }
    this.new = newNotEdit;
    this.refreshFunction = refreshFunction;
    this._setupTranslation();
  }

  _setupTranslation() {
    if (this.new) {
      this.editHeaderText = this.t('organization.new');
      this.toastText = this.t('organization.toast.created');
      this.saveText = this.t('create');
    } else {
      this.editHeaderText = this.t('Update organization info');
      this.toastText = this.t('organization.toast.updated');
      this.saveText = this.t('update');
    }
  }
}

window.customElements.define('yp-organization-edit-lit', YpOrganizationEditLit)
