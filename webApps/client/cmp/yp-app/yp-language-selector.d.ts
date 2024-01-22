import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class YpLanguageSelector extends YpBaseElement {
    refreshLanguages: boolean;
    noUserEvents: boolean;
    selectedLocale: string | undefined;
    value: string;
    name: string;
    autoTranslateOptionDisabled: boolean;
    autoTranslate: boolean;
    dropdownVisible: boolean;
    hasServerAutoTranslation: boolean;
    isOutsideChangeEvent: boolean;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static supportedLanguages: Record<string, string>;
    noGoogleTranslateLanguages: string[];
    _refreshLanguage(): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _selectLanguage(event: CustomEvent): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    _autoTranslateEvent(event: CustomEvent): void;
    _stopTranslation(): void;
    startTranslation(): void;
    get canUseAutoTranslate(): boolean;
    get languages(): {
        language: string;
        name: string;
    }[];
    _selectedLocaleChanged(oldLocale: string): void;
}
//# sourceMappingURL=yp-language-selector.d.ts.map