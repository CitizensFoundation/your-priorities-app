import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../yp-post/yp-post-cover-media.js';
import { YpPostBehavior } from '../yp-post/yp-post-behaviors.js';
import '../yp-group/yp-group-behaviors.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypActivityGroupTitleBehavior } from './yp-activity-group-title-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class AcActivityPostLit extends YpBaseElement {
  static get properties() {
    return {
      activity: {
        type: Object
      },

      postId: {
        type: Number,
        value: null
      },

      wide: {
        type: Boolean,
        value: false
      },

      isIE11: {
        type: Boolean,
        computed: '_isIE11(wide)'
      }
    }
  }

  static get styles() {
    return [
      super.styles,
      css`

      .descriptionOuter {
        color: var(--primary-color-more-darker, #424242);
        line-height: var(--description-line-height, 1.3);
        margin: 0;
        padding-bottom: 8px;
        padding-top: 8px;
        margin-bottom: 48px;
        width: 100% !important;
      }

      .mainContainerItem[is-ie11] {
        max-width: 480px !important;
      }

      @media (max-width: 600px) {
        .mainContainerItem[is-ie11] {
          max-width: 290px !important;
        }
      }

      .description, .post-name {
        padding-left: 16px;
        padding-right: 16px;
      }

      .post-name {
        font-size: 24px;
        padding-bottom: 4px;
        margin: 0;
        padding-top: 0;
        margin-top: 16px;
      }

      .voting {
        position: absolute;
        bottom: 0;
        right: 16px;
      }

      .card-actions {
        position: absolute;
        bottom: 36px;
        right: 0;
      }


      .category-icon {
        width: 64px;
        height: 64px;
      }

      .category-image-container {
        text-align: right;
        margin-top: -52px;
      }

      .postCardCursor {
        cursor: pointer;
      }

      yp-post-cover-media {
        width: 432px;
        height: 258px;
        padding-bottom: 4px;
        margin-top: 8px;
      }

      .postCard {
        width: 960px;
        background-color: #fff;
      }

      @media (max-width: 960px) {
        :host {
          width: 420px;
        }

        .postCard {
          height: 100%;
          width: 420px;
        }

        yp-post-cover-media {
          width: 300px;
          height: 166px;
        }

        .voting {
          padding-left: 0;
          padding-right: 0;
        }

        .card-actions {
          width: 320px;
        }

        .card-content {
          width: 420px !important;
          padding-bottom: 74px;
        }

        .description {
          width: 300px;
        }
      }

      :host {
        width: 304px;
      }

      .postCard {
        height: 100% !important;
        width: 304px !important;
      }

      .actionInfo {
        font-size: 22px;
        margin-top: 16px;
        padding-left: 16px;
        padding-right: 16px;
        margin-bottom: 16px;
      }

      @media (max-width: 420px) {
        .description {
          width: 290px;
        }


        yp-post-cover-media {
          width: 304px !important;
          height: 168px !important;
        }
      }

      .groupTitle {
        font-size: 15px;
        padding-top: 8px;
        color: #777;
      }

      .hasPointer {
        cursor: pointer;
      }
      ]
  }

  render() {
    return html`
    ${this.activity ? html`
    <div class="layout vertical hasPointer" @tap="${this._goToPost}">
      <div class="actionInfo">
        ${this.t('addedAnIdea')}
      </div>
      <div class="layout horizontal center-center">
        <yp-post-cover-media post="${this.activity.Post}"></yp-post-cover-media>
      </div>
      <div class="layout vertical center-center">
        <yp-magic-text class="post-name mainContainerItem" is-ie11="${this.isIE11}" .textOnly="" .textType="postName" .contentLanguage="${this.activity.Post.language}" .content="${this.activity.Post.name}" .contentId="${this.activity.Post.id}">
        </yp-magic-text>
      </div>
      <div class="layout vertical center-center descriptionOuter">
        <div id="description" class="description mainContainerItem" is-ie11="${this.isIE11}">
          <template is="jucy-html" html="${this.activity.Post.description}"></template>
        </div>

      ${this.hasGroupHeader ? html`
        <div class="groupTitle layout horizontal center-center">${this.groupTitle}</div>
      `: html``}

      </div>
    </div>
` : html``}
`
  }

/*
  behaviors: [
    YpPostBehavior,
    ypActivityGroupTitleBehavior,
    ypTruncateBehavior,
    ypMediaFormatsBehavior,
    ypGotoBehavior
  ],
*/

  _goToPost() {
    if (this.activity.Post && !this.postId) {
      this.goToPost(this.activity.Post.id, null, this.activity);
    }
  }

  _isIE11() {
    return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
  }
}

