import { LitElement, CSSResult, TemplateResult, PropertyValues } from "lit";
export declare class YpTopAppBar extends LitElement {
    private isTitleLong;
    titleString: string;
    static styles: CSSResult;
    private lastScrollY;
    constructor();
    protected updated(changedProperties: PropertyValues): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleScroll;
    render(): TemplateResult;
}
//# sourceMappingURL=yp-top-app-bar.d.ts.map