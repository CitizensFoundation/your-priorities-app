import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-point/yp-point.js';
import '../yp-point/yp-point-news-story.js';
import '../yp-magic-text/yp-magic-text.js';
import { ypActivityGroupTitleBehavior } from './yp-activity-group-title-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class AcActivityPointNewsStoryLit extends YpBaseElement {
  static get properties() {
    return {
      activity: {
        type: Object
      },

      postId: {
        type: Boolean,
        value: null
      }
    }
  }

  static get styles() {
    return [
      css`

      .newsStoryContainer {
        padding-left: 8px;
        padding-right: 8px;
      }

      .postName {
        cursor: pointer;
        margin-top: 16px;
        padding-left: 8px;
        padding-right: 8px;
        color: #555;
      }

      .groupTitle {
        font-size: 15px;
        color: #777;
        padding-bottom: 16px;
        margin: 0;
        padding-top: 0;
      }

      .hasPointer {
        cursor: pointer;
      }

      .mainContainer {
        width: auto;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <div class="layout vertical mainContainer">
      <yp-magic-text @tap="${this._goToPost}" class="postName" ?hidden="${!this.activity.Post.name}" .textOnly="" .textType="postName" .contentLanguage="${this.activity.Post.language}" .content="${this.activity.Post.name}" .contentId="${this.activity.Post.id}">
      </yp-magic-text>
      <div class="layout vertical center-center newsStoryContainer">
        <yp-point-news-story with-comments ?hideUser class="card" .point="${this.activity.Point}"></yp-point-news-story>
      </div>

      ${this.hasGroupHeader ? html`
        <div class="groupTitle layout horizontal center-center">${this.groupTitle}</div>
      `: html``}
    </div>
`
  }

/*
  behaviors: [
    ypActivityGroupTitleBehavior,
    ypGotoBehavior
  ],
*/

  _goToPost(){
    this.goToPost(this.activity.Post.id, null, this.activity);
  }

  _hidePostName(activity) {
    return (this.postId!=null);
  }
}
