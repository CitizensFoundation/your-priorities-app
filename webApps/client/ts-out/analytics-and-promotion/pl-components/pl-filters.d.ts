import { nothing } from 'lit';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state';
import { BrowserHistory } from './util/history';
export declare class PlausibleFilters extends PlausibleBaseElementWithState {
    url: string;
    viewport: number;
    wrapped: number;
    history: BrowserHistory;
    addingFilter: boolean;
    menuOpen: boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    firstUpdated(): void;
    static get styles(): import("lit").CSSResult[];
    handleClick(e: MouseEvent): void;
    removeFilter(key: string): void;
    clearAllFilters(): void;
    filterText(key: string, rawValue: string): import("lit-html").TemplateResult<1>;
    renderDropdownFilter(filter: string[]): import("lit-html").TemplateResult<1>;
    filterDropdownOption(option: string): import("lit-html").TemplateResult<1>;
    renderDropdownContentOriginal(): import("lit-html").TemplateResult<1> | import("lit-html").TemplateResult<1>[];
    renderDropdownContent(): typeof nothing | import("lit-html").TemplateResult<1>;
    handleKeyup(e: KeyboardEvent): void;
    handleResize(): void;
    rewrapFilters(): void;
    renderListFilter(filter: string[]): import("lit-html").TemplateResult<1>;
    renderDropdownButton(): typeof nothing | import("lit-html").TemplateResult<1>;
    toggleMenu(): void;
    renderDropDown(): import("lit-html").TemplateResult<1>;
    renderFilterList(): typeof nothing | import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-filters.d.ts.map