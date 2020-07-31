import '@polymer/polymer/polymer-legacy.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';


class AcNotificationSelectionLit extends YpBaseElement {
  static get properties() {
    return {
      name: String,

      setting: {
        type: Object,
        notify: true,
        observer: '_settingChanged'
      },

      frequency:  {
        type: Number,
        notify: true,
        observer: "_frequencyChanged"
      },

      method: {
        type: Number,
        notify: true,
        observer: "_methodChanged"
      },

      availableFrequencies: {
        type: Array,
        computed: '_getAvailableFrequencies(language, method)'
      },

      availableMethods: {
        type: Object,
        computed: '_availableMethods(language)'
      }
    }
  }

  static get styles() {
    return [
      css`

      .half {
        width: 50%;
      }

      .notificationName {
        padding-top: 16px;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
        padding-bottom: 4px;
        color: #333;
        border-bottom: solid 1px #ddd;
      }

      .notificationSub {
        color: #888;
      }

      paper-radio-button {
        padding-top: 8px;
        padding-bottom: 8px;
      }
    `, YpFlexLayout]
    }

  render() {
    return html`
    <div class="layout vertical">
      <div class="notificationName">${this.name}</div>
      <div class="layout horizontal wrap">
        <div class="layout vertical half">
          <div class="notificationSub">${this.t('notification.method')}</div>
          <div class="layout horizontal">
            <paper-radio-group id="notificationMethodGroup" .name="method" class="method" .attrForSelected="enum-value" .selected="${this.method}">

              ${ this.availableMethods.map(item => html`
              <paper-radio-button .enumValue="${this.item.enumValue}">${this.item.name}</paper-radio-button>
              `)}

            </paper-radio-group>
          </div>
        </div>
        <div class="layout vertical half">
          <div class="notificationSub">${this.t('notification.frequency')}</div>
          <div class="layout horizontal">
            <paper-radio-group id="notificationFrequencyGroup" .name="frequency" .attrForSelected="enum-value" class="frequency" .selected="${this.frequency}">

              ${ this.availableFrequencies.map(item => html`
              <paper-radio-button ?disabled="${this._isDelayed(item)}" .enumValue="${this.item.enumValue}">${this.item.name}</paper-radio-button>
              `)}

            </paper-radio-group>
          </div>
        </div>
      </div>
    </div>
    `
  }

  _availableMethods(language) {
    if (language) {
      return [
        {
          name: this.t('notification.muted'),
          enumValue: 0
        },
        {
          name: this.t('notification.browser'),
          enumValue: 1
        },
        {
          name: this.t('notification.email'),
          enumValue: 2
        }
      ]
    } else {
      return [];
    }
  }

  _methodChanged(value) {
    value = parseInt(value);
    if (this.setting.method!=value) {
      this.setting.method = value;
    }
  }

  _frequencyChanged(value) {
    value = parseInt(value);
    if (this.setting.frequency!=value) {
      this.setting.frequency = value;
    }
  }

  _settingChanged(value) {
    if (value) {
      this.method = value.method;
      this.frequency = value.frequency;
    }
  }

  _isDelayed(item) {
    return item.enumValue>0;
  }

  _getAvailableFrequencies(language, method) {
    const frequencyArray = [];
    if (language) {
      if (!method || method==0) {
      } else if (method==1) {
        this.frequency = 0;
        frequencyArray = [
          {
            name: this.t('notification.asItHappens'),
            enumValue: 0
          }
        ]
      } else if (method==2) {
        frequencyArray = [
          {
            name: this.t('notification.asItHappens'),
            enumValue: 0
          },
          {
            name: this.t('notification.hourly'),
            enumValue: 1
          },
          {
            name: this.t('notification.daily'),
            enumValue: 2
          },
          {
            name: this.t('notification.weekly'),
            enumValue: 3
          },
          {
            name: this.t('notification.monthly'),
            enumValue: 5
          }
        ]
      }
    }
    return frequencyArray;
  }
}

window.customElements.define('ac-notification-selection-lit', AcNotificationSelectionLit)
