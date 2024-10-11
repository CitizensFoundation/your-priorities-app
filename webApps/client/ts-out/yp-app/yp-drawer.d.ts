import { TemplateResult } from "lit";
import { YpBaseElement } from "../common/yp-base-element";
export declare class YpDrawer extends YpBaseElement {
    open: boolean | undefined;
    position: "left" | "right";
    transparentScrim: boolean;
    static get styles(): any[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    _closeAllDrawers(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    private _handleScrimClick;
    private _handleEscKey;
    render(): TemplateResult;
}
//# sourceMappingURL=yp-drawer.d.ts.map