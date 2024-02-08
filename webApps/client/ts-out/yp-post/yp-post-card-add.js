var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
import '../yp-magic-text/yp-magic-text.js';
import "@material/web/icon/icon.js";
let YpPostCardAdd = class YpPostCardAdd extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.disableNewPosts = false;
    }
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
        :host {
          margin-top: 8px;
          margin-bottom: 8px;
          width: 100%;
        }

        .postCard {
          width: 100%;
          min-height: 75px;
          margin-top: 8px;
          padding: 16px;
          background-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          cursor: pointer;
          margin-bottom: 24px;
          text-align: center;
          max-width: 310px;
          border-radius: 32px;
        }

        .postCard[disabled] {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        md-icon {
          --md-icon-size: 64px;
        }

        .header {
          padding: 0;
          margin: 0;
          padding-top: 16px;
        }

        .half {
          width: 50%;
        }

        .addText {
          padding-left: 0;
          padding-right: 8px;
        }

        md-icon {
          width: 64px;
          height: 64px;
          margin-right: 8px;
          margin-left: 0;
        }

        .addNewIdeaText {
          font-size: 26px;
        }

        .closed {
          font-size: 22px;
        }

        div[disabled] {
          cursor: initial;
        }

        md-icon[disabled] {
        }

        @media (max-width: 420px) {
          :host {
            margin-top: 0;
          }

          .postCard {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
            margin-bottom: 4px;
            padding: 16px;
          }

          .addNewIdeaText {
            font-size: 24px;
            width: auto;
          }

          md-icon {
            height: 48px;
            width: 48px;
          }

          .closed {
            font-size: 20px;
          }
        }

        @media (max-width: 420px) {
          .postCard {
            max-width: 300px;
          }
        }

        .container {
          width: 100%;
        }
      `,
        ];
    }
    render() {
        return this.group
            ? html `
          <div
            ?disabled="${this.disableNewPosts}"
            class="postCard shadow-elevation-8dp shadow-transaction layout vertical center-center"
            aria-disabled="${this.disableNewPosts}"
            role="button"
            aria-label="${this.t('post.add_new')}"
            tabindex="0"
            @keydown="${this._keyDown}"
            @click="${this._newPost}">
            <div class="layout horizontal center-center addNewIdeaText">
              <md-icon>lightbulb_outline</md-icon>
              ${this.disableNewPosts
                ? html `
                    <div class="flex addText closed">
                      ${!this.group.configuration
                    .alternativeTextForNewIdeaButtonClosed
                    ? html ` ${this.t('closedForNewPosts')} `
                    : html `
                            <yp-magic-text
                              .contentId="${this.group.id}"
                              .extraId="${this.index}"
                              textOnly
                              .content="${this.group.configuration
                        .alternativeTextForNewIdeaButtonClosed}"
                              .contentLanguage="${this.group.language}"
                              class="ratingName"
                              textType="alternativeTextForNewIdeaButtonClosed"></yp-magic-text>
                          `}
                    </div>
                  `
                : html `
                    <div class="flex addText">
                      ${!this.group.configuration
                    .alternativeTextForNewIdeaButtonClosed
                    ? html ` ${this.t('post.add_new')} `
                    : html `
                            <yp-magic-text
                              .contentId="${this.group.id}"
                              .extraId="${this.index}"
                              textOnly
                              .content="${this.group.configuration
                        .alternativeTextForNewIdeaButton}"
                              .contentLanguage="${this.group.language}"
                              class="ratingName"
                              textType="alternativeTextForNewIdeaButton"></yp-magic-text>
                          `}
                    </div>
                  `}
            </div>
          </div>
        `
            : nothing;
    }
    _keyDown(event) {
        if (event.keyCode === 13) {
            this._newPost();
        }
    }
    _newPost() {
        if (!this.disableNewPosts) {
            this.fire('new-post');
        }
    }
};
__decorate([
    property({ type: Boolean })
], YpPostCardAdd.prototype, "disableNewPosts", void 0);
__decorate([
    property({ type: Object })
], YpPostCardAdd.prototype, "group", void 0);
__decorate([
    property({ type: Number })
], YpPostCardAdd.prototype, "index", void 0);
YpPostCardAdd = __decorate([
    customElement('yp-post-card-add')
], YpPostCardAdd);
export { YpPostCardAdd };
//# sourceMappingURL=yp-post-card-add.js.map