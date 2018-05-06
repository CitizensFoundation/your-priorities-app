import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-radio-button/paper-radio-button.js';
import '../../../../@polymer/paper-radio-group/paper-radio-group.js';
import '../yp-file-upload/yp-file-upload.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .access {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
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
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog id="editDialog" title="[[editHeaderText]]" icon="business-center" action="[[action]]" method="[[method]]" params="[[params]]" save-text="[[saveText]]" toast-text="[[toastText]]">
      <h2 slot="h2">[[editHeaderText]]</h2>

      <div class="layout vertical">
        <paper-input id="name" name="name" type="text" label="[[t('name')]]" value="{{organization.name}}" maxlength="60" char-counter="" class="mainInput">
        </paper-input>

        <paper-textarea id="description" name="description" value="{{organization.description}}" always-float-label="[[organization.description]]" label="[[t('description')]]" char-counter="" rows="2" max-rows="5" maxlength="300" class="mainInput">
        </paper-textarea>

        <paper-input id="website" name="website" type="text" label="[[t('website')]]" value="{{organization.website}}" maxlength="256" char-counter="" class="mainInput">
        </paper-input>
      </div>

      <div class="layout horizontal">
        <div class="layout vertical additionalSettings half">
          <yp-file-upload id="logoImageUpload" raised="true" multi="false" target="/api/images?itemType=organization-logo" method="POST" on-success="_logoImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('image.logo.upload')]]</span>
          </yp-file-upload>
        </div>

        <div class="layout vertical additionalSettings half">
          <yp-file-upload id="headerImageUpload" raised="true" multi="false" target="/api/images?itemType=organization-header" method="POST" on-success="_headerImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('image.header.upload')]]</span>
          </yp-file-upload>
        </div>
      </div>

      <input type="hidden" name="uploadedLogoImageId" value="[[uploadedLogoImageId]]">
      <input type="hidden" name="uploadedHeaderImageId" value="[[uploadedHeaderImageId]]">

      <h3 class="accessHeader">[[t('Access')]]</h3>
      <paper-radio-group id="access" name="access" class="access" selected="{{organizationAccess}}">
        <paper-radio-button name="public">[[t('public')]]</paper-radio-button>
        <paper-radio-button name="closed">[[t('closed')]]</paper-radio-button>
        <paper-radio-button name="secret">[[t('secret')]]</paper-radio-button>
      </paper-radio-group>

    </yp-edit-dialog>
`,

  is: 'yp-organization-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    ypGotoBehavior
  ],

  properties: {

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
  },

  _customRedirect: function (organization) {
    if (organization) {
     // this.redirectTo("/organization/"+organization.id);
    } else {
      console.warn('No organization found on custom redirect');
    }
  },

  _organizationChanged: function (newValue, oldValue) {
    if (this.organization.access===0) {
      this.organizationAccess = "public"
    } else if (this.organization.access===1) {
      this.organizationAccess = "closed"
    } else if (this.organization.access===2) {
      this.organizationAccess = "secret"
    }
  },

  _clear: function () {
    this.set('organization', { name: '', description: '', access: 0 });
    this.set('uploadedLogoImageId', null);
    this.set('uploadedHeaderImageId', null);
    this.$.headerImageUpload.clear();
    this.$.logoImageUpload.clear();
  },

  setup: function (organization, newNotEdit, refreshFunction) {
    if (!organization) {
      this.set('organization', { name: '', description: '', access: 0 });
    } else {
      this.set('organization', organization);
    }
    this.set('new', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
  },

  _setupTranslation: function () {
    if (this.new) {
      this.set('editHeaderText', this.t('organization.new'));
      this.set('toastText', this.t('organization.toast.created'));
      this.set('saveText', this.t('create'));
    } else {
      this.set('editHeaderText', this.t('Update organization info'));
      this.set('toastText', this.t('organization.toast.updated'));
      this.set('saveText', this.t('update'));
    }
  }
});
