import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../yp-point/yp-point.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class AcActivityPointLit extends YpBaseElement {
  static get properties() {
    return {
      activity: {
        type: Object,
        observer: '_activityChanged'
      },
  
      postId: {
        type: Number,
        value: null
      }  
    }
  }
  
  static get styles() {
    return [
      css`

      .pointContainer { 
      }
      .point {
        padding: 8px;
        margin: 8px;
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
          width: 100%;
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
    `, YpFlexLayout]
  }

  render() {
    return html`
    <div class="layout vertical pointContainer">
      <div class="actionInfo withCursor" ?hidden="${!this._isUpVote(activity.Point)}" @tap="${this._goToPoint}">
        ${this.t('point.forAdded')}...
      </div>
      <div class="actionInfo withCursor" ?hidden="${!this._isDownVote(activity.Point)}" @tap="${this._goToPoint}">
        ${this.t('point.againstAdded')}...
      </div>
      <div class="layout vertical">
        <yp-magic-text class="post-name withCursor" @tap="${this._goToPoint}" .textOnly .textType="postName" .contentLanguage="${this.activity.Post.language}" .content="${this.activity.Post.name}" .contentId="${this.activity.Post.id}">
        </yp-magic-text>
        <yp-point ?hideUser .linkPoint="${!this.postId}" class="card" .point="${this.activity.Point}"></yp-point>
      </div>
    </div>
`
  }

/*
  behaviors: [
    ypGotoBehavior
  ],
*/

  _goToPoint() {
    if (!this.postId) {
      this.goToPost(this.activity.Post.id, this.activity.Point.id, this.activity)
    }
  }

  _activityChanged(newValue) {
  }

  _isUpVote(point) {
    return point && point.value > 0;
  }

  _isDownVote(point) {
    return point && point.value < 0;
  }
}

window.customElements.define('ac-activity-point-lit', AcActivityPointLit)
