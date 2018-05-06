import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-point/yp-point.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .pointContainer {
      }
      .point {
        padding: 8px;
        margin: 8px;
        @apply --layout-vertical;
      }

      .pointText {
        margin-bottom: 16px;
        padding: 16px;
        width: 360px;
      }

      yp-point {
        margin-bottom: 36px;
      }

      @media (max-width: 480px) {
        yp-point {
          width: 307px;
        }
      }

      .pointLayout {
        width: 46%;
      }

      .postName {
        padding-left: 32px;
        font-weight: bold;
        font-size: 24px;
        padding-bottom: 12px;
      }

      .actionInfo {
        font-size: 22px;
        margin-top: 16px;
        padding-left: 16px;
      }

      .post-name {
        font-size: 26px;
        padding-bottom: 8px;
        margin: 0;
        padding-top: 0;
        margin-top: 8px;
        margin-left: 24px;
      }

      .withCursor {
        cursor: pointer;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <div class="layout vertical pointContainer">
      <div class="actionInfo withCursor" hidden\$="[[!_isUpVote(activity.Point)]]" on-tap="_goToPoint">
        [[t('point.forAdded')]]...
      </div>
      <div class="actionInfo withCursor" hidden\$="[[!_isDownVote(activity.Point)]]" on-tap="_goToPoint">
        [[t('point.againstAdded')]]...
      </div>
      <div class="layout vertical">
        <yp-magic-text class="post-name withCursor" on-tap="_goToPoint" text-only="" text-type="postName" content-language="[[activity.Post.language]]" content="[[activity.Post.name]]" content-id="[[activity.Post.id]]">
        </yp-magic-text>
        <yp-point hide-user="" link-point\$="[[!postId]]" class="card" point="[[activity.Point]]"></yp-point>
      </div>
    </div>
`,

  is: 'ac-activity-point',

  behaviors: [
    ypLanguageBehavior,
    ypGotoBehavior
  ],

  properties: {

    activity: {
      type: Object,
      observer: '_activityChanged'
    },

    postId: {
      type: Number,
      value: null
    }
  },

  _goToPoint: function () {
    if (!this.postId) {
      this.goToPost(this.activity.Post.id, this.activity.Point.id)
    }
  },

  _activityChanged: function (newValue) {
  },

  _isUpVote: function (point) {
    return point && point.value > 0;
  },

  _isDownVote: function (point) {
    return point && point.value < 0;
  }
});
