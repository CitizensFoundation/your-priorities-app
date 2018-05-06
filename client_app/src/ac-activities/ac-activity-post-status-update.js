import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
      }

      .statusChange {
        padding-left: 32px;
        padding-right: 32px;
        margin-bottom: 64px;
        font-size: 16px;
        overflow-y: auto;
        max-height: 360px;
      }

      .postName {
        padding-left: 32px;
        padding-right: 32px;
        font-weight: bold;
        font-size: 19px;
        margin-bottom: 8px;
        color: #444;
        cursor: pointer;
      }

      .groupName {
        padding-left: 32px;
        padding: 16px;
        font-size: 14px;
        padding-bottom: 8px;
      }
    </style>

    <div class="layout vertical">
      <div class="groupName">
        [[activity.Group.name]]
      </div>
      <yp-magic-text on-tap="_goToPost" class="postName" text-only="" text-type="postName" content-language="[[activity.Post.language]]" content="[[activity.Post.name]]" content-id="[[activity.Post.id]]">
      </yp-magic-text>
      <yp-magic-text id="statusChange" class="statusChange" extra-id="[[activity.Post.id]]" text-type="statusChangeContent" content-language="[[activity.PostStatusChange.language]]" simple-format="" content="[[statusContent]]" content-id="[[activity.PostStatusChange.id]]">
      </yp-magic-text>
    </div>
`,

  is: 'ac-activity-post-status-update',

  behaviors: [
    ypLanguageBehavior,
    ypGotoBehavior
  ],

  properties: {

    activity: {
      type: Object
    },

    statusContent: {
      type: String,
      computed: '_statusContent(activity)'
    }
  },

  _goToPost: function () {
    if (this.activity.Post) {
      this.goToPost(this.activity.Post.id);
    }
  },

  _statusContent: function (newValue) {
    if (newValue && newValue.PostStatusChange && newValue.PostStatusChange.content) {
      return newValue.PostStatusChange.content;
    }
  },

  formatContent: function (statusUpdate) {
    if (statusUpdate && statusUpdate) {
      return statusUpdate.replace(/(\r\n)/g,"<br>");
    } else {
      return '';
    }
  }
});
