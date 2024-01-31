import { LitElement } from 'lit';
export declare class PlausibleBaseElement extends LitElement {
    language: string;
    rtl: boolean;
    wide: boolean;
    connectedCallback(): void;
    installMediaQueryWatcher: (mediaQuery: string, layoutChangedCallback: (mediaQueryMatches: boolean) => void) => void;
    disconnectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get rtlLanguages(): string[];
    languageChanged(): void;
    _setupRtl(): void;
    static get styles(): import("lit").CSSResult[];
    _languageEvent(event: CustomEvent): void;
    fire(eventName: string, data?: object | string | boolean | number | null, target?: LitElement | Document): void;
    fireGlobal(eventName: string, data?: object | string | boolean | number | null): void;
    addListener(name: string, callback: Function, target?: LitElement | Document): void;
    addGlobalListener(name: string, callback: Function): void;
    removeListener(name: string, callback: Function, target?: LitElement | Document): void;
    removeGlobalListener(name: string, callback: Function): void;
    t(...args: Array<string>): string;
    getTooltipText(item: PlausibleListItemData): string | undefined;
    renderIcon(item: PlausibleListItemData): string | undefined;
    $$(id: string): HTMLElement | null;
}
//# sourceMappingURL=pl-base-element.d.ts.map