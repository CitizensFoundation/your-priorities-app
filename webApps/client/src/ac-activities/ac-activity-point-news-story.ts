import { html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { AcActivityWithGroupBase } from './ac-activity-with-group-base.js';

import '../yp-magic-text/yp-magic-text.js';
import '../yp-point/yp-point-news-story.js';


@customElement('ac-activity-point-news-story')
export class AcActivityPointNewsStory extends AcActivityWithGroupBase {
  static override get styles() {
    return [
      super.styles,
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
        }

        .groupTitle {
          font-size: 15px;
          padding-bottom: 16px;
          margin: 0;
          padding-top: 0;
        }

        .hasPointer {
          cursor: pointer;
        }

        a.postName {
          color: inherit;
          display: block;
          text-decoration: none;
        }

        .mainContainer {
          width: auto;
        }
      `,
    ];
  }

  override render() {
    return html`
      <div class="layout vertical mainContainer">
        ${this.activity.Post
          ? html`
              <a
                href="${this.postUrl}"
                @click="${this._goToPost}"
                class="postName"
                aria-label="${this.activity.Post.name}"
                ?hidden="${!this.activity.Post.name}"
              >
                <yp-magic-text
                  textOnly
                  textType="postName"
                  .contentLanguage="${this.activity.Post.language}"
                  .content="${this.activity.Post.name}"
                  .contentId="${this.activity.Post.id}">
                </yp-magic-text>
              </a>
            `
          : nothing}
        <div class="layout vertical center-center newsStoryContainer">
          <yp-point-news-story
            withComments
            hideUser
            class="card"
            .point="${this.activity.Point}"></yp-point-news-story>
        </div>

        ${this.hasGroupHeader
          ? html`
              <div class="groupTitle layout horizontal center-center">
                ${this.groupTitle}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  get postUrl() {
    return this.activity?.Post
      ? YpNavHelpers.withForAgentBundle(`/post/${this.activity.Post.id}`)
      : "#";
  }

  _goToPost(event?: Event) {
    if (this.shouldHandleAnchorClick(event)) {
      YpNavHelpers.goToPost(this.activity.Post!.id, undefined, this.activity);
    }
  }

  get hidePostName() {
    return this.postId != null;
  }
}
