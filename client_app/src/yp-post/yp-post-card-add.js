import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-icon/iron-icon.js';
import '../../../../@polymer/paper-card/paper-card.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        margin-top: 8px;
      }

      .postCard {
        width: 280px;
        min-height: 80px;
        height: 100%;
        margin-top: 8px;
        padding: 16px;
        background-color: var(--accent-color);
        color: #FFF;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 8px;
      }

      iron-icon {
        height: 80px;
        width: 80px;
        color: #FFF;
      }

      .header {
        padding: 0;
        margin: 0;
        padding-top: 16px;
      }

      .icon {
        --iron-icon-height: 140px;
        --iron-icon-width: 140px;
      }

      .half {
        width: 50%;
      }

      paper-fab {
      }

      .addText {
        padding-left: 0;
        padding-right: 8px;
      }

      iron-icon {
        width: 64px;
        height: 64px;
        margin-right: 8px;
        margin-left: 0;
      }

      .addNewIdeaText {
        font-size: 26px;
        width: 100%;
        color: #FFF;
      }

      .closed {
        font-size: 18px;
        padding: 8px;
      }

      @media (max-width: 832px) {
        .postCard {
          width: 100%;
          margin-left: 64px;
          margin-right: 64px;
        }
      }

      paper-card[disabled] {
        background-color: #888;
        cursor: initial;
        max-width: 250px;
        width: 220px;
        padding: 8px;
        margin-top: 4px;
        min-height: initial;
      }

      iron-icon[disabled] {
        height: 36px;
        width: 36px;
      }

      @media (max-width: 420px) {
        .postCard {
          max-width: 250px;
          width: 250px;
          margin-left: 0;
          margin-right: 0;
          margin-bottom: 4px;
          padding: 8px;
          min-height: 64px;
        }

        .addNewIdeaText {
          font-size: 20px;
          width: 100%;
        }

        iron-icon {
          height: 48px;
          width: 48px;
        }

        .closed {
          font-size: 17px;
        }

      }

      [hidden] {
        display: none !important;
      }

    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout vertical center-center">
      <paper-card disabled\$="[[disabled]]" elevation="[[elevation]]" class="postCard" on-tap="_newPost">
        <div class="layout horizontal center-center addNewIdeaText">
          <iron-icon disabled\$="[[disabled]]" icon="lightbulb-outline"></iron-icon>
          <div class="flex addText" hidden\$="[[disabled]]">
            [[t('post.add_new')]]
          </div>
          <div class="flex addText closed" hidden\$="[[!disabled]]">
            [[t('closedForNewPosts')]]
          </div>

        </div>
      </paper-card>
    </div>
`,

  is: 'yp-post-card-add',

  properties: {
    elevation: {
      type: Number
    },

    disabled: {
      type: Boolean
    }
  },

  _newPost: function () {
    if (!this.disabled) {
      this.fire('new-post');
    }
  },

  behaviors: [
    ypLanguageBehavior
]
});
