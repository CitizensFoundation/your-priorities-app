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
import '@material/web/fab/fab.js';
import '@material/web/icon/icon.js';
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

        .topContainer {
          background-color: var(--md-sys-color-surface);
          display: flex;
          justify-content: center;
          padding: 16px;
        }

        md-fab {
          --md-fab-container-shape: 4px;
          --md-fab-label-text-size: 16px !important;
          --md-fab-label-text-weight: 600 !important;
          margin-bottom: 24px;
          --md-fab-container-elevation: 0;
          --md-fab-container-shadow-color: transparent;
          width: 225px;
        }

        md-fab:not([has-static-theme]) {
          --md-sys-color-primary-container: var(--md-sys-color-primary);
          --md-sys-color-on-primary-container: var(--md-sys-color-on-primary);
        }

        md-fab[disabled] {
          --md-sys-color-primary-container: var(--md-sys-color-secondary-container);
          --md-sys-color-on-primary-container: var(--md-sys-color-on-secondary-container);
        }


        .createFab {
          width: 310px;
          margin-left: 0px;
        }

        .addNewIdeaText {
          font-size: 18px;
        }

        .closed {
          font-size: 16px;
          text-align: center;
          margin-top: 8px;
        }

        @media (max-width: 420px) {
          :host {
            margin-top: 0;
          }

          .closed {
            font-size: 14px;
          }

          md-fab {
            width: 100%;
          }
        }
      `,
        ];
    }
    render() {
        return this.group
            ? html `
          <div class="topContainer">
            <md-fab
              ?disabled="${this.disableNewPosts}"
              aria-label="${this.t('post.add_new')}"
              ?has-static-theme="${this.hasStaticTheme}"
              lowered
              ?hidden=${this.group.configuration
                .hideNewPost}
              size="large"
              .label="${this.disableNewPosts
                ? this._getClosedText().toString()
                : this._getAddNewText().toString()}"
              ?extended="${this.wide}"
              class="createFab"
              variant="primary"
              @click="${this._newPost}"
              @keydown="${this._keyDown}"
            >
              <md-icon slot="icon">lightbulb_outline</md-icon>
              <span slot="label" class="addNewIdeaText">

              </span>
            </md-fab>
          </div>
          ${this.disableNewPosts
                ? html `
                <div class="closed">
                  ${this._getClosedText()}
                </div>
              `
                : nothing}
        `
            : nothing;
    }
    _keyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            this._newPost();
        }
    }
    _newPost() {
        if (!this.disableNewPosts) {
            this.fire('new-post');
        }
    }
    _getAddNewText() {
        return this.group?.configuration?.alternativeTextForNewIdeaButton
            ? html `
          <yp-magic-text
            .contentId="${this.group.id}"
            .extraId="${this.index}"
            textOnly
            .content="${this.group.configuration.alternativeTextForNewIdeaButton}"
            .contentLanguage="${this.group.language}"
            class="ratingName"
            textType="alternativeTextForNewIdeaButton"
          ></yp-magic-text>
        `
            : this.t('post.add_new');
    }
    _getClosedText() {
        return this.group?.configuration?.alternativeTextForNewIdeaButtonClosed
            ? html `
          <yp-magic-text
            .contentId="${this.group.id}"
            .extraId="${this.index}"
            textOnly
            .content="${this.group.configuration
                .alternativeTextForNewIdeaButtonClosed}"
            .contentLanguage="${this.group.language}"
            class="ratingName"
            textType="alternativeTextForNewIdeaButtonClosed"
          ></yp-magic-text>
        `
            : this.t('closedForNewPosts');
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