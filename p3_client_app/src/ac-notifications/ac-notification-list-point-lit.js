import '@polymer/polymer/polymer-legacy.js';
import 'lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { YpPostBehavior } from '../yp-post/yp-post-behaviors.js';
import '../yp-user/yp-user-image.js';
import { YpTruncatedNameList } from './ac-notification-truncated-name-list.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class AcNotificationListPointLit extends YpBaseElement {
  static get properties() {
    return {
      notification: {
        type: Object,
        observer: '_notificationChanged'
      },
  
      helpfulsText: {
        type: String,
        value: null
      },
  
      unhelpfulsText: {
        type: String,
        value: null
      },
  
      pointValueUp: {
        type: Boolean,
        computed: '_pointValueUp(point)'
      },
  
      newPointMode: Boolean,
      qualityMode: Boolean,
      point: {
        type: Object
      },
      pointContent: String,
      user: {
        type: Object,
        value: null
      },
      postName: String,
      postNameTruncated: {
        type: String,
        computed: '_postNameTruncated(postName)'
      }
    }
  }

  static get styles() {
    return [
      css`

      .pointerCursor {
        cursor: pointer;
      }

      .endorsers {
      }

      .opposers {
      }

      .chatIcon {
        min-width: 24px;
        min-height: 24px;
        max-width: 24px;
        max-height: 24px;
        margin: 6px;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .thumbsIcon {
        color: #999;
        margin-top: 0;
        padding-top: 0;
        min-width: 20px;
        min-height: 20px;
        max-width: 20px;
        max-height: 20px;
      }

      .smallIcons {
        max-width: 16px;
        max-height: 16px;
        min-width: 16px;
        min-height: 16px;
        padding-top: 2px;
        padding-right: 2px;
      }

      .postName {
        padding-top: 4px;
        padding-bottom: 0;
        font-style: italic;
        color: #777;
      }

      .postName[point-value-up] {
      }

      .pointContent {
        padding-bottom: 4px;
        color: #444;
      }

      .pointContent[point-value-up] {
      }

      .leftContainer {
        margin-right: 8px;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <div class="layout vertical pointerCursor" @tap="${this.goToPost}" ?hidden="${!this.post}">
      <div class="layout horizontal">
        <div class="layout vertical center-center self-start leftContainer">
          <yp-user-image .small="" .user="${this.user}"></yp-user-image>
          <iron-icon .icon="chat-bubble-outline" class="chatIcon"></iron-icon>
          <div ?hidden="${!this.pointValueUp}"><iron-icon .icon="thumb-up" class="chatIcon thumbsIcon"></iron-icon></div>
          <div ?hidden="${this.pointValueUp}"><iron-icon .icon="thumb-down" class="chatIcon thumbsIcon"></iron-icon></div>
        </div>
        <div class="layout vertical">
          <div .pointValueUp="${this.pointValueUp}" class="layout horizontal pointContent">
            ${this.pointContent}
          </div>
          <div class="layout horizontal" ?hidden="${!this.helpfulsText}">
            <iron-icon .icon="arrow-upward" class="smallIcons endorsers"></iron-icon>
            <div class="endorsers">${this.helpfulsText}</div>
          </div>
          <div class="layout horizontal" ?hidden="${!this.unhelpfulsText}">
            <iron-icon .icon="arrow-downward" class="smallIcons opposers"></iron-icon>
            <div class="opposers">${this.unhelpfulsText}</div>
          </div>
          <div class="postName">${this.postNameTruncated}</div>
        </div>
      </div>
    </div>
    `
  }

/*
  behaviors: [
    YpPostBehavior,
    YpTruncatedNameList,
    ypGotoBehavior,
    ypTruncateBehavior,
    ypMediaFormatsBehavior
  ],
*/

  _postNameTruncated(postName) {
    if (postName) {
      return this.truncate(postName, 42);
    } else {
      return "";
    }
  }

  _pointValueUp(point) {
    return (point && point.value > 0);
  }

  goToPost() {
    if (this.post) {
      const postUrl = '/post/' + this.post.id;
      if (this.point) {
        postUrl += '/' + this.point.id;
      }
      window.appGlobals.activity('open', 'post', postUrl);
      this.async(function () {
        this.redirectTo(postUrl);
        this.fire('yp-close-right-drawer');
      });
    }
  }

  _notificationChanged(notification) {
    if (notification) {
      this.point = notification.AcActivities[0].Point;
      this.post = notification.AcActivities[0].Post;
      this.user = notification.AcActivities[0].User;
      if (this.point) {
        this.pointContent = this.truncate(this.point.content, 72);
      }
      if (notification.type=='notification.point.new') {
        this.newPointMode = true;
      } else if (notification.type=='notification.point.quality') {
        this.qualityMode = true;
        this._createQualityStrings();
      }
    } else {
      this.helpfulsText = null;
      this.unhelpfulsText = null;
      this.newPointMode = null;
      this.qualityMode = null;
    }
  }

  _createQualityStrings() {
    let helpfuls;
    let unhelpfuls;

    this.notification.AcActivities.forEach(function (activity) {
      if (activity.type=='activity.point.helpful.new') {
        if (!helpfuls) {
          helpfuls = "";
        }
        helpfuls = this._addWithComma(helpfuls, activity.User.name);
      } else if (activity.type=='activity.point.unhelpful.new') {
        if (!unhelpfuls) {
          unhelpfuls = "";
        }
        unhelpfuls = this._addWithComma(unhelpfuls, activity.User.name);
      }
    }.bind(this));

    if (helpfuls && helpfuls!="") {
      this.helpfulsText = this.truncateNameList(helpfuls);
    }

    if (unhelpfuls && unhelpfuls!="") {
      this.unhelpfulsText = this.truncateNameList(unhelpfuls);
    }
  }

  _addWithComma(text, toAdd) {
    let returnText = "";
    if (text!='') {
      returnText += text+",";
    }
    return returnText+toAdd;

  }
}

window.customElements.define('ac-notification-list-point-lit', AcNotificationListPointLit) 
