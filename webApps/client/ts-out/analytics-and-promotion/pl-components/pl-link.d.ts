import { PlausibleBaseElement } from './pl-base-element';
export declare class PlausibleLink extends PlausibleBaseElement {
    to: string | undefined;
    static get styles(): import("lit").CSSResult[];
    get currentUri(): string;
    onClick(e: Event): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-link.d.ts.map