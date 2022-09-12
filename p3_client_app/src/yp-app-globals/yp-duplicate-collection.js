import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

// WORK IN PROGRESS - NOT COMPLETED OR USED AT THE MOMENT

Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      .additionalSettings {
        padding-top: 16px;
      }

      paper-textarea {
        padding-top: 16px;
      }

      .groupName {
        cursor: pointer;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog id="editDialog" title="[[editHeaderText]]" icon="language" confirmation-text="[[t('close')]]" action="[[action]]" method="[[method]]" params="[[params]]" save-text="[[saveText]]" toast-text="[[toastText]]">

      <paper-input id="name" name="name" type="text" label="[[t('newName')]]" value="{{community.name}}" maxlength="60" minlength="1" required="" char-counter="" class="mainInput">
      </paper-input>

      <paper-input id="hostname" name="hostname" type="text" allowed-pattern="[a-z0-9-]" label="[[t('newHostname')]]" value="{{community.hostname}}" maxlength="80" minlength="1" required="[[!community.is_community_folder]]" char-counter="" class="mainInput">
      </paper-input>

      <paper-input id="google_analytics_code" name="google_analytics_code" type="text" label="[[t('newAnalyticsTrackerCode')]]" value="{{community.google_analytics_code}}" maxlength="40" style="width: 200px;">
      </paper-input>

      <paper-progress id="progress" hidden=""></paper-progress>

      <div class="layout horizontal center-center">
        <yp-ajax method="PUT" id="duplicatCollectionAjax" on-response="_duplicateCollectionResponse"></yp-ajax>
        <yp-ajax method="PUT" id="duplicatCollectionProgressAjax" on-response="_duplicatCollectionProgressResponse"></yp-ajax>
      </div>
    </yp-edit-dialog>
`,

  is: 'yp-duplicate-collection',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    AccessHelpers
  ],

  properties: {

    action: {
      type: String,
      value: "/api/communities"
    },

    community: {
      type: Object
    },

    group: {
      type: Object,
    }
  },

  _selectGroup: function (event) {
    this.set('selectedGroupId', event.target.getAttribute('data-args'));
    var groupName = event.target.getAttribute('data-args-name');
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('post.confirmMove')+' "'+this.post.name+'" '+this.t('to')+' "'+groupName+'"', this._reallyMove.bind(this));
    }.bind(this));
  },

  _reallyDuplicate: function () {
    this.$.movePostAjax.url="/api/communities/"+this.community.id+'/duplicate';
    this.$.movePostAjax.body = {};
    this.$.movePostAjax.generateRequest();
  },

  _duplicateCollectionResponse: function () {
    this.$.progress.hidden = false;
  },

  _clear: function () {
    this.set('community', null);
    this.set('group', null);
  },

  setupAndOpen: function (community, refreshFunction) {
    this.set('community', community);
    this.set('community.name', "COPY - "+community.name);
    this.set('community.hostname', "copy-"+community.hostname);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
    this.open();
  },

  _setupTranslation: function () {
    this.set('editHeaderText', this.t('duplicateCommunity'));
    this.set('toastText', this.t('haveDuplicatedCommunity'));
    this.set('saveText', this.t('duplicate'));
  }
});
