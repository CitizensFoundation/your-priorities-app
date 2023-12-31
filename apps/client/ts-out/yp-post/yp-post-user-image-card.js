var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '../common/yp-image.js';
import '../yp-point/yp-point-comment-list.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
let YpPostUserImageCard = class YpPostUserImageCard extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
        .description {
          padding-left: 16px;
          padding-right: 16px;
          padding-top: 16px;
        }

        .photographer {
          padding-left: 16px;
          padding-right: 16px;
          padding-top: 8px;
        }

        .material {
          width: 800px;
          height: 100%;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
          padding: 0;
        }

        yp-image {
          width: 800px;
          height: 600px;
        }

        @media (max-width: 800px) {
          yp-image {
            width: 600px;
            height: 450px;
          }

          .material {
            width: 600px;
          }
        }

        @media (max-width: 620px) {
          yp-image {
            width: 400px;
            height: 300px;
          }
          .material {
            width: 400px;
          }
        }

        @media (max-width: 420px) {
          yp-image {
            width: 320px;
            height: 240px;
          }
          .material {
            width: 320px;
          }

          .commentsList {
            margin-left: 16px;
          }
        }

        .commentsList {
          margin-left: 32px;
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    render() {
        return html `
      <div
        class="material layout vertical shadow-elevation-2dp shadow-transition">
        <yp-image
          .alt="${this.image.description}"
          sizing="cover"
          src="${this.imageUrl}"></yp-image>
        <div class="description">
          ${this.image.description}
        </div>
        <div class="layout horizontal" style="width: 100%;">
          <div class="photographer">
            ${this.image.photographer_name}
          </div>
          <div
            class="editMenu layout horizontal flex end-justified"
            ?hidden="${!YpAccessHelpers.hasImageAccess(this.image, this.post)}">
            <md-outlined-icon-button
              .abel="${this.t('edit')}"
              icon="create"
              @click="${this._openEdit}"></md-outlined-icon-button>
            <md-outlined-icon-button
              .label="${this.t('delete')}"
              icon="clear"
              @click="${this._openDelete}"></md-outlined-icon-button>
          </div>
        </div>
        <yp-point-comment-list
          class="commentsList"
          .image="${this.image}"></yp-point-comment-list>
      </div>
    `;
    }
    _openEdit() {
        window.appGlobals.activity('open', 'userImage.edit');
        window.appDialogs.getDialogAsync("userImageEdit", (dialog) => {
            dialog.setup(this.post, this.image, false, this._refresh.bind(this));
            dialog.open(false, { postId: this.post.id, userImages: true });
        });
    }
    _openDelete() {
        window.appGlobals.activity('open', 'userImage.delete');
        window.appDialogs.getDialogAsync('apiActionDialog', (dialog) => {
            dialog.setup('/api/images/' + this.post.id + '/' + this.image.id + '/user_images', this.t('userImage.deleteConfirmation'), this._refresh.bind(this));
            dialog.open();
        });
    }
    _refresh() {
        this.fire('refresh');
    }
    get imageUrl() {
        return YpMediaHelpers.getImageFormatUrl([this.image], 0);
    }
};
__decorate([
    property({ type: Object })
], YpPostUserImageCard.prototype, "image", void 0);
__decorate([
    property({ type: Object })
], YpPostUserImageCard.prototype, "post", void 0);
YpPostUserImageCard = __decorate([
    customElement('yp-post-user-image-card')
], YpPostUserImageCard);
export { YpPostUserImageCard };
//# sourceMappingURL=yp-post-user-image-card.js.map