import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/textfield/outlined-text-field.js";
export declare class YpThemeSelector extends YpBaseElement {
    oneDynamicThemeColor: string | undefined;
    themePrimaryColor: string | undefined;
    themeSecondaryColor: string | undefined;
    themeTertiaryColor: string | undefined;
    themeNeutralColor: string | undefined;
    themeNeutralVariantColor: string | undefined;
    selectedThemeScheme: string;
    selectedThemeVariant: string;
    themeConfiguration: YpThemeConfiguration;
    disableSelection: boolean | undefined;
    static get styles(): any[];
    connectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    isValidHex(color: string | undefined): boolean;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-theme-selector.d.ts.map