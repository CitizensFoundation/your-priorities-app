import '@polymer/polymer/polymer-legacy.js';
import 'lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { YpPostBehavior } from '../yp-post/yp-post-behaviors.js';
import '../yp-user/yp-user-image.js';
import './ac-notification-truncated-name-list.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class AcNotificationListGenaralItemLit extends YpBaseElement {
  static get properties() {
    return {
      notification: {
        type: Object,
        observer: '_notificationChanged'
      },
  
      user: {
        type: Object,
        value: null
      },
  
      nameTruncated: {
        type: String,
        computed: '_nameTruncated(notification)'
      },
  
      icon: {
        type: String
      },
  
      shortText: {
        type: String
      },
  
      shortTextTruncated: {
        type: String,
        computed: '_shortTextTruncated(shortText)'
      }
    }
  }

  static get styles() {
    return [
      css`

      .pointerCursor {
        cursor: pointer;
      }

      .icon {
        min-width: 24px;
        min-height: 24px;
        max-width: 24px;
        max-height: 24px;
        margin: 6px;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .name {
        padding-top: 4px;
        padding-bottom: 0;
        font-style: italic;
        color: #777;
      }

      .shortText {
        padding-right: 8px;
        color: #444;
        padding-bottom: 4px;
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
    <div class="layout vertical pointerCursor" @tap="${this._goTo}">
      <div class="layout horizontal">
        <div class="layout vertical center-center self-start leftContainer">
          <yp-user-image .small="" .user="${this.user}"></yp-user-image>
          <iron-icon .icon="${this.icon}" class="icon"></iron-icon>
        </div>
        <div class="layout vertical">
          <div class="name">${this.nameTruncated}</div>
          <div ?hidden="${!this.shortText}" class="shortText">${this.shortTextTruncated}</div>
        </div>
      </div>
    </div>
    `
  }

/*
  behaviors: [
    
    YpPostBehavior,
    ypGotoBehavior,
    ypTruncateBehavior,
    ypMediaFormatsBehavior
  ],
*/

  _goTo() {
    const gotoLocation;
    if (this.post) {
      this.goToPost(this.post.id)
    } else {
      if (this.notification.AcActivities[0].Group && this.notification.AcActivities[0].Group.name!="hidden_public_group_for_domain_level_points") {
        gotoLocation = "/group/"+this.notification.AcActivities[0].Group.id+"/news/"+this.notification.AcActivities[0].id
      } else if (this.notification.AcActivities[0].Community) {
        gotoLocation = "/community/"+this.notification.AcActivities[0].Community.id+"/news/"+this.notification.AcActivities[0].id
      } else if (this.notification.AcActivities[0].Domain) {
        gotoLocation = "/domain/" + this.notification.AcActivities[0].Domain.id + "/news/" + this.notification.AcActivities[0].id
      }
      if (gotoLocation) {
        this.redirectTo(gotoLocation);
      }
    }
  }

  _nameTruncated(notification) {
    if (notification.AcActivities[0].Post) {
      return this.truncate(notification.AcActivities[0].Post.name, 42);
    } else if (notification.AcActivities[0].Group && notification.AcActivities[0].Group.name!="hidden_public_group_for_domain_level_points") {
      return this.truncate(notification.AcActivities[0].Group.name, 42);
    } else if (notification.AcActivities[0].Community) {
      return this.truncate(notification.AcActivities[0].Community.name, 42);
    } else if (notification.AcActivities[0].Domain) {
      return this.truncate(notification.AcActivities[0].Domain.name, 42);
    }
  }

  _shortTextTruncated(shortText) {
    if (shortText) {
      return this.truncate(shortText, 60);
    } else {
      return "";
    }
  }

  goToPost() {
    if (this.post) {
      const postUrl = '/post/' + this.post.id + '/news';
      window.appGlobals.activity('open', 'post', postUrl);
      this.async(function () {
        this.redirectTo(postUrl);
        this.fire('yp-close-right-drawer');
      });
    }
  }

  _notificationChanged(notification) {
    if (notification) {
      this.post = notification.AcActivities[0].Post;
      this.user = notification.AcActivities[0].User;
    } else {
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

window.customElements.define('ac-notifcation-list-genaral-item-lit', AcNotificationListGenaralItemLit)
