import { PlausibleSourcesBase } from './pl-sources-base';
import '../../pl-link.js';
import '../../stats/pl-bar.js';
export declare class PlausibleSourcesUtm extends PlausibleSourcesBase {
    to: string | undefined;
    connectedCallback(): void;
    fetchReferrers(): void;
    renderReferrer(referrer: PlausibleReferrerData): import("lit-html").TemplateResult<1>;
    renderList(): import("lit-html").TemplateResult<1>;
    renderContent(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-sources-utm.d.ts.map