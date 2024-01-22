import "@material/web/radio/radio.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export declare class AcNotificationSelection extends YpBaseElement {
    name: string | undefined;
    setting: AcNotificationSettingsDataItem;
    frequency: number | undefined;
    method: number | undefined;
    static get prssoperties(): {
        setting: {
            type: ObjectConstructor;
            notify: boolean;
            observer: string;
        };
        frequency: {
            type: NumberConstructor;
            notify: boolean;
            observer: string;
        };
        method: {
            type: NumberConstructor;
            notify: boolean;
            observer: string;
        };
    };
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    get availableMethods(): Array<AcNotificationSettingMethod>;
    _methodChanged(event: CustomEvent): void;
    _frequencyChanged(event: CustomEvent): void;
    _settingChanged(): void;
    _isDelayed(item: AcNotificationSettingMethod): boolean;
    get availableFrequencies(): AcNotificationSettingFrequency[];
}
//# sourceMappingURL=ac-notification-selection.d.ts.map