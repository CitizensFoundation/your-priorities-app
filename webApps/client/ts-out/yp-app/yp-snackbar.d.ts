import { TemplateResult } from "lit";
import { YpBaseElement } from "../common/yp-base-element";
export declare class YpSnackbar extends YpBaseElement {
    open: boolean;
    labelText: string;
    timeoutMs: number;
    static get styles(): any[];
    showSnackbar(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    closeSnackbar(): void;
    render(): TemplateResult<1>;
}
//# sourceMappingURL=yp-snackbar.d.ts.map