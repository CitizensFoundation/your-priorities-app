import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import './ac-notification-selection.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class AcNotificationSettingsLit extends YpBaseElement {
  static get properties() {
    return {
      notificationsSettings: {
        type: Object,
        notify: true,
        observer: '_notificationsSettingsChanged'
      }
    }
  }
 
  render() {
    return html`
    <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>

    <ac-notification-selection .name="${this.t('notification.myPosts')}" .setting="${this.notificationsSettings.my_posts}">
    </ac-notification-selection>

    <ac-notification-selection .name="${this.t('notification.myPostsEndorsements')}" .setting="${this.notificationsSettings.my_posts_endorsements}">
    </ac-notification-selection>


    <ac-notification-selection .name="${this.t('notification.myPoints')}" .setting="${this.notificationsSettings.my_points}">
    </ac-notification-selection>

    <ac-notification-selection .name="${this.t('notification.myPointEndorsements')}" .setting="${this.notificationsSettings.my_points_endorsements}">
    </ac-notification-selection>

    <ac-notification-selection .name="${this.t('notification.allCommunity')}" .setting="${this.notificationsSettings.all_community}">
    </ac-notification-selection>

    <ac-notification-selection .name="${this.t('notification.allGroup')}" .setting="${this.notificationsSettings.all_group}">
    </ac-notification-selection>
`
  }

/*  
  behaviors: [
    ypLanguageBehavior
  ],


  observers: [
    'settingsStarChanged(notificationsSettings.*)'
  ],
*/

  _notificationsSettingsChanged(value) {
  }

  settingsStarChanged(object) {
    this.fire('yp-notifications-changed', this.notificationsSettings);
  }
}

window.customElements.define('ac-notification-settings-lit', AcNotificationSettingsLit)
