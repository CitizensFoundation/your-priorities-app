import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@material/mwc-button';
import '../yp-app-globals/yp-app-icons.js';
import './yp-post-user-image-card.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpPostUserImagesLit extends YpBaseElement {
  static get properties() {
    return {
      images: {
        type: Array,
        value: null
      },

      post: {
        type: Object,
        observer: '_postChanged'
      }
    }
  }

  static get styles() {
    return [
      css`

      mwc-button {
        margin-top: 32px;
        margin-bottom: 8px;
        background-color: var(--accent-color);
        color: #FFF;
        width: 242px;
      }

      yp-post-user-image-card {
        margin-top:32px;
        margin-bottom: 32px;
      }
      `, YpFlexLayout]
  }
  render() {
    return html`

    <div class="layout vertical center-center">

      ${ this.post ? html`
        <mwc-button raised="" @click="${this._newImage}" .label="${this.t('posts.newUserImage')}"></mwc-button>

        ${ this.images ? html`
          ${ this.images.map(image => html`
          <yp-post-user-image-card .post="${this.post}" .image="${this.image}" @refresh="${this._refresh}"></yp-post-user-image-card>
        `)}

        `: html``}
      `: html``}

      <div class="layout horizontal center-center">
        <yp-ajax id="ajax" @response="${this._response}"></yp-ajax>
      </div>
    </div>
    `
  }

  _refresh() {
    this.$$("#ajax").generateRequest();
  }

  _postChanged(newPost) {
    if (newPost) {
      this.$$("#ajax").url = '/api/images/' + newPost.id + '/user_images';
      this.$$("#ajax").generateRequest();
    }
  }

  _newImage() {
    window.appGlobals.activity('open', 'newUserImage');
    dom(document).querySelector('yp-app').getDialogAsync("userImageEdit", function (dialog) {
      dialog.setup(this.post, null, true, this._refresh.bind(this));
      dialog.open('new', {postId: this.post.id, userImages: true});
    }.bind(this));
  }

  _response(event, detail) {
    this.images = detail.response;
    if (this.images && this.images.length>0) {
      this.fire('yp-post-image-count', this.images.length);
    } else {
      this.fire('yp-post-image-count', 0);
    }
  }
}

window.customElements.define('yp-post-user-images-lit', YpPostUserImagesLit)