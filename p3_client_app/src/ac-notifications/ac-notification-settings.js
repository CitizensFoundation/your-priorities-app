import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import './ac-notification-selection.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <ac-notification-selection name="[[t('notification.myPosts')]]" setting="{{notificationsSettings.my_posts}}">
    </ac-notification-selection>

    <ac-notification-selection name="[[t('notification.myPostsEndorsements')]]" setting="{{notificationsSettings.my_posts_endorsements}}">
    </ac-notification-selection>


    <ac-notification-selection name="[[t('notification.myPoints')]]" setting="{{notificationsSettings.my_points}}">
    </ac-notification-selection>

    <ac-notification-selection name="[[t('notification.myPointEndorsements')]]" setting="{{notificationsSettings.my_points_endorsements}}">
    </ac-notification-selection>

    <ac-notification-selection name="[[t('notification.allCommunity')]]" setting="{{notificationsSettings.all_community}}">
    </ac-notification-selection>

    <ac-notification-selection name="[[t('notification.allGroup')]]" setting="{{notificationsSettings.all_group}}">
    </ac-notification-selection>
`,

  is: 'ac-notification-settings',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {
    notificationsSettings: {
      type: Object,
      notify: true,
      observer: '_notificationsSettingsChanged'
    }
  },

  observers: [
    'settingsStarChanged(notificationsSettings.*)'
  ],

  _notificationsSettingsChanged: function (value) {
  },

  settingsStarChanged: function (object) {
    this.fire('yp-notifications-changed', this.notificationsSettings);
  }
});
