import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import '../common/yp-image.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';

@customElement('yp-post-gallery-image')
export class YpPostGalleryImage extends YpBaseElement {
  @property({ type: Object })
  post!: YpPostData;

  @property({ type: Number, attribute: 'image-width' })
  imageWidth?: number;

  @property({ type: Number, attribute: 'image-height' })
  imageHeight?: number;

  @property({ type: String, attribute: 'alt-tag' })
  altTag?: string;

  @property({ type: String, attribute: 'sizing-mode' })
  sizingMode = 'cover';

  static override get styles() {
    return [
      super.styles,
      css`
        yp-image {
          max-width: 700px;
          max-height: 700px;
          object-fit: scale-down;
        }

        @media (max-width: 800px) {
          yp-image {
            max-width: 80vw;
            max-height: 350px;
          }
        }
      `,
    ];
  }

  get postImagePath() {
    if (this.post) {
      return YpMediaHelpers.getImageFormatUrl(this.post.PostHeaderImages, 0);
    } else {
      return '';
    }
  }

  get anyImagePath() {
    return this.postImagePath;
  }

  override render() {
    const style = `--yp-image-width:${this.imageWidth ?? 'auto'}px;--yp-image-height:${this.imageHeight ?? 'auto'}px;`;
    return html`
      <yp-image
        style="${style}"
        .alt="${this.altTag || this.post?.name || ''}"
        .title="${this.post?.name || ''}"
        .sizing="${this.sizingMode}"
        src="${this.postImagePath}"></yp-image>
    `;
  }
}
