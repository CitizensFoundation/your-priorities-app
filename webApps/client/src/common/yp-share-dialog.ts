import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from './yp-base-element.js';
import 'share-menu/share-menu.js';
import 'share-menu/targets/facebook.js';
import 'share-menu/targets/email.js';
import 'share-menu/targets/whatsapp.js';
import 'share-menu/targets/linkedin.js';



@customElement('yp-share-dialog')
export class YpShareDialog extends YpBaseElement {
  @property({ type: Object })
  haveSharedContentCallback: Function | undefined;

  @property({ type: String })
  url: string | undefined;

  @property({ type: String })
  image: string | undefined;
  @property({ type: String })
  label: string | undefined;

  override render() {
    return html`
      <share-menu
        class="shareIcon"
        id="shareButton"
        @close="${this.haveSharedContentCallback}"
        .title="${this.label || ''}"
        .url="${this.url || ''}"
        .image="${this.image || ''}"
      >
        <share-target-email></share-target-email>
        <share-target-facebook></share-target-facebook>
        <share-target-twitter></share-target-twitter>
        <share-target-whatsapp></share-target-whatsapp>
        <share-target-linkedin></share-target-linkedin>
      </share-menu>
    `;
  }

  async open(url: string, label: string, image: string, haveSharedContentCallback: Function) {
    this.url = url;
    this.label = label;
    this.haveSharedContentCallback = haveSharedContentCallback;
    this.image = image;

    this.requestUpdate();

    await this.updateComplete;

    (this.$$('#shareButton') as any /*ShareMenu*/).share();
  }
}
