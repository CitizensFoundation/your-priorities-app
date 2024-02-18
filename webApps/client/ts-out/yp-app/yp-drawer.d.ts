import { TemplateResult } from "lit";
import { YpBaseElement } from "../common/yp-base-element";
export declare class YpDrawer extends YpBaseElement {
    open: boolean;
    position: "left" | "right";
    transparentScrim: boolean;
    static get styles(): any[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _handleScrimClick;
    private _handleEscKey;
    render(): TemplateResult;
}
//# sourceMappingURL=yp-drawer.d.ts.map