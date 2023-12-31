import { PlausibleSourcesBase } from './pl-sources-base';
import '../../pl-link.js';
import '../../stats/pl-bar.js';
import '../../pl-fade-in.js';
export declare class PlausibleSourcesAll extends PlausibleSourcesBase {
    to: string | undefined;
    connectedCallback(): void;
    fetchReferrers(): void;
    static get styles(): import("lit").CSSResult[];
    renderReferrer(referrer: PlausibleReferrerData): import("lit-html").TemplateResult<1>;
    renderList(): import("lit-html").TemplateResult<1>;
    renderContent(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-sources-all.d.ts.map