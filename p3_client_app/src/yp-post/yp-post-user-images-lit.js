import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-button/paper-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
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

      paper-button {
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
    ${this.post ? html`
    <div class="layout vertical center-center">
      <template is="dom-if" if="${this.post}">
        <paper-button raised="" @tap="${this._newImage}">${this.t('posts.newUserImage')}</paper-button>
        <template is="dom-if" if="${this.images}">
          <template is="dom-repeat" items="${this.images}" as="image">
            <yp-post-user-image-card post="${this.post}" image="${this.image}" @refresh="${this._refresh}"></yp-post-user-image-card>
          </template>
        </template>
      </template>
      <div class="layout horizontal center-center">
        <yp-ajax id="ajax" @response="${this._response}"></yp-ajax>
      </div>
    </div>
` : html``}
`
  }
/*
  behaviors: [
    ypLanguageBehavior
  ],
*/
   
  _refresh() {
    this.$.ajax.generateRequest();
  }

  _postChanged(newPost) {
    if (newPost) {
      this.$.ajax.url = '/api/images/' + newPost.id + '/user_images';
      this.$.ajax.generateRequest();
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
    this.set('images', detail.response);
    if (this.images && this.images.length>0) {
      this.fire('yp-post-image-count', this.images.length);
    } else {
      this.fire('yp-post-image-count', 0);
    }
  }
}

window.customElements.define('yp-post-user-images-lit', YpPostUserImagesLit)