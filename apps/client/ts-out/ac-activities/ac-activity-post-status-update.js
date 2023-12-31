var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import '../yp-magic-text/yp-magic-text.js';
let AcActivityPostStatusUpdate = class AcActivityPostStatusUpdate extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
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
          cursor: pointer;
        }

        .groupName {
          padding-left: 32px;
          padding: 16px;
          font-size: 14px;
          padding-bottom: 8px;
        }
      `,
        ];
    }
    render() {
        return html `
      <div class="layout vertical">
        <div class="groupName">
          ${this.activity.Group.name}
        </div>
        <yp-magic-text
          @click="${this._goToPost}"
          class="postName"
          textOnly
          textType="postName"
          .contentLanguage="${this.activity.Post.language}"
          .content="${this.activity.Post.name}"
          .contentId="${this.activity.Post.id}">
        </yp-magic-text>
        <yp-magic-text
          id="statusChange"
          class="statusChange"
          .extraId="${this.activity.Post.id}"
          textType="statusChangeContent"
          .contentLanguage="${this.activity.PostStatusChange.language}"
          simpleFormat
          .content="${this.statusContent}"
          .contentId="${this.activity.PostStatusChange.id}">
        </yp-magic-text>
      </div>
    `;
    }
    _goToPost() {
        if (this.activity.Post) {
            YpNavHelpers.goToPost(this.activity.Post.id, undefined, this.activity);
        }
    }
    get statusContent() {
        if (this.activity &&
            this.activity.PostStatusChange &&
            this.activity.PostStatusChange.content) {
            return this.activity.PostStatusChange.content;
        }
        else {
            return null;
        }
    }
};
__decorate([
    property({ type: Object })
], AcActivityPostStatusUpdate.prototype, "activity", void 0);
AcActivityPostStatusUpdate = __decorate([
    customElement('ac-activity-post-status-update')
], AcActivityPostStatusUpdate);
export { AcActivityPostStatusUpdate };
//# sourceMappingURL=ac-activity-post-status-update.js.map