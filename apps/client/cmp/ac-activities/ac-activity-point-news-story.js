var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { AcActivityWithGroupBase } from './ac-activity-with-group-base.js';
import '../yp-magic-text/yp-magic-text.js';
//import '../yp-point/yp-point-news-story.js';
let AcActivityPointNewsStory = class AcActivityPointNewsStory extends AcActivityWithGroupBase {
    static get styles() {
        return [
            super.styles,
            css `
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

        .mainContainer {
          width: auto;
        }
      `,
        ];
    }
    render() {
        return html `
      <div class="layout vertical mainContainer">
        ${this.activity.Post
            ? html `
              <yp-magic-text
                @click="${this._goToPost}"
                class="postName"
                ?hidden="${!this.activity.Post.name}"
                textOnly
                textType="postName"
                .contentLanguage="${this.activity.Post.language}"
                .content="${this.activity.Post.name}"
                .contentId="${this.activity.Post.id}">
              </yp-magic-text>
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
            ? html `
              <div class="groupTitle layout horizontal center-center">
                ${this.groupTitle}
              </div>
            `
            : nothing}
      </div>
    `;
    }
    _goToPost() {
        YpNavHelpers.goToPost(this.activity.Post.id, undefined, this.activity);
    }
    get hidePostName() {
        return this.postId != null;
    }
};
AcActivityPointNewsStory = __decorate([
    customElement('ac-activity-point-news-story')
], AcActivityPointNewsStory);
export { AcActivityPointNewsStory };
//# sourceMappingURL=ac-activity-point-news-story.js.map