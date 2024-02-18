import { LitElement, CSSResult, TemplateResult } from 'lit';
export declare class YpDrawer extends LitElement {
    open: boolean;
    position: 'left' | 'right';
    transparentScrim: boolean;
    static styles: CSSResult;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _handleScrimClick;
    private _handleEscKey;
    render(): TemplateResult;
}
//# sourceMappingURL=y-drawer.d.ts.map