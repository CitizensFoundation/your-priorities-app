import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/paper-toast/paper-toast.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-user/yp-user-with-organization.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .text {
        margin: 16px;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <paper-toast id="toast" duration="5000">
      <div class="layout vertical">
        <yp-user-with-organization class="layout horizontal self-end" user="[[user]]" hidden\$="[[!user]]"></yp-user-with-organization>
        <div class="text">[[notificationText]]</div>
      </div>
    </paper-toast>
`,

  is: 'ac-notification-toast',

  properties: {
    user: {
      type: Object,
      value: null
    },

    notificationText: {
      type: String,
      value: null
    }
  },

  open: function (user, notificationText) {
    this.set('user', user);
    this.set('notificationText', notificationText);
    this.$.toast.close();
    this.async(function () {
      this.$.toast.open();
    });
  }
});
