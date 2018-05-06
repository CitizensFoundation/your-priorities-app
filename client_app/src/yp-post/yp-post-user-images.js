import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import './yp-post-user-image-card.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
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
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout vertical center-center">
      <template is="dom-if" if="[[post]]">
        <paper-button raised="" on-tap="_newImage">[[t('posts.newUserImage')]]</paper-button>
        <template is="dom-if" if="[[images]]">
          <template is="dom-repeat" items="[[images]]" as="image">
            <yp-post-user-image-card post="[[post]]" image="[[image]]" on-refresh="_refresh"></yp-post-user-image-card>
          </template>
        </template>
      </template>
      <div class="layout horizontal center-center">
        <yp-ajax id="ajax" on-response="_response"></yp-ajax>
      </div>
    </div>
`,

  is: 'yp-post-user-images',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {

    images: {
      type: Array,
      value: null
    },

    post: {
      type: Object,
      observer: '_postChanged'
    }
  },

  _refresh: function () {
    this.$.ajax.generateRequest();
  },

  _postChanged: function (newPost) {
    if (newPost) {
      this.$.ajax.url = '/api/images/' + newPost.id + '/user_images';
      this.$.ajax.generateRequest();
    }
  },

  _newImage: function () {
    window.appGlobals.activity('open', 'newUserImage');
    dom(document).querySelector('yp-app').getDialogAsync("userImageEdit", function (dialog) {
      dialog.setup(this.post, null, true, this._refresh.bind(this));
      dialog.open('new', {postId: this.post.id, userImages: true});
    }.bind(this));
  },

  _response: function (event, detail) {
    this.set('images', detail.response);
    if (this.images && this.images.length>0) {
      this.fire('yp-post-image-count', this.images.length);
    } else {
      this.fire('yp-post-image-count', 0);
    }
  }
});
