import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class AcActivityPostStatusUpdateLit extends YpBaseElement {
  static get properties() {
    return {
      activity: {
        type: Object
      },
  
      statusContent: {
        type: String,
        computed: '_statusContent(activity)'
      }
    }
  }

  static get styles() {
    return [
      css`

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
    `, YpFlexLayout]
  }

  render() {
    return html`
    <div class="layout vertical">
      <div class="groupName">
        ${this.activity.Group.name}
      </div>
      <yp-magic-text @tap="${this._goToPost}" class="postName" .textOnly .textType="postName" .contentLanguage="${this.activity.Post.language}" .content="${this.activity.Post.name}" .contentId="${this.activity.Post.id}">
      </yp-magic-text>
      <yp-magic-text id="statusChange" class="statusChange" .extraId="${this.activity.Post.id}" .textType="statusChangeContent" .contentLanguage="${this.activity.PostStatusChange.language}" simple-format content="${this.statusContent}" .contentId="${this.activity.PostStatusChange.id}">
      </yp-magic-text>
    </div>
`
  }

/*
  behaviors: [
    ypGotoBehavior
  ],
*/


  _goToPost() {
    if (this.activity.Post) {
      this.goToPost(this.activity.Post.id, null, this.activity);
    }
  }

  _statusContent(newValue) {
    if (newValue && newValue.PostStatusChange && newValue.PostStatusChange.content) {
      return newValue.PostStatusChange.content;
    }
  }

  formatContent(statusUpdate) {
    if (statusUpdate && statusUpdate) {
      return statusUpdate.replace(/(\r\n)/g,"<br>");
    } else {
      return '';
    }
  }
}

window.customElements.define('ac-activity-post-status-update-lit', AcActivityPostStatusUpdateLit)
