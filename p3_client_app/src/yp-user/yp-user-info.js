import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-fab/paper-fab.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import './yp-user-image.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
      }

      .avatar-container {
        position: relative;
        border: 2px solid #FF9800;
        border-radius: 50%;
        height: 90px;
        padding: 2px;
        width: 90px;
        margin: 20px auto;
      }

      .contact-info {
        margin: 0 20px;
        padding-bottom: 4px;
        text-align: center;
      }

      .contact-info .name {
        font-weight: bold;
      }

      .contact-info .email {
        color: #999;
      }

      .buttons {
        margin-top: 8px;
      }

      .hasPointer {
        cursor: pointer;
      }
      paper-button {
        margin-top: 12px;
        margin-bottom: 8px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <template restamp="" is="dom-if" if="[[user]]">
      <div class="mainContainer">
        <div class="avatar-container">
          <yp-user-image class="hasPointer" large="" user="[[user]]" on-tap="_openEdit"></yp-user-image>
        </div>
        <div class="contact-info">
          <div class="name">[[user.name]]</div>
          <div class="email">[[user.email]]</div>
          <div class="layout vertical center-justified buttons">
            <paper-button raised="" icon="create" title\$="[[t('user.edit')]]" on-tap="_openEdit">[[t('user.edit')]]</paper-button>
            <paper-button raised="" icon="create" title\$="[[t('myContent')]]" on-tap="_openAllContentModeration">[[t('myContent')]]</paper-button>
            <paper-button raised="" icon="input" title\$="[[t('user.logout')]]" on-tap="_logout">[[t('user.logout')]]</paper-button>
          </div>
        </div>
      </div>
    </template>
`,

  is: 'yp-user-info',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {
    user: {
      type: Object,
      value: null,
      notify: true
    }
  },

  _openAllContentModeration: function () {
    window.appGlobals.activity('open', 'userAllContentModeration');
    dom(document).querySelector('yp-app').getContentModerationAsync(function (dialog) {
      dialog.setup(null, null, null, '/moderate_all_content', this.user.id);
      dialog.open(this.user.name);
    }.bind(this));
  },

  _openEdit: function () {
    this.fire('open-user-edit');
  },

  _logout: function() {
    window.appUser.logout();
  }
});
