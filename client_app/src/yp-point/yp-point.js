import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import '../../../../lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import '../yp-behaviors/emoji-selector.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-point-actions.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
        @apply --layout-vertical;
      }

      .point-content {
        @apply --layout-vertical;
        padding-right: 16px;
        padding-left: 16px;
      }

      #pointContent {
        cursor: default;
      }

      #pointContent[link-point] {
        cursor: pointer;
      }

      @media (max-width: 320px) {
        .user-image {
          display: none;
        }
      }

      .userInfoContainer {
        border-bottom: solid 3px;
        width: 100%;
        padding-bottom: 16px;
        margin-bottom: 16px;
      }

      .userInfoContainer[up-vote] {
        border-bottom-color:  var(--master-point-up-color);
      }

      .userInfoContainer[down-vote] {
        border-bottom-color: var(--master-point-down-color);
      }

      paper-icon-button {
        color: #ccc;
      }

      #reportPointIconButton {
        color: #ddd;
        width: 36px;
        height: 36px;
      }

      .thumbsIcon {
        padding-left: 16px;
      }

      @media (min-width: 985px) {
        .thumbsIcon {
          display: none;
        }
      }

      iron-icon.thumbsIconUp {
        color: var(--master-point-up-color);
      }

      iron-icon.thumbsIconDown {
        color: var(--master-point-down-color);
      }

      yp-user-with-organization {
        padding-left: 16px;
      }

      .actionContainer {
        margin-top: 8px;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>
    <lite-signal on-lite-signal-logged-in="_userLoggedIn"></lite-signal>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout vertical">

      <div class="userInfoContainer layout horizontal" up-vote\$="[[upVote(point)]]" down-vote\$="[[downVote(point)]]" hidden\$="[[hideUser]]">
        <iron-icon icon="thumb-up" class="thumbsIcon thumbsIconUp" hidden\$="[[!pointValueUp]]"></iron-icon>
        <iron-icon icon="thumb-down" class="thumbsIcon thumbsIconDown" hidden\$="[[pointValueUp]]"></iron-icon>
        <div class="layout horizontal" hidden\$="[[point.Post.Group.configuration.hidePointAuthor]]">
          <yp-user-with-organization title-date="[[point.created_at]]" inverted="" user\$="[[user]]"></yp-user-with-organization>
        </div>
      </div>

      <div class="point-content">
        <span hidden\$="[[!point.name]]">
          <span>[[point.name]]</span>.
        </span>
        <div id="pointContent" link-point\$="[[linkPoint]]" hidden\$="[[isEditing]]" on-tap="_linkIfNeeded">
          <yp-magic-text text-type="pointContent" content-language="[[point.language]]" content="[[point.latestContent]]" content-id="[[point.id]]">
          </yp-magic-text>
        </div>
        <template is="dom-if" if="[[isEditing]]" restamp="">
          <div class="layout vertical">
            <paper-textarea id="pointContentEditor" char-counter="" maxlength="500" value="{{editText}}"></paper-textarea>
            <div class="horizontal end-justified layout">
              <emoji-selector id="pointEmojiSelector"></emoji-selector>
            </div>
            <div class="layout horizontal self-end">
              <paper-button on-tap="_cancelEdit">[[t('cancel')]]</paper-button>
              <paper-button on-tap="_saveEdit">[[t('update')]]</paper-button>
            </div>
          </div>
        </template>
        <div class="layout horizontal actionContainer">
          <yp-point-actions point="[[point]]" point-url\$="[[pointUrl]]"></yp-point-actions>
          <paper-icon-button hidden\$="[[!loggedInUser]]" title\$="[[t('point.report')]]" id="reportPointIconButton" icon="warning" on-tap="_reportPoint"></paper-icon-button>
          <div class="flex"></div>
          <template is="dom-if" if="[[hasPointAccess]]">
            <div class="layout horizontal self-end" hidden\$="">
              <yp-ajax id="editPointAjax" method="PUT" on-response="_editResponse"></yp-ajax>
              <yp-ajax id="deletePointAjax" method="DELETE" on-response="_deleteResponse"></yp-ajax>
              <paper-icon-button title\$="[[t('edit')]]" hidden\$="[[!canEditPoint]]" icon="create" on-tap="_editPoint"></paper-icon-button>
              <paper-icon-button title\$="[[t('delete')]]" icon="clear" on-tap="_deletePoint"></paper-icon-button>
            </div>
          </template>
        </div>
      </div>
    </div>
`,

  is: 'yp-point',

  properties: {

    point: {
      type: Object,
      notify: true,
      observer: "_pointChanged"
    },

    linkPoint: {
      type: Boolean,
      value: false
    },

    hasPointAccess: {
      type: Boolean,
      computed: '_hasPointAccess(point, gotAdminRights, loggedInUser)'
    },

    canEditPoint: {
      type: Boolean,
      computed: '_canEditPoint(point, gotAdminRights, loggedInUser)'
    },

    user: {
      type: Object,
      value: null
    },

    hideUser: {
      type: Boolean,
      value: false
    },

    isEditing: {
      type: Boolean,
      value: false,
      observer: '_isEditingChanged'
    },

    maxNumberOfPointsBeforeEditFrozen: {
      type: Number,
      value: 5
    },

    pointValueUp: {
      type: Boolean,
      computed: 'upVote(point)'
    },

    pointUrl: {
      type: String,
      computed: '_pointUrl(point)'
    },

    editText: String
  },

  behaviors: [
    ypLanguageBehavior,
    AccessHelpers,
    ypLoggedInUserBehavior,
    ypGotAdminRightsBehavior,
    ypGotoBehavior
  ],

  _isEditingChanged: function (value) {
    this._updateEmojiBindings(value);
    this.async(function () {
      this.fire('iron-resize');
    });
  },

  _shareTap: function (event, detail) {
    window.appGlobals.activity('pointShareOpen', detail.brand, this.point.id);
  },

  _pointUrl: function (point) {
    if (point && point.Post) {
      return window.location.protocol+"//"+window.location.hostname+"/post/"+point.Post.id+"/"+point.id;
    }
  },

  _linkIfNeeded: function () {
    if (this.linkPoint) {
      this.goToPost(this.point.Post.id, this.point.id);
    }
  },

  _updateEmojiBindings: function (isEditing) {
    if (isEditing) {
      this.async(function () {
        var point = this.$$("#pointContentEditor");
        var emoji = this.$$("#pointEmojiSelector");
        if (point && emoji) {
          emoji.inputTarget = point;
        } else {
          console.error("Wide: Can't bind point edit emojis :(");
        }
      }.bind(this), 500);
    }
  },

  _cancelEdit: function () {
    //this._setlatestContent(this.point);
    this.set('isEditing', false);
  },

  _saveEdit: function () {
    this.$$("#editPointAjax").url = "/api/points/"+this.point.id;
    this.$$("#editPointAjax").body = { content: this.editText };
    this.$$("#editPointAjax").generateRequest();
  },

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
      var point = detail.response;
      point.latestContent = point.PointRevisions[point.PointRevisions.length-1].content;
      this.set('point', point);
    }
    this.set('isEditing', false);
  },

  _deleteResponse: function () {
    this.fire("yp-point-deleted", { pointId: this.point.id });
    this.set('point', null);

  },

  _reportPoint: function () {
    window.appGlobals.activity('open', 'point.report');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
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

  _editPoint: function () {
    if (this._hasPointAccess(this.point)) {
      this.set('editText', this.point.PointRevisions[this.point.PointRevisions.length-1].content);
      this.set('isEditing', true);
    }
  },

  _hasPointAccess: function (point) {
    return this.checkPointAccess(point);
  },

  _canEditPoint: function (point) {
    var isEligible = (point && (point.counter_quality_up + point.counter_quality_down) <= this.maxNumberOfPointsBeforeEditFrozen);
    return isEligible && window.appUser && window.appUser.user && window.appUser.user.id==point.user_id;
  },

  _pointChanged: function(point, oldValue) {
    if (point) {
      this.set('user', this.point.User);
    } else {
      this.set('user', null);
    }
  },

  loginName: function () {
    return this.point.User.name;
  },

  upVote: function(point) {
    if (point) {
      if (point.value == 0) {
        return true;
      } else {
        return point.value>0;
      }
    } else {
      console.warn("Can't find point for upVote");
      return false;
    }
  },

  downVote: function(point) {
    if (point) {
      if (point.value == 0) {
        return true;
      } else {
        return point.value<0;
      }
    } else {
      console.warn("Can't find point for upVote");
      return false;
    }
  },

  computeClass: function (point) {
    var ret = 'description ';
    if (point) {
      if (point.value>0)
        ret += 'for';
      else
        ret += 'against';
      return ret;
    } else {
      console.warn("Can't find point for upVote");
      return ret;
    }
  }
});
