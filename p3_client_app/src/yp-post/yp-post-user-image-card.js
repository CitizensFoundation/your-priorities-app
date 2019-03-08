import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/paper-material/paper-material.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import '../yp-point/yp-point.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      .description {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 16px;
        color: #444;
      }

      .photographer {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 8px;
        color: #aaa;
      }

      paper-material {
        width: 800px;
        height: 100%;
        background-color: #FFF;
        padding: 0;
      }

      iron-image {
        width: 800px;
        height: 600px;
      }

      @media (max-width: 800px) {
        iron-image {
          width: 600px;
          height: 450px;
        }

        paper-material {
          width: 600px;
        }
      }

      @media (max-width: 620px) {
        iron-image {
          width: 400px;
          height: 300px;
        }
        paper-material {
          width: 400px;
        }
      }

      @media (max-width: 420px) {
        iron-image {
          width: 320px;
          height: 240px;
        }
        paper-material {
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
    </style>

    <paper-material elevation="2" class="layout vertical">
      <iron-image title\$="[[image.description]]" sizing="cover" src\$="[[_imageUrl(image)]]"></iron-image>
      <div class="description">
        [[image.description]]
      </div>
      <div class="layout horizontal" style="width: 100%;">
        <div class="photographer">
          [[image.photographer_name]]
        </div>
        <div class="editMenu layout horizontal flex end-justified" hidden\$="[[!hasImageAccess(image, post)]]">
          <paper-icon-button aria-label\$="[[t('edit')]]" icon="create" on-tap="_openEdit"></paper-icon-button>
          <paper-icon-button aria-label\$="[[t('delete')]]" icon="clear" on-tap="_openDelete"></paper-icon-button>
        </div>
      </div>
      <yp-point-comment-list class="commentsList" image="[[image]]"></yp-point-comment-list>
    </paper-material>
`,

  is: 'yp-post-user-image-card',

  behaviors: [
    ypLanguageBehavior,
    AccessHelpers,
    ypMediaFormatsBehavior
  ],

  properties: {

    image: {
      type: Object
    },

    post: {
      type: Object
    }
  },

  _openEdit: function () {
    window.appGlobals.activity('open', 'userImage.edit');
    dom(document).querySelector('yp-app').getDialogAsync("userImageEdit", function (dialog) {
      dialog.setup(this.post, this.image, false, this._refresh.bind(this));
      dialog.open('edit', { postId: this.post.id, userImages: true });
    }.bind(this));
  },

  _openDelete: function () {
    window.appGlobals.activity('open', 'userImage.delete');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/images/'+this.post.id+'/'+this.image.id+'/user_images',
        this.t('userImage.deleteConfirmation'),
        this._refresh.bind(this));
      dialog.open();
    }.bind(this));
  },

  _refresh: function () {
    this.fire('refresh');
  },

  _imageUrl: function (image) {
    return this.getImageFormatUrl([image], 0);
  }
});
