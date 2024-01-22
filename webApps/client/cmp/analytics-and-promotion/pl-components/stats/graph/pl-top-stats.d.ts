import { nothing } from 'lit';
import { PlausibleBaseElement } from '../../pl-base-element.js';
export declare class PlausibleTopStats extends PlausibleBaseElement {
    disabled: boolean;
    query: PlausibleQueryData;
    updateMetric: Function;
    history: any;
    classsName: string;
    to: PlausibleQueryData;
    metric: string;
    topStatData: PlausibleTopStatsData | undefined;
    static get styles(): import("lit").CSSResult[];
    renderComparison(name: string, comparison: number): import("lit-html").TemplateResult<1> | typeof nothing;
    topStatNumberShort(stat: PlausibleStatData): string | number;
    topStatTooltip(stat: PlausibleStatData): string | null;
    titleFor(stat: PlausibleStatData): string;
    renderStat(stat: PlausibleStatData): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>[] | undefined;
}
//# sourceMappingURL=pl-top-stats.d.ts.map