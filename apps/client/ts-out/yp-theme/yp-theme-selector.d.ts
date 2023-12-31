import { nothing } from 'lit';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class YpThemeSelector extends YpBaseElement {
    selectedTheme: number | undefined;
    themeObject: YpThemeContainerObject | undefined;
    themes: Array<Record<string, boolean | string | Record<string, string>>>;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    connectedCallback(): void;
    _selectTheme(event: CustomEvent): void;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    _objectChanged(): void;
    _selectedThemeChanged(): void;
}
//# sourceMappingURL=yp-theme-selector.d.ts.map