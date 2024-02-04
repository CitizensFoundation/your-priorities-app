var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { AcActivityWithGroupBase } from './ac-activity-with-group-base.js';
import '../yp-magic-text/yp-magic-text.js';
import { YpPostBaseWithAnswers } from '../yp-post/yp-post-base-with-answers.js';
let AcActivityPost = class AcActivityPost extends YpPostBaseWithAnswers(AcActivityWithGroupBase) {
    static get styles() {
        return [
            super.styles,
            css `
        .descriptionOuter {
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

        .description,
        .post-name {
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
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
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
        }

        .hasPointer {
          cursor: pointer;
        }
      `,
        ];
    }
    //TODO: Check jucy-html below
    render() {
        return html `
      ${this.activity && this.activity.Post
            ? html `
            <div class="layout vertical hasPointer" @click="${this._goToPost}">
              <div class="actionInfo">${this.t('addedAnIdea')}</div>
              <div class="layout horizontal center-center">
                <yp-post-cover-media
                  .post="${this.activity.Post}"
                ></yp-post-cover-media>
              </div>
              <div class="layout vertical center-center">
                <yp-magic-text
                  class="post-name mainContainerItem"
                  is-ie11="${this.isIE11}"
                  textOnly
                  textType="postName"
                  .contentLanguage="${this.activity.Post.language}"
                  .content="${this.activity.Post.name}"
                  .contentId="${this.activity.Post.id}"
                >
                </yp-magic-text>
              </div>
              <div class="layout vertical center-center descriptionOuter">
                <div
                  id="description"
                  class="description mainContainerItem"
                  is-ie11="${this.isIE11}"
                >
                  <yp-magic-text
                    id="description"
                    textType="postContent"
                    .contentLanguage="${this.activity.Post.language}"
                    .content="${this.structuredAnswersFormatted}"
                    ?noUserInfo="${!this.activity.Post.Group.configuration
                .showWhoPostedPosts}"
                    simpleFormat
                    skipSanitize
                    .contentId="${this.activity.Post.id}"
                    class="description"
                    .truncate="${this.activity.Post.Group.configuration
                .descriptionTruncateAmount}"
                    .moreText="${this.t('readMore')}"
                    .closeDialogText="${this.t('close')}"
                  >
                  </yp-magic-text>
                </div>

                ${this.hasGroupHeader
                ? html `
                      <div class="groupTitle layout horizontal center-center">
                        ${this.groupTitle}
                      </div>
                    `
                : html ``}
              </div>
            </div>
          `
            : html ``}
    `;
    }
    connectedCallback() {
        super.connectedCallback();
        this.post = this.activity.Post;
    }
    _goToPost() {
        if (this.activity.Post && !this.postId) {
            YpNavHelpers.goToPost(this.activity.Post.id, undefined, this.activity);
        }
    }
    get isIE11() {
        return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    }
};
AcActivityPost = __decorate([
    customElement('ac-activity-post')
], AcActivityPost);
export { AcActivityPost };
//# sourceMappingURL=ac-activity-post.js.map