import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-user/yp-user-image.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">

      .userName {
        color: #777;
      }

      yp-user-image {
        padding-top: 16px;
        padding-right: 8px;
      }

      .userName {
        padding-bottom: 4px;
      }

      .comment {
        margin-left: 8px;
        margin-right: 8px;
        padding-bottom: 4px;
        margin-bottom: 8px;
        padding-top: 16px;
      }

      .commentDash {
        border-bottom: dashed #ddd;
        border-bottom-width: 1px;
      }

      yp-point-actions {
        padding-top: 8px;
      }

      #reportPointIconButton {
        color: #ddd;
        width: 36px;
        height: 36px;
      }

      [hidden] {
        display: none !important;
      }

      #deleteButton {
        color: #bbb;
      }
    </style>

    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>
    <lite-signal on-lite-signal-logged-in="_userLoggedIn"></lite-signal>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout horizontal">
      <div class="layout horizontal">
        <yp-user-image user="[[user]]"></yp-user-image>
      </div>
      <div class="layout vertical">
        <div class="comment">
          [[point.content]]
          <div class="layout horizontal" hidden\$="[[!point]]">
            <yp-point-actions point="[[point]]" hide-sharing=""></yp-point-actions>
            <paper-icon-button hidden="" hiddedn\$="[[!loggedInUser]]" title\$="[[t('point.report')]]" id="reportPointIconButton" icon="warning" on-tap="_reportPoint"></paper-icon-button>
            <template is="dom-if" if="[[hasPointAccess]]">
              <div class="layout horizontal self-end" hidden\$="">
                <yp-ajax id="deletePointAjax" method="DELETE" on-response="_deleteResponse"></yp-ajax>
                <paper-icon-button id="deleteButton" title\$="[[t('delete')]]" icon="clear" on-tap="_deletePoint"></paper-icon-button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
`,

  is: 'yp-point-comment',

  properties: {

    point: {
      type: Object,
      notify: true,
      observer: "_pointChanged"
    },

    user: {
      type: Object
    },

    hideUser: {
      type: Boolean,
      value: false
    },

    hasPointAccess: {
      type: Boolean,
      computed: '_hasPointAccess(point, gotAdminRights, loggedInUser)'
    }
  },

  behaviors: [
    ypLanguageBehavior,
    AccessHelpers,
    ypLoggedInUserBehavior,
    ypGotAdminRightsBehavior
  ],

  _deletePoint: function () {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('point.confirmDelete'), this._reallyDeletePoint.bind(this));
    }.bind(this));
  },

  _reallyDeletePoint: function () {
    this.$$("#deletePointAjax").url = "/api/points/"+this.point.id;
    this.$$("#deletePointAjax").body = {};
    this.$$("#deletePointAjax").generateRequest();
  },

  _editResponse: function (event, detail) {
    if (detail.response) {
      this.set('point', detail.response)
    }
    this.set('isEditing', false);
  },

  _deleteResponse: function () {
    this.fire("yp-point-deleted", { pointId: this.point.id });
    this.fire("iron-resize");
    this.set('point', null);
  },

  _reportPoint: function () {
    window.appGlobals.activity('open', 'point.report');
    var dialog = dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/points/' + this.point.id + '/report',
        this.t('reportConfirmation'),
        this._onReport.bind(this),
        this.t('point.report'),
        'PUT');
      dialog.open();
    }.bind(this));
  },

  _onReport: function () {
    window.appGlobals.notifyUserViaToast(this.t('point.report')+': '+this.point.content);
  },

  _pointChanged: function(newValue, oldValue) {
    if (newValue) {
      this.user = this.point.PointRevisions[0].User;
    } else {
      this.user = null;
    }
  },

  _hasPointAccess: function (point) {
    return this.checkPointAccess(point);
  },

  loginName: function () {
    return this.point.PointRevisions[0].User.name;
  }
});
