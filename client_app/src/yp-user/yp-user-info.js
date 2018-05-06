import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-fab/paper-fab.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import './yp-user-image.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
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
            <paper-button icon="create" title\$="[[t('user.edit')]]" on-tap="_openEdit">[[t('user.edit')]]</paper-button>
            <paper-button icon="input" title\$="[[t('user.logout')]]" on-tap="onLogout">[[t('user.logout')]]</paper-button>
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

  _openEdit: function () {
    this.fire('open-user-edit');
  },

  onLogout: function() {
    window.appUser.logout();
  }
});
