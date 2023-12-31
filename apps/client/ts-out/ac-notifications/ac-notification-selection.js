var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/radio/radio.js";
import { YpBaseElement } from "../common/yp-base-element.js";
let AcNotificationSelection = class AcNotificationSelection extends YpBaseElement {
    static get prssoperties() {
        return {
            setting: {
                type: Object,
                notify: true,
                observer: "_settingChanged",
            },
            frequency: {
                type: Number,
                notify: true,
                observer: "_frequencyChanged",
            },
            method: {
                type: Number,
                notify: true,
                observer: "_methodChanged",
            },
        };
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("setting")) {
            this._settingChanged();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        .half {
          width: 50%;
        }

        .notificationName {
          padding-top: 16px;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: solid 1px #ddd;
        }

        .notificationSub {
        }

        md-radio {
          padding-top: 8px;
          padding-bottom: 8px;
        }

        label {
          padding: 8px;
        }
      `,
        ];
    }
    render() {
        return html `
      <div class="layout vertical">
        <div class="notificationName">${this.name}</div>
        <div class="layout horizontal wrap">
          <div class="layout vertical half">
            <div class="notificationSub">${this.t("notification.method")}</div>
            <div class="layout horizontal">
              <div id="notificationMethodGroup" name="method" class="method">
                ${this.availableMethods.map((item) => html `
                    <label
                      >${item.name}
                      <md-radio
                        name="method"
                        @change="${this._methodChanged}"
                        .value="${item.enumValue.toString()}"
                        ?checked="${item.enumValue == this.method}"
                      >
                      </md-radio>
                    </label>
                  `)}
              </div>
            </div>
          </div>
          <div class="layout vertical half">
            <div class="notificationSub">
              ${this.t("notification.frequency")}
            </div>
            <div class="layout horizontal">
              <div id="notificationFrequencyGroup" class="frequency">
                ${this.availableFrequencies.map((item) => html `
                    <label
                      >${item.name}
                      <md-radio
                        name="frequency"
                        ?disabled="${this._isDelayed(item)}"
                        @change="${this._frequencyChanged}"
                        .value="${item.enumValue.toString()}"
                        ?checked="${item.enumValue == this.frequency}"
                      >
                      </md-radio>
                    </label>
                  `)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    get availableMethods() {
        if (this.language) {
            return [
                {
                    name: this.t("notification.muted"),
                    enumValue: 0,
                },
                {
                    name: this.t("notification.browser"),
                    enumValue: 1,
                },
                {
                    name: this.t("notification.email"),
                    enumValue: 2,
                },
            ];
        }
        else {
            return [];
        }
    }
    _methodChanged(event) {
        let methodValue = event.target.value;
        methodValue = parseInt(methodValue);
        if (methodValue && this.method != methodValue) {
            this.method = methodValue;
            this.fire("yp-notification-changed");
        }
        if (this.method) {
            this.setting.method = this.method;
        }
    }
    _frequencyChanged(event) {
        let frequencyValue = event.target
            .value;
        frequencyValue = parseInt(frequencyValue);
        if (frequencyValue && this.frequency != frequencyValue) {
            this.frequency = frequencyValue;
            this.fire("yp-notification-changed");
        }
        if (this.frequency) {
            this.setting.frequency = this.frequency;
        }
    }
    _settingChanged() {
        if (this.setting) {
            this.method = this.setting.method;
            this.frequency = this.setting.frequency;
        }
    }
    _isDelayed(item) {
        return item.enumValue > 0;
    }
    get availableFrequencies() {
        let frequencyArray = [];
        if (this.language) {
            if (!this.method || this.method == 0) {
                //TODO: Nothing here?
            }
            else if (this.method == 1) {
                this.frequency = 0;
                frequencyArray = [
                    {
                        name: this.t("notification.asItHappens"),
                        enumValue: 0,
                    },
                ];
            }
            else if (this.method == 2) {
                frequencyArray = [
                    {
                        name: this.t("notification.asItHappens"),
                        enumValue: 0,
                    },
                    {
                        name: this.t("notification.hourly"),
                        enumValue: 1,
                    },
                    {
                        name: this.t("notification.daily"),
                        enumValue: 2,
                    },
                    {
                        name: this.t("notification.weekly"),
                        enumValue: 3,
                    },
                    {
                        name: this.t("notification.monthly"),
                        enumValue: 5,
                    },
                ];
            }
        }
        return frequencyArray;
    }
};
__decorate([
    property({ type: String })
], AcNotificationSelection.prototype, "name", void 0);
__decorate([
    property({ type: Object })
], AcNotificationSelection.prototype, "setting", void 0);
__decorate([
    property({ type: Number })
], AcNotificationSelection.prototype, "frequency", void 0);
__decorate([
    property({ type: Number })
], AcNotificationSelection.prototype, "method", void 0);
AcNotificationSelection = __decorate([
    customElement("ac-notification-selection")
], AcNotificationSelection);
export { AcNotificationSelection };
//# sourceMappingURL=ac-notification-selection.js.map