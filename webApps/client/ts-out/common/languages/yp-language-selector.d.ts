import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
interface YpLanguageMenuItem {
    language: string;
    name: string;
}
export declare class YpLanguageSelector extends YpBaseElement {
    refreshLanguages: boolean;
    noUserEvents: boolean;
    selectedLocale: string | undefined;
    value: string;
    autocompleteText: string;
    name: string;
    autoTranslateOptionDisabled: boolean;
    autoTranslate: boolean;
    dropdownVisible: boolean;
    hasServerAutoTranslation: boolean;
    isOutsideChangeEvent: boolean;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _refreshLanguage(): void;
    static get styles(): any[];
    _autoCompleteChange(event: CustomEvent): void;
    get foundAutoCompleteLanguages(): YpLanguageMenuItem[];
    renderMenuItem(index: number, item: YpLanguageMenuItem): import("lit-html").TemplateResult<1>;
    renderAutoComplete(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    _selectLanguage(event: CustomEvent): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    _autoTranslateEvent(event: CustomEvent): void;
    _stopTranslation(): void;
    startTranslation(): void;
    get canUseAutoTranslate(): boolean;
    get languages(): YpLanguageMenuItem[];
    _selectedLocaleChanged(oldLocale: string): void;
}
export {};
//# sourceMappingURL=yp-language-selector.d.ts.map