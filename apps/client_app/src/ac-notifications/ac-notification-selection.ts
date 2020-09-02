import { property, html, css, customElement } from 'lit-element';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import '@material/mwc-radio';
import '@material/mwc-formfield';

@customElement('ac-notification-selection')
export class AcNotificationSelection extends YpBaseElement {
  @property({ type: String })
  name: string | undefined;

  @property({ type: Object })
  setting!: AcNotificationSettingsDataItem;

  @property({ type: Number })
  frequency: number | undefined;

  @property({ type: Number })
  method: number | undefined;

  static get prssoperties() {
    return {
      setting: {
        type: Object,
        notify: true,
        observer: '_settingChanged',
      },

      frequency: {
        type: Number,
        notify: true,
        observer: '_frequencyChanged',
      },

      method: {
        type: Number,
        notify: true,
        observer: '_methodChanged',
      },
    };
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('setting')) {
      this._settingChanged();
    }
    if (changedProperties.has('frequency')) {
      this._frequencyChanged();
    }

    if (changedProperties.has('method')) {
      this._methodChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
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
      `,
    ];
  }

  render() {
    return html`
      <div class="layout vertical">
        <div class="notificationName">${this.name}</div>
        <div class="layout horizontal wrap">
          <div class="layout vertical half">
            <div class="notificationSub">${this.t('notification.method')}</div>
            <div class="layout horizontal">
              <div id="notificationMethodGroup" name="method" class="method">
                ${this.availableMethods.map(
                  item => html`
                    <mwc-formfield .label="${item.name}">
                      <mwc-radio
                        name="method"
                        @change="${this._methodChanged}"
                        .value="${item.enumValue.toString()}"
                        ?checked="${item.enumValue == this.method}">
                      </mwc-radio>
                    </mwc-formfield>
                  `
                )}
              </div>
            </div>
          </div>
          <div class="layout vertical half">
            <div class="notificationSub">
              ${this.t('notification.frequency')}
            </div>
            <div class="layout horizontal">
              <div
                id="notificationFrequencyGroup"
                name="frequency"
                attrForSelected="enum-value"
                class="frequency"
                .selected="${this.frequency}">
                ${this.availableFrequencies.map(
                  item => html`
                    <mwc-formfield .label="${item.name}">
                      <mwc-radio
                        name="frequency"
                        ?disabled="${this._isDelayed(item)}"
                        @change="${this._frequencyChanged}"
                        .value="${item.enumValue.toString()}"
                        ?checked="${item.enumValue == this.frequency}">
                      </mwc-radio>
                    </mwc-formfield>
                  `
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  get availableMethods(): Array<AcNotificationSettingMethod> {
    if (this.language) {
      return [
        {
          name: this.t('notification.muted'),
          enumValue: 0,
        },
        {
          name: this.t('notification.browser'),
          enumValue: 1,
        },
        {
          name: this.t('notification.email'),
          enumValue: 2,
        },
      ];
    } else {
      return [];
    }
  }

  _methodChanged(event: CustomEvent) {
    const methodValue = (event.target as HTMLInputElement).value;
    if (methodValue) {
      this.method = parseInt(methodValue);
    }

    if (this.method) {
      this.setting.method = this.method;
    }

    this.setting = { ...this.setting };
  }

  _frequencyChanged(event: CustomEvent) {
    const frequencyValue = (event.target as HTMLInputElement).value;
    if (frequencyValue) {
      this.frequency = parseInt(frequencyValue);
    }

    if (this.frequency) {
      this.setting.frequency = this.frequency;
    }

    this.setting = { ...this.setting };
  }

  _settingChanged() {
    if (this.setting) {
      this.method = this.setting.method;
      this.frequency = this.setting.frequency;
    }
  }

  _isDelayed(item: AcNotificationSettingMethod) {
    return item.enumValue > 0;
  }

  get availableFrequencies() {
    let frequencyArray: Array<AcNotificationSettingFrequency> = [];
    if (this.language) {
      if (!this.method || this.method == 0) {
        //TODO: Nothing here?
      } else if (this.method == 1) {
        this.frequency = 0;
        frequencyArray = [
          {
            name: this.t('notification.asItHappens'),
            enumValue: 0,
          },
        ];
      } else if (this.method == 2) {
        frequencyArray = [
          {
            name: this.t('notification.asItHappens'),
            enumValue: 0,
          },
          {
            name: this.t('notification.hourly'),
            enumValue: 1,
          },
          {
            name: this.t('notification.daily'),
            enumValue: 2,
          },
          {
            name: this.t('notification.weekly'),
            enumValue: 3,
          },
          {
            name: this.t('notification.monthly'),
            enumValue: 5,
          },
        ];
      }
    }
    return frequencyArray;
  }
}
