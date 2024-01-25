import { PlausibleBaseElement } from '../pl-base-element';
export declare class PlausibleBar extends PlausibleBaseElement {
    count: number;
    all: Array<Record<string, number>>;
    maxWidthDeduction: string;
    plot: string;
    bg: string | undefined;
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-bar.d.ts.map